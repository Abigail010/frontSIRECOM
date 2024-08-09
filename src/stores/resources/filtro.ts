import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const usefilterStore = defineStore({
  id: 'filter',
  actions: {

    // OBTENER LISTA DE DELITOS
    async filters () {
      try {
        const { data } = await siibApi.get('repuestos/filter')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
      // OBTENER LISTA DE DELITOS
      async clase () {
        try {
          const { data } = await siibApi.get('repuestos/clase')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
  // OBTENER LISTA DE DELITOS
  async tipo () {
    try {
      const { data } = await siibApi.get('repuestos/tipo')
      return data
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }
  },
    // OBTENER LISTA DE DELITOS
    async motor () {
        try {
          const { data } = await siibApi.get('repuestos/tipo_mot')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
    // OBTENER LISTA DE DELITOS
    async marcas () {
        try {
          const { data } = await siibApi.get('repuestos/marca')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
     // OBTENER INFORMACION DE DELITO POR ID
     async filter (id: any) {
      try {
        console.log(id)
        const { data } = await siibApi.get('repuestos/filter_id/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR DELITO
    async createfilter(form: any) {
      try {
        const { data } = await siibApi.post('repuestos/create_filter/' + userLogged, form)
        router.push({ name: 'filterList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR DELITO
    async updatefilter(form: any) {
      try {
        const { data } = await siibApi.post('repuestos/update_filter/' + userLogged, form)
        router.push({ name: 'filterList' });
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
    async deletefilter(form: any) {
      try {
        const { data } = await siibApi.post('repuestos/delete_filter/' + userLogged, form)
        router.push({ name: 'filterList' });
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
