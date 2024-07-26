import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

// const direccion_url = 'http://localhost:3009/'  // LOCAL
// const direccion_url = 'http://165.172.16.33:3009/'  // LOCAL ACCESO REMOTO
// const direccion_url = 'https://edapi.mingobierno.gob.bo/siibapi/'  // PRODUCCION

export const usePropertyStore = defineStore({
  id: 'property',
  actions: {
    async propertyForm (id: number) {
      try {
        const { data } = await siibApi.get('property/propertyForm/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DEL BIEN VEHICULO
    async property (id: number) {
      try {
        const { data } = await siibApi.get('property/property/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DEL BIEN VEHICULO
    async propertyImages (id: any) {
      try {
        // const { data } = await siibApi.get('property/propertyImages/' + id, {responseType:'blob'})
        // return { data }

        const { data } = await siibApi.get('property/propertyImages/' + id)
        // console.log(data);
        if(data){
          data.url = direccion_url+'property/showImage/'+data.id_bien_registro+'/'
          data.frente = (data.frente) ? data.url + data.frente : null
          data.lateral_izquierdo = (data.lateral_izquierdo) ? data.url + data.lateral_izquierdo : null
          data.lateral_derecho = (data.lateral_derecho) ? data.url + data.lateral_derecho : null
          data.atras = (data.atras) ? data.url + data.atras : null
          data.angulo = (data.angulo) ? data.url + data.angulo : null
        }
        
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DEL BIEN VEHICULO
    async propertyAllImage (id: any, nameFile: any) {
      try {
        const { data } = await siibApi.get(direccion_url+'property/obtenerImagen/' + id + '/' + nameFile)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION GENERAL DEL CASO
    async createProperty (form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('property/create_property/' + userLogged, form)
        // console.log(data)
        // router.push({ name: 'documentaryReviewList' });
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // IMAGENES DEL BIEN VEHICULO
    async uploadPropertyImage (form: any) {
      try {
        // console.log(form.picture);
        
        const { id_bien, id_bien_registro, nombre_imagen, picture } = form
        const formData = new FormData()
        formData.append('id_bien', id_bien)
        formData.append('id_bien_registro', id_bien_registro)
        formData.append('nombre_imagen', nombre_imagen)
        formData.append('uploaded_image', picture)
        // console.log(picture);

        const extension = picture.name.split('.').pop()
        if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
          alert('error')
          return false
        }
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApiImages.post('property/upload_property_image/'+userLogged, formData)
        // router.push({ name: 'documentaryReviewList' });
        router.push({ name: 'image', params: { id_bien, id_bien_registro  }})
        // llamamos a la funcion que obtiene datos
        
        // console.log('info de back', data);
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

    async propertyReport(id: number) {
      try {
        const response = open(direccion_url+'property/property_report/' + id)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE DEL KARDEX
    async kardexPropertyReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'property/kardex_property_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
