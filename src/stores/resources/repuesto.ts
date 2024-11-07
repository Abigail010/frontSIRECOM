import { defineStore } from 'pinia';
import { router } from '@/router';
import reb from "@/api/RebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useRepuestoStore = defineStore({
  id: 'Repuesto',
  actions: {

    // OBTENER LISTA DE DELITOS
    async getRepuestos () {
      try {
        const { data } = await reb.RebApi.get('registro_rep/getRepuestos')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE DELITO POR ID
     async Repuesto (id: any) {
      try {
       
        const { data } = await reb.RebApi.get('registro_rep/Repuesto/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR DELITO
    async createRepuesto(form: any) {
      try {
        const { data } = await reb.RebApi.post('registro_rep/create_Repuesto/' + userLogged, form)
        router.push({ name: 'repuestoList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR DELITO
    async updateRepuesto(form: any) {
      try {
        const { data } = await reb.RebApi.post('registro_rep/update_Repuesto/' + userLogged, form)
        router.push({ name: 'repuestoList' });
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
    async deleteRepuesto(form: any) {
      try {
        const { data } = await reb.RebApi.post('registro_rep/delete_Repuesto/' + userLogged, form)
        router.push({ name: 'repuestoList' });
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
