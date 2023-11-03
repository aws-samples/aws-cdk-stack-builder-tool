import { ProjectBlueprint } from "../project/types/project-blueprint";
import { Utils } from "../utils";
import { ValueKind } from "../project/types/values";

export const terraformBlankBlueprint: ProjectBlueprint = {
  format: 1,
  kind: "cdk/project-blueprint",
  extend: "cdktf-base",
  id: "ef1af905-c137-4007-b6be-40587880df58",
  name: "Terraform blank (**Work in progress**)",
  description: "Blank CDK for Terraform blueprint",
  icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNyAyMWgxMGEyIDIgMCAwMDItMlY5LjQxNGExIDEgMCAwMC0uMjkzLS43MDdsLTUuNDE0LTUuNDE0QTEgMSAwIDAwMTIuNTg2IDNIN2EyIDIgMCAwMC0yIDJ2MTRhMiAyIDAgMDAyIDJ6Ij48L3BhdGg+PC9zdmc+",
  background: "#ec489a",
  libs: { "@cdktf/provider-aws": "latest" },
  root: {
    kind: ValueKind.Instance,
    valueId: Utils.generateId(),
    valueName: "App",
    valueType: {
      fqn: "cdktf.App",
    },
    parameters: {},
    children: [
      {
        kind: ValueKind.Instance,
        valueId: Utils.generateId(),
        valueName: "MyStack",
        valueType: {
          fqn: "cdktf.TerraformStack",
        },
        children: [],
        parameters: {},
      },
    ],
  },
};
