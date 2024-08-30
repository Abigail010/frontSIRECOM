import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

export const useSoliStore = defineStore({
  id: 'soli',
  actions: {

      async updateEstado1(form: any) {
        try {
         
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await siibApi.post('soli_rep/entrega_rep/' + userLogged, form)
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
          const { data } = await siibApi.post('soli_rep/recibido_rep/' + userLogged, form)
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
          const { data } = await siibApi.post('soli_rep/update_rep/' + userLogged, form)
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
          
          const { data } = await siibApi.get('soli_rep/solicitudes/' + id_repuesto)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
    
      },
      async getTotal (id_orden: any) {
        try {
          
          const { data } = await siibApi.get('soli_rep/total_/' + id_orden)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
    
      },
      async getEntregas (id_repuesto: any) {
        try {
          
          const { data } = await siibApi.get('soli_rep/entregas/' + id_repuesto)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
    
      },
  // OBTENER INFORMACION DE DELITO POR ID
  async getID (id_repuesto: any) {
    try {
      
      const { data } = await siibApi.get('soli_rep/solirep_id/' + id_repuesto)
      return data
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }

  },
    // OBTENER INFORMACION DE DELITO POR ID
    async verificar_reg(id_orden: any) {
      try {
        
        const { data } = await siibApi.get('registro/soli_id/' + id_orden)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
  
    },
  // OBTENER INFORMACION DE DELITO POR ID
  async getbasico (id_orden: any) {
    try {
      const { data } = await siibApi.get('registro/basico/' + id_orden)
      return data
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }

  },

  async soliReport(id_orden: number) {
    try {
      console.log('........'+id_orden)
      console.log(open(direccion_url+'soli_rep/generate_report/'+id_orden))
      const response = open(direccion_url+'soli_rep/generate_report/'+id_orden)
      return response
    } catch (error: any) {
      const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
      return { ok: false, message: message }
    }
  },
  /*
  async Report(id_orden: number) {
    try {
      const response = await fetch(`http://localhost:3001/soli_Rep/report/${id_orden}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'usuarios.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);  // Revoca la URL para liberar memoria
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  }
  
/*
  async soliReport(id_orden: number) {
    try {
      // Realiza la solicitud POST y recibe el archivo directamente como un blob
      const response = await siibApi.post(`soli_rep/generate_report/${id_orden}`, {
        responseType: 'blob', // Asegúrate de recibir la respuesta como un blob
      });
  
      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(response.data);
      
      // Crea un enlace y lo descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.pdf';
      document.body.appendChild(a);
      a.click();
  
      // Limpia el URL para liberar memoria
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
      // Devuelve un indicador de éxito
      return { ok: true, message: 'Reporte descargado correctamente.' };
    } catch (error: any) {
      // Manejo del error, con una comprobación más precisa
      const message = error.response?.data?.message || 'error: sin conexión';
      return { ok: false, message: message };
    }
  }
  
  
  async soliReport(id_orden: number) {
    try {
      // Realiza la solicitud POST y recibe el archivo directamente como un blob
      const response = await siibApi.post(`soli_rep/generate_report/${id_orden}`, {
        responseType: 'blob', // Asegúrate de recibir la respuesta como un blob
      });
  
      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(response.data);
      
      // Crea un enlace y lo descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.pdf';
      document.body.appendChild(a);
      a.click();
  
      // Limpia el URL para liberar memoria
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
      // Devuelve un indicador de éxito
      return { ok: true, message: 'Reporte descargado correctamente.' };
    } catch (error: any) {
      // Manejo del error, con una comprobación más precisa
      const message = error.response?.data?.message || 'error: sin conexión';
      return { ok: false, message: message };
    }
  }
  */
  async minutesReport(id_orden: number) {
    try {
      const url = `http://localhost:3001/soli_Rep/pedidos_report/${id_orden}`;
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
