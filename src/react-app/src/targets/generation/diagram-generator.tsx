import ELK from "elkjs";
import { Edge, MarkerType, Node, Position } from "reactflow";
import { TypesHelper } from "../../project/helpers/types-helper";
import { Values } from "../../project/types/values";
import { GeneratorBase } from "./generator-base";

const typesHelper = new TypesHelper();

export class DiagramGenerator extends GeneratorBase {
  async create() {
    const elk = new ELK();

    let sourceNodes: any[] = [];
    let sourceEdges: any[] = [];

    sourceEdges.push(...this.buildEdges());

    const containers = this.metadata.containers;

    for (const containerId of Object.keys(containers)) {
      const children = containers[containerId];
      sourceNodes.push({
        id: containerId,
        width: 150,
        height: 70,
      });

      for (const childId of children) {
        sourceNodes.push({
          id: childId,
          width: 150,
          height: 70,
        });

        if (
          !sourceEdges.find(
            (c) =>
              c.target === childId &&
              this.metadata.parentContainers[c.source].includes(containerId)
          )
        ) {
          sourceEdges.push({
            id: `${containerId}-${childId}`,
            source: containerId,
            target: childId,
            //type: "smoothstep",
          });
        }
      }
    }

    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        //"elk.layered.nodePlacement.strategy": "SIMPLE",
      },

      children: sourceNodes,
      edges: sourceEdges,
    };

    const result = await elk.layout(graph);

    const nodes: Node<any>[] = (result.children || []).map((current) => {
      const valueMetadata = this.projectState.computed.values[current.id];
      const typeName = typesHelper.getTypeName(
        this.projectState,
        valueMetadata.value
      );
      const valueName = valueMetadata.value.valueName;

      const node: Node<any> = {
        data: {
          label: (
            <div style={{ overflow: "hidden", fontSize: "0.9rem" }}>
              {valueName}
              <br />
              <span style={{ fontSize: "0.5rem" }}>{typeName}</span>
            </div>
          ),
        },
        position: {
          x: current.x || 0,
          y: current.y || 0,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        connectable: false,
        selectable: false,
        ...current,
      };

      return node;
    });

    const edges: Edge<any>[] = (result.edges || []).map((current) => {
      const currentAny = current as any;

      const edge: Edge<any> = {
        source: currentAny["source"],
        target: currentAny["target"],
        type: currentAny.type,
        markerEnd: {
          type: MarkerType.Arrow,
        },
        ...currentAny,
      };

      return edge;
    });

    return { nodes, edges };
  }

  buildEdges() {
    let edges: any[] = [];
    const valueIds = Object.values(this.metadata.containers).flatMap((c) => c);
    const valueSet = new Set(valueIds);

    for (const valueMetadata of Object.values(
      this.projectState.computed.values
    )) {
      if (Values.isRef(valueMetadata.value)) {
        const valueId = valueMetadata.value.valueId;
        const refValueId = valueMetadata.value.refValueId;

        const valueParents = this.metadata.parents[valueId];
        const refValueParents = this.metadata.parents[refValueId];

        let valueParentId = valueSet.has(valueId) ? valueId : "";
        let refValueParentId = valueSet.has(refValueId) ? refValueId : "";

        if (!valueParentId) {
          for (let i = valueParents.length - 1; i >= 0; i--) {
            if (valueSet.has(valueParents[i])) {
              valueParentId = valueParents[i];
              break;
            }
          }
        }

        if (!refValueParentId) {
          for (let i = refValueParents.length - 1; i >= 0; i--) {
            if (valueSet.has(refValueParents[i])) {
              refValueParentId = refValueParents[i];
              break;
            }
          }
        }

        edges.push({
          id: `${valueParentId}-${refValueParentId}`,
          source: valueParentId,
          target: refValueParentId,
          //type: "smoothstep",
        });
      } else if (Values.isCall(valueMetadata.value)) {
        if (!valueMetadata.value.methodOfId) continue;
        const valueId = valueMetadata.value.valueId;
        const methodOfId = valueMetadata.value.methodOfId;

        edges.push({
          id: `${methodOfId}-${valueId}`,
          source: methodOfId,
          target: valueId,
          //type: "smoothstep",
        });
      }
    }

    return edges;
  }

  constructName(valueName: string): string {
    return valueName
      .split(/[\s-_]+/)
      .map((c) => c.trim())
      .filter((c) => c)
      .map((c, i) =>
        i > 0
          ? c.charAt(0).toUpperCase() + c.slice(1)
          : c.charAt(0).toLocaleLowerCase() + c.slice(1)
      )
      .join("");
  }
}
