import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useJewelStore = defineStore({
  id: 'jewel',
  actions: {

    // OBTENER INFORMACION DEL BIEN JOYAS
    async jewel (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('jewel/jewel/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN JOYAS
    async createJewel (form: any) {
      try {
        //console.log(form)
        const mi_formulario = {
          joyas: form.formulario_1.joyas,
          fotografias: form.formulario_2.fotografias,
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
        } as any
        //console.log(mi_formulario)
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
          //return
          
        const { data } = await siibApi.post('jewel/create_jewel/' + userLogged, formData,{
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

    // ACTUALIZAR INFORMACION DEL BIEN JOYAS
    async updateJewel (form: any) {
      try {
        const mi_formulario = {
          joyas: form.formulario_1.joyas,
          fotografias: form.formulario_2.fotografias,
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
      } as any
     

      const nombres_fotografias = []
      const nombres_fotografias_existentes = []
      const formData = new FormData()
      formData.append('id_bien_registro', form.id_bien_registro)
      //console.log(mi_formulario);

      for (let i = 0; i < mi_formulario.fotografias.length; i++) {
        if (!mi_formulario.fotografias[i].id_joya_imagen) {
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
        const { data } = await siibApi.post('jewel/update_jewel/' + userLogged, formData,{
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

    // REPORTE DEL BIEN JOYAS
    async jewelReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'jewel/jewel_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DE JOYAS
    async uploadJewelImage (form: any) {
      try {
        const {
          id_joya_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          picture
        } = form

        if(id_joya_imagen == ''){
          const formData = new FormData()
          formData.append('id_joya_imagen', id_joya_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('jewel/upload_jewel_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ELIMINAR IMAGEN DEL BIEN JOYAS
    async deleteJewelImage (form: any) {
      try {
        const { data } = await siibApi.post('jewel/delete_jewel_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DEL BIEN JOYAS
    async jewelImages (id: any) {
      try {
        const { data } = await siibApi.get('jewel/jewelImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'jewel/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexJewelReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'jewel/kardex_jewel_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
