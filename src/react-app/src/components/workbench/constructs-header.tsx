import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { PackagesModal } from "./packages-modal";

export function ConstructsHeader(props: {
  filter: string;
  setFilter: (filter: string) => void;
}) {
  const [filter, setFilter] = useState(props.filter);
  const [openPackagesModal, setOpenPackagesModal] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      props.setFilter(filter);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filter, props]);

  return (
    <>
      <PackagesModal open={openPackagesModal} setOpen={setOpenPackagesModal} />
      <div className="flex space-x-1">
        <input
          type="search"
          className="h-12 px-4 shadow-sm block w-full sm:text-sm border-none focus:ring-1"
          placeholder="Search constructs"
          autoComplete="off"
          value={filter}
          onChange={(e) => setFilter(e.target.value || "")}
        />
        <div className="flex">
          <span className="relative z-0 inline-flex shadow-sm">
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 bg-transparent bg-white text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none"
              onClick={() => setOpenPackagesModal(true)}
            >
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
