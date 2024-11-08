import { defineStore } from 'pinia';
import { router } from '@/router';
import RebApi from "@/api/rebApi"
import  { URL } from '@/utils/helpers/direction'

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
const direccion_url = URL
export const useSearchStore = defineStore({
  id: 'search_tot',
  actions: {


       //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
       async getInfoB () {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await RebApi.get('search_tot/info_user/' + userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
    // OBTENER LISTA DE DELITOS
    async getUsers () {
      try {
        const { data } = await RebApi.get('search_tot/tot_usuarios/')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    async getVehiculos () {
        try {
          const { data } = await RebApi.get('search_tot/tot_vehiculo/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getT () {
        try {
          const { data } = await RebApi.get('search_tot/taller/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getM () {
        try {
          const { data } = await RebApi.get('search_tot/mecanicos/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getFinalizado () {
        try {
          const { data } = await RebApi.get('search_tot/tot_fin/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPrueba() {
        try {
          const { data } = await RebApi.get('search_tot/placas/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPrueba2(mes: any) {
        try {
          const { data } = await RebApi.get('search_tot/fuerzas/'+mes)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPendiente () {
        try {
          const { data } = await RebApi.get('search_tot/tot_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPedidos_en() {
        try {
          const { data } = await RebApi.get('search_tot/pedidos_entregados/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },

      async getPedidos_pen() {
        try {
          const { data } = await RebApi.get('search_tot/pedidos_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async vehiculosReport(form:any) {
        try {
          const url = direccion_url+'/search_tot/report_vehiculos';
          
          // Crear un formulario oculto para enviar los datos como POST
          const formElement = document.createElement('form');
          formElement.method = 'POST';
          formElement.action = url;
          formElement.target = '_blank';  // Esto abrirá la respuesta en una nueva pestaña
      
          // Agregar los datos del formulario
          for (const key in form) {
            if (form.hasOwnProperty(key)) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = form[key];
              formElement.appendChild(input);
            }
          }
      
          // Agregar el formulario al cuerpo del documento y enviarlo
          document.body.appendChild(formElement);
          formElement.submit();
      
          // Remover el formulario del DOM después de enviarlo
          document.body.removeChild(formElement);
      
          return { ok: true };
        } catch (error: any) {
          const message = error.message || 'Error: sin conexión';
          return { ok: false, message };
        }
      }, 
  

      async minutesReport(form: any) {
        try {
         const url =  direccion_url+'/search_tot/busqueda';

     
     //   const { url } = await RebApi.post('repuestos/create_filter/' + userLogged, form)
          // Crear un formulario oculto para enviar los datos como POST
          const formElement = document.createElement('form');
          formElement.method = 'POST';
          formElement.action = url;
          formElement.target = '_blank';  // Esto abrirá la respuesta en una nueva pestaña
      
          // Agregar los datos del formulario
          for (const key in form) {
            if (form.hasOwnProperty(key)) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = form[key];
              formElement.appendChild(input);
            }
          }
      
          // Agregar el formulario al cuerpo del documento y enviarlo
          document.body.appendChild(formElement);
          formElement.submit();
      
          // Remover el formulario del DOM después de enviarlo
          document.body.removeChild(formElement);
      
          return { ok: true };
        } catch (error: any) {
          const message = error.message || 'Error: sin conexión';
          return { ok: false, message };
        }
      },

      async ReportVe(form:any) {
        try {
          const url = direccion_url+'/search_tot/report_vehi';
          
          // Crear un formulario oculto para enviar los datos como POST
          const formElement = document.createElement('form');
          formElement.method = 'POST';
          formElement.action = url;
          formElement.target = '_blank';  // Esto abrirá la respuesta en una nueva pestaña
      
          // Agregar los datos del formulario
          for (const key in form) {
            if (form.hasOwnProperty(key)) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = form[key];
              formElement.appendChild(input);
            }
          }
      
          // Agregar el formulario al cuerpo del documento y enviarlo
          document.body.appendChild(formElement);
          formElement.submit();
      
          // Remover el formulario del DOM después de enviarlo
          document.body.removeChild(formElement);
      
          return { ok: true };
        } catch (error: any) {
          const message = error.message || 'Error: sin conexión';
          return { ok: false, message };
        }
      }, 
      
      async ReportMan(form:any) {
        try {
          const url = direccion_url+'/search_tot/report_meca';
          
          // Crear un formulario oculto para enviar los datos como POST
          const formElement = document.createElement('form');
          formElement.method = 'POST';
          formElement.action = url;
          formElement.target = '_blank';  // Esto abrirá la respuesta en una nueva pestaña
      
          // Agregar los datos del formulario
          for (const key in form) {
            if (form.hasOwnProperty(key)) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = form[key];
              formElement.appendChild(input);
            }
          }
      
          // Agregar el formulario al cuerpo del documento y enviarlo
          document.body.appendChild(formElement);
          formElement.submit();
      
          // Remover el formulario del DOM después de enviarlo
          document.body.removeChild(formElement);
      
          return { ok: true };
        } catch (error: any) {
          const message = error.message || 'Error: sin conexión';
          return { ok: false, message };
        }
      }, 

      async ReportRepuestos(form:any) {
        try {
          const url = direccion_url+'/search_tot/report_inventario';
          
          // Crear un formulario oculto para enviar los datos como POST
          const formElement = document.createElement('form');
          formElement.method = 'POST';
          formElement.action = url;
          formElement.target = '_blank';  // Esto abrirá la respuesta en una nueva pestaña
      
          // Agregar los datos del formulario
          for (const key in form) {
            if (form.hasOwnProperty(key)) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = form[key];
              formElement.appendChild(input);
            }
          }
      
          // Agregar el formulario al cuerpo del documento y enviarlo
          document.body.appendChild(formElement);
          formElement.submit();
      
          // Remover el formulario del DOM después de enviarlo
          document.body.removeChild(formElement);
      
          return { ok: true };
        } catch (error: any) {
          const message = error.message || 'Error: sin conexión';
          return { ok: false, message };
        }
      }, 


  }

});
