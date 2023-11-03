import { TS_JSON_IDENT } from "./common";

export function createTsConfig() {
  const config = {
    compilerOptions: {
      target: "ES2018",
      module: "commonjs",
      lib: ["es2018"],
      declaration: true,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      noImplicitThis: true,
      alwaysStrict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: false,
      inlineSourceMap: true,
      inlineSources: true,
      experimentalDecorators: true,
      strictPropertyInitialization: false,
      typeRoots: ["./node_modules/@types"],
    },
    exclude: ["node_modules", "cdk.out"],
  };

  return JSON.stringify(config, null, TS_JSON_IDENT);
}
