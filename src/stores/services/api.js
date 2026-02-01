import axios from "axios"

const api = axios.create({
  baseURL: "https://697c01a9889a1aecfeb13d77.mockapi.io/api/v1",
})

export default api