import { ProjectBlueprint } from "../project/types/project-blueprint";
import { Utils } from "../utils";
import { ValueKind } from "../project/types/values";

export const ecsClusterBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdk-base",
  id: "5759ab9d-1dc4-41c3-92f1-7f8265376c81",
  name: "Amazon ECS Cluster",
  description: "Amazon Elastic Container Service cluster",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTEgNGEyIDIgMCAxMTQgMHYxYTEgMSAwIDAwMSAxaDNhMSAxIDAgMDExIDF2M2ExIDEgMCAwMS0xIDFoLTFhMiAyIDAgMTAwIDRoMWExIDEgMCAwMTEgMXYzYTEgMSAwIDAxLTEgMWgtM2ExIDEgMCAwMS0xLTF2LTFhMiAyIDAgMTAtNCAwdjFhMSAxIDAgMDEtMSAxSDdhMSAxIDAgMDEtMS0xdi0zYTEgMSAwIDAwLTEtMUg0YTIgMiAwIDExMC00aDFhMSAxIDAgMDAxLTFWN2ExIDEgMCAwMTEtMWgzYTEgMSAwIDAwMS0xVjR6Ij48L3BhdGg+PC9zdmc+",
  background: "#6365f1",
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
        valueName: "EcsClusterStack",
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
            valueId: "0167025762929777410028",
            valueName: "EcsCluster",
            valueType: {
              fqn: "aws-cdk-lib.aws_ecs.Cluster",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670257656116802810030",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ecs.ClusterProps",
                },
                properties: {
                  vpc: {
                    kind: ValueKind.Ref,
                    valueId: "01670257656116132410029",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.Vpc",
                    },
                    refValueId: "01670257444882857410016",
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Call,
            valueId: "01670262832833101810014",
            valueType: {
              fqn: "aws-cdk-lib.aws_autoscaling.AutoScalingGroup",
            },
            methodOfId: "0167025762929777410028",
            methodOfType: {
              fqn: "aws-cdk-lib.aws_ecs.Cluster",
            },
            methodPath: [],
            method: "addCapacity",
            parameters: {
              id: {
                kind: ValueKind.Primitive,
                valueId: "01670262855112220610015",
                valueType: {
                  primitive: "string",
                },
                value: "DefaultAutoScalingGroupCapacity",
              },
              options: {
                kind: ValueKind.Object,
                valueId: "01670262869450809510016",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ecs.AddCapacityOptions",
                },
                properties: {
                  instanceType: {
                    kind: ValueKind.Call,
                    valueId: "0167026287293472710017",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.InstanceType",
                    },
                    methodOfType: {
                      fqn: "aws-cdk-lib.aws_ec2.InstanceType",
                    },
                    methodPath: [],
                    method: "of",
                    parameters: {
                      instanceClass: {
                        kind: ValueKind.Member,
                        valueId: "01670262884570885310018",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_ec2.InstanceClass",
                        },
                        member: "T3A",
                      },
                      instanceSize: {
                        kind: ValueKind.Member,
                        valueId: "01670262886879250310019",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_ec2.InstanceSize",
                        },
                        member: "MEDIUM",
                      },
                    },
                  },
                  desiredCapacity: {
                    kind: ValueKind.Primitive,
                    valueId: "01670262901346376610020",
                    valueType: {
                      primitive: "number",
                    },
                    value: 3,
                  },
                },
              },
            },
            valueName: "AutoScalingGroup",
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670262924408205610022",
            valueName: "Ec2TaskDefinition",
            valueType: {
              fqn: "aws-cdk-lib.aws_ecs.Ec2TaskDefinition",
            },
            children: [],
            parameters: {},
          },
          {
            kind: ValueKind.Call,
            valueId: "01670262933687755310023",
            valueType: {
              fqn: "aws-cdk-lib.aws_ecs.ContainerDefinition",
            },
            methodOfId: "01670262924408205610022",
            methodOfType: {
              fqn: "aws-cdk-lib.aws_ecs.Ec2TaskDefinition",
            },
            methodPath: [],
            method: "addContainer",
            parameters: {
              id: {
                kind: ValueKind.Primitive,
                valueId: "01670262954383108910024",
                valueType: {
                  primitive: "string",
                },
                value: "DefaultContainer",
              },
              props: {
                kind: ValueKind.Object,
                valueId: "01670263058521492010035",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ecs.ContainerDefinitionOptions",
                },
                properties: {
                  image: {
                    kind: ValueKind.Call,
                    valueId: "01670263063637776210036",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ecs.RepositoryImage",
                    },
                    methodOfType: {
                      fqn: "aws-cdk-lib.aws_ecs.ContainerImage",
                    },
                    methodPath: [],
                    method: "fromRegistry",
                    parameters: {
                      name: {
                        kind: ValueKind.Primitive,
                        valueId: "01670263071118445810037",
                        valueType: {
                          primitive: "string",
                        },
                        value: "amazon/amazon-ecs-sample",
                      },
                    },
                  },
                  memoryLimitMiB: {
                    kind: ValueKind.Primitive,
                    valueId: "01670263092777569510038",
                    valueType: {
                      primitive: "number",
                    },
                    value: 512,
                  },
                },
              },
            },
            valueName: "DefaultContainer",
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670263028084253010031",
            valueName: "Ec2Service",
            valueType: {
              fqn: "aws-cdk-lib.aws_ecs.Ec2Service",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670263032090773710033",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ecs.Ec2ServiceProps",
                },
                properties: {
                  cluster: {
                    kind: ValueKind.Ref,
                    valueId: "01670263032089920110032",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ecs.Cluster",
                    },
                    refValueId: "0167025762929777410028",
                  },
                  taskDefinition: {
                    kind: ValueKind.Ref,
                    valueId: "01670263033615708710034",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ecs.Ec2TaskDefinition",
                    },
                    refValueId: "01670262924408205610022",
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
