import { ProjectService } from "../../project/project-service";
import { TS_JSON_IDENT } from "./typescript-cdk-files/common";
import { createCdkJson } from "./typescript-cdk-files/create-cdk-json";
import { createGitIgnore } from "./typescript-cdk-files/create-git-ignore";
import { createJestConfig } from "./typescript-cdk-files/create-jest-config";
import { createNpmIgnore } from "./typescript-cdk-files/create-npm-ignore";
import { createPackageJson } from "./typescript-cdk-files/create-package-json";
import { createReadme } from "./typescript-cdk-files/create-readme";
import { createTest } from "./typescript-cdk-files/create-test";
import { createTsConfig } from "./typescript-cdk-files/create-ts-config";
import { FileBuilderBase } from "../export/file-builder-base";

export class TypeScriptCdkBuilder extends FileBuilderBase {
  async build() {
    const folder = this.exportBase.folder.bind(this.exportBase);
    const file = this.exportBase.file.bind(this.exportBase);

    const projectService = new ProjectService();
    const projectData = await projectService.save(this.projectState, true);
    const result = this.generator.generate();

    await folder("bin");
    await folder("lib");
    await folder("test");

    for (const container of Object.values(result.containers)) {
      const folder = container.isRoot ? "bin" : "lib";
      await file(`${folder}/${container.fileName}.ts`, container.code);
      await file(`test/${container.fileName}.test.ts`, createTest(container));
    }

    const rootContainer = Object.values(result.containers).find(
      (c) => c.isRoot
    );

    if (!rootContainer) {
      throw new Error("Root container not found");
    }

    await file("README.md", createReadme());
    await file(".npmignore", createNpmIgnore());
    await file(".gitignore", createGitIgnore());
    await file(
      "package.json",
      createPackageJson(this.projectState, result.fqns, rootContainer.fileName)
    );
    await file("cdk.json", createCdkJson(rootContainer.fileName));
    await file("tsconfig.json", createTsConfig());
    await file("jest.config.js", createJestConfig());
    await file(
      "project.cdkproj",
      JSON.stringify(projectData, null, TS_JSON_IDENT)
    );
  }
}
