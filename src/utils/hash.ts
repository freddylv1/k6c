export function generateContentHash(content: string): string {
  let hash = 0;
  if (content.length === 0) return 'hash_0';
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}
