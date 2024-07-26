import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useDocumentaryReviewObservationStore = defineStore({
  id: 'documentaryReviewObservation',
  actions: {

    // OBTENER LISTA DE OBSERVACIONES
    async documentaryReviewObservations () {
      try {
        const { data } = await siibApi.get('documentaryReviewObservation/documentaryReviewObservations')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE OBSERVACIONES POR ID
     async documentaryReviewObservation (id: any) {
      try {
        const { data } = await siibApi.get('documentaryReviewObservation/documentaryReviewObservation/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR OBSERVACION
    async createDocumentaryReviewObservation(form: any) {
      try {
        const { data } = await siibApi.post('documentaryReviewObservation/create_documentary_review_observation/' + userLogged, form)
        router.push({ name: 'documentaryReviewObservationList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR OBSERVACION
    async updateDocumentaryReviewObservation(form: any) {
      try {
        const { data } = await siibApi.post('documentaryReviewObservation/update_documentary_review_observation/' + userLogged, form)
        router.push({ name: 'documentaryReviewObservationList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR OBSERVACION
    async deleteDocumentaryReviewObservation(form: any) {
      try {
        const { data } = await siibApi.post('documentaryReviewObservation/delete_documentary_review_observation/' + userLogged, form)
        router.push({ name: 'documentaryReviewObservationList' });
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
