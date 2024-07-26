import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'
import renameFiles from '@/utils/helpers/renameFiles'


const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useAircraftStore = defineStore({
  id: 'aircraft',
  actions: {

    // OBTENER INFORMACION DE LA AERONAVE
    async aircraft (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('aircraft/aircraft/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DE LA AERONAVE
    async createAircraft (form: any) {
      try {
         
         const mi_formulario = {
          formulario_1: form.formulario_1,
          formulario_2: form.formulario_2,
          formulario_3: form.formulario_3,
          formulario_4: form.formulario_4,
          formulario_5: form.formulario_5,
          formulario_6: form.formulario_6,
          formulario_7: form.formulario_7,
          formulario_8: form.formulario_8,
          formulario_9: form.formulario_9,
          fotografias: form.formulario_10.fotografias,
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
          console.log(mi_formulario);

           const { data } = await siibApi.post('aircraft/create_aircraft/' + userLogged, formData,{
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

    // ACTUALIZAR INFORMACION DE LA AERONAVE
    async updateAircraft (form: any) {
      try {
        const mi_formulario = {
          formulario_1: form.formulario_1,
          formulario_2: form.formulario_2,
          formulario_3: form.formulario_3,
          formulario_4: form.formulario_4,
          formulario_5: form.formulario_5,
          formulario_6: form.formulario_6,
          formulario_7: form.formulario_7,
          formulario_8: form.formulario_8,
          formulario_9: form.formulario_9,
          fotografias: form.formulario_10.fotografias,
          id_caso: form.id_caso,
          id_bien_registro: form.id_bien_registro,
        } as any
       
        
        const nombres_fotografias = []
        const nombres_fotografias_existentes = []
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)

        
          // FOTOGRAFIAS
          for (let i = 0; i < mi_formulario.fotografias.length; i++) {
            if (!mi_formulario.fotografias[i].id_aeronave_imagen) {
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
          //console.log(formData);          
          //return        
        const { data } = await siibApi.post('aircraft/update_aircraft/' + userLogged, formData)
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // REPORTE DE LA AERONAVE
    async aircraftReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'aircraft/aircraft_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INICIO SECTOR IMAGENES
    
    // SUBIR IMAGENES DE LA AERONAVE
    async uploadAircraftImage (form: any) {
      try {
        const {
          id_aeronave_imagen,
          id_bien,
          id_bien_registro,
          nombre_imagen,
          principal,
          picture
        } = form
        if(id_aeronave_imagen == ''){
          const formData = new FormData()
          formData.append('id_aeronave_imagen', id_aeronave_imagen)
          formData.append('id_bien', id_bien)
          formData.append('id_bien_registro', id_bien_registro)
          formData.append('nombre_imagen', nombre_imagen)
          formData.append('principal', principal)
          formData.append('uploaded_image', picture)

          const extension = picture.name.split('.').pop()
          if(extension !== 'png' && extension !== 'PNG' && extension !== 'jpg' && extension !== 'jpeg'){
            alert('error')
            return false
          }
          const { data } = await siibApiImages.post('aircraft/upload_aircraft_image/'+userLogged, formData)
          return { ok: true, message: data.message }
        }else{
          const { data } = await siibApi.post('aircraft/update_record_image/'+userLogged, form)
          return { ok: true, message: data.message }
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },

    // ELIMINAR IMAGEN DE LA AERONAVE
    async deleteAircraftImage (form: any) {
      try {
        const { data } = await siibApi.post('aircraft/delete_aircraft_image/' + userLogged, form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // LISTADO DE IMAGENES DE LA AERONAVE
    async aircraftImages (id: any) {
      try {
        const { data } = await siibApi.get('aircraft/aircraftImages/' + id)
        for (let i = 0; i < data.length; i++) {
          data[i].url = direccion_url+'aircraft/showImage/'+data[i].id_bien_registro+'/'+data[i].nombre_imagen
        }
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // FIN SECTOR IMAGENES

    // OBTIENE LA LISTA DE AVALUOS DIGITALES
    async getDigitalAppraisals() {
      try {
        const { data } = await siibApi.get('/aircraft/digitalAppraisals')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE AVALUOS ANALOGICOS
    async getAnalogAppraisals() {
      try {
        const { data } = await siibApi.get('/aircraft/analogAppraisals')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE DEL KARDEX
    async kardexAircraftReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'aircraft/kardex_aircraft_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
