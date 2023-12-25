export const sortBy = (function () {
    var toString = Object.prototype.toString,
        parse = function (value) { return value },
        getItem = function (value) {
            var isObject = value != null && typeof value === "object"
            var isProp = isObject && this.prop in value
            return this.parser(isProp ? value[this.prop] : value)
        },
        checkNaN = function (value) { return Number.isNaN(value) ? 0 : value }
    /**
     * Sorts an array of elements.
     *
     * @param  {Array} array: the collection to sort
     * @param  {Object} config: the configuration options
     * @property {String}   config.prop: property name (if it is an Array of objects)
     * @property {Boolean}  config.desc: determines whether the sort is descending
     * @property {Function} config.parser: function to parse the items to expected type
     * @return {Array}
     */
    return function sortby(array, config) {
        if (!(array instanceof Array && array.length)) return []
        if (toString.call(config) !== "[object Object]") config = {}
        let defaultParser = (t) => t?.toUpperCase()
        if (typeof config.parser !== "function") config.parser = parse || defaultParser
        config.desc = !!config.desc ? -1 : 1
        return array.sort(function (a, b) {
            a = getItem.call(config, checkNaN(a))
            b = getItem.call(config, checkNaN(b))
            return config.desc * (a < b ? -1 : +(a > b))
        })
    }

}())