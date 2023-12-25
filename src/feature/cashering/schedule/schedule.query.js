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
    // let sql = query.builder.rec(table.schedule, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.schedule, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const uniqueRecord = async (param, callback) => {
    // let sql = query.builder.get(table.schedule, table.schedule.fields.id)
    // my.query(sql, [param.id], (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.get(table.schedule, table.schedule.fields.id)
    my.query(sql.query, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.schedule.fields
    let helper = query.searchBuilder(param.search, table.schedule)
    // let sql = query.builder.src(table.schedule, helper.filters, [id?.Asc()])
    // my.query(sql, helper.parameters, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.src(table.schedule, helper.filters, [id?.Asc()])
    my.query(sql.query, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
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
    let { account, status, begshift, id } = table.schedule.fields
    let options = {
        parameter: [param.id?.Exact(), "START", param.date],
        filter: [account?.Is(), status?.Is(), begshift?.DateFormat()?.Is()],
        order: [id?.Asc()]
    }
    // let sql = query.builder.rec(table.schedule, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.schedule, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const accountRecord = async (param, callback) => {
    let { account, id } = table.schedule.fields
    let options = {
        parameter: [param.id?.Exact()],
        filter: [account?.Is()],
        order: [id?.Desc()]
    }
    // let sql = query.builder.rec(table.schedule, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.schedule, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const transferRecord = async (param, callback) => {
    let error = 0
    let batch = await Promise.all(param?.trans.map(async item => {
        let payment = await new Promise((resolve, reject) => {
            let sql = table.schedule.transferUpdate.payment
                .replace("@new", item.new)
                .replace("@sto", item.sto)
                .replace("@old", item.old)
            my.query(sql, async (err, ans) => {
                if (err) {
                    error++
                    return reject(err)
                }
                resolve({ success: true, response: ans })
            })
        })
        let reimburse = await new Promise((resolve, reject) => {
            let sql = table.schedule.transferUpdate.reimburse
                .replace("@new", item.new)
                .replace("@sto", item.sto)
                .replace("@old", item.old)
            my.query(sql, async (err, ans) => {
                if (err) {
                    error++
                    return reject(err)
                }
                resolve({ success: true, response: ans })
            })
        })
        let returnitems = await new Promise((resolve, reject) => {
            let sql = table.schedule.transferUpdate.returnitems
                .replace("@new", item.new)
                .replace("@old", item.old)
            my.query(sql, async (err, ans) => {
                if (err) {
                    error++
                    return reject(err)
                }
                resolve({ success: true, response: ans })
            })
        })
        let returnrequest = await new Promise((resolve, reject) => {
            let sql = table.schedule.transferUpdate.returnrequest
                .replace("@new", item.new)
                .replace("@sto", item.sto)
                .replace("@old", item.old)
            my.query(sql, async (err, ans) => {
                if (err) {
                    error++
                    return reject(err)
                }
                resolve({ success: true, response: ans })
            })
        })
        let credit = await new Promise((resolve, reject) => {
            let sql = table.schedule.transferUpdate.credit
                .replace("@new", item.new)
                .replace("@old", item.old)
            my.query(sql, async (err, ans) => {
                if (err) {
                    error++
                    return reject(err)
                }
                resolve({ success: true, response: ans })
            })
        })
        let dispensed = await new Promise((resolve, reject) => {
            let sql = table.schedule.transferUpdate.dispensed
                .replace("@new", item.new)
                .replace("@old", item.old)
            my.query(sql, async (err, ans) => {
                if (err) {
                    error++
                    return reject(err)
                }
                resolve({ success: true, response: ans })
            })
        })
        let transaction = await new Promise((resolve, reject) => {
            let sql = table.schedule.transferUpdate.transaction
                .replace("@new", item.new)
                .replace("@sto", item.sto)
                .replace("@old", item.old)
            my.query(sql, async (err, ans) => {
                if (err) {
                    error++
                    return reject(err)
                }
                resolve({ success: true, response: ans })
            })
        })
        return {
            payment,
            reimburse,
            returnitems,
            returnrequest,
            credit,
            dispensed,
            transaction,
        }
    }))
    return callback(null, { errors: error, data: batch })
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord,
    selectRecord,
    uniqueRecord,
    searchRecord,
    balanceRecord,
    startRecord,
    accountRecord,
    transferRecord
}