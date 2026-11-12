export function normalizeQuery(query: string): string {
  if (!query) return '';
  return query
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()？，。！「」『』【】《》]/g, '');
}
