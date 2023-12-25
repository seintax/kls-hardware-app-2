const mysql = require('mysql')
const my = require('../../../data/connection/mysql')
const cache = require('../../../data/connection/cache')
const query = require('../../../data/connection/query')
const table = require('./masterlist.helper')
require("../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.masterlist)
    let sql = query.builder.add(table.masterlist.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        const res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.masterlist)
    let sql = query.builder.set(table.masterlist.name, helper.update.fields, table.masterlist.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.masterlist.name, table.masterlist.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, details } = table.masterlist.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [name?.Asc(), details?.Asc()]
    }
    // let sql = query.builder.rec(table.masterlist, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.masterlist, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const uniqueRecord = async (param, callback) => {
    // let sql = query.builder.get(table.masterlist, table.masterlist.fields.id)
    // my.query(sql, [param.id], (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.get(table.masterlist, table.masterlist.fields.id)
    my.query(sql.query, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const searchRecord = async (param, callback) => {
    let { name } = table.masterlist.fields
    let helper = query.searchBuilder(param.search, table.masterlist)
    // let sql = query.builder.src(table.masterlist, helper.filters, [name?.Asc()])
    // my.query(sql, helper.parameters, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.src(table.masterlist, helper.filters, [name?.Asc()])
    my.query(sql.query, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord,
    selectRecord,
    uniqueRecord,
    searchRecord
}