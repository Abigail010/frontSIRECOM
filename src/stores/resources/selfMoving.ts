import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useSelfMovingStore = defineStore({
  id: 'selfMoving',
  actions: {

    // OBTENER INFORMACION DEL BIEN SEMOVIENTES
    async selfMoving (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('selfMoving/selfMoving/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR INFORMACION DEL BIEN SEMOVIENTES
 
    async createSelfMoving (form: any) {
      try {
        const mi_formulario = {
        semovientes: form.formulario_1.semovientes,
        fotografias: form.formulario_2.fotografias,
        id_caso: form.id_caso,
        id_bien_registro: form.id_bien_registro,
      } as any
       

        const nombres_fotografias = []
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
          //console.log(mi_formulario);
          
        const { data } = await siibApi.post('selfMoving/create_self_moving/' + userLogged, formData,{
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

    // ACTUALIZAR INFORMACION DEL BIEN SEMOVIENTES
    async updateSelfMoving (form: any) {
      try {
          const mi_formulario = {
          semovientes: form.formulario_1.semovientes,
          fotografias: form.formulario_2.fotografias,
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
        } as any
       

        const nombres_fotografias = []
        const nombres_fotografias_existentes = []
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)
        //console.log(form);

        for (let i = 0; i < mi_formulario.fotografias.length; i++) {
          if (!mi_formulario.fotografias[i].id_semoviente_imagen) {
            nombres_fotografias.push(mi_formulario.fotografias[i].picture.name)
            formData.append('uploaded_image', mi_formulario.fotografias[i].picture)
            
          }
          else{
            nombres_fotografias_existentes.push(mi_formulario.fotografias[i].imagen2)
          }
          
        }
          
          mi_formulario.nombres_fotografias = nombres_fotografias
          mi_formulario.nombres_fotografias_existentes = nombres_fotografias_existentes
          delete mi_formulario.fotografias   
          //console.log(mi_formulario);
              
          formData.append('formulario', JSON.stringify(mi_formulario))
          
          //return      
        const { data } = await siibApi.post('selfMoving/update_self_moving/' + userLogged, formData)
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // REPORTE DEL BIEN SEMOVIENTES
    async selfMovingReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'selfMoving/self_moving_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DE LA SUSTANCIA CONTROLADA
    async uploadSelfMovingImage (form: any) {
      try {
        const {
          id_semoviente_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          picture
        } = form

        if(id_semoviente_imagen == ''){
          const formData = new FormData()
          formData.append('id_semoviente_imagen', id_semoviente_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('selfMoving/upload_self_moving_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

    // CREAR INFORMACION DEL BIEN DINERO Y VALORES
    async deleteSelfMovingImage (form: any) {
      try {
        const { data } = await siibApi.post('selfMoving/delete_self_moving_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE SUSTANCIAS CONTROLADAS
    async selfMovingImages (id: any) {
      try {
        const { data } = await siibApi.get('selfMoving/selfMovingImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'selfMoving/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexSelfMovingReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'selfMoving/kardex_self_moving_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
