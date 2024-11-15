import axios from "axios"
import  { URL } from '@/utils/helpers/direction'

/*
let sirecomApi; 
if( dev === 'si'){
 sirecomApi = axios.create({
 // baseURL: 'http://165.172.65.62:3001',
  baseURL: 'http://localhost:3001',
  // baseURL: "http://165.172.16.33:3009/",
  // baseURL: "http://10.0.0.109:3009/sirecomApi",  // SERVIDOR DE PRUEBA
  // baseURL: "https://edapi.mingobierno.gob.bo/sirecomApi"
})
}else{
  sirecomApi = axios.create({
    // baseURL: 'http://165.172.65.62:3001',
     baseURL: 'http://localhost:3001',
     // baseURL: "http://165.172.16.33:3009/",
     // baseURL: "http://10.0.0.109:3009/sirecomApi",  // SERVIDOR DE PRUEBA
     // baseURL: "https://edapi.mingobierno.gob.bo/sirecomApi"
   })
}*/

const baseURL = URL

export const sirecomApi = axios.create({
  baseURL
});

sirecomApi.interceptors.request.use((config) => {
  config.headers = {
    "x-access-token": localStorage.getItem("token")
  }
  return config
})

export default sirecomApi
//export default { sirecomApi, getDirection }; // Exporta ambos como un objeto