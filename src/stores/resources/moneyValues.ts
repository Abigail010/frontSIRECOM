import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

// const direccion_url = 'http://localhost:3009/'  // LOCAL
// const direccion_url = 'http://165.172.16.33:3009/'  // LOCAL ACCESO REMOTO
// const direccion_url = 'https://edapi.mingobierno.gob.bo/siibapi/'  // PRODUCCION

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useMoneyValuesStore = defineStore({
  id: 'moneyValues',
  actions: {

    // OBTENER INFORMACION DEL BIEN DINERO Y VALORES
    async moneyValue (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('moneyValue/moneyValue/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN DINERO Y VALORES
    async createMoneyValue (form: any) {
      try {
        const { data } = await siibApi.post('moneyValue/create_money_value/' + userLogged, form)
        // router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN DINERO Y VALORES
    async updateMoneyValue (form: any) {
      try {
        const { data } = await siibApi.post('moneyValue/update_money_value/' + userLogged, form)
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // REPORTE DEL BIEN DINERO Y VALORES
    async moneyValueReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'moneyValue/money_value_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE DEL KARDEX
    async kardexMoneyValueReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'moneyValue/kardex_money_value_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
