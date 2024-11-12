import { defineStore } from 'pinia';
import { router } from '@/router';
import rebApi from "@/api/rebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useServiceStore = defineStore({
  id: 'service',
  actions: {

    async servicios () {
      try {
        const { data } = await rebApi.get('servicios/getServices')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async serviceID (id: any) {
      try {
        const { data } = await rebApi.get('servicios/service/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async createService(form: any) {
      try {
        const { data } = await rebApi.post('servicios/create_service/' + userLogged, form)
        router.push({ name: 'serviciosList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

   
    async updateService(form: any) {
      try {
        const { data } = await rebApi.post('servicios/update_service/' + userLogged, form)
        router.push({ name: 'serviciosList' });
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
    async deleteService(form: any) {
      try {
        const { data } = await rebApi.post('servicios/delete_service/' + userLogged, form)
        router.push({ name: 'serviciosList' });
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
