import { defineStore } from 'pinia';
import { router } from '@/router';

import RebApi from "@/api/rebApi"


export const useResourceStore = defineStore({
  id: 'resource',
  actions: {
    // OBTIENE INFORMACION DE UNA PERSONA DE LA API SEGIP


    // OBTIENE LA INFORMACION DE UNA PERSONA QUE SE ENCUENTRE EN BASE DE DATOS
    async getPerson(info: { cedula_identidad: string; complemento: string }){
      const { cedula_identidad, complemento } = info
      try {
        const { data } = await RebApi.post("/resource/person", { cedula_identidad, complemento })
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LOS PERMISOS DEL USUARIO EN SESION
    async checkPermission (module: string) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await RebApi.post('resource/checkPermission', { userLogged, module })
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA INFORMACION DEL USUARIO EN SESION
    async getUserSession () {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await RebApi.post('resource/userSession', { userLogged })
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
         // OBTIENE LA LISTA DE LAS OFICINAS
         async getTalleres() {
          try {
            const { data } = await RebApi.get('/resource/taller')
            return data
          } catch (error: any) {
            const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
            return { ok: false, message: message }
          }
        },

         // OBTIENE LA LISTA DE LAS OFICINAS
         async getAccesorios() {
          try {
            const { data } = await RebApi.get('/resource/accesorios')
            return data
          } catch (error: any) {
            const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
            return { ok: false, message: message }
          }
        },
    
    // OBTIENE LA LISTA DE LOS KILOMETRAJES - VEHICULOS
    async getMileages() {
      try {
        // console.log('llego a resource')
        const { data } = await RebApi.get('/resource/mileages')
        const mileages = data
        return mileages
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS KILOMETRAJES POR INDUSTRIA - VEHICULO
    async getIndustriesMileages() {
      try {
        // console.log('llego a resource')
        const { data } = await RebApi.get('/resource/industriesMileages')
        const industriesMileages = data
        return industriesMileages
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    // OBTIENE LA LISTA DE DEPARTAMENTOS
    async getDepartments() {
      try {
        const { data } = await RebApi.get('/resource/departments')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER LISTA DE PROVINCIAS POR DEPARTAMENTO
    async getProvinces (department: any) {
      try {
        const { data } = await RebApi.get('resource/provinces/' + department)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER LISTA DE MUNICIPIOS POR PROVINCIA
    async getMunicipalities (province: any) {
      try {
        const { data } = await RebApi.get('resource/municipalities/' + province)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE DEPARTAMENTOS
    async getPlaces() {
      try {
        const { data } = await RebApi.get('/resource/places')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    
    // OBTIENE LA LISTA DE LOS CRIMENES
    async getProfiles() {
      try {
        const { data } = await RebApi.get('/resource/profiles')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    
    // OBTIENE LA LISTA DE LOS TIPOS DE SUSTANCIAS CONTROLADAS - SUSTANCIAS CONTROLADAS
    async getSubstances() {
      try {
        const { data } = await RebApi.get('/resource/substances')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    // OBTIENE LA LISTA DE MENU
    async getMenu() {
      try {
        const { data } = await RebApi.get('/resource/menu')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE MENU SEGUN CADA PERFIL
    async getProfileMenu() {
      try {
        const { data } = await RebApi.get('/resource/profileMenu')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },


    async getInstances() {
      try {
        const { data } = await RebApi.get('/resource/instances')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async getSerivicio_t() {
      try {
        const { data } = await RebApi.get('/resource/servicio')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
