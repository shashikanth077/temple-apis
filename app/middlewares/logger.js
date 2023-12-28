const { createLogger, format, transports } = require("winston");

const { combine, label, timestamp, printf } = format;
// Make sure this exists
const LOG_FILE_PATH = 'logs/error.log';

const errorLogs = new transports.File({ filename: LOG_FILE_PATH, level: 'error'});
const infoLogs = new transports.File({ filename: LOG_FILE_PATH, level: 'info'});
const console = new transports.Console();

const logFormat = printf(
  ({ level, message, label: logLabel, timestamp: logTimestamp }) => {
    return `${logTimestamp} [${logLabel}] ${level}: ${message}`;
  },
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    label({ label: process.env.NODE_ENV }),
    timestamp(),
    logFormat,
  ),
  transports: [errorLogs, infoLogs],
});

if (process.env.NODE_ENV === 'production') {
  logger.remove(file);
  logger.remove(infoFile);
  logger.add(console);
}

module.exports = logger;
