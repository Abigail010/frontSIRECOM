import { defineStore } from 'pinia';
import { router } from '@/router';
import reb from "@/api/RebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useaccesorioStore = defineStore({
  id: 'accesorio',
  actions: {

    // OBTENER LISTA DE DELITOS
    async accesorios () {
      try {
        const { data } = await reb.RebApi.get('accesorio/getAccesorios')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE DELITO POR ID
     async accesorio (id: any) {
      try {
        console.log(id)
        const { data } = await reb.RebApi.get('accesorio/accesorio/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR DELITO
    async createaccesorio(form: any) {
      try {
        const { data } = await reb.RebApi.post('accesorio/create_Accesorio/' + userLogged, form)
        router.push({ name: 'accesorioList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR DELITO
    async updateaccesorio(form: any) {
      try {
        const { data } = await reb.RebApi.post('accesorio/update_Accesorio/' + userLogged, form)
        router.push({ name: 'accesorioList' });
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
    async deleteaccesorio(form: any) {
      try {
        const { data } = await reb.RebApi.post('accesorio/delete_Accesorio/' + userLogged, form)
        router.push({ name: 'accesorioList' });
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
