import { useContext } from "react";
import { useTransition, animated } from "react-spring";
import { ProjectContext } from "../../project/project-context";
import { ItemsEmpty } from "./items-empty";
import { Item } from "./item";
import { CoreValue } from "../../project/types/values";

const height = 110;

export function Items() {
  const { state } = useContext(ProjectContext);
  const transitions = useTransition(
    state.computed.selectedContainer.children.map((value, i) => ({
      ...value,
      y: height * i,
    })),
    {
      key: (value: CoreValue) => value.valueId,
      from: { position: "absolute", height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y }) => ({ y, height, opacity: 1 }),
      update: ({ y }) => ({ y, height }),
      config: () => ({
        duration: 200,
      }),
    }
  );

  const total = state.computed.selectedContainer.children.length;
  if (total === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <ItemsEmpty name={state.computed.selectedContainer.valueName || ""} />
      </div>
    );
  }

  return (
    <div
      className="pb-4 relative"
      style={{ height: total * height + height * 0.7 }}
    >
      {transitions((itemStyle, value, _t, index) => (
        <animated.div style={{ ...(itemStyle as any), width: "100%" }}>
          <Item value={value} total={total} index={index} />
        </animated.div>
      ))}
    </div>
  );
}
