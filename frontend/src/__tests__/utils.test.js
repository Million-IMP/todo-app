import { describe, it, expect } from 'vitest';
import {
  formatDeadline,
  formatTimeRemaining,
  isDeadlineApproaching,
  isDeadlineOverdue,
  getLocalDateTimeString,
} from '../utils/dateUtils';
import {
  validateTaskTitle,
  validateTaskDescription,
  validateDeadline,
  validateCategory,
  validateTag,
} from '../utils/validators';
import { generateId } from '../utils/uuid';

describe('Date Utilities', () => {
  it('should format deadline correctly', () => {
    const date = '2026-05-10T14:00:00Z';
    const result = formatDeadline(date);
    expect(result).toBeTruthy();
  });

  it('should return null for missing deadline', () => {
    expect(formatDeadline(null)).toBeNull();
  });

  it('should detect approaching deadline (1h before)', () => {
    const now = new Date();
    const approaching = new Date(now.getTime() + 30 * 60000); // 30 min from now
    const result = isDeadlineApproaching(approaching.toISOString(), 3600000);
    expect(result).toBe(true);
  });

  it('should detect overdue deadline', () => {
    const pastDate = new Date(Date.now() - 60 * 60000); // 1 hour ago
    const result = isDeadlineOverdue(pastDate.toISOString());
    expect(result).toBe(true);
  });

  it('should format time remaining correctly', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60000); // 2 hours from now
    const result = formatTimeRemaining(futureDate.toISOString());
    expect(result).toContain('In');
    expect(result).toContain('h');
  });
});

describe('Validators', () => {
  it('should validate task title', () => {
    expect(validateTaskTitle('Valid Task')).toEqual({ valid: true });
    expect(validateTaskTitle('').valid).toBe(false);
    expect(validateTaskTitle('a'.repeat(101)).valid).toBe(false);
  });

  it('should validate task description', () => {
    expect(validateTaskDescription('Valid description')).toEqual({ valid: true });
    expect(validateTaskDescription('a'.repeat(501)).valid).toBe(false);
  });

  it('should validate deadline', () => {
    const validDate = '2026-05-10T14:00:00Z';
    expect(validateDeadline(validDate)).toEqual({ valid: true });
    expect(validateDeadline('invalid-date').valid).toBe(false);
  });

  it('should validate category', () => {
    expect(validateCategory('Work')).toEqual({ valid: true });
    expect(validateCategory('a'.repeat(51)).valid).toBe(false);
  });

  it('should validate tag', () => {
    expect(validateTag('urgent')).toEqual({ valid: true });
    expect(validateTag('invalid tag').valid).toBe(false);
    expect(validateTag('a'.repeat(31)).valid).toBe(false);
  });
});

describe('UUID Generator', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toEqual(id2);
  });

  it('should generate valid UUID format', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(id)).toBe(true);
  });
});
