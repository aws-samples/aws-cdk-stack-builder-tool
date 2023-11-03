import { ProjectAction, ProjectActionKind, ProjectState } from "../types";
import {
  CallValue,
  CoreValue,
  InstanceValue,
  ValueKind,
  Values,
} from "../types/values";
import { postProcess } from "../post-process";
import { Utils } from "../../utils";
import { ValuesHelper } from "../helpers/values-helper";

const valuesHelper = new ValuesHelper();

export interface SetValueAction {
  kind: ProjectActionKind.SET_VALUE;
  payload: {
    path: string[];
    key?: string;
    create?: {
      fqn: string;
      method?: string;
    };
    select?: boolean;
    value?: CoreValue;
    oldValue?: CoreValue;
  };
}

export function isSetValueAction(
  action: ProjectAction
): action is SetValueAction {
  return action.kind === ProjectActionKind.SET_VALUE;
}

export function setValue(
  state: ProjectState,
  action: SetValueAction
): ProjectState {
  const { path, key, create, value, oldValue, select } = action.payload;
  const { values, selectedContainer, selectedValue, selectedRootValue } =
    state.computed;
  if (!selectedValue) return state;

  const valuePath = valuesHelper.resolvePropertyPath(
    state.types,
    path,
    selectedValue.value
  );

  const index = selectedContainer.children.indexOf(selectedRootValue.value);
  const valuesToAdd: CoreValue[] = [];

  if (create) {
    const typeMetdata = state.types[create.fqn];
    const valueName = valuesHelper.generateValueName(
      selectedContainer.children,
      typeMetdata.name
    );

    if (!create.method) {
      const construct: InstanceValue = {
        kind: ValueKind.Instance,
        valueId: Utils.generateId(),
        valueName,
        valueType: {
          fqn: create.fqn,
        },
        children: [],
        parameters: {},
      };

      valuesToAdd.push(construct);
      if (value && Values.isRef(value)) {
        value.refValueId = construct.valueId;
      }
    } else {
      const methodMetadata = state.types[create.fqn].methods?.find(
        (c) => c.name === create.method
      );

      if (!methodMetadata) {
        throw new Error(`Method ${create.method} not found in ${create.fqn}`);
      }

      const method: CallValue = {
        kind: ValueKind.Call,
        valueId: Utils.generateId(),
        valueName,
        valueType: methodMetadata.returns || { fqn: "void" },
        methodOfType: { fqn: create.fqn },
        methodPath: [],
        method: create.method,
        parameters: {},
      };

      valuesToAdd.push(method);
      if (value && Values.isRef(value)) {
        value.refValueId = method.valueId;
      }
    }
  }

  valuesHelper.setSubValue(valuePath, key, value, oldValue);
  valuesHelper.clearValuePath(valuePath);

  let retValue: ProjectState = {
    ...state,
  };

  if (valuesToAdd.length > 0) {
    const items = [...selectedContainer.children];
    items.splice(index + 1, 0, ...valuesToAdd);

    if (state.root.valueId === selectedContainer.valueId) {
      retValue = {
        ...state,
        root: {
          ...state.root,
          children: items,
        },
      };
    } else {
      const valueMetadata = values[selectedContainer.valueId];
      const parent = values[valueMetadata.parentId];
      if (Values.isInstance(parent.value)) {
        const parentContainer = parent.value;
        parentContainer.children = parentContainer.children.map((item) => {
          if (item.valueId !== selectedContainer.valueId) {
            return item;
          }

          return {
            ...item,
            children: items,
          };
        });
      }
    }
  }

  if (select && value) {
    retValue.selectionIds = [...retValue.selectionIds, value.valueId];
    retValue.modal = true;
  }

  postProcess(retValue);

  return retValue;
}
