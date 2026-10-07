import { useRef, useState } from "react";

// types
import type { FC, KeyboardEvent, ClipboardEvent } from "react";

// helpers
import clsx from "clsx";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  max_length: number;
  container_class_name?: string;
  autoComplete?: string;
}

const OTPInput: FC<OTPInputProps> = ({
  value,
  onChange,
  max_length,
  container_class_name,
  autoComplete = "one-time-code",
}) => {
  const input_refs = useRef<(HTMLInputElement | null)[]>([]);

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: max_length }, (_, index) => value[index] ?? ""),
  );

  const updateValue = (new_digits: string[]) => {
    setDigits(new_digits);

    onChange(new_digits.join(""));
  };

  const focusInput = (index: number) => {
    if (index < 0 || index >= max_length) return;

    input_refs.current[index]?.focus();

    input_refs.current[index]?.select();
  };

  const handleChange = (index: number, inputValue: string) => {
    const clean_value = inputValue.replace(/\D/g, "");

    if (!clean_value) {
      const new_digits = [...digits];

      new_digits[index] = "";

      updateValue(new_digits);

      return;
    }

    // Handle multi-character input/autofill
    if (clean_value.length > 1) {
      const new_digits = Array(max_length).fill("");

      clean_value
        .slice(0, max_length)
        .split("")
        .forEach((digit, digit_index) => {
          new_digits[digit_index] = digit;
        });

      updateValue(new_digits);

      focusInput(Math.min(clean_value.length, max_length) - 1);

      return;
    }

    // Normal single digit
    const new_digits = [...digits];

    new_digits[index] = clean_value;

    updateValue(new_digits);

    // Move to next field
    if (index < max_length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
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

    updateValue(new_digits);

    focusInput(Math.min(pasted_value.length, max_length) - 1);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    // Backspace
    if (event.key === "Backspace") {
      event.preventDefault();

      const new_digits = [...digits];

      // If current field has a value,
      // clear ONLY the current field.
      if (new_digits[index]) {
        new_digits[index] = "";

        updateValue(new_digits);

        return;
      }

      // Current field empty → go to previous field
      if (index > 0) {
        new_digits[index - 1] = "";

        updateValue(new_digits);

        focusInput(index - 1);
      }

      return;
    }

    // Delete
    if (event.key === "Delete") {
      event.preventDefault();

      const new_digits = [...digits];

      new_digits[index] = "";

      updateValue(new_digits);

      return;
    }

    // Arrow Left
    if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (index > 0) {
        focusInput(index - 1);
      }

      return;
    }

    // Arrow Right
    if (event.key === "ArrowRight") {
      event.preventDefault();

      if (index < max_length - 1) {
        focusInput(index + 1);
      }

      return;
    }

    // Prevent non-numeric characters
    if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
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
          ref={(element) => {
            input_refs.current[index] = element;
          }}
          value={digit}
          maxLength={max_length}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? autoComplete : "off"}
          onChange={(event) => handleChange(index, event.target.value)}
          onPaste={handlePaste}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 min-w-0 flex-1 rounded-md border border-gray-300 text-center text-lg font-semibold transition-all outline-none focus:border-brand lg:h-12 lg:w-12 lg:flex-none"
        />
      ))}
    </div>
  );
};

export default OTPInput;
