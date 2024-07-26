import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useDepositStore = defineStore({
  id: 'deposit',
  actions: {

    // OBTENER LISTA DE DEPOSITO
    async deposits () {
      try {
        const { data } = await siibApi.get('deposit/deposits')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE DEPOSITO POR ID
     async deposit (id: any) {
      try {
        const { data } = await siibApi.get('deposit/deposit/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR DEPOSITO
    async createDeposit(form: any) {
      try {
        const { data } = await siibApi.post('deposit/create_deposit/' + userLogged, form)
        router.push({ name: 'depositList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR DEPOSITO
    async updateDeposit(form: any) {
      try {
        const { data } = await siibApi.post('deposit/update_deposit/' + userLogged, form)
        router.push({ name: 'depositList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR DEPOSITO
    async deleteDeposit(form: any) {
      try {
        const { data } = await siibApi.post('deposit/delete_deposit/' + userLogged, form)
        router.push({ name: 'depositList' });
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
