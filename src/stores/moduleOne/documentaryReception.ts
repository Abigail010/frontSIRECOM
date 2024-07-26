import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

export const useDocumentaryReceptionStore = defineStore({
  id: 'documentaryReception',
  actions: {
    //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
    async documentaryReceptions () {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.get('documentaryReception/documentary_receptions/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
    async documentaryReceptionsByCase (id: any) {
      try {
        const { data } = await siibApi.get('documentaryReception/documentary_receptions_by_case/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     //  OBTENER RECEPCION DOCUMENTAL POR ID
     async documentaryReceptionById (id: any) {
      try {
        const { data } = await siibApi.get('documentaryReception/documentary_receptions_by_id/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async createDocumentaryReception(form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('documentaryReception/create_documentary_reception/' + userLogged, form)
        router.push({ name: 'documentaryReceptionList' });
        return {
          ok: true,
          message: data.message,
          caso: data.id_caso,
          rd: data.id_recepcion_documental
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, caso: 0, rd: 0}
      }
    },

    async updateDocumentaryReception(form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('documentaryReception/update_documentary_reception/' + userLogged, form)
        router.push({ name: 'documentaryReceptionList' });
        return {
          ok: true,
          message: data.message,
          caso: data.id_caso,
          rd: data.id_recepcion_documental
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, caso: 0, rd: 0}
      }
    },

    async minutesReport(id_caso: number, id_recepcion_documental: number) {
      try {
        const response = open(direccion_url+'documentaryReception/minutes_report/'+id_caso+'/'+id_recepcion_documental)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // INFORMACION DE SEGUIMIENTO
    async tracingByIds (id_caso: any, id_recepcion_documental: any) {
      try {
        const { data } = await siibApi.get('documentaryReception/tracing_by_ids/' + id_caso + '/' + id_recepcion_documental)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
