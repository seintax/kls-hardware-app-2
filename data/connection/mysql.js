const mysql = require('mysql')

const cloudcredentials = {
    host: "151.106.124.151",
    user: "u480442611_jbs_root",
    password: "@JBSh@rdw@re2023",
    database: "u480442611_jbs_app_2",
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0
}

const localcredentials = {
    host: "localhost",
    user: "root",
    password: "",
    database: "web_jbs_hpos",
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0
}

var server = process.env.NODE_ENV === "development" ? "127.0.0.1" : "cloudserver"
var database = process.env.NODE_ENV === "development" ? "mysql.local" : "jbs_bd.mysql"

const credentials = process.env.NODE_ENV === "development" ? localcredentials : cloudcredentials
var my = mysql.createPool(credentials)

my.getConnection((err, con) => {
    if (err) {
        console.log(`\x1b[41m`, `ERROR`, '\x1b[0m', `Failed to load server @ ${server}/${database}`)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'PROTOCOL_CONNECTION_LOST: Database connection was closed.\n')
        }
        else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'ER_CON_COUNT_ERROR: Database has too many connections.\n')
        }
        else if (err.code === 'ECONNREFUSED') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'ECONNREFUSED: Database connection was refused.\n')
        }
        else {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', `${err.code}\n`)
        }
    }
    else {
        console.log(`\x1b[45m`, `MYSQL`, '\x1b[0m', `@ ${server}/${database}\n`)
    }
    if (con) con.release()
    return
})

module.exports = my
