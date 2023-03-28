import winston from "winston";
import fs from "fs";

// 创建日志目录（如果不存在）
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 创建一个新的 logger 实例
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "my-app" },
  transports: [
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: "error",
    }),
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
  ],
});

export default logger;
