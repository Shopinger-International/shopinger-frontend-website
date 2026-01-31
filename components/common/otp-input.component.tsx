// types
import type { FC } from "react";
import type { RenderProps, SlotProps } from "input-otp";

// external component
import { OTPInput as ExternalOTPInput } from "input-otp";

// helpers
import clsx from "clsx";

function Slot(props: SlotProps) {
  return (
    <div
      className={clsx(
        "text-md relative h-10 w-10 sm:h-12 sm:w-12",
        "flex items-center justify-center",
        "rounded-md border border-gray-300",
        "transition-all duration-300",
        props.isActive && "border-orange-500",
      )}
    >
      <div>{props.char ?? props.placeholderChar}</div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="animate-caret-blink absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-px bg-black" />
    </div>
  );
}

const OTPInput: FC<{
  value: string;
  onChange: (val: string) => void;
  maxLength: number;
  containerClassName: string;
}> = ({ value, onChange, maxLength, containerClassName }) => {
  return (
    <ExternalOTPInput
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      containerClassName={containerClassName}
      render={({ slots }) => (
        <div className="mx-auto mt-2 flex gap-2">
          {slots.map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
        </div>
      )}
    />
  );
};

export default OTPInput;
