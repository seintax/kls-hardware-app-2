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
    // let sql = query.builder.rec(table.payment, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.payment, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const uniqueRecord = async (param, callback) => {
    // let sql = query.builder.get(table.payment, table.payment.fields.id)
    // my.query(sql, [param.id], (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.get(table.payment, table.payment.fields.id)
    my.query(sql.query, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.payment.fields
    let helper = query.searchBuilder(param.search, table.payment)
    // let sql = query.builder.src(table.payment, helper.filters, [id?.Asc()])
    // my.query(sql, helper.parameters, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.src(table.payment, helper.filters, [id?.Asc()])
    my.query(sql.query, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
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
        parameter: [param.code?.Exact()],
        filter: [code?.Is()],
        order: [id?.Asc()]
    }
    // let sql = query.builder.rec(table.payment, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.payment, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
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

const chequeRecord = async (param, callback) => {
    let { method, refdate } = table.payment.fields
    let options = {
        parameter: [],
        filter: [method?.Is("CHEQUE")],
        order: [refdate?.Desc()]
    }
    let sql = query.optimize.rec(table.payment, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const migrateRecord = async (param, callback) => {
    let batch = await Promise.all(param.data?.map(async item => {
        let response = await new Promise(async (resolve, reject) => {
            let helper = query.migrateBuilder(item, table.payment)
            let sql = query.builder.add(table.payment.name, helper.create.fields, helper.create.values)
            // return resolve({ sql, param: helper.parameters })
            await my.query(sql, helper.parameters, async (err, ans) => {
                if (err) return resolve({ error: err })
                return resolve({ id: ans['insertId'] })
            })
        })
        return response
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
    chequeRecord,
    migrateRecord
}