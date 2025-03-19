var os = require("os")
var dotenv = require("dotenv").config()
var dotenvExpand = require("dotenv-expand")
dotenvExpand.expand(dotenv)

const cors = require("cors")
const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const handler = require('./security/middleware/errors')
const { logger } = require('./security/middleware/logger')
const corsoptions = require('./security/configuration/options')
const port = process.env.API_PORT || 5200

const app = express()

app.use(logger)

app.use(cors(corsoptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.use(bodyParser.urlencoded({ extended: true }))

// CUSTOM
const custom = require('./src/control/custom.controller')
app.use('/custom', custom.transaction)
app.use('/custom', custom.dispensing)
app.use('/custom', custom.payment)
app.use('/custom', custom.customer)
app.use('/custom', custom.credits)
app.use('/custom', custom.schedule)
app.use('/custom', custom.request)
app.use('/custom', custom.returned)
app.use('/custom', custom.reimburse)
app.use('/custom', custom.remittance)
app.use('/custom', custom.collection)
// FEATURE
const feature = require('./src/control/feature.controller')
app.use('/feature', feature.supplier)
app.use('/feature', feature.masterlist)
app.use('/feature', feature.inventory)
app.use('/feature', feature.conversion)
app.use('/feature', feature.delivery)
app.use('/feature', feature.transfer)
app.use('/feature', feature.transported)
app.use('/feature', feature.prices)
app.use('/feature', feature.adjustment)
// LIBRARY
const library = require('./src/control/library.controller')
app.use('/library', library.category)
app.use('/library', library.discount)
app.use('/library', library.measurement)
// SYSTEM
const system = require('./src/control/system.controller')
app.use('/system', system.reports)
app.use('/system', system.account)
app.use('/system', system.database)
const testing = require('./src/control/testing.controller')
app.use('/testing', testing)
// const migration = require('./src/control/migrate.controller')
// app.use('/migration', migration)

app.all('*', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'pages', 'error.html'))
    } else if (req.accepts('json')) {
        res.json({
            success: false,
            message: 'Resource does not exist.'
        })
    } else {
        res.type('txt').send('404 Error: Resource does not exist.')
    }
})

app.use(handler)

app.listen(port, () => {
    let wifi = os.networkInterfaces()['Wi-Fi']
    let ether = os.networkInterfaces()['Ethernet']
    let ip = "localhost"
    if (wifi !== undefined) {
        ip = wifi[1].address
    }
    if (ether !== undefined) {
        ip = ether[1].address
    }
    if (wifi === undefined && ether === undefined) {
        console.log('Serving via localhost...\n')
        console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', `No ethernet or wifi network.`)
    }
    else {
        console.log(`Serving at ${ip} on port ${port}`)
        console.log(`Started on ${new Date()}.\n`)
    }
})