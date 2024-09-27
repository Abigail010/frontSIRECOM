<script setup lang="ts">
import { ref, reactive, computed, onMounted, readonly } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useUserStore } from '@/stores/resources/user';
import { validateText } from '@/utils/helpers/validateText'
 import { useVuelidate } from '@vuelidate/core'
 import { required, email, helpers } from '@vuelidate/validators'
 import { FORM_INVALID_EMAIL, FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
 import { useValidationErrors } from '@/stores/useValidationErrors';
 const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
 const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
  const route = useRoute()
  const resourceStore = useResourceStore()
  const userStore = useUserStore()

  // BREADCRUMB  
  const page = ref({ title: 'Usuario' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Usuario',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id_persona: '',
      id_usuario: '',
      id_perfil: '',
      id_taller: '',

      cedula_identidad: '',
      complemento: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      genero: '',
      fecha_nacimiento: '',
      pais: '',
      departamento: '',
      provincia: '',
      localidad: '',
      domicilio: '',
      imagen: '',

      nombre_usuario: '',
      contrasena: '',
      correo_electronico: '',
      celular: '',

      menu: [] as any,
      ediciones: [] as any,
    }
  });

  const editar = ref<any>(false)
    const us:any = JSON.parse(localStorage.getItem('user') || '').id_perfil
    const us2:any = JSON.parse(localStorage.getItem('user') || '').id_taller
  const perfiles = ref([])
  const getProfilesList = async() => {
    perfiles.value = await resourceStore.getProfiles()
    if(us==1 || us2==1){
      perfiles.value = await resourceStore.getProfiles()
    }else{
      perfiles.value = await  userStore.Perfil()
      
    }
  }

  const taller = ref([])
  const gettaller = async() => {
  
    if(us==1 || us2==1){
      taller.value = await resourceStore.getTalleres()
    }else{
      taller.value = await  userStore.Taller()
      
    }
  }

  const usertaller:any = JSON.parse(localStorage.getItem('user') || '').id_perfil

const usert:any = JSON.parse(localStorage.getItem('user') || '').id_taller

console.log('id_user '+ usertaller+ ' id_taller ' + usert )

  const menus = ref([]) as any
  const menu_independiente = ref([]) as any
  const menu_padre = ref([]) as any
  const submenu_independiente = ref([]) as any
  const submenu_padre = ref([]) as any
  const s_submenu_independiente = ref([]) as any
  const s_submenu_padre = ref([]) as any
  const t_submenu_independiente = ref([]) as any
  const getMenuList = async() => {
    menus.value = await resourceStore.getMenu()
    const lista = menus.value

    // LISTADO DE MENUS INDEPENDIENTES
    for (let i = 0; i < lista.length; i++) {
      if(lista[i].titulo && lista[i].direccion && !lista[i].padre){
        console.log(lista[i].titulo)
        if(lista[i].titulo =='Busqueda Reporte'){

        }
        menu_independiente.value.push(lista[i])
      }
      if(lista[i].titulo && !lista[i].direccion && !lista[i].padre){
        console.log(lista[i].titulo)
        menu_padre.value.push(lista[i])
      }
    }

    // LISTADO SUBMENUS (2DO NIVEL)
    // ITERAREMOS A TRAVES DE LOS MENUS PADRES
    for (let i = 0; i < menu_padre.value.length; i++) {
      const padre = menu_padre.value[i]
      // ITERAREMOS EN EL MENU GENERAL COMPARANDO INFORMACION CON RESPECTO A LOS PADRES
      for (let j = 0; j < lista.length; j++) {
        // SUBMENUS SIN HIJOS
        if(lista[j].padre == padre.id && lista[j].direccion){
          submenu_independiente.value.push(lista[j])
        }
        // SUBMENUS CON HIJOS
        if(lista[j].padre == padre.id && !lista[j].direccion){
          submenu_padre.value.push(lista[j])
        }
      }
    }
   
    // LISTADO SUBMENUS (3ER NIVEL)
    for (let i = 0; i < submenu_padre.value.length; i++) {
      const padre = submenu_padre.value[i]
      for (let j = 0; j < lista.length; j++) {
        if(lista[j].padre == padre.id && lista[j].direccion){
          s_submenu_independiente.value.push(lista[j])
        }
        if(lista[j].padre == padre.id && !lista[j].direccion){
          s_submenu_padre.value.push(lista[j])
        }
      }
    }
  
    // LISTADO SUBMENUS (4TO NIVEL)
    for (let i = 0; i < s_submenu_padre.value.length; i++) {
      const padre = s_submenu_padre.value[i]
      for (let j = 0; j < lista.length; j++) {
        if(lista[j].padre == padre.id && lista[j].direccion){
          t_submenu_independiente.value.push(lista[j])
        }
      }
    }
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
    //console.log(respuesta.value)
    state.formData.id_usuario = respuesta.id
    state.formData.id_persona = respuesta.id_persona
    state.formData.id_taller = respuesta.id_taller
    state.formData.id_perfil = respuesta.id_perfil
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

 
  const sendForm = ref(true)
  const testEmail = ref(true)
  const miValidacion = async () => {
    sendForm.value = true
    testEmail.value = true
    if(!state.formData.cedula_identidad || !state.formData.nombres 
      ||  !state.formData.nombre_usuario || !state.formData.contrasena || !state.formData.correo_electronico || !state.formData.id_taller
      || !state.formData.id_perfil || !state.formData.apellido_materno && !state.formData.apellido_paterno){
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

  onMounted(async () => {
    await getProfilesList()
    await gettaller()
    await getMenuList()
    await getProfileMenuList()
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
        <strong> DATOS DEL USUARIO:</strong> Los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">
            Cedula de Identidad<span style="color:red">(*)</span>
          </v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.cedula_identidad"
            @input="miValidacion(), state.formData.cedula_identidad= validateText(state.formData.cedula_identidad.toUpperCase())"
            :error="submitButton && !state.formData.cedula_identidad"
            hide-details
          />
          <template v-if="submitButton && !state.formData.cedula_identidad">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Complemento</v-label>
          <v-text-field
            variant="outlined"
            color="primary"
            v-model.trim="state.formData.complemento"
            @input="state.formData.complemento = validateText(state.formData.complemento.toUpperCase())"
            @keydown.enter=buttonSearchPerson()
            :readonly="editar"
          >
           
          </v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Nombres<span style="color:red">(*)</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombres"
            @input="miValidacion(), state.formData.nombres= validateText(state.formData.nombres.toUpperCase())"
            :error="submitButton && !state.formData.nombres"
            
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombres">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Apellido Paterno</v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model="state.formData.apellido_paterno"
            @input= "miValidacion(), state.formData.apellido_paterno=validateText(state.formData.apellido_paterno.toUpperCase())"
            :error="submitButton && !state.formData.apellido_materno" 
          
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Apellido Materno</v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model="state.formData.apellido_materno"
            @input= "miValidacion(), state.formData.apellido_materno=validateText(state.formData.apellido_materno.toUpperCase())"
            :error="submitButton && !state.formData.apellido_materno" 
            
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Fecha nacimiento</v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="date"
            v-model.trim="state.formData.fecha_nacimiento"
            @input="miValidacion(), state.formData.fecha_nacimiento= validateText(state.formData.fecha_nacimiento.toUpperCase())"
            :error="submitButton && !state.formData.fecha_nacimiento"
            
            hide-details
          />
         
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Nombre de usuario<span style="color:red">(*)</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_usuario"
            @input="miValidacion(), state.formData.nombre_usuario= validateText(state.formData.nombre_usuario.toUpperCase())"
            :error="submitButton && !state.formData.nombre_usuario"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_usuario">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Contraseña<span style="color:red">(*)</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="password"
            v-model.trim="state.formData.contrasena"
            @input="miValidacion(), state.formData.contrasena"
            :error="submitButton && !state.formData.contrasena"
            hide-details
          />
          <template v-if="submitButton && !state.formData.contrasena">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Correo electrónico<span style="color:red">(*)</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="email"
            v-model.trim="state.formData.correo_electronico" 
            @input="miValidacion(), state.formData.correo_electronico= validateText(state.formData.correo_electronico)"
            :error="submitButton && !state.formData.correo_electronico"
            hide-details
          />
          <template v-if="submitButton && state.formData.correo_electronico && !testEmail">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      Debe ser un correo válido
                    </div>
                  </div>
          </template>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Celular</v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="number"
            v-model="state.formData.celular"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Taller<span style="color:red">(*)</span></v-label>
          <v-select
            :items="taller"
            item-title="nombre_taller"
            item-value="id"
            v-model="state.formData.id_taller"
            :error="submitButton && !state.formData.id_taller"
          />
          <template v-if="submitButton && !state.formData.id_taller">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Rol<span style="color:red">(*)</span></v-label>
          <v-select
            :items="perfiles"
            item-title="nombre_perfil"
            item-value="id"
            v-model="state.formData.id_perfil"
             @update:model-value="setMenu()"
            :error="submitButton && !state.formData.id_perfil"
          />
          <template v-if="submitButton && !state.formData.id_perfil">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12" class="mb-5">

          <h3 class="my-3 text-primary">Menu</h3>
          <v-container fluid>
            <v-row>
              <template v-for="menu in menu_independiente" :key="menu.id">
  <!-- Si el menú es 'Talleres' o 'Busqueda Reporte', y no cumple la condición, se deshabilita -->
              <v-col cols="12" md="4" class="low-col">
                <v-checkbox
                  v-model="state.formData.menu"
                  :label="menu.titulo"
                  color="error"
                  :value="menu.id"
                  hide-details
                  @click="evaluateCheckbox(menu.id)"
                  :disabled="(menu.titulo == 'Talleres' || menu.titulo == 'Busqueda Reporte') && !(usertaller == 1 || usert == 1)" 
             
                />
                <v-switch
                  class="pl-3 my-0"
                  v-model="state.formData.ediciones"
                  label="Editar"
                  color="secondary"
                  :value="menu.id"
                  hide-details
                  :disabled="evaluateCheckbox(menu.id) || ((menu.titulo == 'Talleres' || menu.titulo == 'Busqueda Reporte') && !(usertaller == 1 || usert == 1))"
                  
                />
              </v-col>
            </template>

            </v-row>
          </v-container>

          <template v-for="menu in menu_padre" :key="menu.id">
            <h3 class="my-3 text-primary">{{ menu.titulo }}</h3>
            <v-container fluid>
              <v-row>
                <template v-for="submenu in submenu_independiente" :key="submenu.id">
                  <template v-if="menu.id == submenu.padre">
                    <v-col cols="12" md="4" class="low-col">
                      <v-checkbox
                        v-model="state.formData.menu"
                        :label="submenu.titulo"
                        color="error"
                        v-bind:value="submenu.id"
                        hide-details
                        @click="evaluateCheckbox(submenu.id)"
                        :disabled="(submenu.titulo == 'Perfil' || submenu.titulo == 'Servicios') && !(usertaller == 1 || usert == 1)" 
                      />
                      <v-switch
                        class="pl-3 my-0"
                        v-model="state.formData.ediciones"
                        label="Editar"
                        color="secondary"
                        v-bind:value="submenu.id"
                        hide-details
                        :disabled="evaluateCheckbox(submenu.id) || (submenu.titulo == 'Perfil'  || submenu.titulo == 'Servicios') && !(usertaller == 1 || usert == 1)"
                        
                      />
                    </v-col>
                  </template>
                </template>
              </v-row>
              <template v-if="usertaller == 1  || usert == 1">
              <template v-for="submenu in submenu_padre" :key="submenu.id">
                <template v-if="menu.id == submenu.padre">
                  <h3 class="mb-5 text-primary">{{ submenu.titulo }}</h3>
                  <v-row>
                    <template v-for="s_submenu in s_submenu_independiente" :key="s_submenu.id">
                      <template v-if="submenu.id == s_submenu.padre">
                        <v-col cols="12" md="4" class="low-col">
                          <v-checkbox
                            v-model="state.formData.menu"
                            :label="s_submenu.titulo"
                            color="error"
                            v-bind:value="s_submenu.id"
                            hide-details
                            @click="evaluateCheckbox(s_submenu.id)"
                          />
                          <v-switch
                            class="pl-3 my-0"
                            v-model="state.formData.ediciones"
                            label="Editar"
                            color="secondary"
                            v-bind:value="s_submenu.id"
                            hide-details
                            :disabled="evaluateCheckbox(s_submenu.id)"
                          />
                        </v-col>
                      </template>
                    </template>
                  </v-row>

                  
                    <template v-for="s_submenu in s_submenu_padre" :key="s_submenu.id">
                    <template v-if="submenu.id == s_submenu.padre">
                      <h3 class="my-3 text-info">- {{ s_submenu.titulo }}</h3>
                      <v-row>
                        <template v-for="t_submenu in t_submenu_independiente" :key="t_submenu.id">
                          <template v-if="s_submenu.id == t_submenu.padre">
                            <v-col cols="12" md="4" class="low-col">
                              <v-checkbox
                                v-model="state.formData.menu"
                                :label="t_submenu.titulo"
                                color="error"
                                v-bind:value="t_submenu.id"
                                hide-details
                                @click="evaluateCheckbox(t_submenu.id)"
                              />
                              <v-switch
                                class="pl-3 my-0"
                                v-model="state.formData.ediciones"
                                label="Editar"
                                color="secondary"
                                v-bind:value="t_submenu.id"
                                hide-details
                                :disabled="evaluateCheckbox(t_submenu.id)"
                              />
                            </v-col>
                          </template>
                        </template>
                      </v-row>
                    </template>
                  </template>
                  </template>
                </template>
              </template>
            </v-container>
          </template>
          
        </v-col>
      </v-row>

      <p class="text-lg-left">
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