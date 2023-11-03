import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useCallback, useContext, useMemo } from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import { TypesHelper } from "../../project/helpers/types-helper";
import { ProjectContext } from "../../project/project-context";
import { ParameterMetadata, PropertyMetadata } from "../../types";

const typesHelper = new TypesHelper();

export function PropertyLabel(props: {
  item: PropertyMetadata | ParameterMetadata;
}) {
  const { state } = useContext(ProjectContext);
  const { item } = props;

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(
    {
      placement: "top",
      delayShow: 200,
      interactive: true,
    },
    {
      strategy: "fixed",
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            altAxis: true,
            padding: 6,
          },
        },
      ],
    }
  );

  const link = useMemo(() => {
    let link = "";

    if (item.docs?.see && item.docs.see.length > 0) {
      link = item.docs.see;
    } else if (item.docs?.link && item.docs.link.length > 0) {
      link = item.docs.link;
    } else if (state.blueprintComputed.platform === "cdktf") {
      const regex = /{@link (.*?)}/g;
      const matches = regex.exec(item.docs?.summary ?? "");
      if (matches) {
        link = matches[1];
      }
    }

    return link;
  }, [item.docs, state.blueprintComputed.platform]);

  const onHintClick = useCallback(() => {
    window.open(link, "_blank");
  }, [link]);

  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        <div className="inline-block" ref={setTriggerRef}>
          {item.name}
        </div>
        {!item.optional ? "*" : ""}
        {link && (
          <>
            &nbsp;
            <InformationCircleIcon
              className="h-4 w-4 inline-block cursor-pointer"
              onClick={onHintClick}
            />
          </>
        )}
      </label>
      {visible && item.docs?.summary && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
        >
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          <pre
            className="language-markdown w-full h-full"
            dangerouslySetInnerHTML={{
              __html: typesHelper.getCommentText(item),
            }}
          />
        </div>
      )}
    </>
  );
}
