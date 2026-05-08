// Date and time utilities

export function formatDeadline(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleString();
}

export function formatDeadlineShort(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if today
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Check if tomorrow
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Otherwise, show date and time
  return date.toLocaleString();
}

export function getTimeUntilDeadline(dateString) {
  if (!dateString) return null;
  const deadline = new Date(dateString);
  const now = new Date();
  const diff = deadline - now;

  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    return { overdue: true, hours, minutes, label: `${hours}h ${minutes}m overdue` };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { overdue: false, hours, minutes, label: `${hours}h ${minutes}m remaining` };
}

export function isDeadlineApproaching(dateString, thresholdMs = 3600000) {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  const now = new Date();
  const timeUntil = deadline - now;
  return timeUntil <= thresholdMs && timeUntil > 0;
}

export function isDeadlineOverdue(dateString) {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  const now = new Date();
  return deadline < now;
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function getLocalDateTimeString(date = new Date()) {
  // Format for datetime-local input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatTimeRemaining(dateString) {
  if (!dateString) return null;
  const deadline = new Date(dateString);
  const now = new Date();
  const diff = deadline - now;

  if (diff < 0) {
    const absDiff = Math.abs(diff);
    if (absDiff < 60000) return 'Just now';
    if (absDiff < 3600000) return `${Math.floor(absDiff / 60000)}m ago`;
    if (absDiff < 86400000) return `${Math.floor(absDiff / 3600000)}h ago`;
    return `${Math.floor(absDiff / 86400000)}d ago`;
  }

  if (diff < 60000) return 'In a moment';
  if (diff < 3600000) return `In ${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `In ${Math.floor(diff / 3600000)}h`;
  return `In ${Math.floor(diff / 86400000)}d`;
}
