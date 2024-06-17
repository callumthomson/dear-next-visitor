import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2i from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as certificates from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const config = {
      domain: 'dearnextvisitor.com',
      openAiApiKeyParameterName: 'dnv.openai-key',
      // Imported because it's created in a different region (required by CloudFront)
      cloudFrontCertificateArn: `arn:aws:acm:us-east-1:${process.env.CDK_DEFAULT_ACCOUNT}:certificate/300dbc19-ec44-46da-9b68-da07b23ed5b9`,
      hostedZoneId: 'Z06681671VI0LTB04CUUM',
    } as const;

    const ddbTable = new ddb.TableV2(this, 'DynamoDbTable', {
      tableName: 'DNV',
      partitionKey: { name: 'PK', type: ddb.AttributeType.STRING },
      sortKey: { name: 'SK', type: ddb.AttributeType.STRING },
      billing: ddb.Billing.onDemand(),
      encryption: ddb.TableEncryptionV2.awsManagedKey(),
      globalSecondaryIndexes: [
        {
          indexName: 'GSI1',
          partitionKey: {
            name: 'GSI1PK',
            type: ddb.AttributeType.STRING,
          },
          sortKey: {
            name: 'GSI1SK',
            type: ddb.AttributeType.STRING,
          },
        },
      ],
    });

    const webBucket = new s3.Bucket(this, 'S3Bucket', {
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new s3deploy.BucketDeployment(this, 'S3Deployment', {
      sources: [s3deploy.Source.asset('../web/out')],
      destinationBucket: webBucket,
      prune: true,
    });

    // Imported because it's created by default when purchasing a domain.
    const domainZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      'DnsZone',
      {
        hostedZoneId: config.hostedZoneId,
        zoneName: config.domain,
      },
    );

    const cdn = new cloudfront.Distribution(this, 'WebDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(webBucket),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      additionalBehaviors: {
        '/_next/*': {
          origin: new cloudfront_origins.S3Origin(webBucket),
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
        },
      },
      domainNames: [`www.${config.domain}`, config.domain],
      certificate: certificates.Certificate.fromCertificateArn(
        this,
        'DomainCertificateForCloudFront',
        config.cloudFrontCertificateArn,
      ),
    });
    new route53.ARecord(this, 'ARecordRoot', {
      zone: domainZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(cdn),
      ),
    });
    new route53.ARecord(this, 'ARecordWww', {
      recordName: 'www',
      zone: domainZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(cdn),
      ),
    });

    const ssmOpenAiParameter = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      'SsmParamaterOpenAiToken',
      {
        parameterName: config.openAiApiKeyParameterName,
      },
    );

    const serverFunction = new NodejsFunction(this, 'LambdaServerFunction', {
      functionName: 'dnv-server-function',
      entry: path.resolve(__dirname, '../../server/src/index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        DYNAMODB_TABLE_NAME: ddbTable.tableName,
        POSTHOG_KEY: 'phc_S8wR0LhS6z30om4UBirN1wpOc5jyrBALur4Apdw8HJ5',
      },
    });
    serverFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    ddbTable.grantReadWriteData(serverFunction);
    ssmOpenAiParameter.grantRead(serverFunction);

    const certificate = new certificates.Certificate(
      this,
      'DomainCertificateForApiGw',
      {
        domainName: config.domain,
        subjectAlternativeNames: [`*.${config.domain}`],
        validation: certificates.CertificateValidation.fromDns(domainZone),
      },
    );

    const apiDomainName = new apigwv2.DomainName(this, 'ApiCustomDomain', {
      domainName: `api.${config.domain}`,
      certificate,
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
      domainMapping: {
        domainName: apiDomainName,
      },
    });
    new route53.ARecord(this, 'ARecordApi', {
      recordName: 'api',
      zone: domainZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.ApiGatewayv2DomainProperties(
          apiDomainName.regionalDomainName,
          apiDomainName.regionalHostedZoneId,
        ),
      ),
    });
  }
}
