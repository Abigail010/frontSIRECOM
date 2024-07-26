import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useImmovablePropertyTypeStore = defineStore({
  id: 'immovablePropertyType',
  actions: {

    // OBTENER LISTA DE TIPOS DE INMUEBLES
    async immovablePropertyTypes () {
      try {
        const { data } = await siibApi.get('immovablePropertyType/immovablePropertyTypes')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE TIPO INMUEBLE POR ID
     async immovablePropertyType (id: any) {
      try {
        const { data } = await siibApi.get('immovablePropertyType/immovablePropertyType/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR TIPO
    async createImmovablePropertyType(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyType/create_immovable_property_type/' + userLogged, form)
        router.push({ name: 'immovablePropertyTypeList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR TIPO INMUEBLE
    async updateImmovablePropertyType(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyType/update_immovable_property_type/' + userLogged, form)
        router.push({ name: 'immovablePropertyTypeList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR TIPO DE INMUEBLE
    async deleteImmovablePropertyType(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyType/delete_immovable_property_type/' + userLogged, form)
        router.push({ name: 'immovablePropertyTypeList' });
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
