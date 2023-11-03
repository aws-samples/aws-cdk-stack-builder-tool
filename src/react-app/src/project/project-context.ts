import { createContext } from "react";
import { ProjectAction, ProjectState } from "./types";
import {
  isAddItemAction,
  isAddCallItemAction,
  isMoveItemAction,
  isRemoveItemUpAction,
  isSetConstructIdAction,
  isToggleSelectAction,
  isSetDataAction,
  isUpdateDataAction,
  isSetValueAction,
  isShowModalAction,
  isSetSettingsAction,
  addItem,
  addCallItem,
  moveItem,
  removeItem,
  setConstructId,
  toggleSelect,
  setData,
  updateData,
  showModal,
  setValue,
  setSettings,
} from "./actions";
import { isSetViewAction, setView } from "./actions/set-view";
import { InstanceValue, ValueKind } from "./types/values";
import { PROJECT_FORMAT_VERSION } from "./types/versions";

const root: InstanceValue = {
  kind: ValueKind.Instance,
  valueId: "",
  valueName: "",
  valueType: {
    fqn: "",
  },
  parameters: {},
  children: [],
};

export const initialState: ProjectState = {
  loaded: false,
  metadata: {
    format: PROJECT_FORMAT_VERSION,
    projectName: "",
    projectId: "",
  },
  settings: {
    language: "typescript",
    directoryHandle: null,
  },
  version: "",
  blueprint: {
    extend: "",
    id: "",
    name: "",
    libs: {},
    containers: [],
    favorites: [],
    rules: {},
  },
  blueprintComputed: {
    platform: "cdk",
    libs: {},
    containers: [],
    favorites: [],
    rules: {},
  },
  root,
  assemblies: [],
  libs: {},
  types: {},
  modules: {},
  constructFqns: new Set(),
  view: "workbench",
  modal: false,
  selectionIds: [],
  computed: {
    errors: {},
    values: {},
    selectedContainer: root,
    selectedRootValue: {
      valueId: "",
      parentId: "",
      parentKey: "",
      value: root,
      childrenIds: [],
    },
    selectedValue: null,
    selection: [],
    containerPath: [],
    valuePath: [],
  },
};

export const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

export function projectReducer(
  state: ProjectState,
  action: ProjectAction
): ProjectState {
  if (isSetDataAction(action)) {
    return setData(state, action);
  }
  if (isUpdateDataAction(action)) {
    return updateData(state, action);
  } else if (isSetViewAction(action)) {
    return setView(state, action);
  } else if (isToggleSelectAction(action)) {
    return toggleSelect(state, action);
  } else if (isAddItemAction(action)) {
    return addItem(state, action);
  } else if (isAddCallItemAction(action)) {
    return addCallItem(state, action);
  } else if (isRemoveItemUpAction(action)) {
    return removeItem(state, action);
  } else if (isMoveItemAction(action)) {
    return moveItem(state, action);
  } else if (isSetConstructIdAction(action)) {
    return setConstructId(state, action);
  } else if (isSetValueAction(action)) {
    return setValue(state, action);
  } else if (isShowModalAction(action)) {
    return showModal(state, action);
  } else if (isSetSettingsAction(action)) {
    return setSettings(state, action);
  }

  return state;
}
