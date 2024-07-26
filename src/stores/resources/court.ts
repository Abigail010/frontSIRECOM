import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useCourtStore = defineStore({
  id: 'court',
  actions: {

    // OBTENER LISTA DE JUZGADOS
    async courts () {
      try {
        const {data } = await siibApi.get('court/courts')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE JUZGADO POR ID
     async court (id: any) {
      try {
        const { data } = await siibApi.get('court/court/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR JUZGADO
    async createCourt(form: any) {
      try {
        const { data } = await siibApi.post('court/create_court/' + userLogged, form)
        router.push({ name: 'courtList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR JUZGADO
    async updateCourt(form: any) {
      try {
        const { data } = await siibApi.post('court/update_court/' + userLogged, form)
        router.push({ name: 'courtList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR JUZGADO
    async deleteCourt(form: any) {
      try {
        const { data } = await siibApi.post('court/delete_court/' + userLogged, form)
        router.push({ name: 'courtList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }

});
