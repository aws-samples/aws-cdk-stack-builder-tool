import { ProjectBlueprint } from "../project/types/project-blueprint";
import { Utils } from "../utils";
import { ValueKind } from "../project/types/values";

export const generativeAIBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdk-base",
  id: "6d46e8ec-782b-4c00-8301-2f5c4e65ad48",
  name: "Generative AI",
  description: "AWS Generative AI CDK Constructs",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+CiAgPHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMjAuMjUgOC41MTFjLjg4NC4yODQgMS41IDEuMTI4IDEuNSAyLjA5N3Y0LjI4NmMwIDEuMTM2LS44NDcgMi4xLTEuOTggMi4xOTMtLjM0LjAyNy0uNjguMDUyLTEuMDIuMDcydjMuMDkxbC0zLTNjLTEuMzU0IDAtMi42OTQtLjA1NS00LjAyLS4xNjNhMi4xMTUgMi4xMTUgMCAwMS0uODI1LS4yNDJtOS4zNDUtOC4zMzRhMi4xMjYgMi4xMjYgMCAwMC0uNDc2LS4wOTUgNDguNjQgNDguNjQgMCAwMC04LjA0OCAwYy0xLjEzMS4wOTQtMS45NzYgMS4wNTctMS45NzYgMi4xOTJ2NC4yODZjMCAuODM3LjQ2IDEuNTggMS4xNTUgMS45NTFtOS4zNDUtOC4zMzRWNi42MzdjMC0xLjYyMS0xLjE1Mi0zLjAyNi0yLjc2LTMuMjM1QTQ4LjQ1NSA0OC40NTUgMCAwMDExLjI1IDNjLTIuMTE1IDAtNC4xOTguMTM3LTYuMjQuNDAyLTEuNjA4LjIwOS0yLjc2IDEuNjE0LTIuNzYgMy4yMzV2Ni4yMjZjMCAxLjYyMSAxLjE1MiAzLjAyNiAyLjc2IDMuMjM1LjU3Ny4wNzUgMS4xNTcuMTQgMS43NC4xOTRWMjFsNC4xNTUtNC4xNTUiIC8+Cjwvc3ZnPg==",
  background: "#3b83f6",
  favorites: [
    "@cdklabs/generative-ai-cdk-constructs.JumpStartSageMakerEndpoint",
    "@cdklabs/generative-ai-cdk-constructs.HuggingFaceSageMakerEndpoint",
    "@cdklabs/generative-ai-cdk-constructs.SummarizationAppsyncStepfn",
    "@cdklabs/generative-ai-cdk-constructs.RagAppsyncStepfnOpensearch",
    "@cdklabs/generative-ai-cdk-constructs.QaAppsyncOpensearch",
    "aws-cdk-lib.Stack",
    "aws-cdk-lib.NestedStack",
    "aws-cdk-lib.aws_s3.Bucket",
  ],
  libs: {
    "@cdklabs/generative-ai-cdk-constructs": "0.x",
    "@aws-cdk/aws-amplify-alpha": "2.x",
    "@aws-cdk/aws-apigatewayv2-alpha": "2.x",
    "@aws-cdk/aws-apigatewayv2-authorizers-alpha": "2.x",
    "@aws-cdk/aws-apigatewayv2-integrations-alpha": "2.x",
    "@aws-cdk/aws-apprunner-alpha": "2.x",
    "@aws-cdk/aws-appsync-alpha": "2.x",
    "@aws-cdk/aws-batch-alpha": "2.x",
    "@aws-cdk/aws-cognito-identitypool-alpha": "2.x",
    "@aws-cdk/aws-glue-alpha": "2.x",
    "@aws-cdk/aws-ivs-alpha": "2.x",
    "@aws-cdk/aws-kinesisanalytics-flink-alpha": "2.x",
    "@aws-cdk/aws-kinesisfirehose-alpha": "2.x",
    "@aws-cdk/aws-kinesisfirehose-destinations-alpha": "2.x",
    "@aws-cdk/aws-lambda-go-alpha": "2.x",
    "@aws-cdk/aws-lambda-python-alpha": "2.x",
    "@aws-cdk/aws-route53resolver-alpha": "2.x",
    "@aws-cdk/aws-s3objectlambda-alpha": "2.x",
    "@aws-cdk/aws-sagemaker-alpha": "2.x",
    "@aws-cdk/aws-servicecatalogappregistry-alpha": "2.x",
    "@aws-cdk/aws-synthetics-alpha": "2.x",
    "@aws-cdk/cloud-assembly-schema": "2.x",
  },
  root: {
    kind: ValueKind.Instance,
    valueId: Utils.generateId(),
    valueName: "App",
    valueType: {
      fqn: "aws-cdk-lib.App",
    },
    parameters: {},
    children: [
      {
        kind: ValueKind.Instance,
        valueId: Utils.generateId(),
        valueName: "GenerativeAIStack",
        valueType: {
          fqn: "aws-cdk-lib.Stack",
        },
        children: [],
        parameters: {},
      },
    ],
  },
};
