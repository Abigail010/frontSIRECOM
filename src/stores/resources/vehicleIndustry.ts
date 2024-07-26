import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useVehicleIndustryStore = defineStore({
  id: 'vehicleIndustry',
  actions: {

    // OBTENER LISTA DE INDUSTRIAS
    async vehicleIndustries () {
      try {
        const { data } = await siibApi.get('vehicleIndustry/vehicleIndustries')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE INDUSTRIAS POR ID
     async vehicleIndustry (id: any) {
      try {
        const { data } = await siibApi.get('vehicleIndustry/vehicleIndustry/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR SUSTANCIA
    async createVehicleIndustry(form: any) {
      try {
        const { data } = await siibApi.post('vehicleIndustry/create_vehicle_industry/' + userLogged, form)
        router.push({ name: 'vehicleIndustryList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR INDUSTRIA
    async updateVehicleIndustry(form: any) {
      try {
        const { data } = await siibApi.post('vehicleIndustry/update_vehicle_industry/' + userLogged, form)
        router.push({ name: 'vehicleIndustryList' });
        return {
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR SUSTANCIA
    async deleteVehicleIndustry(form: any) {
      try {
        const { data } = await siibApi.post('vehicleIndustry/delete_vehicle_industry/' + userLogged, form)
        router.push({ name: 'vehicleIndustryList' });
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
