<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import back2 from '@/assets/images/misimagenes/back2.png';
// components
import ProfileBanner from '@/components/apps/user-profile/ProfileBanner.vue';
import IntroCard from '@/components/apps/user-profile/IntroCard.vue';
import PhotosCard from '@/components/apps/user-profile/PhotosCard.vue';
import PostListing from '@/components/apps/user-profile/PostListing.vue';
import AddPost from '@/components/apps/user-profile/posts/AddPost.vue';
import PersonalInfoTab from '@/components/forms/form-vertical/PersonalInfoTab.vue';
import AccountDetailsTab from '@/components/forms/form-vertical/AccountDetailsTab.vue';
import SocialLinksTab from '@/components/forms/form-vertical/SocialLinksTab.vue';
import UiParentCardLogo from '@/components/shared/UiParentCardLogo.vue';
import VeeValidation from '@/components/forms/form-validation/VeeValidation.vue'
import { Form } from "vee-validate";
import * as Yup from "yup";
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { useResourceStore } from '@/stores/resource';
import { useSearchStore } from '@/stores/resources/busqueda';
import card_icon1 from "@/assets/images/svgs/icon-user-male.svg"
import { ref, reactive, onMounted } from 'vue';
import { validateText } from '@/utils/helpers/validateText'
import Swal from 'sweetalert2'
import { useUserStore } from '@/stores/resources/user';
const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const route = useRoute()
import { useTallerStore } from '@/stores/resources/taller';
const orden = useSearchStore()
const tipo=['PROPIO', 'EXTERNO']
const fuerza = ['CEO', 'DIABLOS VERDES', 'FELCN']
import TextInput from '@/components/forms/form-validation/TextInput.vue';
const userStore = useUserStore()
const resourceStore = useResourceStore()
const tab = ref(null);
const page = ref({ title: 'Información del usuario' });
const show2 = ref(false);
const show3 = ref(false);
const genero_ = ['MASCULINO', 'FEMENINO']
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/'
    },
    {
        text: 'Usuario',
        disabled: true,
        href: '#'
    }
]);


const nombres = JSON.parse(localStorage.getItem('user') || '').nombres
const apellido_paterno = JSON.parse(localStorage.getItem('user') || '').apellido_paterno
const apellido_materno = JSON.parse(localStorage.getItem('user') || '').apellido_materno
const nombre_perfil = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const nombre_usuario = JSON.parse(localStorage.getItem('user') || '').nombre_usuario
const cedula_identidad = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
const correo_electronico = JSON.parse(localStorage.getItem('user') || '').correo_electronico
const imagen = JSON.parse(localStorage.getItem('user') || '').imagen
const tallerStore = useTallerStore()
const state = reactive({
    formData: {
      id: '',
       fecha_nac:'', 
       celular:'', 
       genero:'', 
       usuario:'', 
       contraseña:'', 
       correo_electronico:'',
       nombre_usuario:'', 
       password_:'', 
       id_taller:'', 
       id_persona:'', 
       id_usuario:'', 
    
    }, formDataT:{
       id:'', 
       nombre_taller: '',
      departamento: '',
      provincia: '', 
      municipio: '', 
      direccion_taller: '',
    tipo_taller:'',
    fuerza_taller: '',
    servicio_taller: '', 
    }, 
  });

  const departamentos = ref([])
  const getDepartmentsList = async() => {
    departamentos.value = await resourceStore.getDepartments()
  }

  const servicios = ref([])
  const getServicios = async() => {
    servicios.value = await resourceStore.getSerivicio_t()
    
  }

function onInvalidSubmit() {
  const submitBtn = document.querySelector(".submit-btn");
//  submitBtn.classList.add("invalid");
  setTimeout(() => {
    //submitBtn.classList.remove("invalid");
  }, 1000);
}
const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

    // VALIDACIONES
    const sendForm = ref(true)
  const miValidacion = async () => {
    sendForm.value = true
    if(!state.formDataT.direccion_taller || !state.formDataT.departamento || !state.formDataT.tipo_taller){ //
      sendForm.value = false
    }
  }

   // BOTON RETORNAR
   const buttonReturnList = () => {
     router.push({ name: 'tallerList' })
   }

  const submitButton = ref(false)

  const getGen = async () => {
    const info = await orden.getInfoB();
    state.formData.id_taller= info.id_taller
    state.formData.id_usuario = info.id
    state.formData.id_persona = info.id_persona
    state.formData.celular = info.celular
    state.formData.fecha_nac = info.fecha_nacimiento
    state.formData.genero = info.genero
    state.formData.correo_electronico = correo_electronico
    state.formData.nombre_usuario = nombre_usuario
    //console.log(state.formData.fecha_nac)
    const respuesta = await tallerStore.taller_id(state.formData.id_taller)
    state.formDataT.id = respuesta.id
    state.formDataT.nombre_taller = respuesta.nombre_taller
    state.formDataT.departamento = respuesta.ciudad
    state.formDataT.direccion_taller = respuesta.direccion
    state.formDataT.municipio = respuesta.municipio
    state.formDataT.provincia = respuesta.provincia
    state.formDataT.tipo_taller =respuesta.tipo
    state.formDataT.fuerza_taller = respuesta.fuerza
    state.formDataT.servicio_taller = respuesta.servicio
   // console.log(info.id_taller)
    

   // console.log(users)
  }
  const buttonSendForm = async () => {

submitButton.value = true
  await miValidacion()
  if(!sendForm.value)return 
  const { ok, message } =  await userStore.updateOne(state.formData)
      const icono = (ok ? 'success' : 'error')
      Swal.fire({
     icon: icono,
     title: message,
     timer: 1500,
     showConfirmButton: false,
    timerProgressBar: true
    
   })
   window.location.reload()
}

const buttonSendFormT = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
    const { ok, message } =  await tallerStore.updateTallerU(state.formDataT)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
       icon: icono,
       title: message,
       timer: 1500,
       showConfirmButton: false,
      timerProgressBar: true
     })
     window.location.reload()
  }

  onMounted( async () => {
    await getDepartmentsList()
    await getServicios()
    await getGen()
    //if(route.params.id_taller != '0'){
      //await getTallerId(route.params.id_taller)
      //editar.value = true
    //}
  })
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    
    <v-card elevation="10" class="overflow-hidden">
      <!-- <img :src="profileBg" alt="profile" class="w-100"/> -->
      
      <div>
        <v-row class="mt-1">
          <v-col cols="12" lg="12" class="d-flex justify-center order-sml-first mb-5">
            <div class="text-center top-">
             
              <h5 class="text-h5 mt-3">{{ nombres }} {{ apellido_paterno }} {{ apellido_materno }}</h5>
              <span class="text-h6 font-weight-regular">{{ nombre_perfil }}</span>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  
 
    <v-row>
        <v-col cols="12">
          
            <v-card elevation="10" class=" " rounded="md">
               
                <v-tabs v-model="tab" bg-color="transparent" color="primary">
                    <v-tab value="PersonalInfo" class="text-medium-emphasis">Información Personal </v-tab>
                    <v-tab value="AccountDetails" class="text-medium-emphasis">Información Basica</v-tab>
                    <v-tab value="SocialLinks" class="text-medium-emphasis">Taller</v-tab>
                </v-tabs>
                <v-divider></v-divider>
                <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
                    <v-window v-model="tab">
                        <v-window-item value="PersonalInfo">
                            <v-row>
        <v-col cols="12" md="6">
            <div class="mb-6">
                <v-label class="font-weight-medium mb-2">Nombres</v-label>
                <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="nombres"
                    hide-details
                    disabled
                  ></v-text-field>
            </div>
            <div class="mb-6">
                <v-label class="mb-2 font-weight-medium">Apellido Materno</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="email"
                    v-model="apellido_materno"
                    hide-details
                    disabled
                  ></v-text-field>
            </div>
            <div>
                <v-label class="mb-2 font-weight-medium">Cedula de Identidad</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="cedula_identidad"
                    hide-details
                    disabled
                  ></v-text-field>
            </div>
        </v-col>
        <v-col cols="12" md="6">
            <div class="mb-6">
            <v-label class="mb-2 font-weight-medium">Apellido Paterno</v-label>
                    <v-text-field
                      color="primary"
                      variant="outlined"
                      type="text"
                      v-model="apellido_paterno"
                      hide-details
                      disabled
                    ></v-text-field>
                    </div>
            <div class="mb-6">
                <v-label class="mb-2 font-weight-medium">Perfil de usuario</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="nombre_perfil"
                    hide-details
                    disabled
                  ></v-text-field>
            </div>
            <div>
                <v-label class="mb-2 font-weight-medium">Fecha nacimiento<span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="date"
            v-model.trim="state.formData.fecha_nac"
            @input="miValidacion(), state.formData.fecha_nac= validateText(state.formData.fecha_nac.toUpperCase())"
            :error="submitButton && !state.formData.fecha_nac"
            
            hide-details
          />
          <template v-if="submitButton && !state.formData.fecha_nac">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
            </div>
        </v-col>
        <v-col cols="12">
            <v-btn color="primary" @click.prevent="buttonSendForm()" flat>Enviar</v-btn>
            <v-btn class="bg-lighterror text-error ml-4" flat>Cancelar</v-btn>
        </v-col>
    </v-row>
                        </v-window-item>
                        <v-window-item value="AccountDetails">
                            <v-row>
        <v-col cols="12" md="6">
                                    <v-label class="font-weight-medium mb-2">Nombre de usuario</v-label>
                                    <v-text-field color="primary" variant="outlined" type="text" v-model="state.formData.nombre_usuario" hide-details />
        </v-col>
        <v-col cols="12" md="6">
            <v-label class="font-weight-medium mb-2">Correo electrónico</v-label>
            <v-text-field color="primary" variant="outlined" type="email" v-model="state.formData.correo_electronico" suffix="@example.com" hide-details />
        </v-col>

        <v-col cols="12" md="6">
            <v-label class="font-weight-medium mb-2">Celular</v-label>
            <v-text-field color="primary" variant="outlined" type="text" v-model="state.formData.celular" hide-details />
        </v-col>
        <v-col cols="12" md="6">
            <v-label class="font-weight-medium mb-2">Genero</v-label>
            
            <v-select
            v-model="state.formData.genero"
            :items="genero_"
            item-title="nombre_region"
            item-value="nombre_region"
            :error="submitButton && !state.formData.genero"
             

          ></v-select>
        </v-col>

        <v-col cols="12" md="6">
            <v-label class="font-weight-medium mb-2">Contraseña</v-label>
                <v-text-field
                    v-model="state.formData.contraseña"
                    color="primary"
                    variant="outlined"
                    :type="show2 ? 'text' : 'password'"
                    placeholder="**********"
                    hide-details
                    class="text-subtitle-1"
                    :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="show2 = !show2"
                    name="password" 
                >
                </v-text-field>
               <!---- <TextInput name="password"   type='password' success-message="Nice and secure!"  @click:append-inner="show2 = !show2" />-->
        </v-col>
        <v-col cols="12" md="6">
            <v-label class="font-weight-medium mb-2">Confirmar contraseña</v-label>
                <v-text-field
                   v-model="state.formData.password_"
                    color="primary"
                    variant="outlined"
                    :type="show3 ? 'text' : 'password'"
                    placeholder="********"
                    hide-details
                    class="text-subtitle-1"
                    :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="show3 = !show3"
                >
                </v-text-field>
        </v-col>    
        
        
      
        
        <v-col cols="12">
            <v-btn color="primary" flat @click.prevent="buttonSendForm()">Enviar</v-btn>
            <v-btn class="bg-lighterror text-error ml-4" flat>Cancelar</v-btn>
        </v-col>
    </v-row>
                        </v-window-item>
                        <v-window-item value="SocialLinks">
                            <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre</v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formDataT.nombre_taller"
            @input="miValidacion(), state.formDataT.nombre_taller= validateText(state.formDataT.nombre_taller.toUpperCase())"
            :error="submitButton && !state.formDataT.nombre_taller"
            hide-details
          />
        
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Departamento <span style="color:red">*</span></v-label>
          <v-select
            v-model="state.formDataT.departamento"
            :items="departamentos"
            item-title="nombre_region"
            item-value="nombre_region"
            :error="submitButton && !state.formDataT.departamento"
          ></v-select>
          <template v-if="submitButton && !state.formDataT.departamento">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
       
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Dirección <span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formDataT.direccion_taller"
            @input="miValidacion(), state.formDataT.direccion_taller= validateText(state.formDataT.direccion_taller.toUpperCase())"
            :error="submitButton && !state.formDataT.direccion_taller"
            hide-details
          />
          <template v-if="submitButton && !state.formDataT.direccion_taller">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Tipo <span style="color:red">*</span></v-label>
        
          <v-select
            v-model="state.formDataT.tipo_taller"
            :items="tipo"
            item-title="nombre_region"
            item-value="nombre_region"
            :error="submitButton && !state.formDataT.tipo_taller"
          ></v-select>
          <template v-if="submitButton && !state.formDataT.tipo_taller">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <template v-if="state.formDataT.tipo_taller != '' && state.formDataT.tipo_taller == 'EXTERNO'">
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">FUERZA</v-label>
            <v-select
              :items="fuerza"
              item-title="nombre_fuerza"
              item-value="nombre_fuerza"
              no-data-text="No existe más opciones para seleccionar"
              v-model="state.formDataT.fuerza_taller"
              clearable
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">SERVICIO </v-label>
            <v-select
              :items="servicios"
              item-title="nombre_servicio"
              item-value="nombre_servicio"
              no-data-text="No existe más opciones para seleccionar"
              v-model="state.formDataT.servicio_taller"
              clearable
            >
            </v-select>
          </v-col>
  </template>
  <v-col cols="12">
            <v-btn v-if="userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('ADMINISTRADOR')" color="primary" @click.prevent="buttonSendFormT()" flat>Enviar</v-btn>
            <v-btn class="bg-lighterror text-error ml-4" flat>Cancelar</v-btn>
        </v-col>
      </v-row>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>    
        </v-col>
        <v-col cols="12" lg="6" class="mb-0">
            <div>
   
       
  </div>        
        </v-col>
    </v-row>
  </template>
  
  <style lang="scss">
  .avatar-border {
      background-image: linear-gradient(rgb(80, 178, 252), rgb(244, 76, 102));
      border-radius: 50%;
      width: 110px;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      .userImage {
          border: 4px solid rgb(255, 255, 255);
      }
  }
  
  .top-spacer {
      margin-top: -95px;
  }
  
  .profiletab .v-slide-group__content {
      justify-content: end;
      .v-btn--variant-text .v-btn__overlay {
          background: transparent;
      }
  }
  
  @media (max-width: 1023px) {
      .order-sm-second {
          order: 2;
      }
      .order-sml-first {
          order: 1;
      }
      .order-sm-third {
          order: 3;
      }
      .order-sm-last {
          order: 4;
      }
  }
  
  .btn-brand-facebook {
      background-color: rgb(24, 119, 242) !important;
  }
  
  .btn-brand-twitter {
      background-color: rgb(29, 161, 242) !important;
  }
  .btn-brand-dribbble {
      background-color: rgb(234, 76, 137) !important;
  }
  .btn-brand-youtube {
      background-color: rgb(205, 32, 31) !important;
  }
  </style>
  


