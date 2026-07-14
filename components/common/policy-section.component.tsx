import type { FC } from "react";

export interface IPolicySection {
  id: string;
  title: string;
  intro?: string;
  paragraphs?: string[];
  list?: string[];
  note?: string;
  highlight?: string;
}
const PolicySection: FC<{ policies: Array<IPolicySection> }> = ({
  policies,
}) => {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-gray-300 bg-white sm:rounded-2xl">
      {policies.map((section, index) => (
        <article
          key={section.id}
          id={section.id}
          className={`p-4 sm:p-8 ${
            index !== policies.length - 1 ? "border-b border-gray-300" : ""
          }`}
        >
          {/* Heading */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
              {section.title}
            </h2>
          </div>

          {/* Content */}
          <div className="mt-3 space-y-4 sm:mt-6 sm:space-y-5">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="leading-8 text-gray-600">
                {paragraph}
              </p>
            ))}

            {section.intro && (
              <p className="font-medium text-gray-700">{section.intro}</p>
            )}

            {section.list && (
              <ul className="space-y-3">
                {section.list.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />

                    <span className="leading-7 text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.note && (
              <div className="rounded-xl border border-gray-300 bg-gray-50 p-3 sm:p-5">
                <p className="leading-7 text-gray-700">{section.note}</p>
              </div>
            )}

            {section.highlight && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 sm:p-5">
                <p className="leading-7 text-gray-700">{section.highlight}</p>
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
};
export default PolicySection;
