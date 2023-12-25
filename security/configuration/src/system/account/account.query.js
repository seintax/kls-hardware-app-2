const mysql = require('mysql')
const my = require('../../../data/connection/mysql')
const cache = require('../../../data/connection/cache')
const query = require('../../../data/connection/query')
const table = require('./account.helper')
require("../../utilities/query.prototypes")

const encVal = process.env.ENC_VAL
const encKey = process.env.ENC_KEY

const decryptToken = (token) => {
    var t = token
    var r = 5
    for (var x = 0; x < r; x++) {
        var a = t.split("")
        var v = encVal.split("")
        var d = encKey.split("")
        var n = a.length

        for (var i = 0; i < n; i++) {
            if (v[d.indexOf(a[i])] >= 0) {
                a[i] = v[d.indexOf(a[i])]
            }
        }
        t = a.join("")
    }
    return t
}

const createRecord = async (param, callback) => {
    let hashedpass = param.pass
    let newparam = {
        ...param,
        pass: decryptToken(hashedpass)
    }
    let helper = query.createBuilder(newparam, table.account)
    let sql = query.builder.add(table.account.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        const res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let hashedpass = param.pass
    let newparam = {
        ...param,
        pass: decryptToken(hashedpass)
    }
    let helper = query.updateBuilder(newparam, table.account)
    let sql = query.builder.set(table.account.name, helper.update.fields, table.account.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.account.name, table.account.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.account.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.account, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const uniqueRecord = async (param, callback) => {
    let sql = query.builder.get(table.account, table.account.fields.id)
    my.query(sql, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.account.fields
    let helper = query.searchBuilder(param.search, table.account)
    let sql = query.builder.src(table.account, helper.filters, [id?.Asc()])
    my.query(sql, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const loginRecord = async (param, callback) => {
    await new Promise((resolve, reject) => {
        let sql = table.account.tokenUpdate
        my.query(sql, [decryptToken(param.token), param.user], async (err, ans) => {
            if (err) return reject(err)
            resolve(ans)
        })
    })
    let credential = await new Promise((resolve, reject) => {
        let { user, pass } = table.account.fields
        let options = {
            parameter: [param.user?.Exact(), decryptToken(param.pass)?.Exact()],
            filter: [user?.Is(), pass?.Is()],
            order: [user?.Asc()]
        }
        let sql = query.builder.rec(table.account, options.filter, options.order)
        my.query(sql, options.parameter, (err, ans) => {
            if (err) return reject(err)
            resolve({
                id: ans[0]?.id,
                name: ans[0]?.name,
                token: ans[0]?.token,
            })
        })
    })
    return callback(null, credential)
}

const tokenRecord = async (param, callback) => {
    let { user } = table.account.fields
    let options = {
        parameter: [param.token?.Exact()],
        filter: [token?.Is()],
        order: [user?.Asc()]
    }
    let sql = query.builder.rec(table.account, options.filter, options.order)
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
    loginRecord,
    tokenRecord
}