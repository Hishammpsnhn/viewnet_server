import winston from "winston";
import LokiTransport from "winston-loki";

// Define log levels and formats
// const logFormat = winston.format.combine(
//   winston.format.timestamp(),
//   winston.format.printf(({ timestamp, level, message }) => {
//     return `${timestamp} [${level}]: ${message}`;
//   })
// );

// Create the logger instance
const logger = winston.createLogger({
   //level: "info", 
  // format: logFormat,
  transports: [
    // new winston.transports.Console(),
      new LokiTransport({
        host: "http://loki:3100",
        labels: { app: "my-app", env: "development" },
        // json: true,
        // batching: true,
      })
  ],
});

export { logger };
