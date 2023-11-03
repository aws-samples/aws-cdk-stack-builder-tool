import { computeSelection } from "../post-process";
import { ProjectAction, ProjectActionKind, ProjectState } from "../types";

export interface ToggleSelectAction {
  kind: ProjectActionKind.TOGGLE_SELECT;
  payload: {
    valueId?: string;
    clearModal?: boolean;
  };
}

export function isToggleSelectAction(
  action: ProjectAction
): action is ToggleSelectAction {
  return action.kind === ProjectActionKind.TOGGLE_SELECT;
}

export function toggleSelect(
  state: ProjectState,
  action: ToggleSelectAction
): ProjectState {
  const { valueId, clearModal } = action.payload;
  const { selection, selectedContainer, selectedRootValue } = state.computed;
  let selectionIds = [...state.selectionIds];
  let modal = false;

  if (valueId) {
    const idx = selection.findIndex((c) => c.valueId === valueId);
    if (idx >= 0) {
      selectionIds.splice(idx + 1);
    } else {
      if (selectedContainer.children.find((c) => c.valueId === valueId)) {
        const idx = selection.findIndex(
          (c) => c.valueId === selectedContainer.valueId
        );
        selectionIds.splice(idx + 1);
      }

      selectionIds.push(valueId);
    }
  } else if (clearModal) {
    const idx = selection.findIndex(
      (c) => c.valueId === selectedRootValue.valueId
    );

    if (idx >= 0) {
      selectionIds.splice(idx + 1);
    } else {
      selectionIds = [];
    }
  } else {
    selectionIds = [];
  }

  const computed = computeSelection(
    state.root,
    selectionIds,
    state.computed.values,
    state.types,
    state.blueprintComputed
  );

  if (
    computed.selectedValue &&
    computed.selectedValue.valueId !== computed.selectedRootValue.valueId
  ) {
    modal = true;
  }

  const retValue: ProjectState = {
    ...state,
    selectionIds,
    modal,
    computed: {
      ...state.computed,
      ...computed,
    },
  };

  return retValue;
}
