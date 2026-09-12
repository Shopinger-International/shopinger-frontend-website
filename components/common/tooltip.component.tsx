import { useState, useRef, useEffect } from "react";
// types
import type { FC, ReactElement } from "react";
import type { Placement } from "@floating-ui/react";

// float react
import {
  useFloating,
  autoUpdate,
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
  FloatingOverlay,
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
  default_open?: boolean;
  strategy?: "absolute" | "fixed";
  trigger?: "hover" | "click";
  static_offset?: number;
  show_overlay?: boolean;
  toggle?: boolean;
};

const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  className,
  offset_distance = 20,
  placement,
  show_tooltip = true,
  default_open = false,
  strategy = "absolute",
  trigger = "hover",
  static_offset,
  show_overlay = false,
  toggle = true,
}) => {
  const [open, setOpen] = useState(false);
  const arrow_ref = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    placement: placement,
    open,
    onOpenChange: setOpen,
    ...(strategy == "absolute"
      ? {
          whileElementsMounted: autoUpdate,
        }
      : {
          strategy: "fixed",
        }),
    middleware: [
      offset(offset_distance),
      flip(),
      shift(),
      arrow({ element: arrow_ref }),
    ],
  });

  const hover = useHover(context, {
    enabled: show_tooltip && trigger == "hover" && !default_open,
    handleClose: safePolygon(),
  });
  const focus = useFocus(context, {
    enabled: show_tooltip,
  });
  const click = useClick(context, {
    enabled: show_tooltip && trigger == "click",
    toggle,
  });
  const dismiss = useDismiss(context, {
    enabled: show_tooltip,
    outsidePress: !default_open,
  });
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    click,
    role,
  ]);

  useEffect(() => {
    setOpen(default_open);
  }, [default_open]);

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="item-center inline-flex"
      >
        {children({ open })}
      </span>

      {show_tooltip && open && (
        <FloatingPortal>
          {show_overlay && (
            <FloatingOverlay className="bg-black/40 z-100" lockScroll />
          )}
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={clsx("relative z-120", className)}
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
              staticOffset={static_offset}
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
              }}
            />
            <div className="overflow-hidden rounded-lg outline-none">
              {content({ handleClose: () => setOpen(false) })}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
