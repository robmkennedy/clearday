import { app } from './app.js';
import { logger } from './middleware/logger.js';

const PORT = process.env.PORT || 3000;

// Start server (only when running directly, not when imported for tests)
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

