import { defineStore } from 'pinia';
import { router } from '@/router';
import { getDirection } from '@/utils/helpers/direction'
import siibApi from "@/api/siibApi"
import siibApifiles from '@/api/siibApiFiles';

const direccion_url = getDirection()
const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useDocumentaryReviewStore = defineStore({
  id: 'documentaryReview',
  actions: {

    //  OBTENER LISTA DE REVISIONES DOCUMENTALES POR BIEN REGISTRO
    async getDocumentaryReviewsByPropertyId (id: any) {
      try {
        const { data } = await siibApi.get('documentaryReview/documentaryReviewsByPropertyId/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREA LA DOCUMENTACION DE LA REVISION DOCUMENTAL
    async createDocumentaryReview (form:any) {
      try {
        const formData = new FormData()
        for (let i = 0; i < form.requerimientos.length; i++) {
          const requerimiento = form.requerimientos[i]
          const nombre_documentos = []
          if(requerimiento.presenta_documentacion == 'SI'){
            for (let j = 0; j < requerimiento.documento.length; j++) {
              const documento = requerimiento.documento[j]
              const tipo = documento.type.split('/')
              const nombre_archivo = requerimiento.id_bien_registro+'-'+Date.now()+'-'+i+j+'-review.'+tipo[1]
              nombre_documentos.push(nombre_archivo)
              formData.append('review', documento, nombre_archivo)
            }
          }
          form.requerimientos[i].nombre_documentos = nombre_documentos
          form.requerimientos[i].id_recepcion_documental = form.id_recepcion_documental
          form.requerimientos[i].documento = []
        }
        formData.append('requerimientos', JSON.stringify(form))
        const { data } = await siibApi.post('documentaryReview/create_documentary_review/' + userLogged, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ELIMINA EL REGISTRO DE REVISION DOCUMENTAL
    async deleteDocumentaryReview(id: number){
      try {
        const { data } = await siibApi.post('documentaryReview/delete_documentary_review/' + userLogged, { id: id })
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE EL ARCHIVO PDF PARA VISUALIZACION
    async getPdfFile(id_file:number){
      try {
        const { data } = await siibApi.get('documentaryReview/getPdfFile/' + id_file, {responseType:'blob'})
        return { data }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

  }
});
