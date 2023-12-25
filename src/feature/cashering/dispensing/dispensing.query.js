const mysql = require('mysql')
const my = require('../../../../data/connection/mysql')
const cache = require('../../../../data/connection/cache')
const query = require('../../../../data/connection/query')
const table = require('./dispensing.helper')
require("../../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.dispensing)
    let sql = query.builder.add(table.dispensing.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        const res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.dispensing)
    let sql = query.builder.set(table.dispensing.name, helper.update.fields, table.dispensing.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.dispensing.name, table.dispensing.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.dispensing.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    // let sql = query.builder.rec(table.dispensing, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.dispensing, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const uniqueRecord = async (param, callback) => {
    // let sql = query.builder.get(table.dispensing, table.dispensing.fields.id)
    // my.query(sql, [param.id], (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.get(table.dispensing, table.dispensing.fields.id)
    my.query(sql.query, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.dispensing.fields
    let helper = query.searchBuilder(param.search, table.dispensing)
    // let sql = query.builder.src(table.dispensing, helper.filters, [id?.Asc()])
    // my.query(sql, helper.parameters, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.src(table.dispensing, helper.filters, [id?.Asc()])
    my.query(sql.query, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const batchRecord = async (param, callback) => {
    let batch = await Promise.all(param?.cart?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let helper = query.createBuilder(item, table.dispensing)
            let sql = query.builder.add(table.dispensing.name, helper.create.fields, helper.create.values)
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
    let { code, id } = table.dispensing.fields
    let options = {
        parameter: [param.code?.Exact()],
        filter: [code?.Is()],
        order: [id?.Asc()]
    }
    // let sql = query.builder.rec(table.dispensing, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.dispensing, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const requestRecord = async (param, callback) => {
    let batch = await Promise.all(param?.cart?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let helper = query.updateBuilder(item, table.dispensing)
            let sql = query.builder.set(table.dispensing.name, helper.update.fields, table.dispensing.fields.id)
            my.query(sql, helper.parameters, async (err, ans) => {
                if (err) return reject(err)
                resolve({ item: item.item, response: ans })
            })
        })
        return retrieve
    }))
    return callback(null, batch)
}

const inventoryRecord = async (param, callback) => {
    let { item, conv, dispense, id } = table.dispensing.fields
    let options = {
        parameter: [param.item?.Exact(), "0", "0"],
        filter: [item?.Is(), conv?.Is(), dispense?.Greater()],
        order: [id?.Asc()]
    }
    // let sql = query.builder.rec(table.dispensing, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.dispensing, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const migrateRecord = async (param, callback) => {
    let batch = await Promise.all(param.data?.map(async item => {
        let response = await new Promise(async (resolve, reject) => {
            let helper = query.migrateBuilder(item, table.dispensing)
            let sql = query.builder.add(table.dispensing.name, helper.create.fields, helper.create.values)
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
    requestRecord,
    inventoryRecord,
    migrateRecord
}