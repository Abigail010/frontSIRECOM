import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import { getDirection } from '@/utils/helpers/direction'

const direccion_url = getDirection()

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useConsumableStore = defineStore({
  id: 'consumable',
  actions: {

    // OBTENER INFORMACION DEL BIEN CONSUMIBLE
    async consumable (id_bien_registro: number) {
      try {
        const { data } = await siibApi.get('consumable/consumable/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // CREAR INFORMACION DEL BIEN CONSUMIBLE
    async createConsumable (form: any) {
      try {
        const nombres_fotografias = []
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)
        // INVENTARIOS
        for (let i = 0; i < form.inventarios.length; i++) {
          form.inventarios[i].picture_name = form.inventarios[i].picture.name
          formData.append('uploaded_image', form.inventarios[i].picture)
          delete form.inventarios[i].picture
          delete form.inventarios[i].imagen
        }
        // FOTOGRAFIAS
        for (let i = 0; i < form.fotografias.length; i++) {
          nombres_fotografias.push(form.fotografias[i].picture.name)
          formData.append('uploaded_image', form.fotografias[i].picture)
        }

        form.nombres_fotografias = nombres_fotografias
        form.fotografias = []
        formData.append('formulario', JSON.stringify(form))
        const { data } = await siibApi.post('consumable/create_consumable/' + userLogged, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // ACTUALIZAR INFORMACION DEL BIEN CONSUMIBLE
    async updateConsumable (form: any) {
      try {
        const nombres_fotografias = []
        const formData = new FormData()
        formData.append('id_bien_registro', form.id_bien_registro)
        // INVENTARIOS
        for (let i = 0; i < form.inventarios.length; i++) {
          if(form.inventarios[i].picture){
            form.inventarios[i].picture_name = form.inventarios[i].picture.name
            formData.append('uploaded_image', form.inventarios[i].picture)
            delete form.inventarios[i].picture
            delete form.inventarios[i].imagen
          }
        }
        // FOTOGRAFIAS
        for (let i = 0; i < form.fotografias.length; i++) {
          if(form.fotografias[i].picture){
            nombres_fotografias.push(form.fotografias[i].picture.name)
            formData.append('uploaded_image', form.fotografias[i].picture)
          }
        }
        form.nombres_fotografias = nombres_fotografias
        form.fotografias = []
        formData.append('formulario', JSON.stringify(form))
        const { data } = await siibApi.post('consumable/update_consumable/' + userLogged, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        router.back()
        return { ok: true, message: data.message, id: data.id }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message, id: 0}
      }
    },

    // REPORTE DEL BIEN CONSUMIBLE
    async consumableReport(id_bien_registro: number) {
      try {
        const response = open(direccion_url+'consumable/consumable_report/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // REPORTE DEL KARDEX
    async kardexConsumableReport(id_bien_registro: any) {
      try {
        const response = open(direccion_url+'consumable/kardex_consumable_report/'+userLogged+'/'+id_bien_registro)
        return response
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
