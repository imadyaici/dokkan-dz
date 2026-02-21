import { describe, expect, it } from 'vitest';

import { formatMoney } from '../utils';

describe('formatMoney', () => {
  it('formats DZD amount in French locale by default', () => {
    const result = formatMoney(1500);
    expect(result).toContain('1');
    expect(result).toContain('500');
    expect(result).toContain('DA');
  });

  it('formats DZD amount in Arabic when lang is "ar"', () => {
    const result = formatMoney(1500, 'ar');
    expect(result).toContain('د.ج.');
  });

  it('handles zero amount', () => {
    const result = formatMoney(0);
    expect(result).toBeDefined();
    expect(result).toContain('0');
  });

  it('handles large amounts', () => {
    const result = formatMoney(1000000);
    expect(result).toBeDefined();
  });
});
