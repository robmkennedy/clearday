import { test, expect, createTodoViaApi } from '../fixtures/base';

test.describe('Critical Path: Delete a Task', () => {
  test.beforeEach(async ({ page, network }) => {
    const todosLoadPromise = network.waitForTodosLoad(page);
    await page.goto('/');
    await todosLoadPromise;
  });

  test('user can delete a task @p0 @critical', async ({ page, network, api }) => {
    // Given: A task exists
    const todo = await createTodoViaApi(api, 'Task to delete');

    // Reload to see the seeded task
    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    await expect(page.getByText('Task to delete')).toBeVisible();

    // When: User clicks the delete button
    const deletePromise = network.waitForTodoDelete(page);
    await page.getByRole('button', { name: `Delete "${todo.text}"` }).click();
    await deletePromise;

    // Then: Task is removed from the list
    await expect(page.getByText('Task to delete')).not.toBeVisible();
  });

  test('deleting last task shows empty state @p0', async ({ page, network, api }) => {
    // Given: A single task exists
    await createTodoViaApi(api, 'Only task');

    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    await expect(page.getByText('Only task')).toBeVisible();

    // When: User deletes the only task
    const deletePromise = network.waitForTodoDelete(page);
    await page.getByRole('button', { name: /delete "Only task"/i }).click();
    await deletePromise;

    // Then: Empty state is shown
    await expect(page.getByText(/no tasks/i)).toBeVisible();
  });

  test('can delete one of many tasks @p1', async ({ page, network, api }) => {
    // Given: Multiple tasks exist
    await createTodoViaApi(api, 'Keep this task');
    const toDelete = await createTodoViaApi(api, 'Delete this task');
    await createTodoViaApi(api, 'Also keep this');

    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    // When: User deletes the middle task
    const deletePromise = network.waitForTodoDelete(page);
    await page.getByRole('button', { name: `Delete "${toDelete.text}"` }).click();
    await deletePromise;

    // Then: Only the deleted task is removed
    await expect(page.getByText('Delete this task')).not.toBeVisible();
    await expect(page.getByText('Keep this task')).toBeVisible();
    await expect(page.getByText('Also keep this')).toBeVisible();
  });

  test('can delete a completed task @p1', async ({ page, network, api }) => {
    // Given: A completed task exists
    const todo = await createTodoViaApi(api, 'Completed task');
    await api.patch(`/api/todos/${todo.id}`, { data: { completed: true } });

    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    await expect(page.getByText('Completed task')).toBeVisible();

    // When: User deletes the completed task
    const deletePromise = network.waitForTodoDelete(page);
    await page.getByRole('button', { name: /delete "Completed task"/i }).click();
    await deletePromise;

    // Then: Task is removed
    await expect(page.getByText('Completed task')).not.toBeVisible();
  });
});

