const statuses = [
    { value: "A", key: "Active" },
    { value: "I", key: "Inactive" }
]

const booleans = [
    { value: "Y", key: "Yes" },
    { value: "N", key: "No" }
]

const FormatSelection = [
    { value: "a-z", key: "Alphabetical Lowercase Format (a-z)" },
    { value: "A-Z", key: "Alphabetical Uppercase Format (A-Z)" },
    { value: "1-1000", key: "Numerical Format (1-1000)" },
    { value: "I-M", key: "Roman Numeral Format (I-M)" },
]

function UppercaseAlphabeticalFormat(number) {
    const format = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    return format[number]
}

function LowercaseAlphabeticalFormat(number) {
    const format = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    return format[number]
}

function NumericalFormat(number) {
    const format = Array.from(Array(1000).keys())
    return format[number]
}

function RomanNumeralFormat(number) {
    var num = Math.floor(number),
        val, s = '', i = 0,
        v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
        r = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

    function toBigRoman(n) {
        var ret = '', n1 = '', rem = n
        while (rem > 1000) {
            var prefix = '', suffix = '', n = rem, s = '' + rem, magnitude = 1
            while (n > 1000) {
                n /= 1000
                magnitude *= 1000
                prefix += '('
                suffix += ')'
            }
            n1 = Math.floor(n)
            rem = s - (n1 * magnitude)
            ret += prefix + n1.toRoman() + suffix
        }
        return ret + rem.toRoman()
    }

    if (this - num || num < 1) num = 0
    if (num > 3999) return toBigRoman(num)

    while (num) {
        val = v[i]
        while (num >= val) {
            num -= val
            s += r[i]
        }
        ++i
    }
    return s
}

const ArrayVariables = {
    statuses,
    booleans,
    FormatSelection,
    UppercaseAlphabeticalFormat,
    LowercaseAlphabeticalFormat,
    NumericalFormat,
    RomanNumeralFormat
}

export default ArrayVariables