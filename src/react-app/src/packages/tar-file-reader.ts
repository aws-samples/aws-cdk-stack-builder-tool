const SEGMENT_SIZE = 512;

export interface TarFileItem {
  name: string;
  type: "file" | "directory";
  size: number;
  header_offset: number;
}

export class TarFileReader {
  public _files: TarFileItem[] = [];
  private buffer: ArrayBuffer | null = null;

  public get files() {
    return this._files;
  }

  fromBlob(blob: Blob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        if (!event.target) {
          reject("No event target");
        } else {
          if (typeof event.target.result === "string") {
            reject("Invalid result type");
          } else {
            this.buffer = event.target.result;
            this._files = [];
            this.getFileInfo();

            resolve(this.files);
          }
        }
      };

      fileReader.readAsArrayBuffer(blob);
    });
  }

  fromArrayBuffer(arrayBuffer: ArrayBuffer) {
    this.buffer = arrayBuffer;
    this._files = [];
    this.getFileInfo();

    return this.files;
  }

  fileToString(file: TarFileItem) {
    if (!this.buffer) return null;

    const view = new Uint8Array(
      this.buffer,
      file.header_offset + SEGMENT_SIZE,
      file.size
    );

    const textDecoder = new TextDecoder();
    const retValue = textDecoder.decode(view);

    return retValue;
  }

  fileToArray(file: TarFileItem) {
    if (!this.buffer) return null;

    const retValue = new Uint8Array(
      this.buffer,
      file.header_offset + SEGMENT_SIZE,
      file.size
    );

    return retValue;
  }

  fileToBlob(file: TarFileItem, mimetype: string) {
    if (!this.buffer) return null;

    const view = new Uint8Array(
      this.buffer,
      file.header_offset + SEGMENT_SIZE,
      file.size
    );

    const retValue = new Blob([view], { type: mimetype });

    return retValue;
  }

  private getFileInfo() {
    if (!this.buffer) return null;

    this._files = [];
    let header_offset = 0;

    while (header_offset < this.buffer.byteLength - SEGMENT_SIZE) {
      const name = this.readString(header_offset, 100);

      if (!name || name.length === 0) {
        break;
      }

      const type = this.getFileType(header_offset);
      const size = this.getFileSize(header_offset);
      if (type === null) break;
      if (size === null) break;

      this.files.push({
        name,
        type,
        size,
        header_offset,
      });

      header_offset +=
        SEGMENT_SIZE + SEGMENT_SIZE * Math.trunc(size / SEGMENT_SIZE);
      if (size % SEGMENT_SIZE) header_offset += SEGMENT_SIZE;
    }
  }

  private readString(str_offset: number, size: number) {
    if (!this.buffer) return null;

    const view = new Uint8Array(this.buffer, str_offset, size);
    const idx = view.indexOf(0);
    const slice = view.slice(0, idx);
    const textDecoder = new TextDecoder();
    const retValue = textDecoder.decode(slice);

    return retValue;
  }

  private getFileType(header_offset: number) {
    if (!this.buffer) return null;

    const view = new Uint8Array(this.buffer, header_offset + 156, 1);
    const str = String.fromCharCode(view[0]);
    if (str === "0") {
      return "file";
    } else if (str === "5") {
      return "directory";
    }

    return null;
  }

  private getFileSize(header_offset: number) {
    if (!this.buffer) return null;

    const view = new Uint8Array(this.buffer, header_offset + 124, 12);
    let str = "";
    for (let i = 0; i < 11; i++) {
      str += String.fromCharCode(view[i]);
    }

    const retValue = parseInt(str, 8);

    return retValue;
  }
}
