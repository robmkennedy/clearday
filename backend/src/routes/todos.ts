import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { z, ZodError } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { logger } from '../middleware/logger.js';

/**
 * Validation schema for creating a todo
 *
 * NOTE: This mirrors shared/schemas/todo.ts. We inline it here because:
 * 1. The shared package needs to be built before it can be imported
 * 2. For Sprint 1, we prioritize working code over perfect DRY
 *
 * TODO: In a future sprint, set up proper workspace imports or
 * build the shared package as part of the dev workflow.
 */
const createTodoSchema = z.object({
  text: z
    .string({
      required_error: 'Text is required',
      invalid_type_error: 'Text must be a string',
    })
    .trim()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text cannot exceed 500 characters'),
});

/**
 * Validation schema for updating a todo
 * All fields are optional - only provided fields will be updated
 */
const updateTodoSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text cannot exceed 500 characters')
    .optional(),
  completed: z.boolean().optional(),
});

/**
 * Validation schema for todo ID parameter
 */
const todoIdSchema = z.object({
  id: z.string().uuid('Invalid todo ID'),
});

const router = Router();

/**
 * GET /api/todos
 *
 * Returns all todos sorted by createdAt descending (newest first)
 */
router.get('/', async (_req, res) => {
  try {
    const todos = await db
      .select()
      .from(schema.todos)
      .orderBy(desc(schema.todos.createdAt));

    res.json(todos);
  } catch (error) {
    logger.error({ error }, 'Error fetching todos');
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch todos',
      },
    });
  }
});

/**
 * POST /api/todos
 *
 * Creates a new todo
 * Body: { text: string }
 * Returns: 201 with created todo
 */
router.post('/', async (req, res) => {
  try {
    // Validate input
    const validated = createTodoSchema.parse(req.body);

    // Generate UUID and timestamp
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Insert into database
    const newTodo = {
      id,
      text: validated.text,
      completed: false,
      createdAt,
    };

    await db.insert(schema.todos).values(newTodo);

    res.status(201).json(newTodo);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.flatten().fieldErrors,
        },
      });
      return;
    }

    logger.error({ error }, 'Error creating todo');
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create todo',
      },
    });
  }
});

/**
 * PATCH /api/todos/:id
 *
 * Updates an existing todo (partial update)
 * Body: { text?: string, completed?: boolean }
 * Returns: 200 with updated todo, 404 if not found
 */
router.patch('/:id', async (req, res) => {
  try {
    // Validate path parameter
    const { id } = todoIdSchema.parse(req.params);

    // Validate request body
    const updates = updateTodoSchema.parse(req.body);

    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      // No updates provided - fetch and return current todo
      const [existingTodo] = await db
        .select()
        .from(schema.todos)
        .where(eq(schema.todos.id, id));

      if (!existingTodo) {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Todo not found',
          },
        });
        return;
      }

      res.json(existingTodo);
      return;
    }

    // Update and return in single operation using returning()
    const [updatedTodo] = await db
      .update(schema.todos)
      .set(updates)
      .where(eq(schema.todos.id, id))
      .returning();

    // If no rows returned, todo doesn't exist
    if (!updatedTodo) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Todo not found',
        },
      });
      return;
    }


    res.json(updatedTodo);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.flatten().fieldErrors,
        },
      });
      return;
    }

    logger.error({ error }, 'Error updating todo');
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update todo',
      },
    });
  }
});

/**
 * DELETE /api/todos/:id
 *
 * Deletes an existing todo
 * Returns: 204 No Content on success, 404 if not found
 */
router.delete('/:id', async (req, res) => {
  try {
    // Validate path parameter
    const { id } = todoIdSchema.parse(req.params);

    // Delete and check if anything was deleted using returning()
    const [deletedTodo] = await db
      .delete(schema.todos)
      .where(eq(schema.todos.id, id))
      .returning();

    // If no rows returned, todo doesn't exist
    if (!deletedTodo) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Todo not found',
        },
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.flatten().fieldErrors,
        },
      });
      return;
    }

    logger.error({ error }, 'Error deleting todo');
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete todo',
      },
    });
  }
});

export { router as todosRouter };

