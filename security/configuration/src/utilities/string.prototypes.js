String.prototype.appendString = function (string, separator = " ") {
    if (this === "" || this === undefined || this == null) {
        return string
    }
    return `${this}${separator}${string}`
}