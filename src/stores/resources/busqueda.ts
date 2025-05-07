import { defineStore } from 'pinia';
import { router } from '@/router';
import sirecomApi from "@/api/sirecomApi"
import  { URL } from '@/utils/helpers/direction'

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
const direccion_url = URL
export const useSearchStore = defineStore({
  id: 'search_total',
  actions: {


       //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
       async getInfoB () {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await sirecomApi.get('search_total/info_user/' + userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
    // OBTENER LISTA DE DELITOS
    async getUsers () {
      try {
        const { data } = await sirecomApi.get('search_total/tot_usuarios/')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    async getVehiculos () {
        try {
          const { data } = await sirecomApi.get('search_total/tot_vehiculo/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getT () {
        try {
          const { data } = await sirecomApi.get('search_total/taller/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getM () {
        try {
          const { data } = await sirecomApi.get('search_total/mecanicos/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getFinalizado () {
        try {
          const { data } = await sirecomApi.get('search_total/tot_fin/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPrueba() {
        try {
          const { data } = await sirecomApi.get('search_total/placas/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPrueba2(mes: any) {
        try {
          const { data } = await sirecomApi.get('search_total/fuerzas/'+mes+'/'+userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async general_dashboard(mes: any) {
        try {
          const { data } = await sirecomApi.get('search_total/general_dashboard/'+mes+'/'+userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async general_data_for_search() {
        try {
          const { data } = await sirecomApi.get('search_total/general_data_for_search/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getCiudades(mes: any) {
        try {
          const { data } = await sirecomApi.get('search_total/departamentos/'+mes)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPendiente () {
        try {
          const { data } = await sirecomApi.get('search_total/tot_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPedidos_en() {
        try {
          const { data } = await sirecomApi.get('search_total/pedidos_entregados/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },

      async getPedidos_pen() {
        try {
          const { data } = await sirecomApi.get('search_total/pedidos_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async vehiculosReport(form:any) {
        try {
          const encodedUserLogged = encodeURIComponent(userLogged);
          const url = direccion_url+'/search_total/report_vehiculos/'+ encodedUserLogged;
         
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
         const encodedUserLogged = encodeURIComponent(userLogged);
        //  console.log('viendo ', encodedUserLogged)
         const url =  direccion_url+'/search_total/busqueda/'+ encodedUserLogged;
        
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
          const encodedUserLogged = encodeURIComponent(userLogged);
          const url = direccion_url+'/search_total/report_vehi/'+ encodedUserLogged;
          
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
          const encodedUserLogged = encodeURIComponent(userLogged);
          const url = direccion_url+'/search_total/report_meca/'+ encodedUserLogged;
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

      async ReportRepuestos(form:any, ) {
        try {
          const encodedUserLogged = encodeURIComponent(userLogged);
          const url = direccion_url+'/search_total/report_inventario/'+ encodedUserLogged;
          
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
