import { useCallback, useContext, useEffect, useMemo } from "react";
import { ProjectContext } from "../../../project/project-context";
import { FqnType, TypeTest } from "../../../types";
import { TargetPropertyValue } from "./target-property-value";
import { SetValueAction } from "../../../project/actions";
import { createSetValueAction, ValueStringUtil } from "./target-property-utils";
import { ValueError } from "../../../project/validator";
import { CoreValue, Values } from "../../../project/types/values";
import { TargetPropertySingle } from "./target-property-single";
import { Utils } from "../../../utils";
import { TypesHelper } from "../../../project/helpers/types-helper";

const typesHelper = new TypesHelper();

export function TargetProperty(props: {
  setValue: (action: SetValueAction) => void;
  keyName?: string;
  path: string[];
  currentValue?: CoreValue;
  defaultValue: string;
  type: FqnType | FqnType[];
  errors: ValueError[];
  indirect?: boolean;
}) {
  const { state } = useContext(ProjectContext);
  const hasErrors = props.errors.length > 0;

  const { targets, stackItems, otherStackItems } = useMemo(() => {
    const targets = typesHelper.getTargets(
      props.type,
      state.computed,
      state.types,
      state.constructFqns
    );

    const items = targets.items
      .filter((value) => {
        return (
          state.computed.selection.findIndex(
            (c) => c.valueId === value.valueId
          ) === -1
        );
      })
      .map((c) => {
        const item = state.computed.values[c.valueId];
        const parent = state.computed.values[item.parentId];
        const sortKey = `${parent?.valueName || "root"}.${item?.valueName}`;

        return {
          ...c,
          item,
          parent,
          sortKey,
        };
      });

    const stackItems = items
      .filter(
        (c) => c.parent && c.parent.value === state.computed.selectedContainer
      )
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    const otherStackItems = items
      .filter(
        (c) => c.parent && c.parent.value !== state.computed.selectedContainer
      )
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    return { targets, stackItems, otherStackItems };
  }, [state, props.type]);

  const onChange = useCallback(
    (event: React.FormEvent<HTMLSelectElement>) => {
      let value = (event.target as HTMLSelectElement).value;
      props.setValue(
        createSetValueAction(
          state,
          value,
          props.path,
          props.keyName,
          props.currentValue,
          props.indirect
        )
      );
    },
    [props, state]
  );

  useEffect(() => {
    if (!props.indirect || props.currentValue) return;

    if (targets.properties.length > 0) {
      const prop = targets.properties[0];
      props.setValue(
        createSetValueAction(
          state,
          ValueStringUtil.property(prop.fqn, prop.name),
          props.path,
          props.keyName,
          props.currentValue,
          props.indirect
        )
      );
    } else if (targets.constructs.length > 0) {
      const construct = targets.constructs[0];
      props.setValue(
        createSetValueAction(
          state,
          ValueStringUtil.createRef(construct.fqn),
          props.path,
          props.keyName,
          props.currentValue,
          props.indirect
        )
      );
    } else if (targets.classes.length > 0) {
      const cls = targets.classes[0];
      props.setValue(
        createSetValueAction(
          state,
          ValueStringUtil.class(cls.fqn),
          props.path,
          props.keyName,
          props.currentValue,
          props.indirect
        )
      );
    } else if (targets.interfaces.length > 0) {
      const intf = targets.interfaces[0];
      props.setValue(
        createSetValueAction(
          state,
          ValueStringUtil.interface(intf.fqn),
          props.path,
          props.keyName,
          props.currentValue,
          props.indirect
        )
      );
    } else if (targets.methods.length > 0) {
      const method = targets.methods[0];
      props.setValue(
        createSetValueAction(
          state,
          ValueStringUtil.method(method.fqn, method.name),
          props.path,
          props.keyName,
          props.currentValue,
          props.indirect
        )
      );
    }
  }, [props, state, targets]);

  let value = "";
  if (props.currentValue) {
    if (
      Values.isProperty(props.currentValue) &&
      TypeTest.isFqn(props.currentValue.valueType)
    ) {
      value = ValueStringUtil.property(
        props.currentValue.valueType.fqn,
        props.currentValue.property
      );
    } else if (
      Values.isRef(props.currentValue) &&
      TypeTest.isFqn(props.currentValue.valueType) &&
      props.currentValue.refValueId === ""
    ) {
      value = ValueStringUtil.createRef(props.currentValue.valueType.fqn);
    } else if (
      TypeTest.isFqn(props.currentValue.valueType) &&
      (Values.isObject(props.currentValue) ||
        Values.isInstance(props.currentValue) ||
        Values.isRef(props.currentValue))
    ) {
      if (!props.indirect) {
        return (
          <TargetPropertyValue
            setValue={props.setValue}
            keyName={props.keyName}
            path={props.path}
            currentValue={props.currentValue}
            errors={props.errors}
          />
        );
      } else {
        if (Values.isObject(props.currentValue)) {
          value = ValueStringUtil.interface(props.currentValue.valueType.fqn);
        } else if (Values.isInstance(props.currentValue)) {
          value = ValueStringUtil.class(props.currentValue.valueType.fqn);
        } else if (Values.isRef(props.currentValue)) {
          value = ValueStringUtil.ref(
            props.currentValue.valueType.fqn,
            props.currentValue.refValueId
          );
        }
      }
    } else if (Values.isCall(props.currentValue)) {
      if (!props.indirect) {
        return (
          <TargetPropertyValue
            setValue={props.setValue}
            keyName={props.keyName}
            path={props.path}
            currentValue={props.currentValue}
            errors={props.errors}
          />
        );
      } else {
        value = ValueStringUtil.method(
          props.currentValue.methodOfType.fqn,
          props.currentValue.method
        );
      }
    }
  }

  if (
    !props.indirect &&
    targets.items.length === 0 &&
    targets.constructs.length === 0 &&
    targets.methods.length === 0 &&
    targets.properties.length === 0 &&
    targets.classes.length + targets.interfaces.length === 1
  ) {
    let valueString = "";
    let titleString = "";
    if (targets.classes.length > 0) {
      const cls = targets.classes[0];
      valueString = ValueStringUtil.class(cls.fqn);
      titleString = `new ${state.types[cls.fqn].name}(...)`;
    } else {
      const inter = targets.interfaces[0];
      valueString = ValueStringUtil.interface(inter.fqn);
      titleString = `${state.types[inter.fqn].name}{...}`;
    }

    return (
      <TargetPropertySingle
        valueString={valueString}
        titleString={titleString}
        setValue={props.setValue}
        keyName={props.keyName}
        errors={props.errors}
        path={props.path}
      />
    );
  }

  return (
    <select
      name={`property-${props.keyName}`}
      className={Utils.classNames(
        "mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
        hasErrors
          ? "border-red-500"
          : typeof props.currentValue !== "undefined" && !props.indirect
          ? "border-emerald-500"
          : "border-gray-300"
      )}
      onChange={onChange}
      value={value}
    >
      {!props.indirect && (
        <>
          <option disabled={true}>Default</option>
          <option value="">{props.defaultValue}</option>
        </>
      )}
      {targets.properties.length > 0 && (
        <>
          <option disabled={true}>Values</option>
          {targets.properties.map((item) => (
            <option
              key={`${item.fqn}.${item.name}`}
              value={ValueStringUtil.property(item.fqn, item.name)}
            >
              {state.types[item.fqn].name}.{item.name}
            </option>
          ))}
        </>
      )}
      {stackItems.length > 0 && (
        <>
          <option disabled={true}>Stack Items</option>
          {stackItems.map((item) => (
            <option
              key={item.valueId}
              value={ValueStringUtil.ref(item.fqn, item.valueId)}
            >
              {item.item.valueName}
            </option>
          ))}
        </>
      )}
      {(targets.constructs.length > 0 ||
        targets.classes.length > 0 ||
        targets.interfaces.length > 0 ||
        targets.methods.length > 0) && (
        <>
          <option disabled={true}>Resources</option>
          {targets.constructs.map((construct) => {
            const type = state.types[construct.fqn];

            return (
              <option
                key={construct.fqn}
                value={ValueStringUtil.createRef(construct.fqn)}
              >
                new {type.name}(...) | {type.modules.join(".")}
              </option>
            );
          })}
          {targets.classes.map((cls) => {
            const type = state.types[cls.fqn];
            return (
              <option key={cls.fqn} value={ValueStringUtil.class(cls.fqn)}>
                new {type.name}(...) | {type.modules.join(".")}
              </option>
            );
          })}
          {targets.interfaces.map((inter) => {
            const type = state.types[inter.fqn];

            return (
              <option
                key={inter.fqn}
                value={ValueStringUtil.interface(inter.fqn)}
              >
                {type.name}
                {"{...}"} | {type.modules.join(".")}
              </option>
            );
          })}
          {targets.methods.map((item) => {
            const type = state.types[item.fqn];
            return (
              <option
                key={`${item.fqn}.${item.name}`}
                value={ValueStringUtil.method(item.fqn, item.name)}
              >
                {type.name}.{item.name}(...) | {type.modules.join(".")}
              </option>
            );
          })}
        </>
      )}
      {otherStackItems.length > 0 && (
        <>
          <option disabled={true}>Other Stacks</option>
          {otherStackItems.map((item) => (
            <option
              key={item.valueId}
              value={ValueStringUtil.ref(item.fqn, item.valueId)}
            >
              {item.sortKey}
            </option>
          ))}
        </>
      )}
    </select>
  );
}
