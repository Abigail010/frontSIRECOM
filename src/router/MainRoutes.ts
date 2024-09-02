const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        //DASHBOARD
        {
            name: 'welcome',
            path: '/welcome',
            component: () => import('@/views/siib/dashboard/index.vue')
        },
       
        // MODULO OBSERVACIONES DE REVISION DOCUMENTAL
        {
            name: 'documentaryReviewObservationList',
            path: '/documentaryReviewObservationList',
            component: () => import('@/views/siib/resources/documentaryReviewObservation/documentaryReviewObservationList.vue')
        },
        {
            name: 'documentaryReviewObservationForm',
            path: '/documentaryReviewObservationForm/:id_revision_documental_observacion',
            component: () => import('@/views/siib/resources/documentaryReviewObservation/documentaryReviewObservationForm.vue')
        },
        // MODULO ACABADO DE INMUEBLES
        {
            name: 'immovablePropertyBrickworkList',
            path: '/immovablePropertyBrickworkList',
            component: () => import('@/views/siib/resources/immovablePropertyBrickwork/immovablePropertyBrickworkList.vue')
        },
        {
            name: 'immovablePropertyBrickworkForm',
            path: '/immovablePropertyBrickworkForm/:id_acabado',
            component: () => import('@/views/siib/resources/immovablePropertyBrickwork/immovablePropertyBrickworkForm.vue')
        },
        // MODULO AMBIENTE DE INMUEBLES 
        {
            name: 'immovablePropertyEnviromentList',
            path: '/immovablePropertyEnviromentList',
            component: () => import('@/views/siib/resources/immovablePropertyEnviroment/immovablePropertyEnviromentList.vue')
        },
        {
            name: 'immovablePropertyEnviromentForm',
            path: '/immovablePropertyEnviromentForm/:id_inmueble_ambiente',
            component: () => import('@/views/siib/resources/immovablePropertyEnviroment/immovablePropertyEnviromentForm.vue')
        },
        // MODULO TIPO DE INMUEBLES 
        {
            name: 'immovablePropertyTypeList',
            path: '/immovablePropertyTypeList',
            component: () => import('@/views/siib/resources/immovablePropertyType/immovablePropertyTypeList.vue')
        },
        {
            name: 'immovablePropertyTypeForm',
            path: '/immovablePropertyTypeForm/:id_inmueble_tipo',
            component: () => import('@/views/siib/resources/immovablePropertyType/immovablePropertyTypeForm.vue')
        },
        // MODULO MATERIAL METAL DE JOYAS
        {
            name: 'jewelMaterialMetalList',
            path: '/jewelMaterialMetalList',
            component: () => import('@/views/siib/resources/jewelMaterialMetal/jewelMaterialMetalList.vue')
        },
        {
            name: 'jewelMaterialMetalForm',
            path: '/jewelMaterialMetalForm/:id_joya_material_metal',
            component: () => import('@/views/siib/resources/jewelMaterialMetal/jewelMaterialMetalForm.vue')
        },
        // MODULO MATERIAL PIEDRA DE JOYAS
        {
            name: 'jewelMaterialStoneList',
            path: '/jewelMaterialStoneList',
            component: () => import('@/views/siib/resources/jewelMaterialStone/jewelMaterialStoneList.vue')
        },
        {
            name: 'jewelMaterialStoneForm',
            path: '/jewelMaterialStoneForm/:id_joya_material_piedra',
            component: () => import('@/views/siib/resources/jewelMaterialStone/jewelMaterialStoneForm.vue')
        },
        // MODULO TIPO DE JOYAS
        {
            name: 'jewelTypeList',
            path: '/jewelTypeList',
            component: () => import('@/views/siib/resources/jewelType/jewelTypeList.vue')
        },
        {
            name: 'jewelTypeForm',
            path: '/jewelTypeForm/:id_joya_tipo',
            component: () => import('@/views/siib/resources/jewelType/jewelTypeForm.vue')
        },
        // PERFIL ADMINSTRATIVO I - GASTO ADMINISTRATIVO
        {
            name: 'administrativeExpenseList',
            path: '/administrativeExpenseList',
            component: () => import('@/views/siib/moduleAdministration/administrativeExpense/administrativeExpenseList.vue')
        },
        {
            name: 'administrativeExpenseForm',
            path: '/administrativeExpenseForm/:id_bien_registro',
            component: () => import('@/views/siib/moduleAdministration/administrativeExpense/administrativeExpenseForm.vue')
        },

         // JOYAS
         {
            name: 'jewel',
            path: '/jewel/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/jewel/jewel.vue')
        },
        
          // DINERO Y VALORES
          {
            name: 'moneyValues',
            path: '/moneyValues/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/moneyValues/moneyValues.vue')
        },
        // OTROS BIENES
        {
            name: 'otherProperty',
            path: '/otherProperty/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/otherProperty/otherProperty.vue')
        },
        // APROBACION DE BIENES
        {
            name: 'propertyApprovalList',
            path: '/propertyApprovalList',
            component: () => import('@/views/siib/moduleReception/propertyApproval/propertyApprovalList.vue')
        },  
        {
            name: 'docReceptionedList',
            path: '/docReceptionedList',
            component: () => import('@/views/siib/moduleReception/reception_docs/docReceptionedList.vue')
        },
          // LOGISTICA DE RECEPCION
          {
            name: 'receptionLogisticsForm',
            path: '/receptionLogisticsForm/:id_caso/:id_recepcion_documental',
            component: () => import('@/views/siib/moduleReception/receptionLogistics/receptionLogisticsForm.vue')
        },
         // SEMOVIENTES
         {
            name: 'selfMoving',
            path: '/selfMoving/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/selfMoving/selfMoving.vue')
        },
        // VEHICULO
        {
            name: 'vehicle',
            path: '/vehicle/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/vehicle/vehicle.vue')
        },

        // AERONAVES
        {
            name: 'aircraft',
            path: '/aircraft/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/aircraft/aircraft.vue')
        },
        {
            name: 'aircraftImage',
            path: '/aircraftImage/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/aircraft/image.vue')
        },

         // OBRAS DE ARTE Y PIEZAS ARQUEOLOGICAS
         {
            name: 'artwork',
            path: '/artwork/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/artwork/artwork.vue')
        },

        // EMBARCACIONES
        {
            name: 'boat',
            path: '/boat/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/boat/boat.vue')
        },

        // CONSUMIBLES
        {
            name: 'consumable',
            path: '/consumable/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/consumable/consumable.vue')
        },

        // SUSTANCIAS CONTROLADAS
        {
            name: 'controlledSubstance',
            path: '/controlledSubstance/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/controlledSubstance/controlledSubstance.vue')
        },
        {
            name: 'controlledSubstanceImage',
            path: '/controlledSubstanceImage/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/controlledSubstance/image.vue')
        },
       
        // MODULO BUSQUEDAS
        // BUSQUEDA POR TIPO DE BIEN
        {
            name: 'byType',
            path: '/byType',
            component: () => import('@/views/siib/moduleReport/explore/byType.vue')
        },
        // BUSQUEDA POR CASO
        {
            name: 'byCase',
            path: '/byCase',
            component: () => import('@/views/siib/moduleReport/explore/byCase.vue')
        },

        // MODULO PERFILES
        {
            name: 'profileList',
            path: '/profileList',
            component: () => import('@/views/siib/resources/profile/profileList.vue')
        },
        {
            name: 'profileForm',
            path: '/profileForm/:id_perfil',
            component: () => import('@/views/siib/resources/profile/profileForm.vue')
        },
        
        // MODULO USUARIOS
        {
            name: 'userList',
            path: '/userList',
            component: () => import('@/views/siib/resources/user/userList.vue')
        },
        {
            name: 'userForm',
            path: '/userForm/:id_usuario',
            component: () => import('@/views/siib/resources/user/userForm.vue')
        },
                // MODULO USUARIOS
        {
            name: 'tallerList',
            path: '/tallerList',
            component: () => import('@/views/siib/resources/taller/tallerList.vue')
        },
        {
            name: 'tallerForm',
            path: '/tallerForm/:id_taller',
            component: () => import('@/views/siib/resources/taller/tallerForm.vue')
        },
        {
            name: 'ordenList',
            path: '/ordenList',
            component: () => import('@/views/siib/ordenes/ordenList.vue')
        },
        {
            name: 'ordenForm',
            path: '/ordenForm/:id_orden',
            component: () => import('@/views/siib/ordenes/ordenForm.vue')
        },
        {
            name: 'registroForm',
            path: '/registroForm/:id_orden',
            component: () => import('@/views/siib/ordenes/registroForm.vue')
        },
        {
            name: 'soliRepForm',
            path: '/soliRepForm/:id_orden',
            component: () => import('@/views/siib/ordenes/soli_repForm.vue')
        },
        {
            name: 'Busqueda_list',
            path: '/Busqueda_list',
            component: () => import('@/views/siib/ordenes/busqueda.vue')
        },


         //DELITO
         {
            name: 'serviciosList',
            path: '/serviciosList',
            component: () => import('@/views/siib/resources/servicios/serviciosList.vue')
        },
        {
            name: 'serviciosForm',
            path: '/serviciosForm/:id_servicio',
            component: () => import('@/views/siib/resources/servicios/serviciosForm.vue')
        },
        //DELITO
        {
            name: 'accesorioList',
            path: '/accesorioList',
            component: () => import('@/views/siib/resources/accesorios/accesoriosList.vue')
        },
        {
            name: 'accesorioForm',
            path: '/accesorioForm/:id_accesorio',
            component: () => import('@/views/siib/resources/accesorios/accesorioForm.vue')
        },

         //DELITO
         {
            name: 'systemList',
            path: '/systemList',
            component: () => import('@/views/siib/resources/sistemas/systemList.vue')
        },
        {
            name: 'systemForm',
            path: '/systemForm/:id_sistema',
            component: () => import('@/views/siib/resources/sistemas/systemForm.vue')
        },

          //DELITO
          {
            name: 'filtroList',
            path: '/filtroList',
            component: () => import('@/views/siib/resources/filtros/filtroList.vue')
        },
        {
            name: 'repuestoForm',
            path: '/repuestoForm/:id_filtro',
            component: () => import('@/views/siib/resources/filtros/repuestoForm.vue')
        },


        {
            name: 'tipo_manList',
            path: '/tipo_manList',
            component: () => import('@/views/siib/resources/tipo_man/tipo_manList.vue')
        },
        {
            name: 'tipo_manForm',
            path: '/tipo_manForm/:id_man',
            component: () => import('@/views/siib/resources/tipo_man/tipo_manForm.vue')
        },



        // PERFIL DE USUARIO
        {
            name: 'userProfile',
            path: '/userProfile',
            component: () => import('@/views/siib/resources/user/userProfile.vue')
        },
          // MODULO MOTIVOS DE LOGISTICA DE RECEPCION
          {
            name: 'receptionLogisticsReasonList',
            path: '/receptionLogisticsReasonList',
            component: () => import('@/views/siib/resources/receptionLogisticsReason/receptionLogisticsReasonList.vue')
        },
        {
            name: 'receptionLogisticsReasonForm',
            path: '/receptionLogisticsReasonForm/:id_logistica_recepcion_motivo',
            component: () => import('@/views/siib/resources/receptionLogisticsReason/receptionLogisticsReasonForm.vue')
        },
         // MODULO TIPOS DE SEMOVIENTE
         {
            name: 'selfMovingTypeList',
            path: '/selfMovingTypeList',
            component: () => import('@/views/siib/resources/selfMovingType/selfMovingTypeList.vue')
        },
        {
            name: 'selfMovingTypeForm',
            path: '/selfMovingTypeForm/:id_semoviente_tipo',
            component: () => import('@/views/siib/resources/selfMovingType/selfMovingTypeForm.vue')
        },       
        // MODULO CONTENEDORES DE SUSTANCIA
        {
            name: 'substanceContainerList',
            path: '/substanceContainerList',
            component: () => import('@/views/siib/resources/substanceContainer/substanceContainerList.vue')
        },
        {
            name: 'substanceContainerForm',
            path: '/substanceContainerForm/:id_sustancia_contenedor',
            component: () => import('@/views/siib/resources/substanceContainer/substanceContainerForm.vue')
        },
        // MODULO TIPOS DE SUSTANCIA
        {
            name: 'substanceTypeList',
            path: '/substanceTypeList',
            component: () => import('@/views/siib/resources/substanceType/substanceTypeList.vue')
        },
        {
            name: 'substanceTypeForm',
            path: '/substanceTypeForm/:id_sustancia',
            component: () => import('@/views/siib/resources/substanceType/substanceTypeForm.vue')
        },
        // MODULO INDUSTRIAS DE VEHICULO
        {
            name: 'vehicleIndustryList',
            path: '/vehicleIndustryList',
            component: () => import('@/views/siib/resources/vehicleIndustry/vehicleIndustryList.vue')
        },
        {
            name: 'vehicleIndustryForm',
            path: '/vehicleIndustryForm/:id_industria',
            component: () => import('@/views/siib/resources/vehicleIndustry/vehicleIndustryForm.vue')
        },
        // MODULO KILOMETRAJE DE VEHICULO
        {
            name: 'vehicleMileageList',
            path: '/vehicleMileageList',
            component: () => import('@/views/siib/resources/vehicleMileage/vehicleMileageList.vue')
        },
        {
            name: 'vehicleMileageForm',
            path: '/vehicleMileageForm/:id_kilometraje',
            component: () => import('@/views/siib/resources/vehicleMileage/vehicleMileageForm.vue')
        },

        // PERFIL - RECEPCION DOCUMENTAL
        {
            name: 'documentaryReceptionList',
            path: '/documentaryReceptionList',
            component: () => import('@/views/siib/moduleReception/documentaryReception/documentaryReceptionList.vue')
        },
        {
            name: 'documentaryReceptionForm',
            path: '/documentaryReceptionForm/:id_caso',
            component: () => import('@/views/siib/moduleReception/documentaryReception/documentaryReceptionForm.vue')
        },

        // REVISION DOCUMENTAL
        {
            name: 'documentaryReviewList',
            path: '/documentaryReviewList',
            component: () => import('@/views/siib/moduleReception/documentaryReview/documentaryReviewList.vue')
        },
        {
            name: 'documentaryReviewForm',
            path: '/documentaryReviewForm/:id_bien/:id_caso/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/documentaryReview/documentaryReviewForm.vue')
        },

        // MODULO OBSERVACIONES DE REVISION DOCUMENTAL
        {
            name: 'documentaryReviewObservationList',
            path: '/documentaryReviewObservationList',
            component: () => import('@/views/siib/resources/documentaryReviewObservation/documentaryReviewObservationList.vue')
        },
        {
            name: 'documentaryReviewObservationForm',
            path: '/documentaryReviewObservationForm/:id_revision_documental_observacion',
            component: () => import('@/views/siib/resources/documentaryReviewObservation/documentaryReviewObservationForm.vue')
        },

        // EQUIPOS ELECTRONICOS
        {
            name: 'electronic',
            path: '/electronic/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/electronic/electronic.vue')
        },

        // MODULO AMBIENTE DE INMUEBLES 
        {
            name: 'immovablePropertyEnviromentList',
            path: '/immovablePropertyEnviromentList',
            component: () => import('@/views/siib/resources/immovablePropertyEnviroment/immovablePropertyEnviromentList.vue')
        },
        {
            name: 'immovablePropertyEnviromentForm',
            path: '/immovablePropertyEnviromentForm/:id_inmueble_ambiente',
            component: () => import('@/views/siib/resources/immovablePropertyEnviroment/immovablePropertyEnviromentForm.vue')
        },
        // MODULO TIPO DE INMUEBLES 
        {
            name: 'immovablePropertyTypeList',
            path: '/immovablePropertyTypeList',
            component: () => import('@/views/siib/resources/immovablePropertyType/immovablePropertyTypeList.vue')
        },
        {
            name: 'immovablePropertyTypeForm',
            path: '/immovablePropertyTypeForm/:id_inmueble_tipo',
            component: () => import('@/views/siib/resources/immovablePropertyType/immovablePropertyTypeForm.vue')
        },
        // MODULO ACABADO DE INMUEBLES
        {
            name: 'immovablePropertyBrickworkList',
            path: '/immovablePropertyBrickworkList',
            component: () => import('@/views/siib/resources/immovablePropertyBrickwork/immovablePropertyBrickworkList.vue')
        },
        {
            name: 'immovablePropertyBrickworkForm',
            path: '/immovablePropertyBrickworkForm/:id_acabado',
            component: () => import('@/views/siib/resources/immovablePropertyBrickwork/immovablePropertyBrickworkForm.vue')
        },

        // BIEN INMUEBLE
        {
            name: 'immovableProperty',
            path: '/immovableProperty/:id_caso/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/immovableProperty/immovableProperty.vue')
        },
        {
            name: 'immovablePropertyImage',
            path: '/immovablePropertyImage/:id_bien/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/immovableProperty/image.vue')
        },

        {
            name: 'caseFile',
            path: '/caseFile/:id',
            component: () => import('@/views/siib/moduleReception/instance/caseFile.vue')
        },
        {
            name: 'implicatedFile',
            path: '/implicatedFile/:id',
            component: () => import('@/views/siib/moduleReception/instance/implicatedFile.vue')
        },
        {
            name: 'bienFile',
            path: '/bienFile/:id',
            component: () => import('@/views/siib/moduleReception/instance/bienFile.vue')
        },
        {
            name: 'checkDocs',
            path: '/checkDocs/id_bien/:id_bien/id_caso/:id_caso/id_bien_registro/:id_bien_registro',
            component: () => import('@/views/siib/moduleReception/instance/checkDocs.vue')
        },
        {
            name: 'receptionLogistics',
            path: '/receptionLogistics/:id_caso/:id_recepcion_documental',
            component: () => import('@/views/siib/moduleReception/instance/receptionLogistics.vue')
        },

        // REGISTRO-LISTADO DE ENTIDADES EXTERNAS
        {
            name: 'externalRegistrationFormReview',
            path: '/externalRegistrationFormReview/:id',
            component: () => import('@/views/siib/moduleInteroperability/externalRegistrationForm.vue')
        },
        {
            name: 'externalRegistrationList',
            path: '/externalRegistrationList/:estado/:tipo',
            component: () => import('@/views/siib/moduleInteroperability/externalRegistrationList.vue')
        },



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
