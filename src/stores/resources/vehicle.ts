import { defineStore } from 'pinia';
import { router } from '@/router';

import reb from "@/api/RebApi"
import { getDirection } from '@/utils/helpers/direction'
import renameFiles from '@/utils/helpers/renameFiles'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useVehicleStore = defineStore({
  id: 'vehicle',
  actions: {
     // OBTENER INFORMACION DEL BIEN VEHICULO
     async getvehicle () {
      try {
        const { data } = await reb.RebApi.get('vehicle/getvehi_/' )
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
     // OBTENER INFORMACION DEL BIEN VEHICULO
     async getFuerza () {
      try {
        const { data } = await reb.RebApi.get('vehicle/getFuerza/' )
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
    async getProce () {
      try {
        const { data } = await reb.RebApi.get('vehicle/getpro/' )
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DEL BIEN VEHICULO
    async vehicle (id_bien_registro: number) {
      try {
        const { data } = await reb.RebApi.get('vehicle/vehicle/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
      
    async createVehicle (form: any) {
      try {
        const { data } = await reb.RebApi.post('vehicle/create_vehicle/' + userLogged, form);
       // router.push({ name: 'vehiculoList' });
         router.push({ name: 'VehiculoList' });
        return { ok: true, message: data.message };
      } catch (error: any) {
        // Agregar un log para ver la estructura completa del error
        console.log(error);
    
        // Si existe error.response y error.response.data, obtén el mensaje. Si no, muestra 'sin conexion'.
        const message = error.response?.data?.message || 'error: sin conexion';
        
        console.log(message);
        return { ok: false, message: message };
      }
    },

    async getIDv (id: any) {
      try {
        
        const { data } = await reb.RebApi.get('vehicle/vehicle/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN VEHICULO

    async updateVehicle (form: any) {
      try {
        const { data } = await reb.RebApi.post('vehicle/update_vehicle/' + userLogged, form);
       // router.push({ name: 'vehiculoList' });
          router.push({ name: 'VehiculoList' });
        return { ok: true, message: data.message };
      } catch (error: any) {
        // Agregar un log para ver la estructura completa del error
        console.log(error);
    
        // Si existe error.response y error.response.data, obtén el mensaje. Si no, muestra 'sin conexion'.
        const message = error.response?.data?.message || 'error: sin conexion';
        
        console.log(message);
        return { ok: false, message: message };
      }
    },
    
        // ELIMINAR USUARIO
        async deleteVehiculo(form: any) {

          try {
            console.log(form)
            const { data } = await reb.RebApi.post('vehicle/delete_vehicle/' + userLogged, form)
            router.push({ name: 'VehiculoList' });
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
    

    // REPORTE DEL BIEN VEHICULO
    async vehicleReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'vehicle/vehicle_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


   // CREAR INFORMACION DEL BIEN VEHICULO
   async deleteVehicle (form: any) {
    try {
      const { data } = await reb.RebApi.post('vehicle/delete_vehicle/' + userLogged, form)
      return { ok: true, message: data.message }
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }
  },


    // REPORTE DEL KARDEX
    async kardexVehicleReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'vehicle/kardex_vehicle_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
