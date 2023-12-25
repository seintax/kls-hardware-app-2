import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchSupplier = async (search = "") => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/supplier`, opt)
    return res.data
}

export const createSupplier = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/supplier`, data)
    return res.data
}

export const updateSupplier = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/supplier`, data)
    return res.data
}

export const deleteSupplier = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/feature/supplier`, opt)
    return res.data
}

export const searchSupplier = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/supplier/search`, opt)
    return res.data
}

export const fetchSupplierById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/supplier/element`, opt)
    return res.data
}

export const librarySupplier = async () => {
    const res = await fetchSupplier()
    let value = res?.result?.map(data => {
        return { value: data.id, key: data.name }
    }) || []
    return value
}