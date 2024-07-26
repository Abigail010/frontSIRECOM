import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useJewelTypeStore = defineStore({
  id: 'jewelType',
  actions: {
    // OBTENER LISTA DE TIPO DE JOYA
    async jewelTypes () {
      try {
        const { data } = await siibApi.get('jewelType/jewelTypes')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER INFORMACION DE TIPO DE JOYA POR ID
    async jewelType (id: any) {
      try {
        const { data } = await siibApi.get('jewelType/jewelType/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR TIPO DE JOYA
    async createJewelType(form: any) {
      try {
        const { data } = await siibApi.post('jewelType/create_jewel_type/' + userLogged, form)
        router.push({ name: 'jewelTypeList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR TIPO DE JOYA
    async updateJewelType(form: any) {
      try {
        const { data } = await siibApi.post('jewelType/update_jewel_type/' + userLogged, form)
        router.push({ name: 'jewelTypeList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR TIPO DE JOYA
    async deleteJewelType(form: any) {
      try {
        const { data } = await siibApi.post('jewelType/delete_jewel_type/' + userLogged, form)
        router.push({ name: 'jewelTypeList' });
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
