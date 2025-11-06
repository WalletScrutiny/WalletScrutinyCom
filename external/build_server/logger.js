import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { isDebugEnv } from './utils.mjs';

const { createLogger, format, transports } = winston;

function makeFileTransport(filenameBase) {
  return new DailyRotateFile({
    filename: isDebugEnv() ? `logs/${filenameBase}-%DATE%.log` : `/var/log/build-server/${filenameBase}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',       // rotate every day
    zippedArchive: true,             // compress with .gz
    maxSize: '10m',                  // rotate if exceeds 20MB before the day
    maxFiles: '10d',                 // keep 14 days
  });
}

function makeLogger(serviceName, level = 'info') {
  return createLogger({
    level,
    defaultMeta: { service: serviceName },
    format: format.combine(
        format.timestamp(),
        format.printf(i => `${i.timestamp} [${i.level}]: ${i.message}${i.stack ? '\n'+i.stack : ''}`)
    ),
    transports: [
      makeFileTransport(serviceName),    // a rotated+compressed file
      new transports.Console({           // optional: console in dev
        format: format.combine(
          format.colorize(),
          format.printf(i => `[${i.level}] ${i.message}${i.stack ? '\n'+i.stack : ''}`)
        )
      })
    ]
  });
}

export const appLog = makeLogger('app');
export const verificationsLog = makeLogger('verifications');