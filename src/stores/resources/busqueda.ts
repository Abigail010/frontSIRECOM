import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useSearchStore = defineStore({
  id: 'search_tot',
  actions: {


       //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
       async getInfoB () {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await siibApi.get('search_tot/info_user/' + userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
    // OBTENER LISTA DE DELITOS
    async getUsers () {
      try {
        const { data } = await siibApi.get('search_tot/tot_usuarios/')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    async getVehiculos () {
        try {
          const { data } = await siibApi.get('search_tot/tot_vehiculo/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getFinalizado () {
        try {
          const { data } = await siibApi.get('search_tot/tot_fin/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPendiente () {
        try {
          const { data } = await siibApi.get('search_tot/tot_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPedidos_en() {
        try {
          const { data } = await siibApi.get('search_tot/pedidos_entregados/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },

      async getPedidos_pen() {
        try {
          const { data } = await siibApi.get('search_tot/pedidos_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },


  }

});
