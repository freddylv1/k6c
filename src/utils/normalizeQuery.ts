export function normalizeQuery(query: string): string {
  if (!query) return '';
  return query
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, '') // Remove all whitespace (regular and full-width)
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()？，。！「」『』【】《》]/g, ''); // Remove common punctuation
}
