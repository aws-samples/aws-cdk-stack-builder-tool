export function createReadme() {
  return `# Welcome to your CDK TypeScript project

The \`cdk.json\` file tells the CDK Toolkit how to execute your app.

## How to deploy your project 

### Install AWS CDK
The AWS CDK Toolkit is installed with the Node Package Manager. In most cases, we recommend installing it globally.

\`npm install -g aws-cdk\`

### Install NPM packages

\`npm install\`

## Useful commands

* \`npm run build\`   compile typescript to js
* \`npm run watch\`   watch for changes and compile
* \`npm run test\`    perform the jest unit tests
* \`cdk deploy\`      deploy this stack to your default AWS account/region
* \`cdk diff\`        compare deployed stack with current state
* \`cdk synth\`       emits the synthesized CloudFormation template  
`;
}
