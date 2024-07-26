<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useCourtStore } from '@/stores/resources/court';
import { useResourceStore } from '@/stores/resource';
import { validateText } from '@/utils/helpers/validateText'
// import { useVuelidate } from '@vuelidate/core'
// import { required, email, helpers } from '@vuelidate/validators'
// import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
// import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const courtStore = useCourtStore()
  const resourceStore = useResourceStore()

  // BREADCRUMB  
  const page = ref({ title: 'Juzgado' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Juzgado',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_juzgado: '',
      departamento: '',
      provincia: ''
    }
  });

  const editar = ref<any>(false)

  const lista_departamentos = ref([])
  const getDepartmentList = async () => {
    lista_departamentos.value = await resourceStore.getDepartments()
  }

  const lista_provincias = ref([])
  const getProvinceList = async (department: any) => {
    state.formData.provincia = ''
    lista_provincias.value = await resourceStore.getProvinces(department)
  }

  // FUNCION QUE OBTIENE LA INFORMACION DE LA JUZGADO
  const getCourtById = async (id: any) => {
    const respuesta = await courtStore.court(id)
    if(respuesta.departamento){
      await getProvinceList(respuesta.departamento)
    }
    state.formData.id = respuesta.id
    state.formData.nombre_juzgado = respuesta.nombre_juzgado
    state.formData.departamento = respuesta.departamento
    state.formData.provincia = respuesta.provincia
  }

  // // VALIDACIONES
  
  // const rules = computed(() => {
  //   return {
  //     formData: {
  //       nombre_juzgado: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
  //       departamento: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
  //     }
  //   }
  // })
  // const v$ = useVuelidate(rules, state)
  // const errors:any = computed(
  //   () => useValidationErrors(v$.value.$errors)
  // )
  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_juzgado){
    sendForm.value = false
  }
}



  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'courtList' })
  }

  // // BOTON ENVIAR FORMULARIO
  // const buttonSendForm = async () => {
  //   const result = await v$.value.$validate()
  //   if(!result) return

  //   const { ok, message } = (route.params.id_juzgado == '0') ? await courtStore.createCourt(state.formData) : await courtStore.updateCourt(state.formData)
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
    const { ok, message } = (route.params.id_juzgado == '0') ? await courtStore.createCourt(state.formData) : await courtStore.updateCourt(state.formData)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
       icon: icono,
       title: message,
       timer: 1500,
       showConfirmButton: false,
      timerProgressBar: true
     })
  }


  onMounted(async () => {
    await getDepartmentList()
    if(route.params.id_juzgado != '0'){
      await getCourtById(route.params.id_juzgado)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL JUZGADO:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre juzgado<span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_juzgado"
            @input="miValidacion(), state.formData.nombre_juzgado= validateText(state.formData.nombre_juzgado.toUpperCase())"
            :error="submitButton && !state.formData.nombre_juzgado"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_juzgado">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Departamento<span style="color:red">*</span></v-label>
          <v-select
            v-model="state.formData.departamento"
            :items="lista_departamentos"
            item-title="nombre_region"
            item-value="nombre_region"
            @update:model-value="getProvinceList(state.formData.departamento);"
            :error="submitButton && !state.formData.departamento"
          ></v-select>
          <template v-if="submitButton && !state.formData.departamento">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Provincia<span style="color:red">*</span></v-label>
          <v-select
            v-model="state.formData.provincia"
            :items="lista_provincias"
            item-title="nombre_region"
            item-value="nombre_region"
          ></v-select>
        </v-col>
      </v-row>

      <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>