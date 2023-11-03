import { BackspaceIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";

export function SearchEmpty(props: { setFilter?: (filter: string) => void }) {
  const onButtonClick = useCallback(() => {
    if (props.setFilter) {
      props.setFilter("");
    }
  }, [props]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Clear search to view all items
        </p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onButtonClick}
          >
            <BackspaceIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Clear Search
          </button>
        </div>
      </div>
    </div>
  );
}
