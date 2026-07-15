import { FAQPage, Question, WithContext } from "schema-dts";

interface IFAQSection {
  category: string;
  questions: {
    id: number;
    question: string;
    answer: string;
  }[];
}

interface IFAQArgs {
  title: string;
  description: string;
  url: string;
  faqs: IFAQSection[];
}

const createFAQJSONLD = ({
  title,
  description,
  url,
  faqs,
}: IFAQArgs): WithContext<FAQPage> => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-IN",
    isPartOf: {
      "@id": `${base_url}#website`,
    },
    mainEntity: faqs.flatMap((section) =>
      section.questions.map<Question>((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    ),
  };
};

export default createFAQJSONLD;
