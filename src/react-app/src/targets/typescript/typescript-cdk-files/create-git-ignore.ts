export function createGitIgnore() {
  return `*.js
!jest.config.js
*.d.ts
node_modules

# CDK asset staging directory
.cdk.staging
cdk.out
`;
}
