import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApiImages from "@/api/siibApiImages"
import { getDirection } from '@/utils/helpers/direction'
import renameFiles from '@/utils/helpers/renameFilesExternalRegistration'

const direccion_url = getDirection()

// const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useExternalRegistrationStore = defineStore({
  id: 'externalRegistration',
  actions: {
    // OBTENER LISTA DE DELITOS
    async externalRegistrations (estado: string, tipo: string) {
      try {
        const { data } = await siibApi.get('externalRegistration/filter_external_registration/'+ estado + '/' +tipo)
        // const { data } = await siibApi.get('externalRegistration/list_external_registration')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER INFORMACION DE LA ENTIDAD EXTERNA
    async externalRegistration (id_usuario: number) {
      try {
        const { data } = await siibApi.get('externalRegistration/external_registration/' + id_usuario)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DE LA ENTIDAD EXTERNA
    async declineExternalRegistration (form: any) {
      try {
        const { data } = await siibApi.post('externalRegistration/revition_external_registration', form)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
    

    // BUSCAR INFORMACION DE LA ENTIDAD EXTERNA
    async searchExternalRegistration (form: any) {
        try {
            const {
                cedula_identidad,
                complemento
              } = form
            // const respuesta = await siibApi.get('externalRegistration/searchExternalRegistration', { cedula_identidad, complemento })
            if(cedula_identidad === '1010'){
                const message = 'error: ya esta registrado en el sistema'
                return { ok: true, message: message}
            } else {
                const message = 'succes: sin registro en el sistema'
                return { ok: false, message: message}
            }
        } catch (error: any) {
            const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
            return { ok: false, message: message, id: 0}
        }
      },
    
    // ENVIO DE CODIGO DE CONFIRMACION
		async sendCode (form: any) {
			try {
				const { data } = await siibApi.post('externalRegistration/send_code_verification/', form)
				return data
			} catch (error: any) {
				const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
				return { ok: false, message: message }
			}
		},

    // CREAR INFORMACION DEL BIEN EMBARCACIONES
    async createExternalRegistration (form: any) {
      try {
        const formData = renameFiles(form, form.formulario)
        const { data } = await siibApi.post('externalRegistration/create_external_registration/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return { ok: true, message: data.message}
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN EMBARCACIONES
    async updateExternalRegistration (form: any) {
      try {
        const formData = renameFiles(form, form.formulario_4)
        const { data } = await siibApi.post('boat/update_boat/', formData, {
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
          const { data } = await siibApiImages.post('boat/upload_boat_image/', formData)
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
        const { data } = await siibApi.post('boat/delete_boat_image/', form)
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE POSTERIOR A LA LOGISTICA DE RECEPCION
    async externalRegistrationDocument(id: number) {
      try {
        const response = open(direccion_url+'externalRegistration/get_file/'+id)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
