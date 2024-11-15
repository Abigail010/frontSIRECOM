import { defineStore } from 'pinia';
import { router } from '@/router';
import sirecomApi from "@/api/sirecomApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useTiposStore = defineStore({
  id: 'Tipos',
  actions: {

    async Tipo () {
      try {
        const { data } = await sirecomApi.get('tipo_v/getTipos')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async TiposID (id: any) {
      try {
        const { data } = await sirecomApi.get('tipo_v/Tipo/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async createTipos(form: any) {
      try {
        const { data } = await sirecomApi.post('tipo_v/create_Tipo/' + userLogged, form)
        router.push({ name: 'TipoList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

   
    async updateTipos(form: any) {
      try {
        const { data } = await sirecomApi.post('tipo_v/update_Tipo/' + userLogged, form)
        router.push({ name: 'TipoList' });
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
    async deleteTipos(form: any) {
      try {
        const { data } = await sirecomApi.post('tipo_v/delete_Tipo/' + userLogged, form)
        router.push({ name: 'TipoList' });
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
