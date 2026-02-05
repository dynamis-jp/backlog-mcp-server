import { SafeResult } from '../../types/result.js';
import { countTokens, truncateToTokenLimit } from '../../utils/tokenCounter.js';

export function wrapWithTokenLimit<I, O>(
  fn: (input: I) => Promise<SafeResult<O>>,
  maxTokens: number
): (input: I) => Promise<SafeResult<string>> {
  return async (input: I) => {
    const result = await fn(input);
    if (
      result == null ||
      typeof result !== 'object' ||
      result.kind == 'error'
    ) {
      return result;
    }

    const fullText = JSON.stringify(result.data, null, 2);
    const tokenCount = countTokens(fullText);

    if (tokenCount > maxTokens) {
      const truncated = truncateToTokenLimit(fullText, maxTokens);
      return {
        kind: 'ok',
        data: `${truncated}\n...(output truncated due to token limit)`,
      };
    }

    return { kind: 'ok', data: fullText };
  };
}
