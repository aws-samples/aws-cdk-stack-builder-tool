import { SetValueAction } from "../../../project/actions";
import { ProjectActionKind, ProjectState } from "../../../project/types";
import { TypeTest } from "../../../types";
import { CoreValue, ValueKind } from "../../../project/types/values";
import { Utils } from "../../../utils";
import { TypesHelper } from "../../../project/helpers/types-helper";

const typesHelper = new TypesHelper();

enum Prefix {
  DELIMITER = ":@:",
  REF = "ref::",
  CREATE_REF = "create::ref::",
  PROPERTY = "property::",
  INTERFACE = "interface::",
  CLASS = "calss::",
  METHOD = "method::",
}

export function createSetValueAction(
  state: ProjectState,
  value: string,
  path: string[],
  keyName?: string,
  currentValue?: CoreValue,
  indirect?: boolean
): SetValueAction {
  if (value.length === 0) {
    return {
      kind: ProjectActionKind.SET_VALUE,
      payload: {
        key: keyName,
        path,
        oldValue: currentValue,
      },
    };
  } else if (value.startsWith(Prefix.PROPERTY)) {
    const [fqn, property] = value
      .replace(Prefix.PROPERTY, "")
      .split(Prefix.DELIMITER);

    return {
      kind: ProjectActionKind.SET_VALUE,
      payload: {
        key: keyName,
        path,
        oldValue: currentValue,
        value: {
          kind: ValueKind.Property,
          valueId: currentValue?.valueId ?? Utils.generateId(),
          propertyOfType: {
            fqn,
          },
          valueType: {
            fqn,
          },
          property,
        },
      },
    };
  } else if (value.startsWith(Prefix.REF)) {
    const [fqn, refValueId] = value
      .replace(Prefix.REF, "")
      .split(Prefix.DELIMITER);

    return {
      kind: ProjectActionKind.SET_VALUE,
      payload: {
        key: keyName,
        path,
        oldValue: currentValue,
        value: {
          kind: ValueKind.Ref,
          valueId: currentValue?.valueId ?? Utils.generateId(),
          valueType: {
            fqn,
          },
          refValueId: refValueId,
        },
      },
    };
  } else if (value.startsWith(Prefix.CREATE_REF)) {
    const fqn = value.replace(Prefix.CREATE_REF, "");

    return {
      kind: ProjectActionKind.SET_VALUE,
      payload: {
        key: keyName,
        path,
        create: { fqn },
        oldValue: currentValue,
        select: true,
        value: {
          kind: ValueKind.Ref,
          valueId: currentValue?.valueId ?? Utils.generateId(),
          valueType: {
            fqn,
          },
          refValueId: "",
        },
      },
    };
  } else if (value.startsWith(Prefix.INTERFACE)) {
    const fqn = value.replace(Prefix.INTERFACE, "");

    return {
      kind: ProjectActionKind.SET_VALUE,
      payload: {
        key: keyName,
        path,
        select: true && !indirect,
        oldValue: currentValue,
        value: {
          kind: ValueKind.Object,
          valueId: currentValue?.valueId ?? Utils.generateId(),
          valueType: {
            fqn,
          },
          properties: {},
        },
      },
    };
  } else if (value.startsWith(Prefix.CLASS)) {
    const fqn = value.replace(Prefix.CLASS, "");

    return {
      kind: ProjectActionKind.SET_VALUE,
      payload: {
        key: keyName,
        path,
        select: true && !indirect,
        oldValue: currentValue,
        value: {
          kind: ValueKind.Instance,
          valueId: currentValue?.valueId ?? Utils.generateId(),
          valueType: {
            fqn,
          },
          children: [],
          parameters: {},
        },
      },
    };
  } else if (value.startsWith(Prefix.METHOD)) {
    const [fqn, method] = value
      .replace(Prefix.METHOD, "")
      .split(Prefix.DELIMITER);

    const valueId = currentValue?.valueId ?? Utils.generateId();
    const methodMetadata = state.types[fqn].methods?.find(
      (c) => c.name === method
    );

    if (!methodMetadata) {
      throw new Error(`Method ${method} not found in ${fqn}`);
    }

    if (methodMetadata.returns && TypeTest.isFqn(methodMetadata.returns)) {
      const { construct } = typesHelper.isConstruct(
        methodMetadata.returns,
        state.types,
        state.constructFqns
      );

      if (construct) {
        return {
          kind: ProjectActionKind.SET_VALUE,
          payload: {
            key: keyName,
            path,
            create: {
              fqn,
              method,
            },
            oldValue: currentValue,
            select: true,
            value: {
              kind: ValueKind.Ref,
              valueId,
              valueType: methodMetadata.returns,
              refValueId: "",
            },
          },
        };
      }
    }

    const returns = methodMetadata.returns || { fqn: "void" };

    return {
      kind: ProjectActionKind.SET_VALUE,
      payload: {
        key: keyName,
        path,
        select: true && !indirect,
        oldValue: currentValue,
        value: {
          kind: ValueKind.Call,
          valueId,
          valueType: returns,
          methodOfType: {
            fqn,
          },
          methodPath: [],
          method,
          parameters: {},
        },
      },
    };
  }

  throw new Error(`Invalid value: ${value}`);
}

export class ValueStringUtil {
  static property(fqn: string, property: string) {
    return `${Prefix.PROPERTY}${fqn}${Prefix.DELIMITER}${property}`;
  }

  static ref(fqn: string, refValueId: string) {
    return `${Prefix.REF}${fqn}${Prefix.DELIMITER}${refValueId}`;
  }

  static createRef(fqn: string) {
    return `${Prefix.CREATE_REF}${fqn}`;
  }

  static class(fqn: string) {
    return `${Prefix.CLASS}${fqn}`;
  }

  static interface(fqn: string) {
    return `${Prefix.INTERFACE}${fqn}`;
  }

  static method(fqn: string, method: string) {
    return `${Prefix.METHOD}${fqn}${Prefix.DELIMITER}${method}`;
  }
}
