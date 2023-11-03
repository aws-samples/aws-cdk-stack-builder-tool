import { TS_JSON_IDENT } from "./common";

export function createJestConfig() {
  const config = {
    testEnvironment: "node",
    roots: ["<rootDir>/test"],
    testMatch: ["**/*.test.ts"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
  };

  return "module.exports = " + JSON.stringify(config, null, TS_JSON_IDENT);
}
