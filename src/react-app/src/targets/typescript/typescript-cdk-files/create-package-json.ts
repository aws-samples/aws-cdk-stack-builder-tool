import { ProjectState } from "../../../project/types";
import { Utils } from "../../../utils";
import { TS_JSON_IDENT } from "./common";

export function createPackageJson(
  state: ProjectState,
  fqns: string[],
  rootFileName: string
) {
  const version =
    state.assemblies.find((c) => c.name === "aws-cdk-lib")?.version || "";
  const constructsVersion =
    state.assemblies.find((c) => c.name === "constructs")?.version || "";

  /* prettier-ignore */
  const devDependencies: { [name: string]: string } = {
    "@types/jest": "^28.1.1",
    "@types/node": "18.7.15",
    "prettier": "^2.7.1",
    "jest": "^28.1.3",
    "ts-jest": "^28.0.8",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.3",
    "aws-cdk": `^${version}`,
  };

  /* prettier-ignore */
  const dependencies: { [name: string]: string } = {
    "source-map-support": "^0.5.21",
    "constructs": `^${constructsVersion}`,
    "aws-cdk-lib": `^${version}`,
  };

  const assemblyNames = Utils.unique(
    fqns.map((fqn) => state.types[fqn].assembly)
  ).sort();

  for (const assemblyName of assemblyNames) {
    const assembly = state.assemblies.find((c) => c.name === assemblyName);
    if (!assembly) continue;

    dependencies[assembly.name] = `^${assembly.version}`;
  }

  /* prettier-ignore */
  const config = {
    name: state.metadata.projectName.toLowerCase(),
    version: "0.1.0",
    bin: {
      [rootFileName]: `bin/${rootFileName}.ts`,
    },
    scripts: {
      build: "tsc",
      watch: "tsc -w",
      test: "jest",
      cdk: "cdk",
    },
    dependencies,
    devDependencies,
  };

  return JSON.stringify(config, null, TS_JSON_IDENT);
}
