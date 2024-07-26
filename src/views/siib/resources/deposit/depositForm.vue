<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import { useDepositStore } from '@/stores/resources/deposit';
import { useResourceStore } from '@/stores/resource';
import { validateText } from '@/utils/helpers/validateText'
import { MapboxMap } from 'vue-mapbox-ts';
// import { useVuelidate } from '@vuelidate/core'
// import { required, helpers } from '@vuelidate/validators'
// import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
// import { useValidationErrors } from '@/stores/useValidationErrors';


  const route = useRoute()
  const depositStore = useDepositStore()
  const resourceStore = useResourceStore()
  const myAccessToken = 'pk.eyJ1IjoiYXJpZWwxMTEiLCJhIjoiY2xmaDZpdnZoMHRvNzN1bnZyeXFwazgydyJ9.cgyfEI8x3E4-0Lo7P4t_jw'
  const zoom = ref(4)

  // BREADCRUMB  
  const page = ref({ title: 'Deposito' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Deposito',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nombre_deposito: '',
      departamento: '',
      direccion_deposito: '',
      url_deposito: '',
      latitud: -16.4997452,
      longitud: -68.1297037,
      zoom: zoom.value
    }
  });

  const editar = ref<any>(false)
  
  const departamentos = ref([])
  const getDepartmentsList = async() => {
    departamentos.value = await resourceStore.getDepartments()
  }

  // FUNCION QUE OBTIENE LA INFORMACION DEL DEPOSITO
  const getDepositById = async (id: any) => {
    const respuesta = await depositStore.deposit(id)
    state.formData.id = respuesta.id
    state.formData.nombre_deposito = respuesta.nombre_deposito
    state.formData.departamento = respuesta.departamento
    state.formData.direccion_deposito = respuesta.direccion_deposito
    state.formData.url_deposito = respuesta.url_deposito
    state.formData.latitud = respuesta.latitud
    state.formData.longitud = respuesta.longitud
    state.formData.zoom = Number(respuesta.zoom)
  }

  const setUrl = () => {
    state.formData.url_deposito = (state.formData.latitud && state.formData.longitud) ? 'https://maps.google.com/?q=' + state.formData.latitud + ',' + state.formData.longitud : ''
    // if(state.formData.latitud && state.formData.longitud){
    //   state.formData.url_deposito = 'https://maps.google.com/?q=' + state.formData.latitud + ',' + state.formData.longitud
    // }else{
    //   state.formData.url_deposito = ''
    // }
  }

  const setZoom = async (data: any) => {
    if(route.params.id_deposito != '0'){
      const respuesta = await depositStore.deposit(route.params.id_deposito)
      data.setZoom(respuesta.zoom)
      data.setCenter([respuesta.longitud, respuesta.latitud])
    }
  }

  const updateZoom = (data: any) => {
    zoom.value = data.target.transform._zoom
  };

  // REGISTRO DE LATITUD LONGITUD EN BASE A BUCADOR DE MAP BOX
  const pushResult = (data: any) => {
    state.formData.longitud = data.center[0].toFixed(8)
    state.formData.latitud = data.center[1].toFixed(8)
    state.formData.url_deposito = 'https://maps.google.com/?q=' + data.center[1].toFixed(8) + ',' + data.center[0].toFixed(8)
  };

  // ACTUALIZACIÓN DE LATITUD LONGITUD EN BASE A ARRASTRE DEL PUNTERO MAP BOX
  const newPosition = (data: any) => {
    state.formData.longitud = data.target._lngLat.lng.toFixed(8)
    state.formData.latitud = data.target._lngLat.lat.toFixed(8)
    state.formData.url_deposito = 'https://maps.google.com/?q=' + data.target._lngLat.lat.toFixed(8) + ',' + data.target._lngLat.lng.toFixed(8)

  };

    // VALIDACIONES
    const sendForm = ref(true)
  const miValidacion = async () => {
    sendForm.value = true
    if( !state.formData.nombre_deposito || !state.formData.direccion_deposito || !state.formData.departamento || !state.formData.url_deposito){ //
      sendForm.value = false
    }
  }

   // BOTON RETORNAR
   const buttonReturnList = () => {
     router.push({ name: 'depositList' })
   }



  // BOTON ENVIAR FORMULARIO
  // const buttonSendForm = async () => {
  //   const result = await v$.value.$validate()
  //   if(!result) return

  //   state.formData.zoom = zoom.value

  //   const { ok, message } = (route.params.id_deposito == '0') ? await depositStore.createDeposit(state.formData) : await depositStore.updateDeposit(state.formData)
  //   const icono = (ok ? 'success' : 'error')
  //   Swal.fire({
  //     icon: icono,
  //     title: message,
  //     timer: 1500,
  //     showConfirmButton: false,
  //     timerProgressBar: true
  //   })
  // }

  // BOTON ENVIAR FORMULARIO
  const submitButton = ref(false)

  const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
    const { ok, message } = (route.params.id_deposito == '0') ? await depositStore.createDeposit(state.formData) : await depositStore.updateDeposit(state.formData)
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
    if(route.params.id_deposito != '0'){
      await getDepositById(route.params.id_deposito)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL DEPOSITO:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre<span style="color:red">*</span></v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.nombre_deposito"
            @input="miValidacion(), state.formData.nombre_deposito= validateText(state.formData.nombre_deposito.toUpperCase())"
            :error="submitButton && !state.formData.nombre_deposito"
            hide-details
          />
          <template v-if="submitButton && !state.formData.nombre_deposito">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
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
          <v-label class="mb-2 font-weight-medium">Latitud<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="number"
            step=".0001"
            v-model="state.formData.latitud"
            @input="setUrl()"
            :error="submitButton && !state.formData.latitud"
          >
          </v-text-field>
          
          <template v-if="submitButton && !state.formData.latitud">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Longitud<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="number"
            step=".0001"
            v-model="state.formData.longitud"
            @input="setUrl()"
            :error="submitButton && !state.formData.longitud"
          >
          </v-text-field>

          <template v-if="submitButton && !state.formData.longitud">
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
            v-model.trim="state.formData.direccion_deposito"
            @input="miValidacion(), state.formData.direccion_deposito= validateText(state.formData.direccion_deposito.toUpperCase())"
            :error="submitButton && !state.formData.direccion_deposito"
            hide-details
          />
          <template v-if="submitButton && !state.formData.direccion_deposito">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Enlace <span style="color:red">*</span></v-label>
          <!-- <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model="state.formData.url_deposito"
            :error="v$.formData.url_deposito.$error"
            :error-messages="errors.url_deposito"
          >
          </v-text-field> -->
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.url_deposito"
            :error="submitButton && !state.formData.url_deposito"
            hide-details
          />
          <template v-if="submitButton && !state.formData.url_deposito">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col cols="12" md="12">
          <div style="width: 100%; height: 400px">
            <mapbox-map 
              :accessToken="myAccessToken"
              :center="[ state.formData.longitud, state.formData.latitud ]"
              :zoom= state.formData.zoom
              @wheel="updateZoom"
              @zoom="updateZoom"
              @loaded="setZoom"
            >
              <mapbox-geocoder-control @result="pushResult" :marker="false"/>
              <mapbox-marker 
                :lngLat="[ state.formData.longitud, state.formData.latitud ]"
                :draggable="true"
                @dragend="newPosition"
              >
              </mapbox-marker>
              <mapbox-navigation-control position="bottom-left"/>
            </mapbox-map>
          </div>
        </v-col>
      </v-row>

      <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>