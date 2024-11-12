import { defineStore } from 'pinia';
import { router } from '@/router';
import rebApi from "@/api/rebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useProcedenciasStore = defineStore({
  id: 'Procedencias',
  actions: {

    async Procedencia () {
      try {
        const { data } = await rebApi.get('proce/getProcedencias')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async ProcedenciasID (id: any) {
      try {
        const { data } = await rebApi.get('proce/Procedencia/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async createProcedencias(form: any) {
      try {
        const { data } = await rebApi.post('proce/create_Procedencia/' + userLogged, form)
        router.push({ name: 'proceList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

   
    async updateProcedencias(form: any) {
      try {
        const { data } = await rebApi.post('proce/update_Procedencia/' + userLogged, form)
        router.push({ name: 'proceList' });
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
    async deleteProcedencias(form: any) {
      try {
        const { data } = await rebApi.post('proce/delete_Procedencia/' + userLogged, form)
        router.push({ name: 'proceList' });
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
