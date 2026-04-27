import { useState } from "react";
// types
import type { FC } from "react";

const FAQItem: FC<{
  question: string;
  answer: string;
}> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 py-3 last:border-none">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-gray-900">{question}</span>

        <span className="text-lg text-gray-600">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{answer}</p>
      )}
    </div>
  );
};
export default FAQItem;
