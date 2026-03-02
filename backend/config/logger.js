const morgan = require('morgan');

/**
 * Request logger middleware using Morgan.
 * Uses 'dev' format in development, 'combined' (Apache-style) in production.
 */
const logger = process.env.NODE_ENV === 'production'
  ? morgan('combined')
  : morgan('dev');

module.exports = logger;
