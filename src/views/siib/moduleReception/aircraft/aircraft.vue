<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { CircleCheckIcon, CircleIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { validateText } from '@/utils/helpers/validateText'
import { useAircraftStore } from '@/stores/moduleOne/aircraft';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const aircraftStore = useAircraftStore()

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Aeronave',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state:any = reactive({
    formData: {
      id_caso: route.params.id_caso
    } as any,
    formulario_1: {
      estado_operabilidad: '',
      observaciones: '',
      tipo_aeronave: '',
      descripcion_otro: '',
      fabricante: '',
      categoria: '',
      modelo: '',
      color: '',
      numero_serie: '',
      matricula: '',
      numero_puertas: '',
      numero_asientos_tripulacion: '',
      estado_emision_matricula: '',
      lugar_radica: '',
      funciona: '',
      documentacion_existente: ''
    } as any,
    formulario_2: {
      fabricante_motor: '',
      modelo_motor: '',
      numero_serie_motor: '',
      caracteristicas_motor: [],
      fabricante_helice: '',
      modelo_helice: '',
      numero_serie_helice: '',
      caracteristicas_helice: []
    } as any,
    formulario_3: {
      fabricante: '',
      modelo: '',
      numero_serie_pala: '',
      palas: []
    } as any,
    formulario_4: {
      gps: '',
      panel_audio: '',
      auriculares: '',
      atc_transponder: '',
      vhf_comm_nav: '',
      adf: '',
      brujula: '',
      horizonte_artificial: '',
      velocimetro: '',
      altimetro: '',
      velocidad_vertical: '',
      giro_direccional: '',
      bateria: '',
      otros_opcionales: ''
    } as any,
    formulario_5: {
      rpm: '',
      oil_temp: '',
      oil_press: '',
      fuel_qty: '',
      fuel_press: '',
      voltimetro: '',
      amperimetro: '',
      otros: ''
    } as any,
    formulario_6: {
      fabricante: '',
      modelo: '',
      habilitado_vuelo: ''
    } as any,
    formulario_7: {
      tipo_tren: '',
      observaciones: ''
    } as any,
    formulario_8: {
      descripcion: '',
      cantidad: '',
      observaciones: '',
      equipamiento_adicional: []
    } as any,
    formulario_9: {
      tipo_tablero: '',
      anio_fabricacion: '',
      avaluo_provisional: ''
    } as any,
    formulario_10: {
      panel: '',
      fotografias: []
    } as any
  });

  // DECLARACION DE CONSTANTES PARA LECTURA DE FORMULARIO
  const openpanel = ref([0]);
  const input_descripcion_otro = ref(false)
  const nuevo = ref(true)
  const dialog = ref<boolean>(false)
  const pictureModal = ref<any>(null)
  const id_bien = route.params.id_bien
  const id_bien_registro = route.params.id_bien_registro
  const nombre_imagen = ref<any>('')
  const isLoading = ref(false)

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    if(value.respuesta.nombre_imagen.includes('panel')){
      state.formulario_10.panel = value.respuesta.imagenBase64
    }
    state.formulario_10.fotografias.push({
      id_aeronave_imagen: '',
      id_bien: id_bien,
      id_bien_registro: id_bien_registro,
      nombre_imagen: value.respuesta.nombre_imagen,
      imagen: value.respuesta.imagenBase64,
      picture: value.respuesta.picture,
      principal: false
    })
  }

  const buttonDeletePicture = (index: number) => {
    state.formulario_10.fotografias.splice(index,1)
  }

  const removeImage = async () => {
    state.formulario_10.panel = ''
    state.formulario_10.fotografias = state.formulario_10.fotografias.filter(
      (fotografia: any) => fotografia.nombre_imagen.includes('general')
    )
  }

  // LISTA DE RECURSOS A UTILIZARSE EN EL FORMULARIO
  // ESTADO OPERABILIDAD 
  const lista_estado_operabilidad = ref([
    { title: 'OPERABLE' },
    { title: 'INOPERABLE' }
  ])
  // TIPO AERONAVE 
  const lista_tipo_aeronave = ref([
    { title: 'ALA FIJA' },
    { title: 'ALA ROTATIVA' },
    { title: 'OTRO' }
  ])
  // CATEGORIA
  const lista_categoria = ref([
    { title: 'CARGA' },
    { title: 'COMERCIAL' },
    { title: 'MILITAR' }
  ])
  // FUNCIONA
  const lista_funciona = ref([
    { title: 'SI' },
    { title: 'NO' }
  ])
  // HABILITADO VUELO
  const lista_habilitado_vuelo = ref([
    { title: 'IFR' },
    { title: 'VFR' }
  ])
  // TIPO TREN
  const lista_tipo_tren = ref([
    { title: 'RETRACTIL' },
    { title: 'FIJO' },
    { title: 'TRICICLO' },
    { title: 'PATIN DE COLA' }
  ])
  // TIPO TABLERO
  const lista_tipo_tablero = ref([
    { title: 'ANALOGICO' },
    { title: 'DIGITAL' }
  ])

  const lista_digital_avaluo = ref([])
  const getDigitalList = async() => {
    lista_digital_avaluo.value = await aircraftStore.getDigitalAppraisals()
  }

  const lista_analogica_avaluo = ref([])
  const getAnalogList = async() => {
    lista_analogica_avaluo.value = await aircraftStore.getAnalogAppraisals()
  }

  const lista_anios = ref([])
  const getYearBoardType = () => {
    state.formulario_9.anio_fabricacion = ''
    state.formulario_9.avaluo_provisional = ''
    if(state.formulario_9.tipo_tablero == 'DIGITAL'){
      lista_anios.value = lista_digital_avaluo.value
    }else{
      lista_anios.value = lista_analogica_avaluo.value
    }
  }

  const getAircraftById = async(id_bien_registro: any) => {
    const resultado = await aircraftStore.aircraft(id_bien_registro)
    
    if(!resultado.nuevo){ // if a prueba
      nuevo.value = false

      state.formulario_1.estado_operabilidad = resultado.formulario_1.estado_operabilidad
      state.formulario_1.observaciones = resultado.formulario_1.observaciones
      state.formulario_1.tipo_aeronave = resultado.formulario_1.tipo_aeronave
      state.formulario_1.fabricante = resultado.formulario_1.fabricante
      state.formulario_1.categoria = resultado.formulario_1.categoria
      state.formulario_1.modelo = resultado.formulario_1.categoria
      state.formulario_1.color = resultado.formulario_1.color
      state.formulario_1.numero_serie = resultado.formulario_1.numero_serie
      state.formulario_1.matricula = resultado.formulario_1.matricula
      state.formulario_1.numero_puertas = resultado.formulario_1.numero_puertas
      state.formulario_1.numero_asientos_tripulacion = resultado.formulario_1.numero_asientos_tripulacion
      state.formulario_1.estado_emision_matricula = resultado.formulario_1.estado_emision_matricula
      state.formulario_1.lugar_radica = resultado.formulario_1.lugar_radica
      state.formulario_1.funciona = resultado.formulario_1.funciona
      state.formulario_1.documentacion_existente = resultado.formulario_1.documentacion_existente

      const motores = resultado.formulario_2.caracteristicas_motor
      for (let i = 0; i < motores.length; i++) {
        state.formulario_2.caracteristicas_motor.push(motores[i])
      }
      const helices = resultado.formulario_2.caracteristicas_helice
      for (let i = 0; i < helices.length; i++) {
        state.formulario_2.caracteristicas_helice.push(helices[i])
      }

      state.formulario_3.fabricante = resultado.formulario_3.fabricante
      state.formulario_3.modelo = resultado.formulario_3.modelo
      const palas = resultado.formulario_3.palas
      for (let i = 0; i < palas.length; i++) {
        state.formulario_3.palas.push({
          numero_serie: palas[i].numero_serie
        })
      }

      state.formulario_4.gps = resultado.formulario_4.gps
      state.formulario_4.panel_audio = resultado.formulario_4.panel_audio
      state.formulario_4.auriculares = resultado.formulario_4.auriculares
      state.formulario_4.atc_transponder = resultado.formulario_4.atc_transponder
      state.formulario_4.vhf_comm_nav = resultado.formulario_4.vhf_comm_nav
      state.formulario_4.adf = resultado.formulario_4.adf
      state.formulario_4.brujula = resultado.formulario_4.brujula
      state.formulario_4.horizonte_artificial = resultado.formulario_4.horizonte_artificial
      state.formulario_4.velocimetro = resultado.formulario_4.velocimetro
      state.formulario_4.altimetro = resultado.formulario_4.altimetro
      state.formulario_4.velocidad_vertical = resultado.formulario_4.velocidad_vertical
      state.formulario_4.giro_direccional = resultado.formulario_4.giro_direccional
      state.formulario_4.bateria = resultado.formulario_4.bateria
      state.formulario_4.otros_opcionales = resultado.formulario_4.otros_opcionales

      state.formulario_5.rpm = resultado.formulario_5.rpm
      state.formulario_5.oil_temp = resultado.formulario_5.oil_temp
      state.formulario_5.oil_press = resultado.formulario_5.oil_press
      state.formulario_5.fuel_qty = resultado.formulario_5.fuel_qty
      state.formulario_5.fuel_press = resultado.formulario_5.fuel_press
      state.formulario_5.voltimetro = resultado.formulario_5.voltimetro
      state.formulario_5.amperimetro = resultado.formulario_5.amperimetro
      state.formulario_5.otros = resultado.formulario_5.otros

      state.formulario_6.fabricante = resultado.formulario_6.fabricante
      state.formulario_6.modelo = resultado.formulario_6.modelo
      state.formulario_6.habilitado_vuelo = resultado.formulario_6.habilitado_vuelo

      state.formulario_7.tipo_tren = resultado.formulario_7.tipo_tren
      state.formulario_7.observaciones = resultado.formulario_7.observaciones

      const piezas = resultado.formulario_8
      for (let i = 0; i < piezas.length; i++) {
        state.formulario_8.equipamiento_adicional.push({
          descripcion: piezas[i].descripcion,
          observaciones: piezas[i].observaciones,
          cantidad: piezas[i].cantidad
        })
      }

      state.formulario_9.tipo_tablero = resultado.formulario_9.tipo_tablero
      state.formulario_9.avaluo_provisional = resultado.formulario_9.avaluo_provisional
      state.formulario_9.anio_fabricacion = resultado.formulario_9.anio_fabricacion

      const fotografias = resultado.formulario_10.fotografias

      for (let i = 0; i < fotografias.length; i++) {
        if(fotografias[i].nombre_imagen.includes('panel')){
          state.formulario_10.panel = fotografias[i].imagen
        }
        state.formulario_10.fotografias.push(fotografias[i])
      }
    }
  }
  

  const getProvisionalAppraisal = () => {
    if(state.formulario_9.tipo_tablero == 'DIGITAL'){
      const valor:any = lista_digital_avaluo.value.find( (registro: any) => registro.anio == state.formulario_9.anio_fabricacion )
      state.formulario_9.avaluo_provisional = valor.costo
    }else{
      const valor:any = lista_analogica_avaluo.value.find( (registro: any) => registro.anio == state.formulario_9.anio_fabricacion )
      state.formulario_9.avaluo_provisional = valor.costo
    }
  }

  const evaluateAircraftType = () => {
    state.formulario_1.descripcion_otro = ''
    input_descripcion_otro.value = state.formulario_1.tipo_aeronave == 'OTRO' ? true : false
  }

  const buttonAddEngine = () => {
    state.formulario_2.caracteristicas_motor.push({
      fabricante: state.formulario_2.fabricante_motor,
      modelo: state.formulario_2.modelo_motor,
      numero_serie: state.formulario_2.numero_serie_motor
    })
    state.formulario_2.fabricante_motor = ''
    state.formulario_2.modelo_motor = ''
    state.formulario_2.numero_serie_motor = ''
  }

  const buttonDeleteEngine = (index: number) => {
    state.formulario_2.caracteristicas_motor.splice(index,1)
    // PENDIENTE, CUANDO SE EDITA
  }

  const buttonAddPropeller = () => {
    state.formulario_2.caracteristicas_helice.push({
      fabricante: state.formulario_2.fabricante_helice,
      modelo: state.formulario_2.modelo_helice,
      numero_serie: state.formulario_2.numero_serie_helice
    })
    state.formulario_2.fabricante_helice = ''
    state.formulario_2.modelo_helice = ''
    state.formulario_2.numero_serie_helice = ''
  }

  const buttonDeletePropeller = (index: number) => {
    state.formulario_2.caracteristicas_helice.splice(index,1)
  }

  const buttonAddShovel = () => {
    state.formulario_3.palas.push({
      numero_serie: state.formulario_3.numero_serie_pala
    })
    state.formulario_3.numero_serie_pala = ''
  }

  const buttonDeleteShovel = (index: number) => {
    state.formulario_3.palas.splice(index,1)
  }

  const buttonAddEquipment = () => {
    state.formulario_8.equipamiento_adicional.push({
      descripcion: state.formulario_8.descripcion,
      observaciones: state.formulario_8.observaciones,
      cantidad: state.formulario_8.cantidad
    })
    state.formulario_8.descripcion = ''
    state.formulario_8.observaciones = ''
    state.formulario_8.cantidad = ''
  }

  const evaluatePrincipalImage = async (id: any) => {
    for (let i = 0; i < state.formulario_10.fotografias.length; i++) {
      if(state.formulario_10.fotografias[i].id_aeronave_imagen == id){
        state.formulario_10.fotografias[i].principal = true
      }else{
        state.formulario_10.fotografias[i].principal = false
      }
    }
  }

  const buttonDeleteEquipment = (index: number) => {
    state.formulario_8.equipamiento_adicional.splice(index,1)
  }

    
    const sendForm   = ref(true)
    const sendForm_1 = ref(true) 
    const sendForm_6 = ref(true)
    const sendForm_7 = ref(true)
    const sendForm_9 = ref(true) 
    const miValidacion = async () => {
    sendForm.value = true
    
  if(!state.formulario_1.estado_operabilidad || !state.formulario_1.tipo_aeronave ||
     !state.formulario_1.fabricante || !state.formulario_1.categoria &&
     !state.formulario_1.modelo || !state.formulario_1.color ||
     !state.formulario_1.numero_serie || !state.formulario_1.matricula ||
     !state.formulario_1.numero_puertas || !state.formulario_1.funciona)
     {
      sendForm.value = false
      sendForm_1.value = false       
     }
     if(!state.formulario_6.fabricante || !state.formulario_6.modelo ||
         !state.formulario_6.habilitado_vuelo )
     {
      sendForm.value = false
      sendForm_6.value = false
     }
     if(!state.formulario_7.tipo_tren)
     {
      sendForm.value = false
      sendForm_7.value = false
     }
     if(!state.formulario_9.tipo_tablero || !state.formulario_9.anio_fabricacion ||
         !state.formulario_9.avaluo_provisional )
     {
      sendForm.value = false
      sendForm_9.value = false
     }
   }  
  
  const buttonReturnList = () => {
    router.back()
  }
 
   const submitButton = ref(false)
   const buttonSendForm = async () => {
   submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 

    state.formData.id_bien_registro = route.params.id_bien_registro
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    state.formData.formulario_3 = state.formulario_3
    state.formData.formulario_4 = state.formulario_4
    state.formData.formulario_5 = state.formulario_5
    state.formData.formulario_6 = state.formulario_6
    state.formData.formulario_7 = state.formulario_7
    state.formData.formulario_8 = state.formulario_8
    state.formData.formulario_9 = state.formulario_9
    state.formData.formulario_10 = state.formulario_10

    isLoading.value = true
          
    const { ok, message,id } = nuevo.value ? await aircraftStore.createAircraft(state.formData) : await aircraftStore.updateAircraft(state.formData)
       const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })
    if(id != 0){
      aircraftStore.aircraftReport(id)
    }
  }

  onMounted( async () => {
    await getDigitalList()
    await getAnalogList()
    await getAircraftById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Aeronaves</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. DATOS DE LA AERONAVE</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ESTADO OPERABILIDAD</v-label>
                <v-select
                  v-model="state.formulario_1.estado_operabilidad"
                  :items="lista_estado_operabilidad"
                  item-title="title"
                  item-value="title"
                  :error="submitButton && !state.formulario_1.estado_operabilidad"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.estado_operabilidad">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.observaciones"
                  @input="state.formulario_1.observaciones = validateText(state.formulario_1.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO AERONAVE</v-label>
                <v-select
                  v-model="state.formulario_1.tipo_aeronave"
                  :items="lista_tipo_aeronave"
                  item-title="title"
                  item-value="title"
                  @update:model-value="evaluateAircraftType()"
                  :error="submitButton && !state.formulario_1.tipo_aeronave"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.tipo_aeronave">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
                
              </v-col>
              <v-col cols="12" md="6" v-if="input_descripcion_otro">
                <v-label class="font-weight-medium mb-2">DESCRIPCION</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.descripcion_otro"
                  @input="state.formulario_1.descripcion_otro = validateText(state.formulario_1.descripcion_otro.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FABRICANTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.fabricante"
                  @input="state.formulario_1.fabricante = validateText(state.formulario_1.fabricante.toUpperCase())"
                  :error="submitButton && !state.formulario_1.fabricante"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.fabricante">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CATEGORIA</v-label>
                <v-select
                  v-model="state.formulario_1.categoria"
                  :items="lista_categoria"
                  item-title="title"
                  item-value="title"
                  :error="submitButton && !state.formulario_1.categoria"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.categoria">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                   </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MODELO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.modelo"
                  @input="miValidacion(),state.formulario_1.modelo = validateText(state.formulario_1.modelo.toUpperCase())"
                  :error="submitButton && !state.formulario_1.categoria"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.modelo">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>

              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">COLOR</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.color"
                  @input="state.formulario_1.color = validateText(state.formulario_1.color.toUpperCase())"
                  :error="submitButton && !state.formulario_1.color"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.color">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NUMERO DE SERIE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.numero_serie"
                  @input="state.formulario_1.numero_serie = validateText(state.formulario_1.numero_serie.toUpperCase())"
                  :error="submitButton && !state.formulario_1.numero_serie"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.numero_serie">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MATRICULA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.matricula"
                  @input="state.formulario_1.matricula = validateText(state.formulario_1.matricula.toUpperCase())"
                  :error="submitButton && !state.formulario_1.matricula"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.matricula">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NUMERO DE PUERTAS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  v-model.trim="state.formulario_1.numero_puertas"
                  @input="state.formulario_1.numero_puertas = validateText(state.formulario_1.numero_puertas.toUpperCase())"
                  :error="submitButton && !state.formulario_1.numero_puertas"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.numero_puertas">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NUMERO DE ASIENTOS INCLUIDOS PARA TRIPULACION</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  v-model.trim="state.formulario_1.numero_asientos_tripulacion"
                  @input="state.formulario_1.numero_asientos_tripulacion = validateText(state.formulario_1.numero_asientos_tripulacion.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ESTADO EMISION MATRICULA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.estado_emision_matricula"
                  @input="state.formulario_1.estado_emision_matricula = validateText(state.formulario_1.estado_emision_matricula.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">LUGAR DONDE RADICA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.lugar_radica"
                  @input="state.formulario_1.lugar_radica = validateText(state.formulario_1.lugar_radica.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FUNCIONA</v-label>
                <v-select
                  v-model="state.formulario_1.funciona"
                  :items="lista_funciona"
                  item-title="title"
                  item-value="title"
                  :error="submitButton && !state.formulario_1.numero_puertas"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.funciona">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">DOCUMENTACION EXISTENTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.documentacion_existente"
                  @input="state.formulario_1.documentacion_existente = validateText(state.formulario_1.documentacion_existente.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm_1">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">2. CARACTERISTICAS DEL MOTOR Y HELICE</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <h3 class="mb-3 text-primary">Motor</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">FABRICANTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.fabricante_motor"
                  @input="state.formulario_2.fabricante_motor = validateText(state.formulario_2.fabricante_motor.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">MODELO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.modelo_motor"
                  @input="state.formulario_2.modelo_motor = validateText(state.formulario_2.modelo_motor.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  NUMERO DE SERIE
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  v-model.trim="state.formulario_2.numero_serie_motor"
                  @input="state.formulario_2.numero_serie_motor = validateText(state.formulario_2.numero_serie_motor.toUpperCase())"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddEngine()
                    :disabled="!state.formulario_2.fabricante_motor || !state.formulario_2.modelo_motor || !state.formulario_2.numero_serie_motor">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
              <v-col v-if="state.formulario_2.caracteristicas_motor.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Fabricante</th>
                      <th class="text-center">Modelo</th>
                      <th class="text-center">Numero de serie</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_2.caracteristicas_motor"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.fabricante }}</td>
                      <td class="text-center">{{ item.modelo }}</td>
                      <td class="text-center">{{ item.numero_serie }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteEngine(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

            <h3 class="my-3 text-primary">Helice</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">FABRICANTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.fabricante_helice"
                  @input="state.formulario_2.fabricante_helice = validateText(state.formulario_2.fabricante_helice.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">MODELO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.modelo_helice"
                  @input="state.formulario_2.modelo_helice = validateText(state.formulario_2.modelo_helice.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  NUMERO DE SERIE
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  v-model.trim="state.formulario_2.numero_serie_helice"
                  @input="state.formulario_2.numero_serie_helice = validateText(state.formulario_2.numero_serie_helice.toUpperCase())"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddPropeller()
                    :disabled="!state.formulario_2.fabricante_helice || !state.formulario_2.modelo_helice || !state.formulario_2.numero_serie_helice">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
              <v-col v-if="state.formulario_2.caracteristicas_helice.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Fabricante</th>
                      <th class="text-center">Modelo</th>
                      <th class="text-center">Numero de serie</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_2.caracteristicas_helice"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.fabricante }}</td>
                      <td class="text-center">{{ item.modelo }}</td>
                      <td class="text-center">{{ item.numero_serie }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeletePropeller(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">3. EN CASO DE HELICOPTEROS CARACTERISTICAS DE LOS ROTORES</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FABRICANTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.fabricante"
                  @input="state.formulario_3.fabricante = validateText(state.formulario_3.fabricante.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MODELO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.modelo"
                  @input="state.formulario_3.modelo = validateText(state.formulario_3.modelo.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-label class="mb-2 font-weight-medium" required>
                  NUMERO DE SERIE PALA
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  v-model.trim="state.formulario_3.numero_serie_pala"
                  @input="state.formulario_3.numero_serie_pala = validateText(state.formulario_3.numero_serie_pala.toUpperCase())"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddShovel()
                    :disabled="!state.formulario_3.numero_serie_pala">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
              <v-col v-if="state.formulario_3.palas.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Numero de serie</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_3.palas"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.numero_serie }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteShovel(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">4. CARACTERISTICAS DE LOS EQUIPOS DE RADIO Y COMUNICACION</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">GPS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.gps"
                  @input="state.formulario_4.gps = validateText(state.formulario_4.gps.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">PANEL DE AUDIO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.panel_audio"
                  @input="state.formulario_4.panel_audio = validateText(state.formulario_4.panel_audio.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">AURICULARES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.auriculares"
                  @input="state.formulario_4.auriculares = validateText(state.formulario_4.auriculares.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ATC TRANSPONDER</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.atc_transponder"
                  @input="state.formulario_4.atc_transponder = validateText(state.formulario_4.atc_transponder.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">VHF COMM/NAV</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.vhf_comm_nav"
                  @input="state.formulario_4.vhf_comm_nav = validateText(state.formulario_4.vhf_comm_nav.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ADF</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.adf"
                  @input="state.formulario_4.adf = validateText(state.formulario_4.adf.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">BRUJULA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.brujula"
                  @input="state.formulario_4.brujula = validateText(state.formulario_4.brujula.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">HORIZONTE ARTIFICIAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.horizonte_artificial"
                  @input="state.formulario_4.horizonte_artificial = validateText(state.formulario_4.horizonte_artificial.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">VELOCIMETRO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.velocimetro"
                  @input="state.formulario_4.velocimetro = validateText(state.formulario_4.velocimetro.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ALTIMETRO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.altimetro"
                  @input="state.formulario_4.altimetro = validateText(state.formulario_4.altimetro.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">VELOCIDAD VERTICAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.velocidad_vertical"
                  @input="state.formulario_4.velocidad_vertical = validateText(state.formulario_4.velocidad_vertical.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">GIRO DIRECCIONAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.giro_direccional"
                  @input="state.formulario_4.giro_direccional = validateText(state.formulario_4.giro_direccional.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">BATERIA(S)</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.bateria"
                  @input="state.formulario_4.bateria = validateText(state.formulario_4.bateria.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OTROS EQUIPOS OPCIONALES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  placeholder="CVR/FDR/ELT/RELOJ ETC."
                  v-model.trim="state.formulario_4.otros_opcionales"
                  @input="state.formulario_4.otros_opcionales = validateText(state.formulario_4.otros_opcionales.toUpperCase())"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <h3 class="text-primary">INDICADORES</h3>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">RPM</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.rpm"
                  @input="state.formulario_5.rpm = validateText(state.formulario_5.rpm.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OIL TEMP</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.oil_temp"
                  @input="state.formulario_5.oil_temp = validateText(state.formulario_5.oil_temp.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OIL PRESS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.oil_press"
                  @input="state.formulario_5.oil_press = validateText(state.formulario_5.oil_press.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FUEL QTY</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.fuel_qty"
                  @input="state.formulario_5.fuel_qty = validateText(state.formulario_5.fuel_qty.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FUEL PRESS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.fuel_press"
                  @input="state.formulario_5.fuel_press = validateText(state.formulario_5.fuel_press.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">VOLTIMETRO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.voltimetro"
                  @input="state.formulario_5.voltimetro = validateText(state.formulario_5.voltimetro.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">AMPERIMETRO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.amperimetro"
                  @input="state.formulario_5.amperimetro = validateText(state.formulario_5.amperimetro.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OTROS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.otros"
                  @input="state.formulario_5.otros = validateText(state.formulario_5.otros.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">5. CARACTERISTICAS DEL PANEL DE INSTRUMENTOS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FABRICANTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_6.fabricante"
                  @input="miValidacion(),state.formulario_6.fabricante = validateText(state.formulario_6.fabricante.toUpperCase())"
                  :error="submitButton && !state.formulario_6.fabricante"
                   hide-details                  
                 >
                <template v-if="submitButton && !state.formulario_6.fabricante">
                 <div class="v-messages font-weight-black px-2 py-2">
                   <div class="v-messages__message text-error ">
                      El campo es requerido
                  </div>
                 </div>
               </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MODELO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_6.modelo"
                  @input="miValidacion(),state.formulario_6.modelo = validateText(state.formulario_6.modelo.toUpperCase())"
                   :error="submitButton && !state.formulario_6.modelo"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_6.modelo">
                 <div class="v-messages font-weight-black px-2 py-2">
                   <div class="v-messages__message text-error ">
                      El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">HABILITADO PARA VUELO</v-label>
                <v-select
                  v-model="state.formulario_6.habilitado_vuelo"
                  :items="lista_habilitado_vuelo"
                  item-title="title"
                  item-value="title"
                  :error="submitButton && !state.formulario_6.habilitado_vuelo"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_6.habilitado_vuelo">
                 <div class="v-messages font-weight-black px-2 py-2">
                   <div class="v-messages__message text-error ">
                      El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm_6">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">6. CARACTERISTICAS DEL TREN DE ATERRIZAJE</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO DE TREN DE ATERRIZAJE</v-label>
                <v-select
                  v-model="state.formulario_7.tipo_tren"
                  :items="lista_tipo_tren"
                  item-title="title"
                  item-value="title"
                  :error="submitButton && !state.formulario_7.tipo_tren"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_7.tipo_tren">
                 <div class="v-messages font-weight-black px-2 py-2">
                   <div class="v-messages__message text-error ">
                      El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_7.observaciones"
                  @input="state.formulario_7.observaciones = validateText(state.formulario_7.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm_7">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">7. PIEZAS Y EQUIPAMIENTO ADICIONAL</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">DESCRIPCION</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_8.descripcion"
                  @input="state.formulario_8.descripcion = validateText(state.formulario_8.descripcion.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_8.observaciones"
                  @input="state.formulario_8.observaciones = validateText(state.formulario_8.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  CANTIDAD
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model="state.formulario_8.cantidad"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddEquipment()
                    :disabled="!state.formulario_8.descripcion || !state.formulario_8.observaciones || !state.formulario_8.cantidad">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
              <v-col v-if="state.formulario_8.equipamiento_adicional.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Descripcion</th>
                      <th class="text-center">Observaciones</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_8.equipamiento_adicional"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.descripcion }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteEquipment(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">8. AVALUO PROVISIONAL</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO TABLERO</v-label>
                <v-select
                  v-model="state.formulario_9.tipo_tablero"
                  :items="lista_tipo_tablero"
                  item-title="title"
                  item-value="title"
                  @update:model-value="getYearBoardType()"
                  :error="submitButton && !state.formulario_9.tipo_tablero"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_9.tipo_tablero">
                  <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                       El campo es requerido
                     </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">AÑO DE FABRICACION</v-label>
                <v-select
                  v-model="state.formulario_9.anio_fabricacion"
                  :items="lista_anios"
                  item-title="anio"
                  item-value="anio"
                  @update:model-value="getProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_9.anio_fabricacion"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_9.tipo_tablero">
                  <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                       El campo es requerido
                     </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">AVALUO PROVISIONAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="state.formulario_9.avaluo_provisional"
                  @input="miValidacion(), state.formulario_9.avaluo_provisional= validateText(state.formData.nombre_delito.toUpperCase())"
                  :error="submitButton && !state.formulario_9.avaluo_provisional"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_9.avaluo_provisional">
                  <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                       El campo es requerido
                     </div>
                 </div>
               </template>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm_9">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">9. FOTOGRAFIA</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">

            <v-row>
              <v-col cols="12" lg="12" sm="12">
                <v-card elevation="10" rounded="md">
                  <div class="text-center py-3">
                    <img class="rounded" :src="state.formulario_10.panel" alt="noImage" height="300" v-if="state.formulario_10.panel"/>
                    <img src="@/assets/images/misimagenes/noimage1.png" alt="noImage" height="250" v-else/>
                  </div>
                  <div class="d-flex justify-end mr-3 mt-n3">
                    <v-btn
                      v-if="!state.formulario_10.panel"
                      size="30"
                      icon variant="flat"
                      class="bg-primary d-flex"
                      @click="openModal('aeronave-panel')"
                    >
                      <v-avatar size="30" class="text-white">
                        <BasketIcon size="20" />
                      </v-avatar>
                      <v-tooltip
                        activator="parent"
                        location="bottom"
                      >
                        SUBIR IMAGEN
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                      v-else
                      size="30"
                      icon variant="flat"
                      color="#EF5350"
                      class="d-flex"
                      @click="removeImage()"
                    >
                      <v-avatar size="30" class="text-white">
                        <BasketIcon size="20" />
                      </v-avatar>
                      <v-tooltip
                        activator="parent"
                        location="bottom"
                      >ELIMINAR IMAGEN
                      </v-tooltip>
                    </v-btn>
                  </div>
                  <v-card-item class="pt-0">
                    <div class="text-center"><h6 class="text-h6" v-text="'PANEL DE INSTRUMENTOS'"></h6></div>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
            
            <v-row class="mb-5">
              <v-col cols="12">
                <v-btn class="bg-primary" @click="openModal('aeronave-general')" block>
                  <CloudUploadIcon class="mx-2"></CloudUploadIcon> Subir Imagen
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-if="state.formulario_10.fotografias.length > 0">
              <template v-for="(imagen, index) in state.formulario_10.fotografias">
                <template v-if="imagen.imagen.includes('general') || imagen.nombre_imagen.includes('general')">
                  <v-col cols="12" md="6">
                    <v-card elevation="10" rounded="md">
                      <div class="text-center py-3">
                        <img class="rounded" :src="imagen.imagen" alt="noImage" height="250" width="350"/>
                      </div>
                      
                      <div class="text-center">
                        <v-btn
                          :color="imagen.principal ? 'primary' : ''"
                          variant="outlined"
                          @click="evaluatePrincipalImage(imagen.id_aeronave_imagen)"
                         >
                          <template v-if="imagen.principal"> 
                            <CircleCheckIcon class="mr-1"/> 
                          </template>
                          <template v-else> 
                            <CircleIcon class="mr-1"/> 
                          </template>
                          PORTADA
                        </v-btn>
                      </div>
                      

                      <div class="d-flex justify-end mr-3 mt-n3 pb-1">  
                        <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index)">
                          <v-avatar size="30" class="text-white">
                            <TrashIcon size="20" />
                          </v-avatar>
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                          >ELIMINAR IMAGEN
                          </v-tooltip>
                        </v-btn>
                      </div>
                      
                    </v-card>
                  </v-col>
                </template>
              </template>
            </v-row>
             <template v-if="submitButton && state.formulario_10.fotografias.length == 0">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                   </div>
                 </div>
                </template>

          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-row class="mt-5 text-center">
          <v-col cols="12">
            <template v-if="!isLoading">
              <v-btn color="error" class="mr-3 size_fijo" @click="buttonReturnList()">Volver</v-btn>
              <v-btn color="primary" class="size_fijo" @click.prevent="buttonSendForm()">Enviar</v-btn>
            </template>
            <template v-else>
              <v-btn color="primary" class="mr-3 size_fijo" disabled>
                <v-progress-circular
                  indeterminate
                  color="white"
                  class="mr-2"
                ></v-progress-circular>
                Enviando...
              </v-btn>
            </template>
          </v-col>
        </v-row>

      </v-expansion-panels>
    </v-col>
  </v-row>

  <picture-capture
    :id_bien="id_bien"
    :id_bien_registro="id_bien_registro"
    :dialog="dialog"
    :nombre_imagen="nombre_imagen"
    ref="pictureModal"
    @dialog-off="closeModal"
    @return-image="getImageRecord"
  ></picture-capture>
</template>


<style>
.size_fijo {
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
</style>