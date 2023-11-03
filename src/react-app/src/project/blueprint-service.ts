import { Database } from "./database";
import { projectBlueprints } from "./extended";
import { ProjectBlueprint } from "./types/project-blueprint";

const storeName = "blueprints";

export class BlueprintService {
  async save(blueprint: ProjectBlueprint) {
    if (blueprint.kind !== "cdk/project-blueprint") {
      throw new Error("Invalid blueprint");
    }

    if (!blueprint.id) {
      throw new Error("Invalid blueprint id");
    }

    await Database.set(storeName, blueprint.id, blueprint);
  }

  async load(): Promise<ProjectBlueprint[]> {
    const result = await Database.values(storeName);

    const blueprints: ProjectBlueprint[] = [];
    for (const value of result) {
      try {
        blueprints.push(value);
      } catch (error) {
        console.error(error);
      }
    }

    return [...projectBlueprints, ...blueprints];
  }

  async delete(blueprintId: string) {
    await Database.del(storeName, blueprintId);
  }
}
