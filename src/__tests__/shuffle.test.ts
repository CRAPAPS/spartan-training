import { describe, it, expect } from 'vitest';
import { shuffle } from '@/lib/shuffle';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input)).toHaveLength(input.length);
  });

  it('contains all original elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle(input);
    expect(result.sort()).toEqual([...input].sort());
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces varied orderings across multiple runs', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const results = new Set(
      Array.from({ length: 20 }, () => shuffle(input).join(','))
    );
    // With 8 elements the chance of 20 identical orderings is astronomically small
    expect(results.size).toBeGreaterThan(1);
  });
});
