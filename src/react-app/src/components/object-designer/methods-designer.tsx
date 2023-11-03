import { useCallback, useContext, useState } from "react";
import { ProjectContext } from "../../project/project-context";
import { ProjectActionKind } from "../../project/types";
import { ConstrcutId } from "./construct-id";
import { TypeTest } from "../../types";
import { CoreValue, ValueKind } from "../../project/types/values";
import { Utils } from "../../utils";
import { TypesHelper } from "../../project/helpers/types-helper";

const typesHelper = new TypesHelper();

export function MethodsDesigner(props: { parent: CoreValue }) {
  if (!TypeTest.isFqn(props.parent.valueType)) {
    throw new Error("Parent must be a FQN");
  }

  const { state, dispatch } = useContext(ProjectContext);
  const [path, setPath] = useState<{ fqn: string; property?: string }[]>([
    { fqn: props.parent.valueType.fqn },
  ]);

  const getObjectProperties = useCallback(
    (parentFqn: string) => {
      const properties = (state.types[parentFqn].properties || []).filter(
        (c) => !c.static && TypeTest.isFqn(c.type)
      );

      return properties;
    },
    [state.types]
  );

  const getObjectMethods = useCallback(
    (parentFqn: string) => {
      const { methods } = typesHelper.getMethods(parentFqn, state.types);
      return methods.filter((c) => !c.static);
    },
    [state.types]
  );

  const onPropertyChange = useCallback(
    (event: React.FormEvent<HTMLSelectElement>, index: number) => {
      const property = (event.target as HTMLSelectElement).value;
      if (path[index].property !== property) {
        const newPath = [...path.slice(0, index + 1)];
        newPath[index].property = property;

        const subProperty = getObjectProperties(newPath[index].fqn).find(
          (c) => c.name === property
        );

        if (subProperty && TypeTest.isFqn(subProperty.type)) {
          newPath.push({ fqn: subProperty.type.fqn });
        }

        setPath(newPath);
      }
    },
    [getObjectProperties, path]
  );

  const onChange = useCallback(
    (event: React.FormEvent<HTMLSelectElement>) => {
      const valueId = Utils.generateId();
      const parentFqn = path[path.length - 1].fqn;
      const method = (event.target as HTMLSelectElement).value;
      const methods = getObjectMethods(parentFqn);
      const methodMetadata = methods.find((c) => c.name === method);
      const methodPath = path
        .filter((c) => typeof c.property !== "undefined")
        .map((c): string => c.property || "");

      if (!methodMetadata) {
        throw new Error(`Method ${method} not found`);
      }

      const valueType = methodMetadata.returns || { fqn: "void" };
      const methodOfId = props.parent.valueId;

      dispatch({
        kind: ProjectActionKind.ADD_CALL_ITEM,
        payload: {
          select: true,
          value: {
            kind: ValueKind.Call,
            valueId,
            valueType,
            methodOfId,
            methodOfType: {
              fqn: parentFqn,
            },
            methodPath,
            method,
            parameters: {},
          },
        },
      });
    },
    [dispatch, getObjectMethods, path, props.parent.valueId]
  );

  return (
    <div className="flex flex-col items-stretch gap-3 pb-8">
      <ConstrcutId modal={false} value={props.parent} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-gray-100 text-gray-900">Call Method On</span>
        </div>
      </div>
      <div>
        {path.map((item, idx) => {
          const key = path.slice(0, idx + 1).join(".");
          const objectProperties = getObjectProperties(item.fqn);
          return (
            <div key={key} className="mb-2">
              <select
                name={`properties-${key}`}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={item.property || ""}
                onChange={(event) => onPropertyChange(event, idx)}
              >
                <option value="">self</option>
                {objectProperties.length > 0 && (
                  <option disabled={true}>Properties</option>
                )}
                {objectProperties.map((property) => (
                  <option key={property.name} value={property.name}>
                    {property.name}:{" "}
                    {TypeTest.isFqn(property.type) &&
                      state.types[property.type.fqn].name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-gray-100 text-gray-900">Method</span>
        </div>
      </div>
      <div className="mb-4">
        <select
          name={`methods-${path[path.length - 1].fqn}`}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={""}
          onChange={onChange}
        >
          <option disabled={true} value="">
            Select a method
          </option>
          {getObjectMethods(path[path.length - 1].fqn).map((method) => (
            <option key={method.name} value={method.name}>
              {method.name}(...)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
