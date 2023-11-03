import { ProjectState } from "../../project/types";
import { CodeGenerator } from "../generation/code-generator";
import { ExportBase } from "./export-base";

export abstract class FileBuilderBase {
  constructor(
    protected projectState: ProjectState,
    protected generator: CodeGenerator,
    protected exportBase: ExportBase
  ) {}
}
