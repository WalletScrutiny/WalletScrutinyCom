import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { isDebugEnv } from './config/argv.mjs';

const { createLogger, format, transports } = winston;

// Skip the on-disk transport when running under the test runner so that
// importing this module doesn't try to mkdir /var/log/build-server (which
// fails outside production), and to keep test output noise-free.
const isTestEnv = process.env.BUILD_SERVER_TEST === '1';

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
  const loggerTransports = [];
  if (!isTestEnv) {
    loggerTransports.push(makeFileTransport(serviceName));
  }
  loggerTransports.push(new transports.Console({
    format: format.printf(i => `[${i.level}] ${i.message}${i.stack ? '\n'+i.stack : ''}`)
  }));

  return createLogger({
    level,
    silent: isTestEnv,
    defaultMeta: { service: serviceName },
    format: format.combine(
        format.timestamp(),
        format.printf(i => `${i.timestamp} [${i.level}]: ${i.message}${i.stack ? '\n'+i.stack : ''}`)
    ),
    transports: loggerTransports
  });
}

export const appLog = makeLogger('app');
export const verificationsLog = makeLogger('verifications');
