import { ProjectState, StorageV1Data } from "./types";
import { Utils } from "../utils";
import { blueprintExtended } from "./extended";
import { ProjectBlueprint } from "./types/project-blueprint";
import { Database } from "./database";
import {
  PROJECT_FORMAT_VERSION,
  BLUEPRINT_FORMAT_VERSION,
} from "./types/versions";

const projectsStoreName = "projects";
const timestampsStoreName = "timestamps";

export class ProjectService {
  async list() {
    let result: string[] = await Database.keys(projectsStoreName);
    result = result.sort();

    return result;
  }

  async listStored() {
    const projects = await this.list();
    const timestamps = await this.loadTimestamps();

    projects.sort((a, b) => {
      const aTimestamp: number = timestamps[a] || 0;
      const bTimestamp: number = timestamps[b] || 0;
      return bTimestamp - aTimestamp || a.localeCompare(b);
    });

    return projects;
  }

  async exists(projectName: string) {
    const result = await Database.get(projectsStoreName, projectName);

    return typeof result !== "undefined";
  }

  async delete(projectName: string) {
    const project = await this.load(projectName);

    if (!project) return;
    await Database.del(projectsStoreName, projectName);
    await Database.del(timestampsStoreName, projectName);
  }

  async create(projectName: string, blueprint: ProjectBlueprint) {
    if (await this.exists(projectName)) {
      throw new Error(`Project ${projectName} already exists`);
    }

    if (blueprint.format !== BLUEPRINT_FORMAT_VERSION) {
      throw new Error("Blueprint format version mismatch");
    }

    const extend = blueprintExtended[blueprint.extend];
    if (!extend) {
      throw new Error(`Blueprint extend not found: ${blueprint.extend}`);
    }

    const root = blueprint.root;
    const utcTimestamp = new Date().getTime();
    const project: StorageV1Data = {
      kind: "cdk/project",
      timestamp: utcTimestamp,
      metadata: {
        format: PROJECT_FORMAT_VERSION,
        projectName,
        projectId: Utils.generateUUID(),
      },
      libs: {},
      settings: {
        language: "typescript",
        directoryHandle: null,
      },
      blueprint: {
        extend: blueprint.extend,
        id: blueprint.id,
        name: blueprint.name,
        libs: blueprint.libs,
        containers: blueprint.containers,
        favorites: blueprint.favorites,
        rules: blueprint.rules,
      },
      root,
    };

    await Database.set(projectsStoreName, projectName, project);
    await Database.set(timestampsStoreName, projectName, utcTimestamp);
  }

  async load(projectName: string) {
    try {
      const project: StorageV1Data = await Database.get(
        projectsStoreName,
        projectName
      );

      if (!project) return undefined;

      if (project.metadata.format !== PROJECT_FORMAT_VERSION) {
        return undefined;
      }

      const extend = blueprintExtended[project.blueprint.extend];
      if (!extend) {
        throw new Error(
          `Blueprint extend not found: ${project.blueprint.extend}`
        );
      }

      const rules = Utils.deepMerge(
        extend.rules,
        project.blueprint.rules || {}
      );
      const utcTimestamp = new Date().getTime();
      await Database.set(timestampsStoreName, projectName, utcTimestamp);

      return {
        project,
        computed: {
          platform: extend.platform,
          libs: {
            ...extend.libs,
            ...(project.blueprint.libs || {}),
            ...project.libs,
          },
          containers: [
            ...extend.containers,
            ...(project.blueprint.containers || []),
          ],
          favorites: [
            ...extend.favorites,
            ...(project.blueprint.favorites || []),
          ],
          rules,
        },
      };
    } catch (error) {
      console.error(error);
    }

    return undefined;
  }

  async save(state: ProjectState, fileExport: boolean) {
    const { metadata, blueprint, root, settings, libs } = state;

    const utcTimestamp = new Date().getTime();
    const project: StorageV1Data = {
      kind: "cdk/project",
      timestamp: utcTimestamp,
      metadata,
      settings,
      blueprint,
      root,
      libs,
    };

    await Database.set(projectsStoreName, metadata.projectName, project);

    if (fileExport) {
      project.settings.directoryHandle = null;
    }

    return project;
  }

  private async loadTimestamps() {
    const result = await Database.entries(timestampsStoreName);
    const timestamps: { [projectId: string]: number } = Object.assign(
      {},
      ...result.map(({ key, value }) => ({
        [key as string]: value as number,
      }))
    );

    return timestamps;
  }
}
