import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  redact: {
    paths: [
      'password',
      'token',
      'req.headers.authorization',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },

  transport: isDevelopment
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

export default logger;