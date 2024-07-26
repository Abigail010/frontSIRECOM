<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useJewelMaterialMetalStore } from '@/stores/resources/jewelMaterialMetal';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const jewelMaterialMetalStore = useJewelMaterialMetalStore()

  // BREADCRUMB  
  const page = ref({ title: 'Joya de Material Metal' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Joya de Material Metal',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_metal: '',
      medida: '',
      abreviacion: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA JOYA DE MATERIAL PIECRA
  const getJewelMaterialMetalById = async (id: any) => {
    const respuesta = await jewelMaterialMetalStore.jewelMaterialMetal(id)
    state.formData.id = respuesta.id
    state.formData.nombre_metal = respuesta.nombre_metal
    state.formData.medida = respuesta.medida
    state.formData.abreviacion = respuesta.abreviacion
  }

  // VALIDACIONES
  
  const rules = computed(() => {
    return {
      formData: {
        nombre_metal: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'jewelMaterialMetalList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return

    const { ok, message } = (route.params.id_joya_material_metal == '0') ? await jewelMaterialMetalStore.createJewelMaterialMetal(state.formData) : await jewelMaterialMetalStore.updateJewelMaterialMetal(state.formData)
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
    if(route.params.id_joya_material_metal != '0'){
      getJewelMaterialMetalById(route.params.id_joya_material_metal)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DE LA JOYA DE MATERIAL METAL:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre metal<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_metal"
            @input="state.formData.nombre_metal = validateText(state.formData.nombre_metal.toUpperCase())"
            :error="v$.formData.nombre_metal.$error"
            :error-messages="errors.nombre_metal"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Medida</v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.medida"
            @input="state.formData.medida = validateText(state.formData.medida.toUpperCase())"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Abreviación</v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              type="text"
              v-model.trim="state.formData.abreviacion"
              @input="state.formData.abreviacion = validateText(state.formData.abreviacion.toUpperCase())"
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