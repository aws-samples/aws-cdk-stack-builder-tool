import { ProjectBlueprint } from "../project/types/project-blueprint";
import { ValueKind } from "../project/types/values";
import { Utils } from "../utils";

export const cdkSSMDocumentsBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdk-base",
  id: "b64eed21-1068-4126-8918-981b8498720c",
  name: "SSM Document",
  description: "Blueprint for implementing SSM documents",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0id2hpdGUiPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTEwLjM0MyAzLjk0Yy4wOS0uNTQyLjU2LS45NCAxLjExLS45NGgxLjA5M2MuNTUgMCAxLjAyLjM5OCAxLjExLjk0bC4xNDkuODk0Yy4wNy40MjQuMzg0Ljc2NC43OC45My4zOTguMTY0Ljg1NS4xNDIgMS4yMDUtLjEwOGwuNzM3LS41MjdhMS4xMjUgMS4xMjUgMCAwMTEuNDUuMTJsLjc3My43NzRjLjM5LjM4OS40NCAxLjAwMi4xMiAxLjQ1bC0uNTI3LjczN2MtLjI1LjM1LS4yNzIuODA2LS4xMDcgMS4yMDQuMTY1LjM5Ny41MDUuNzEuOTMuNzhsLjg5My4xNWMuNTQzLjA5Ljk0LjU2Ljk0IDEuMTA5djEuMDk0YzAgLjU1LS4zOTcgMS4wMi0uOTQgMS4xMWwtLjg5My4xNDljLS40MjUuMDctLjc2NS4zODMtLjkzLjc4LS4xNjUuMzk4LS4xNDMuODU0LjEwNyAxLjIwNGwuNTI3LjczOGMuMzIuNDQ3LjI2OSAxLjA2LS4xMiAxLjQ1bC0uNzc0Ljc3M2ExLjEyNSAxLjEyNSAwIDAxLTEuNDQ5LjEybC0uNzM4LS41MjdjLS4zNS0uMjUtLjgwNi0uMjcyLTEuMjAzLS4xMDctLjM5Ny4xNjUtLjcxLjUwNS0uNzgxLjkyOWwtLjE0OS44OTRjLS4wOS41NDItLjU2Ljk0LTEuMTEuOTRoLTEuMDk0Yy0uNTUgMC0xLjAxOS0uMzk4LTEuMTEtLjk0bC0uMTQ4LS44OTRjLS4wNzEtLjQyNC0uMzg0LS43NjQtLjc4MS0uOTMtLjM5OC0uMTY0LS44NTQtLjE0Mi0xLjIwNC4xMDhsLS43MzguNTI3Yy0uNDQ3LjMyLTEuMDYuMjY5LTEuNDUtLjEybC0uNzczLS43NzRhMS4xMjUgMS4xMjUgMCAwMS0uMTItMS40NWwuNTI3LS43MzdjLjI1LS4zNS4yNzMtLjgwNi4xMDgtMS4yMDQtLjE2NS0uMzk3LS41MDUtLjcxLS45My0uNzhsLS44OTQtLjE1Yy0uNTQyLS4wOS0uOTQtLjU2LS45NC0xLjEwOXYtMS4wOTRjMC0uNTUuMzk4LTEuMDIuOTQtMS4xMWwuODk0LS4xNDljLjQyNC0uMDcuNzY1LS4zODMuOTMtLjc4LjE2NS0uMzk4LjE0My0uODU0LS4xMDctMS4yMDRsLS41MjctLjczOGExLjEyNSAxLjEyNSAwIDAxLjEyLTEuNDVsLjc3My0uNzczYTEuMTI1IDEuMTI1IDAgMDExLjQ1LS4xMmwuNzM3LjUyN2MuMzUuMjUuODA3LjI3MiAxLjIwNC4xMDcuMzk3LS4xNjUuNzEtLjUwNS43OC0uOTI5bC4xNS0uODk0eiIgLz4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNSAxMmEzIDMgMCAxMS02IDAgMyAzIDAgMDE2IDB6IiAvPgo8L3N2Zz4K",
  background: "#01af26",
  favorites: [
    "cdk-ssm-documents",
    "aws-cdk-lib.Stack",
    "@cdklabs/cdk-ssm-documents.AutomationDocument",
  ],
  libs: { "@cdklabs/cdk-ssm-documents": "latest" },
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
        valueName: "HelloWorld",
        valueType: {
          fqn: "aws-cdk-lib.Stack",
        },
        children: [
          {
            kind: ValueKind.Instance,
            valueId: "0166446585588583010031",
            valueName: "MyDoc",
            valueType: {
              fqn: "@cdklabs/cdk-ssm-documents.AutomationDocument",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01664465875578848710033",
                valueType: {
                  fqn: "@cdklabs/cdk-ssm-documents.AutomationDocumentProps",
                },
                properties: {
                  documentName: {
                    kind: ValueKind.Primitive,
                    valueId: "01664465875577480810032",
                    valueType: {
                      primitive: "string",
                    },
                    value: "MyDoc",
                  },
                  documentFormat: {
                    kind: ValueKind.Member,
                    valueId: "0166446588207774510034",
                    valueType: {
                      fqn: "@cdklabs/cdk-ssm-documents.DocumentFormat",
                    },
                    member: "JSON",
                  },
                  docInputs: {
                    kind: ValueKind.Array,
                    valueId: "01664465885602142710035",
                    valueType: {
                      collection: {
                        elementtype: {
                          fqn: "@cdklabs/cdk-ssm-documents.Input",
                        },
                        kind: "array",
                      },
                    },
                    items: [
                      {
                        kind: ValueKind.Call,
                        valueId: "01664465885637551610037",
                        valueType: {
                          fqn: "@cdklabs/cdk-ssm-documents.Input",
                        },
                        methodOfType: {
                          fqn: "@cdklabs/cdk-ssm-documents.Input",
                        },
                        methodPath: [],
                        method: "ofTypeString",
                        parameters: {
                          name: {
                            kind: ValueKind.Primitive,
                            valueId: "01664465904174627610039",
                            valueType: {
                              primitive: "string",
                            },
                            value: "MyInput",
                          },
                          props: {
                            kind: ValueKind.Object,
                            valueId: "01664465904277702410040",
                            valueType: {
                              fqn: "@cdklabs/cdk-ssm-documents.StringInputProps",
                            },
                            properties: {
                              defaultValue: {
                                kind: ValueKind.Primitive,
                                valueId: "01664465907079423210041",
                                valueType: {
                                  primitive: "string",
                                },
                                value: "a",
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
            kind: ValueKind.Call,
            valueId: "01664465913509885810042",
            valueType: {
              fqn: "void",
            },
            methodOfId: "0166446585588583010031",
            methodOfType: {
              fqn: "@cdklabs/cdk-ssm-documents.AutomationDocument",
            },
            methodPath: [],
            method: "addStep",
            parameters: {
              component: {
                kind: ValueKind.Ref,
                valueId: "0166446593206441610043",
                valueType: {
                  fqn: "@cdklabs/cdk-ssm-documents.PauseStep",
                },
                refValueId: "01664465932067247010045",
              },
            },
            valueName: "AddPauseStep",
          },
          {
            kind: ValueKind.Instance,
            valueId: "01664465932067247010045",
            valueName: "MyPauseStep",
            valueType: {
              fqn: "@cdklabs/cdk-ssm-documents.PauseStep",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01664465946331227710047",
                valueType: {
                  fqn: "@cdklabs/cdk-ssm-documents.AutomationStepProps",
                },
                properties: {
                  name: {
                    kind: ValueKind.Primitive,
                    valueId: "01664465946331384110046",
                    valueType: {
                      primitive: "string",
                    },
                    value: "MyPauseStep",
                  },
                  explicitNextStep: {
                    kind: ValueKind.Call,
                    valueId: "01664465957022639410048",
                    valueType: {
                      fqn: "@cdklabs/cdk-ssm-documents.StepRef",
                    },
                    methodOfType: {
                      fqn: "@cdklabs/cdk-ssm-documents.StepRef",
                    },
                    methodPath: [],
                    method: "fromName",
                    parameters: {
                      stepName: {
                        kind: ValueKind.Primitive,
                        valueId: "01664465963034219710049",
                        valueType: {
                          primitive: "string",
                        },
                        value: "step1",
                      },
                    },
                  },
                },
              },
            },
          },
          {
            kind: ValueKind.Call,
            valueId: "01664465976216732910050",
            valueType: {
              fqn: "void",
            },
            methodOfId: "0166446585588583010031",
            methodOfType: {
              fqn: "@cdklabs/cdk-ssm-documents.AutomationDocument",
            },
            methodPath: [],
            method: "addStep",
            parameters: {
              component: {
                kind: ValueKind.Ref,
                valueId: "01664466000435214210051",
                valueType: {
                  fqn: "@cdklabs/cdk-ssm-documents.ExecuteScriptStep",
                },
                refValueId: "01664466000437595910053",
              },
            },
            valueName: "AddExecuteStep",
          },
          {
            kind: ValueKind.Instance,
            valueId: "01664466000437595910053",
            valueName: "MyExecuteStep",
            valueType: {
              fqn: "@cdklabs/cdk-ssm-documents.ExecuteScriptStep",
            },
            children: [],
            parameters: {
              props: {
                kind: ValueKind.Object,
                valueId: "01664466009645917910055",
                valueType: {
                  fqn: "@cdklabs/cdk-ssm-documents.ExecuteScriptStepProps",
                },
                properties: {
                  name: {
                    kind: ValueKind.Primitive,
                    valueId: "01664466009644466410054",
                    valueType: {
                      primitive: "string",
                    },
                    value: "step1",
                  },
                  language: {
                    kind: ValueKind.Call,
                    valueId: "01664466017792741210056",
                    valueType: {
                      fqn: "@cdklabs/cdk-ssm-documents.ScriptLanguage",
                    },
                    methodOfType: {
                      fqn: "@cdklabs/cdk-ssm-documents.ScriptLanguage",
                    },
                    methodPath: [],
                    method: "python",
                    parameters: {
                      handlerName: {
                        kind: ValueKind.Primitive,
                        valueId: "01664466021277212310057",
                        valueType: {
                          primitive: "string",
                        },
                        value: "my_func",
                      },
                      version: {
                        kind: ValueKind.Member,
                        valueId: "01664466026765269610058",
                        valueType: {
                          fqn: "@cdklabs/cdk-ssm-documents.PythonVersion",
                        },
                        member: "VERSION_3_6",
                      },
                    },
                  },
                  code: {
                    kind: ValueKind.Call,
                    valueId: "01664466051865494210059",
                    valueType: {
                      fqn: "@cdklabs/cdk-ssm-documents.FileScriptCode",
                    },
                    methodOfType: {
                      fqn: "@cdklabs/cdk-ssm-documents.ScriptCode",
                    },
                    methodPath: [],
                    method: "fromFile",
                    parameters: {
                      fullPath: {
                        kind: ValueKind.Primitive,
                        valueId: "016644660583795410060",
                        valueType: {
                          primitive: "string",
                        },
                        value: "test/test_file.py",
                      },
                    },
                  },
                  inputPayload: {
                    kind: ValueKind.Map,
                    valueId: "01664466075568863210061",
                    valueType: {
                      collection: {
                        elementtype: {
                          fqn: "@cdklabs/cdk-ssm-documents.IGenericVariable",
                        },
                        kind: "map",
                      },
                    },
                    pairs: {
                      MyInput: {
                        kind: ValueKind.Call,
                        valueId: "0166446608524979610065",
                        valueType: {
                          fqn: "@cdklabs/cdk-ssm-documents.StringVariable",
                        },
                        methodOfType: {
                          fqn: "@cdklabs/cdk-ssm-documents.StringVariable",
                        },
                        methodPath: [],
                        method: "of",
                        parameters: {
                          reference: {
                            kind: ValueKind.Primitive,
                            valueId: "01664466114035758910068",
                            valueType: {
                              primitive: "string",
                            },
                            value: "MyInput",
                          },
                        },
                      },
                    },
                  },
                  onFailure: {
                    kind: ValueKind.Call,
                    valueId: "01664466125471424810069",
                    valueType: {
                      fqn: "@cdklabs/cdk-ssm-documents.OnCancel",
                    },
                    methodOfType: {
                      fqn: "@cdklabs/cdk-ssm-documents.OnFailure",
                    },
                    methodPath: [],
                    method: "abort",
                    parameters: {},
                  },
                  outputs: {
                    kind: ValueKind.Array,
                    valueId: "01664466138858457610070",
                    valueType: {
                      collection: {
                        elementtype: {
                          fqn: "@cdklabs/cdk-ssm-documents.Output",
                        },
                        kind: "array",
                      },
                    },
                    items: [
                      {
                        kind: ValueKind.Object,
                        valueId: "01664466138941148310072",
                        valueType: {
                          fqn: "@cdklabs/cdk-ssm-documents.Output",
                        },
                        properties: {
                          outputType: {
                            kind: ValueKind.Member,
                            valueId: "01664466149113208810074",
                            valueType: {
                              fqn: "@cdklabs/cdk-ssm-documents.DataTypeEnum",
                            },
                            member: "STRING",
                          },
                          selector: {
                            kind: ValueKind.Primitive,
                            valueId: "01664466155424393810075",
                            valueType: {
                              primitive: "string",
                            },
                            value: "$.Payload.MyReturn",
                          },
                          name: {
                            kind: ValueKind.Primitive,
                            valueId: "01664466162731533310076",
                            valueType: {
                              primitive: "string",
                            },
                            value: "MyFuncOut",
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
