import { Fragment, useCallback, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { ObjectDesigner } from "./object-designer/object-designer";
import { ProjectContext } from "../project/project-context";
import { ProjectActionKind } from "../project/types";
import { TypeMetadata, TypeTest } from "../types";
import { DocumentationLink } from "./documentation-link";
import { CoreValue, Values } from "../project/types/values";
import { Utils } from "../utils";

export function DesignerModal() {
  const { state, dispatch } = useContext(ProjectContext);

  const setOpen = useCallback(
    (show: boolean) => {
      if (show) return;

      dispatch({
        kind: ProjectActionKind.SHOW_MODAL,
        payload: {
          show,
        },
      });

      setTimeout(() => {
        dispatch({
          kind: ProjectActionKind.TOGGLE_SELECT,
          payload: {
            clearModal: true,
          },
        });
      }, 300);
    },
    [dispatch]
  );

  const onBackClick = useCallback(() => {
    const valuePath = state.computed.valuePath;
    if (valuePath.length <= 2) {
      dispatch({
        kind: ProjectActionKind.SHOW_MODAL,
        payload: {
          show: false,
        },
      });

      setTimeout(() => {
        dispatch({
          kind: ProjectActionKind.TOGGLE_SELECT,
          payload: {
            clearModal: true,
          },
        });
      }, 300);
    } else {
      dispatch({
        kind: ProjectActionKind.TOGGLE_SELECT,
        payload: {
          valueId: valuePath[valuePath.length - 2].valueId,
        },
      });
    }
  }, [dispatch, state.computed.valuePath]);

  return (
    <Transition.Root show={state.modal} as={Fragment}>
      <Dialog as="div" className="relative z-10 min-h-screen" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-start pt-14 justify-center min-h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-50"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-[60%] max-w-7xl relative bg-white rounded-lg px-4 pt-5 pb-4 shadow-xl transform transition-all">
                <div className="w-full mb-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <div className="pl-1">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-2"
                      onClick={onBackClick}
                    >
                      <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      <Title />
                    </Dialog.Title>
                  </div>
                  <div className="pr-2 pt-1.5">
                    <button
                      type="button"
                      className="inline-flex items-centerbg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      tabIndex={-1}
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div
                  key={state.computed.selectedValue?.valueId || ""}
                  className="grid grid-rows-[auto_1fr] min-w-[30vw] min-h-[30vh] max-h-[80vh] overflow-y-auto"
                >
                  <div className="px-2 py-1">
                    <TypeHeader />
                  </div>
                  <div>
                    <ObjectDesigner modal={true} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function TypeHeader() {
  const { state } = useContext(ProjectContext);
  const { selectedValue } = state.computed;

  if (!selectedValue) return null;
  let fqn = "";
  if (TypeTest.isFqn(selectedValue.value.valueType)) {
    fqn = selectedValue.value.valueType.fqn;
  } else if (TypeTest.isCollection(selectedValue.value.valueType)) {
    const elementType = selectedValue.value.valueType.collection.elementtype;
    if (TypeTest.isFqn(elementType)) {
      fqn = elementType.fqn;
    }
  }

  if (!fqn) return null;

  let typeName = "";
  let typeMetadata: TypeMetadata;
  if (!TypeTest.isFqn(selectedValue.value.valueType)) return null;
  if (Values.isCall(selectedValue.value)) {
    typeMetadata = state.types[selectedValue.value.methodOfType.fqn];
    typeName = `${typeMetadata.modules.join(".")}.${typeMetadata.name}.${
      selectedValue.value.method
    }(...)`;
  } else {
    typeMetadata = state.types[selectedValue.value.valueType.fqn];
    typeName = `${typeMetadata.modules.join(".")}.${typeMetadata.name}`;
  }

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-base leading-6 font-medium text-gray-700">
        {typeName}
      </h3>
      <DocumentationLink fqn={typeMetadata?.fqn} />
    </div>
  );
}

function Title() {
  const { state, dispatch } = useContext(ProjectContext);
  const lastIndex = state.computed.valuePath.length - 1;

  const itemClick = useCallback(
    (value: CoreValue) => {
      dispatch({
        kind: ProjectActionKind.TOGGLE_SELECT,
        payload: {
          valueId: value.valueId,
        },
      });
    },
    [dispatch]
  );

  return (
    <div className="flex items-center space-x-2">
      {state.computed.valuePath.map((item, i) => (
        <div key={`${item.valueId}_${item.parentKey}`}>
          <div className="flex items-center">
            {i > 0 && (
              <ChevronRightIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
            <button
              className={Utils.classNames(
                "text-base font-medium",
                i !== 0 ? "ml-2 hover:text-gray-700" : "",
                i === lastIndex ? "text-gray-700" : "text-gray-500"
              )}
              disabled={i === 0 || i === lastIndex}
              onClick={() => itemClick(item.value)}
            >
              {item.valueName ?? item.parentKey}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
