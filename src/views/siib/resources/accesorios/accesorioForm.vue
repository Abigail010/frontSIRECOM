<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useaccesorioStore } from '@/stores/resources/accesorio';
import { validateText } from '@/utils/helpers/validateText'
//import { useVuelidate } from '@vuelidate/core'
//import { required, helpers } from '@vuelidate/validators'
//import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
//import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const accesorioStore = useaccesorioStore()

  // BREADCRUMB  
  const page = ref({ title: 'Accesorio' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Accesorio',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_accesorio: '',
      estado: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const getaccesorioById = async (id: any) => {
    const respuesta = await accesorioStore.accesorio(id)
    state.formData.id = respuesta.id
    state.formData.nombre_accesorio = respuesta.nombre_accesorio
  }

 
  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_accesorio){
    sendForm.value = false
  }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'accesorioList' })
  }

const submitButton = ref(false)
const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
        const { ok, message } = (route.params.id_accesorio == '0') ? await accesorioStore.createaccesorio(state.formData) : await accesorioStore.updateaccesorio(state.formData)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
        icon: icono,
        title: message,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
     })
  }
 
  onMounted(() => {
    if(route.params.id_accesorio != '0'){
      getaccesorioById(route.params.id_accesorio)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DE LA Accesorio:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre Accesorio<span style="color:red">*</span></v-label>
    
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_accesorio"
            @input="miValidacion(), state.formData.nombre_accesorio= validateText(state.formData.nombre_accesorio.toUpperCase())"
            :error="submitButton && !state.formData.nombre_accesorio"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_accesorio">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
      </v-row>

      <p class="mt-2 text-lg-left">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>