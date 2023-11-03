import { useContext, useMemo } from "react";
import { ProjectContext } from "../../project/project-context";
import { TypeTest } from "../../types";
import { ArrayDesigner } from "./designers/array-designer";
import { MapDesigner } from "./designers/map-designer";
import { Values } from "../../project/types/values";
import { ItemsHelper } from "../../project/helpers/items-helper";
import { PropertyList } from "./property-list";

const itemsHelper = new ItemsHelper();

export function ObjectDesigner(props: {
  modal: boolean;
  filter?: string;
  setFilter?: (filter: string) => void;
}) {
  const { state, dispatch } = useContext(ProjectContext);
  const selected = props.modal
    ? state.computed.selectedValue
    : state.computed.selectedRootValue;

  const items = useMemo(() => {
    if (!selected) return null;
    return itemsHelper.getItems(state.types, selected.value, props.filter);
  }, [props.filter, selected, state]);

  if (!selected) return null;

  if (TypeTest.isCollection(selected.value.valueType)) {
    const elementType = selected.value.valueType.collection.elementtype;
    if (selected.value.valueType.collection.kind === "array") {
      return (
        <ArrayDesigner
          modal={props.modal}
          parent={selected.value}
          elementType={elementType}
        />
      );
    } else if (selected.value.valueType.collection.kind === "map") {
      return (
        <MapDesigner
          modal={props.modal}
          parent={selected.value}
          elementType={elementType}
        />
      );
    }
  }

  if (
    Values.isInstance(selected.value) ||
    Values.isObject(selected.value) ||
    Values.isCall(selected.value)
  ) {
    if (!items) {
      throw new Error(`Could not find items for ${selected.value.valueType}`);
    }

    return (
      <PropertyList
        items={items}
        parent={selected.value}
        modal={props.modal}
        setValue={dispatch}
        filter={props.filter}
        setFilter={props.setFilter}
      />
    );
  }

  return <>Unknown</>;
}
