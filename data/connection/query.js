require("./../../src/utilities/string.prototypes")


const migrateBuilder = (parameter, table) => {
    const parameters = []
    const fields = []
    const values = []
    for (const prop in parameter) {
        if (parameter[prop]) {
            parameters.push(parameter[prop])
            fields.push(prop)
            values.push("?")
        }
    }
    return {
        tablename: table.name,
        parameters: parameters,
        create: {
            fields: fields.join(", "),
            values: values.join(", ")
        }
    }
}

const createBuilder = (parameter, table) => {
    const parameters = []
    const fields = []
    const values = []
    for (const prop in table.fields) {
        if (parameter[prop]) {
            parameters.push(parameter[prop])
            fields.push(table.fields[prop])
            values.push("?")
        }
    }
    return {
        tablename: table.name,
        parameters: parameters,
        create: {
            fields: fields.join(", "),
            values: values.join(", ")
        }
    }
}

const updateBuilder = (parameter, table) => {
    const parameters = []
    const fields = []
    for (const prop in parameter) {
        if (table.fields[prop]) {
            parameters.push(parameter[prop])
            if (prop !== "id") fields.push(`${table.fields[prop]}=?`)
        }
    }
    return {
        tablename: table.name,
        parameters: parameters,
        update: {
            fields: fields.join(", ")
        }
    }
}

const searchBuilder = (parameter, table) => {
    const parameters = []
    const filters = []
    for (const prop in table.fields) {
        filters.push(`${table.fields[prop]} LIKE ?`)
        parameters.push(parameter === undefined ? `%%` : `%${parameter}%`)
    }
    for (const prop in table.joined) {
        filters.push(`${table.joined[prop]} LIKE ?`)
        parameters.push(parameter === undefined ? `%%` : `%${parameter}%`)
    }
    return {
        parameters: parameters,
        filters: filters
    }
}

const alias = (table) => {
    const names = []
    for (const prop in table.fields) {
        names.push(`${table.fields[prop]} AS ${prop}`)
    }
    if (table?.joined) {
        for (const prop in table.joined) {
            names.push(`${table.joined[prop]} AS ${prop}`)
        }
    }
    return names.join(", ")
}

const groupby = (fields) => {
    let aliases = {}
    fields.forEach((field) => {
        const alias = field.split(" AS ")
        const name = alias[1]
        aliases = {
            ...aliases,
            [name]: name
        }
    })
    return {
        field: fields?.join(", "),
        array: aliases
    }
}

const fields = (table) => {
    let names = {}
    for (const prop in table.fields) {
        names = {
            ...names,
            [table.fields[prop]]: prop
        }
    }
    if (table?.joined) {
        for (const prop in table.joined) {
            names = {
                ...names,
                [table.joined[prop]]: prop
            }
        }
    }
    return names
}

const compare = (base, fields) => {
    const names = []
    for (const prop in base) {
        if (fields.hasOwnProperty(prop)) {
            names.push(`${fields[prop]} AS ${prop}`)
        }
        else {
            names.push(`'' AS ${prop}`)
        }
    }
    return names.join(", ")
}

// query builder for create
const add = (name, fields, values) => {
    return `INSERT INTO ${name} (${fields}) VALUES (${values});`
}

// query builder for update
const set = (name, fields, id) => {
    return `UPDATE ${name} SET ${fields} WHERE ${id}=?`
}

// query builder for delete
const del = (name, id) => {
    return `DELETE FROM ${name} WHERE ${id}=?`
}

// query builder for select
const rec = (table, filter, order, limit) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return `SELECT ${alias(table)} FROM ${table.name}${condition} WHERE ${filter?.filter(f => f !== undefined)?.join(" AND ")}${order ? ` ORDER BY ${order.join(", ")}` : ""}${limit ? ` LIMIT ${limit}` : ""}`
}

const rec_ = (table, filter, order, limit) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return {
        query: `SELECT * FROM ${table.name}${condition} WHERE ${filter?.filter(f => f !== undefined)?.join(" AND ")}${order ? ` ORDER BY ${order.join(", ")}` : ""}${limit ? ` LIMIT ${limit}` : ""}`,
        array: fields(table)
    }
}

const qty_ = (table, filter, order, limit) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return {
        query: `SELECT COUNT(*) AS qty FROM ${table.name}${condition} WHERE ${filter?.filter(f => f !== undefined)?.join(" AND ")}${order ? ` ORDER BY ${order.join(", ")}` : ""}${limit ? ` LIMIT ${limit}` : ""}`,
        array: { qty: 'qty' }
    }
}

const grp_ = (fields, table, filter, group, order, limit) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    const grouped = groupby(fields)
    return {
        query: `SELECT ${grouped.field} FROM ${table.name}${condition} WHERE ${filter?.filter(f => f !== undefined)?.join(" AND ")}${group ? ` GROUP BY ${group.join(", ")}` : ""}${order ? ` ORDER BY ${order.join(", ")}` : ""}${limit ? ` LIMIT ${limit}` : ""}`,
        array: grouped.array
    }
}

// query builder for select
const src = (table, filter, order, situational = []) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    let situation = filter?.length ? ` AND ${situational.join(" AND ")}` : ` ${situational.join(" AND ")}`
    return `SELECT ${alias(table)} FROM ${table.name}${condition} WHERE (${filter.join(" OR ")})${situational.length ? situation : ""} ORDER BY ${order.join(", ")}`
}

const src_ = (table, filter, order, situational = []) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    let situation = filter?.length ? ` AND ${situational.join(" AND ")}` : ` ${situational.join(" AND ")}`
    return {
        query: `SELECT * FROM ${table.name}${condition} WHERE (${filter.join(" OR ")})${situational.length ? situation : ""} ORDER BY ${order.join(", ")}`,
        array: fields(table)
    }
}

// query builder for single
const get = (table, id) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return `SELECT ${alias(table)} FROM ${table.name}${condition} WHERE ${id}=?`
}

const get_ = (table, id) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return {
        query: `SELECT * FROM ${table.name}${condition} WHERE ${id}=?`,
        array: fields(table)
    }
}

const mask = (response, fieldarr) => {
    if (response.length > 0) {
        return response?.map(data => {
            let json = {}
            for (const prop in data) {
                if (fieldarr[prop]) {
                    json = {
                        ...json,
                        [fieldarr[prop]]: data[prop]
                    }
                    continue
                }
                json = { ...json, [prop]: data[prop] }
            }
            return json
        })
    }
    return response
}

// query builder for union
const union = (array, base, order, limit) => {
    const parameters = []
    let sql = array?.map(data => {
        data?.options?.parameter?.map(param => {
            parameters.push(param)
        })
        return `(SELECT ${compare(base, data?.fields)} FROM ${data?.name} WHERE ${data?.options?.filter.join(" AND ")}${order ? ` ORDER BY ${order.join(", ")}` : ""})`
    })
    return {
        query: `${sql.join(" UNION ")}${limit ? ` LIMIT ${limit}` : ""}`,
        parameter: parameters
    }
}

const optional = (options) => {
    return `(${options?.filter(f => f !== undefined)?.join(" OR ")})`
}

const builder = {
    add: add,
    set: set,
    del: del,
    rec: rec,
    get: get,
    src: src,
    union: union,
}

const optimize = {
    rec: rec_,
    get: get_,
    src: src_,
    qty: qty_,
    grp: grp_,
}

module.exports = {
    createBuilder,
    updateBuilder,
    searchBuilder,
    migrateBuilder,
    optional,
    optimize,
    builder,
    mask
}
