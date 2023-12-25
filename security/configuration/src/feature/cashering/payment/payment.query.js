const mysql = require('mysql')
const my = require('../../../../data/connection/mysql')
const cache = require('../../../../data/connection/cache')
const query = require('../../../../data/connection/query')
const table = require('./payment.helper')
require("../../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.payment)
    let sql = query.builder.add(table.payment.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        const res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.payment)
    let sql = query.builder.set(table.payment.name, helper.update.fields, table.payment.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.payment.name, table.payment.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.payment.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.payment, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const uniqueRecord = async (param, callback) => {
    let sql = query.builder.get(table.payment, table.payment.fields.id)
    my.query(sql, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.payment.fields
    let helper = query.searchBuilder(param.search, table.payment)
    let sql = query.builder.src(table.payment, helper.filters, [id?.Asc()])
    my.query(sql, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const batchRecord = async (param, callback) => {
    let batch = await Promise.all(param?.payments?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let helper = query.createBuilder(item, table.payment)
            let sql = query.builder.add(table.payment.name, helper.create.fields, helper.create.values)
            my.query(sql, helper.parameters, async (err, ans) => {
                if (err) return reject(err)
                resolve({ item: item.item, response: ans })
            })
        })
        return retrieve
    }))
    return callback(null, batch)
}

const transactionRecord = async (param, callback) => {
    let { code, id } = table.payment.fields
    let options = {
        parameter: [param.code?.Contains()],
        filter: [code?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.payment, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const returnRecord = async (param, callback) => {
    let batch = await Promise.all(param?.payments?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let helper = query.updateBuilder(item, table.payment)
            let sql = query.builder.set(table.payment.name, helper.update.fields, table.payment.fields.id)
            // resolve({ sql: sql, })
            my.query(sql, helper.parameters, async (err, ans) => {
                if (err) return reject(err)
                resolve({ item: item.item, response: ans })
            })
        })
        return retrieve
    }))
    return callback(null, batch)
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord,
    selectRecord,
    uniqueRecord,
    searchRecord,
    batchRecord,
    transactionRecord,
    returnRecord,
}