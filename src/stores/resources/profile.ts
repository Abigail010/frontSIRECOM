import { defineStore } from 'pinia';
import { router } from '@/router';
import RebApi from "@/api/rebApi"

const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

export const useProfileStore = defineStore({
  id: 'profile',
  actions: {

    async profiles () {
      try {
        const { data } = await RebApi.get('profile/profiles')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

     async profile (id: any) {
      try {
        const { data } = await RebApi.get('profile/profile/' + id)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async createProfile(form: any) {
      try {
        const { data } = await RebApi.post('profile/create_profile/' + userLogged, form)
        router.push({ name: 'profileList' });
        return { ok: true, message: data.message }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async updateProfile(form: any) {
      try {
        const { data } = await RebApi.post('profile/update_profile/' + userLogged, form)
        router.push({ name: 'profileList' });
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

    async deleteProfile(form: any) {
      try {
        const { data } = await RebApi.post('profile/delete_profile/' + userLogged, form)
        router.push({ name: 'profileList' });
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
