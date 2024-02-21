String.prototype.Asc = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} ASC`
}

String.prototype.Desc = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} DESC`
}

String.prototype.SumAs = function (alias = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `SUM(${base}) AS ${alias}`
}

String.prototype.CountAs = function (alias = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `COUNT(${base}) AS ${alias}`
}

String.prototype.AliasAs = function (alias = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} AS ${alias}`
}

String.prototype.Like = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} LIKE ${val ? `'%${val}%'` : "?"}`
}

String.prototype.NotLike = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} NOT LIKE ${val ? `'%${val}%'` : "?"}`
}

String.prototype.Is = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} = ${val ? `'${val}'` : "?"}`
}

String.prototype.Between = function (fr = undefined, to = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `(${base} BETWEEN ${fr ? `'${fr}'` : "?"} AND ${to ? `'${to}'` : "?"})`
}

String.prototype.Greater = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} > ${val ? val : "?"}`
}

String.prototype.Lesser = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} < ${val ? val : "?"}`
}

String.prototype.Equal = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} = ${val ? `${val}` : "?"}`
}

String.prototype.IsNot = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `${base} <> ${val ? `'${val}'` : "?"}`
}

String.prototype.IsNull = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} IS NULL`
}

String.prototype.IsNotNull = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} IS NOT NULL`
}

String.prototype.Exact = function () {
    let base = (this === undefined ? "" : this.toString())
    return base
}

String.prototype.Contains = function () {
    let base = (this === undefined ? "" : this)
    return `%${base}%`
}

String.prototype.Starts = function () {
    let base = (this === undefined ? "" : this)
    return `${base}%`
}

String.prototype.Ends = function () {
    let base = (this === undefined ? "" : this)
    return `%${base}`
}

String.prototype.Qoute = function () {
    let base = (this === undefined ? "" : this)
    return `'${base}'`
}

String.prototype.DateFormat = function (val = undefined) {
    let base = (this === undefined ? "" : this.toString())
    return `DATE(${base})`
}

