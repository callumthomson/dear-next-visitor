import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as cfnAmplify from "aws-cdk-lib/aws-amplify";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ddbTable = new ddb.TableV2(this, "DynamoDbTable", {
      tableName: "dnv",
      partitionKey: { name: "pk", type: ddb.AttributeType.STRING },
      sortKey: { name: "sk", type: ddb.AttributeType.STRING },
      billing: ddb.Billing.onDemand(),
      encryption: ddb.TableEncryptionV2.awsManagedKey(),
      globalSecondaryIndexes: [
        {
          indexName: "gsi1",
          partitionKey: {
            name: "gsi1pk",
            type: ddb.AttributeType.STRING,
          },
          sortKey: {
            name: "gsi1sk",
            type: ddb.AttributeType.STRING,
          },
        },
      ],
    });

    const app = new amplify.App(this, "AmplifyApp", {
      appName: "dear-next-visitor2",
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "callumthomson",
        repository: "dear-next-visitor",
        oauthToken: cdk.SecretValue.unsafePlainText(
          "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",
        ),
      }),
      basicAuth: amplify.BasicAuth.fromCredentials(
        "callum",
        cdk.SecretValue.unsafePlainText("dear-next-visitor"),
      ),
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: 'apps/web',
        DYNAMODB_TABLE_NAME: ddbTable.tableName,
      },
      platform: amplify.Platform.WEB_COMPUTE,
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: 1,
        applications: [
          {
            frontend: {
              phases: {
                preBuild: {
                  commands: ["npx npm install"],
                },
                build: {
                  commands: [
                    "echo \"DYNAMODB_TABLE_NAME=$DYNAMODB_TABLE_NAME\" >> apps/web/.env",
                    "npx turbo run build --filter=web"
                  ],
                },
              },
              artifacts: {
                baseDirectory: "apps/web/.next",
                files: ["**/*"],
              },
              cache: {
                paths: [".next/cache/**/*", "node_modules/**/*"],
              },
              buildPath: "/",
            },
            appRoot: "apps/web",
          },
        ],
      }),
    });
    const main = app.addBranch("main", {
      stage: 'PRODUCTION',
    });
    const cfnBranch = main.node.defaultChild as cfnAmplify.CfnBranch;
    cfnBranch.framework = 'Next.js - SSR';
    ddbTable.grantFullAccess(app);
  }
}
