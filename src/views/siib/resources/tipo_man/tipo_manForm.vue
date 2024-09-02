<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useManStore } from '@/stores/resources/tipo_man';
import { validateText } from '@/utils/helpers/validateText'
  const route = useRoute()
  const servicios = useManStore()

  // BREADCRUMB  
  const page = ref({ title: 'Tipo de mantenimiento' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Registro',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_diagnostico: '',
      estado: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const getservicioById = async (id: any) => {
    const respuesta = await servicios.MantemID(id)
    state.formData.id = respuesta.id
    state.formData.nombre_diagnostico = respuesta.nombre_diagnostico
  }

  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_diagnostico){
    sendForm.value = false
  }
}
  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'tipo_manList' })
  }

const submitButton = ref(false)
const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
        const { ok, message } = (route.params.id_man== '0') ? await servicios.createMan(state.formData) : await servicios.updateMan(state.formData)
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
    if(route.params.id_man != '0'){
      getservicioById(route.params.id_man)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL TIPO DE MANTENIMIENTO:</strong> Los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre mantenimiento<span style="color:red">(*)</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_diagnostico"
            @input="miValidacion(), state.formData.nombre_diagnostico= validateText(state.formData.nombre_diagnostico.toUpperCase())"
            :error="submitButton && !state.formData.nombre_diagnostico"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_diagnostico">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
      </v-row>

      <p class="mt-2 text-lg-left">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>