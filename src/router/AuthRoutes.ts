const AuthRoutes = {
    path: '/auth',
    component: () => import('@/layouts/blank/BlankLayout.vue'),
    meta: {
        requiresAuth: false
    },
    children: [
        {
            name: 'Login',
            path: '/',
            component: () => import('@/views/siib/start/login.vue')
        },
        {
            name: 'Landing Page',
            path: '/Landing',
            component: () => import('@/views/pages/landingpage/index.vue')
        },
        {
            name: 'Landin',
            path: '/LandingSiib',
            component: () => import('@/views/siib/landingPage/index.vue')
        },
       
        // {
        //     name: 'Landing Page',
        //     path: '/',
        //     component: () => import('@/views/pages/landingpage/index.vue')
        // },
        // {
        //     name: 'Side Login',
        //     path: '/auth/login',
        //     component: () => import('@/views/authentication/SideLogin.vue')
        // },
        {
            name: 'Boxed Login',
            path: '/auth/login2',
            component: () => import('@/views/authentication/BoxedLogin.vue')
        },
        {
            name: 'Side Register',
            path: '/auth/register',
            component: () => import('@/views/authentication/SideRegister.vue')
        },
        {
            name: 'Boxed Register',
            path: '/auth/register2',
            component: () => import('@/views/authentication/BoxedRegister.vue')
        },
        {
            name: 'Side Forgot Password',
            path: '/auth/forgot-password',
            component: () => import('@/views/authentication/SideForgotPassword.vue')
        },
        {
            name: 'Boxed Forgot Password',
            path: '/auth/forgot-password2',
            component: () => import('@/views/authentication/BoxedForgotPassword.vue')
        },
        {
            name: 'Side Two Steps',
            path: '/auth/two-step',
            component: () => import('@/views/authentication/SideTwoStep.vue')
        },
        {
            name: 'Boxed Two Steps',
            path: '/auth/two-step2',
            component: () => import('@/views/authentication/BoxedTwoStep.vue')
        },
        {
            name: 'Error',
            path: '/auth/404',
            component: () => import('@/views/authentication/Error.vue')
        },
        {
            name: 'Maintenance',
            path: '/auth/maintenance',
            component: () => import('@/views/authentication/Maintenance.vue')
        },
        {
            name: 'externalRegistrationForm',
            path: '/externalRegistrationForm/:id',
            component: () => import('@/views/siib/moduleInteroperability/externalRegistrationForm.vue')
        }
    ]
};

export default AuthRoutes;
