String.prototype.Asc = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} ASC`
}

String.prototype.Desc = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} DESC`
}

String.prototype.Like = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} LIKE ?`
}

String.prototype.NotLike = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} NOT LIKE ?`
}

String.prototype.Is = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} = ?`
}

String.prototype.Between = function () {
    let base = (this === undefined ? "" : this.toString())
    return `(${base} BETWEEN ? AND ?)`
}

String.prototype.Greater = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} > ?`
}

String.prototype.Lesser = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} < ?`
}

String.prototype.IsNot = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} <> ?`
}

String.prototype.IsNull = function () {
    let base = (this === undefined ? "" : this.toString())
    return `${base} IS NULL`
}

String.prototype.IsNot = function () {
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

