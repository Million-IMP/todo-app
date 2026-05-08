// Input validation utilities

export function validateTaskTitle(title) {
  if (!title || !title.trim()) {
    return { valid: false, error: 'Title is required' };
  }
  if (title.length > 100) {
    return { valid: false, error: 'Title must be 100 characters or less' };
  }
  return { valid: true };
}

export function validateTaskDescription(description) {
  if (description && description.length > 500) {
    return { valid: false, error: 'Description must be 500 characters or less' };
  }
  return { valid: true };
}

export function validateDeadline(deadline) {
  if (!deadline) {
    return { valid: true }; // Deadline is optional
  }

  try {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid deadline date' };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid deadline format' };
  }
}

export function validateCategory(category) {
  if (!category || !category.trim()) {
    return { valid: true }; // Category is optional
  }
  if (category.length > 50) {
    return { valid: false, error: 'Category name must be 50 characters or less' };
  }
  return { valid: true };
}

export function validateTag(tag) {
  if (!tag || !tag.trim()) {
    return { valid: false, error: 'Tag cannot be empty' };
  }
  if (tag.length > 30) {
    return { valid: false, error: 'Tag must be 30 characters or less' };
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(tag)) {
    return { valid: false, error: 'Tag can only contain letters, numbers, hyphens, and underscores' };
  }
  return { valid: true };
}

export function validateLabel(label) {
  if (!label || !label.trim()) {
    return { valid: false, error: 'Label cannot be empty' };
  }
  if (label.length > 30) {
    return { valid: false, error: 'Label must be 30 characters or less' };
  }
  return { valid: true };
}
