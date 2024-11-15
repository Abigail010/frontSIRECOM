import { defineStore } from 'pinia';
import { router } from '@/router';
import sirecomApi from "@/api/sirecomApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useTallerStore = defineStore({
  id: 'taller',
  actions: {

    // OBTENER LISTA DE DEPOSITO
    async tallers () {
      try {
        const { data } = await sirecomApi.get('tall/tallers')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async tallersD () {
      try {
        const { data } = await sirecomApi.get('tall/tallersID/'+ userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
      // OBTENER INFORMACION DE DEPOSITO POR ID
      async taller_id (id_taller: any) {
        try {          
          const { data } = await sirecomApi.get('tall/taller_id/' + id_taller)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },

          // CREAR DEPOSITO
    async createTaller(form: any) {
      try {
        const { data } = await sirecomApi.post('tall/create_taller/' + userLogged, form)
        router.push({ name: 'tallerList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  // ACTUALIZAR DEPOSITO
  async updateTaller(form: any) {
    try {
      const { data } = await sirecomApi.post('tall/update_taller/' + userLogged, form)
      router.push({ name: 'tallerList' });
      return {
        ok: true,
        message: data.message
      }
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }
  },
  async updateTallerU(form: any) {
    try {
      const { data } = await sirecomApi.post('tall/update_taller/' + userLogged, form)
      //router.push({ name: 'tallerList' });
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
   async deleteTaller(form: any) {
    try {
      const { data } = await sirecomApi.post('tall/delete_taller/' + userLogged, form)
      router.push({ name: 'tallerList' });
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
