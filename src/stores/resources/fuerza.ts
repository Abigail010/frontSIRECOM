import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useFuerzasStore = defineStore({
  id: 'Fuerzas',
  actions: {

    async fuerza () {
      try {
        const { data } = await siibApi.get('fuerza/getFuerzas')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async FuerzasID (id: any) {
      try {
        const { data } = await siibApi.get('fuerza/Fuerza/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async createFuerzas(form: any) {
      try {
        const { data } = await siibApi.post('fuerza/create_Fuerzas/' + userLogged, form)
        router.push({ name: 'fuerzasList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

   
    async updateFuerzas(form: any) {
      try {
        const { data } = await siibApi.post('fuerza/update_Fuerzas/' + userLogged, form)
        router.push({ name: 'fuerzasList' });
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
    async deleteFuerzas(form: any) {
      try {
        const { data } = await siibApi.post('fuerza/delete_Fuerzas/' + userLogged, form)
        router.push({ name: 'fuerzasList' });
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
