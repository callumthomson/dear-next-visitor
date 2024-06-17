import * as cdk from "aws-cdk-lib";
import * as path from 'path';
import { Construct } from "constructs";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2i from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ddbTable = new ddb.TableV2(this, "DynamoDbTable", {
      tableName: "DNV",
      partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
      sortKey: { name: "SK", type: ddb.AttributeType.STRING },
      billing: ddb.Billing.onDemand(),
      encryption: ddb.TableEncryptionV2.awsManagedKey(),
      globalSecondaryIndexes: [
        {
          indexName: "GSI1",
          partitionKey: {
            name: "GSI1PK",
            type: ddb.AttributeType.STRING,
          },
          sortKey: {
            name: "GSI1SK",
            type: ddb.AttributeType.STRING,
          },
        },
      ],
    });

    const webBucket = new s3.Bucket(this, "S3Bucket", {
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new s3deploy.BucketDeployment(this, "S3Deployment", {
      sources: [s3deploy.Source.asset("../web/out")],
      destinationBucket: webBucket,
      prune: true,
    });

    const cdn = new cloudfront.Distribution(this, 'WebDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(webBucket),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      }
    });

    const serverFunction = new NodejsFunction(
      this,
      "LambdaServerFunction",
      {
        functionName: "dnv-server-function",
        entry: path.resolve(__dirname, '../../server/src/index.ts'),
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_20_X,
        environment: {
          APP_ORIGIN: `https://${cdn.domainName}`,
          DYNAMODB_TABLE_NAME: ddbTable.tableName,
        },
      },
    );
    serverFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    const api = new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: 'dnv-http-api',
      defaultIntegration: new apigwv2i.HttpLambdaIntegration(
        'LambdaIntegration',
        serverFunction,
      ),
      createDefaultStage: false,
    });
    api.addStage('DefaultStage', {
      stageName: '$default',
      autoDeploy: true,
      throttle: {
        burstLimit: 5,
        rateLimit: 5,
      },
    });
    ddbTable.grantReadWriteData(serverFunction);
  }
}
