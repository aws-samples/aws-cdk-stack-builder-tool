import { FqnType, Type } from "../../types";

export type CoreValue =
  | RefValue
  | PrimitiveValue
  | ObjectValue
  | InstanceValue
  | MemberValue
  | PropertyValue
  | CallValue
  | ArrayValue
  | MapValue;

export enum ValueKind {
  Ref = "ref",
  Primitive = "primitive",
  Object = "object",
  Instance = "instance",
  Member = "member",
  Property = "property",
  Call = "call",
  Array = "array",
  Map = "map",
}

interface ValueBase {
  kind: ValueKind;
  valueId: string;
  valueType: Type;
  valueName?: string;
}

export interface RefValue extends ValueBase {
  kind: ValueKind.Ref;
  refValueId: string;
}

export interface PrimitiveValue extends ValueBase {
  kind: ValueKind.Primitive;
  value: string | number | boolean;
}

export interface ObjectValue extends ValueBase {
  kind: ValueKind.Object;
  valueType: FqnType;
  properties: { [key: string]: CoreValue };
}

export interface InstanceValue extends ValueBase {
  kind: ValueKind.Instance;
  valueType: FqnType;
  children: CoreValue[];
  parameters: { [key: string]: CoreValue };
}

export interface MemberValue extends ValueBase {
  kind: ValueKind.Member;
  valueType: FqnType;
  member: string;
}

export interface PropertyValue extends ValueBase {
  kind: ValueKind.Property;
  propertyOfType: FqnType;
  propertyOfId?: string;
  property: string;
}

export interface CallValue extends ValueBase {
  kind: ValueKind.Call;
  methodOfType: FqnType;
  methodOfId?: string;
  methodPath: string[];
  method: string;
  parameters: { [key: string]: CoreValue };
}

export interface ArrayValue extends ValueBase {
  kind: ValueKind.Array;
  items: CoreValue[];
}

export interface MapValue extends ValueBase {
  kind: ValueKind.Map;
  pairs: { [key: string]: CoreValue };
}

export interface ValueMetadata {
  valueId: string;
  valueName?: string;
  parentId: string;
  parentKey: string;
  value: CoreValue;
  childrenIds: string[];
}

export class Values {
  static isObject(value?: CoreValue): value is ObjectValue {
    if (!value) return false;
    return value.kind === ValueKind.Object;
  }

  static isInstance(value?: CoreValue): value is InstanceValue {
    if (!value) return false;
    return value.kind === ValueKind.Instance;
  }

  static isPrimitive(value?: CoreValue): value is PrimitiveValue {
    if (!value) return false;
    return value.kind === ValueKind.Primitive;
  }

  static isMember(value?: CoreValue): value is MemberValue {
    if (!value) return false;
    return value.kind === ValueKind.Member;
  }

  static isProperty(value?: CoreValue): value is PropertyValue {
    if (!value) return false;
    return value.kind === ValueKind.Property;
  }

  static isCall(value?: CoreValue): value is CallValue {
    if (!value) return false;
    return value.kind === ValueKind.Call;
  }

  static isArray(value?: CoreValue): value is ArrayValue {
    if (!value) return false;
    return value.kind === ValueKind.Array;
  }

  static isMap(value?: CoreValue): value is MapValue {
    if (!value) return false;
    return value.kind === ValueKind.Map;
  }

  static isRef(value?: CoreValue): value is RefValue {
    if (!value) return false;
    return value.kind === ValueKind.Ref;
  }
}
