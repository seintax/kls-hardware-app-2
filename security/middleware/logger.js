const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvent = async (message, logFn) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', logFn), logItem)
    } catch (err) {
        console.error(err)
    }
}

const logger = (req, res, next) => {
    if (req.headers.origin && !req.headers.origin?.includes("localhost")) {
        logEvent(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    }
    next()
}

module.exports = {
    logEvent,
    logger
}