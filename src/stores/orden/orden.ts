import { defineStore } from 'pinia';
import { router } from '@/router';

import sirecomApi from "@/api/sirecomApi"
import { URL } from '@/utils/helpers/direction'

const direccion_url = URL

export const useOrdenStore = defineStore({
  id: 'orden',
  actions: {

    async searchOrden(form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        
        const { data } = await sirecomApi.post('vehiculo/search/' , form)
        
        return data
        
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },
    async searchInfo(form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        
        const { data } = await sirecomApi.post('vehiculo/search_info/' , form)
        
        return data
        
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message}
      }
    },
    
       //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
       async getDisponibles () {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.get('vehiculo/disponibles/' + userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
         //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
         async getMecanicos () {
          try {
            const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
            const { data } = await sirecomApi.get('vehiculo/mecanicos/' + userLogged)
            return data
          } catch (error: any) {
            const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
            return { ok: false, message: message }
          }
        },
            //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
            async getOrdenU () {
              try {
                const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
                const { data } = await sirecomApi.get('vehiculo/lista_unica/' + userLogged)
                return data
              } catch (error: any) {
                const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
                return { ok: false, message: message }
              }
            },
              //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
              async getOrdenM () {
                try {
                  const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
                  const { data } = await sirecomApi.get('vehiculo/lista_men/' + userLogged)
                  return data
                } catch (error: any) {
                  const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
                  return { ok: false, message: message }
                }
              },
    
  
      async create_orden(form: any) {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('vehiculo/create_orden/' + userLogged, form)
          router.push({ name: 'ordenList' });
          return {
            ok: true,
            message: data.message,
            // vehiculo: data.id_vehiculo,
          //   rd: data.id_orden
          }
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message, caso: 0, rd: 0}
        }
      },
      async updateOrdenID(form: any) {
        try {
   
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('vehiculo/update_orden/' + userLogged, form)
        router.push({ name: 'ordenList' });
          return {
            ok: true,
            message: data.message,
          }
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message,
      
          }
        }
      },

      async updateentrega(form: any) {
        try {

          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('vehiculo/entrega/' + userLogged, form)
        router.push({ name: 'ordenList' });
          return {
            ok: true,
            message: data.message,
          }
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message,
      
          }
        }
      },
      async updatefinalizado(form: any) {
        try {
       
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('vehiculo/recibido/' + userLogged, form)
        router.push({ name: 'ordenList' });
          return {
            ok: true,
            message: data.message,
          }
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message,
      
          }
        }
      },
      async deleteEntrega(form: any) {
        try {
        
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('vehiculo/cancelar_man/' + userLogged, form)
        router.push({ name: 'ordenList' });
          return {
            ok: true,
            message: data.message,
          }
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message,
      
          }
        }
      },

      async getOrdenes_soli() {
        try {
          const { data } = await sirecomApi.get('vehiculo/ordenes/')
        //  router.push({ name: 'documentaryReceptionList' });
          return  data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message, caso: 0, rd: 0}
        }
      },
      async basic(id_orden: any) {
        try {
          const { data } = await sirecomApi.get('vehiculo/basic/'+id_orden)
        //  router.push({ name: 'documentaryReceptionList' });
          return  data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message, caso: 0, rd: 0}
        }
      },
  // OBTENER INFORMACION DE DELITO POR ID
  async orden_id (id_orden: any) {
    try {
        
      const { data } = await sirecomApi.get('vehiculo/orden_id/' + id_orden)
      return data
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }

  },





  }
});
