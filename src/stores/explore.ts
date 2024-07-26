import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useExploreStore = defineStore({
  id: 'explore',
  actions: {

    // BUSQUEDA MEDIANTE EL TIPO DE BIEN
    async searchByType(form: any) {
      try {
        const { data } = await siibApi.post('explore/search_by_type/' + userLogged, form)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },






    // OBTENER LISTA DE DELITOS
    async crimes () {
      try {
        const { data } = await siibApi.get('crime/crimes')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE DELITO POR ID
     async crime (id: any) {
      try {
        const { data } = await siibApi.get('crime/crime/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR DELITO
    async createCrime(form: any) {
      try {
        const { data } = await siibApi.post('crime/create_crime/' + userLogged, form)
        router.push({ name: 'crimeList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR DELITO
    async updateCrime(form: any) {
      try {
        const { data } = await siibApi.post('crime/update_crime/' + userLogged, form)
        router.push({ name: 'crimeList' });
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
    async deleteCrime(form: any) {
      try {
        const { data } = await siibApi.post('crime/delete_crime/' + userLogged, form)
        router.push({ name: 'crimeList' });
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
