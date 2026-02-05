export function countTokens(text: string): number {
  // Normalize whitespace (convert tabs and newlines to spaces)
  const normalized = text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with a single space
    .replace(/[\n\t]/g, ' ') // Replace newlines and tabs with a space
    .trim();

  // Split into words and individual symbols
  const tokens = normalized.match(/\w+|[^\s\w]/g);

  // Return the number of tokens
  return tokens ? tokens.length : 0;
}

/**
 * Truncate text to fit within the given token limit, using the same
 * tokenization logic as countTokens for consistency.
 */
export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const tokens = text.match(/\w+|[^\s\w]|\s+/g);
  if (!tokens) return text;

  let tokenCount = 0;
  let charIndex = 0;

  for (const token of tokens) {
    // Only count non-whitespace tokens (matches countTokens logic)
    if (/\w+|[^\s\w]/.test(token)) {
      tokenCount++;
    }
    if (tokenCount > maxTokens) {
      break;
    }
    charIndex += token.length;
  }

  return text.slice(0, charIndex).trimEnd();
}
