import packo from "pako";
import { TarFileItem, TarFileReader } from "./tar-file-reader";

export class PackageParser {
  parse(files: TarFileItem[], reader: TarFileReader) {
    const file = files.find((file) => file.name.endsWith("/.jsii"));

    if (file) {
      const content = reader.fileToString(file) || "{}";
      let data = JSON.parse(content);

      if (data.schema === "jsii/file-redirect" && data.compression === "gzip") {
        const redirectFile = files.find(
          (file) => file.name === `package/${data.filename}`
        );

        if (!redirectFile) {
          throw new Error(`Could not find file ${data.filename}`);
        }

        const arrayContent = reader.fileToArray(redirectFile);
        if (!arrayContent) {
          throw new Error(`Could not read file ${data.filename}`);
        }

        const array = packo.inflate(arrayContent);
        const textDecoder = new TextDecoder();
        const content = textDecoder.decode(array);
        data = JSON.parse(content);
      }

      return data;
    }

    return null;
  }
}
