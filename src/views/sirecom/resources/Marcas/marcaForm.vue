<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useMarcasStore } from '@/stores/resources/marca';
import { validateText } from '@/utils/helpers/validateText'

  const route = useRoute()
  const Marcas = useMarcasStore()

  // BREADCRUMB  
  const page = ref({ title: 'Marcas' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Registro de Marcas para vehículo',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_Marca: '',
      estado: '',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const getMarcaById = async (id: any) => {
    console.log(+id)
    const respuesta = await Marcas.MarcasID(route.params.id_marca)
    //console.log(respuesta)
    state.formData.id = respuesta.id_marca
    state.formData.nombre_Marca = respuesta.nombre_marca
  }

  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_Marca){
    sendForm.value = false
  }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'MarcaList' })
  }


const submitButton = ref(false)
const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
        const { ok, message } = (route.params.id_marca == '0') ? await Marcas.createMarcas(state.formData) : await Marcas.updateMarcas(state.formData)
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
    if(route.params.id_Marca != '0'){
      getMarcaById(route.params.id_Marca)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL Marca:</strong> Los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre Marca <span style="color:red">(*)</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_Marca"
            @input="miValidacion(), state.formData.nombre_Marca= validateText(state.formData.nombre_Marca.toUpperCase())"
            :error="submitButton && !state.formData.nombre_Marca"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_Marca">
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