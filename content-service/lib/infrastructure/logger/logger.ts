import winston from "winston";

// Define log levels and formats
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: "info", // Default log level (can be changed to "debug" for more detailed logs)
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // File transport (optional, for production logging)
    new winston.transports.File({
      filename: "logs/app.log", // Log file location
      level: "info", // Log level for file transport
    }),
  ],
});

export { logger };
