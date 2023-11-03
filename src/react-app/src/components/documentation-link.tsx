import { useContext } from "react";
import { ProjectContext } from "../project/project-context";

const baseUrl = "https://docs.aws.amazon.com/cdk/api/v2/docs/";

export function DocumentationLink(props: { fqn: string }) {
  const { state } = useContext(ProjectContext);
  if (state.blueprintComputed.platform !== "cdk") {
    return null;
  }

  return (
    <a
      href={`${baseUrl}${props.fqn.replaceAll("/", "_")}.html`}
      target="_blank"
      rel="noreferrer"
      className="text-sm text-gray-500"
    >
      documentation
    </a>
  );
}
