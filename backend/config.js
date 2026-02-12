const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const parseBooleanEnv = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};
const browseOnlyMode = parseBooleanEnv(process.env.BROWSE_ONLY_MODE, true);

const jwtSecret = process.env.jwtSecret || '';
const fallbackJwtSecret = browseOnlyMode
  ? 'browse-only-secret-change-me'
  : (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me' : '');

if (!jwtSecret && fallbackJwtSecret) {
  console.warn('[backend/config] jwtSecret missing; using fallback secret.');
}

module.exports = {
  baseUrl,
  jwtSecret: jwtSecret || fallbackJwtSecret,
  sendGridApiKey: process.env.SENDGRID_API_KEY || '',
  browseOnlyMode,
  mongooseUri:
    process.env.MONGOOSE_URI ||
    `mongodb://localhost:27017/${process.env.DATABASE_NAME ? process.env.DATABASE_NAME : 'effectindex'}`,
};
