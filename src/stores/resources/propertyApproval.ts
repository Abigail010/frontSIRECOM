import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
export const usePropertyApprovalStore = defineStore({
  id: 'propertyApproval',
  actions: {
    // OBTENER LISTA DE INVENTARIOS FINALIZADOS DE BIENES
    async propertyApprovals () {
      try {
        const { data } = await siibApi.get('propertyApproval/propertyApprovals/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // APROBAR BIEN
    async approveProperty(form: any) {
      try {
        const { data } = await siibApi.post('propertyApproval/approveProperty/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

  }
});
