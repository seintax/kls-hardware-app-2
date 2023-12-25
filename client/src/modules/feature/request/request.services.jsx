import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchRequest = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/request`, opt)
    return res.data
}

export const createRequest = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/request`, data)
    return res.data
}

export const updateRequest = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/request`, data)
    return res.data
}

export const deleteRequest = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/custom/cashering/request`, opt)
    return res.data
}

export const searchRequest = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/request/search`, opt)
    return res.data
}

export const fetchRequestById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/request/element`, opt)
    return res.data
}

export const fetchRequestForStatus = async (statuses) => {
    const opt = { params: { statuses: statuses } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/request/forstatus`, opt)
    return res.data
}