<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useVehicleIndustryStore } from '@/stores/resources/vehicleIndustry'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const vehicleIndustryStore = useVehicleIndustryStore()

  // BREADCRUMB  
  const page = ref({ title: 'Nueva Industria' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Listado de Industria',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_vehiculo_industria: ''
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA INDUSTRIA
  const getVehicleIndustryById = async (id: any) => {
    const respuesta = await vehicleIndustryStore.vehicleIndustry(id)
    state.formData.id = respuesta.id
    state.formData.nombre_vehiculo_industria = respuesta.nombre_vehiculo_industria
  }

  // VALIDACIONES
  
  const rules = computed(() => {
    return {
      formData: {
        nombre_vehiculo_industria: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'vehicleIndustryList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return

    const { ok, message } = (route.params.id_industria == '0') ? await vehicleIndustryStore.createVehicleIndustry(state.formData) : await vehicleIndustryStore.updateVehicleIndustry(state.formData)
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
    if(route.params.id_industria != '0'){
      getVehicleIndustryById(route.params.id_industria)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATO DE LA INDUSTRIA:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre Industria<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_vehiculo_industria"
            @input="state.formData.nombre_vehiculo_industria = validateText(state.formData.nombre_vehiculo_industria.toUpperCase())"
            :error="v$.formData.nombre_vehiculo_industria.$error"
            :error-messages="errors.nombre_vehiculo_industria"
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