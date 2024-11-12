import { defineStore } from 'pinia';
import { router } from '@/router';
import rebApi from "@/api/rebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useFuerzasStore = defineStore({
  id: 'Fuerzas',
  actions: {

    async fuerza () {
      try {
        const { data } = await rebApi.get('fuerza/getFuerzas')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async FuerzasID (id: any) {
      try {
        const { data } = await rebApi.get('fuerza/Fuerza/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async createFuerzas(form: any) {
      try {
      
        const { data } = await rebApi.post('fuerza/create_Fuerza/' + userLogged, form)
      
        router.push({ name: 'FuerzasList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

   
    async updateFuerzas(form: any) {
      try {
        const { data } = await rebApi.post('fuerza/update_Fuerza/' + userLogged, form)
        router.push({ name: 'FuerzasList' });
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
        const { data } = await rebApi.post('fuerza/delete_Fuerza/' + userLogged, form)
        router.push({ name: 'FuerzasList' });
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
