import { test, expect, createTodoViaApi } from '../fixtures/base';

test.describe('Critical Path: Toggle Task Completion', () => {
  test.beforeEach(async ({ page, network }) => {
    const todosLoadPromise = network.waitForTodosLoad(page);
    await page.goto('/');
    await todosLoadPromise;
  });

  test('user can mark a task as complete @p0 @critical', async ({ page, network, api }) => {
    // Given: An active task exists
    await createTodoViaApi(api, 'Task to complete');

    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    // When: User clicks the checkbox
    const updatePromise = network.waitForTodoUpdate(page);
    await page.getByRole('checkbox', { name: /mark "Task to complete" as complete/i }).click();
    await updatePromise;

    // Then: Checkbox is checked and task moves to completed section
    await expect(
      page.getByRole('checkbox', { name: /mark "Task to complete" as incomplete/i })
    ).toBeChecked();
  });

  test('user can mark a completed task as incomplete @p0 @critical', async ({ page, network, api }) => {
    // Given: A completed task exists
    const todo = await createTodoViaApi(api, 'Completed task');
    await api.patch(`/api/todos/${todo.id}`, { data: { completed: true } });

    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    // When: User unchecks the completed task
    const updatePromise = network.waitForTodoUpdate(page);
    await page.getByRole('checkbox', { name: /mark "Completed task" as incomplete/i }).click();
    await updatePromise;

    // Then: Checkbox is unchecked and task moves back to active section
    await expect(
      page.getByRole('checkbox', { name: /mark "Completed task" as complete/i })
    ).not.toBeChecked();
  });

  test('toggle persists after page refresh @p0', async ({ page, network, api }) => {
    // Given: An active task exists
    await createTodoViaApi(api, 'Persistent toggle');

    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    // When: User completes the task
    const updatePromise = network.waitForTodoUpdate(page);
    await page.getByRole('checkbox', { name: /mark "Persistent toggle" as complete/i }).click();
    await updatePromise;

    // And: Reloads the page
    const reloadPromise2 = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise2;

    // Then: Task is still completed
    await expect(
      page.getByRole('checkbox', { name: /mark "Persistent toggle" as incomplete/i })
    ).toBeChecked();
  });

  test('can toggle multiple tasks independently @p1', async ({ page, network, api }) => {
    // Given: Multiple tasks exist
    await createTodoViaApi(api, 'First task');
    await createTodoViaApi(api, 'Second task');
    await createTodoViaApi(api, 'Third task');

    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    // When: User completes only the second task
    const updatePromise = network.waitForTodoUpdate(page);
    await page.getByRole('checkbox', { name: /mark "Second task" as complete/i }).click();
    await updatePromise;

    // Then: Only the second task is completed
    await expect(
      page.getByRole('checkbox', { name: /mark "First task" as complete/i })
    ).not.toBeChecked();
    await expect(
      page.getByRole('checkbox', { name: /mark "Second task" as incomplete/i })
    ).toBeChecked();
    await expect(
      page.getByRole('checkbox', { name: /mark "Third task" as complete/i })
    ).not.toBeChecked();
  });
});


