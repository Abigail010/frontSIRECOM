import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useControlledSubstanceStore = defineStore({
  id: 'controlledSubstance',
  actions: {

    // OBTENER INFORMACION DEL BIEN DINERO Y VALORES
    async controlledSubstance (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('controlledSubstance/controlledSubstance/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN DINERO Y VALORES
    async createControlledSubstance (form: any) {
      try {
        const mi_formulario={
          id_bien_registro: form.id_bien_registro,
          formulario_1: form.formulario_1,
          contenedores:form.formulario_2.contenedores,
          inventarios:form.formulario_3.inventarios,
          fotografias: form.formulario_4.fotografias,
          id_caso: form.id_caso,
        }as any

        const nombres_fotografias=[]
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)
        //INVENTARIOS
        for (let i = 0; i < mi_formulario.inventarios.length; i++) {
          mi_formulario.inventarios[i].picture_name = mi_formulario.inventarios[i].picture.name
          formData.append('uploaded_image', mi_formulario.inventarios[i].picture)
          delete mi_formulario.inventarios[i].picture
          delete mi_formulario.inventarios[i].imagen
        }
        
        //FOTOGRAFIAS
        for (let i = 0; i < mi_formulario.fotografias.length; i++) {
          nombres_fotografias.push(mi_formulario.fotografias[i].picture.name)
          formData.append('uploaded_image', mi_formulario.fotografias[i].picture)
        }
        mi_formulario.nombres_fotografias = nombres_fotografias
        delete mi_formulario.fotografias

        formData.append('formulario', JSON.stringify(mi_formulario))
        const { data } = await siibApi.post('controlledSubstance/create_controlled_substance/' + userLogged, formData,{
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

    // ACTUALIZAR INFORMACION DEL BIEN DINERO Y VALORES
    async updateControlledSubstance (form: any) {
      try {
        const mi_formulario={
          id_bien_registro: form.id_bien_registro,
          formulario_1: form.formulario_1,
          contenedores:form.formulario_2.contenedores,
          inventarios:form.formulario_3.inventarios,
          fotografias: form.formulario_4.fotografias,
          id_caso: form.id_caso,
          id_imagenes_eliminadas: form.id_imagenes_eliminadas
        }as any

        const nombres_fotografias=[]
        const nombres_fotografias_existentes = []
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)

        //INVENTARIOS
        for (let i = 0; i < mi_formulario.inventarios.length; i++) {
          if (!mi_formulario.inventarios[i].id_sustancia_imagen) {
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
            if (!mi_formulario.fotografias[i].id_sustancia_imagen) {
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
        const { data } = await siibApi.post('controlledSubstance/update_controlled_substance/' + userLogged, formData,{
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

    // REPORTE DEL BIEN DINERO Y VALORES
    async controlledSubstanceReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'controlledSubstance/controlled_substance_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DE LA SUSTANCIA CONTROLADA
    async uploadControlledSubstanceImage (form: any) {
      try {
        const {
          id_sustancia_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          descripcion,
          unidad_medida,
          cantidad_envase,
          observaciones,
          picture
        } = form

        if(id_sustancia_imagen == ''){
          const formData = new FormData()
          formData.append('id_sustancia_imagen', id_sustancia_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('descripcion', descripcion)
          formData.append('unidad_medida', unidad_medida)
          formData.append('cantidad_envase', cantidad_envase)
          formData.append('observaciones', observaciones)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('controlledSubstance/upload_controlled_substance_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

    // CREAR INFORMACION DEL BIEN DINERO Y VALORES
    async deleteControlledSubstanceImage (form: any) {
      try {
        const { data } = await siibApi.post('controlledSubstance/delete_controlled_substance_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE SUSTANCIAS CONTROLADAS
    async controlledSubstanceImages (id: any) {
      try {
        const { data } = await siibApi.get('controlledSubstance/controlledSubstanceImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'controlledSubstance/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexControlledSubstanceReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'controlledSubstance/kardex_controlled_substance_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
