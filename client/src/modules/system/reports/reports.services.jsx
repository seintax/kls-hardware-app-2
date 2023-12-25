import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchDailySales = async (fr, to) => {
    const opt = { params: { fr: fr, to: to } }
    const res = await axios.get(`${BASE_URL}/system/reports/daily-sales`, opt)
    return res.data
}

export const fetchDailySummary = async (fr, to) => {
    const opt = { params: { fr: fr, to: to } }
    const res = await axios.get(`${BASE_URL}/system/reports/daily-summary`, opt)
    return res.data
}

export const fetchDailyReceivables = async () => {
    const res = await axios.get(`${BASE_URL}/system/reports/daily-receivables`)
    return res.data
}

export const fetchWeeklySummary = async (fr, to) => {
    const opt = { params: { fr: fr, to: to } }
    const res = await axios.get(`${BASE_URL}/system/reports/weekly-summary`, opt)
    return res.data
}

export const fetchReceivableCollection = async (fr, to) => {
    const opt = { params: { fr: fr, to: to } }
    const res = await axios.get(`${BASE_URL}/system/reports/receivable-collection`, opt)
    return res.data
}

export const fetchDailyInventory = async (fr) => {
    const opt = { params: { fr: fr } }
    const res = await axios.get(`${BASE_URL}/system/reports/daily-inventory`, opt)
    return res.data
}

export const fetchDailyReturn = async (fr, to) => {
    const opt = { params: { fr: fr, to: to } }
    const res = await axios.get(`${BASE_URL}/system/reports/daily-return`, opt)
    return res.data
}

export const fetchMaintenance = async (sql) => {
    const opt = { params: { sql: sql } }
    const res = await axios.get(`${BASE_URL}/migration/download`, opt)
    return res.data
}