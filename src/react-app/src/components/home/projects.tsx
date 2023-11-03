import {
  Fragment,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { ProjectsEmpty } from "./projects-empty";
import { useNavigate } from "react-router-dom";
import { Utils } from "../../utils";
import { ProjectService } from "../../project/project-service";

const projectService = new ProjectService();

export function Projects() {
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const projects = await projectService.listStored();

      setProjects(projects);
    })();
  }, [setProjects]);

  const onDeleteClick = useCallback(
    async (event: SyntheticEvent, projectName: string) => {
      event.stopPropagation();

      if (window.confirm(`Do you want to delete "${projectName}"?`)) {
        await projectService.delete(projectName);
        const projects = await projectService.listStored();

        setProjects(projects);
      }
    },
    [setProjects]
  );

  const hasProjects = projects.length > 0;

  return (
    <section>
      <div className="bg-white shadow rounded-lg h-full grid grid-rows-[auto_1fr]">
        <div className="px-5 h-28 flex items-center">
          <div>
            <h2
              id="applicant-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Your Projects
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Choose existing project. All projects are saved on the local
              machine.
            </p>
          </div>
        </div>
        <div
          className={Utils.classNames(
            "border-t border-gray-200 py-5 px-4 overflow-y-auto h-[65vh] max-h-[1000px]",
            hasProjects ? "" : "flex items-center justify-center"
          )}
        >
          {!hasProjects && <ProjectsEmpty />}
          <div className="space-y-2">
            {projects.map((projectName) => (
              <ProjectItem
                key={projectName}
                projectName={projectName}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectItem(props: {
  projectName: string;
  onDeleteClick: (event: SyntheticEvent, projectName: string) => void;
}) {
  const navigate = useNavigate();
  const onProjectClick = useCallback(() => {
    navigate(`/projects/${props.projectName}`);
  }, [navigate, props.projectName]);

  return (
    <div className="flex items-center cursor-pointer" onClick={onProjectClick}>
      <div className="inline-flex justify-between items-center w-full px-3 py-4 border border-gray-100 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {props.projectName}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={(event: any) => event.stopPropagation()}
            >
              <span className="sr-only">Open options</span>
              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={Utils.classNames(
                        "block px-4 py-2 text-sm w-full text-left",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      )}
                      onClick={(event) =>
                        props.onDeleteClick(event, props.projectName)
                      }
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
