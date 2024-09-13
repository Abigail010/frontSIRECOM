<script setup lang="ts">
import { ref, reactive, computed, onMounted, readonly } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useUserStore } from '@/stores/resources/solicitudDab';
import { validateText } from '@/utils/helpers/validateText'
import { format } from 'date-fns'
const currentDate = format(new Date(), "yyyy-MM-dd");

  const route = useRoute()
  const resourceStore = useResourceStore()
  const userStore = useUserStore()
  const tipoBien = ref([]) as any
  // BREADCRUMB  
  const page = ref({ title: 'Documento de Administracion del Bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'D.A.B',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
 
  const editar = ref<any>(false)

  const perfiles = ref([])
  const getProfilesList = async() => {
    perfiles.value = await resourceStore.getProfiles()
  }

  const oficinas = ref([])
  const getOfficesList = async() => {
    oficinas.value = await resourceStore.getOffices()
  }

    

  
  const perfilMenus = ref([]) as any
  const getProfileMenuList = async() => {
    perfilMenus.value = await resourceStore.getProfileMenu()
  }

  const setMenu = async() => {
    state.formData.menu = []
    for (let i = 0; i < perfilMenus.value.length; i++) {
      if(perfilMenus.value[i].id_perfil == state.formData.id_perfil){
        state.formData.menu.push(perfilMenus.value[i].id_menu)
        if(perfilMenus.value[i].editar){
          state.formData.ediciones.push(perfilMenus.value[i].id_menu)
        }
      }
    }
  }

  // FUNCION QUE OBTIENE LA INFORMACION DEL USUARIO
  const getUserById = async (id: any) => {
    const respuesta = await userStore.user(id)
    state.formData.id_usuario = respuesta.id
    state.formData.id_persona = respuesta.id_persona
    state.formData.id_perfil = respuesta.id_perfil
    state.formData.id_oficina = respuesta.id_oficina
    state.formData.cedula_identidad = respuesta.cedula_identidad
    state.formData.nombres = respuesta.nombres
    state.formData.apellido_paterno = respuesta.apellido_paterno
    state.formData.apellido_materno = respuesta.apellido_materno
    state.formData.fecha_nacimiento = respuesta.fecha_nacimiento
    state.formData.correo_electronico = respuesta.correo_electronico
    state.formData.celular = respuesta.celular
    state.formData.nombre_usuario = respuesta.nombre_usuario
    state.formData.contrasena = respuesta.contrasena
    const menu = respuesta.menu
    for (let i = 0; i < menu.length; i++) {
      state.formData.menu.push(menu[i].id_menu)
      if(menu[i].editar){
        state.formData.ediciones.push(menu[i].id_menu)
      }
    }
  }

  // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
  const buttonSearchPerson = async () => {
    state.formData.id_persona = ''
   

    const respuesta = await resourceStore.getPerson(state.formData)
    if(Object.prototype.hasOwnProperty.call(respuesta, 'id')){
      // console.log('UTILIZANDO DESDE DB');
      Toast.fire({
        icon: 'success',
        title: 'Resultado Obtenido Satisfactoriamente'
      })
      const fecha_nacimiento = respuesta.fecha_nacimiento.split('T')
    //  state.formData.cedula_identidad = state.formData.cedula_identidad 
      state.formData.id_persona = respuesta.id
      state.formData.nombres = respuesta.nombres
      state.formData.apellido_paterno = respuesta.apellido_paterno
      state.formData.apellido_materno = respuesta.apellido_materno
      state.formData.fecha_nacimiento = fecha_nacimiento[0]
      editar.value = true
      state.formData.nombre_usuario = state.formData.cedula_identidad
      state.formData.contrasena = state.formData.cedula_identidad 

    }else{
      // console.log('UTILIZANDO DESDE API SEGIP');
      const { data } = await resourceStore.dataSegip(state.formData)
      if(data.respuesta){
        Toast.fire({
          icon: 'error',
          title: data.respuesta
        })
      // DESBLOQUEAR EL INPUT
      }else{
        Toast.fire({
          icon: 'success',
          title: 'Resultado Obtenido Satisfactoriamente'
        })
        state.formData.nombres = data.Nombres
        state.formData.apellido_paterno = data.PrimerApellido
        state.formData.apellido_materno = data.SegundoApellido
        state.formData.genero = data.Genero
        state.formData.fecha_nacimiento = birthDate(data.FechaNacimiento)
        state.formData.pais = data.LugarNacimientoPais
        state.formData.departamento = data.LugarNacimientoDepartamento
        state.formData.provincia = data.LugarNacimientoProvincia
        state.formData.localidad = data.LugarNacimientoLocalidad
        state.formData.domicilio = data.Domicilio
        state.formData.imagen = 
          data.Fotografia !== undefined
          ? 'data:image/jpeg;base64,' + data.Fotografia
          : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'
          editar.value = true
        state.formData.nombre_usuario = state.formData.cedula_identidad
        state.formData.contrasena = state.formData.cedula_identidad
      }
    }
  }

  const buttonClearPerson = () => {
    state.formData.id_persona = ''
    state.formData.cedula_identidad = ''
    state.formData.complemento = ''
    state.formData.nombres = ''
    state.formData.apellido_paterno = ''
    state.formData.apellido_materno = ''
    state.formData.genero = ''
    state.formData.fecha_nacimiento = ''
    state.formData.pais = ''
    state.formData.departamento = ''
    state.formData.provincia = ''
    state.formData.localidad = ''
    state.formData.domicilio = ''
    state.formData.imagen = ''
    editar.value = false
  }

  // VALIDACIONES
  // const rules = computed(() => {
  //   return {
  //     formData: {
  //       cedula_identidad: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       nombres: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       fecha_nacimiento: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       id_perfil: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       id_oficina: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       correo_electronico: {
  //         required: helpers.withMessage(FORM_REQUIRED_FIELD, required),
  //         email: helpers.withMessage(FORM_INVALID_EMAIL, email)
  //       },
  //       nombre_usuario: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       contrasena: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       menu: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
  //     }
  //   }
  // })
  // const v$ = useVuelidate(rules, state)
  // const errors:any = computed(
  //   () => useValidationErrors(v$.value.$errors)
  // )

  const sendForm = ref(true)
  const testEmail = ref(true)
  const miValidacion = async () => {
    sendForm.value = true
    testEmail.value = true
    if(!state.formData.cedula_identidad && !state.formData.nombres && !state.formData.fecha_nacimiento
      && !state.formData.nombre_usuario && !state.formData.contrasena && !state.formData.correo_electronico && !state.formData.id_oficina
      && !state.formData.id_perfil){
      sendForm.value = false
    }

    //correo electronico
    const validarEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    if(state.formData.correo_electronico && !validarEmail.test(state.formData.correo_electronico)){
      testEmail.value = false
      sendForm.value = false
    }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'userList' })
  }

  // BOTON ENVIAR FORMULARIO
  // const buttonSendForm = async () => {
  //   if(state.formData.menu.length == 0){
  //     Toast.fire({
  //       icon: 'info',
  //       title: 'Menu vacío'
  //     })
  //   }
  //   // console.log('menu:', state.formData.menu);
  //   const result = await v$.value.$validate()
  //   if(!result) return
  //   const { ok, message } = (route.params.id_usuario == '0') ? await userStore.createUser(state.formData) : await userStore.updateUser(state.formData)
  //   const icono = (ok ? 'success' : 'error')
  //   Swal.fire({
  //     icon: icono,
  //     title: message,
  //     timer: 1500,
  //     showConfirmButton: false,
  //     timerProgressBar: true
  //   })
  // }
const submitButton = ref(false)
 
const buttonSendForm = async () => {

  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
    const { ok, message } = (route.params.id_usuario == '0') ? await userStore.createUser(state.formData) : await userStore.updateUser(state.formData)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
       icon: icono,
       title: message,
       timer: 1500,
       showConfirmButton: false,
      timerProgressBar: true
     })



  }
 
  const evaluateCheckbox = (id_permiso: any) => {
    const checkPermiso = state.formData.menu.find((permiso:any) => permiso == id_permiso)
    const checkEdicion = state.formData.ediciones.find((permiso:any) => permiso == id_permiso)
    if(!checkPermiso && checkEdicion){
      state.formData.ediciones = state.formData.ediciones.filter((permiso:any) => permiso != id_permiso)
    }
    return checkPermiso ? false : true
  }

  const birthDate = (date: string) => {
    if(date !== undefined){
      let format = date.split("/")
      let lastFormat = format[2] + "-" + format[1] + "-" + format[0];
      return lastFormat;
    }
    return  ''
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

   // DECLARACION DE BIEN FORMULARIO 
   const bien: any = reactive({
    bienData: {
      id_bien: '',
      nombre_bien:'',
      
    }
  });

  const getResourcesList = async () => {
    // LISTA DE BIENES
    tipoBien.value = await resourceStore.getProperties()
    
  }
  // LIMPIEZA DEL FORMULARIO
  const clearProperty = () => {
    bien.bienData.id_bien = ''
   
  }
  //Listado de entidades"""
const entidades = [{ ID_E: 1, SIGLA:'', NOMBRE: 'Unidad de Gestión Social' ,  ID_M: 1 },
{ ID_E: 2, SIGLA:'', NOMBRE: 'Dirección General de Comunicación Social' ,  ID_M: 1 },
{ ID_E: 3, SIGLA:'', NOMBRE: 'Embajadas y consulados' ,  ID_M: 2 },
{ ID_E: 4, SIGLA:'', NOMBRE: 'Agencia Boliviana de Energía Nuclear' ,  ID_M: 2 },
{ ID_E: 5, SIGLA:'', NOMBRE: 'Servicio Plurinacional de Defensa Pública' ,  ID_M: 3 },
{ ID_E: 6, SIGLA:'', NOMBRE: 'Defensoría del Pueblo' ,  ID_M: 3 },
{ ID_E: 7, SIGLA:'COMIBOL', NOMBRE: 'Corporación Minera de Bolivia ' ,  ID_M: 4 },
{ ID_E: 8, SIGLA:'SERGEOMIN', NOMBRE: 'Servicio Geológico Minero ' ,  ID_M: 4 },
{ ID_E: 9, SIGLA:'', NOMBRE: 'Aduana Nacional' ,  ID_M: 5 },
{ ID_E: 10, SIGLA:'SIN', NOMBRE: 'Servicio de Impuestos Nacionales ' ,  ID_M: 5 },
{ ID_E: 11, SIGLA:'ASFI', NOMBRE: 'Autoridad de Supervisión del Sistema Financiero ' ,  ID_M: 5 },
{ ID_E: 12, SIGLA:'YPFB', NOMBRE: 'Yacimientos Petrolíferos Fiscales Bolivianos' ,  ID_M: 6 },
{ ID_E: 13, SIGLA:'ANH', NOMBRE: 'Agencia Nacional de Hidrocarburos ' ,  ID_M: 6 },
{ ID_E: 14, SIGLA:'INE', NOMBRE: 'Instituto Nacional de Estadística ' ,  ID_M: 7 },
{ ID_E: 15, SIGLA:'UPRE', NOMBRE: 'Unidad de Proyectos Especiales ' ,  ID_M: 7 },
{ ID_E: 16, SIGLA:'ENDE', NOMBRE: 'Empresa Nacional de Electricidad' ,  ID_M: 8 },
{ ID_E: 17, SIGLA:'EBA', NOMBRE: 'Empresa Boliviana de Alimentos ' ,  ID_M: 8 },
{ ID_E: 18, SIGLA:'', NOMBRE: 'Instituto Nacional de Seguridad Social' ,  ID_M: 9 },
{ ID_E: 19, SIGLA:'', NOMBRE: 'Servicio Nacional del Empleo' ,  ID_M: 9 },
{ ID_E: 20, SIGLA:'SERNAP', NOMBRE: 'Servicio Nacional de Áreas Protegidas ' ,  ID_M: 10 },
{ ID_E: 21, SIGLA:'ENDE', NOMBRE: 'Empresa Nacional de Electricidad ' ,  ID_M: 10 },
{ ID_E: 22, SIGLA:'', NOMBRE: 'Policía Nacional' ,  ID_M: 11 },
{ ID_E: 23, SIGLA:'', NOMBRE: 'Dirección General de Migración' ,  ID_M: 11 },
{ ID_E: 24, SIGLA:'', NOMBRE: 'Viceministerio de Interculturalidad' ,  ID_M: 12 },
{ ID_E: 25, SIGLA:'', NOMBRE: 'Viceministerio de Descolonización' ,  ID_M: 12 },
{ ID_E: 26, SIGLA:'', NOMBRE: 'Fuerzas Armadas' ,  ID_M: 13 },
{ ID_E: 27, SIGLA:'', NOMBRE: 'Instituto Geográfico Militar' ,  ID_M: 13 },
{ ID_E: 28, SIGLA:'ABC', NOMBRE: 'Administradora Boliviana de Carreteras ' ,  ID_M: 14 },
{ ID_E: 29, SIGLA:'ENTEL', NOMBRE: 'Empresa Nacional de Telecomunicaciones ' ,  ID_M: 14 },
{ ID_E: 30, SIGLA:'', NOMBRE: 'Universidad Pública' ,  ID_M: 15 },
{ ID_E: 31, SIGLA:'', NOMBRE: 'Institutos Tecnológicos' ,  ID_M: 15 },
{ ID_E: 32, SIGLA:'', NOMBRE: 'Caja Nacional de Salud' ,  ID_M: 16 },
{ ID_E: 33, SIGLA:'SEDES', NOMBRE: 'Servicio Departamental de Salud ' ,  ID_M: 16 },
{ ID_E: 34, SIGLA:'INRA', NOMBRE: 'Instituto Nacional de Reforma Agraria ' ,  ID_M: 17 },
{ ID_E: 35, SIGLA:'SENASAG', NOMBRE: 'Servicio Nacional de Sanidad Agropecuaria e Inocuidad Alimentaria' ,  ID_M: 17 },
{ ID_E: 36, SIGLA:'INIAF', NOMBRE: 'Instituto Nacional de Innovación Agropecuaria y Forestal ' ,  ID_M: 18 },
{ ID_E: 37, SIGLA:'', NOMBRE: 'Federación Deportiva Nacional' ,  ID_M: 19 },
]
// encargado de la entidad 
const encargados = [{ ID_EU: 1, ENCARGADO:'USUARIO 1', ID_E: 1 },
{ ID_EU: 2, ENCARGADO:'USUARIO 2', ID_E: 2 },
{ ID_EU: 3, ENCARGADO:'USUARIO 3', ID_E: 3 },
{ ID_EU: 4, ENCARGADO:'USUARIO 4', ID_E: 4 },
{ ID_EU: 5, ENCARGADO:'USUARIO 5', ID_E: 5 },
{ ID_EU: 6, ENCARGADO:'USUARIO 6', ID_E: 6 },
{ ID_EU: 7, ENCARGADO:'USUARIO 7', ID_E: 7 },
{ ID_EU: 8, ENCARGADO:'USUARIO 8', ID_E: 8 },
{ ID_EU: 9, ENCARGADO:'USUARIO 9', ID_E: 9 },
{ ID_EU: 10, ENCARGADO:'USUARIO 10', ID_E: 10 },
{ ID_EU: 11, ENCARGADO:'USUARIO 11', ID_E: 11 },
{ ID_EU: 12, ENCARGADO:'USUARIO 12', ID_E: 12 },
{ ID_EU: 13, ENCARGADO:'USUARIO 13', ID_E: 13 },
{ ID_EU: 14, ENCARGADO:'USUARIO 14', ID_E: 14 },
{ ID_EU: 15, ENCARGADO:'USUARIO 15', ID_E: 15 },
{ ID_EU: 16, ENCARGADO:'USUARIO 16', ID_E: 16 },
{ ID_EU: 17, ENCARGADO:'USUARIO 17', ID_E: 17 },
{ ID_EU: 18, ENCARGADO:'USUARIO 18', ID_E: 18 },
{ ID_EU: 19, ENCARGADO:'USUARIO 19', ID_E: 19 },
{ ID_EU: 20, ENCARGADO:'USUARIO 20', ID_E: 20 },
{ ID_EU: 21, ENCARGADO:'USUARIO 21', ID_E: 21 },
{ ID_EU: 22, ENCARGADO:'USUARIO 22', ID_E: 22 },
{ ID_EU: 23, ENCARGADO:'USUARIO 23', ID_E: 23 },
{ ID_EU: 24, ENCARGADO:'USUARIO 24', ID_E: 24 },
{ ID_EU: 25, ENCARGADO:'USUARIO 25', ID_E: 25 },
{ ID_EU: 26, ENCARGADO:'USUARIO 26', ID_E: 26 },
{ ID_EU: 27, ENCARGADO:'USUARIO 27', ID_E: 27 },
{ ID_EU: 28, ENCARGADO:'USUARIO 28', ID_E: 28 },
{ ID_EU: 29, ENCARGADO:'USUARIO 29', ID_E: 29 },
{ ID_EU: 30, ENCARGADO:'USUARIO 30', ID_E: 30 },
{ ID_EU: 31, ENCARGADO:'USUARIO 31', ID_E: 31 },
{ ID_EU: 32, ENCARGADO:'USUARIO 32', ID_E: 32 },
{ ID_EU: 33, ENCARGADO:'USUARIO 33', ID_E: 33 },
{ ID_EU: 34, ENCARGADO:'USUARIO 34', ID_E: 34 },
{ ID_EU: 35, ENCARGADO:'USUARIO 35', ID_E: 35 },
{ ID_EU: 36, ENCARGADO:'USUARIO 36', ID_E: 36 },
{ ID_EU: 37, ENCARGADO:'USUARIO 37', ID_E: 37 },
{ ID_EU: 38, ENCARGADO:'USUARIO 38', ID_E: 1 },
{ ID_EU: 39, ENCARGADO:'USUARIO 39', ID_E: 2 },
{ ID_EU: 40, ENCARGADO:'USUARIO 40', ID_E: 3 },
{ ID_EU: 41, ENCARGADO:'USUARIO 41', ID_E: 4 },
{ ID_EU: 42, ENCARGADO:'USUARIO 42', ID_E: 5 },
{ ID_EU: 43, ENCARGADO:'USUARIO 43', ID_E: 6 },
{ ID_EU: 44, ENCARGADO:'USUARIO 44', ID_E: 7 },
{ ID_EU: 45, ENCARGADO:'USUARIO 45', ID_E: 8 },
{ ID_EU: 46, ENCARGADO:'USUARIO 46', ID_E: 9 },
{ ID_EU: 47, ENCARGADO:'USUARIO 47', ID_E: 10 },
{ ID_EU: 48, ENCARGADO:'USUARIO 48', ID_E: 11 },
{ ID_EU: 49, ENCARGADO:'USUARIO 49', ID_E: 12 },
{ ID_EU: 50, ENCARGADO:'USUARIO 50', ID_E: 13 },
{ ID_EU: 51, ENCARGADO:'USUARIO 51', ID_E: 14 },
{ ID_EU: 52, ENCARGADO:'USUARIO 52', ID_E: 15 },
]

 const state:any = reactive({
    formData: {
      id_e: '',
      nombre: '',
      id_encargado:'',
      encargado:'',
      numero: '',
      fecha_solicitud: currentDate, 
      usuario_dircabi:'',
      bien_select:'',
      id_bien:'',
      nombre_bien:'',
      

    }
  });

  //BUSCADOR DE ENCARGADO
  const lista_dis = ref([]) as any
  const getEncargado = async (id: any) => {
      const n = entidades.length
      for (let i =0; i<n; i++){
        if( entidades[i].NOMBRE==id){
          //console.log('el numero_ '+ entidades[i].ID_E)
          state.formData.numero= entidades[i].ID_E
        }
      }


     lista_dis.value = encargados.filter(encargado => encargado.ID_E === state.formData.numero);
     
  }
 
 // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
 const buttonSearchBien = async () => {
  state.formData.id_bien= ''
 //console.log(state.formData)
  
    const respuesta = await userStore.bienes(state.formData)
   // console.log(respuesta)
}

  const getDescriptionProperty = (id:number) => {
    const response: any = tipoBien.value.find( (val:any) => val.id === id)
    return response?.nombre_bien
  }
  onMounted(async () => {
    await getProfilesList()
    await getOfficesList()
 
    await getProfileMenuList()
    await getResourcesList()
    if(route.params.id_usuario != '0'){
      await getUserById(route.params.id_usuario)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> 1. INFORMACIÓN  DE LA SOLICITUD: </strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
       

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Entidad solicitante <span style="color:red">*</span></v-label>
          <v-select
                  v-model="state.formData.nombre"
                  :items="entidades"
                  item-title="NOMBRE"
                  item-value="NOMBRE"
                 @update:model-value="getEncargado(state.formData.nombre);"
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.nombre"
                  hide-details
          ></v-select>
          <template v-if="submitButton && !state.formData.nombre">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Funcionario encargado <span style="color:red">*</span></v-label>
          <v-select
                  v-model="state.formData.encargado"
                  :items="lista_dis"
                  item-title="ENCARGADO"
                  item-value="ENCARGADO"
                  no-data-text="No existe opciones para seleccionar"
                  
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.encargado"
                  hide-details
                ></v-select>
          <template v-if="submitButton && !state.formData.nombre">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
          
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Fecha solicitud<span style="color:red">*</span></v-label>
          <v-text-field 
          type="date" 
          v-model="state.formData.fecha_solicitud"
          :min="currentDate"
          :error="submitButton && !state.formData.fecha_solicitud"
          hide-details
          />
          <template v-if="submitButton && !state.formData.fecha_solicitud">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Usuario de DIRCABI <span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.fecha_nacimiento"
            @input="miValidacion(), state.formData.fecha_nacimiento= validateText(state.formData.fecha_nacimiento.toUpperCase())"
            :error="submitButton && !state.formData.fecha_nacimiento"
            
            hide-details
          />
          <template v-if="submitButton && !state.formData.fecha_nacimiento">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
       </v-row>
      
        <h4 class="mb-5 mt-2 font-weight-light">
        <strong> 2. INFORMACIÓN  DEL BIEN: </strong> 
      </h4>
      <v-row>
      <v-col cols="12" md="12">
         
          <v-select
              v-model.trim="state.formData.bien_select"
              :items="tipoBien"
              item-title="nombre_bien"
              item-value="nombre_bien"
              no-data-text="No existe más opciones para seleccionar"
              :error="submitButton && !state.formData.bien_select"
              clearable
           >
          <template v-slot:append v-if="route.params.id_usuario == '0'">
              <v-btn
                color="primary"
                @click= buttonSearchBien()
                :disabled="!state.formData.bien_select"
                readonly="true"
                ><SearchIcon/>Buscar
              </v-btn>
              <v-btn
                color="secondary"
                
              ><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-select>
          <template v-if="submitButton && !state.formData.bien_select">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        
      </v-row>

      <row>
        <h4 class="mb-5 mt-2 font-weight-light">
        <strong> LISTADO DE BIENES DISPONIBLES: </strong> 
      </h4>
      <v-col>
        <v-btn 
          color="primary"
         
        >
          Agregar Bienes
        </v-btn>
      </v-col>
      </row>
      <row>
        <h4 class="mb-5 mt-2 font-weight-light">
        <strong> BIENES SELECCIONADOS: </strong> 
      </h4>

      <v-col>
        <v-btn 
          color="primary"
         
        >
           Generar D.A.B
        </v-btn>
      </v-col>
      </row>
    

      <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>

<style>
.low-col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>