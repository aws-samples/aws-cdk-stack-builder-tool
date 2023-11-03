import { useContext } from "react";
import { ProjectContext } from "../../project/project-context";
import { FqnType, Type, TypeTest } from "../../types";
import { ArrayProperty } from "./properties/array-property";
import { BooleanProperty } from "./properties/boolean-property";
import { EnumProperty } from "./properties/enum-property";
import { MapProperty } from "./properties/map-property";
import { NumberProperty } from "./properties/number-property";
import { StringProperty } from "./properties/string-property";
import { TargetProperty } from "./properties/target-property";
import { UnknownProperty } from "./properties/unknown-property";
import { SetValueAction } from "../../project/actions";
import { CoreValue } from "../../project/types/values";
import { ValueError } from "../../project/validator";

export function PropertyValue(props: {
  keyName?: string;
  path: string[];
  type: Type;
  currentValue?: CoreValue;
  defaultValue: string;
  errors: ValueError[];
  indirect?: boolean;
  onReturn?: () => void;
  setValue: (action: SetValueAction) => void;
}) {
  const { state } = useContext(ProjectContext);
  let { type } = props;

  if (TypeTest.isUnion(type)) {
    const types = type.union.types.filter(
      (t) => !(TypeTest.isFqn(t) && t.fqn.includes(".IResolvable"))
    );

    if (types.length === 1) {
      type = types[0];
    } else {
      const targetType = type.union.types.find(
        (c) => TypeTest.isPrimitive(c) || TypeTest.isCollection(c)
      );

      if (targetType) {
        type = targetType;
      } else {
        const fqnTypes = type.union.types.filter((c): c is FqnType =>
          TypeTest.isFqn(c)
        );

        if (fqnTypes.length > 0) {
          return (
            <TargetProperty
              setValue={props.setValue}
              keyName={props.keyName}
              path={props.path}
              type={fqnTypes}
              currentValue={props.currentValue}
              defaultValue={props.defaultValue}
              errors={props.errors}
              indirect={props.indirect}
            />
          );
        }
      }
    }
  }

  if (TypeTest.isPrimitive(type)) {
    if (type.primitive === "any") type = { primitive: "string" };
    else if (type.primitive === "bigint") type = { primitive: "number" };
  }

  if (TypeTest.isFqn(type)) {
    const typeMetadata = state.types[type.fqn];

    if (typeMetadata.kind === "class" || typeMetadata.kind === "interface") {
      return (
        <TargetProperty
          setValue={props.setValue}
          keyName={props.keyName}
          path={props.path}
          type={type}
          currentValue={props.currentValue}
          defaultValue={props.defaultValue}
          errors={props.errors}
          indirect={props.indirect}
        />
      );
    } else if (typeMetadata.kind === "enum") {
      return (
        <EnumProperty
          setValue={props.setValue}
          keyName={props.keyName}
          path={props.path}
          type={type}
          currentValue={props.currentValue}
          defaultValue={props.defaultValue}
          errors={props.errors}
          indirect={props.indirect}
        />
      );
    }
  } else if (TypeTest.isPrimitive(type)) {
    const primitive = type.primitive;

    if (primitive === "boolean") {
      return (
        <BooleanProperty
          setValue={props.setValue}
          keyName={props.keyName}
          path={props.path}
          currentValue={props.currentValue}
          defaultValue={props.defaultValue}
          errors={props.errors}
          indirect={props.indirect}
        />
      );
    } else if (primitive === "string") {
      return (
        <StringProperty
          setValue={props.setValue}
          onReturn={props.onReturn}
          keyName={props.keyName}
          path={props.path}
          currentValue={props.currentValue}
          defaultValue={props.defaultValue}
          errors={props.errors}
          indirect={props.indirect}
        />
      );
    } else if (primitive === "number") {
      return (
        <NumberProperty
          setValue={props.setValue}
          onReturn={props.onReturn}
          keyName={props.keyName}
          path={props.path}
          currentValue={props.currentValue}
          defaultValue={props.defaultValue}
          errors={props.errors}
          indirect={props.indirect}
        />
      );
    }
  } else if (TypeTest.isCollection(type)) {
    if (type.collection.kind === "array") {
      return (
        <ArrayProperty
          setValue={props.setValue}
          keyName={props.keyName}
          path={props.path}
          type={type}
          currentValue={props.currentValue}
          defaultValue={props.defaultValue}
          errors={props.errors}
          indirect={props.indirect}
        />
      );
    } else if (type.collection.kind === "map") {
      return (
        <MapProperty
          setValue={props.setValue}
          keyName={props.keyName}
          path={props.path}
          type={type}
          currentValue={props.currentValue}
          defaultValue={props.defaultValue}
          errors={props.errors}
          indirect={props.indirect}
        />
      );
    }
  }

  return (
    <UnknownProperty
      keyName={props.keyName}
      errors={props.errors}
      text={JSON.stringify(type)}
    />
  );
}
