import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()
const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useAdministrativeExpenseStore = defineStore({
  id: 'administrativeExpense',
  actions: {

    async administrativeExpenses (id: any) {
      try {
        const { data } = await siibApi.get('administrativeExpense/administrativeExpenses/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async administrativeExpense (id: any) {
      try {
        const { data } = await siibApi.get('administrativeExpense/administrativeExpense/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async createAdministrativeExpense(form: any) {
      try {
        const { data } = await siibApi.post('administrativeExpense/create_administrative_expense/' + userLogged, form)
        // router.push({ name: 'administrativeExpenseList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async updateAdministrativeExpense(form: any) {
      try {
        const { data } = await siibApi.post('administrativeExpense/update_administrative_expense/' + userLogged, form)
        // router.push({ name: 'administrativeExpenseList' });
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

    async deleteAdministrativeExpense(form: any) {
      try {
        const { data } = await siibApi.post('administrativeExpense/delete_administrative_expense/' + userLogged, form)
        router.push({ name: 'administrativeExpenseList' });
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

    async reportAdministrativeExpense(id: any) {
      try {
        const response = open(direccion_url+'administrativeExpense/report_administrative_expense/'+id)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async searchAdministrativeExpense(form: any) {
      try {
        const { data } = await siibApi.post('administrativeExpense/search_administrative_expense/' + userLogged, form)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }

});
