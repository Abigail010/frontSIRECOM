import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useElectronicStore = defineStore({
  id: 'electronic',
  actions: {

    // OBTENER INFORMACION DEL BIEN EQUIPOS ELECTRONICOS
    async electronic (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('electronic/electronic/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN EQUIPOS ELECTRONICOS
    async createElectronic (form: any) {
      try {         
        const mi_formulario = {
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
          tipo_equipo_electronico: form.tipo_equipo_electronico,
          celular: form.celular,
          computadora: form.computadora,
          equipamiento: form.equipamiento,
          imagenes: form.imagenes
        } as any

        const nombres_fotografias = []
        const formData = new FormData()
        formData.append('id_bien_registro', mi_formulario.id_bien_registro)
        //FOTOGRAFIAS
        for (let i = 0; i < mi_formulario.imagenes.length; i++) {
          nombres_fotografias.push(mi_formulario.imagenes[i].picture.name)
          formData.append('uploaded_image', mi_formulario.imagenes[i].picture)
        }
        //console.log(formData);
        mi_formulario.nombres_fotografias = nombres_fotografias
        delete mi_formulario.imagenes
        formData.append('formulario', JSON.stringify(mi_formulario))
        
        const { data } = await siibApi.post('electronic/create_electronic/' + userLogged, formData, {
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

    // ACTUALIZAR INFORMACION DEL BIEN EQUIPOS ELECTRONICOS
    async updateElectronic (form: any) {
      try {
        const mi_formulario = {
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
          tipo_equipo_electronico: form.tipo_equipo_electronico,
          celular: form.celular,
          computadora: form.computadora,
          equipamiento: form.equipamiento,
          imagenes: form.imagenes,
          id_imagenes_eliminadas: form.id_imagenes_eliminadas
        } as any
        // console.log(mi_formulario);
        // return
        const nombres_fotografias = []
        const formData = new FormData()
        formData.append('id_bien_registro', mi_formulario.id_bien_registro)

        //FOTOGRAFIAS
        
        for (let i = 0; i < mi_formulario.imagenes.length; i++) {
          if (mi_formulario.imagenes[i].id_ee_imagen == '') {
            nombres_fotografias.push(mi_formulario.imagenes[i].picture.name)
            formData.append('uploaded_image', mi_formulario.imagenes[i].picture)
          }
          
        }
        mi_formulario.nombres_fotografias = nombres_fotografias
        delete mi_formulario.imagenes
        formData.append('formulario', JSON.stringify(mi_formulario))  

        const { data } = await siibApi.post('electronic/update_electronic/' + userLogged, formData, {
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

    // REPORTE DEL BIEN EQUIPOS ELECTRONICOS
    async electronicReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'electronic/electronic_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    // SUBIR IMAGENES DE EQUIPOS ELECTRONICOS
    async uploadElectronicImage (form: any) {
      try {
        const {
          id_ee_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          picture
        } = form

        if(id_ee_imagen == ''){
          const formData = new FormData()
          formData.append('id_ee_imagen', id_ee_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('electronic/upload_electronic_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR INFORMACION DEL BIEN EQUIPOS ELECTRONICOS
    async deleteElectronicImage (form: any) {
      try {
        const { data } = await siibApi.post('electronic/delete_electronic_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE EQUIPOS ELECTRONICOS
    async electronicImages (id: any) {
      try {
        const { data } = await siibApi.get('electronic/electronicImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'electronic/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

    // REPORTE DEL KARDEX
    async kardexElectronicReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'electronic/kardex_electronic_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
