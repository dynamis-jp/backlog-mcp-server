import { countTokens, truncateToTokenLimit } from './tokenCounter.js';
import { describe, it, expect } from '@jest/globals';

describe('countTokens', () => {
  it('returns 0 for empty string', () => {
    expect(countTokens('')).toBe(0);
  });

  it('counts simple words', () => {
    expect(countTokens('hello world')).toBe(2);
    expect(countTokens('one two three')).toBe(3);
  });

  it('ignores multiple spaces/tabs/newlines', () => {
    expect(countTokens('hello     world')).toBe(2);
    expect(countTokens('hello\tworld')).toBe(2);
    expect(countTokens('hello\nworld')).toBe(2);
    expect(countTokens('hello \n\t world')).toBe(2);
  });

  it('counts punctuation as separate tokens', () => {
    expect(countTokens('hello, world!')).toBe(4);
    expect(countTokens('foo(bar)')).toBe(4);
  });

  it('handles mixed text', () => {
    const input = "This is great, isn't it?";
    // Tokens: ['This', 'is', 'great', ',', 'isn', "'", 't', 'it', '?']
    expect(countTokens(input)).toBe(9);
  });

  it('trims leading/trailing whitespace', () => {
    expect(countTokens('   hello world   ')).toBe(2);
  });

  it('counts digits and symbols', () => {
    expect(countTokens('123 + 456 = 579')).toBe(5); // ['123', '+', '456', '=', '579']
  });

  it('counts Japanese', () => {
    expect(countTokens('こんにちは')).toBe(5);
  });
});

describe('truncateToTokenLimit', () => {
  it('returns full text when under limit', () => {
    const text = 'hello world foo';
    expect(truncateToTokenLimit(text, 10)).toBe(text);
  });

  it('truncates text at the token boundary', () => {
    const text = 'one two three four five';
    const result = truncateToTokenLimit(text, 3);
    // Should include exactly 3 tokens: 'one', 'two', 'three'
    expect(countTokens(result)).toBe(3);
    expect(result).toBe('one two three');
  });

  it('handles punctuation tokens correctly', () => {
    const text = 'hello, world! foo';
    // tokens: 'hello' ',' ' ' 'world' '!' ' ' 'foo'
    // counted tokens: 'hello', ',', 'world', '!', 'foo' = 5
    const result = truncateToTokenLimit(text, 3);
    // Should include: 'hello', ',', 'world' (3 counted tokens)
    expect(countTokens(result)).toBe(3);
  });

  it('returns empty string for empty input', () => {
    expect(truncateToTokenLimit('', 5)).toBe('');
  });

  it('returns full text when limit equals token count', () => {
    const text = 'one two three';
    expect(truncateToTokenLimit(text, 3)).toBe(text);
  });
});
