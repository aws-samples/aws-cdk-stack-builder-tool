import {
  AssemblyMetadata,
  DocsMetadata,
  MemberMetadata,
  MethodMetadata,
  ParameterMetadata,
  PropertyMetadata,
  TypeMetadata,
} from "../types";

export interface JSIIParseResult {
  assembly: AssemblyMetadata;
  types: TypeMetadata[];
}

export interface JSIIJoinResult {
  version: string;
  assemblies: AssemblyMetadata[];
  types: TypeMetadata[];
}

export class JSIIParser {
  parse(data: any): JSIIParseResult {
    const types: TypeMetadata[] = [];

    for (const fqn of Object.keys(data.types)) {
      const type = data.types[fqn];
      const { kind, assembly, name } = type;
      const abstract = type.abstract || false;

      const base = type.interfaces || [];
      if (type.base) {
        base.push(type.base);
      }

      types.push({
        kind,
        fqn,
        abstract,
        assembly,
        name,
        base,
        modules: this.getModuleNames(fqn),
        members: this.getMembers(type),
        initializer: this.getInitializer(type),
        properties: this.getProperties(type),
        methods: this.getMethods(type),
      });
    }

    const assembly = this.getAssembly(data);

    return { types, assembly };
  }

  join(results: JSIIParseResult[]): JSIIJoinResult {
    let types: TypeMetadata[] = [];
    let assemblies: AssemblyMetadata[] = [];

    for (const result of results) {
      types.push(...result.types);
      assemblies.push(result.assembly);
    }

    const version = this.getVersion(assemblies);
    if (typeof version === "undefined") {
      throw new Error("Could not find lib version");
    }

    return {
      version,
      assemblies,
      types,
    };
  }

  private getVersion(assemblies: AssemblyMetadata[]) {
    const libs = ["aws-cdk-lib", "cdktf", "cdk8s"];
    let retValue = assemblies.find((c) => libs.includes(c.name))?.version;

    if (retValue) {
      if (/^\d$/.test(retValue?.[0] || "")) {
        return retValue;
      }

      return retValue?.slice(1);
    }
  }

  private getAssembly(data: any) {
    const { name, version, dependencies } = data;

    const retValue: AssemblyMetadata = {
      name,
      version,
      dependencies,
    };

    return retValue;
  }

  private getModuleNames(fqn: string) {
    let modules = [fqn];
    const parts = fqn.split(".");
    if (parts[0].includes("/")) {
      modules = [parts[0].split("/").pop() || "", ...parts.slice(1, -1)];
    } else if (parts.length > 2) {
      modules = parts.slice(1, -1);
    } else {
      modules = parts.slice(0, -1);
    }

    return modules;
  }

  private getMembers(type: any) {
    const members: MemberMetadata[] = [];

    if (type.members) {
      for (const member of type.members) {
        const { name } = member;

        members.push({
          name,
        });
      }
    }

    return members.length === 0 ? undefined : members;
  }

  private getProperties(type: any) {
    const properties: PropertyMetadata[] = [];

    if (type.properties) {
      for (const property of type.properties) {
        const { name, optional, static: isStatic, type } = property;
        const docs = this.getDocs(property.docs);

        properties.push({
          name,
          type,
          optional: optional || false,
          static: isStatic || false,
          docs,
        });
      }
    }

    return properties.length === 0 ? undefined : properties;
  }

  private getMethods(type: any) {
    const methods: MethodMetadata[] = [];

    if (type.methods) {
      for (const method of type.methods) {
        const { name, parameters, returns, static: isStatic } = method;

        methods.push({
          name,
          static: isStatic || false,
          parameters,
          returns: returns ? returns.type : null,
        });
      }
    }

    return methods.length === 0 ? undefined : methods;
  }

  private getInitializer(type: any) {
    const initializer = this.getParameters(type.initializer?.parameters);

    if (initializer.length === 0) {
      return undefined;
    } else {
      return initializer;
    }
  }

  private getParameters(parameters: any[]) {
    const retValue: ParameterMetadata[] = [];
    if (!parameters) return retValue;

    for (const parameter of parameters) {
      const { name, type, optional, variadic } = parameter;
      const docs = this.getDocs(parameter.docs);
      const data: ParameterMetadata = {
        name,
        type,
        optional: optional || false,
        variadic: variadic || false,
      };

      if (docs) {
        data.docs = docs;
      }

      retValue.push(data);
    }

    return retValue;
  }

  private getDocs(docs: any) {
    if (!docs) return undefined;

    let { summary, default: defaultValue, see, custom } = docs;
    const retValue: DocsMetadata = { summary };

    if (defaultValue) {
      retValue.default = defaultValue.startsWith("-")
        ? defaultValue.slice(1)
        : defaultValue;
      retValue.default = (retValue.default || "").trim();
    }

    if (see) retValue.see = see;
    if (custom?.link) retValue.link = custom.link;

    return retValue;
  }
}
