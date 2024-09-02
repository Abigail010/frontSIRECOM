import { defineStore } from 'pinia';
import { router } from '@/router';
import siibApi from "@/api/siibApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useSearchStore = defineStore({
  id: 'search_tot',
  actions: {


       //  OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
       async getInfoB () {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
          const { data } = await siibApi.get('search_tot/info_user/' + userLogged)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
    // OBTENER LISTA DE DELITOS
    async getUsers () {
      try {
        const { data } = await siibApi.get('search_tot/tot_usuarios/')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    async getVehiculos () {
        try {
          const { data } = await siibApi.get('search_tot/tot_vehiculo/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getFinalizado () {
        try {
          const { data } = await siibApi.get('search_tot/tot_fin/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPrueba() {
        try {
          const { data } = await siibApi.get('search_tot/placas/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPrueba2() {
        try {
          const { data } = await siibApi.get('search_tot/fuerzas/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPendiente () {
        try {
          const { data } = await siibApi.get('search_tot/tot_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async getPedidos_en() {
        try {
          const { data } = await siibApi.get('search_tot/pedidos_entregados/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },

      async getPedidos_pen() {
        try {
          const { data } = await siibApi.get('search_tot/pedidos_pen/')
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },
      async vehiculosReport(form:any) {
        try {
          const url = 'http://localhost:3001/search_tot/report_vehiculos';
          
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
          const url = 'http://localhost:3001/search_tot/busqueda';
          
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
          const url = 'http://localhost:3001/search_tot/report_vehi';
          
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
