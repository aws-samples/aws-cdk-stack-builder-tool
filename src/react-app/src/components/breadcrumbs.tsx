import { useCallback, useContext } from "react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ProjectContext } from "../project/project-context";
import { ProjectActionKind } from "../project/types";

export function Breadcrumbs() {
  const { state, dispatch } = useContext(ProjectContext);

  const onClick = useCallback(
    (valueId?: string) => {
      if (valueId) {
        dispatch({
          kind: ProjectActionKind.TOGGLE_SELECT,
          payload: {
            valueId,
          },
        });
      } else {
        dispatch({
          kind: ProjectActionKind.TOGGLE_SELECT,
          payload: {},
        });
      }
    },
    [dispatch]
  );

  return (
    <nav className="mt-px h-12 shadow-sm bg-white border-b border-gray-200 flex">
      <ol className="w-full mx-auto flex pl-1">
        <li className="flex">
          <div className="flex items-center">
            <button
              className="p-4 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2"
              onClick={() => onClick()}
            >
              <HomeIcon
                className="-mt-px flex-shrink-0 h-5 w-5"
                aria-hidden="true"
              />
              <span>{state.metadata.projectName}</span>
            </button>
            <svg
              className="flex-shrink-0 w-6 h-full text-gray-200"
              viewBox="0 0 24 44"
              preserveAspectRatio="none"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
          </div>
        </li>
        {state.computed.containerPath.map((item, i) => (
          <li key={item.valueId} className="flex">
            <div className="flex items-center">
              {i > 0 && (
                <svg
                  className="flex-shrink-0 w-6 h-full text-gray-200"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
              )}
              <button
                className="p-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                onClick={() => onClick(item.valueId)}
              >
                {item.valueName}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
