import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const getData = async (params) => {
    const opt = { params: params }
    const res = await axios.get(`${BASE_URL}/system/database`, opt)
    return res.data
}