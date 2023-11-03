import { ProjectBlueprint } from "../project/types/project-blueprint";
import { Utils } from "../utils";
import { ValueKind } from "../project/types/values";

export const ec2InstanceBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdk-base",
  id: "4b3ac114-f416-4773-af8d-3bc39e305022",
  name: "Amazon EC2 Instance",
  description: "Amazon EC2 Instacne in VPC (Virtual Private Cloud)",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNSAxMmgxNE01IDEyYTIgMiAwIDAxLTItMlY2YTIgMiAwIDAxMi0yaDE0YTIgMiAwIDAxMiAydjRhMiAyIDAgMDEtMiAyTTUgMTJhMiAyIDAgMDAtMiAydjRhMiAyIDAgMDAyIDJoMTRhMiAyIDAgMDAyLTJ2LTRhMiAyIDAgMDAtMi0ybS0yLTRoLjAxTTE3IDE2aC4wMSI+PC9wYXRoPjwvc3ZnPg==",
  background: "#eab208",
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
        valueName: "Ec2CdkStack",
        valueType: {
          fqn: "aws-cdk-lib.Stack",
        },
        children: [
          {
            kind: ValueKind.Instance,
            valueId: "01670248356581847110018",
            valueName: "VPC",
            valueType: {
              fqn: "aws-cdk-lib.aws_ec2.Vpc",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670248375592291910020",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ec2.VpcProps",
                },
                properties: {
                  natGateways: {
                    kind: ValueKind.Primitive,
                    valueId: "01670248375592520710019",
                    valueType: {
                      primitive: "number",
                    },
                    value: 0,
                  },
                  subnetConfiguration: {
                    kind: ValueKind.Array,
                    valueId: "01670248383472607310021",
                    valueType: {
                      collection: {
                        elementtype: {
                          fqn: "aws-cdk-lib.aws_ec2.SubnetConfiguration",
                        },
                        kind: ValueKind.Array,
                      },
                    },
                    items: [
                      {
                        kind: ValueKind.Object,
                        valueId: "01670248383613572310023",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_ec2.SubnetConfiguration",
                        },
                        properties: {
                          name: {
                            kind: ValueKind.Primitive,
                            valueId: "01670248395783441510025",
                            valueType: {
                              primitive: "string",
                            },
                            value: "asterisk",
                          },
                          subnetType: {
                            kind: ValueKind.Member,
                            valueId: "0167024840014282310026",
                            valueType: {
                              fqn: "aws-cdk-lib.aws_ec2.SubnetType",
                            },
                            member: "PUBLIC",
                          },
                          cidrMask: {
                            kind: ValueKind.Primitive,
                            valueId: "01670248408161601710027",
                            valueType: {
                              primitive: "number",
                            },
                            value: 24,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670249150826380410035",
            valueName: "Instance",
            valueType: {
              fqn: "aws-cdk-lib.aws_ec2.Instance",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670249165570535110037",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ec2.InstanceProps",
                },
                properties: {
                  vpc: {
                    kind: ValueKind.Ref,
                    valueId: "01670249165570990310036",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.Vpc",
                    },
                    refValueId: "01670248356581847110018",
                  },
                  instanceType: {
                    kind: ValueKind.Call,
                    valueId: "01670249186676116710038",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.InstanceType",
                    },
                    methodOfType: {
                      fqn: "aws-cdk-lib.aws_ec2.InstanceType",
                    },
                    methodPath: [],
                    method: "of",
                    parameters: {
                      instanceSize: {
                        kind: ValueKind.Member,
                        valueId: "01670249318012773210039",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_ec2.InstanceSize",
                        },
                        member: "MICRO",
                      },
                      instanceClass: {
                        kind: ValueKind.Member,
                        valueId: "01670251349250997410017",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_ec2.InstanceClass",
                        },
                        member: "T4G",
                      },
                    },
                  },
                  machineImage: {
                    kind: ValueKind.Instance,
                    valueId: "01670251388627448910018",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.AmazonLinuxImage",
                    },
                    children: [],
                    parameters: {
                      props: {
                        kind: ValueKind.Object,
                        valueId: "01670251399457788410020",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_ec2.AmazonLinuxImageProps",
                        },
                        properties: {
                          cpuType: {
                            kind: ValueKind.Member,
                            valueId: "01670251399456135810019",
                            valueType: {
                              fqn: "aws-cdk-lib.aws_ec2.AmazonLinuxCpuType",
                            },
                            member: "ARM_64",
                          },
                          generation: {
                            kind: ValueKind.Member,
                            valueId: "01670251407919273210021",
                            valueType: {
                              fqn: "aws-cdk-lib.aws_ec2.AmazonLinuxGeneration",
                            },
                            member: "AMAZON_LINUX_2023",
                          },
                        },
                      },
                    },
                  },
                  securityGroup: {
                    kind: ValueKind.Ref,
                    valueId: "01670251439144804810022",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.SecurityGroup",
                    },
                    refValueId: "01670248442695625210029",
                  },
                  role: {
                    kind: ValueKind.Ref,
                    valueId: "01670251463147933010023",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_iam.Role",
                    },
                    refValueId: "01670248924532865210025",
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670248442695625210029",
            valueName: "SecurityGroup",
            valueType: {
              fqn: "aws-cdk-lib.aws_ec2.SecurityGroup",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670248454505449910031",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ec2.SecurityGroupProps",
                },
                properties: {
                  vpc: {
                    kind: ValueKind.Ref,
                    valueId: "01670248454505511410030",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_ec2.Vpc",
                    },
                    refValueId: "01670248356581847110018",
                  },
                  description: {
                    kind: ValueKind.Primitive,
                    valueId: "01670248466605412810032",
                    valueType: {
                      primitive: "string",
                    },
                    value: "Allow SSH (TCP port 22) in",
                  },
                  allowAllOutbound: {
                    kind: ValueKind.Primitive,
                    valueId: "01670248474491251110033",
                    valueType: {
                      primitive: "boolean",
                    },
                    value: true,
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Call,
            valueId: "01670248684406604310017",
            valueType: {
              fqn: "void",
            },
            methodOfId: "01670248442695625210029",
            methodOfType: {
              fqn: "aws-cdk-lib.aws_ec2.SecurityGroup",
            },
            methodPath: [],
            method: "addIngressRule",
            parameters: {
              peer: {
                kind: ValueKind.Ref,
                valueId: "01670248724630691310018",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ec2.IPeer",
                },
                refValueId: "01670248724633244310020",
              },
              connection: {
                kind: ValueKind.Call,
                valueId: "01670248741349220110021",
                valueType: {
                  fqn: "aws-cdk-lib.aws_ec2.Port",
                },
                methodOfType: {
                  fqn: "aws-cdk-lib.aws_ec2.Port",
                },
                methodPath: [],
                method: "tcp",
                parameters: {
                  port: {
                    kind: ValueKind.Primitive,
                    valueId: "01670248744441869010022",
                    valueType: {
                      primitive: "number",
                    },
                    value: 22,
                  },
                },
              },
              description: {
                kind: ValueKind.Primitive,
                valueId: "01670248833962278610023",
                valueType: {
                  primitive: "string",
                },
                value: "Allow SSH Access",
              },
            },
            valueName: "AddIngressRule",
          },
          {
            kind: ValueKind.Call,
            valueId: "01670248724633244310020",
            valueName: "peer",
            valueType: {
              fqn: "aws-cdk-lib.aws_ec2.IPeer",
            },
            methodOfType: {
              fqn: "aws-cdk-lib.aws_ec2.Peer",
            },
            methodPath: [],
            method: "anyIpv4",
            parameters: {},
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670248924532865210025",
            valueName: "InstanceRole",
            valueType: {
              fqn: "aws-cdk-lib.aws_iam.Role",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "016702489471367910027",
                valueType: {
                  fqn: "aws-cdk-lib.aws_iam.RoleProps",
                },
                properties: {
                  assumedBy: {
                    kind: ValueKind.Instance,
                    valueId: "01670248947135781410026",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_iam.ServicePrincipal",
                    },
                    children: [],
                    parameters: {
                      service: {
                        kind: ValueKind.Primitive,
                        valueId: "01670248949304358210028",
                        valueType: {
                          primitive: "string",
                        },
                        value: "ec2.amazonaws.com",
                      },
                    },
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Call,
            valueId: "01670248984167658310029",
            valueType: {
              fqn: "void",
            },
            methodOfId: "01670248924532865210025",
            methodOfType: {
              fqn: "aws-cdk-lib.aws_iam.Role",
            },
            methodPath: [],
            method: "addManagedPolicy",
            parameters: {
              policy: {
                kind: ValueKind.Ref,
                valueId: "016702527678908510017",
                valueType: {
                  fqn: "aws-cdk-lib.aws_iam.IManagedPolicy",
                },
                refValueId: "0167025276789392210019",
              },
            },
            valueName: "AddManagedPolicy",
          },
          {
            kind: ValueKind.Call,
            valueId: "0167025276789392210019",
            valueName: "ManagedPolicy",
            valueType: {
              fqn: "aws-cdk-lib.aws_iam.IManagedPolicy",
            },
            methodOfType: {
              fqn: "aws-cdk-lib.aws_iam.ManagedPolicy",
            },
            methodPath: [],
            method: "fromAwsManagedPolicyName",
            parameters: {
              managedPolicyName: {
                kind: ValueKind.Primitive,
                valueId: "0167025277740221010020",
                valueType: {
                  primitive: "string",
                },
                value: "AmazonSSMManagedInstanceCore",
              },
            },
          },
        ],
        parameters: {},
      },
    ],
  },
};
