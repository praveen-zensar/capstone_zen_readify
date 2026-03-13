import morgan from 'morgan';

/**
 * Request logger middleware using Morgan.
 * Uses 'dev' format in development, 'combined' (Apache-style) in production.
 */
const requestLogger = process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev');

const LOG_LEVEL_ORDER = {
	error: 0,
	warn: 1,
	info: 2,
};

const configuredLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
const activeLevel = Object.hasOwn(LOG_LEVEL_ORDER, configuredLevel)
	? configuredLevel
	: 'info';

const shouldWriteLog = (level) => {
	const normalized = level.toLowerCase();
	return LOG_LEVEL_ORDER[normalized] <= LOG_LEVEL_ORDER[activeLevel];
};

const safeStringify = (meta) => {
	if (meta === undefined) return '';
	if (typeof meta === 'string') return meta;

	try {
		return JSON.stringify(meta);
	} catch (err) {
		return `[unserializable-meta:${err.message}]`;
	}
};

const writeLog = (level, scope, message, meta) => {
	if (!shouldWriteLog(level)) return;

	const timestamp = new Date().toISOString();
	const payload = safeStringify(meta);
	const line = payload
		? `[${timestamp}] [${level}] [${scope}] ${message} ${payload}`
		: `[${timestamp}] [${level}] [${scope}] ${message}`;

	if (level === 'ERROR') {
		console.error(line);
		return;
	}

	if (level === 'WARN') {
		console.warn(line);
		return;
	}

	console.log(line);
};

const createServiceLogger = (scope = 'backend') => ({
	info: (message, meta) => writeLog('INFO', scope, message, meta),
	warn: (message, meta) => writeLog('WARN', scope, message, meta),
	error: (message, meta) => writeLog('ERROR', scope, message, meta),
});

export { requestLogger, createServiceLogger, activeLevel };
export default requestLogger;
