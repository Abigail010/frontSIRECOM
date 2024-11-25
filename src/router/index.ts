import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2'
import { usereadRuteStore } from '@/stores/resources/logsread'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/authentication/Error.vue')
    },
    MainRoutes,
    AuthRoutes
  ]
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);
  const { checkAuthStatus } = useAuthStore()
  const { ok } = await checkAuthStatus()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (authRequired && !ok) {
      Swal.fire(
        'Sesión expirada!',
        'Inicie sesión nuevamente',
        'warning'
      )
      next({ name: 'Login' })
    } else { 
      //Enviamos el to.path para leer la ruta 
      /*const logsruteStore = usereadRuteStore();   
      await logsruteStore.readLogrutes(to.path)*/

      next()
    } 
  } else {
    if(ok){
      return next({ name: 'Modern' })
    }
    next();
  }
});
