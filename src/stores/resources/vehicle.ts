import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
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
        const { data } = await siibApi.get('vehicle/getvehi_/' )
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
     // OBTENER INFORMACION DEL BIEN VEHICULO
     async getFuerza () {
      try {
        const { data } = await siibApi.get('vehicle/getFuerza/' )
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
    async getProce () {
      try {
        const { data } = await siibApi.get('vehicle/getpro/' )
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DEL BIEN VEHICULO
    async vehicle (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('vehicle/vehicle/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
        // CREAR USUARIO
       /* async createUser(form: any) {
          try {
            const { data } = await siibApi.post('user/create_user/' + userLogged, form)
            router.push({ name: 'userList' });
            return { ok: true, message: data.message }
          } catch (error: any) {
            const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
            return { ok: false, message: message }
          }
        },*/

    // CREAR INFORMACION DEL BIEN VEHICULO
  /*  async createVehicle (form: any) {
      try {
        const { data } = await siibApi.post(`vehicle/create_vehicle/${userLogged}`, form);
        router.push({ name: 'vehiculoList' });
        return { ok: true, message: data.message };
      } catch (error: any) {
        // Check if error has a response and data property
        const message = error?.response?.data?.message || 'error: sin conexion';
        return { ok: false, message: message, id: 0 };
      }
    },*/
    async createVehicle (form: any) {
      try {
        const { data } = await siibApi.post('vehicle/create_vehicle/' + userLogged, form);
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
        
        const { data } = await siibApi.get('vehicle/vehicle/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN VEHICULO

    async updateVehicle (form: any) {
      try {
        const { data } = await siibApi.post('vehicle/update_vehicle/' + userLogged, form);
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
            const { data } = await siibApi.post('vehicle/delete_vehicle/' + userLogged, form)
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

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DEL VEHICULO
    async uploadVehicleImage (form: any) {
      try {
        const {
          id_vehiculo_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          picture
        } = form

        if(id_vehiculo_imagen == ''){
          if(picture){
            const formData = new FormData()
            formData.append('id_vehiculo_imagen', id_vehiculo_imagen)
            formData.append('id_bien', id_bien)
            formData.append('id_bien_registro', id_bien_registro)
            formData.append('nombre_imagen', nombre_imagen)
            formData.append('uploaded_image', picture)
            const extension = picture.name.split('.').pop()
            if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
              alert('error')
              return false
            }
            const { data } = await siibApiImages.post('vehicle/upload_vehicle_image/'+userLogged, formData)
            return { ok: true, message: data.message }
          }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

   // CREAR INFORMACION DEL BIEN VEHICULO
   async deleteVehicle (form: any) {
    try {
      const { data } = await siibApi.post('vehicle/delete_vehicle/' + userLogged, form)
      return { ok: true, message: data.message }
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }
  },


    // CREAR INFORMACION DEL BIEN VEHICULO
    async deleteVehicleImage (form: any) {
      try {
        const { data } = await siibApi.post('vehicle/delete_vehicle_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE VEHICULO
    async vehicleImages (id: any) {
      try {
        const { data } = await siibApi.get('vehicle/vehicleImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'vehicle/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

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
