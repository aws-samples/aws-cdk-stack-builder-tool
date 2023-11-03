import { Fragment, useCallback, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Utils } from "../../utils";
import { ProjectBlueprint } from "../../project/types/project-blueprint";
import { Blueprints } from "./blueprints";
import { BlueprintService } from "../../project/blueprint-service";

const blueprintService = new BlueprintService();

export function BlueprintsModal(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBlueprintId: string;
  blueprints: ProjectBlueprint[];
  staticBlueprints: string[];
  setBlueprints: (blueprints: ProjectBlueprint[]) => void;
  setSelectedBlueprintId: (blueprint: string) => void;
  resetSelect: () => string;
}) {
  const cancelButtonRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(
    props.selectedBlueprintId
  );

  const onSelectClick = useCallback(() => {
    props.setSelectedBlueprintId(selectedBlueprintId);
    props.setOpen(false);
  }, [props, selectedBlueprintId]);

  const onFileChange = useCallback(() => {
    const current = fileInputRef.current;
    if (!current) return;

    const file = (current.files || [])[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result;
      if (typeof result !== "string") {
        throw new Error("Unexpected result type");
      }

      try {
        const blueprint: ProjectBlueprint = JSON.parse(result);
        await blueprintService.save(blueprint);

        props.setBlueprints([
          ...props.blueprints.filter((c) => c.id !== blueprint.id),
          blueprint,
        ]);
      } catch (e) {
        alert("Invalid blueprint file");
        console.error(e);
      }

      current.value = "";
    };

    reader.onerror = () => {
      console.log(reader.error);
      current.value = "";
    };

    reader.readAsText(file);
  }, [props]);

  const onRemoveBlueprintClick = useCallback(async () => {
    blueprintService.delete(selectedBlueprintId);
    const loadedBlueprints = await blueprintService.load();
    props.setBlueprints(loadedBlueprints);
    const blueprintId = props.resetSelect();
    setSelectedBlueprintId(blueprintId);
  }, [props, selectedBlueprintId]);

  const hasSelected = selectedBlueprintId && selectedBlueprintId.length > 0;

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={props.setOpen}
        initialFocus={cancelButtonRef}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 pt-5 max-w-2xl w-full">
                <div className="flex justify-between content-center mb-2 px-4">
                  <div className="ml-2">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      <div>Blueprints</div>
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    tabIndex={-1}
                    onClick={() => props.setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="min-w-[30vw] min-h-[30vh] max-h-[60vh] overflow-y-auto px-6 py-4">
                  <Blueprints
                    multicolumn={false}
                    selectedBlueprintId={selectedBlueprintId}
                    blueprints={props.blueprints}
                    setSelectedBlueprintId={setSelectedBlueprintId}
                  />
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={onFileChange}
                  ref={fileInputRef}
                  accept=".json"
                />
                <div className="bg-gray-50 py-3 px-6 flex justify-between items-center">
                  <div>
                    <button
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Import blueprint...
                    </button>
                    <button
                      className={Utils.classNames(
                        !hasSelected ||
                          props.staticBlueprints.includes(selectedBlueprintId)
                          ? "hidden"
                          : "",
                        "ml-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      )}
                      onClick={onRemoveBlueprintClick}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className={Utils.classNames(
                        "ml-4 flex-shrink-0 px-4 py-2 border text-sm font-medium rounded-md shadow-sm",
                        !hasSelected
                          ? "border-gray-300 bg-white text-gray-700"
                          : "border-transparent bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white"
                      )}
                      disabled={!hasSelected}
                      onClick={onSelectClick}
                    >
                      Select
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-0 ml-3 w-auto text-sm"
                      onClick={() => props.setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
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
