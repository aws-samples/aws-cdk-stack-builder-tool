import { useContext, useEffect, useState } from "react";
import ReactFlow, { Controls, Background, Node, Edge } from "reactflow";
import { DiagramGenerator } from "../../targets/generation/diagram-generator";
import { ProjectContext } from "../../project/project-context";
import { Navbar } from "../navbar";

export function Diagram() {
  const { state } = useContext(ProjectContext);
  const [nodes, setNodes] = useState<Node<any>[]>();
  const [edges, setEdges] = useState<Edge<any>[]>();

  useEffect(() => {
    (async () => {
      const generator = new DiagramGenerator(state);
      const { nodes, edges } = await generator.create();

      setNodes(nodes);
      setEdges(edges);
    })();
  }, [state]);

  return (
    <>
      <Navbar />
      <div className="h-full w-full pt-16 flex justify-center items-center">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodesConnectable={false}
          fitView
          className="h-full w-full"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </>
  );
}
