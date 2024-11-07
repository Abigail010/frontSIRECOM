import { defineStore } from 'pinia';
import { router } from '@/router';
import RebApi from "@/api/rebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useMarcasStore = defineStore({
  id: 'Marcas',
  actions: {

    async Marca () {
      try {
        const { data } = await RebApi.get('marca/getMarcas')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async MarcasID (id: any) {
      try {
        //console.log('.....'+ id)
        const { data } = await RebApi.get('marca/Marca/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async createMarcas(form: any) {
      try {
        const { data } = await RebApi.post('marca/create_Marca/' + userLogged, form)
        router.push({ name: 'MarcaList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

   
    async updateMarcas(form: any) {
      try {
        const { data } = await RebApi.post('marca/update_Marca/' + userLogged, form)
        router.push({ name: 'MarcaList' });
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
    async deleteMarcas(form: any) {
      try {
        const { data } = await RebApi.post('marca/delete_Marca/' + userLogged, form)
        router.push({ name: 'MarcaList' });
        return {
          ok: true,
          message: data.message,
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

  }

});
