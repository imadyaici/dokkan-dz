import { describe, expect, it } from 'vitest';

import { isValidPhoneNumber } from '../phoneNumber';

describe('isValidPhoneNumber', () => {
  it('validates a correct Algerian mobile number (0-prefixed)', () => {
    // Algerian mobile numbers: 05/06/07 followed by 8 digits
    expect(isValidPhoneNumber('0555123456')).toBe(true);
  });

  it('validates a correct Algerian mobile number (international format)', () => {
    expect(isValidPhoneNumber('+213555123456')).toBe(true);
  });

  it('rejects an invalid phone number', () => {
    expect(isValidPhoneNumber('12345')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidPhoneNumber('')).toBe(false);
  });

  it('rejects a completely wrong format', () => {
    expect(isValidPhoneNumber('not-a-phone-number')).toBe(false);
  });

  it('validates a landline number', () => {
    // Algerian landline: 02x or 03x
    expect(isValidPhoneNumber('021234567')).toBe(true);
  });
});
