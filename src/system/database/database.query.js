const mysql = require('mysql')
const my = require('../../../data/connection/mysql')
const query = require('../../../data/connection/query')
require("../../utilities/query.prototypes")

const getData = async (param, callback) => {
    const sql = `
        SELECT * 
        FROM ${param.tb} 
        WHERE ${param.tag}_id > ${param.max}
    `
    my.query(sql, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

module.exports = {
    getData
}