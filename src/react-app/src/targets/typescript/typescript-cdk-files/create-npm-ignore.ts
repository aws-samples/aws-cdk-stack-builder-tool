export function createNpmIgnore() {
  return `*.ts
!*.d.ts

# CDK asset staging directory
.cdk.staging
cdk.out
  `;
}
