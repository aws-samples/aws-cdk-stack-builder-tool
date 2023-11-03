import { useContext, useState } from "react";
import { ProjectContext } from "../../project/project-context";
import { DetailsEmpty } from "./details-empty";
import { DetailsHeader } from "./details-header";
import { ObjectDesigner } from "../object-designer/object-designer";
import { MethodsDesigner } from "../object-designer/methods-designer";
import { TypeTest } from "../../types";

export function Details() {
  const { state } = useContext(ProjectContext);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState("properties");
  const item = state.computed.selectedRootValue;

  if (!item || !TypeTest.isFqn(item.value.valueType)) {
    return (
      <div className="flex items-center justify-center h-full overflow-y-auto relative border-l border-gray-200 bg-gray-100">
        <DetailsEmpty />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto grid grid-rows-[auto_1fr] border-l border-gray-200 bg-gray-100">
      <div className="py-0.5 pr-0.5">
        <DetailsHeader
          filter={filter}
          setFilter={setFilter}
          fqn={item.value.valueType.fqn}
          tab={tab}
          setTab={setTab}
        />
      </div>
      <div className="overflow-y-auto pt-3 px-4">
        {tab === "methods" && <MethodsDesigner parent={item.value} />}
        {tab === "properties" && (
          <ObjectDesigner modal={false} filter={filter} setFilter={setFilter} />
        )}
      </div>
    </div>
  );
}
