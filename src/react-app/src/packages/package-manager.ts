import axios from "axios";
import packo from "pako";
import semver from "semver";
import { TarFileReader } from "./tar-file-reader";

const NPM_BASE_URL = "https://registry.npmjs.org";
const isDevelopment = import.meta.env.DEV;

export class PackageManager {
  constructor(
    protected report: (
      packageName: string,
      total: number,
      loaded: number
    ) => void
  ) {}

  async getPackage(packageName: string, version: string) {
    const cache = await caches.open("packages");

    let packageMetaData;
    if (version == "local") {
      const targetVersion = packageName.substring(
        packageName.length - 9,
        packageName.length - 4
      );

      packageMetaData = {
        metadata: {},
        tarball: `../constructs/${packageName}`,
        version: targetVersion,
      };
    } else {
      packageMetaData = await this.getPackageMetadata(packageName, version);
    }

    let { metadata, tarball, targetVersion } = packageMetaData;

    let data: Uint8Array | null = null;
    const packageKeyPrefix = this.getPackageKeyPrefix(packageName);
    const cacheKey = `${packageKeyPrefix}${targetVersion}`;
    const cacheResponse = await cache.match(cacheKey);
    if (cacheResponse) {
      data = new Uint8Array(await cacheResponse.arrayBuffer());
    } else {
      const buffer = await this.fetchPackage(packageName, tarball);
      data = packo.inflate(buffer);

      cache.put(
        cacheKey,
        new Response(data, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        })
      );

      const keys = await cache.keys();
      for (const key of keys.filter(
        (c) => c.url.startsWith(packageKeyPrefix) && c.url !== cacheKey
      )) {
        if (isDevelopment) {
          console.log(`Deleting ${key.url}`);
        }

        await cache.delete(key.url);
      }
    }

    const reader = new TarFileReader();
    const files = reader.fromArrayBuffer(data.buffer);

    return { metadata, files, reader };
  }

  private getPackageKeyPrefix(packageName: string) {
    return `https://cdk-builder.local/${packageName}/~/`;
  }

  async deleteFromCache(packageName: string) {
    const cache = await caches.open("packages");
    const packageKeyPrefix = this.getPackageKeyPrefix(packageName);

    const keys = await cache.keys();
    for (const key of keys.filter((c) => c.url.startsWith(packageKeyPrefix))) {
      if (isDevelopment) {
        console.log(`Deleting ${key.url}`);
      }

      await cache.delete(key.url);
    }
  }

  private async getPackageMetadata(packageName: string, version: string) {
    const result = await axios.get(`${NPM_BASE_URL}/${packageName}`);
    const metadata = result.data;
    const distTags = metadata["dist-tags"];
    const versions = metadata["versions"];

    let targetVersion = "";
    version = version ? version : "latest";
    if (distTags && distTags[version]) {
      targetVersion = distTags[version];
    } else {
      const satisfyingVersion = semver.maxSatisfying(
        Object.keys(versions)
          .map((v) => semver.parse(v))
          .filter((v) => v !== null) as semver.SemVer[],
        version,
        { includePrerelease: true }
      );

      if (!satisfyingVersion) {
        throw new Error(`No version found for ${packageName}@${version}`);
      }

      targetVersion = satisfyingVersion.version;
    }

    if (isDevelopment) {
      console.log(`Using ${targetVersion} for ${packageName}@${version}`);
    }

    const versionMetadata = metadata["versions"][targetVersion];
    if (!versionMetadata) {
      throw new Error(`Package ${packageName}@${targetVersion} not found`);
    }

    const tarball = versionMetadata["dist"]["tarball"];

    return { metadata, targetVersion, versionMetadata, tarball };
  }

  private async fetchPackage(packageName: string, tarball: string) {
    const reportFunc = this.report.bind(this, packageName);

    const result = await axios.get(tarball, {
      responseType: "arraybuffer",
      onDownloadProgress(progressEvent) {
        const { loaded, total } = progressEvent;

        reportFunc(total || 1, loaded);
      },
    });

    return result.data;
  }
}
