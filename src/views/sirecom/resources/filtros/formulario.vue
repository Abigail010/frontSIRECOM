<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useRepuestoStore } from '@/stores/resources/repuesto';


import { validateText } from '@/utils/helpers/validateText'
import { setDate } from 'date-fns';

  const route = useRoute()
  const repuestoStore = useRepuestoStore()

  // BREADCRUMB  
  const page = ref({ title: 'Registro del repuesto' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Filtro',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id_filtro: '',
      id: '',
      id_tipo_repuesto:'', 
      nombre_clase: '',
      nombre_tipo: '',
      nombre_marca:'',
      nombre_tm: '',
      nombre_sistema:'', 
      id_sistema: '', 
      union:'',
      estado: '',
      nombre_repuesto:'',
    }
  });

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const getsystemById = async (id: any) => {
    const respuesta = await repuestoStore.Repuesto(id)
   
    state.formData.id = respuesta.id
    state.formData.nombre_repuesto=respuesta.nombre_repuesto
   
  }

  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_repuesto){
    sendForm.value = false
  }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'repuestoList' })
  }

const submitButton = ref(false)
const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
        const { ok, message } = (route.params.id == '0') ? await repuestoStore.createRepuesto(state.formData) : await repuestoStore.updateRepuesto(state.formData)
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
 //   getrepuestosList()
    if(route.params.id != '0'){
       
      getsystemById(route.params.id)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL REPUESTO:</strong> Los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>

      <v-row><v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Nombre <span style="color:red">(*)</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_repuesto"
            @input="miValidacion(), state.formData.nombre_repuesto= validateText(state.formData.nombre_repuesto.toUpperCase())"
            :error="submitButton && !state.formData.nombre_repuesto"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_repuesto">
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