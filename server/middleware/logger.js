const winston = require('winston')
const expressWinston = require('express-winston')
require('winston-mongodb')

const requestLog = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.json({
                space: 2
            })
        }),
        new winston.transports.MongoDB({
            db: process.env.MONGODB_URI, //Your Db connection
            options: {
                useNewUrlParser: true,
                poolSize: 2,
                autoReconnect: true
            },
            collection: 'logs'
        })
    ],
    meta: true,
    msg: "Request: HTTP {{req.method}} {{req.url}}; Username: {{req.userId}}; ipAddress {{req.headers['x-forwarded-for'] || req.connection.remoteAddress}}",
    requestWhitelist: [
        "url",
        "method",
        "httpVersion",
        "originalUrl",
        "query",
        "body"
    ]
});

exports.requestLog = requestLog;