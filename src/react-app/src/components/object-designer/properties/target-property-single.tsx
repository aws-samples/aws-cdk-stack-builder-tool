import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useCallback, useContext } from "react";
import { Utils } from "../../../utils";
import { ValueError } from "../../../project/validator";
import { SetValueAction } from "../../../project/actions";
import { ProjectContext } from "../../../project/project-context";
import { createSetValueAction } from "./target-property-utils";

export function TargetPropertySingle(props: {
  setValue: (action: SetValueAction) => void;
  valueString: string;
  titleString: string;
  keyName?: string;
  path: string[];
  errors: ValueError[];
}) {
  const { state } = useContext(ProjectContext);
  const hasErrors = props.errors.length > 0;

  const onCreate = useCallback(() => {
    props.setValue(
      createSetValueAction(
        state,
        props.valueString,
        props.path,
        props.keyName,
        undefined,
        false
      )
    );
  }, [props, state]);

  return (
    <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex items-stretch flex-grow focus-within:z-10">
        <input
          type="text"
          name={`property-${props.valueString}`}
          className={Utils.classNames(
            "cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm",
            hasErrors ? "border-red-500" : "border-gray-300"
          )}
          readOnly={true}
          placeholder={props.titleString}
          onClick={onCreate}
        />
      </div>
      <span className="relative z-0 inline-flex shadow-sm rounded-md">
        <button
          type="button"
          className={Utils.classNames(
            "-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-l-gray-300 text-sm font-medium rounded-r-md text-gray-700 border-gray-300 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10",
            hasErrors ? "border-red-500" : "border-gray-300"
          )}
          onClick={onCreate}
        >
          <PencilSquareIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </span>
    </div>
  );
}
