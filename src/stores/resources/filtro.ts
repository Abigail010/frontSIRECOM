import { defineStore } from 'pinia';
import { router } from '@/router';
import sirecomApi from "@/api/sirecomApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const usefilterStore = defineStore({
  id: 'filter',
  actions: {
 // OBTENER LISTA DE DELITOS
    async repuestos () {
      try {
        const { data } = await sirecomApi.get('repuestos/geter')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    // OBTENER LISTA DE DELITOS
    async filters () {
      try {
        const { data } = await sirecomApi.get('repuestos/filter')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
      // OBTENER LISTA DE DELITOS
      async clase () {
        try {
          const { data } = await sirecomApi.get('repuestos/clase')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
       // OBTENER LISTA DE DELITOS
       async Unidad () {
        try {
          const { data } = await sirecomApi.get('repuestos/unidad')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
  // OBTENER LISTA DE DELITOS
  async tipo () {
    try {
      const { data } = await sirecomApi.get('repuestos/tipo')
      return data
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }
  },
    // OBTENER LISTA DE DELITOS
    async motor () {
        try {
          const { data } = await sirecomApi.get('repuestos/tipo_mot')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
    // OBTENER LISTA DE DELITOS
    async marcas () {
        try {
          const { data } = await sirecomApi.get('repuestos/marca')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
     // OBTENER INFORMACION DE DELITO POR ID
     async filter (id: any) {
      try {
       
        const { data } = await sirecomApi.get('repuestos/filter_id/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR DELITO
    async createfilter(form: any) {
      try {
        
        const { data } = await sirecomApi.post('repuestos/create_filter/' + userLogged, form)
        router.push({ name: 'filtroList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR DELITO
    async updatefilter(form: any) {
      try {
        const { data } = await sirecomApi.post('repuestos/update_filter/' + userLogged, form)
        router.push({ name: 'filtroList' });
        return {
          ok: true,
          message: data.message,
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ELIMINAR DELITO
    async deletefilter(form: any) {
      try {
        const { data } = await sirecomApi.post('repuestos/delete_filter/' + userLogged, form)
        router.push({ name: 'filtroList' });
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
