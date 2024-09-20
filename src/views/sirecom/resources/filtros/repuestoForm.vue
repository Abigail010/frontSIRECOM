<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { usefilterStore } from '@/stores/resources/filtro';
import { useSystemStore } from '@/stores/resources/system';

import { validateText } from '@/utils/helpers/validateText'
import { setDate } from 'date-fns';

  const route = useRoute()
  const repuestoStore = usefilterStore()
  const sistemaStore = useSystemStore()
  // BREADCRUMB  
  const page = ref({ title: 'Registro de filtro' });
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
  const getsystemById = async (id_filtro: any) => {
    const respuesta = await repuestoStore.filter(id_filtro)
   
    state.formData.id = respuesta.id
    state.formData.nombre_repuesto=respuesta.nombre_repuesto
    state.formData.nombre_clase=respuesta.clase
    state.formData.nombre_tm = respuesta.tipo_motor
    state.formData.nombre_sistema = respuesta.id_sistema
    state.formData.nombre_marca = respuesta.uno
    state.formData.nombre_tipo = respuesta.dos
    state.formData.id_tipo_repuesto = respuesta.id_tipo_repuesto
    state.formData.union = respuesta.tipo

  }

  const desserts = ref([]) as any
  const desserts2 = ref([]) as any
  const desserts3 = ref([]) as any
  const desserts4 = ref([]) as any
  const desserts5 = ref([]) as any
  const desserts6 = ref([]) as any
  const desserts7 = ref([]) as any
  const getrepuestosList = async() => {
    desserts.value = await repuestoStore.filters()
    desserts2.value = await repuestoStore.clase()
    desserts3.value = await repuestoStore.tipo()
    desserts4.value = await repuestoStore.marcas()
    desserts5.value = await repuestoStore.motor()
    desserts7.value = await repuestoStore.repuestos()
    desserts6.value = await sistemaStore.systems()
  }

  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.nombre_sistema || !state.formData.nombre_repuesto ){
    sendForm.value = false
  }
}

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'filtroList' })
  }

const submitButton = ref(false)
const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
        const { ok, message } = (route.params.id_filtro == '0') ? await repuestoStore.createfilter(state.formData) : await repuestoStore.updatefilter(state.formData)
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
    getrepuestosList()
    if(route.params.id_filtro != '0'){
       
      getsystemById(route.params.id_filtro)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL FILTRO:</strong> Los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>

      <v-row><v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Sistema <span style="color:red">(*)</span></v-label>
          <v-autocomplete
        variant="outlined"
        color="primary"
        :items="desserts6"
          v-model="state.formData.nombre_sistema"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id"
          item-title="nombre_sistema"
        />
         
          <template v-if="submitButton && !state.formData.nombre_sistema">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Clase</v-label>
          <v-autocomplete
        variant="outlined"
        color="primary"
        :items="desserts2"
          v-model="state.formData.nombre_clase"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_clase"
          item-title="nombre_clase"
        />
         
      
        </v-col>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Marca</v-label>
          <v-autocomplete
            variant="outlined"
            color="primary"
            :items="desserts4"
              v-model="state.formData.nombre_marca"
              no-data-text="No existe más opciones para seleccionar"
              item-value="nombre_marca"
              item-title="nombre_marca"
              
            />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Tipo </v-label>
          <v-autocomplete
            variant="outlined"
            color="primary"
            :items="desserts3"
            v-model="state.formData.nombre_tipo"
            no-data-text="No existe más opciones para seleccionar"
            item-value="nombre_tipo"
            item-title="nombre_tipo"
        />
         
      
        </v-col>
       <template v-if="(state.formData.nombre_marca !='' && state.formData.nombre_tipo != '') || state.formData.union !=''">
        <v-col cols="12" md= "6">
          <v-label class="mb-2 font-weight-medium">Caracteristica</v-label>
          <v-text-field
                  variant="outlined"
                  color="primary"
                  type="text"
                  :readonly="editar"
                  v-model.trim="state.formData.union"
                   :value="state.formData.union ||`${state.formData.nombre_marca}  ${state.formData.nombre_tipo}`"
                  @input="state.formData.union"
                  hide-details
                ></v-text-field>
        </v-col>
       </template>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Tipo motor</v-label>
          <v-autocomplete
          variant="outlined"
          color="primary"
          :items="desserts5"
          v-model="state.formData.nombre_tm"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_tipo"
          item-title="nombre_tipo"
        />
        </v-col>
        
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Repuesto<span style="color:red">(*)</span></v-label>
          <v-autocomplete
          variant="outlined"
          color="primary"
          :items="desserts7"
          v-model="state.formData.nombre_repuesto"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_repuesto"
          item-title="nombre_repuesto"
         
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