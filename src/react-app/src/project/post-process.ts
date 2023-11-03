import { ProjectService } from "./project-service";
import { Computed, BlueprintComputed, ProjectState } from "./types";
import { TypeMetadata } from "../types";
import { Validator } from "./validator";
import {
  CoreValue,
  InstanceValue,
  ValueMetadata,
  Values,
} from "./types/values";
import { TypesHelper } from "./helpers/types-helper";

const projectService = new ProjectService();
const typesHelper = new TypesHelper();

export function postProcess(state: ProjectState) {
  const computed = computeState(
    state.root,
    state.selectionIds,
    state.types,
    state.blueprintComputed
  );

  state.computed = computed;
  projectService.save(state, false);
}

export function computeState(
  root: InstanceValue,
  selectionIds: string[],
  types: {
    [fqn: string]: TypeMetadata;
  },
  blueprintComputed: BlueprintComputed
): Computed {
  const values = traverseValueTree(root);
  const selection = computeSelection(
    root,
    selectionIds,
    values,
    types,
    blueprintComputed
  );

  const errors =
    Object.keys(types).length > 0
      ? Validator.validate(root, values, types)
      : {};

  return {
    errors,
    values,
    ...selection,
  };
}

export function computeSelection(
  root: InstanceValue,
  selectionIds: string[],
  values: {
    [valueId: string]: ValueMetadata;
  },
  types: { [fqn: string]: TypeMetadata },
  blueprintComputed: BlueprintComputed
) {
  const selection = selectionIds.map((valueId) => {
    const item = values[valueId];

    if (Values.isRef(item.value)) {
      return values[item.value.refValueId];
    }

    return item;
  });

  const len = selection.length;
  const containerPath: ValueMetadata[] = [];
  const valuePath: ValueMetadata[] = [];
  let selectedContainer: InstanceValue | null = null;
  let selectedRootValue: ValueMetadata | null = null;
  const selectedValue = len > 0 ? selection[len - 1] : values[root.valueId];

  let idx = -1;
  for (let i = 0; i < len; i++) {
    const item = selection[i];
    const { value } = item;

    if (!Values.isInstance(value)) break;
    if (!typesHelper.isContainerType(types, blueprintComputed, value.valueType))
      break;

    idx = i;
    selectedContainer = value;
    containerPath.push(item);
  }

  selectedContainer = selectedContainer || root;
  const selectedContainerMetadata = values[selectedContainer.valueId];

  if (idx < len - 1) {
    selectedRootValue = selection[idx + 1];
    const isRootValueContainerOwnProperty =
      selectedContainer.children.findIndex(
        (item) =>
          item.valueId === selectedRootValue?.valueId ||
          (Values.isRef(item) && item.refValueId === selectedRootValue?.valueId)
      ) === -1;

    if (isRootValueContainerOwnProperty) {
      selectedRootValue = selectedContainerMetadata;
    }
  }

  if (!selectedRootValue) {
    selectedRootValue = selectedContainerMetadata;
  }

  idx = selection.indexOf(selectedRootValue);
  if (idx < 0) {
    valuePath.push(values[root.valueId]);
    idx = 0;
  }

  for (let i = idx; i < len; i++) {
    valuePath.push(selection[i]);
  }

  return {
    selection,
    selectedValue,
    selectedContainer,
    selectedRootValue,
    containerPath,
    valuePath,
  };
}

function traverseValueTree(root: CoreValue) {
  const data: { [valueId: string]: ValueMetadata } = {};
  const children = getValueChildren(root);
  const childrenIds = children.map((c) => c.valueId);

  data[root.valueId] = {
    valueId: root.valueId,
    valueName: root.valueName,
    parentId: "",
    parentKey: "",
    value: root,
    childrenIds,
  };

  traverseValueTreeIntl(children, data);

  return data;
}

function traverseValueTreeIntl(
  values: ValueMetadata[],
  data: { [valueId: string]: ValueMetadata }
) {
  for (const item of values) {
    const children = getValueChildren(item.value);
    const childrenIds = children.map((c) => c.valueId);

    data[item.valueId] = {
      ...item,
      childrenIds,
    };

    traverseValueTreeIntl(children, data);
  }
}

function getValueChildren(value: CoreValue) {
  const retValue: ValueMetadata[] = [];
  const parentId = value.valueId;

  let pairs: { [key: string]: CoreValue } = {};
  let items: CoreValue[] = [];

  if (Values.isObject(value)) {
    pairs = value.properties;
  } else if (Values.isInstance(value)) {
    pairs = value.parameters;
    items = value.children;
  } else if (Values.isCall(value)) {
    pairs = value.parameters;
  } else if (Values.isArray(value)) {
    items = value.items;
  } else if (Values.isMap(value)) {
    pairs = value.pairs;
  }

  for (const key of Object.keys(pairs)) {
    const current = pairs[key];

    retValue.push({
      valueId: current.valueId,
      parentId,
      parentKey: key,
      value: current,
      childrenIds: [],
    });
  }

  for (let i = 0; i < items.length; i++) {
    const current = items[i];

    retValue.push({
      valueId: current.valueId,
      valueName: current.valueName,
      parentId,
      parentKey: i.toString(),
      value: current,
      childrenIds: [],
    });
  }

  return retValue;
}
