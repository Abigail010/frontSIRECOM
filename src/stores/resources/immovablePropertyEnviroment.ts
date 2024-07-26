import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useImmovablePropertyEnviromentStore = defineStore({
  id: 'immovablePropertyEnviroment',
  actions: {

    // OBTENER LISTA DE AMBIENTE
    async immovablePropertyEnviroments () {
      try {
        const { data } = await siibApi.get('immovablePropertyEnviroment/immovablePropertyEnviroments')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER INFORMACION DE AMBIENTE POR ID
    async immovablePropertyEnviroment (id: any) {
      try {
        const { data } = await siibApi.get('immovablePropertyEnviroment/immovablePropertyEnviroment/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR AMBIENTE
    async createImmovablePropertyEnviroment(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyEnviroment/create_immovable_property_enviroment/' + userLogged, form)
        router.push({ name: 'immovablePropertyEnviromentList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR AMBIENTE
    async updateImmovablePropertyEnviroment(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyEnviroment/update_immovable_property_enviroment/' + userLogged, form)
        router.push({ name: 'immovablePropertyEnviromentList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR AMBIENTE
    async deleteImmovablePropertyEnviroment(form: any) {
      try {
        const { data } = await siibApi.post('immovablePropertyEnviroment/delete_immovable_property_enviroment/' + userLogged, form)
        router.push({ name: 'immovablePropertyEnviromentList' });
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
