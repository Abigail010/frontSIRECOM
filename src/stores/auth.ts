import { defineStore } from 'pinia';
import { router } from '@/router';
import authApi from "@/api/authApi"

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
      status: 'authenticating',
      token: null,
      user: null,
      returnUrl: null
    }),
    actions: {
      async login(username: string, password: string) {
        try {
          const { data } = await authApi.post('/login', { username, password })
          const { token, user, permissions } = data

          this.token = token;
          this.user = user;
          this.status = 'authenticated';

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token)
          localStorage.setItem('permissions', permissions);

          router.push({ name: 'Modern' });
          return { ok: true, message: 'Usuario encontrado' }
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexión')
          return { ok: false, message: message }
        }
      },

      async checkAuthStatus() {
        try {
          const idToken = localStorage.getItem('token')
          if(!idToken){
            this.token = null
            this.user = null
            this.status = 'not-authenticated'
            localStorage.clear()
            return { ok: false, message: "no token provided" }
          }

          const headers = { 'x-access-token': idToken }
          const { data } = await authApi.get("/is-verify", { headers: headers })
          const { token, user, permissions } = data
  
          this.token = token;
          this.user = user;
          this.status = 'authenticated';
  
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token)
          localStorage.setItem('permissions', permissions);

          return { ok: true }
        } catch (error) {
          this.token = null
          this.user = null
          this.status = 'not-authenticated'
          localStorage.clear()
          return { ok: false, message: error }
        }
      },

      async getUserMenu() {
        try {
          const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad

        // console.log(userLogged)
          const { data } = await authApi.post('/menu', { userLogged })
          console.log(data)
          return data
        } catch (error: any) {
          const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
          return { ok: false, message: message }
        }
      },

      logout() {
        this.token = null;
        this.user = null;
        this.status = 'not-authenticated'
        localStorage.clear()
        router.push({ name: 'Login' }).then(() => router.go(0));
      }
    }
});
