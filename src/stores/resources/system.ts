import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useSystemStore = defineStore({
  id: 'system',
  actions: {

    
    async systems () {
      try {
        const { data } = await siibApi.get('system/systems')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE DELITO POR ID
     async systemID (id: any) {
      try {
        const { data } = await siibApi.get('system/sistemID/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

 
    async createSys(form: any) {
      try {
        const { data } = await siibApi.post('system/create_sys/' + userLogged, form)
        router.push({ name: 'systemList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async updateSys(form: any) {
      try {
        const { data } = await siibApi.post('system/update_sys/' + userLogged, form)
        router.push({ name: 'systemList' });
        return {
          ok: true,
          message: data.message,
          id: data.id
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ELIMINAR DELITO
    async deleteSys(form: any) {
      try {
        const { data } = await siibApi.post('system/delete_sys/' + userLogged, form)
        router.push({ name: 'systemList' });
        return {
          ok: true,
          message: data.message,
          id: data.id
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

  }

});
