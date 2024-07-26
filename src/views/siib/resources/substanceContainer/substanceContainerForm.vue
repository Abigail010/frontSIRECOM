<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useSubstanceContainerStore } from '@/stores/resources/substanceContainer';
import { validateText } from '@/utils/helpers/validateText'
// import { useVuelidate } from '@vuelidate/core'
// import { required, email, helpers } from '@vuelidate/validators'
// import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
// import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const substanceContainerStore = useSubstanceContainerStore()

  // BREADCRUMB  
  const page = ref({ title: 'CONTENEDOR DE SUSTANCIAS' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Contenedor de sustancias',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_contenedor: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DEL CONTENEDOR DE SUSTANCIAS
  const getSubstanceContainerById = async (id: any) => {
    const respuesta = await substanceContainerStore.substanceContainer(id)
    state.formData.id = respuesta.id
    state.formData.nombre_contenedor = respuesta.nombre_contenedor
  }

  // VALIDACIONES
  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_contenedor){
    sendForm.value = false
  }
}


  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'substanceContainerList' })
  }

  // BOTON ENVIAR FORMULARIO
  // const buttonSendForm = async () => {
  //   const result = await v$.value.$validate()
  //   if(!result) return

  //   const { ok, message } = (route.params.id_sustancia_contenedor == '0') ? await substanceContainerStore.createSubstanceContainer(state.formData) : await substanceContainerStore.updateSubstanceContainer(state.formData)
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
    const { ok, message } = (route.params.id_sustancia_contenedor == '0') ? await substanceContainerStore.createSubstanceContainer(state.formData) : await substanceContainerStore.updateSubstanceContainer(state.formData)
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
    if(route.params.id_sustancia_contenedor != '0'){
      getSubstanceContainerById(route.params.id_sustancia_contenedor)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL CONTENEDOR DE SUSTANCIAS:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre contenedor<span style="color:red">*</span></v-label>
          <!-- <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_contenedor"
            @input="state.formData.nombre_contenedor = validateText(state.formData.nombre_contenedor.toUpperCase())"
            :error="v$.formData.nombre_contenedor.$error"
            :error-messages="errors.nombre_contenedor"
          >
          </v-text-field> -->
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_contenedor"
            @input="miValidacion(), state.formData.nombre_contenedor= validateText(state.formData.nombre_contenedor.toUpperCase())"
            :error="submitButton && !state.formData.nombre_contenedor"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_contenedor">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
      </v-row>

      <p class="mt-2 text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>