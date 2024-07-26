import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import siibApifiles from '@/api/siibApiFiles';
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

export const useInstanceStore = defineStore({
  id: 'instance',
  actions: {
    //  OBTENER LISTA DE CASOS
    async instances () {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.get('instance/instances/' + userLogged)
        const instances = data
        return instances
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER INFORMACION GENERAL DE CASO
    async instance (id: number) {
      try {
        const { data } = await siibApi.get('instance/instance/' + id)
        const caso = data
        return caso
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION GENERAL DEL CASO
    async updateInstance (form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/update_instance/' + userLogged, form)
        router.push({ name: 'documentaryReviewList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DE LOS IMPLICADOS DEL CASO
    async instanceImplicated (id: number) {
      try {
        const { data } = await siibApi.get('instance/instanceImplicated/' + id)
        const caso = data
        return caso
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION GENERAL DEL CASO
    async updateInstanceImplicated (form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/update_instance_implicated/' + userLogged, form)
        router.push({ name: 'documentaryReviewList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DE LOS BIENES DEL CASO
    async instanceProperties (id: number) {
      try {
        const { data } = await siibApi.get('instance/instanceProperties/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION GENERAL DEL CASO
    async updateInstanceProperty (form: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/update_instance_property/' + userLogged, form)
        return { 
          ok: true, 
          message: data.message, 
          id: data.id 
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DE LA LOGISTICA DE RECEPCION DE LOS BIENES DEL CASO
    async instanceReceptionLogistics (id_caso: number, id_recepcion_documental: number) {
      try {
        const { data } = await siibApi.get('instance/instanceReceptionLogistics/' + id_caso + '/' + id_recepcion_documental)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION DE LOGISTICA DE RECEPCION DE BIENES DEL CASO
    async updateInstanceReceptionLogistics (form: any) {
      try {
        const { id_caso } = form
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/update_instance_reception_logistics/' + userLogged, form)
        router.push({ name: 'bienFile', params: { id: id_caso }})
        return { 
          ok: true,
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },




    // SERGIO
    // OBTIENE LOS TIPOS DE DOCUMENTACION REQUERIDA, EN BASE AL TIPO DE BIEN id_bien
    async getDocumentationTypeRequired (id_bien:number) {
      try {
        const { data } = await siibApi.get('instance/get_documentation_type_required/' + id_bien)
        return {
          ok: data.ok,
          respuesta: data.respuesta
        }
      }  catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR ACREDITACIÓN DE LA SITUACIÓN JURÍDICA DEL BIEN SUJETO DE ENTREGA 
    async updateLegalStatus (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_legal_status/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)
        // const { data } = await siibApi.post('instance/register_legal_status/' + userLogged + '/' + id_caso + '/' + id_bien_registro, datos)
        const id_register_legal_status = data.id;
        // SI EXISTE ARCHIVO CARGADO, SE LO MANDA AL SERVIDOR
        if(form.val.fileAcreditacion.length > 0){
          const formData = new FormData();
          formData.append('acreditacion_file', form.val.fileAcreditacion[0]);
          // SE CARGA EL ARCHIVO
          const { data } = await siibApifiles.post("instance/upload_acreditation_file/"+ id_register_legal_status, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }
        }
        return { 
          ok: true, 
          message: data.message, 
          id: data.id 
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INVENTARIO
    async uploadInventory (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_inventory/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)
        const id_register_inventory = data.id;
        if(form.val.file_inventario.length>0){
          const formData = new FormData();
          formData.append('inventario_file', form.val.file_inventario[0]);
          const {data} = await siibApifiles.post("instance/upload_inventory_file/"+ id_register_inventory, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }
        }
        return {
          ok: true,
          message: data.message,
          id: data.id
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async uploadSimpleCopy (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_simple_copy/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)  
        const id_register_simple_copy = data.id;
        if(form.val.file_copia_simple.length>0){
          const formData = new FormData();
          formData.append('copia_simple_file', form.val.file_copia_simple[0]);
          const {data} = await siibApifiles.post("instance/upload_simple_copy_file/"+ id_register_simple_copy, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }       
        }   
        return { 
          ok: true, 
          message: data.message, 
          id: data.id 
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async uploadActa (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_acta/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)  
        const id_register_acta = data.id;
        if(form.val.file_acta_entrega.length>0){
          const formData = new FormData();
          formData.append('acta_file', form.val.file_acta_entrega[0]);
          const {data} = await siibApifiles.post("instance/upload_acta_file/"+ id_register_acta, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }
        }        
        return { 
          ok: true, 
          message: data.message, 
          id: data.id 
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async uploadInoperableFurniture (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_inoperable_furniture/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)  
        const id_register_inoperable_forniture = data.id;
        if(form.val.file_mueble_inoperable.length>0){
          const formData = new FormData();
          formData.append('mueble_inoperable_file', form.val.file_mueble_inoperable[0]);
          const {data} = await siibApifiles.post("instance/upload_inoperable_furniture_file/"+ id_register_inoperable_forniture, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }       
        }        
        return { 
          ok: true, 
          message: data.message, 
          id: data.id 
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async uploadDepositTicket (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_deposit_ticket/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)  
        const id_register_deposit_ticket = data.id;
        if(form.val.file_boleta_deposito.length>0){
          const formData = new FormData();
          formData.append('boleta_deposito_file', form.val.file_boleta_deposito[0]);
          const {data} = await siibApifiles.post("instance/upload_deposit_ticket_file/"+ id_register_deposit_ticket, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }       
        }
        return { 
          ok: true, 
          message: data.message, 
          id: data.id 
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async uploadcitescInformation (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_citesc_information/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)
        const id_register_citesc_dossier = data.id;
        if(form.val.file_informe.length>0){
          const formData = new FormData();
          formData.append('informe_file', form.val.file_informe[0]);
          const {data} = await siibApifiles.post("instance/upload_citesc_information_file/"+ id_register_citesc_dossier, formData)
          return {
            ok: true,
            message: data.message,
            id: data.id
          }
        }
        return {
          ok: true,
          message: data.message,
          id: data.id
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async uploadOthers (form:any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_other/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)  
        const id_register_other = data.id;
        if(form.val.file_otro.length>0){
          const formData = new FormData();
          formData.append('otro_file', form.val.file_otro[0]);
          const {data} = await siibApifiles.post("instance/upload_other_file/"+ id_register_other, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }       
        }
        return { 
          ok: true, 
          message: data.message, 
          id: data.id 
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async uploadDispensable (form: any) {
      try {
        const id_caso = form.id_caso.value;
        const id_recepcion_documental = form.id_recepcion_documental.value
        const id_bien_registro = form.id_bien_registro.value;
        const datos = form.val;
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/register_dispensable/' + userLogged + '/' + id_caso + '/' + id_recepcion_documental + '/' + id_bien_registro, datos)
        const id_register_dispensable = data.id;
        if(form.val.file_dispensable.length>0){
          const formData = new FormData();
          formData.append('dispensable_file', form.val.file_dispensable[0]);
          const {data} = await siibApifiles.post("instance/upload_dispensable_file/"+ id_register_dispensable, formData)
          return { 
            ok: true, 
            message: data.message, 
            id: data.id 
          }
        }
        return {
          ok: true,
          message: data.message,
          id: data.id
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async observed (id:any) {
      try {
        const id_caso = id.id_caso;
        const id_bien_registro = id.bien_registro;
       const { data } = await siibApi.get('instance/observed/' + id_caso + '/' + id_bien_registro)         
        return { 
          ok: data.ok, 
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
    async approved (id:any) {
      try {
        const id_caso = id.id_caso;
        const id_bien_registro = id.bien_registro;
       const { data } = await siibApi.get('instance/approved/' + id_caso + '/' + id_bien_registro)        
        return { 
          ok: data.ok, 
          message: data.message
        }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // DEVUELVE UN ARRAY CON LOS REGISTROS DEL BIEN REGISTRO id
    async getListAcreditation(id:number){
      try {
        const { data } = await siibApi.get('instance/get_list_acreditation/' + id)
        return { data }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async getPdfFile(id_file:number){
      try {
        const { data } = await siibApi.get('instance/get_pdf_file/' + id_file, {responseType:'blob'})
        return { data }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async deleteFile(id: number){
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('instance/delete_file/' + userLogged, { id: id })
        // router.push({ name: 'documentaryReviewList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE POSTERIOR A LA REVISION DE BIENES
    async reviewReport(id_caso: number, id_recepcion_documental: number) {
      try {
        const response = open(direccion_url+'instance/review_report/'+id_caso+'/'+id_recepcion_documental)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE POSTERIOR A LA LOGISTICA DE RECEPCION
    async receptionLogisticsReport(id_caso: number, id_recepcion_documental: number) {
      try {
        const response = open(direccion_url+'instance/reception_logistics_report/'+id_caso+'/'+id_recepcion_documental)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LOS REGISTROS DE BASE DE DATOS DE LA TABLA recepcion_logistica DEL CASO X
    async receptionLogisticsRecords (id: number) {
      try {
        const { data } = await siibApi.get('instance/receptionLogisticsRecords/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    async generalKardexReport(id: number) {
      try {
        const response = open(direccion_url+'instance/general_kardex_report/'+id)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    }, 

    // OBTENER RECEPCIONES DOCUMENTALES DEL CASO
    async instanceDocumentaryReceptions (id: number) {
      try {
        const { data } = await siibApi.get('instance/instanceDocumentaryReceptions/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DE LA REVISION DOCUMENTAL DE LOS BIENES DEL CASO
    async tracingDocumentaryReview (id_caso: number, id_recepcion_documental: number) {
      try {
        const { data } = await siibApi.get('instance/tracing_documentary_review/' + id_caso + '/' + id_recepcion_documental)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // OBTENER INFORMACION DE LA LOGISTICA DE LOS BIENES DEL CASO
    async tracingLogisticReception (id_caso: number, id_recepcion_documental: number) {
      try {
        const { data } = await siibApi.get('instance/tracing_logistic_reception/' + id_caso + '/' + id_recepcion_documental)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },
    
  }
});
