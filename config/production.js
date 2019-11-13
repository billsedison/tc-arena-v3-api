/**
 * The configuration file.
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  POSTGRES_SSL: process.env.POSTGRES_SSL || 'true',
  POSTGRES_URL: process.env.POSTGRES_URL || process.env.DATABASE_URL
}
