<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { validateText } from '@/utils/helpers/validateText'
import Logo from '@/layouts/full/logo/Logo.vue';
import Swal from 'sweetalert2'

const state = reactive({
  formData: {
    username: '',
    password: '',
  }
})

document.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      buttonSendForm();
    } 
});

const showPassword = ref(false)
const sendForm = ref(true)
const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.username || !state.formData.password){
    sendForm.value = false
  }
}

const submitButton = ref(false)
const buttonSendForm = async () => {
  submitButton.value = true
  await miValidacion()
  if(!sendForm.value) return

  const authStore = useAuthStore()
  const { ok, message } = await authStore.login(state.formData.username, state.formData.password)
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
  }
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
</script>

<template>
<div class="pa-3 prueba" >
    <v-row class="h-100vh mh-100 auth ">
      <v-col cols="12" lg="4" xl="4" class="d-lg-flex align-center justify-center  position-relative">
        <div></div>
      </v-col>
      
      <v-col cols="12" lg="3" xl="4" class="d-flex align-center justify-center login_" >
        <div class="mt-xl-0 mt-5 mw-100" >
          <div class="text-center mb-3">
            <img
              class="imagen"
              src="@/assets/images/misimagenes/logo.png"
            />
          </div>
          
          <!-- Cambia el color y el tamaño de "INICIO DE SESIÓN" -->
          <h2 class="text-center mb-2" style="color: black; font-size: 2.1rem; font-weight: bold;">
            INICIO DE SESIÓN
          </h2>
          
          <div class="d-flex align-center text-center mb-6">
            <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
              <span class="bg-surface px-5 py-3 position-relative"></span>
            </div>  
          </div>
          
          <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText"><b>Nombre de Usuario</b></v-label>
          <VTextField
            v-model.trim="state.formData.username"
            @input="miValidacion(), state.formData.username = validateText(state.formData.username)"
            :error="submitButton && !state.formData.username"
            hide-details
          />
          
          <template v-if="submitButton && !state.formData.username">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error">
                El campo es requerido
              </div>
            </div>
          </template>
          
          <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText"><b>Contraseña</b></v-label>
          <VTextField
            v-model.trim="state.formData.password"
            :error="submitButton && !state.formData.password"
            :type="showPassword ? 'text' : 'password'"
            color="primary"
            hide-details
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            @input="state.formData.password = validateText(state.formData.password)"
          />
          
          <template v-if="submitButton && !state.formData.password">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error">
                El campo es requerido
              </div>
            </div>
          </template>
          
          <v-btn size="large" class="mt-5" color="primary" block @click="buttonSendForm()">Ingresar</v-btn>
        </div>
      </v-col>
      
      <v-col cols="12" lg="5" xl="4" class="d-lg-flex align-center justify-center  position-relative">
        <div></div>
      </v-col>
    </v-row>
</div>
  
</template>


<style lang="css">
  .prueba{
   background-image: url('../../../assets/images/misimagenes/opcion1.png');
   background-size: 1600px 800px; /* Ajusta el tamaño a 300px de ancho y 200px de alto */
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%; /* Asegúrate de que el contenedor tenga una altura definida */
  
  }

  .login_{
    background-color: white; 
    width:  80%;
     height: 70%;
     margin-top: 10%;
    
     border-radius: 40px ;
  }
  .imagen{
    width: 30%; 
    height: 50%; 
    border-radius: 50%;
  }
</style>


