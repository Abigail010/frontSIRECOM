import { defineStore } from 'pinia';
import { router } from '@/router';
import  { URL } from '@/utils/helpers/direction'

import sirecomApi from "@/api/sirecomApi"

const direccion_url = URL
export const useRegisterStore = defineStore({
  id: 'registro',
  actions: {

    async searchOrden(form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        
        const { data } = await sirecomApi.post('registro/search/' , form)
        return data
        
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, caso: 0, rd: 0}
      }
    },
    async sistem(id_orden: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        
        const { data } = await sirecomApi.get('registro/search_sis/' + id_orden)
        return data
        
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, caso: 0, rd: 0}
      }
    },
    
       //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
       async getFiltros () {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.get('repuestos/filter')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getUnidad () {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.get('repuestos/unidad/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },

      async updateOrdenID(form: any) {
        try {
          
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('vehiculo/update_orden/' + userLogged, form)
       //   router.push({ name: 'ordenList' });
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
      async gettipo_trabajo() {
        try {
          const { data } = await sirecomApi.get('registro/tipo_trabajo/')
        //  router.push({ name: 'documentaryReceptionList' });
          return  data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message, caso: 0, rd: 0}
        }
      },
      async gettipo_mantenimiento() {
        try {
          const { data } = await sirecomApi.get('registro/tipo_mantenimiento/')
        //  router.push({ name: 'documentaryReceptionList' });
          return  data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message, caso: 0, rd: 0}
        }
      },
  // OBTENER INFORMACION DE DELITO POR ID
  async registro_id (id_orden: any) {
    try {
      
      const { data } = await sirecomApi.get('registro/registro_id/' + id_orden)
      return data
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }

  },
    // OBTENER INFORMACION DE DELITO POR ID
    async verificar_reg(id_orden: any) {
      try {
        
        const { data } = await sirecomApi.get('registro/soli_id/' + id_orden)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
  
    },
  // OBTENER INFORMACION DE DELITO POR ID
  async getbasico (id_orden: any) {
    try {
      const { data } = await sirecomApi.get('registro/basico/' + id_orden)
      return data
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }

  },
  async create_mantenimiento(form: any) {
    try {
      const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
      const { data } = await sirecomApi.post('registro/create_man/' + userLogged, form)
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

  async update_mantenimiento(form: any) {
    try {
      const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
      const { data } = await sirecomApi.post('registro/update_man/' + userLogged, form)
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

 

  
    async minutesReport(id_orden: number) {
      try {
        const url = `${direccion_url}/soli_Rep/report/${id_orden}`;
        const newWindow = window.open(url, '_blank');
    
        if (!newWindow) {
          throw new Error('No se pudo abrir la nueva ventana. Puede que el navegador esté bloqueando las ventanas emergentes.');
        }
    
        return { ok: true };
      } catch (error: any) {
        const message = error.message || 'Error: sin conexión';
        return { ok: false, message };
      }
    }, 
    async inventarioReport(id_orden: number) {
      try {
        const url = `${direccion_url}/soli_Rep/inventario_report/${id_orden}`;
        const newWindow = window.open(url, '_blank');
    
        if (!newWindow) {
          throw new Error('No se pudo abrir la nueva ventana. Puede que el navegador esté bloqueando las ventanas emergentes.');
        }
    
        return { ok: true };
      } catch (error: any) {
        const message = error.message || 'Error: sin conexión';
        return { ok: false, message };
      }
    },

  }
});
