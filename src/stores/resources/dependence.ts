import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useDependenceStore = defineStore({
  id: 'dependence',
  actions: {

    // OBTENER LISTA DE DEPENDENCIAS
    async dependencies () {
      try {
        const { data } = await siibApi.get('dependence/dependencies')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE DEPENDENCIA POR ID
     async dependence (id: any) {
      try {
        const { data } = await siibApi.get('dependence/dependence/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR DEPENDENCIA
    async createDependence(form: any) {
      try {
        const { data } = await siibApi.post('dependence/create_dependence/' + userLogged, form)
        router.push({ name: 'dependenceList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR DEPENDENCIA
    async updateDependence(form: any) {
      try {
        const { data } = await siibApi.post('dependence/update_dependence/' + userLogged, form)
        router.push({ name: 'dependenceList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR DEPENDENCIA
    async deleteDependence(form: any) {
      try {
        const { data } = await siibApi.post('dependence/delete_dependence/' + userLogged, form)
        router.push({ name: 'dependenceList' });
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
