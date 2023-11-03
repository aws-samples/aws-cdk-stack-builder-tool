import { DocumentIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react";
import { Utils } from "../../utils";
import { ProjectBlueprint } from "../../project/types/project-blueprint";

export function Blueprints(props: {
  multicolumn: boolean;
  selectedBlueprintId: string;
  blueprints: ProjectBlueprint[];
  limit?: number;
  setSelectedBlueprintId: (blueprint: string) => void;
}) {
  const onSelectClick = useCallback(
    (id: string) => {
      props.setSelectedBlueprintId(id);
    },
    [props]
  );

  const blueprints = props.limit
    ? props.blueprints.slice(0, props.limit)
    : props.blueprints;

  return (
    <ul
      className={Utils.classNames(
        "grid gap-6",
        props.multicolumn ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      )}
    >
      {blueprints.map((blueprint) => (
        <li key={blueprint.id} className="flow-root">
          <div
            className={Utils.classNames(
              "cursor-pointer border relative -m-2 p-2 flex items-center space-x-4 rounded-xl hover:bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500",
              blueprint.id === props.selectedBlueprintId
                ? "border-indigo-300 bg-gray-50"
                : "border-transparent hover:border-indigo-300"
            )}
            onClick={() => onSelectClick(blueprint.id)}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-lg"
              style={{ backgroundColor: blueprint.background || "#000000" }}
            >
              {blueprint.icon ? (
                <img
                  alt="icon"
                  className="h-6 w-6"
                  src={`data:image/svg+xml;base64,${blueprint.icon}`}
                />
              ) : (
                <DocumentIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                {blueprint.name || "Untitled"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {blueprint.description || <>&nbsp;</>}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
