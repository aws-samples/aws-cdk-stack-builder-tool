import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../../project/project-service";
import { Foother } from "./foother";
import { Utils } from "../../utils";
import { Blueprints } from "./blueprints";
import { projectBlueprints } from "../../project/extended";
import { BlueprintService } from "../../project/blueprint-service";
import { BlueprintsModal } from "./blueprints-modal";
import { ProjectBlueprint } from "../../project/types/project-blueprint";

const appName = "MyApplication";
const projectService = new ProjectService();
const blueprintService = new BlueprintService();
const defaultBlueprintId =
  projectBlueprints.length > 0 ? projectBlueprints[0].id : "";
const limit = 6;

export function Create() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedBlueprintId, setSelectedBlueprintId] =
    useState(defaultBlueprintId);
  const [blueprints, setBlueprints] = useState<ProjectBlueprint[]>([]);
  const [staticBlueprints] = useState(projectBlueprints.map((c) => c.id));
  const [name, setName] = useState(appName);
  const [isNameValid, setIsNameValid] = useState(true);

  useEffect(() => {
    (async () => {
      const exists = await projectService.exists(appName);

      if (exists) {
        let i = 1;
        while (await projectService.exists(`${appName}${i}`)) {
          i++;
        }

        setName(`${appName}${i}`);
      }
    })();
  }, [setName]);

  useEffect(() => {
    (async () => {
      const blueprints = await blueprintService.load();
      setBlueprints(blueprints);
    })();
  }, [setBlueprints]);

  const resetSelect = useCallback(() => {
    setSelectedBlueprintId(defaultBlueprintId);
    return defaultBlueprintId;
  }, []);

  const onCreateClick = useCallback(async () => {
    if (!isNameValid) return;

    const blueprint = blueprints.find(
      (blueprint) => blueprint.id === selectedBlueprintId
    );

    if (!blueprint) {
      throw new Error(`Blueprint not found: ${selectedBlueprintId}`);
    }

    await projectService.create(name, blueprint);
    navigate(`/projects/${name}`);
  }, [isNameValid, blueprints, name, navigate, selectedBlueprintId]);

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      (async () => {
        let isValid = event.target.checkValidity();

        if (isValid) {
          const exists = await projectService.exists(event.target.value.trim());
          isValid = !exists;
        }

        setName(value);
        setIsNameValid(isValid);
      })();
    },
    [setName, setIsNameValid]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        onCreateClick();
      }
    },
    [onCreateClick]
  );

  const onSetSelectedBlueprintId = useCallback(
    (id: string) => {
      let data = [...blueprints];
      const blueprint = data.find((t) => t.id === id);
      if (!blueprint) {
        throw new Error(`Blueprint with id ${id} not found`);
      }

      const index = data.indexOf(blueprint);
      if (index >= limit) {
        Utils.moveArrayElement(data, blueprint, -(index - limit + 1));
      }

      setSelectedBlueprintId(id);
      setBlueprints(data);
    },
    [blueprints]
  );

  return (
    <section>
      <BlueprintsModal
        open={openModal}
        setOpen={setOpenModal}
        selectedBlueprintId={selectedBlueprintId}
        setSelectedBlueprintId={onSetSelectedBlueprintId}
        blueprints={blueprints}
        staticBlueprints={staticBlueprints}
        setBlueprints={setBlueprints}
        resetSelect={resetSelect}
      />
      <div className="bg-white shadow rounded-lg">
        <div className="px-5 py-4 h-28">
          <div className="flex items-end justify-between">
            <div className="w-full">
              <label
                htmlFor="project_name"
                className="block text-lg font-medium text-gray-900"
              >
                Project Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="project_name"
                  id="project_name"
                  required
                  maxLength={40}
                  pattern="[\p{L}_][\p{L}0-9_]*"
                  autoComplete="off"
                  className={Utils.classNames(
                    "shadow-sm w-full block sm:text-sm border-gray-300 rounded-md invalid:border-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500",
                    isNameValid
                      ? "focus:ring-indigo-500 focus:border-indigo-500"
                      : "focus:border-red-500 focus:ring-red-500 border-red-500"
                  )}
                  placeholder="Project Name"
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>
            <button
              className={Utils.classNames(
                "ml-4 flex-shrink-0 px-4 py-2 border text-sm font-medium rounded-md shadow-sm ",
                !isNameValid
                  ? "border-gray-300 bg-white text-gray-700"
                  : "border-transparent bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white"
              )}
              disabled={!isNameValid}
              onClick={onCreateClick}
            >
              Create a project
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 py-6 px-6">
          <Blueprints
            multicolumn={true}
            selectedBlueprintId={selectedBlueprintId}
            setSelectedBlueprintId={onSetSelectedBlueprintId}
            blueprints={blueprints}
            limit={limit}
          />
          <div className="mt-8 flex">
            <button
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => setOpenModal(true)}
            >
              Or browse full blueprint gallery
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </div>
      </div>
      <Foother />
    </section>
  );
}
