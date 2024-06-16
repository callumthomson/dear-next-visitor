import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

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

    const bucket = new s3.Bucket(this, "S3Bucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new s3deploy.BucketDeployment(this, "S3Deployment", {
      sources: [s3deploy.Source.asset("../web/out")],
      destinationBucket: bucket,
      prune: true,
    });
  }
}
