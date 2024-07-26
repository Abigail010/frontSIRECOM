import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

// const direccion_url = 'http://localhost:3009/'  // LOCAL
// const direccion_url = 'http://165.172.16.33:3009/'  // LOCAL ACCESO REMOTO
// const direccion_url = 'https://edapi.mingobierno.gob.bo/siibapi/'  // PRODUCCION

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useOtherPropertyStore = defineStore({
  id: 'otherProperty',
  actions: {

    // OBTENER INFORMACION DEL BIEN OTROS BIENES
    async otherProperty (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('otherProperty/otherProperty/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR INFORMACION DEL BIEN OTROS BIENES
    async createOtherProperty (form: any) {
      try {
        const mi_formulario={
          id_bien_registro: form.id_bien_registro,
          id_caso: form.id_caso,
          inventarios: form.formulario_1.inventarios,
          fotografias: form.formulario_2.fotografias,
        } as any
        const nombres_fotografias=[]
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)
        console.log(mi_formulario)
       
        //INVENTARIOS
        for (let i = 0; i < mi_formulario.inventarios.length; i++) {
          mi_formulario.inventarios[i].picture_name = mi_formulario.inventarios[i].picture.name
          formData.append('uploaded_image', mi_formulario.inventarios[i].picture)
          console.log(mi_formulario.fotografias[i].picture.name)
          delete mi_formulario.inventarios[i].picture
          delete mi_formulario.inventarios[i].imagen
        }
        //FOTOGRAFIAS
        for (let i = 0; i < mi_formulario.fotografias.length; i++) {
          nombres_fotografias.push(mi_formulario.fotografias[i].picture.name)
          formData.append('uploaded_image', mi_formulario.fotografias[i].picture)
          console.log(mi_formulario.fotografias[i].picture.name)
        }
        
  
        mi_formulario.nombres_fotografias = nombres_fotografias
        delete mi_formulario.fotografias
        
    
        formData.append('formulario', JSON.stringify(mi_formulario))
        const { data } = await siibApi.post('otherProperty/create_other_property/' + userLogged, formData,{
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




    // ACTUALIZAR CODIGO DE ACTA
    async otherPropertyCode (form: any) {
      try {
        await siibApi.post('otherProperty/other_property_code/' + userLogged, form)
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN OTROS BIENES
    async updateOtherProperty (form: any) {
      try {        
      const mi_formulario={
        id_bien_registro: form.id_bien_registro,
        id_caso: form.id_caso,
        inventarios: form.formulario_1.inventarios,
        fotografias: form.formulario_2.fotografias,
        id_imagenes_eliminadas: form.id_imagenes_eliminadas
      } as any

      const nombres_fotografias=[]
      const nombres_fotografias_existentes = []
      const formData = new FormData()
      formData.append('id_bien_registro', form.id_bien_registro)

      //INVENTARIOS
      for (let i = 0; i < mi_formulario.inventarios.length; i++) {
        if (!mi_formulario.inventarios[i].id_otro_bien_imagen) {
         nombres_fotografias.push(mi_formulario.inventarios[i].picture.name)
         formData.append('uploaded_image', mi_formulario.inventarios[i].picture)
         delete mi_formulario.inventarios[i].picture
         delete mi_formulario.inventarios[i].imagen
         }else{
            nombres_fotografias_existentes.push(mi_formulario.inventarios[i].nombre_imagen)
         }

      }
      //FOTOGRAFIAS
        for (let i = 0; i < mi_formulario.fotografias.length; i++) {
          if (!mi_formulario.fotografias[i].id_otro_bien_imagen) {
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
      const { data } = await siibApi.post('otherProperty/update_other_property/' + userLogged, formData,{
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

    // REPORTE DEL BIEN OTROS BIENES
    async otherPropertyReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'otherProperty/other_property_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DE OTROS BIENES
    async uploadOtherPropertyImage (form: any) {
      try {
        const {
          id_otro_bien_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          descripcion,
          identificacion_bien,
          cantidad,
          precio_base,
          avaluo_provisional,
          observaciones,
          picture
        } = form

        if(id_otro_bien_imagen == ''){
          const formData = new FormData()
          formData.append('id_otro_bien_imagen', id_otro_bien_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('descripcion', descripcion)
          formData.append('identificacion_bien', identificacion_bien)
          formData.append('cantidad', cantidad)
          formData.append('precio_base', precio_base)
          formData.append('avaluo_provisional', avaluo_provisional)
          formData.append('observaciones', observaciones)
          formData.append('uploaded_image', picture)
          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('otherProperty/upload_other_property_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

    // CREAR INFORMACION DEL BIEN OTROS BIENES
    async deleteOtherPropertyImage (form: any) {
      try {
        const { data } = await siibApi.post('otherProperty/delete_other_property_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE OTROS BIENES
    async otherPropertyImages (id: any) {
      try {
        const { data } = await siibApi.get('otherProperty/otherPropertyImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'otherProperty/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexOtherPropertyReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'otherProperty/kardex_other_property_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
