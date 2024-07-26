import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'
import renameFiles from '@/utils/helpers/renameFiles'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useBoatStore = defineStore({
  id: 'boat',
  actions: {

    // OBTENER INFORMACION DEL BIEN EMBARCACIONES
    async boat (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('boat/boat/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN EMBARCACIONES
    async createBoat (form: any) {
      try {
        const formData = renameFiles(form, form.formulario_4, 'boat')
        const { data } = await siibApi.post('boat/create_boat/' + userLogged, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN EMBARCACIONES
    async updateBoat (form: any) {
      try {
        const formData = renameFiles(form, form.formulario_4, 'boat')
        const { data } = await siibApi.post('boat/update_boat/' + userLogged, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // REPORTE DEL BIEN EMBARCACIONES
    async boatReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'boat/boat_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DE EMBARCACIONES
    async uploadBoatImage (form: any) {
      try {
        const {
          id_embarcacion_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          picture
        } = form

        if(id_embarcacion_imagen == ''){
          const formData = new FormData()
          formData.append('id_embarcacion_imagen', id_embarcacion_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('boat/upload_boat_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR INFORMACION DEL BIEN EMBARCACIONES
    async deleteBoatImage (form: any) {
      try {
        const { data } = await siibApi.post('boat/delete_boat_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE EMBARCACIONES
    async boatImages (id: any) {
      try {
        const { data } = await siibApi.get('boat/boatImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'boat/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexBoatReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'boat/kardex_boat_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
