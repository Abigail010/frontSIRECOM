import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"

const direccion_url = 'http://localhost:3009/'  // LOCAL
// const direccion_url = 'http://165.172.16.13:3009/'  // LOCAL ACCESO REMOTO
// const direccion_url = 'https://edapi.mingobierno.gob.bo/siibapi/'  // PRODUCCION

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useUserStore = defineStore({
  id: 'user',
  actions: {
    // OBTENER LISTA DE RECEPCIONES DOCUMENTALES MEDIANTE CASOS
    async users () {
      try {
        // const { data } = await siibApi.get('user/users/' + userLogged)
        const { data } = await siibApi.get('user/users')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    async Perfil() {
      try {
        // const { data } = await siibApi.get('user/users/' + userLogged)
        const { data } = await siibApi.get('user/perfil')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    async Taller () {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.get('user/taller/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    async usersM () {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.get('user/users_admin/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
     // OBTENER RECEPCION DOCUMENTAL POR ID
     async user (id: any) {
      try {
        
        const { data } = await siibApi.get('user/user/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // CREAR USUARIO
    async createUser(form: any) {
      try {
        const { data } = await siibApi.post('user/create_user/' + userLogged, form)
        router.push({ name: 'userList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // ACTUALIZAR USUARIO
    async updateUser(form: any) {
      try {
        const { data } = await siibApi.post('user/update_user/' + userLogged, form)
        router.push({ name: 'userList' });
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

        // ACTUALIZAR USUARIO
        async updateOne(form: any) {
          try {
            const { data } = await siibApi.post('user/update_one/' + userLogged, form)
           // router.push({ name: '' });
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
    
    // ELIMINAR USUARIO
    async deleteUser(form: any) {

      try {
        console.log(form)
        const { data } = await siibApi.post('user/delete_user/' + userLogged, form)
        router.push({ name: 'userList' });
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

     

  }
});
