import { Constructs } from "./constructs";
import { Items } from "./items";
import { Navbar } from "../navbar";
import { Details } from "./details";
import { DesignerModal } from "../designer-modal";
import { Breadcrumbs } from "../breadcrumbs";
import { useContext } from "react";
import { ProjectContext } from "../../project/project-context";

export function Workbench() {
  const { state } = useContext(ProjectContext);

  return (
    <>
      <Navbar />
      <DesignerModal />
      <div className="h-full w-full pt-16 mx-auto grid grid-cols-[1fr_2fr_1fr]">
        <Constructs />
        <div className="h-full overflow-y-auto grid grid-rows-[auto_1fr] border-l border-gray-200">
          <div className="py-0.5 overflow-x-auto w-full">
            <Breadcrumbs />
          </div>
          <div className="overflow-y-auto pt-1">
            <Items />
          </div>
        </div>
        <Details key={state.computed.selectedRootValue.valueId} />
      </div>
    </>
  );
}
