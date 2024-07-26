<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { useProfileStore } from '@/stores/resources/profile';
import { useResourceStore } from '@/stores/resource';
import { validateText } from '@/utils/helpers/validateText'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'

  const route = useRoute()
  const profileStore = useProfileStore()
  const resourceStore = useResourceStore()

  const submitButton = ref(false)
  const sendForm = ref(true)

  // BREADCRUMB  
  const page = ref({ title: 'Perfil' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Perfil',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_perfil: '',
      estado: '',
      menu: [] as any,
      ediciones: [] as any
    }
  });

  const editar = ref<any>(false)

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
        menu_independiente.value.push(lista[i])
      }
      if(lista[i].titulo && !lista[i].direccion && !lista[i].padre){
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

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const getProfileById = async (id: any) => {
    const respuesta = await profileStore.profile(id)
    state.formData.id = respuesta.id
    state.formData.nombre_perfil = respuesta.nombre_perfil
    for (let i = 0; i < respuesta.menus.length; i++) {
      state.formData.menu.push(respuesta.menus[i].id_menu)
      if(respuesta.menus[i].editar){
        state.formData.ediciones.push(respuesta.menus[i].id_menu)
      }
    }
  }

  // VALIDACIONES
  const validaciones = ref([]) as any
  const miValidacion = async () => {
    sendForm.value = true
    validaciones.value = []
    if(!state.formData.nombre_perfil || state.formData.menu.length == 0){
      sendForm.value = false
    }
  }

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'profileList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value) return
    const { ok, message } = (route.params.id_perfil == '0') ? await profileStore.createProfile(state.formData) : await profileStore.updateProfile(state.formData)
    const icono = (ok ? 'success' : 'error')
    if(ok){
      Swal.fire({
        icon: icono,
        title: message,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      })
    }else{
      Toast.fire({
        icon: icono,
        title: message,
      })
      submitButton.value = false
    }
  }

  const evaluateCheckbox = (id_permiso: any) => {
    const checkPermiso = state.formData.menu.find((permiso:any) => permiso == id_permiso)
    const checkEdicion = state.formData.ediciones.find((permiso:any) => permiso == id_permiso)
    if(!checkPermiso && checkEdicion){
      state.formData.ediciones = state.formData.ediciones.filter((permiso:any) => permiso != id_permiso)
    }
    return checkPermiso ? false : true
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  onMounted(async () => {
    await getMenuList()
    if(route.params.id_perfil != '0'){
      await getProfileById(route.params.id_perfil)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DE LA DELITO:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre perfil<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            hide-details
            v-model.trim="state.formData.nombre_perfil"
            @input="state.formData.nombre_perfil = validateText(state.formData.nombre_perfil.toUpperCase())"
          />
          <template v-if="submitButton && !state.formData.nombre_perfil">
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
              <template v-for="(menu, index) in menu_independiente" :key="menu.id">
                <v-col cols="12" md="4" class="low-col">
                  <v-checkbox
                    v-model="state.formData.menu"
                    :label="menu.titulo"
                    color="error"
                    v-bind:value="menu.id"
                    hide-details
                    @click="evaluateCheckbox(menu.id)"
                  />
                  <v-switch
                    class="pl-3 my-0"
                    v-model="state.formData.ediciones"
                    label="Editar"
                    color="secondary"
                    v-bind:value="menu.id"
                    hide-details
                    :disabled="evaluateCheckbox(menu.id)"
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
                      />
                      <v-switch
                        class="pl-3 my-0"
                        v-model="state.formData.ediciones"
                        label="Editar"
                        color="secondary"
                        v-bind:value="submenu.id"
                        hide-details
                        :disabled="evaluateCheckbox(submenu.id)"
                      />
                    </v-col>
                  </template>
                </template>
              </v-row>
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
            </v-container>
          </template>
          
          <template v-if="submitButton && state.formData.menu.length == 0">
            <div class="v-messages font-weight-black px-2 py-2 text-center">
              <div class="v-messages__message text-error ">
                Debe seleccionar al menos una opción
              </div>
            </div>
          </template>
        </v-col>
      </v-row>


      <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>