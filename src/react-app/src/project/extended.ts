import { BlueprintExtend } from "./types/project-blueprint";
import { auroraPostgresClusterBlueprint } from "../blueprints/autora-postgresql-cluster";
import { blankBlueprint } from "../blueprints/cdk-blank";
import { ec2InstanceBlueprint } from "../blueprints/ec2-instance";
import { ecsClusterBlueprint } from "../blueprints/ecs-cluster";
import { eksClusterBlueprint } from "../blueprints/eks-cluster";
import { staticWebsiteBlueprint } from "../blueprints/static-website";
import { cdkSSMDocumentsBlueprint } from "../blueprints/cdk-ssm-documents";
import { generativeAIBlueprint } from "../blueprints/generative-ai";

export const blueprintExtended: {
  [key: string]: BlueprintExtend;
} = {
  "cdk-empty": {
    platform: "cdk",
    libs: {},
    containers: [],
    favorites: [],
    rules: {},
  },
  "cdktf-empty": {
    platform: "cdktf",
    libs: {},
    containers: [],
    favorites: [],
    rules: {},
  },
  "cdk8s-empty": {
    platform: "cdk8s",
    libs: {},
    containers: [],
    favorites: [],
    rules: {},
  },
  "cdk-base": {
    platform: "cdk",
    libs: {
      constructs: "latest",
      "aws-cdk-lib": "2.x",
    },
    containers: ["aws-cdk-lib.App", "aws-cdk-lib.Stack"],
    favorites: [],
    rules: {
      "aws-cdk-lib.App": {
        allow: ["aws-cdk-lib.Stack"],
        deny: ["*"],
      },
      "aws-cdk-lib.NestedStack": {
        deny: ["aws-cdk-lib.Stack"],
      },
      "*": {
        deny: ["aws-cdk-lib.Stack"],
      },
    },
  },
  "cdktf-base": {
    libs: { constructs: "latest", cdktf: "0.x" },
    platform: "cdktf",
    containers: ["cdktf.App", "cdktf.TerraformStack"],
    favorites: ["cdktf.TerraformStack"],
    rules: {
      "cdktf.App": {
        allow: ["cdktf.TerraformStack"],
        deny: ["*"],
      },
      "*": {
        deny: ["cdktf.TerraformStack"],
      },
    },
  },
  "cdk8s-base": {
    platform: "cdk8s",
    libs: { constructs: "latest", cdk8s: "2.x" },
    containers: ["cdk8s.App", "cdk8s.Chart"],
    favorites: ["cdk8s.Chart"],
    rules: {
      "cdk8s.App": {
        allow: ["cdk8s.Chart"],
        deny: ["*"],
      },
      "*": {
        deny: ["cdk8s.Chart"],
      },
    },
  },
};

export const projectBlueprints = [
  blankBlueprint,
  ec2InstanceBlueprint,
  generativeAIBlueprint,
  staticWebsiteBlueprint,
  auroraPostgresClusterBlueprint,
  ecsClusterBlueprint,
  eksClusterBlueprint,
  cdkSSMDocumentsBlueprint,
];
