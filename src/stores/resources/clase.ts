import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useClasesStore = defineStore({
  id: 'Clases',
  actions: {

    async Clase () {
      try {
        const { data } = await siibApi.get('clase/getClases')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async ClasesID (id_clase: any) {
      try {
        const { data } = await siibApi.get('clase/Clase/' + id_clase)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async createClases(form: any) {
      try {
        const { data } = await siibApi.post('clase/create_Clases/' + userLogged, form)
        router.push({ name: 'ClasesList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

   
    async updateClases(form: any) {
      try {
        const { data } = await siibApi.post('Clase/update_Clases/' + userLogged, form)
        router.push({ name: 'ClasesList' });
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
    async deleteClases(form: any) {
      try {
        const { data } = await siibApi.post('clase/delete_Clases/' + userLogged, form)
        router.push({ name: 'ClasesList' });
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
