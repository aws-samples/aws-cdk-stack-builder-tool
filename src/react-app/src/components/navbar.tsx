import { Fragment, useContext } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Popover, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { ProjectContext } from "../project/project-context";
import { ProjectActionKind } from "../project/types";
import { Utils } from "../utils";
import NavbarMenu from "./navbar-menu";

const views = [
  { title: "Designer", name: "workbench" },
  { title: "Code", name: "code" },
  { title: "Diagram", name: "diagram" },
];

export function Navbar() {
  const { state } = useContext(ProjectContext);

  return (
    <nav className="z-10 h-16 px-4 absolute left-0 right-0 shadow bg-white grid grid-cols-[1fr_auto_1fr] items-center">
      <div>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={Utils.classNames(
                  open ? "text-gray-900" : "text-gray-500",
                  "group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-transparent"
                )}
              >
                <span>CDK&nbsp;Builder&nbsp;v.{state.version}</span>
                <ChevronDownIcon
                  className={Utils.classNames(
                    open ? "text-gray-600" : "text-gray-400",
                    "ml-2 h-5 w-5 group-hover:text-gray-500"
                  )}
                  aria-hidden="true"
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-50 -ml-1 mt-3 w-screen max-w-xs">
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-3">
                      <Link
                        to={"/"}
                        className="-m-3 p-3 block rounded-md hover:bg-gray-50"
                      >
                        <p className="text-base font-medium text-gray-900">
                          Create new project / open project
                        </p>
                      </Link>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      <div className="flex items-center justify-center">
        <Tabs />
      </div>
      <div className="flex items-center justify-end">
        <NavbarMenu />
      </div>
    </nav>
  );
}

export function Tabs() {
  const { state, dispatch } = useContext(ProjectContext);

  return (
    <div className="block">
      <nav className="flex space-x-4" aria-label="Tabs">
        {views.map((view) => (
          <button
            key={view.name}
            onClick={() =>
              dispatch({
                kind: ProjectActionKind.SET_VIEW,
                payload: {
                  view: view.name,
                },
              })
            }
            className={Utils.classNames(
              view.name === state.view
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700",
              "px-3 py-2 font-medium text-sm rounded-md"
            )}
          >
            {view.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
