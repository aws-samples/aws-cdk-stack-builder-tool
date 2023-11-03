import { TS_JSON_IDENT } from "./common";

export function createCdkJson(rootFileName: string) {
  /* prettier-ignore */
  const config = {
    app: `npx ts-node --prefer-ts-exts bin/${rootFileName}.ts`,
    watch: {
      include: ["**"],
      exclude: [
        "README.md",
        "cdk*.json",
        "**/*.d.ts",
        "**/*.js",
        "tsconfig.json",
        "package*.json",
        "yarn.lock",
        "node_modules",
        "test",
      ],
    },
    context: {
      "@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId": true,
      "@aws-cdk/core:stackRelativeExports": true,
      "@aws-cdk/aws-rds:lowercaseDbIdentifier": true,
      "@aws-cdk/aws-lambda:recognizeVersionProps": true,
      "@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021": true,
      "@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver": true,
      "@aws-cdk/aws-ec2:uniqueImdsv2TemplateName": true,
      "@aws-cdk/core:checkSecretUsage": true,
      "@aws-cdk/aws-iam:minimizePolicies": true,
      "@aws-cdk/core:target-partitions": ["aws", "aws-cn"],
    },
  };

  return JSON.stringify(config, null, TS_JSON_IDENT);
}
