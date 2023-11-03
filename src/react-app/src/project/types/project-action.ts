import {
  AddItemAction,
  MoveItemAction,
  RemoveItemUpAction,
  SetDataAction,
  SetConstructIdAction,
  ToggleSelectAction,
  SetValueAction,
  ShowModalAction,
} from "../actions";
import { AddCallItemAction } from "../actions/add-call-item";
import { SetSettingsAction } from "../actions/set-settings";
import { SetViewAction } from "../actions/set-view";
import { UpdateDataAction } from "../actions/update-data";

export enum ProjectActionKind {
  SET_DATA = "SET_DATA",
  UPDATE_DATA = "UPDATE_DATA",
  SET_VIEW = "SET_VIEW",
  ADD_ITEM = "ADD_ITEM",
  ADD_CALL_ITEM = "ADD_CALL_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
  MOVE_ITEM = "MOVE_ITEM",
  TOGGLE_SELECT = "TOGGLE_SELECT",
  SET_STACK_NAME = "SET_STACK_NAME",
  SET_CONSTRUCT_ID = "SET_CONSTRUCT_ID",
  SET_VALUE = "SET_VALUE",
  SHOW_MODAL = "SHOW_MODAL",
  SET_SETTINGS = "SET_SETTINGS",
}

export type ProjectAction =
  | SetDataAction
  | UpdateDataAction
  | SetViewAction
  | AddItemAction
  | AddCallItemAction
  | RemoveItemUpAction
  | MoveItemAction
  | ToggleSelectAction
  | SetConstructIdAction
  | SetValueAction
  | ShowModalAction
  | SetSettingsAction;
