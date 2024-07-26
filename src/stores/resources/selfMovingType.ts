import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useSelfMovingTypeStore = defineStore({
  id: 'selfMovingType',
  actions: {

    // OBTENER LISTA DE SEMOVIENTE CLASE PRECIO BASE
    async selfMovingTypes () {
      try {
        const { data } = await siibApi.get('selfMovingType/selfMovingTypes')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE SEMOVIENTE CLASE PRECIO BASE POR ID
     async selfMovingType (id: any) {
      try {
        const { data } = await siibApi.get('selfMovingType/selfMovingType/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR SEMOVIENTE CLASE PRECIO BASE
    async createSelfMovingType(form: any) {
      try {
        const { data } = await siibApi.post('selfMovingType/create_self_moving_type/' + userLogged, form)
        router.push({ name: 'selfMovingTypeList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR SEMOVIENTE CLASE PRECIO BASE
    async updateSelfMovingType(form: any) {
      try {
        const { data } = await siibApi.post('selfMovingType/update_self_moving_type/' + userLogged, form)
        router.push({ name: 'selfMovingTypeList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR SEMOVIENTE CLASE PRECIO BASE
    async deleteSelfMovingType(form: any) {
      try {
        const { data } = await siibApi.post('selfMovingType/delete_self_moving_type/' + userLogged, form)
        router.push({ name: 'selfMovingTypeList' });
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
