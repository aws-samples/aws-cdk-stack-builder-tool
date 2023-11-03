import { ParameterMetadata, PropertyMetadata } from "../../types";
import { PropertyLabel } from "./property-label";
import { PropertyValue } from "./property-value";
import { SetValueAction } from "../../project/actions";
import { useContext } from "react";
import { ProjectContext } from "../../project/project-context";
import { CoreValue } from "../../project/types/values";
import { ValuesHelper } from "../../project/helpers/values-helper";

const valuesHelper = new ValuesHelper();

export function Property(props: {
  setValue: (action: SetValueAction) => void;
  modal: boolean;
  item: PropertyMetadata | ParameterMetadata;
  parent: CoreValue;
  path: string[];
}) {
  const { state } = useContext(ProjectContext);
  const { currentValue } = valuesHelper.getPropertyValue(
    props.parent,
    props.item.name,
    props.path
  );

  const defaultValue = valuesHelper.getPropertyDefaultValue(
    props.item.docs,
    props.modal ? 75 : 45
  );

  const errors = state.computed.errors[props.parent.valueId].filter(
    (c) => c.key === props.item.name
  );

  if (props.modal) {
    return (
      <>
        <div className="px-2 py-1">
          <PropertyLabel item={props.item} />
        </div>
        <div className="px-2 py-1">
          <PropertyValue
            setValue={props.setValue}
            keyName={props.item.name}
            path={props.path}
            type={props.item.type}
            currentValue={currentValue}
            defaultValue={defaultValue}
            errors={errors}
          />
        </div>
      </>
    );
  } else {
    return (
      <div>
        <PropertyLabel item={props.item} />
        <PropertyValue
          setValue={props.setValue}
          keyName={props.item.name}
          path={props.path}
          type={props.item.type}
          currentValue={currentValue}
          defaultValue={defaultValue}
          errors={errors}
        />
      </div>
    );
  }
}
