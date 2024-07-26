<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useDocumentaryReviewObservationStore } from '@/stores/resources/documentaryReviewObservation';
import { validateText } from '@/utils/helpers/validateText'

  const route = useRoute()
  const documentaryReviewObservationStore = useDocumentaryReviewObservationStore()

  // BREADCRUMB  
  const page = ref({ title: 'Revision Documental - Observaciones' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Observaciones',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_observacion: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA OBSERVACION
  const getDocumentaryReviewObservationById = async (id: any) => {
    const respuesta = await documentaryReviewObservationStore.documentaryReviewObservation(id)
    state.formData.id = respuesta.id
    state.formData.nombre_observacion = respuesta.nombre_observacion
  }

  // VALIDACIONES
  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_observacion){
    sendForm.value = false
  }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'documentaryReviewObservationList' })
  }

  // BOTON ENVIAR FORMULARIO
const submitButton = ref(false)
const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
    const { ok, message } = (route.params.id_revision_documental_observacion == '0') ? await documentaryReviewObservationStore.createDocumentaryReviewObservation(state.formData) : await documentaryReviewObservationStore.updateDocumentaryReviewObservation(state.formData)
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
    if(route.params.id_revision_documental_observacion != '0'){
      getDocumentaryReviewObservationById(route.params.id_revision_documental_observacion)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DE LA OBSERVACIÓN:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre observación<span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_observacion"
            @input="miValidacion(), state.formData.nombre_observacion= validateText(state.formData.nombre_observacion.toUpperCase())"
            :error="submitButton && !state.formData.nombre_observacion"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_observacion">
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