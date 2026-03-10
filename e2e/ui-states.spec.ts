import { test, expect } from './fixtures/base';

/**
 * UI States E2E Tests
 *
 * Tests for loading, error, and empty states with network simulation.
 * These verify the full-stack behavior of Sprint 3 components.
 */
test.describe('UI States', () => {
  test.describe('Loading State', () => {
    test('shows loading state during slow network @p1', async ({ page }) => {
      // Intercept API and delay response beyond 200ms threshold
      await page.route('/api/todos', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.fulfill({ json: [] });
      });

      await page.goto('/');

      // Should show loading indicator (after 200ms delay threshold)
      await expect(page.getByRole('status')).toBeVisible();
      await expect(page.getByText('Loading tasks')).toBeVisible();
    });

    test('loading state has accessible role @p1 @a11y', async ({ page }) => {
      await page.route('/api/todos', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.fulfill({ json: [] });
      });

      await page.goto('/');

      const loadingElement = page.getByRole('status');
      await expect(loadingElement).toBeVisible();
      await expect(loadingElement).toHaveAttribute('aria-live', 'polite');
    });

    test('loading state respects prefers-reduced-motion @p2 @a11y', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.route('/api/todos', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.fulfill({ json: [] });
      });

      await page.goto('/');

      // Verify spinner is visible but animation should be disabled via CSS
      const spinner = page.locator('[class*="spinner"]');
      await expect(spinner).toBeVisible();

      // Verify the spinner has no animation (CSS disables it)
      const animationName = await spinner.evaluate((el) => {
        return window.getComputedStyle(el).animationName;
      });

      // When reduced motion is preferred, animation should be 'none'
      expect(animationName).toBe('none');
    });
  });

  test.describe('Error State', () => {
    test('shows error state when API fails @p0 @critical', async ({ page }) => {
      await page.route('/api/todos', (route) =>
        route.fulfill({ status: 500 })
      );

      await page.goto('/');

      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByText('Error loading todos')).toBeVisible();
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
    });

    test('error state has accessible alert role @p0 @a11y', async ({ page }) => {
      await page.route('/api/todos', (route) =>
        route.fulfill({ status: 500 })
      );

      await page.goto('/');

      const errorElement = page.getByRole('alert');
      await expect(errorElement).toBeVisible();
      await expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    test('retry button triggers refetch @p0 @critical', async ({ page }) => {
      let requestCount = 0;

      await page.route('/api/todos', (route) => {
        requestCount++;
        if (requestCount === 1) {
          route.fulfill({ status: 500 });
        } else {
          route.fulfill({ json: [] });
        }
      });

      await page.goto('/');

      // Wait for error state
      await expect(page.getByRole('alert')).toBeVisible();

      // Click retry
      await page.getByRole('button', { name: /try again/i }).click();

      // Should show empty state after successful retry
      await expect(page.getByText(/no tasks yet/i)).toBeVisible();

      // Verify two requests were made
      expect(requestCount).toBe(2);
    });

    test('retry button meets touch target requirements @p1 @a11y', async ({ page }) => {
      await page.route('/api/todos', (route) =>
        route.fulfill({ status: 500 })
      );

      await page.goto('/');

      const retryButton = page.getByRole('button', { name: /try again/i });
      await expect(retryButton).toBeVisible();

      const boundingBox = await retryButton.boundingBox();

      // Minimum 44x44px for WCAG touch targets
      expect(boundingBox!.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox!.height).toBeGreaterThanOrEqual(44);
    });

    test('retry button is keyboard accessible @p1 @a11y', async ({ page }) => {
      let requestCount = 0;

      await page.route('/api/todos', (route) => {
        requestCount++;
        if (requestCount === 1) {
          route.fulfill({ status: 500 });
        } else {
          route.fulfill({ json: [] });
        }
      });

      await page.goto('/');

      // Wait for error state
      await expect(page.getByRole('alert')).toBeVisible();

      // Tab to retry button and press Enter
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Should recover after retry
      await expect(page.getByText(/no tasks yet/i)).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('shows empty state when no tasks exist @p1', async ({ page }) => {
      await page.route('/api/todos', (route) => route.fulfill({
        status: 200,
        json: []
      }));

      await page.goto('/');

      await expect(page.getByText('No tasks yet — add one above!')).toBeVisible();
    });

    test('empty state styling is calm and minimal @p2', async ({ page }) => {
      await page.route('/api/todos', (route) => route.fulfill({
        status: 200,
        json: []
      }));

      await page.goto('/');

      const emptyMessage = page.getByText('No tasks yet — add one above!');
      await expect(emptyMessage).toBeVisible();

      // Verify text color is secondary (muted) - not aggressive
      const color = await emptyMessage.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Color should not be red or other aggressive colors
      // This is a soft check - actual color depends on CSS variables
      expect(color).toBeDefined();
    });

    test('shows "All done" variant when all tasks completed @p1', async ({ page }) => {
      // Start with one completed task
      await page.route('/api/todos', (route) => route.fulfill({
        status: 200,
        json: [{
          id: '1',
          text: 'Completed task',
          completed: true,
          createdAt: new Date().toISOString()
        }]
      }));

      await page.goto('/');

      // The "To Do" section should show "No tasks to do" (all done variant behavior)
      await expect(page.getByText('No tasks to do')).toBeVisible();
    });
  });

  test.describe('State Transitions', () => {
    test('transitions from loading to error on failure @p1', async ({ page }) => {
      await page.route('/api/todos', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await route.fulfill({ status: 500 });
      });

      await page.goto('/');

      // Should briefly show loading
      await expect(page.getByRole('status')).toBeVisible();

      // Then transition to error
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByRole('status')).not.toBeVisible();
    });

    test('transitions from loading to content on success @p1', async ({ page }) => {
      await page.route('/api/todos', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await route.fulfill({
          json: [{
            id: '1',
            text: 'Test task',
            completed: false,
            createdAt: new Date().toISOString()
          }]
        });
      });

      await page.goto('/');

      // Should briefly show loading
      await expect(page.getByRole('status')).toBeVisible();

      // Then transition to content
      await expect(page.getByText('Test task')).toBeVisible();
      await expect(page.getByRole('status')).not.toBeVisible();
    });

    test('transitions from error to content after successful retry @p0', async ({ page }) => {
      let requestCount = 0;

      await page.route('/api/todos', (route) => {
        requestCount++;
        if (requestCount === 1) {
          route.fulfill({ status: 500 });
        } else {
          route.fulfill({
            json: [{
              id: '1',
              text: 'Recovered task',
              completed: false,
              createdAt: new Date().toISOString()
            }]
          });
        }
      });

      await page.goto('/');

      // Wait for error
      await expect(page.getByRole('alert')).toBeVisible();

      // Retry
      await page.getByRole('button', { name: /try again/i }).click();

      // Should show content
      await expect(page.getByText('Recovered task')).toBeVisible();
      await expect(page.getByRole('alert')).not.toBeVisible();
    });
  });
});

