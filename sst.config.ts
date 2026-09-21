/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "dnv",
      removal: input?.stage === "prd" ? "retain" : "remove",
      protect: ["prd"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          defaultTags: {
            tags: {
              Project: 'dnv',
              Environment: 'prd',
              IaC: 'sst',
            }
          },
          region: "us-east-2",
        },
      },
    };
  },
  async run() {
    const libSqlUrl = new sst.Secret('LIBSQL_DB_URL');
    const libSqlToken = new sst.Secret('LIBSQL_DB_TOKEN');
    const openaiApiKey = new sst.Secret('OPENAI_API_KEY');

    const lambdaSecurityGroup = new aws.ec2.SecurityGroup("DnvLambdaSecurityGroup", {
      vpcId: "vpc-0ef289a9cb971e18f",
      description: "Security group for DNV Lambda",
      egress: [
        {
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      tags: {
        Name: "dnv-prd-lambda",
      },
    });

    new sst.aws.TanStackStart("DnvWeb", {
      vpc: {
        privateSubnets: [
          "subnet-0fdbd371250326982",
          "subnet-0566f6615197e2645",
          "subnet-009f290d5e7de7321",
        ],
        securityGroups: [
          lambdaSecurityGroup.id,
        ],
      },
      // domain: {
      //   name: "www.countcap.co",
      //   redirects: ["countcap.co"],
      // },
      link: [
        libSqlUrl,
        libSqlToken,
        openaiApiKey
      ]
    });
  },
});
