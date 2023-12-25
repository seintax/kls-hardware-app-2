const mysql = require('mysql')
const my = require('../../../data/connection/mysql')
const cache = require('../../../data/connection/cache')
const query = require('../../../data/connection/query')
const table = require('./reports.helper')
require("../../utilities/query.prototypes")

const dailySales = async (param, callback) => {
    let sql = table.reports.dailySales.replaceAll("@fr", param.fr).replaceAll("@to", param.to)
    my.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const dailySummary = async (param, callback) => {
    let sql = table.reports.dailySummary.replaceAll("@fr", param.fr).replaceAll("@to", param.to)
    my.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

module.exports = {
    dailySales,
    dailySummary
}