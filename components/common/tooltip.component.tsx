import { useState, useRef } from "react";
// types
import type { FC, ReactElement } from "react";

// float react
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  safePolygon,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
} from "@floating-ui/react";

// helpers
import clsx from "clsx";

type TooltipProps = {
  content: ReactElement;
  children: (props: { open: boolean }) => ReactElement;
  className?: string;
  offset_distance?: number;
};

const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  className,
  offset_distance = 20,
}) => {
  const [open, setOpen] = useState(false);
  const arrow_ref = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context, middlewareData, placement } =
    useFloating({
      placement: "bottom",
      open,
      onOpenChange: setOpen,
      middleware: [
        offset(offset_distance),
        flip(),
        shift(),
        arrow({ element: arrow_ref }),
      ],
    });
  const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};

  const hover = useHover(context, {
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[placement.split("-")[0]];

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="inline-block"
      >
        {children({ open })}
      </span>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={clsx("relative", className)}
          >
            <FloatingArrow
              ref={arrow_ref}
              context={context}
              width={20}
              height={10}
              fill="#fff"
              tipRadius={3}
            />
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
