const mysql = require('mysql')
const my = require('../../../data/connection/mysql')
const cache = require('../../../data/connection/cache')
const query = require('../../../data/connection/query')
const table = require('./inventory.helper')
const assoc = require('../conversion/conversion.helper')
require("../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.inventory)
    let sql = query.builder.add(table.inventory.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        let res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.inventory)
    let sql = query.builder.set(table.inventory.name, helper.update.fields, table.inventory.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.inventory.name, table.inventory.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.inventory.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    // let sql = query.builder.rec(table.inventory, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.inventory, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const uniqueRecord = async (param, callback) => {
    // let sql = query.builder.get(table.inventory, table.inventory.fields.id)
    // my.query(sql, [param.id], (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.get(table.inventory, table.inventory.fields.id)
    my.query(sql.query, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const searchRecord = async (param, callback) => {
    // let { drdate } = table.inventory.fields
    // let helper = query.searchBuilder(param.search, table.inventory)
    // let sql = query.builder.src(table.inventory, helper.filters, [drdate?.Desc()])
    let { name, details, drno, supplier, drdate, stocks } = table.inventory.fields
    let all = stocks?.Greater("0")
    if (param.all === "Y") all = undefined
    let options = {
        parameter: [param.search?.Contains(), param.search?.Contains(), param.search?.Contains(), param.search?.Contains()],
        filter: [query.optional([
            name?.Like(),
            details?.Like(),
            drno?.Like(),
            supplier?.Like(),
        ]), all],
        order: [drdate?.Desc()]
    }
    // let sql = query.builder.rec(table.inventory, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.inventory, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const associateTable = (param) => {
    let { name, details, drdate, stocks } = assoc.conversion.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like(), stocks?.Greater("0")],
        order: [name?.Asc(), details?.Asc(), drdate?.Asc()]
    }
    return {
        name: assoc.conversion.name,
        fields: assoc.conversion.product,
        options: options
    }
}

const libraryRecord = async (param, callback) => {
    let { name, details, drdate, stocks } = table.inventory.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like(), stocks?.Greater("0")],
        order: [name?.Asc(), details?.Asc(), drdate?.Asc()]
    }
    // let sql = query.builder.rec(table.inventory, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.inventory, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const availableRecord = async (param, callback) => {
    let { name, details, drdate, stocks } = table.inventory.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like(), stocks?.Greater("0")],
        order: [name?.Asc(), details?.Asc(), drdate?.Asc()]
    }
    // let sql = query.builder.rec(table.inventory, options.filter, options.order)
    let inv = {
        name: table.inventory.name,
        fields: table.inventory.product,
        options: options
    }
    let cnv = associateTable(param)
    let union = query.builder.union([inv, cnv], table.inventory.product, ["name".Asc(), "details".Asc(), "drdate".Asc()])
    my.query(union.query, union.parameter, (err, ans) => {
        if (err) return callback(err)
        let sorted = ans?.sort((a, b) => {
            var byName = a.name.localeCompare(b.name)
            var byDetails = a.details.localeCompare(b.details)
            var byDrDate = new Date(a.drdate) - new Date(b.drdate)
            var byPrice = parseFloat(b.price) - parseFloat(a.price)
            return byName || byDetails || byDrDate
        })
        return callback(null, sorted)
    })
}

const inventoryRecord = async (param, callback) => {
    let { name, reference } = table.inventory.fields
    let options = {
        parameter: [param.id],
        filter: [reference?.Is()],
        order: [name?.Asc()]
    }
    // let sql = query.builder.rec(table.inventory, options.filter, options.order)
    // my.query(sql, options.parameter, (err, ans) => {
    //     if (err) return callback(err)
    //     return callback(null, ans)
    // })
    let sql = query.optimize.rec(table.inventory, options.filter, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const productRecord = async (param, callback) => {
    let { product, received, unit } = table.inventory.fields
    let options = {
        fields: [product?.AliasAs('product'), unit?.AliasAs('unit'), received?.SumAs('total')],
        parameter: [param.product?.Exact()],
        filter: [product?.Is()],
        group: [product, unit],
        order: [product?.Asc()]
    }
    let sql = query.optimize.grp(options.fields, table.inventory, options.filter, options.group, options.order)
    my.query(sql.query, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, query.mask(ans, sql.array))
    })
}

const transferRecord = async (param, callback) => {
    let sql = (
        param.op === "add" ?
            table.inventory.transferAdded.replaceAll("@qty", param.qty) :
            table.inventory.transferMinus.replaceAll("@qty", param.qty)
    )
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const convertRecord = async (param, callback) => {
    let sql = (
        param.op === "add" ?
            table.inventory.convertAdded.replaceAll("@qty", param.qty).replaceAll("@amt", param.amt) :
            table.inventory.convertMinus.replaceAll("@qty", param.qty).replaceAll("@amt", param.amt)
    )
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const batchRecord = async (param, callback) => {
    let batch = await Promise.all(param?.cart?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let sql = (
                param.op === "add" ?
                    table.inventory.inventoryAdded.replaceAll("@qty", item.purchase) :
                    table.inventory.inventoryMinus.replaceAll("@qty", item.purchase)
            )
            my.query(sql, [item.item], async (err, ans) => {
                if (err) return reject(err)
                resolve({ item: item.item, response: ans })
            })
        })
        return retrieve
    }))
    return callback(null, batch)
}

const returnRecord = async (param, callback) => {
    let batch = await Promise.all(param?.cart?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let sql = (
                param.op === "add" ?
                    table.inventory.returnAdded.replaceAll("@qty", item.toreturn) :
                    table.inventory.returnMinus.replaceAll("@qty", item.toreturn)
            )
            my.query(sql, [item.item], async (err, ans) => {
                if (err) return reject(err)
                resolve({ item: item.item, response: ans })
            })
        })
        return retrieve
    }))
    return callback(null, batch)
}

const balanceRecord = async (param, callback) => {
    let sql = table.inventory.balanceUpdate
    my.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const stocksRecord = async (param, callback) => {
    let sql = table.inventory.stocksUpdate
    my.query(sql, [param.id], async (err, ans) => {
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
    availableRecord,
    inventoryRecord,
    productRecord,
    transferRecord,
    convertRecord,
    batchRecord,
    returnRecord,
    balanceRecord,
    libraryRecord,
    stocksRecord,
}
