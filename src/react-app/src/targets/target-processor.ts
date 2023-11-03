import { ProjectState } from "../project/types";
import { ExportArchive } from "./export/export-archive";
import { ExportSync } from "./export/export-sync";
import { TypeScriptCdkBuilder } from "./typescript/typescript-cdk-builder";
import { TypeScriptGenerator } from "./typescript/typescript-generator";

export class TargetProcessor {
  constructor(
    protected state: ProjectState,
    protected language: "typescript"
  ) {}

  async downloadArchive() {
    if (this.language === "typescript") {
      const generator = new TypeScriptGenerator(this.state);
      const archive = new ExportArchive(this.state);
      const fileBuilder = new TypeScriptCdkBuilder(
        this.state,
        generator,
        archive
      );
      await fileBuilder.build();
      await archive.download();
    } else {
      throw new Error("Unknown language");
    }
  }

  async syncFileSystem(dirHandle: FileSystemDirectoryHandle) {
    if (this.language === "typescript") {
      const generator = new TypeScriptGenerator(this.state);
      const sync = new ExportSync(this.state, dirHandle);
      const fileBuilder = new TypeScriptCdkBuilder(this.state, generator, sync);
      await fileBuilder.build();
    } else {
      throw new Error("Unknown language");
    }
  }

  generateContainerCode() {
    if (this.language === "typescript") {
      const generator = new TypeScriptGenerator(this.state);
      const generationState = generator.generate();
      const selectedValueId = this.state.computed.selectedContainer.valueId;
      const containerCode = generationState.containers[selectedValueId].code;

      return { containerCode, generationState };
    } else {
      throw new Error("Unknown language");
    }
  }
}
