<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useReceptionLogisticsReasonStore } from '@/stores/resources/receptionLogisticsReason';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const receptionLogisticsReasonStore = useReceptionLogisticsReasonStore()

  // BREADCRUMB  
  const page = ref({ title: 'Logistica recepcion motivo' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Motivo',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_motivo: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DEL MOTIVO
  const getReceptionLogisticsReasonById = async (id: any) => {
    const respuesta = await receptionLogisticsReasonStore.receptionLogisticsReason(id)
    state.formData.id = respuesta.id
    state.formData.nombre_motivo = respuesta.nombre_motivo
  }

  // VALIDACIONES
  
  const rules = computed(() => {
    return {
      formData: {
        nombre_motivo: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'receptionLogisticsReasonList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return

    const { ok, message } = (route.params.id_logistica_recepcion_motivo == '0') ? await receptionLogisticsReasonStore.createReceptionLogisticsReason(state.formData) : await receptionLogisticsReasonStore.updateReceptionLogisticsReason(state.formData)
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
    if(route.params.id_logistica_recepcion_motivo != '0'){
      getReceptionLogisticsReasonById(route.params.id_logistica_recepcion_motivo)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL MOTIVO:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre motivo<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_motivo"
            @input="state.formData.nombre_motivo = validateText(state.formData.nombre_motivo.toUpperCase())"
            :error="v$.formData.nombre_motivo.$error"
            :error-messages="errors.nombre_motivo"
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