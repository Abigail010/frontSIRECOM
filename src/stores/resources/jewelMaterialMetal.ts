import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useJewelMaterialMetalStore = defineStore({
  id: 'jewelMaterialMetal',
  actions: {

    // OBTENER LISTA DE JOYA DE MATERIAL METAL
    async jewelMaterialMetals () {
      try {
        const { data } = await siibApi.get('jewelMaterialMetal/jewelMaterialMetals')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER INFORMACION DE JOYA DE MATERIAL METAL POR ID
    async jewelMaterialMetal (id: any) {
      try {
        const { data } = await siibApi.get('jewelMaterialMetal/jewelMaterialMetal/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR JOYA DE MATERIAL METAL
    async createJewelMaterialMetal(form: any) {
      try {
        const { data } = await siibApi.post('jewelMaterialMetal/create_jewel_material_metal/' + userLogged, form)
        router.push({ name: 'jewelMaterialMetalList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR JOYA DE MATERIAL METAL
    async updateJewelMaterialMetal(form: any) {
      try {
        const { data } = await siibApi.post('jewelMaterialMetal/update_jewel_material_metal/' + userLogged, form)
        router.push({ name: 'jewelMaterialMetalList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR JOYA DE MATERIAL METAL
    async deleteJewelMaterialMetal(form: any) {
      try {
        const { data } = await siibApi.post('jewelMaterialMetal/delete_jewel_material_metal/' + userLogged, form)
        router.push({ name: 'jewelMaterialMetalList' });
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
