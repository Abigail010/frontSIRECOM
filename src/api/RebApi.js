import axios from "axios"

const RebApi = axios.create({
 // baseURL: 'http://165.172.65.62:3001',
  baseURL: 'http://localhost:3001',
  // baseURL: "http://165.172.16.33:3009/",
  // baseURL: "http://10.0.0.109:3009/RebApi",  // SERVIDOR DE PRUEBA
  // baseURL: "https://edapi.mingobierno.gob.bo/RebApi"
})

RebApi.interceptors.request.use((config) => {
  config.headers = {
    "x-access-token": localStorage.getItem("token")
  }
  return config
})

export default RebApi