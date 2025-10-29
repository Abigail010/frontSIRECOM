import { defineStore } from 'pinia';
import { router } from '@/router';

import sirecomApi from "@/api/sirecomApi"
import  {URL } from '@/utils/helpers/direction'

const direccion_url = URL

export const useSoliStore = defineStore({
  id: 'soli',
  actions: {


    async updateobs(form: any) {
      try {
       
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await sirecomApi.post('soli_rep/observacion_rep/' + userLogged, form)
        router.push({ name: 'soliRepForm' });
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
      async updateEstado1(form: any) {
        try {
         
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('soli_rep/entrega_rep/' + userLogged, form)
          router.push({ name: 'soliRepForm' });
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
      async updateEstado2(form: any) {
        try {
         
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('soli_rep/recibido_rep/' + userLogged, form)
          router.push({ name: 'soliRepForm' });
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
      async updateRepID(form: any) {
        try {
         
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.post('soli_rep/update_rep/' + userLogged, form)
         router.push({ name: 'soliRepForm' });
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
 
      async getsolicitudes (id_repuesto: any) {
        try {
          
          const { data } = await sirecomApi.get('soli_rep/solicitudes/' + id_repuesto)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
    
      },
      async getTotal (id_orden: any) {
        try {
          
          const { data } = await sirecomApi.get('soli_rep/total_/' + id_orden)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
    
      },
      
      async getPrecio (id_rep: any) {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.get('soli_rep/precios/' + id_rep+'/'+ userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
    
      },

      async getEntregas (id_repuesto: any) {
        try {
          
          const { data } = await sirecomApi.get('soli_rep/entregas/' + id_repuesto)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
    
      },
  // OBTENER INFORMACION DE DELITO POR ID
  async getID (id_repuesto: any, fuerza:string) {
    try {
      
      const { data } = await sirecomApi.get('soli_rep/solirep_id/' + id_repuesto+'/'+fuerza)
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

  async soliReport(id_orden: number) {
    try {
     
      const response = open(direccion_url+'soli_rep/generate_report/'+id_orden)
      return response
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }
  },

  async minutesReport(id_orden: number) {
    try {
      const url = `${direccion_url}/soli_Rep/pedidos_report/${id_orden}`;
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
