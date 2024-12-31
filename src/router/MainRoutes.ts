const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        //DASHBOARD
       /* {
            name: 'welcome',
            path: '/welcome',
            component: () => import('@/views/sirecom/dashboard/index.vue')
        },
       */
    
        // MODULO PERFILES
        {
            name: 'profileList',
            path: '/profileList',
            component: () => import('@/views/sirecom/resources/profile/profileList.vue')
        },
        {
            name: 'profileForm',
            path: '/profileForm/:id_perfil',
            component: () => import('@/views/sirecom/resources/profile/profileForm.vue')
        },
        
        // MODULO USUARIOS
        {
            name: 'userList',
            path: '/userList',
            component: () => import('@/views/sirecom/resources/user/userList.vue')
        },
        {
            name: 'userForm',
            path: '/userForm/:id_usuario',
            component: () => import('@/views/sirecom/resources/user/userForm.vue')
        },
                // MODULO USUARIOS
        {
            name: 'tallerList',
            path: '/tallerList',
            component: () => import('@/views/sirecom/resources/taller/tallerList.vue')
        },
        {
            name: 'tallerForm',
            path: '/tallerForm/:id_taller',
            component: () => import('@/views/sirecom/resources/taller/tallerForm.vue')
        },
        {
            name: 'ordenList',
            path: '/ordenList',
            component: () => import('@/views/sirecom/ordenes/ordenList.vue')
        },
        {
            name: 'ordenForm',
            path: '/ordenForm/:id_orden',
            component: () => import('@/views/sirecom/ordenes/ordenForm.vue')
        },
        {
            name: 'registroForm',
            path: '/registroForm/:id_orden',
            component: () => import('@/views/sirecom/ordenes/registroForm.vue')
        },
        {
            name: 'soliRepForm',
            path: '/soliRepForm/:id_orden',
            component: () => import('@/views/sirecom/ordenes/soli_repForm.vue')
        },
        {
            name: 'Busqueda_list',
            path: '/Busqueda_list',
            component: () => import('@/views/sirecom/ordenes/busqueda.vue')
        },
        {
            name: 'information',
            path: '/information/:id',
            component: () => import('@/views/sirecom/ordenes/inf_basic.vue')
        },

         //DELITO
         {
            name: 'serviciosList',
            path: '/serviciosList',
            component: () => import('@/views/sirecom/resources/servicios/serviciosList.vue')
        },
        {
            name: 'serviciosForm',
            path: '/serviciosForm/:id_servicio',
            component: () => import('@/views/sirecom/resources/servicios/serviciosForm.vue')
        },
        //DELITO
        {
            name: 'accesorioList',
            path: '/accesorioList',
            component: () => import('@/views/sirecom/resources/accesorios/accesoriosList.vue')
        },
        {
            name: 'accesorioForm',
            path: '/accesorioForm/:id_accesorio',
            component: () => import('@/views/sirecom/resources/accesorios/accesorioForm.vue')
        },

         //DELITO
         {
            name: 'systemList',
            path: '/systemList',
            component: () => import('@/views/sirecom/resources/sistemas/systemList.vue')
        },
        {
            name: 'systemForm',
            path: '/systemForm/:id_sistema',
            component: () => import('@/views/sirecom/resources/sistemas/systemForm.vue')
        },

          //DELITO
          {
            name: 'filtroList',
            path: '/filtroList',
            component: () => import('@/views/sirecom/resources/filtros/filtroList.vue')
        },
        {
            name: 'repuestoForm',
            path: '/repuestoForm/:id_filtro',
            component: () => import('@/views/sirecom/resources/filtros/repuestoForm.vue')
        },
        {
            name: 'repuestoList',
            path: '/repuestoList',
            component: () => import('@/views/sirecom/resources/filtros/repuestoList.vue')
        },
        {
            name: 'formulario',
            path: '/formulario/:id',
            component: () => import('@/views/sirecom/resources/filtros/formulario.vue')
        },

        {
            name: 'tipo_manList',
            path: '/tipo_manList',
            component: () => import('@/views/sirecom/resources/tipo_man/tipo_manList.vue')
        },
        {
            name: 'tipo_manForm',
            path: '/tipo_manForm/:id_man',
            component: () => import('@/views/sirecom/resources/tipo_man/tipo_manForm.vue')
        },

         //DELITO
         {
            name: 'VehiculoList',
            path: '/VehiculoList',
            component: () => import('@/views/sirecom/resources/Vehiculos/vehiculoList.vue')
        },
        {
            name: 'vehiculoForm',
            path: '/vehiculoForm/:id_v',
            component: () => import('@/views/sirecom/resources/Vehiculos/vehiculoForm.vue')
        },
        {
            name: 'FuerzasList',
            path: '/FuerzasList',
            component: () => import('@/views/sirecom/resources/Fuerzas/FuerzasList.vue')
        },
        {
            name: 'FuerzasForm',
            path: '/FuerzasForm/:id_fuerza',
            component: () => import('@/views/sirecom/resources/Fuerzas/FuerzasForm.vue')
        },
        {
            name: 'MarcaList',
            path: '/MarcaList',
            component: () => import('@/views/sirecom/resources/Marcas/marcasList.vue')
        },
        {
            name: 'MarcaForm',
            path: '/MarcaForm/:id_marca',
            component: () => import('@/views/sirecom/resources/Marcas/marcaForm.vue')
        },
        {
            name: 'ClaseList',
            path: '/ClaseList',
            component: () => import('@/views/sirecom/resources/Clases/clasesList.vue')
        },
        {
            name: 'ClaseForm',
            path: '/ClaseForm/:id_clase',
            component: () => import('@/views/sirecom/resources/Clases/claseForm.vue')
        },
        {
            name: 'TipoList',
            path: '/TipoList',
            component: () => import('@/views/sirecom/resources/Tipo/tipoList.vue')
        },
        {
            name: 'TipoForm',
            path: '/TipoForm/:id_tipo',
            component: () => import('@/views/sirecom/resources/Tipo/tipoForm.vue')
        },
        {
            name: 'proceList',
            path: '/proceList',
            component: () => import('@/views/sirecom/resources/procedencias/proceList.vue')
        },
        {
            name: 'proceForm',
            path: '/proceForm/:id_procedencia',
            component: () => import('@/views/sirecom/resources/procedencias/proceForm.vue')
        },
        {
            name: 'registerList',
            path: '/registerList',
            component: () => import('@/views/sirecom/resources/repuesto/registroList.vue')
        },
        {
            name: 'registerForm',
            path: '/registerForm/:id',
            component: () => import('@/views/sirecom/resources/repuesto/registroForm.vue')
        },




        // PERFIL DE USUARIO
        {
            name: 'userProfile',
            path: '/userProfile',
            component: () => import('@/views/sirecom/resources/user/userProfile.vue')
        },
         
     
        // MODULO KILOMETRAJE DE VEHICULO
      


        {
            name: 'Modern',
            path: '/dashboards/modern',
            component: () => import('@/views/dashboard/modern/index.vue')
        },
        {
            name: 'eCommerce',
            path: '/dashboards/ecommerce',
            component: () => import('@/views/dashboard/ecommerce/index.vue')
        },
        {
            name: 'Chats',
            path: '/apps/chats',
            component: () => import('@/views/apps/chat/Chats.vue')
        },
        {
            name: 'Email',
            path: '/apps/email',
            component: () => import('@/views/apps/email/Email.vue')
        },
        {
            name: 'ecom Products',
            path: '/ecommerce/products',
            component: () => import('@/views/apps/eCommerce/Products.vue')
        },
        {
            name: 'Product detail',
            path: '/ecommerce/product/detail/:id',
            component: () => import('@/views/apps/eCommerce/ProductDetails.vue')
        },
        {
            name: 'Product Checkout',
            path: '/ecommerce/checkout',
            component: () => import('@/views/apps/eCommerce/ProductCheckout.vue')
        },
        {
            name: 'Product Listing',
            path: '/ecommerce/productlist',
            component: () => import('@/views/apps/eCommerce/ProductList.vue')
        },
        {
            name: 'Posts',
            path: '/apps/blog/posts',
            component: () => import('@/views/apps/blog/Posts.vue')
        },
        {
            name: 'Detail',
            path: '/apps/blog/:id',
            component: () => import('@/views/apps/blog/Detail.vue')
        },

        {
            name: 'UserProfile',
            path: '/apps/user/profile',
            component: () => import('@/views/apps/user-profile/Profile.vue')
        },
        {
            name: 'UserFollowers',
            path: '/apps/user/profile/followers',
            component: () => import('@/views/apps/user-profile/Followers.vue')
        },
        {
            name: 'UserFriends',
            path: '/apps/user/profile/friends',
            component: () => import('@/views/apps/user-profile/Friends.vue')
        },
        {
            name: 'UserGallery',
            path: '/apps/user/profile/gallery',
            component: () => import('@/views/apps/user-profile/Gallery.vue')
        },
        {
            name: 'Notes',
            path: '/apps/notes',
            component: () => import('@/views/apps/notes/Notes.vue')
        },
        {
            name: 'Contact',
            path: '/apps/contacts',
            component: () => import('@/views/apps/contact/Contact.vue')
        },
        {
            name: 'Calendar',
            path: '/apps/calendar',
            component: () => import('@/views/apps/calendar/Calendar.vue')
        },
        {
            name: 'Kanban',
            path: '/apps/kanban',
            component: () => import('@/views/apps/kanban/Kanban.vue')
        },
        {
            name: 'Autocomplete',
            path: '/forms/form-elements/autocomplete',
            component: () => import('@/views/forms/form-elements/VAutocomplete.vue')
        },
        {
            name: 'Combobox',
            path: '/forms/form-elements/combobox',
            component: () => import('@/views/forms/form-elements/Combobox.vue')
        },
        {
            name: 'File Inputs',
            path: '/forms/form-elements/fileinputs',
            component: () => import('@/views/forms/form-elements/FileInputs.vue')
        },
        {
            name: 'Custom Inputs',
            path: '/forms/form-elements/custominputs',
            component: () => import('@/views/forms/form-elements/CustomInputs.vue')
        },
        {
            name: 'Select',
            path: '/forms/form-elements/select',
            component: () => import('@/views/forms/form-elements/Select.vue')
        },
        {
            name: 'Button',
            path: '/forms/form-elements/button',
            component: () => import('@/views/forms/form-elements/VButtons.vue')
        },
        {
            name: 'Checkbox',
            path: '/forms/form-elements/checkbox',
            component: () => import('@/views/forms/form-elements/VCheckbox.vue')
        },
        {
            name: 'Radio',
            path: '/forms/form-elements/radio',
            component: () => import('@/views/forms/form-elements/VRadio.vue')
        },
        {
            name: 'Date Time',
            path: '/forms/form-elements/date-time',
            component: () => import('@/views/forms/form-elements/VDateTime.vue')
        },
        {
            name: 'Slider',
            path: '/forms/form-elements/slider',
            component: () => import('@/views/forms/form-elements/VSlider.vue')
        },
        {
            name: 'Switch',
            path: '/forms/form-elements/switch',
            component: () => import('@/views/forms/form-elements/VSwitch.vue')
        },
        {
            name: 'Form Layout',
            path: '/forms/form-layouts',
            component: () => import('@/views/forms/FormLayouts.vue')
        },
        {
            name: 'Form Horizontal',
            path: '/forms/form-horizontal',
            component: () => import('@/views/forms/FormHorizontal.vue')
        },
        {
            name: 'Form Vertical',
            path: '/forms/form-vertical',
            component: () => import('@/views/forms/FormVertical.vue')
        },
        {
            name: 'Form Custom',
            path: '/forms/form-custom',
            component: () => import('@/views/forms/FormCustom.vue')
        },
        {
            name: 'Form Validation',
            path: '/forms/form-validation',
            component: () => import('@/views/forms/FormValidation.vue')
        },
        {
            name: 'Editor',
            path: '/forms/editor',
            component: () => import('@/views/forms/plugins/editor/Editor.vue')
        },
        {
            name: 'Basic Table',
            path: '/tables/basic',
            component: () => import('@/views/tables/TableBasic.vue')
        },
        {
            name: 'Dark Table',
            path: '/tables/dark',
            component: () => import('@/views/tables/TableDark.vue')
        },
        {
            name: 'Density Table',
            path: '/tables/density',
            component: () => import('@/views/tables/TableDensity.vue')
        },
        {
            name: 'Fixed Header Table',
            path: '/tables/fixed-header',
            component: () => import('@/views/tables/TableHeaderFixed.vue')
        },
        {
            name: 'Height Table',
            path: '/tables/height',
            component: () => import('@/views/tables/TableHeight.vue')
        },
        {
            name: 'Editable Table',
            path: '/tables/editable',
            component: () => import('@/views/tables/TableEditable.vue')
        },
        {
            name: 'Basic Data Table',
            path: '/tables/datatables/basic',
            component: () => import('@/views/tables/datatables/BasicTable.vue')
        },
        {
            name: 'Header Data Table',
            path: '/tables/datatables/header',
            component: () => import('@/views/tables/datatables/HeaderTables.vue')
        },
        {
            name: 'Selection Data Table',
            path: '/tables/datatables/selection',
            component: () => import('@/views/tables/datatables/Selectable.vue')
        },
        {
            name: 'Sorting Data Table',
            path: '/tables/datatables/sorting',
            component: () => import('@/views/tables/datatables/SortingTable.vue')
        },
        {
            name: 'Pagination Data Table',
            path: '/tables/datatables/pagination',
            component: () => import('@/views/tables/datatables/Pagination.vue')
        },
        {
            name: 'Filtering Data Table',
            path: '/tables/datatables/filtering',
            component: () => import('@/views/tables/datatables/Filtering.vue')
        },
        {
            name: 'Grouping Data Table',
            path: '/tables/datatables/grouping',
            component: () => import('@/views/tables/datatables/Grouping.vue')
        },
        {
            name: 'Slots Data Table',
            path: '/tables/datatables/slots',
            component: () => import('@/views/tables/datatables/Slots.vue')
        },
        {
            name: 'CRUD Table',
            path: '/tables/datatables/crudtable',
            component: () => import('@/views/tables/datatables/CrudTable.vue')
        },
        {
            name: 'Alert',
            path: '/ui-components/alert',
            component: () => import('@/views/ui-elements/UiAlert.vue')
        },
        {
            name: 'Accordion',
            path: '/ui-components/accordion',
            component: () => import('@/views/ui-elements/UiExpansionPanel.vue')
        },
        {
            name: 'Avtar',
            path: '/ui-components/avatar',
            component: () => import('@/views/ui-elements/UiAvatar.vue')
        },
        {
            name: 'Chip',
            path: '/ui-components/chip',
            component: () => import('@/views/ui-elements/UiChip.vue')
        },
        {
            name: 'Dialog',
            path: '/ui-components/dialogs',
            component: () => import('@/views/ui-elements/UiDialog.vue')
        },
        {
            name: 'List',
            path: '/ui-components/list',
            component: () => import('@/views/ui-elements/UiList.vue')
        },
        {
            name: 'Menus',
            path: '/ui-components/menus',
            component: () => import('@/views/ui-elements/UiMenus.vue')
        },
        {
            name: 'Rating',
            path: '/ui-components/rating',
            component: () => import('@/views/ui-elements/UiRating.vue')
        },
        {
            name: 'Tabs',
            path: '/ui-components/tabs',
            component: () => import('@/views/ui-elements/UiTabs.vue')
        },
        {
            name: 'Tooltip',
            path: '/ui-components/tooltip',
            component: () => import('@/views/ui-elements/UiTooltip.vue')
        },
        {
            name: 'Typography',
            path: '/ui-components/typography',
            component: () => import('@/views/style-animation/Typography.vue')
        },
        {
            name: 'Pricing',
            path: '/pages/pricing',
            component: () => import('@/views/pages/pricing/Pricing.vue')
        },
        {
            name: 'Account Setting',
            path: '/pages/account-settings',
            component: () => import('@/views/pages/account-settings/AccountSettings.vue')
        },

        {
            name: 'FAQ',
            path: '/pages/faq',
            component: () => import('@/views/pages/faq/Faq.vue')
        },
        {
            name: 'Line',
            path: '/charts/line-chart',
            component: () => import('@/views/charts/ApexLineChart.vue')
        },
        {
            name: 'Area',
            path: '/charts/area-chart',
            component: () => import('@/views/charts/ApexAreaChart.vue')
        },
        {
            name: 'Gredient',
            path: '/charts/gredient-chart',
            component: () => import('@/views/charts/ApexGredientChart.vue')
        },
        {
            name: 'Column',
            path: '/charts/column-chart',
            component: () => import('@/views/charts/ApexColumnChart.vue')
        },
        {
            name: 'Candlestick',
            path: '/charts/candlestick-chart',
            component: () => import('@/views/charts/ApexCandlestickChart.vue')
        },
        {
            name: 'Donut & Pie',
            path: '/charts/doughnut-pie-chart',
            component: () => import('@/views/charts/ApexDonutPieChart.vue')
        },
        {
            name: 'Radialbar & Radar',
            path: '/charts/radialbar-chart',
            component: () => import('@/views/charts/ApexRadialRadarChart.vue')
        },
        {
            name: 'Banners',
            path: '/widgets/banners',
            component: () => import('@/views/widgets/banners/banners.vue')
        },
        {
            name: 'Cards',
            path: '/widgets/cards',
            component: () => import('@/views/widgets/cards/cards.vue')
        },
        {
            name: 'Charts',
            path: '/widgets/charts',
            component: () => import('@/views/widgets/charts/charts.vue')
        }
    ]
};

export default MainRoutes;
