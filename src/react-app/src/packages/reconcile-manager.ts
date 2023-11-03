import { TypeMetadata, TypeTest } from "../types";

export class ReconcileManager {
  private typesMap: Map<string, TypeMetadata>;

  constructor(private readonly types: TypeMetadata[]) {
    const typesMap = new Map<string, TypeMetadata>(
      types.map((type) => [type.fqn, type])
    );

    this.typesMap = typesMap;
  }

  reconcile() {
    this.reconcileTypes();
    this.reconcileSources();
    const { constructFqns, modules } = this.findConstructs();

    const typeMetadata: { [fqn: string]: TypeMetadata } = Object.fromEntries(
      this.typesMap
    );

    return { typeMetadata, constructFqns, modules };
  }

  private reconcileTypes() {
    const typeBase = new Map<string, string[]>();

    for (const type of this.types) {
      type.base = this.getBaseTypes(typeBase, type);
    }

    for (const type of this.types) {
      for (const base of type.base) {
        const baseMetadata = this.typesMap.get(base);
        if (!baseMetadata) throw new Error(`Could not find ${base}`);

        baseMetadata.sub = baseMetadata.sub || [];
        baseMetadata.sub.push(type.fqn);
      }
    }
  }

  private getBaseTypes(typeBase: Map<string, string[]>, type: TypeMetadata) {
    if (typeBase.has(type.fqn)) {
      return typeBase.get(type.fqn) || [];
    }

    let retValue: string[] = type.base;

    for (const fqn of type.base) {
      const type = this.types.find((t) => t.fqn === fqn);
      if (!type) {
        throw new Error(`Could not find type ${fqn}`);
      }

      retValue = [...retValue, ...this.getBaseTypes(typeBase, type)];
    }

    retValue = Array.from(new Set(retValue)).sort();
    typeBase.set(type.fqn, retValue);

    return retValue;
  }

  private reconcileSources() {
    for (const typeMetadata of this.types) {
      const itemProperties = typeMetadata.properties || [];
      const itemMethods = typeMetadata.methods || [];

      for (const property of itemProperties) {
        if (!property.static) continue;

        if (TypeTest.isFqn(property.type)) {
          const target = this.typesMap.get(property.type.fqn);
          if (!target) throw new Error(`Could not find ${property.type.fqn}`);

          for (const base of [target.fqn, ...target.base]) {
            const baseType = this.typesMap.get(base);
            if (!baseType) throw new Error(`Could not find ${base}`);

            baseType.sources = baseType.sources || [];
            baseType.sources.push({
              kind: "property",
              name: property.name,
              fqn: typeMetadata.fqn,
            });
          }
        }
      }

      for (const method of itemMethods) {
        if (!method.static) continue;

        if (method.returns && TypeTest.isFqn(method.returns)) {
          const target = this.typesMap.get(method.returns.fqn);
          if (!target) throw new Error(`Could not find ${method.returns.fqn}`);

          for (const base of [target.fqn, ...target.base]) {
            const baseType = this.typesMap.get(base);
            if (!baseType) throw new Error(`Could not find ${base}`);

            baseType.sources = baseType.sources || [];
            baseType.sources.push({
              kind: "method",
              name: method.name,
              fqn: typeMetadata.fqn,
            });
          }
        }
      }
    }
  }

  private findConstructs() {
    const constructFqns = new Set<string>();
    const modules: { [name: string]: TypeMetadata[] } = {};

    for (const type of this.types) {
      if (
        !type.abstract &&
        type.kind === "class" &&
        type.base.includes("constructs.IConstruct")
      ) {
        constructFqns.add(type.fqn);

        const moduleName =
          type.modules && type.modules.length > 0
            ? type.modules[0]
            : "undefined";

        modules[moduleName] = modules[moduleName] || [];
        modules[moduleName].push(type);
      }
    }

    for (const key of Object.keys(modules)) {
      modules[key].sort((a, b) => a.name.localeCompare(b.name));
    }

    return { constructFqns, modules };
  }
}
