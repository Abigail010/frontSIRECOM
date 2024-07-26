import { defineStore } from 'pinia';
import { router } from '@/router';
import { getDirection } from '@/utils/helpers/direction'
import siibApi from "@/api/siibApi"
import siibApifiles from '@/api/siibApiFiles';

const direccion_url = getDirection()
const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useReceptionLogisticsStore = defineStore({
  id: 'receptionLogistics',
  actions: {
    // OBTENER INFORMACION DEL CASO Y CITE
    async getDataByCaseCite (id_caso: number, id_recepcion_documental: number) {
      try {
        const { data } = await siibApi.get('receptionLogistics/dataByCaseCite/' + id_caso + '/' + id_recepcion_documental)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER LOS BIENES DISPONIBLES PARA ESTABLECER LA LOGISTICA DE RECEPCION
    async getAvailableProperties (id_caso: number, id_recepcion_documental: number) {
      try {
        const { data } = await siibApi.get('receptionLogistics/availableProperties/' + id_caso + '/' + id_recepcion_documental)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER LOS REGISTROS ESTABLECIDOS EN LA LOGISTICA DE RECEPCION
    async getReceptionLogisticsByCase (id_caso: number, id_recepcion_documental: number) {
      try {
        const { data } = await siibApi.get('receptionLogistics/receptionLogisticsByCase/' + id_caso + '/' + id_recepcion_documental)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR LOGISTICA DE RECEPCION
    async createReceptionLogistics(form: any) {
      try {
        const { id_caso } = form
        const { data } = await siibApi.post('receptionLogistics/create_reception_logistics/' + userLogged, form)
        router.push({ name: 'bienFile', params: { id: id_caso }})
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE POSTERIOR A LA LOGISTICA DE RECEPCION
    async receptionLogisticsReport(id: number) {
      try {
        const response = open(direccion_url+'receptionLogistics/receptionLogisticsReportById/'+id)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
