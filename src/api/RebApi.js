import axios from "axios"


/*
let RebApi; 
if( dev === 'si'){
 RebApi = axios.create({
 // baseURL: 'http://165.172.65.62:3001',
  baseURL: 'http://localhost:3001',
  // baseURL: "http://165.172.16.33:3009/",
  // baseURL: "http://10.0.0.109:3009/RebApi",  // SERVIDOR DE PRUEBA
  // baseURL: "https://edapi.mingobierno.gob.bo/RebApi"
})
}else{
  RebApi = axios.create({
    // baseURL: 'http://165.172.65.62:3001',
     baseURL: 'http://localhost:3001',
     // baseURL: "http://165.172.16.33:3009/",
     // baseURL: "http://10.0.0.109:3009/RebApi",  // SERVIDOR DE PRUEBA
     // baseURL: "https://edapi.mingobierno.gob.bo/RebApi"
   })
}*/
const dev = true; // Cambia a false en producción
const baseURL = dev ? 'http://localhost:3001' : 'http://localhost:3009';

export const RebApi = axios.create({
  baseURL
});

RebApi.interceptors.request.use((config) => {
  config.headers = {
    "x-access-token": localStorage.getItem("token")
  }
  return config
})


export function getDirection() {
  return baseURL; // Devuelve la URL en función del valor de dev
}
//export default RebApi
export default { RebApi, getDirection }; // Exporta ambos como un objeto