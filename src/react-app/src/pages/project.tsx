import { useEffect, useMemo, useReducer, useState } from "react";
import {
  initialState,
  ProjectContext,
  projectReducer,
} from "../project/project-context";
import { ProjectActionKind } from "../project/types";
import { Workbench } from "../components/workbench/workbench";
import { Code } from "../components/code/code";
import { Diagram } from "../components/diagram/diagram";
import { useParams } from "react-router-dom";
import { ProjectService } from "../project/project-service";
import { PackagesService } from "../packages/packages-service";
import NotFound from "./not-found";

export default function Project() {
  const { project } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [accumulator, setAccumulator] = useState({ total: 0, loaded: 0 });

  useEffect(() => {
    if (!project) return;

    (async () => {
      const projectService = new ProjectService();
      const loadData = await projectService.load(project);

      if (!loadData) {
        setNotFound(true);
        return;
      }

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
      const result = await packageService.process(loadData.computed.libs);

      dispatch({
        kind: ProjectActionKind.SET_DATA,
        payload: {
          version: result.version,
          assemblies: result.assemblies,
          typeMetadata: result.typeMetadata,
          modules: result.modules,
          constructFqns: result.constructFqns,
          project: loadData.project,
          blueprintComputed: loadData.computed,
        },
      });
    })();
  }, [project]);

  const store = useMemo(() => ({ state, dispatch }), [state]);

  if (notFound) {
    return <NotFound />;
  }

  return (
    <ProjectContext.Provider value={store}>
      {!state.loaded ? (
        <div className="w-full h-full flex items-center justify-center tabular-nums">
          <div className="text-center">
            Project is loading...
            {accumulator.loaded !== 0 && (
              <>
                <br />
                {accumulator.loaded}/{accumulator.total}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {store.state.view === "workbench" && <Workbench />}
          {store.state.view === "code" && <Code />}
          {store.state.view === "diagram" && <Diagram />}
        </>
      )}
    </ProjectContext.Provider>
  );
}
