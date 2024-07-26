import siibApi from '@/api/siibApi';
import { defineStore } from "pinia";
import { router } from '@/router'

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
export const useStatisticsStore = defineStore({
  id: 'statistics',
  actions: {
    //OBTENEMOS LOS BIENES REGISTRADOS
    async getCaseRecords() {
      try {
        const { data } = await siibApi.get('statistics/caseRecords/'+ userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error sin conexion')
        return {ok: false, message: message} 
      }
    },
    //OBTENEMOS TOTAL BIENES REGISTRADOS
    async getPropertyRecords () {
      try {
        const { data } = await siibApi.get('statistics/propertyRecords/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    //OBTENEMOS LOS DIFERENTES ESTADOS JUDICIALES DE LOS BIENES
    async getTotalJudicialStatus () {
      try {
        const { data } = await siibApi.get('statistics/totalJudicialStatus/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error sin conexion')
        return {ok: false, message: message}
      }
    },
    //OBTENEMOS LOS DIFERENTES ESTADOS JUDICIALES DE LOS BIENES
    async getTotalDeposits () {
      try {
        const { data } = await siibApi.get('statistics/totalDeposits/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error sin conexion')
        return {ok: false, message: message}
      }
    },
    //OBTENEMOS LOS REGHISTROS DE ESTE AÑO
    async getRecordsByYear () {
      try {
        const { data } = await siibApi.get('statistics/recordsByYear/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error sin conexion')
        return {ok: false, message: message}
      }
    },
    async getLatestRecords () {
      try {
        const { data } = await siibApi.get('statistics/latestRecords/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error sin conexion')
        return {ok: false, message: message}
      }
    },

    async getRecordsByDepartament () {
      try {
        const { data } = await siibApi.get('statistics/recordsByDepartament/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error sin conexion')
        return {ok: false, message: message}
      }
    },
  }
});