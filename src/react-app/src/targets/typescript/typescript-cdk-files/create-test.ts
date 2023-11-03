import { Utils } from "../../../utils";
import { ContainerState } from "../../generation/code-generator";

export function createTest(container: ContainerState) {
  const valueName = Utils.firstLetterToUpperCase(container.valueName);

  return `import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ${container.valueName} } from "../lib/${container.fileName}";

// Example test
test("Some resource created", () => {
//   const app = new cdk.App();
//     // WHEN
//   const stack = new ${valueName}(app, "${valueName}");
//     // THEN
//   const template = Template.fromStack(stack);

//   template.hasResourceProperties("AWS::SQS::Queue", {
//      VisibilityTimeout: 300
//   });
//
//   template.resourceCountIs("AWS::SNS::Topic", 1);
});
`;
}
