import { defineStore } from 'pinia';
import { router } from '@/router';
import reb from "@/api/RebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useManStore = defineStore({
  id: 'tipo_man',
  actions: {

    
    async Mantems () {
      try {
        const { data } = await reb.RebApi.get('tipo_man/tipo_man')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE DELITO POR ID
     async MantemID (id: any) {
      try {
        const { data } = await reb.RebApi.get('tipo_man/tipo_manID/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

 
    async createMan(form: any) {
      try {
        const { data } = await reb.RebApi.post('tipo_man/create_Man/' + userLogged, form)
        router.push({ name: 'tipo_manList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async updateMan(form: any) {
      try {
        const { data } = await reb.RebApi.post('tipo_man/update_Man/' + userLogged, form)
        router.push({ name: 'tipo_manList' });
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
    async deleteMan(form: any) {
      try {
        const { data } = await reb.RebApi.post('tipo_man/delete_Man/' + userLogged, form)
        router.push({ name: 'tipo_manList' });
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
