import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchDiscount = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/library/discount`, opt)
    return res.data
}

export const createDiscount = async (data) => {
    const res = await axios.post(`${BASE_URL}/library/discount`, data)
    return res.data
}

export const updateDiscount = async (data) => {
    const res = await axios.patch(`${BASE_URL}/library/discount`, data)
    return res.data
}

export const deleteDiscount = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/library/discount`, opt)
    return res.data
}

export const fetchDiscountById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/library/discount/element`, opt)
    return res.data
}

export const libraryDiscount = async () => {
    const res = await fetchDiscount()
    let value = res?.result?.map(data => {
        return { value: data.name, key: data.name }
    }) || []
    return value
}