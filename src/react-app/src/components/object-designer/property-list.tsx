import { useContext } from "react";
import { Property } from "./property";
import { SetValueAction } from "../../project/actions";
import { ConstrcutId } from "./construct-id";
import { ProjectContext } from "../../project/project-context";
import { CoreValue, Values } from "../../project/types/values";
import { SearchEmpty } from "../workbench/search-empty";
import { Utils } from "../../utils";
import { TypesHelper } from "../../project/helpers/types-helper";
import { ItemType } from "../../project/helpers/items-helper";
import { DetailsEmpty } from "../workbench/details-empty";

const typesHelper = new TypesHelper();

export function PropertyList(props: {
  setValue: (action: SetValueAction) => void;
  setFilter?: (filter: string) => void;
  filter?: string;
  modal: boolean;
  items: {
    path: string[];
    required: ItemType[];
    optional: ItemType[];
  };
  parent: CoreValue;
}) {
  const { state } = useContext(ProjectContext);
  const items = props.items;
  const isEmpty = items.required.length === 0 && items.optional.length === 0;

  let { construct, hasIdParam } = typesHelper.isConstruct(
    props.parent.valueType,
    state.types,
    state.constructFqns
  );

  const methodWithId =
    Values.isCall(props.parent) &&
    (hasIdParam || typeof props.parent.methodOfId !== "undefined");

  if (isEmpty) {
    return props.filter && props.filter.length > 0 ? (
      <SearchEmpty setFilter={props.setFilter} />
    ) : (
      <div className="h-full flex items-center justify-center bg-red">
        <DetailsEmpty />
      </div>
    );
  }

  return (
    <div
      className={Utils.classNames(
        isEmpty ? "h-full" : "",
        props.modal
          ? "grid grid-cols-[auto_1fr] gap-x-2 items-center min-w-[750px]"
          : "flex flex-col items-stretch gap-3 pb-10"
      )}
    >
      {(construct || methodWithId) && (
        <ConstrcutId modal={props.modal} value={props.parent} />
      )}

      {props.items.required.length > 0 && (
        <div className="relative col-span-2">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span
              className={Utils.classNames(
                props.modal ? "bg-white" : "bg-gray-100",
                "px-3 text-gray-900"
              )}
            >
              Required
            </span>
          </div>
        </div>
      )}
      {props.items.required.map((item) => (
        <Property
          setValue={props.setValue}
          key={item.name}
          item={item}
          parent={props.parent}
          path={props.items.path}
          modal={props.modal}
        />
      ))}
      {((props.items.required.length > 0 && props.items.optional.length > 0) ||
        (construct && props.items.optional.length > 0)) && (
        <div className="relative col-span-2">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span
              className={Utils.classNames(
                props.modal ? "bg-white" : "bg-gray-100",
                "px-3 text-gray-900"
              )}
            >
              Optional
            </span>
          </div>
        </div>
      )}
      <>
        {props.items.optional.map((item) => (
          <Property
            setValue={props.setValue}
            key={item.name}
            item={item}
            parent={props.parent}
            path={props.items.path}
            modal={props.modal}
          />
        ))}
      </>
    </div>
  );
}
