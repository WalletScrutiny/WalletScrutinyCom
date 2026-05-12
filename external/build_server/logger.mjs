import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { isDebugEnv } from './config/env.mjs';

const { createLogger, format, transports } = winston;

function makeFileTransport(filenameBase) {
  return new DailyRotateFile({
    filename: isDebugEnv() ? `logs/${filenameBase}-%DATE%.log` : `/var/log/build-server/${filenameBase}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',       // rotate every day
    zippedArchive: true,             // compress with .gz
    maxSize: '10m',                  // rotate if exceeds MB before the day
    maxFiles: '10d',                 // days to keep logs
  });
}

function makeLogger(serviceName, level = 'debug') {
  return createLogger({
    level,
    defaultMeta: { service: serviceName },
    format: format.combine(
        format.timestamp(),
        format.printf(i => `${i.timestamp} [${i.level}]: ${i.message}${i.stack ? '\n'+i.stack : ''}`)
    ),
    transports: [
      makeFileTransport(serviceName),
      new transports.Console({
        format: format.printf(i => `[${i.level}] ${i.message}${i.stack ? '\n'+i.stack : ''}`)
      })
    ]
  });
}

export const appLog = makeLogger('app');
export const verificationsLog = makeLogger('verifications');
