import type { FC, KeyboardEvent } from "react";
import { useRef, useState } from "react";
import clsx from "clsx";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  max_length: number;
  container_class_name?: string;
}

const OTPInput: FC<OTPInputProps> = ({
  value,
  onChange,
  max_length,
  container_class_name,
}) => {
  const input_refs = useRef<(HTMLInputElement | null)[]>([]);

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: max_length }, (_, index) => value[index] ?? ""),
  );

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted_value = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, max_length);

    if (!pasted_value) return;

    const new_digits = Array(max_length).fill("");

    pasted_value.split("").forEach((digit, index) => {
      new_digits[index] = digit;
    });

    setDigits(new_digits);

    onChange(new_digits.join(""));

    focusInput(Math.min(pasted_value.length, max_length) - 1);
  };

  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.replace(/\D/g, "").slice(-1);

    const new_digits = [...digits];

    new_digits[index] = digit;

    setDigits(new_digits);

    onChange(new_digits.join(""));

    if (digit && index < max_length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
   if (event.key === "Backspace") {
  event.preventDefault();

  const new_digits = [...digits];

  if (digits[index]) {
    // Clear current digit and stay here
    new_digits[index] = "";
    setDigits(new_digits);
    onChange(new_digits.join(""));
    return;
  }

  // Current input is already empty → move backward
  if (index > 0) {
    new_digits[index - 1] = "";
    setDigits(new_digits);
    onChange(new_digits.join(""));

    input_refs.current[index - 1]?.focus({
      preventScroll: true,
    });
  }

  return;
}  

    if (event.key === "Delete") {
      event.preventDefault();

      const new_digits = [...digits];

      new_digits[index] = "";

      setDigits(new_digits);
      onChange(new_digits.join(""));

      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (event.key === "ArrowRight" && index < max_length - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const focusInput = (index: number) => {
    input_refs.current[index]?.focus({ preventScroll: true });
  };

  return (
    <div
      className={clsx(
        "mt-2 flex w-full justify-between gap-2",
        container_class_name,
      )}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          onPaste={handlePaste}
          ref={(element) => {
            input_refs.current[index] = element;
          }}
          value={digit}
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 min-w-0 flex-1 rounded-md border border-gray-300 text-center text-lg font-semibold transition-all outline-none focus:border-orange-500 sm:flex-1 md:flex-1 lg:h-12 lg:w-12 lg:flex-none"
        />
      ))}
    </div>
  );
};

export default OTPInput;
