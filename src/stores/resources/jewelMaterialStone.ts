import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useJewelMaterialStoneStore = defineStore({
  id: 'jewelMaterialStone',
  actions: {

    // OBTENER LISTA DE JOYAS DE MATERIAL PIEDRA
    async jewelMaterialStones () {
      try {
        const { data } = await siibApi.get('jewelMaterialStone/jewelMaterialStones')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER INFORMACION DE JOYAS DE MATERIAL PIEDRA POR ID
    async jewelMaterialStone (id: any) {
      try {
        const { data } = await siibApi.get('jewelMaterialStone/jewelMaterialStone/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR JOYAS DE MATERIAL PIEDRA
    async createJewelMaterialStone(form: any) {
      try {
        const { data } = await siibApi.post('jewelMaterialStone/create_jewel_material_stone/' + userLogged, form)
        router.push({ name: 'jewelMaterialStoneList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR JOYAS DE MATERIAL PIEDRA
    async updateJewelMaterialStone(form: any) {
      try {
        const { data } = await siibApi.post('jewelMaterialStone/update_jewel_material_stone/' + userLogged, form)
        router.push({ name: 'jewelMaterialStoneList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR JOYAS DE MATERIAL PIEDRA
    async deleteJewelMaterialStone(form: any) {
      try {
        const { data } = await siibApi.post('jewelMaterialStone/delete_jewel_material_stone/' + userLogged, form)
        router.push({ name: 'jewelMaterialStoneList' });
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
