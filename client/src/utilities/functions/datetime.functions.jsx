import moment from "moment"

export const createInstance = () => {
    return moment(new Date()).format("YYYYMMDDHHmmss")
}

export const sqlDate = () => {
    return moment(new Date()).format("YYYY-MM-DD")
}

export const sqlTimestamp = () => {
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
}