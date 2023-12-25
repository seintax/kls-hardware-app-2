const validorigins = require('./origins')

const corsoptions = {
    origin: (origin, callback) => {
        if (validorigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS.'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsoptions