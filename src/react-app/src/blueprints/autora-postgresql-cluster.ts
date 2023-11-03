import { ProjectBlueprint } from "../project/types/project-blueprint";
import { Utils } from "../utils";
import { ValueKind } from "../project/types/values";

export const auroraPostgresClusterBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdk-base",
  id: "50cc997a-b8b0-4fe8-ba62-4f8239775a60",
  name: "Amazon Aurora PostgreSQL Cluster",
  description: "Amazon Aurora Serverless cluster with PostgreSQL",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNCA3djEwYzAgMi4yMSAzLjU4MiA0IDggNHM4LTEuNzkgOC00VjdNNCA3YzAgMi4yMSAzLjU4MiA0IDggNHM4LTEuNzkgOC00TTQgN2MwLTIuMjEgMy41ODItNCA4LTRzOCAxLjc5IDggNG0wIDVjMCAyLjIxLTMuNTgyIDQtOCA0cy04LTEuNzktOC00Ij48L3BhdGg+PC9zdmc+",
  background: "#22c55e",
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
        valueName: "AuroraServerlessStack",
        valueType: {
          fqn: "aws-cdk-lib.Stack",
        },
        children: [
          {
            kind: ValueKind.Instance,
            valueId: "01670264225201706310016",
            valueName: "VPC",
            valueType: {
              fqn: "aws-cdk-lib.aws_ec2.Vpc",
            },
            children: [],
            parameters: {},
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670264220901976810014",
            valueName: "PostgresCluster",
            valueType: {
              fqn: "aws-cdk-lib.aws_rds.ServerlessCluster",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670264235670531210018",
                valueType: {
                  fqn: "aws-cdk-lib.aws_rds.ServerlessClusterProps",
                },
                properties: {
                  engine: {
                    kind: ValueKind.Property,
                    valueId: "01670264235670185810017",
                    propertyOfType: {
                      fqn: "aws-cdk-lib.aws_rds.DatabaseClusterEngine",
                    },
                    valueType: {
                      fqn: "aws-cdk-lib.aws_rds.DatabaseClusterEngine",
                    },
                    property: "AURORA_POSTGRESQL",
                  },
                  parameterGroup: {
                    kind: ValueKind.Ref,
                    valueId: "01670264282911878910019",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_rds.IParameterGroup",
                    },
                    refValueId: "01670264282914598910021",
                  },
                  vpc: {
                    kind: ValueKind.Ref,
                    valueId: "01670264304750875410023",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.Vpc",
                    },
                    refValueId: "01670264225201706310016",
                  },
                  scaling: {
                    kind: ValueKind.Object,
                    valueId: "01670264318300400910024",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_rds.ServerlessScalingOptions",
                    },
                    properties: {
                      autoPause: {
                        kind: ValueKind.Call,
                        valueId: "01670264329260815410025",
                        valueType: {
                          fqn: "aws-cdk-lib.Duration",
                        },
                        methodOfType: {
                          fqn: "aws-cdk-lib.Duration",
                        },
                        methodPath: [],
                        method: "minutes",
                        parameters: {
                          amount: {
                            kind: ValueKind.Primitive,
                            valueId: "01670264331713962910026",
                            valueType: {
                              primitive: "number",
                            },
                            value: 10,
                          },
                        },
                      },
                      maxCapacity: {
                        kind: ValueKind.Member,
                        valueId: "01670264349583394310027",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_rds.AuroraCapacityUnit",
                        },
                        member: "ACU_4",
                      },
                      minCapacity: {
                        kind: ValueKind.Member,
                        valueId: "0167026436752051110028",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_rds.AuroraCapacityUnit",
                        },
                        member: "ACU_2",
                      },
                    },
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Call,
            valueId: "01670264282914598910021",
            valueName: "ParameterGroup",
            valueType: {
              fqn: "aws-cdk-lib.aws_rds.IParameterGroup",
            },
            methodOfType: {
              fqn: "aws-cdk-lib.aws_rds.ParameterGroup",
            },
            methodPath: [],
            method: "fromParameterGroupName",
            parameters: {
              parameterGroupName: {
                kind: ValueKind.Primitive,
                valueId: "01670264291838800610022",
                valueType: {
                  primitive: "string",
                },
                value: "default.aurora-postgresql10",
              },
            },
          },
        ],
        parameters: {},
      },
    ],
  },
};
