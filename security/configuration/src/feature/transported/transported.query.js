const mysql = require('mysql')
const my = require('../../../data/connection/mysql')
const cache = require('../../../data/connection/cache')
const query = require('../../../data/connection/query')
const table = require('./transported.helper')
require("../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.transported)
    let sql = query.builder.add(table.transported.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        const res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.transported)
    let sql = query.builder.set(table.transported.name, helper.update.fields, table.transported.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.transported.name, table.transported.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.transported.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.transported, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const uniqueRecord = async (param, callback) => {
    let sql = query.builder.get(table.transported, table.transported.fields.id)
    my.query(sql, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.transported.fields
    let helper = query.searchBuilder(param.search, table.transported)
    let sql = query.builder.src(table.transported, helper.filters, [id?.Asc()])
    my.query(sql, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const inventoryRecord = async (param, callback) => {
    let { reference } = table.transported.fields
    let { name } = table.transported.joined
    let options = {
        parameter: [param.id],
        filter: [reference?.Is()],
        order: [name?.Asc()]
    }
    let sql = query.builder.rec(table.transported, options.filter, options.order)
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
    inventoryRecord
}