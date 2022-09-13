import logsModel from '../models/logs.model'
import { LOG_LEVEL } from '../shared/constants'

const log = ({ userId, level = LOG_LEVEL.INFO, action, data, stacktrace }) =>
  logsModel.insert({
    userId,
    level,
    action,
    data: JSON.stringify(data),
    stacktrace
  })

const logInfo = ({ userId, action, data, stacktrace }) =>
  log({
    userId,
    level: LOG_LEVEL.INFO,
    action,
    data,
    stacktrace
  })

const logWarning = ({ userId, action, data, stacktrace }) =>
  log({
    userId,
    level: LOG_LEVEL.WARNING,
    action,
    data,
    stacktrace
  })

const logError = ({ userId, action, data, stacktrace }) =>
  log({
    userId,
    level: LOG_LEVEL.ERROR,
    action,
    data,
    stacktrace
  })

export { logInfo, logWarning, logError }
