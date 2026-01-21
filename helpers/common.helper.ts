// Convert smart quotes → normal apostrophe before comparison:
const normalizeText = (str: string) =>
  str.toLowerCase().replace(/[’‘]/g, "'").trim();

export { normalizeText };
