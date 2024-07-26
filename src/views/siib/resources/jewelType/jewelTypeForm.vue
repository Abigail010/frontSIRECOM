<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useJewelTypeStore } from '@/stores/resources/jewelType';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const jewelTypeStore = useJewelTypeStore()

  // BREADCRUMB  
  const page = ref({ title: 'Tipo de joya' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Tipo de joya',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_joya: ''
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DEL TIPO DE JOYA
  const getJewelTypeById = async (id: any) => {
    const respuesta = await jewelTypeStore.jewelType(id)
    state.formData.id = respuesta.id
    state.formData.nombre_joya = respuesta.nombre_joya
  }

  // VALIDACIONES
  
  const rules = computed(() => {
    return {
      formData: {
        nombre_joya: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'jewelTypeList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return

    const { ok, message } = (route.params.id_joya_tipo == '0') ? await jewelTypeStore.createJewelType(state.formData) : await jewelTypeStore.updateJewelType(state.formData)
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
    if(route.params.id_joya_tipo != '0'){
      getJewelTypeById(route.params.id_joya_tipo)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DE LOS TIPOS DE JOYAS:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12">
          <v-label class="mb-2 font-weight-medium">Nombre tipo de joya<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_joya"
            @input="state.formData.nombre_joya = validateText(state.formData.nombre_joya.toUpperCase())"
            :error="v$.formData.nombre_joya.$error"
            :error-messages="errors.nombre_joya"
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