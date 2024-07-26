import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useSubstanceContainerStore = defineStore({
  id: 'substanceContainer',
  actions: {

    // OBTENER LISTA DE CONTENEDOR DE SUSTANCIAS
    async substanceContainers () {
      try {
        const { data } = await siibApi.get('substanceContainer/substanceContainers')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE CONTENEDOR DE SUSTANCIAS POR ID
     async substanceContainer (id: any) {
      try {
        const { data } = await siibApi.get('substanceContainer/substanceContainer/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR CONTENEDOR DE SUSTANCIAS
    async createSubstanceContainer(form: any) {
      try {
        const { data } = await siibApi.post('substanceContainer/create_substance_container/' + userLogged, form)
        router.push({ name: 'substanceContainerList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR CONTENEDOR DE SUSTANCIAS
    async updateSubstanceContainer(form: any) {
      try {
        const { data } = await siibApi.post('substanceContainer/update_substance_container/' + userLogged, form)
        router.push({ name: 'substanceContainerList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR CONTENEDOR DE SUSTANCIAS
    async deleteSubstanceContainer(form: any) {
      try {
        const { data } = await siibApi.post('substanceContainer/delete_substance_container/' + userLogged, form)
        router.push({ name: 'substanceContainerList' });
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
