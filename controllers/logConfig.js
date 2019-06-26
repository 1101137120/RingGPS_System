var log4js = require('log4js');
const fs = require('fs');

levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};

function judgePath(pathStr) {
    if (!fs.existsSync(pathStr)) {
        fs.mkdirSync(pathStr);
        console.log('createPath: ' + pathStr);
    }
}

log4js.configure({
  appenders: {
    access: { type: 'dateFile', filename: 'logs/access.log', pattern: '-yyyy-MM-dd' },
    app: { type: 'file', filename: 'logs/rings.log', maxLogSize:1000000, numBackups: 10},
    errorFile: { type: 'file', filename: 'logs/errors.log' },
    errors: { type: 'logLevelFilter', level: 'error', appender: 'errorFile' }
  },
  categories: {
    default: { appenders: ['app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'info' }
  }
});

exports.logger = function (name, level) {
    var logger = log4js.getLogger(name);
    //默认为debug权限及以上
    logger.level = levels[level];
    return logger;
};

exports.use = function (app, level) {
  //加载中间件
    app.use(log4js.connectLogger(log4js.getLogger('logInfo'), {
        level: levels[level] || levels['debug'],
      //格式化http相关信息
        format: ':method :url :status'
    }));
};
