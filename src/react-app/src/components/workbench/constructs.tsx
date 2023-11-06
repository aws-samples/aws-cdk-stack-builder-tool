import { useCallback, useContext, useMemo, useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  MinusIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { ProjectContext } from "../../project/project-context";
import { ProjectActionKind } from "../../project/types";
import { TypeMetadata } from "../../types";
import { SearchEmpty } from "./search-empty";
import { Utils } from "../../utils";
import { TypesHelper } from "../../project/helpers/types-helper";
import { ConstructsHeader } from "./constructs-header";

const typesHelper = new TypesHelper();
const FAVORITES_NAME = "favorites";

export function Constructs() {
  const [filter, setFilter] = useState("");
  const [filterKey, setFilterKey] = useState(0);

  const setFilterOutside = (filter: string) => {
    setFilter(filter);
    setFilterKey((curent) => curent + 1);
  };

  return (
    <div className="h-full overflow-y-auto grid grid-rows-[auto_1fr]">
      <div className="p-0.5">
        <ConstructsHeader
          key={`search-panel-${filterKey}`}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
      <div className="overflow-y-auto pt-1">
        <ConstructList filter={filter} setFilter={setFilterOutside} />
      </div>
    </div>
  );
}

function ConstructList(props: {
  filter: string;
  setFilter: (filter: string) => void;
}) {
  const { state, dispatch } = useContext(ProjectContext);

  let { modules, moduleNames } = useMemo(() => {
    let modules = state.modules;

    const favorites = state.blueprintComputed.favorites
      .map((c) => state.types[c])
      .filter((c) => c);

    if (favorites && favorites.length > 0) {
      modules[FAVORITES_NAME] = favorites;
    }

    modules = filterConstructs(props.filter, state.modules);

    const moduleNamesCmp: { [name: string]: string } = {};
    Object.keys(modules).forEach((name) => {
      moduleNamesCmp[name] = name.replaceAll("_", "-");
    });

    const moduleNames = Object.keys(modules).sort((a, b) => {
      if (a === FAVORITES_NAME && b === FAVORITES_NAME) return 0;
      if (a === FAVORITES_NAME) return -1;
      if (b === FAVORITES_NAME) return 1;

      if (
        state.blueprintComputed.favorites.includes(a) &&
        !state.blueprintComputed.favorites.includes(b)
      ) {
        return -1;
      }

      if (
        state.blueprintComputed.favorites.includes(b) &&
        !state.blueprintComputed.favorites.includes(a)
      ) {
        return 1;
      }

      return moduleNamesCmp[a].localeCompare(moduleNamesCmp[b]);
    });

    for (const moduleName of moduleNames) {
      modules[moduleName] = sortConstructs(modules[moduleName]);
    }

    return {
      modules,
      moduleNames,
    };
  }, [props.filter, state]);

  const onAddItem = useCallback(
    (typeMetadata: TypeMetadata) => {
      dispatch({
        kind: ProjectActionKind.ADD_ITEM,
        payload: {
          fqn: typeMetadata.fqn,
        },
      });
    },
    [dispatch]
  );

  if (moduleNames.length === 0) {
    return <SearchEmpty setFilter={props.setFilter} />;
  }

  const containerFqn = state.computed.selectedContainer.valueType.fqn;

  return (
    <>
      {moduleNames.map((moduleName) => (
        <Disclosure
          as="div"
          key={`${props.filter}::${moduleName}`}
          className="py-4 border-b border-gray-200"
          defaultOpen={moduleNames.length <= 5}
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                  <span className="ml-4 font-medium text-gray-900 truncate">
                    {moduleName}
                  </span>
                  <span className="ml-6 mr-4 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="mx-4 space-y-2">
                  {modules[moduleName].map((typeMetadata) => {
                    const disabled = !typesHelper.applyRules(
                      state,
                      containerFqn,
                      typeMetadata.fqn
                    );

                    return (
                      <div
                        key={`${moduleName}.${typeMetadata.fqn}`}
                        className="flex items-center"
                      >
                        <button
                          type="button"
                          className={Utils.classNames(
                            "inline-flex justify-between items-center w-full px-3 py-2 border border-gray-100 shadow-sm text-sm leading-4 font-medium rounded-md bg-white",
                            disabled
                              ? "text-gray-500"
                              : "text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          )}
                          onClick={() => onAddItem(typeMetadata)}
                          disabled={disabled}
                        >
                          {typeMetadata.name}
                          <PlusIcon
                            className={Utils.classNames(
                              "ml-2 -mr-1 h-5 w-5",
                              disabled ? "text-gray-400" : "text-black"
                            )}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </>
  );
}

function sortConstructs(values: TypeMetadata[]) {
  const resources = values.filter((c) => c && !c.name.startsWith("Cfn")).sort();
  const cfnResources = values
    .filter((c) => c && c.name.startsWith("Cfn"))
    .sort();

  return [...resources, ...cfnResources];
}

function filterConstructs(
  filter: string,
  modules: {
    [moduleName: string]: TypeMetadata[];
  }
) {
  filter = filter.trim().toLowerCase();
  if (filter.length === 0) return modules;

  let keys: {
    [moduleName: string]: TypeMetadata[];
  } = {};

  for (const key of Object.keys(modules)) {
    let value = key.replace("aws-", "").replace("-", " ");
    value = value.toLowerCase();

    if (value.includes(filter)) {
      keys[key] = [...modules[key]];
    } else {
      let constructs = [...modules[key]];
      constructs = constructs.filter((c) =>
        c.name.toLowerCase().includes(filter)
      );

      if (constructs.length > 0) {
        keys[key] = [...constructs];
      }
    }
  }

  return keys;
}
