import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useReceptionLogisticsReasonStore = defineStore({
  id: 'receptionLogisticsReason',
  actions: {

    // OBTENER LISTA DE MOTIVOS
    async receptionLogisticsReasons () {
      try {
        const { data } = await siibApi.get('receptionLogisticsReason/receptionLogisticsReasons')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE MOTIVO POR ID
     async receptionLogisticsReason (id: any) {
      try {
        const { data } = await siibApi.get('receptionLogisticsReason/receptionLogisticsReason/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR MOTIVO
    async createReceptionLogisticsReason(form: any) {
      try {
        const { data } = await siibApi.post('receptionLogisticsReason/create_receptionLogisticsReason/' + userLogged, form)
        router.push({ name: 'receptionLogisticsReasonList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR MOTIVO
    async updateReceptionLogisticsReason(form: any) {
      try {
        const { data } = await siibApi.post('receptionLogisticsReason/update_receptionLogisticsReason/' + userLogged, form)
        router.push({ name: 'receptionLogisticsReasonList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR MOTIVO
    async deleteReceptionLogisticsReason(form: any) {
      try {
        const { data } = await siibApi.post('receptionLogisticsReason/delete_receptionLogisticsReason/' + userLogged, form)
        router.push({ name: 'receptionLogisticsReasonList' });
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
