const winston = require('winston');

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }),
  winston.format.printf(({ level, message, service, timestamp }) => {
    return `[${level}] [${timestamp}] [${service}] ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }),
  winston.format.printf(({ level, message, service, timestamp }) => {
    return `[${level}] [${timestamp}] [${service}] ${message}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'Galaxy Guard' },
  transports: [
    new winston.transports.Console({ format: consoleFormat }), // Log to console with colors
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info', format: fileFormat }),
    new winston.transports.File({ filename: 'logs/combined.log', format: fileFormat }),
  ],
});

module.exports = logger;