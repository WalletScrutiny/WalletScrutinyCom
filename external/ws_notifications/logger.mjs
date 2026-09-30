import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;

const isTestEnv = process.env.WS_NOTIFICATIONS_TEST === '1';

function getLogDir() {
  return process.env.WS_NOTIFICATIONS_LOG_DIR ?? 'logs';
}

function makeFileTransport(filenameBase) {
  const logDir = getLogDir();
  return new DailyRotateFile({
    filename: `${logDir}/${filenameBase}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '10d',
  });
}

function makeLogger(serviceName, level = 'debug') {
  const loggerTransports = [];
  if (!isTestEnv) {
    loggerTransports.push(makeFileTransport(serviceName));
  }
  loggerTransports.push(new transports.Console({
    format: format.printf(i => `[${i.level}] ${i.message}${i.stack ? '\n' + i.stack : ''}`)
  }));

  return createLogger({
    level,
    silent: isTestEnv,
    defaultMeta: { service: serviceName },
    format: format.combine(
      format.timestamp(),
      format.printf(i => `${i.timestamp} [${i.level}]: ${i.message}${i.stack ? '\n' + i.stack : ''}`)
    ),
    transports: loggerTransports
  });
}

export const appLog = makeLogger('app');
