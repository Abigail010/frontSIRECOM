/* eslint-disable prettier/prettier */
import axios from "axios";
const siibApiImages = axios.create({
  baseURL: "http://localhost:3009",
  // baseURL: "http://165.172.16.33:3009",
  // baseURL: "http://10.0.0.109:3009/siibapi",  // SERVIDOR DE PRUEBA
  // baseURL: "https://edapi.mingobierno.gob.bo/siibapi"
});
siibApiImages.interceptors.request.use((config)=>{
  config.headers={
    "x-access-token":localStorage.getItem("token"),
    "Content-Type": "multipart/form-data"
  }
  return config
}
)
export default siibApiImages;