import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ProjectContext } from "../../project/project-context";
import { Utils } from "../../utils";
import { PackagesService } from "../../packages/packages-service";
import { ProjectActionKind } from "../../project/types";

export function PackagesModal(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { state, dispatch } = useContext(ProjectContext);
  const cancelButtonRef = useRef(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [accumulator, setAccumulator] = useState({ total: 0, loaded: 0 });

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();

    let isValid = value.length > 0;
    if (state.assemblies.find((assembly) => assembly.name === value)) {
      isValid = false;
    }

    setName(value);
    setNameTouched(true);
    setIsNameValid(isValid);
  };

  const onInstallClick = async () => {
    const packageName = name.trim();
    if (packageName.length === 0) return;

    setIsLoading(true);
    setAccumulator({ total: 0, loaded: 0 });
    const status: { [key: string]: { total: number; loaded: number } } = {};
    const report = (packageName: string, total: number, loaded: number) => {
      status[packageName] = { total, loaded };

      const acc = Object.values(status).reduce(
        (acc, { total, loaded }) => ({
          total: acc.total + total,
          loaded: acc.loaded + loaded,
        }),
        { total: 0, loaded: 0 }
      );

      setAccumulator(acc);
    };

    const packageService = new PackagesService(report);

    try {
      const result = await packageService.addLib(
        packageName,
        state.blueprintComputed.libs
      );

      const pacakgeAssembly = result.assemblies.find(
        (assembly) => assembly.name === packageName
      );

      if (!pacakgeAssembly) {
        throw new Error(`Assembly ${packageName} not found`);
      }

      dispatch({
        kind: ProjectActionKind.UPDATE_DATA,
        payload: {
          version: result.version,
          assemblies: result.assemblies,
          typeMetadata: result.typeMetadata,
          modules: result.modules,
          constructFqns: result.constructFqns,
          libs: { [pacakgeAssembly.name]: `^${pacakgeAssembly.version}` },
        },
      });

      alert(`Package ${packageName} was installed successfully.`);
      setName("");
      setNameTouched(false);
      setIsNameValid(false);
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        alert(`Package "${packageName}" not found.`);
      } else if (error.cause === "NO_JSII_FILE") {
        alert(`Package "${packageName}" doesn't have CDK metadata.`);
      } else {
        alert(error);
      }
    }

    setIsLoading(false);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={(open) => {
          if (isLoading) return;
          props.setOpen(open);
        }}
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
                      <div>NPM Packages</div>
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    tabIndex={-1}
                    onClick={() => props.setOpen(false)}
                    disabled={isLoading}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="pt-4 grid grid-rows-[auto_1fr_auto_auto]">
                  <div className="px-6 pb-2 block text-sm font-medium text-gray-700">
                    Install NPM package with CDK constructs
                  </div>
                  <div className="px-6 grid grid-cols-[1fr_min-content] gap-2">
                    <div>
                      <input
                        type="text"
                        autoComplete="off"
                        className={Utils.classNames(
                          "shadow-sm w-full block sm:text-sm border-gray-300 rounded-md invalid:border-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500",
                          isNameValid || !nameTouched
                            ? "focus:ring-indigo-500 focus:border-indigo-500"
                            : "focus:border-red-500 focus:ring-red-500 border-red-500"
                        )}
                        placeholder="Package name on npmjs.com"
                        value={name}
                        onChange={onNameChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className={Utils.classNames(
                          "flex-shrink-0 px-4 py-2 border text-sm font-medium rounded-md shadow-sm",
                          !isNameValid || isLoading
                            ? "border-gray-300 bg-white text-gray-700"
                            : "border-transparent bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white"
                        )}
                        disabled={!isNameValid || isLoading}
                        onClick={onInstallClick}
                      >
                        Install
                      </button>
                    </div>
                  </div>
                  {accumulator.loaded === 0 && isLoading && (
                    <div className="px-6 pt-2 text-sm font-medium">
                      Loading package...
                    </div>
                  )}
                  {accumulator.loaded !== 0 && isLoading && (
                    <div className="px-6 pt-2 text-sm font-medium">
                      Loading: {accumulator.loaded}/{accumulator.total}
                    </div>
                  )}
                  <div className="px-6 pt-2 block text-sm font-medium text-gray-700">
                    Installed packages
                  </div>
                  <div className="min-w-[30vw] min-h-[30vh] max-h-[60vh] overflow-y-auto ">
                    <PackagesList />
                  </div>
                </div>
                <div className="bg-gray-50 py-3 px-4 flex content-end justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-0 ml-3 w-auto text-sm"
                    onClick={() => props.setOpen(false)}
                    ref={cancelButtonRef}
                    disabled={isLoading}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function PackagesList() {
  const { state } = useContext(ProjectContext);

  return (
    <div className="pb-4">
      {state.assemblies
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((pkg) => (
          <div
            key={pkg.name}
            className="relative bg-white py-1 px-6 hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <a
                className="text-blue-600"
                href={`https://www.npmjs.com/package/${pkg.name}`}
                target="_blank"
                rel="noreferrer"
              >
                {pkg.name}
              </a>
              <div>{pkg.version}</div>
            </div>
          </div>
        ))}
    </div>
  );
}
