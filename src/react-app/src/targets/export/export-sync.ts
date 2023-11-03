import { ProjectState } from "../../project/types";
import { ExportBase } from "./export-base";

export class ExportSync extends ExportBase {
  constructor(
    protected projectState: ProjectState,
    protected handle: FileSystemDirectoryHandle
  ) {
    super(projectState);
  }

  async folder(name: string): Promise<void> {
    await this.handle.getDirectoryHandle(name, {
      create: true,
    });
  }

  async file(name: string, content: string): Promise<void> {
    const idx = name.lastIndexOf("/");
    const path = idx >= 0 ? name.substring(0, idx).split("/") : [];
    const fileName = idx >= 0 ? name.substring(idx + 1) : name;

    let currentHandle = this.handle;
    for (const folder of path) {
      currentHandle = await currentHandle.getDirectoryHandle(folder, {
        create: true,
      });
    }

    const fileHandle = await currentHandle.getFileHandle(fileName, {
      create: true,
    });

    const writable = await fileHandle.createWritable({
      keepExistingData: false,
    });

    await writable.write(content);
    await writable.close();
  }
}
