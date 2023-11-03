import { ProjectState } from "../../project/types";

export abstract class ExportBase {
  constructor(protected projectState: ProjectState) {}

  abstract folder(name: string): Promise<void>;
  abstract file(name: string, content: string): Promise<void>;
}
