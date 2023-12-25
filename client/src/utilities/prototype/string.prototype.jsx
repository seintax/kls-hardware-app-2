String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}

String.prototype.appendString = function (string, separator = ",") {
    if (this === "" || this === undefined || this === null) return string
    return `${this}${separator}${string}`
}

// Object.prototype.toCurrency = function () {
//     return Number(this.replaceAll(",", "").toFixed(2))
// }