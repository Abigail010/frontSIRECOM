import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3001/auth/",
 // baseURL: "http://165.172.65.62:3001/auth/",
  // baseURL: "http://165.172.16.33:3009/auth/",
  // baseURL: "http://10.0.0.109:3009/siibapi/auth/", // SERVIDOR DE PRUEBA
  // baseURL: "https://.mingobierno.gob.bo/rebapi/auth"
})

authApi.interceptors.request.use((config) => {
  config.headers = {
    "x-access-token": localStorage.getItem("token")
  }
  return config
})

export default authApi