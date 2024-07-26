<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useSelfMovingTypeStore } from '@/stores/resources/selfMovingType';
import { validateText } from '@/utils/helpers/validateText'
// import { useVuelidate } from '@vuelidate/core'
// import { required, helpers } from '@vuelidate/validators'
// import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
// import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const selfMovingTypeStore = useSelfMovingTypeStore()

  // BREADCRUMB  
  const page = ref({ title: 'Tipo de semoviente' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Tipos de semoviente',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_semoviente: '',
      precio_base: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE SEMOVIENTE CLASE PRECIO BASE
  const getSelfMovingTypeById = async (id: any) => {
    const respuesta = await selfMovingTypeStore.selfMovingType(id)
    state.formData.id = respuesta.id
    state.formData.nombre_semoviente = respuesta.nombre_semoviente
    state.formData.precio_base = respuesta.precio_base
  }

  // VALIDACIONES
  
  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_semoviente && !state.formData.precio_base){
    sendForm.value = false
  }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'selfMovingTypeList' })
  }

  // BOTON ENVIAR FORMULARIO
  const submitButton = ref(false)
  const buttonSendForm = async () => {
  submitButton.value = true
  // state.formData.precio_base=parseInt(state.formData.precio_base)
    await miValidacion()
    if(!sendForm.value)return 
    const { ok, message } = (route.params.id_semoviente_tipo == '0') ? await selfMovingTypeStore.createSelfMovingType(state.formData) : await selfMovingTypeStore.updateSelfMovingType(state.formData)
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
    if(route.params.id_semoviente_tipo != '0'){
      getSelfMovingTypeById(route.params.id_semoviente_tipo)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DE LA SEMOVIENTE CLASE PRECIO BASE:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre semoviente<span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_semoviente"
            @input="miValidacion(), state.formData.nombre_semoviente= validateText(state.formData.nombre_semoviente.toUpperCase())"
            :error="submitButton && !state.formData.nombre_semoviente"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_semoviente">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>

        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Precio Base <span style="color:red">*</span></v-label> 
          <VTextField
            variant="outlined" 
            color="primary"
            type="Number"
             v-model.trim="state.formData.precio_base"
            @input="state.formData.precio_base = validateText(state.formData.precio_base)"
            :error="submitButton && !state.formData.nombre_semoviente"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_semoviente">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>

        </v-col>
      </v-row>

      <p class=" mt-2 text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>