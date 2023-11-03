import JSZip from "jszip";
import { ProjectState } from "../../project/types";
import { ExportBase } from "./export-base";

export class ExportArchive extends ExportBase {
  private zip: JSZip;

  constructor(protected projectState: ProjectState) {
    super(projectState);

    this.zip = new JSZip();
  }

  async folder(name: string) {
    this.zip.folder(name);
  }

  async file(name: string, content: string) {
    this.zip.file(name, content);
  }

  async download() {
    const blob = await this.zip.generateAsync({ type: "blob" });

    const name = this.projectState.metadata.projectName;
    this.saveData(blob, `${name}.zip`);
  }

  saveData(blob: Blob, fileName: string) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
