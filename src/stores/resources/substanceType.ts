import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useSubstanceTypeStore = defineStore({
  id: 'substanceType',
  actions: {

    // OBTENER LISTA DE SUSTANCIAS
    async substanceTypes () {
      try {
        const { data } = await siibApi.get('substanceType/substanceTypes')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE SUSTANCIAS POR ID
     async substanceType (id: any) {
      try {
        const { data } = await siibApi.get('substanceType/substanceType/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR SUSTANCIA
    async createSubstanceType(form: any) {
      try {
        const { data } = await siibApi.post('substanceType/create_substance_type/' + userLogged, form)
        router.push({ name: 'substanceTypeList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR SUSTANCIA
    async updateSubstanceType(form: any) {
      try {
        const { data } = await siibApi.post('substanceType/update_substance_type/' + userLogged, form)
        router.push({ name: 'substanceTypeList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR SUSTANCIA
    async deleteSubstanceType(form: any) {
      try {
        const { data } = await siibApi.post('substanceType/delete_substance_type/' + userLogged, form)
        router.push({ name: 'substanceTypeList' });
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
