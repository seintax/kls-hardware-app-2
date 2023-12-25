const mysql = require('mysql')
const my = require('../../../../data/connection/mysql')
const cache = require('../../../../data/connection/cache')
const query = require('../../../../data/connection/query')
const table = require('./schedule.helper')
require("../../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.schedule)
    let sql = query.builder.add(table.schedule.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        const res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.schedule)
    let sql = query.builder.set(table.schedule.name, helper.update.fields, table.schedule.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.schedule.name, table.schedule.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.schedule.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.schedule, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const uniqueRecord = async (param, callback) => {
    let sql = query.builder.get(table.schedule, table.schedule.fields.id)
    my.query(sql, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.schedule.fields
    let helper = query.searchBuilder(param.search, table.schedule)
    let sql = query.builder.src(table.schedule, helper.filters, [id?.Asc()])
    my.query(sql, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const balanceRecord = async (param, callback) => {
    let sql = table.schedule.balanceUpdate
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const startRecord = async (param, callback) => {
    let { account, status, id } = table.schedule.fields
    let options = {
        parameter: [param.id?.Exact(), "START"],
        filter: [account?.Is(), status?.Is()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.schedule, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord,
    selectRecord,
    uniqueRecord,
    searchRecord,
    balanceRecord,
    startRecord
}