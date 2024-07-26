<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useDependenceStore } from '@/stores/resources/dependence';
import { validateText } from '@/utils/helpers/validateText'

  const route = useRoute()
  const dependenceStore = useDependenceStore()

  // BREADCRUMB  
  const page = ref({ title: 'Dependencia' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Dependencia',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_dependencia: '',
      sigla_dependencia: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const getDependenceById = async (id: any) => {
    const respuesta = await dependenceStore.dependence(id)
    state.formData.id = respuesta.id
    state.formData.nombre_dependencia = respuesta.nombre_dependencia
    state.formData.sigla_dependencia = respuesta.sigla_dependencia
  }

  // // VALIDACIONES
  
  // const rules = computed(() => {
  //   return {
  //     formData: {
  //       nombre_dependencia: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
  //     }
  //   }
  // })
  // const v$ = useVuelidate(rules, state)
  // const errors:any = computed(
  //   () => useValidationErrors(v$.value.$errors)
  // )


  // VALIDACIONES
  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_dependencia){
    sendForm.value = false
  }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'dependenceList' })
  }

   // BOTON ENVIAR FORMULARIO
  // const buttonSendForm = async () => {
 //  const result = await v$.value.$miValidacion()
  //   if(!result) return

  //   const { ok, message } = (route.params.id_dependencia == '0') ? await dependenceStore.createDependence(state.formData) : await dependenceStore.updateDependence(state.formData)
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
    const { ok, message } = (route.params.id_dependencia == '0') ? await dependenceStore.createDependence(state.formData) : await dependenceStore.updateDependence(state.formData)
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
    if(route.params.id_dependencia != '0'){
      getDependenceById(route.params.id_dependencia)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DE LA DEPENDENCIA:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre dependencia<span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_dependencia"
            @input="miValidacion(), state.formData.nombre_dependencia= validateText(state.formData.nombre_dependencia.toUpperCase())"
            :error="submitButton && !state.formData.nombre_dependencia"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_dependencia">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Sigla dependencia</v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.sigla_dependencia"
            @input="state.formData.sigla_dependencia = validateText(state.formData.sigla_dependencia.toUpperCase())"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>