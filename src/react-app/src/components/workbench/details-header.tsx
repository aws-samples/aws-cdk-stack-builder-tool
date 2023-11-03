import { useCallback, useContext, useTransition } from "react";
import { CubeIcon, BoltIcon } from "@heroicons/react/24/solid";
import { ProjectContext } from "../../project/project-context";
import { Utils } from "../../utils";

export function DetailsHeader(props: {
  fqn: string;
  filter: string;
  tab: string;
  setFilter: (filter: string) => void;
  setTab: (tabName: string) => void;
}) {
  const { state } = useContext(ProjectContext);
  const [, startTransition] = useTransition();
  const typeMetadata = state.types[props.fqn];

  const onSetFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        props.setFilter(event.target.value);
        if (props.tab === "methods") {
          props.setTab("properties");
        }
      });
    },
    [props]
  );

  const onTabClick = useCallback(
    (tabName: string) => {
      props.setTab(tabName);

      if (tabName === "methods") {
        props.setFilter("");
      }
    },
    [props]
  );

  return (
    <div className="flex space-x-1">
      <div className="flex">
        <span className="relative z-0 inline-flex shadow-sm">
          <button
            type="button"
            className={Utils.classNames(
              props.tab === "properties" ? "text-indigo-500" : "text-gray-700",
              "-ml-px relative inline-flex items-center px-4 py-2 bg-transparent text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none"
            )}
            onClick={() => onTabClick("properties")}
          >
            <CubeIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={Utils.classNames(
              props.tab === "methods" ? "text-indigo-500" : "text-gray-700",
              "-ml-px relative inline-flex items-center px-4 py-2 bg-transparent text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none"
            )}
            onClick={() => onTabClick("methods")}
            disabled={typeof typeMetadata === "undefined"}
          >
            <BoltIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </span>
      </div>
      <input
        type="search"
        className="h-12 px-4 shadow-sm block w-full sm:text-sm border-none focus:ring-1 bg-transparent"
        placeholder={`Search ${typeMetadata?.name} properties`}
        autoComplete="off"
        value={props.filter}
        onChange={onSetFilter}
      />
    </div>
  );
}
