import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useContext, useCallback, Fragment, useState } from "react";
import { TargetProcessor } from "../targets/target-processor";
import { ProjectContext } from "../project/project-context";
import { Utils } from "../utils";
import { ProjectActionKind } from "../project/types";

export default function NavbarMenu() {
  const { state, dispatch } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [activeHandle, setActiveHandle] = useState(
    state.settings.directoryHandle !== null
  );

  const onSetLanguage = useCallback(
    (language: "typescript") => {
      dispatch({
        kind: ProjectActionKind.SET_SETTINGS,
        payload: [{ kind: "language", language }],
      });
    },
    [dispatch]
  );

  const onDownloadClick = useCallback(async () => {
    setLoading(true);
    const targetProcessor = new TargetProcessor(state, state.settings.language);
    await targetProcessor.downloadArchive();
    setActiveHandle(false);
    setLoading(false);
  }, [state]);

  const onFileSystemSyncClick = useCallback(
    async (openNewDir: boolean) => {
      setLoading(true);
      if (!window.showDirectoryPicker) {
        alert(
          "This browser does not support the FileSystem API. Try Chrome or Edge."
        );

        setLoading(false);
        return;
      }

      let dirHandle: FileSystemDirectoryHandle | null =
        state.settings.directoryHandle;
      let hasHandle = false;

      if (dirHandle) {
        if (
          (await dirHandle.requestPermission({
            mode: "readwrite",
          })) === "granted"
        ) {
          hasHandle = true;
        }
      }

      if (openNewDir || !hasHandle) {
        try {
          dirHandle = await window.showDirectoryPicker({
            mode: "readwrite",
          });
          const keys = dirHandle.keys();
          let len = 0;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for await (const _ of keys) {
            len++;
          }

          if (len > 0) {
            if (
              !window.confirm(
                "This directory is not empty. Files will be overridden.\nDo you want to continue?"
              )
            ) {
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          setLoading(false);
          return;
        }
      }

      if (!dirHandle) return;

      try {
        const targetProcessor = new TargetProcessor(
          state,
          state.settings.language
        );

        await targetProcessor.syncFileSystem(dirHandle);
      } catch (error: any) {
        if (error.code === DOMException.NOT_FOUND_ERR) {
          setActiveHandle(false);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          throw error;
        }
      }

      dispatch({
        kind: ProjectActionKind.SET_SETTINGS,
        payload: [{ kind: "directoryHandle", directoryHandle: dirHandle }],
      });

      setActiveHandle(true);
      setLoading(false);
    },
    [dispatch, state]
  );

  const onMainButtonClick = useCallback(async () => {
    if (activeHandle) {
      await onFileSystemSyncClick(false);
    } else {
      await onDownloadClick();
    }
  }, [onFileSystemSyncClick, onDownloadClick, activeHandle]);

  let languageName = "N/A";
  if (state.settings.language === "typescript") {
    languageName = "TypeScript";
  }

  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        disabled={loading}
        className={Utils.classNames(
          "relative inline-flex items-center rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
          loading ? "bg-indigo-50" : "bg-white hover:bg-gray-50"
        )}
        onClick={onMainButtonClick}
      >
        {activeHandle ? `Save (${languageName})` : `Download (${languageName})`}
      </button>
      <Menu as="div" className="relative -ml-px block">
        <Menu.Button
          className={Utils.classNames(
            "relative inline-flex items-center rounded-r-md border border-gray-300 px-2 py-2 text-sm font-medium text-gray-500  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
            loading ? "bg-indigo-50" : "bg-white hover:bg-gray-50"
          )}
          disabled={loading}
        >
          <span className="sr-only">Open options</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={Utils.classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "w-full text-left px-4 py-2 text-sm flex items-center justify-between"
                    )}
                    onClick={() => onSetLanguage("typescript")}
                  >
                    TypeScript
                    {state.settings.language === "typescript" && (
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <hr />
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={Utils.classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "w-full text-left px-4 py-2 text-sm flex items-center justify-between"
                    )}
                    onClick={onDownloadClick}
                  >
                    Download ZIP archive
                    {!activeHandle && (
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={Utils.classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "w-full text-left px-4 py-2 text-sm flex items-center justify-between"
                    )}
                    onClick={() => onFileSystemSyncClick(true)}
                  >
                    Save to local filesystem
                    {activeHandle && (
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
