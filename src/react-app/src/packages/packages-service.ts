import { JSIIParser, JSIIParseResult } from "./jsii-parser";
import { PackageManager } from "./package-manager";
import { PackageParser } from "./package-parser";
import { ReconcileManager } from "./reconcile-manager";

const isDevelopment = import.meta.env.DEV;

export class PackagesService {
  private packageManager: PackageManager;
  private packageParser: PackageParser;
  private jsiiParser: JSIIParser;

  constructor(
    protected report: (
      packageName: string,
      total: number,
      loaded: number
    ) => void
  ) {
    this.packageManager = new PackageManager(report);
    this.packageParser = new PackageParser();
    this.jsiiParser = new JSIIParser();
  }

  async process(libs: { [key: string]: string }) {
    const start = performance.now();
    const promises: Promise<JSIIParseResult>[] = [];

    for (const libName of Object.keys(libs)) {
      promises.push(this.processLib(libName, libs[libName]));
    }

    const results = await Promise.all(promises);
    const data = this.jsiiParser.join(results);

    const reconcileStart = performance.now();
    const reconcileManager = new ReconcileManager(data.types);
    const result = reconcileManager.reconcile();
    const reconcileEnd = performance.now();

    if (isDevelopment) {
      console.log(
        `Reconcile: ${(reconcileEnd - reconcileStart) / 1000} seconds.`
      );
    }

    const end = performance.now();
    if (isDevelopment) {
      console.log(`Lib processing: ${(end - start) / 1000} seconds.`);
    }

    return {
      version: data.version,
      typeMetadata: result.typeMetadata,
      constructFqns: result.constructFqns,
      modules: result.modules,
      assemblies: data.assemblies,
    };
  }

  async addLib(libName: string, libs: { [key: string]: string }) {
    const libResult = await this.processLib(libName, "latest");

    const promises: Promise<JSIIParseResult>[] = [];

    for (const libName of Object.keys(libs)) {
      promises.push(this.processLib(libName, libs[libName]));
    }

    const results = await Promise.all(promises);
    results.push(libResult);
    const data = this.jsiiParser.join(results);

    const reconcileManager = new ReconcileManager(data.types);
    const result = reconcileManager.reconcile();

    return {
      version: data.version,
      typeMetadata: result.typeMetadata,
      constructFqns: result.constructFqns,
      modules: result.modules,
      assemblies: data.assemblies,
    };
  }

  private async processLib(name: string, version: string) {
    const start = performance.now();
    const { files, reader } = await this.packageManager.getPackage(
      name,
      version
    );

    const data = this.packageParser.parse(files, reader);
    if (!data) {
      await this.packageManager.deleteFromCache(name);
      throw new Error(`No .jsii file found in package ${name}`, {
        cause: "NO_JSII_FILE",
      });
    }

    try {
      const result = this.jsiiParser.parse(data);

      if (isDevelopment) {
        const end = performance.now();
        console.log(`Process ${name}: ${(end - start) / 1000} seconds.`);
      }

      return result;
    } catch (err) {
      await this.packageManager.deleteFromCache(name);
      throw err;
    }
  }
}
