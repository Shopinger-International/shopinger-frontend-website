const generateMetaDescription = (htmlDescription: string) => {
  // 1. Remove HTML tags
  const plainText = htmlDescription.replace(/<[^>]*>?/gm, "");

  // 2. Trim extra spaces
  const cleanText = plainText.replace(/\s+/g, " ").trim();

  // 3. Limit to 155 characters without breaking word
  const maxLength = 155;
  if (cleanText.length <= maxLength) return cleanText;

  const trimmed = cleanText.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "...";
};
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD") // handle accents
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-") // replace spaces with hyphen
    .replace(/-+/g, "-"); // remove duplicate hyphens
};

export { generateMetaDescription, generateSlug };
