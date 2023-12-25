import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchAccount = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/system/account`, opt)
    return res.data
}

export const createAccount = async (data) => {
    const res = await axios.post(`${BASE_URL}/system/account`, data)
    return res.data
}

export const updateAccount = async (data) => {
    const res = await axios.patch(`${BASE_URL}/system/account`, data)
    return res.data
}

export const deleteAccount = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/system/account`, opt)
    return res.data
}

export const searchAccount = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/system/account/search`, opt)
    return res.data
}

export const fetchAccountById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/system/account/element`, opt)
    return res.data
}

export const loginAccount = async (user, pass, token) => {
    const opt = { params: { user: user, pass: pass, token: token } }
    const res = await axios.get(`${BASE_URL}/system/account/login`, opt)
    return res.data
}

export const loginAsAccount = async (user, pass) => {
    const opt = { params: { user: user, pass: pass } }
    const res = await axios.get(`${BASE_URL}/system/account/logas`, opt)
    return res.data
}

export const fetchAccountByToken = async (token) => {
    const opt = { params: { token: token } }
    const res = await axios.get(`${BASE_URL}/system/account/token`, opt)
    return res.data
}