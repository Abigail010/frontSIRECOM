import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useVehicleMileageStore = defineStore({
  id: 'vehicleMileage',
  actions: {

    // OBTENER LISTA DE SUSTANCIAS
    async vehicleMileages () {
      try {
        const { data } = await siibApi.get('vehicleMileage/vehicleMileages')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     // OBTENER INFORMACION DE SUSTANCIAS POR ID
     async vehicleMileage (id: any) {
      try {
        const { data } = await siibApi.get('vehicleMileage/vehicleMileage/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR KILOMETRAJE
    async createVehicleMileage(form: any) {
      try {
        const { data } = await siibApi.post('vehicleMileage/create_vehicle_mileage/' + userLogged, form)
        router.push({ name: 'vehicleMileageList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR KILOMETRAJE
    async updateVehicleMileage(form: any) {
      try {
        const { data } = await siibApi.post('vehicleMileage/update_vehicle_mileage/' + userLogged, form)
        router.push({ name: 'vehicleMileageList' });
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
    async deleteVehicleMileage(form: any) {
      try {
        const { data } = await siibApi.post('vehicleMileage/delete_vehicle_mileage/' + userLogged, form)
        router.push({ name: 'vehicleMileageList' });
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
