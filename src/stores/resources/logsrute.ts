import { defineStore } from 'pinia';
import { router } from '@/router';
import rebApi from "@/api/rebApi"


export const useLogsruterStore = defineStore({
    id: 'Logsruter',
    actions: { 
      
      // CREAR LOGRUTE
      async createLogrutes(ruta: any) {
        try {
          
          const { data } = await rebApi.post('rutalog/create_logrute' , ruta)
         
          return { ok: true, message: data.message }
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      }, 
   
  
    }
  
  });