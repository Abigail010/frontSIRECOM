<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useImmovablePropertyEnviromentStore } from '@/stores/resources/immovablePropertyEnviroment';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const immovablePropertyEnviromentStore = useImmovablePropertyEnviromentStore()

  // BREADCRUMB  
  const page = ref({ title: 'Ambiente' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Ambiente',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_ambiente: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DEL AMBIENTE
  const getPropertyEnviromentById = async (id: any) => {
    const respuesta = await immovablePropertyEnviromentStore.immovablePropertyEnviroment(id)
    state.formData.id = respuesta.id
    state.formData.nombre_ambiente = respuesta.nombre_ambiente
  }

  // VALIDACIONES
  
  const rules = computed(() => {
    return {
      formData: {
        nombre_ambiente: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'immovablePropertyEnviromentList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return

    const { ok, message } = (route.params.id_inmueble_ambiente == '0') ? await immovablePropertyEnviromentStore.createImmovablePropertyEnviroment(state.formData) : await immovablePropertyEnviromentStore.updateImmovablePropertyEnviroment(state.formData)
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
    if(route.params.id_inmueble_ambiente != '0'){
      getPropertyEnviromentById(route.params.id_inmueble_ambiente)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL AMBIENTGE:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12">
          <v-label class="mb-2 font-weight-medium">Nombre ambiente<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_ambiente"
            @input="state.formData.nombre_ambiente = validateText(state.formData.nombre_ambiente.toUpperCase())"
            :error="v$.formData.nombre_ambiente.$error"
            :error-messages="errors.nombre_ambiente"
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