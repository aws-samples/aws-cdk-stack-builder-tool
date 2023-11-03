import { useCallback, useContext } from "react";
import { CoreValue } from "../../project/types/values";
import { ProjectContext } from "../../project/project-context";
import { ProjectActionKind } from "../../project/types";
import { TypeTest } from "../../types";
import { BlurInput } from "../blur-input";
import { DocumentationLink } from "../documentation-link";

export function ConstrcutId(props: { modal: boolean; value: CoreValue }) {
  const { state, dispatch } = useContext(ProjectContext);

  const typeMetadata = TypeTest.isFqn(props.value.valueType)
    ? state.types[props.value.valueType.fqn]
    : null;

  const onChange = useCallback(
    (value: string) => {
      dispatch({
        kind: ProjectActionKind.SET_CONSTRUCT_ID,
        payload: {
          valueId: props.value.valueId,
          valueName: value,
        },
      });
    },
    [dispatch, props.value.valueId]
  );

  if (!props.modal) {
    return (
      <div className="mb-1 mt-2">
        <div className="flex justify-between">
          <label className="block text-sm font-medium text-gray-700">Id</label>
          {typeMetadata && <DocumentationLink fqn={typeMetadata.fqn} />}
        </div>

        <BlurInput
          onChange={onChange}
          value={props.value.valueName || ""}
          name="properties-x-name"
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          restoreIfEmpty={true}
          trim={true}
        />
      </div>
    );
  } else {
    return (
      <>
        <div className="px-2 py-1">
          <label className="block text-sm font-medium text-gray-700">Id</label>
        </div>
        <div className="px-2 py-1">
          <BlurInput
            onChange={onChange}
            value={props.value.valueName || ""}
            name="properties-x-name"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            restoreIfEmpty={true}
            trim={true}
          />
        </div>
      </>
    );
  }
}
