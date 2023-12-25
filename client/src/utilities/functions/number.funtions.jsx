export const currencyFormat = new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    currency: 'PHP',
    minimumFractionDigits: 2,
})

export const amount = (value) => {
    return Number(Number(value?.toString()?.replaceAll(",", ""))?.toFixed(2) || 0)
}

export const equal = (value1, value2, log = false) => {
    if (amount(value1) === amount(value2)) return true
    let difference = Math.abs(amount(value1) - amount(value2))
    if (log) {
        // console.info(value1)
        // console.info(value2)
        // console.info(difference)
    }
    if (difference > 0 && difference < 1) return true
    return false
}