import { useState, useRef } from "react";
// types
import type { FC, ReactElement } from "react";
import type { Placement } from "@floating-ui/react";

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
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
} from "@floating-ui/react";

// helpers
import clsx from "clsx";

type TooltipProps = {
  content: ({ handleClose }: { handleClose: () => void }) => ReactElement;
  children: (props: { open: boolean }) => ReactElement;
  className?: string;
  offset_distance?: number;
  placement: Placement;
  show_tooltip?: boolean;
};

const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  className,
  offset_distance = 20,
  placement,
  show_tooltip = true,
}) => {
  const [open, setOpen] = useState(false);
  const arrow_ref = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    placement: placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(offset_distance),
      flip(),
      shift(),
      arrow({ element: arrow_ref }),
    ],
  });

  const hover = useHover(context, {
    enabled: show_tooltip,
    handleClose: safePolygon(),
  });
  const focus = useFocus(context, {
    enabled: show_tooltip,
  });
  const click = useClick(context, {
    enabled: show_tooltip,
  });
  const dismiss = useDismiss(context, {
    enabled: show_tooltip,
  });
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    click,
    role,
  ]);

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="inline-block"
      >
        {children({ open })}
      </span>

      {show_tooltip && open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={clsx("relative z-50", className)}
          >
            <FloatingArrow
              ref={arrow_ref}
              context={context}
              width={18}
              height={9}
              fill="#fff"
              stroke="#d1d5db"
              strokeWidth={1}
              tipRadius={2}
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
              }}
            />
            {content({ handleClose: () => setOpen(false) })}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
