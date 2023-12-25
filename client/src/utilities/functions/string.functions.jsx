const ENC_VAL = import.meta.env.VITE_ENC_VAL
const ENC_KEY = import.meta.env.VITE_ENC_KEY

export function generateZeros(str, maxcount) {
    if (str) {
        let maxlen = Number(maxcount) - str?.toString().length
        return `${Array(maxlen + 1).join("0")}${str}`
    }
    return str
}

export function generateChar(str, char, maxcount) {
    if (str) {
        let maxlen = Number(maxcount) - str?.toString().length
        if (maxlen > 0)
            return `${Array(maxlen).join(char)}${str}`
        else
            return str
    }
    return str
}

export const encryptToken = (token) => {
    var t = token
    var r = 5
    var a = t.split("")
    for (var x = 0; x < r; x++) {
        var v = ENC_VAL.split("")
        var e = ENC_KEY.split("")
        var n = a.length

        for (var i = 0; i < n; i++) {
            if (e[v.indexOf(a[i])] >= 0) {
                a[i] = e[v.indexOf(a[i])]
            }
        }
        t = a.join("")
    }
    return t
}