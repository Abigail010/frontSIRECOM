import axios from "axios";

const segipApi = axios.create({
  baseURL: "https://api.mingobierno.gob.bo",
});

segipApi.interceptors.request.use((config)=>{
  config.headers = {
    "Authorization":'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVTJGc2RHVmtYMTlWSFBUZWxKRFRqWVBjdGNvMXEyY2ZFOVk1OWZCSW5iST0iLCJpYXQiOjE2NDU1Mzg4ODUsImV4cCI6MTk2MDg5ODg4NX0.Rl2zHlPMdif_vfcD1-GmddqyqhGidUuXCM5U02W1gZY'
  }
  return config
})

export default segipApi
