const { logEvent } = require('./logger')

const handler = (err, req, res, next) => {
    logEvent(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    const status = res.statusCode ? res.statusCode : 500
    res.status(status)
    res.json({ message: err.message })
}

module.exports = handler