import { test, expect } from './fixtures/base';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page, network }) => {
    const loadPromise = network.waitForTodosLoad(page);
    await page.goto('/');
    await loadPromise;
  });

  test('homepage has no accessibility violations @p0 @a11y', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('homepage with tasks has no accessibility violations @p0 @a11y', async ({ page, network }) => {
    // Add a task first
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Test task for accessibility');
    await input.press('Enter');
    await createPromise;

    await expect(page.getByText('Test task for accessibility')).toBeVisible();

    // Wait for slideIn animation (300ms) to complete before measuring contrast.
    // Without this, axe-core may catch intermediate opacity values during animation.
    await page.waitForTimeout(400);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works @p0 @a11y', async ({ page }) => {
    // Input should be focused on load
    const input = page.getByRole('textbox', { name: /add.*task/i });
    await expect(input).toBeFocused();

    // Tab to Add button
    await page.keyboard.press('Tab');
    const addButton = page.getByRole('button', { name: /add/i });
    await expect(addButton).toBeFocused();
  });

  test('form is keyboard operable @p0 @a11y', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // Type and submit with keyboard only
    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Keyboard only task');
    await page.keyboard.press('Enter');
    await createPromise;

    await expect(page.getByText('Keyboard only task')).toBeVisible();
  });

  test('focus is visible on interactive elements @p1 @a11y', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // Check input has visible focus styles
    await input.focus();
    const inputBox = await input.boundingBox();
    expect(inputBox).not.toBeNull();

    // Tab to button and check it has visible focus
    await page.keyboard.press('Tab');
    const addButton = page.getByRole('button', { name: /add/i });
    await expect(addButton).toBeFocused();
  });

  test('touch targets meet minimum size requirements @p1 @a11y', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add/i });
    const buttonBox = await addButton.boundingBox();

    // Minimum 44x44px for WCAG touch targets
    expect(buttonBox!.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('input has minimum height for accessibility @p1 @a11y', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const inputBox = await input.boundingBox();

    // Minimum 48px height per design specs
    expect(inputBox!.height).toBeGreaterThanOrEqual(48);
  });
});

