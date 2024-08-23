<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useTallerStore } from '@/stores/resources/taller';
import { useResourceStore } from '@/stores/resource';
import { validateText } from '@/utils/helpers/validateText'
import { MapboxMap } from 'vue-mapbox-ts';
// import { useVuelidate } from '@vuelidate/core'
// import { required, helpers } from '@vuelidate/validators'
// import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
// import { useValidationErrors } from '@/stores/useValidationErrors';
const tallerStore = useTallerStore()

  const tipo=['PROPIO', 'EXTERNO']
  const fuerza = ['CEO', 'DIABLOS VERDES', 'FELCN']
  const route = useRoute()

  const resourceStore = useResourceStore()
  const myAccessToken = 'pk.eyJ1IjoiYXJpZWwxMTEiLCJhIjoiY2xmaDZpdnZoMHRvNzN1bnZyeXFwazgydyJ9.cgyfEI8x3E4-0Lo7P4t_jw'
  const zoom = ref(4)

  // BREADCRUMB  
  const page = ref({ title: 'Taller' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Registro/Edicion de taller',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_taller: '',
      departamento: '',
      provincia: '', 
      municipio: '', 
      direccion_taller: '',
    tipo_taller:'',
    fuerza_taller: '',
    servicio_taller: '', 
    }
  });

  const editar = ref<any>(false)
  
  const departamentos = ref([])
  const getDepartmentsList = async() => {
    departamentos.value = await resourceStore.getDepartments()
  }

  const servicios = ref([])
  const getServicios = async() => {
    servicios.value = await resourceStore.getSerivicio_t()
    
  }


  // FUNCION QUE OBTIENE LA INFORMACION DEL talle
  const getTallerId = async (id_taller: any) => {
    const respuesta = await tallerStore.taller_id(id_taller)
    state.formData.id = respuesta.id
    state.formData.nombre_taller = respuesta.nombre_taller
    state.formData.departamento = respuesta.ciudad
    state.formData.direccion_taller = respuesta.direccion
    state.formData.municipio = respuesta.municipio
    state.formData.provincia = respuesta.provincia
    state.formData.tipo_taller =respuesta.tipo
    state.formData.fuerza_taller = respuesta.fuerza
    state.formData.servicio_taller = respuesta.servicio
  }


    // VALIDACIONES
    const sendForm = ref(true)
  const miValidacion = async () => {
    sendForm.value = true
    if(!state.formData.direccion_taller || !state.formData.departamento || !state.formData.tipo_taller){ //
      sendForm.value = false
    }
  }

   // BOTON RETORNAR
   const buttonReturnList = () => {
     router.push({ name: 'tallerList' })
   }

  const submitButton = ref(false)

  const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
    const { ok, message } = (route.params.id_taller == '0') ? await tallerStore.createTaller(state.formData) : await tallerStore.updateTaller(state.formData)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
       icon: icono,
       title: message,
       timer: 1500,
       showConfirmButton: false,
      timerProgressBar: true
     })
  }

  onMounted( async () => {
    await getDepartmentsList()
    await getServicios()
    if(route.params.id_taller != '0'){
      await getTallerId(route.params.id_taller)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL TALLER:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre</v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_taller"
            @input="miValidacion(), state.formData.nombre_taller= validateText(state.formData.nombre_taller.toUpperCase())"
            :error="submitButton && !state.formData.nombre_taller"
            hide-details
          />
        
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Departamento <span style="color:red">*</span></v-label>
          <v-select
            v-model="state.formData.departamento"
            :items="departamentos"
            item-title="nombre_region"
            item-value="nombre_region"
            :error="submitButton && !state.formData.departamento"
          ></v-select>
          <template v-if="submitButton && !state.formData.departamento">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
       
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Dirección <span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.direccion_taller"
            @input="miValidacion(), state.formData.direccion_taller= validateText(state.formData.direccion_taller.toUpperCase())"
            :error="submitButton && !state.formData.direccion_taller"
            hide-details
          />
          <template v-if="submitButton && !state.formData.direccion_taller">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Tipo <span style="color:red">*</span></v-label>
        
          <v-select
            v-model="state.formData.tipo_taller"
            :items="tipo"
            item-title="nombre_region"
            item-value="nombre_region"
            :error="submitButton && !state.formData.tipo_taller"
          ></v-select>
          <template v-if="submitButton && !state.formData.tipo_taller">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <template v-if="state.formData.tipo_taller != '' && state.formData.tipo_taller == 'EXTERNO'">
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">FUERZA</v-label>
            <v-select
              :items="fuerza"
              item-title="nombre_fuerza"
              item-value="nombre_fuerza"
              no-data-text="No existe más opciones para seleccionar"
              v-model="state.formData.fuerza_taller"
              clearable
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">SERVICIO </v-label>
            <v-select
              :items="servicios"
              item-title="nombre_servicio"
              item-value="nombre_servicio"
              no-data-text="No existe más opciones para seleccionar"
              v-model="state.formData.servicio_taller"
              clearable
            >
            </v-select>
          </v-col>
  </template>
      </v-row>


      <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>