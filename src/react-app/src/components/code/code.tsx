import Prism from "prismjs";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { TargetProcessor } from "../../targets/target-processor";
import { ProjectContext } from "../../project/project-context";
import { ProjectActionKind } from "../../project/types";
import { Breadcrumbs } from "../breadcrumbs";
import { Navbar } from "../navbar";

export function Code() {
  const { state, dispatch } = useContext(ProjectContext);
  const preRef = useRef<HTMLPreElement>(null);

  const { generationState, html } = useMemo(() => {
    const targetProcessor = new TargetProcessor(state, state.settings.language);
    const { containerCode, generationState } =
      targetProcessor.generateContainerCode();

    let html = "";

    if (state.settings.language === "typescript") {
      html = Prism.highlight(
        containerCode,
        Prism.languages.typescript,
        "typescript"
      );
    }

    for (const [valueId, value] of Object.entries(generationState.containers)) {
      if (valueId === state.root.valueId) continue;

      html = html.replaceAll(
        `>${value.valueName}<`,
        `><a href="">${value.valueName}</a><`
      );
    }

    return { generationState, html };
  }, [state]);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (!generationState) return;
      event.preventDefault();
      const element = event.target as HTMLElement;

      if (element.tagName.toLowerCase() === "a") {
        const valueName = element.textContent;

        const container = Object.entries(generationState.containers).find(
          (c) => c[1].valueName === valueName
        );

        if (!container) return;

        dispatch({
          kind: ProjectActionKind.TOGGLE_SELECT,
          payload: {
            valueId: container[0],
          },
        });
      }
    },
    [dispatch, generationState]
  );

  useEffect(() => {
    const current = preRef.current;
    const handler = onClick;
    if (current) {
      current.addEventListener("click", handler, true);
    }

    return () => {
      if (current) {
        current.removeEventListener("click", handler, true);
      }
    };
  }, [dispatch, onClick]);

  return (
    <>
      <Navbar />
      <div className="h-full w-full pt-16 mx-auto grid grid-rows-[auto_1fr]">
        <div className="py-0.5 overflow-x-auto w-full">
          <Breadcrumbs />
        </div>
        <div className="h-full w-full overflow-scroll">
          <pre
            ref={preRef}
            className="code-editor language-typescript w-full h-full"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  );
}
