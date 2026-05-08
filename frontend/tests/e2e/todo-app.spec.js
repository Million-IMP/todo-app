import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173');
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('should create a new task', async ({ page }) => {
    // Click "New Task" button
    await page.click('button:has-text("➕ New Task")');

    // Fill in task form
    await page.fill('input[placeholder*="What needs"]', 'Buy groceries');
    await page.fill('textarea', 'Milk, bread, eggs');
    await page.selectOption('select:nth-of-type(1)', 'high'); // Priority

    // Submit form
    await page.click('button:has-text("✅ Create Task")');

    // Verify task appears in list
    await expect(page.locator('text=Buy groceries')).toBeVisible();
  });

  test('should mark task as complete', async ({ page }) => {
    // Create a task first
    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Test task');
    await page.click('button:has-text("✅ Create Task")');

    // Click checkbox to complete
    await page.click('input[type="checkbox"]');

    // Verify task shows as completed (strikethrough)
    const taskElement = page.locator('text=Test task');
    await expect(taskElement).toHaveClass(/line-through/);
  });

  test('should filter tasks by category', async ({ page }) => {
    // Create tasks with different categories
    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Work task');
    await page.selectOption('select:last-of-type', 'Work'); // Category
    await page.click('button:has-text("✅ Create Task")');

    // Filter by category (using sidebar)
    await page.click('text=Work');

    // Verify only Work tasks shown
    await expect(page.locator('text=Work task')).toBeVisible();
  });

  test('should search tasks', async ({ page }) => {
    // Create multiple tasks
    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Buy milk');
    await page.click('button:has-text("✅ Create Task")');

    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Fix code');
    await page.click('button:has-text("✅ Create Task")');

    // Search
    await page.fill('input[placeholder*="Search"]', 'milk');

    // Verify only matching task shown
    await expect(page.locator('text=Buy milk')).toBeVisible();
    await expect(page.locator('text=Fix code')).not.toBeVisible();
  });

  test('should export tasks as JSON', async ({ page }) => {
    // Create a task
    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Export test');
    await page.click('button:has-text("✅ Create Task")');

    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("📥 Export")');
    const download = await downloadPromise;

    // Verify file is downloaded
    expect(download.suggestedFilename()).toContain('todo-export');
  });

  test('should snooze a task', async ({ page }) => {
    // Create task with deadline
    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Snooze test');

    // Set deadline (1 hour from now)
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 16);
    await page.fill('input[type="datetime-local"]', dateStr);

    await page.click('button:has-text("✅ Create Task")');

    // Find and click snooze button
    await page.click('button:has-text("⏸️")');

    // Click snooze option (5 minutes)
    await page.click('button:has-text("5 min")');

    // Verify task shows snoozed status
    await expect(page.locator('text=Snoozed')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Click settings button
    await page.click('button:has-text("⚙️")');

    // Get initial background color
    const app = page.locator('[class*="bg-gray-50"]').first();

    // Click dark mode toggle
    await page.click('input[type="checkbox"]');

    // Verify dark mode class applied
    const darkModeClass = await page.locator('html').getAttribute('class');
    expect(darkModeClass).toContain('dark');
  });

  test('should persist data across reload', async ({ page }) => {
    // Create a task
    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Persistence test');
    await page.click('button:has-text("✅ Create Task")');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify task still exists
    await expect(page.locator('text=Persistence test')).toBeVisible();
  });

  test('should show notification permission banner', async ({ page }) => {
    // Notification banner should appear
    const banner = page.locator('text=Enable notifications');
    await expect(banner).toBeVisible({ timeout: 5000 });
  });

  test('should complete full task workflow', async ({ page }) => {
    // 1. Create task
    await page.click('button:has-text("➕ New Task")');
    await page.fill('input[placeholder*="What needs"]', 'Complete workflow');
    await page.fill('textarea', 'Full test workflow');
    await page.selectOption('select:nth-of-type(1)', 'high');
    await page.click('button:has-text("✅ Create Task")');

    // 2. Verify creation
    await expect(page.locator('text=Complete workflow')).toBeVisible();

    // 3. Edit task
    await page.click('button:has-text("✏️")');
    await page.fill('textarea', 'Updated description');
    await page.click('button:has-text("💾 Update Task")');

    // 4. Complete task
    await page.click('input[type="checkbox"]');
    await expect(page.locator('text=Complete workflow')).toHaveClass(/line-through/);

    // 5. Delete task
    await page.click('button:has-text("🗑️")');

    // Verify task removed
    await expect(page.locator('text=Complete workflow')).not.toBeVisible();
  });
});
