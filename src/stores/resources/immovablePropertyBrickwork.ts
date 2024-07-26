import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useImmovablePropertyBrickworkStore = defineStore({
  id: 'immovablePropertyBrickwork',
  actions: {

    // OBTENER LISTA DE JUZGADOS
    async immovablePropertyBrickworks () {
      try {
        const {data } = await siibApi.get('immovablePropertyBrickwork/immovablePropertyBrickworks')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE JUZGADO POR ID
     async immovablePropertyBrickwork (id: any) {
      try {
        const { data } = await siibApi.get('immovablePropertyBrickwork/immovablePropertyBrickwork/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR ACABADO
    async createImmovablePropertyBrickwork(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyBrickwork/create_immovable_property_brickwork/' + userLogged, form)
        router.push({ name: 'immovablePropertyBrickworkList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR JUZGADO
    async updateImmovablePropertyBrickwork(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyBrickwork/update_immovable_property_brickwork/' + userLogged, form)
        router.push({ name: 'immovablePropertyBrickworkList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR ACABADO DE ALBANILERIA
    async deleteImmovablePropertyBrickwork(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyBrickwork/delete_immovable_property_brickwork/' + userLogged, form)
        router.push({ name: 'immovablePropertyBrickworkList' });
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
