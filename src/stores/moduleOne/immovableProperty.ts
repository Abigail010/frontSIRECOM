import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'
import renameFiles from '@/utils/helpers/renameFiles'

const direccion_url = getDirection()

// const direccion_url = 'http://localhost:3009/'  // LOCAL
// const direccion_url = 'http://165.172.16.33:3009/'  // LOCAL ACCESO REMOTO
// const direccion_url = 'https://edapi.mingobierno.gob.bo/siibapi/'  // PRODUCCION

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useImmovablePropertyStore = defineStore({
  id: 'immovableProperty',
  actions: {
    // OBTEMERO INFORMACION DE LOS FORMULARIOS DEL BIEN INMUEBLE
    // async immovablePropertyForm (id: number) {
    //   try {
    //     const { data } = await siibApi.get('immovableProperty/immovablePropertyForm/' + id)
    //     return data
    //   } catch (error: any) {
    //     const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
    //     return { ok: false, message: message, id: 0}
    //   }
    // },

    // OBTENER INFORMACION DEL BIEN INMUEBLE
    async immovableProperty (id: number) {
      try {
        const { data } = await siibApi.get('immovableProperty/immovableProperty/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN INMUEBLE
    async createImmovableProperty (form: any) {
      try {
        const formData = renameFiles(form, form.formulario_8, 'immovable')
        const { data } = await siibApi.post('immovableProperty/create_immovable_property/' + userLogged, formData, {
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

    // ACTUALIZAR INFORMACION DEL BIEN INMUEBLE
    async updateImmovableProperty (form: any) {
      try {
        // return
        const formData = renameFiles(form, form.formulario_8, 'immovable')
        const { data } = await siibApi.post('immovableProperty/update_immovable_property/' + userLogged, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        // router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // REPORTE DEL BIEN INMUEBLE
    async immovablePropertyReport(id: number) {
      try {
        const response = open(direccion_url+'immovableProperty/immovable_property_report/'+id)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    
    // SUBIR IMAGENES DEL BIEN INMUEBLE
    async uploadImmovablePropertyImage (form: any) {
      try {
        const {
          id_inmueble_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          picture
        } = form
        if(id_inmueble_imagen == ''){
          const formData = new FormData()
          formData.append('id_inmueble_imagen', id_inmueble_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('immovableProperty/upload_immovable_property_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

    // CREAR INFORMACION DEL BIEN INMUEBLE
    async deleteImmovablePropertyImage (form: any) {
      try {
        const { data } = await siibApi.post('immovableProperty/delete_immovable_property_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DEL BIEN INMUEBLE
    async immovablePropertyImages (id: any) {
      try {
        const { data } = await siibApi.get('immovableProperty/immovablePropertyImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'immovableProperty/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexImmovablePropertyReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'immovableProperty/kardex_immovable_property_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    
  }
});
