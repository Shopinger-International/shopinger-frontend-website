import type { FC } from "react";

type PolicyContent =
  | {
      type: "text";
      title?: string;
      text: string;
    }
  | {
      type: "list";
      title?: string;
      items: string[];
    }
  | {
      type: "note";
      title?: string;
      text: string;
    }
  | {
      type: "highlight";
      title?: string;
      text: string;
    };

export interface IPolicySection {
  id: string;
  title: string;
  content: PolicyContent[];
}

const PolicySection: FC<{ policies: IPolicySection[] }> = ({ policies }) => {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-gray-300 bg-white sm:rounded-2xl">
      {policies.map((section, index) => {
        return (
          <article
            key={section.id}
            id={section.id}
            className={`p-4 sm:p-8 ${
              index !== policies.length - 1 ? "border-b border-gray-300" : ""
            }`}
          >
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              {section.title}
            </h2>

            <div className="mt-3 space-y-5 sm:mt-4">
              {section.content.map((item, i) => {
                switch (item.type) {
                  case "text":
                    return (
                      <div key={i}>
                        {item.title && (
                          <h3 className="mb-2 font-semibold text-gray-900">
                            {item.title}
                          </h3>
                        )}
                        <p className="leading-8 text-gray-600">{item.text}</p>
                      </div>
                    );
                  case "list":
                    return (
                      <div key={i}>
                        {item.title && (
                          <h3 className="mb-2 font-semibold text-gray-900">
                            {item.title}
                          </h3>
                        )}
                        <ul className="space-y-3">
                          {item.items.map((listItem) => (
                            <li
                              key={listItem}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                              <span className="leading-7 text-gray-600">
                                {listItem}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );

                  case "note":
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-300 bg-gray-50 p-3 sm:p-5"
                      >
                        <p className="leading-7 text-gray-700">{item.text}</p>
                      </div>
                    );

                  case "highlight":
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-orange-200 bg-orange-50 p-3 sm:p-5"
                      >
                        <p className="leading-7 text-gray-700">{item.text}</p>
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default PolicySection;
