const mysql = require('mysql')
const my = require('../../../../data/connection/mysql')
const cache = require('../../../../data/connection/cache')
const query = require('../../../../data/connection/query')
const table = require('./transaction.helper')
require("../../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.transaction)
    let sql = query.builder.add(table.transaction.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, { id: ans['insertId'] })
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.transaction)
    let sql = query.builder.set(table.transaction.name, helper.update.fields, table.transaction.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.transaction.name, table.transaction.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.transaction.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.transaction, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const uniqueRecord = async (param, callback) => {
    let sql = query.builder.get(table.transaction, table.transaction.fields.id)
    my.query(sql, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.transaction.fields
    let helper = query.searchBuilder(param.search, table.transaction)
    let sql = query.builder.src(table.transaction, helper.filters, [id?.Asc()])
    my.query(sql, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const shiftRecord = async (param, callback) => {
    let sql = table.transaction.shiftRecord
    my.query(sql, [param.shift], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const readyRecord = async (param, callback) => {
    let { shift, status, id } = table.transaction.fields
    let options = {
        parameter: [param.shift, param.status],
        filter: [shift?.Is(), status?.Is()],
        order: [id?.Desc()]
    }
    let sql = query.builder.rec(table.transaction, options.filter, options.order, 1)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const loggedRecord = async (param, callback) => {
    let { date, code, ordno, id } = table.transaction.fields
    let { account } = table.transaction.joined
    let options = {
        parameter: [param.datefr?.Exact(), param.dateto?.Exact(), param.account?.Exact(), param.code?.Contains(), param.code?.Contains()],
        filter: [date?.Between(), account?.Is(), query.optional([
            code?.Like(),
            ordno?.Like(),
        ])],
        order: [code?.Desc()]
    }
    let sql = query.builder.rec(table.transaction, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const codeRecord = async (param, callback) => {
    let { code, id } = table.transaction.fields
    let options = {
        parameter: [param.code?.Exact()],
        filter: [code?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.transaction, options.filter, options.order)
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
    shiftRecord,
    readyRecord,
    loggedRecord,
    codeRecord
}