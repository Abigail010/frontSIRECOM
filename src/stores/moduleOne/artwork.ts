import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useArtworkStore = defineStore({
  id: 'artwork',
  actions: {

    // OBTENER INFORMACION DEL BIEN OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS
    async artwork (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('artwork/artwork/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS
    async createArtwork (form: any) {
      try {
        const mi_formulario={
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
          obras_piezas: form.formulario_1.obras_piezas,
          fotografias: form.formulario_2.fotografias
        } as any

        const nombres_fotografias=[]
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)
        // FOTOGRAFIAS
        for (let i = 0; i < mi_formulario.fotografias.length; i++) {
          nombres_fotografias.push(mi_formulario.fotografias[i].picture.name)
          formData.append('uploaded_image', mi_formulario.fotografias[i].picture)
        }

        mi_formulario.nombres_fotografias = nombres_fotografias
        delete mi_formulario.fotografias
        formData.append('formulario', JSON.stringify(mi_formulario))
        const { data } = await siibApi.post('artwork/create_artwork/' + userLogged, formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS
    async updateArtwork (form: any) {
      try {
        const mi_formulario={
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
          obras_piezas: form.formulario_1.obras_piezas,
          fotografias: form.formulario_2.fotografias,
          id_imagenes_eliminadas: form.id_imagenes_eliminadas
        } as any
        const nombres_fotografias=[]
        const nombres_fotografias_existentes = []
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)

         for (let i = 0; i < mi_formulario.fotografias.length; i++) {
           if (!mi_formulario.fotografias[i].id_obra_pieza_imagen) {
            nombres_fotografias.push(mi_formulario.fotografias[i].picture.name)
            formData.append('uploaded_image', mi_formulario.fotografias[i].picture)
          }
           else{
             nombres_fotografias_existentes.push(mi_formulario.fotografias[i].nombre_imagen)
           }
           
        }
        mi_formulario.nombres_fotografias = nombres_fotografias
        mi_formulario.nombres_fotografias_existentes = nombres_fotografias_existentes
        delete mi_formulario.fotografias

        formData.append('formulario', JSON.stringify(mi_formulario))
        const { data } = await siibApi.post('artwork/update_artwork/' + userLogged, formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // REPORTE DEL BIEN OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS
    async artworkReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'artwork/artwork_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DE OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS
    async uploadArtworkImage (form: any) {
      try {
        const {
          id_obra_pieza_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          picture
        } = form

        if(id_obra_pieza_imagen == ''){
          const formData = new FormData()
          formData.append('id_obra_pieza_imagen', id_obra_pieza_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('artwork/upload_artwork_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR INFORMACION DEL BIEN OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS
    async deleteArtworkImage (form: any) {
      try {
        const { data } = await siibApi.post('artwork/delete_artwork_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE SUSTANCIAS CONTROLADAS
    async artworkImages (id: any) {
      try {
        const { data } = await siibApi.get('artwork/artworkImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'artwork/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexArtworkReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'artwork/kardex_artwork_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
