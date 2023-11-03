import { ProjectBlueprint } from "../project/types/project-blueprint";
import { Utils } from "../utils";
import { ValueKind } from "../project/types/values";

export const staticWebsiteBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdk-base",
  id: "9a371591-9262-4883-8977-00d41890ce55",
  name: "Static Website",
  description: "Static AWS S3 website with Amazon CloudFront CDN",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMy4wNTUgMTFINWEyIDIgMCAwMTIgMnYxYTIgMiAwIDAwMiAyIDIgMiAwIDAxMiAydjIuOTQ1TTggMy45MzVWNS41QTIuNSAyLjUgMCAwMDEwLjUgOGguNWEyIDIgMCAwMTIgMiAyIDIgMCAxMDQgMCAyIDIgMCAwMTItMmgxLjA2NE0xNSAyMC40ODhWMThhMiAyIDAgMDEyLTJoMy4wNjRNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6Ij48L3BhdGg+PC9zdmc+",
  background: "#3b83f6",
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
        valueName: "StaticSiteStack",
        valueType: {
          fqn: "aws-cdk-lib.Stack",
        },
        children: [
          {
            kind: ValueKind.Instance,
            valueId: "01670254758485325410022",
            valueName: "Distribution",
            valueType: {
              fqn: "aws-cdk-lib.aws_cloudfront.Distribution",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670254761255897310024",
                valueType: {
                  fqn: "aws-cdk-lib.aws_cloudfront.DistributionProps",
                },
                properties: {
                  defaultBehavior: {
                    kind: ValueKind.Object,
                    valueId: "01670254761255333610023",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_cloudfront.BehaviorOptions",
                    },
                    properties: {
                      origin: {
                        kind: ValueKind.Instance,
                        valueId: "01670254765070429610025",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_cloudfront_origins.S3Origin",
                        },
                        children: [],
                        parameters: {
                          bucket: {
                            kind: ValueKind.Ref,
                            valueId: "01670254767181267410026",
                            valueType: {
                              fqn: "aws-cdk-lib.aws_s3.Bucket",
                            },
                            refValueId: "01670254635143891710017",
                          },
                        },
                      },
                      allowedMethods: {
                        kind: ValueKind.Property,
                        valueId: "01670254960775558910039",
                        propertyOfType: {
                          fqn: "aws-cdk-lib.aws_cloudfront.AllowedMethods",
                        },
                        valueType: {
                          fqn: "aws-cdk-lib.aws_cloudfront.AllowedMethods",
                        },
                        property: "ALLOW_GET_HEAD_OPTIONS",
                      },
                      compress: {
                        kind: ValueKind.Primitive,
                        valueId: "01670254973588603110040",
                        valueType: {
                          primitive: "boolean",
                        },
                        value: true,
                      },
                      viewerProtocolPolicy: {
                        kind: ValueKind.Member,
                        valueId: "01670254989042361610041",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_cloudfront.ViewerProtocolPolicy",
                        },
                        member: "REDIRECT_TO_HTTPS",
                      },
                    },
                  },
                  defaultRootObject: {
                    kind: ValueKind.Primitive,
                    valueId: "01670254865960125610028",
                    valueType: {
                      primitive: "string",
                    },
                    value: "index.html",
                  },
                  minimumProtocolVersion: {
                    kind: ValueKind.Member,
                    valueId: "01670254878726380210029",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_cloudfront.SecurityPolicyProtocol",
                    },
                    member: "TLS_V1_2_2019",
                  },
                  errorResponses: {
                    kind: ValueKind.Array,
                    valueId: "0167025488970570210030",
                    valueType: {
                      collection: {
                        elementtype: {
                          fqn: "aws-cdk-lib.aws_cloudfront.ErrorResponse",
                        },
                        kind: ValueKind.Array,
                      },
                    },
                    items: [
                      {
                        kind: ValueKind.Object,
                        valueId: "01670254889814522910032",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_cloudfront.ErrorResponse",
                        },
                        properties: {
                          httpStatus: {
                            kind: ValueKind.Primitive,
                            valueId: "01670254898303828110034",
                            valueType: {
                              primitive: "number",
                            },
                            value: 403,
                          },
                          responseHttpStatus: {
                            kind: ValueKind.Primitive,
                            valueId: "01670254903592204010035",
                            valueType: {
                              primitive: "number",
                            },
                            value: 403,
                          },
                          responsePagePath: {
                            kind: ValueKind.Primitive,
                            valueId: "01670254912138990510036",
                            valueType: {
                              primitive: "string",
                            },
                            value: "/error.html",
                          },
                          ttl: {
                            kind: ValueKind.Call,
                            valueId: "01670254918108753910037",
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
                                valueId: "01670254920700329110038",
                                valueType: {
                                  primitive: "number",
                                },
                                value: 30,
                              },
                            },
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
            valueId: "01670254635143891710017",
            valueName: "Bucket",
            valueType: {
              fqn: "aws-cdk-lib.aws_s3.Bucket",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670254664513356110019",
                valueType: {
                  fqn: "aws-cdk-lib.aws_s3.BucketProps",
                },
                properties: {
                  blockPublicAccess: {
                    kind: ValueKind.Property,
                    valueId: "01670254664512563510018",
                    propertyOfType: {
                      fqn: "aws-cdk-lib.aws_s3.BlockPublicAccess",
                    },
                    valueType: {
                      fqn: "aws-cdk-lib.aws_s3.BlockPublicAccess",
                    },
                    property: "BLOCK_ALL",
                  },
                  publicReadAccess: {
                    kind: ValueKind.Primitive,
                    valueId: "01670254671530723910020",
                    valueType: {
                      primitive: "boolean",
                    },
                    value: false,
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Instance,
            valueId: "01670255012356146610043",
            valueName: "BucketDeployment",
            valueType: {
              fqn: "aws-cdk-lib.aws_s3_deployment.BucketDeployment",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01670255017655260610045",
                valueType: {
                  fqn: "aws-cdk-lib.aws_s3_deployment.BucketDeploymentProps",
                },
                properties: {
                  destinationBucket: {
                    kind: ValueKind.Ref,
                    valueId: "01670255017654120910044",
                    valueType: {
                      fqn: "aws-cdk-lib.aws_s3.Bucket",
                    },
                    refValueId: "01670254635143891710017",
                  },
                  sources: {
                    kind: ValueKind.Array,
                    valueId: "01670255018844751610046",
                    valueType: {
                      collection: {
                        elementtype: {
                          fqn: "aws-cdk-lib.aws_s3_deployment.ISource",
                        },
                        kind: ValueKind.Array,
                      },
                    },
                    items: [
                      {
                        kind: ValueKind.Call,
                        valueId: "0167025501887588210048",
                        valueType: {
                          fqn: "aws-cdk-lib.aws_s3_deployment.ISource",
                        },
                        methodOfType: {
                          fqn: "aws-cdk-lib.aws_s3_deployment.Source",
                        },
                        methodPath: [],
                        method: "data",
                        parameters: {
                          objectKey: {
                            kind: ValueKind.Primitive,
                            valueId: "01670255053726864810050",
                            valueType: {
                              primitive: "string",
                            },
                            value: "index.html",
                          },
                          data: {
                            kind: ValueKind.Primitive,
                            valueId: "01670255110742638010051",
                            valueType: {
                              primitive: "string",
                            },
                            value: "<h1>Hello CDK!</h1>",
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
