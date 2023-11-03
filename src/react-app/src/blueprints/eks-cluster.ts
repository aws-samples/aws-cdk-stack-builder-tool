import { ProjectBlueprint } from "../project/types/project-blueprint";
import { Utils } from "../utils";
import { ValueKind } from "../project/types/values";

export const eksClusterBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdk-base",
  id: "596658a4-3d38-49bd-b189-301fea287fda",
  name: "Amazon EKS Cluster",
  description: "Amazon Elastic Kubernetes Service cluster",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMjAgN2wtOC00LTggNG0xNiAwbC04IDRtOC00djEwbC04IDRtMC0xMEw0IDdtOCA0djEwTTQgN3YxMGw4IDQiPjwvcGF0aD48L3N2Zz4=",
  background: "#a955f7",
  favorites: [
    "aws-cdk-lib.Stack",
    "aws-cdk-lib.NestedStack",
    "aws-cdk-lib.aws_s3.Bucket",
  ],
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
        valueName: "EksClusterStack",
        valueType: {
          fqn: "aws-cdk-lib.Stack",
        },
        children: [
          {
            kind: ValueKind.Instance,
            valueId: "01670257444882857410016",
            valueName: "VPC",
            valueType: {
              fqn: "aws-cdk-lib.aws_ec2.Vpc",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670257671819247510032",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ec2.VpcProps",
                },
                properties: {
                  maxAzs: {
                    kind: ValueKind.Primitive,
                    valueId: "01670257671819287610031",
                    valueType: {
                      primitive: "number",
                    },
                    value: 2,
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670263580390363310045",
            valueName: "EksCluster",
            valueType: {
              fqn: "aws-cdk-lib.aws_eks.Cluster",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "0167026358673883610047",
                valueType: {
                  fqn: "aws-cdk-lib.aws_eks.ClusterProps",
                },
                properties: {
                  version: {
                    kind: ValueKind.Property,
                    valueId: "0167026358673839110046",
                    propertyOfType: {
                      fqn: "aws-cdk-lib.aws_eks.KubernetesVersion",
                    },
                    valueType: {
                      fqn: "aws-cdk-lib.aws_eks.KubernetesVersion",
                    },
                    property: "V1_27",
                  },
                  vpc: {
                    kind: ValueKind.Ref,
                    valueId: "01670263606062950310048",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.Vpc",
                    },
                    refValueId: "01670257444882857410016",
                  },
                  vpcSubnets: {
                    kind: ValueKind.Array,
                    valueId: "01670263619552591410049",
                    valueType: {
                      collection: {
                        elementtype: {
                          fqn: "aws-cdk-lib.aws_ec2.SubnetSelection",
                        },
                        kind: ValueKind.Array,
                      },
                    },
                    items: [
                      {
                        kind: ValueKind.Object,
                        valueId: "01670263619680460010051",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_ec2.SubnetSelection",
                        },
                        properties: {
                          subnetType: {
                            kind: ValueKind.Member,
                            valueId: "01670263635573362710053",
                            valueType: {
                              fqn: "aws-cdk-lib.aws_ec2.SubnetType",
                            },
                            member: "PRIVATE_WITH_EGRESS",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
        parameters: {},
      },
    ],
  },
};
