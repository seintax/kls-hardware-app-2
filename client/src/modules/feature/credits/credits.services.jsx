import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchCredits = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits`, opt)
    return res.data
}

export const createCredits = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/credits`, data)
    return res.data
}

export const updateCredits = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/credits`, data)
    return res.data
}

export const deleteCredits = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/custom/cashering/credits`, opt)
    return res.data
}

export const searchCredits = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits/search`, opt)
    return res.data
}

export const fetchCreditsById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits/element`, opt)
    return res.data
}

export const fetchCreditsByCustomer = async (customer, search = "") => {
    const opt = { params: { customer: customer, search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits/customer`, opt)
    return res.data
}

export const fetchCreditsByOngoing = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits/ongoing`, opt)
    return res.data
}

export const fetchCreditsBySettled = async (customer, search = "") => {
    const opt = { params: { customer: customer, search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits/settled`, opt)
    return res.data
}

export const fetchCreditsByTransaction = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits/transaction`, opt)
    return res.data
}

export const returnCredits = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/credits/return`, data)
    return res.data
}

export const migrateCredits = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/credits/migrate`, data)
    return res.data
}