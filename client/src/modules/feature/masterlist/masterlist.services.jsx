import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchMasterlist = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/masterlist`, opt)
    return res.data
}

export const createMasterlist = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/masterlist`, data)
    return res.data
}

export const updateMasterlist = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/masterlist`, data)
    return res.data
}

export const deleteMasterlist = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/feature/masterlist`, opt)
    return res.data
}

export const searchMasterlist = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/masterlist/search`, opt)
    return res.data
}

export const fetchMasterlistById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/masterlist/element`, opt)
    return res.data
}

export const libraryMasterlist = async () => {
    const res = await fetchMasterlist()
    let value = res?.result?.map(data => {
        return { value: data.id, key: `${data.name} ${data.details} ${data.unit}`, data: data }
    }) || []
    return value
}