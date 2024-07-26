<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useJewelStore } from '@/stores/resources/jewel';
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const resourceStore = useResourceStore()
  const jewelStore = useJewelStore()

  const sendForm   = ref(true)
  const sendForm_1 = ref(true)
  const sendForm_2 = ref(true)

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Joya',
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
      id_joya_tipo: '',
      nombre_joya: '',

      id_joya_material_metal: '',
      nombre_metal: '',
      pureza: '',
      numero_pieza: '',
      color_joya: '',
      precio_base_metal: '',
      peso_gramo_metal: '',
      avaluo_provisional_metal: '',

      tiene_piedra: '',

      id_joya_material_piedra: '',
      nombre_piedra: '',
      calidad: '',
      numero_piedra: '',
      color_piedra: '',
      precio_base_piedra: '',
      peso_gramo_piedra: '',
      avaluo_provisional_piedra: '',

      marca: '',
      autenticidad: '',
      observaciones: '',
      avaluo_provisional: '',
      joyas: []
    } as any,
    formulario_2: {
      fotografias: []
    }

  });

  // DECLARACION DE CONSTANTES PARA LECTURA DE FORMULARIO
  const openpanel = ref([0])
  const nuevo = ref(true)
  const dialog = ref<boolean>(false)
  const pictureModal = ref<any>(null)
  const id_bien = route.params.id_bien
  const id_bien_registro = route.params.id_bien_registro
  const nombre_imagen = ref<any>('')
  const isLoading = ref(false)

  const tabla_extendida = ref(false)

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    state.formulario_2.fotografias.push({
      id_joya_imagen: '',
      id_bien: id_bien,
      id_bien_registro: id_bien_registro,
      nombre_imagen: 'joya-general',
      imagen: value.respuesta.imagenBase64,
      picture: value.respuesta.picture,
    })
  }

  const lista_autenticidad = ref([
    { title: 'SI' },
    { title: 'NO' }
  ])

  const lista_joyas = ref([])
  const getJewelsList = async() => {
    lista_joyas.value = await resourceStore.getJewels()
  }

  const lista_materiales_metal = ref([])
  const getMetalJewelryMaterials = async() => {
    lista_materiales_metal.value = await resourceStore.getMetalJewelryMaterials()
  }

  const lista_materiales_piedra = ref([])
  const getStoneJewelryMaterials = async() => {
    lista_materiales_piedra.value = await resourceStore.getStoneJewelryMaterials()
  }

  const lista_precios_metal = ref([])
  const getMetalJewelryPrices = async() => {
    state.formulario_1.pureza = ''
    state.formulario_1.precio_base_metal = ''
    lista_precios_metal.value = await resourceStore.getMetalJewelryPrices(state.formulario_1.id_joya_material_metal)
  }

  const lista_precios_piedra = ref([])
  const getStoneJewelryPrices = async() => {
    state.formulario_1.calidad = ''
    state.formulario_1.precio_base_piedra = ''
    lista_precios_piedra.value = await resourceStore.getStoneJewelryPrices(state.formulario_1.id_joya_material_piedra)
  }

  const setJewelName = () => {
    const registro: any = lista_joyas.value.find( (joya: any) => joya.id == state.formulario_1.id_joya_tipo )
    state.formulario_1.nombre_joya = registro.nombre_joya
  }

  const setMetalName = () => {
    const registro: any = lista_materiales_metal.value.find( (metal: any) => metal.id == state.formulario_1.id_joya_material_metal )
    state.formulario_1.nombre_metal = registro.nombre_metal
  }

  const setStoneName = () => {
    const registro: any = lista_materiales_piedra.value.find( (piedra: any) => piedra.id == state.formulario_1.id_joya_material_piedra )
    state.formulario_1.nombre_piedra = registro.nombre_piedra
  }

  const setMetalPrice = () => {
    const registro: any = lista_precios_metal.value.find( (precio: any) => precio.pureza == state.formulario_1.pureza )
    state.formulario_1.precio_base_metal = registro.precio_base
  }

  const setStonePrice = () => {
    const registro: any = lista_precios_piedra.value.find( (precio: any) => precio.calidad == state.formulario_1.calidad )
    state.formulario_1.precio_base_piedra = registro.precio_base
  }

  const evaluateField = () => {
    if(!state.formulario_1.tiene_piedra){
      state.formulario_1.id_joya_material_piedra = ''
      state.formulario_1.nombre_piedra = ''
      state.formulario_1.calidad = ''
      state.formulario_1.numero_piedra = ''
      state.formulario_1.color_piedra = ''
      state.formulario_1.precio_base_piedra = ''
      state.formulario_1.peso_gramo_piedra = ''
      lista_precios_piedra.value = []      
    }
  }

  const setProvisionalAppraisal = () => {
    if(state.formulario_1.tiene_piedra){
      if(state.formulario_1.avaluo_provisional_metal){
        // sumaremos
        if(state.formulario_1.precio_base_piedra && state.formulario_1.peso_gramo_piedra && state.formulario_1.numero_piedra){
          state.formulario_1.avaluo_provisional_piedra = (state.formulario_1.precio_base_piedra*state.formulario_1.peso_gramo_piedra*state.formulario_1.numero_piedra).toFixed(2)
        }else{
          state.formulario_1.avaluo_provisional_piedra = 0
        }
        state.formulario_1.avaluo_provisional = Number(state.formulario_1.avaluo_provisional_metal)+Number(state.formulario_1.avaluo_provisional_piedra)
        state.formulario_1.avaluo_provisional = state.formulario_1.avaluo_provisional.toFixed(2)
      }else {
        // solo piedra
        if(state.formulario_1.precio_base_piedra && state.formulario_1.peso_gramo_piedra && state.formulario_1.numero_piedra){
          state.formulario_1.avaluo_provisional_piedra = (state.formulario_1.precio_base_piedra*state.formulario_1.peso_gramo_piedra*state.formulario_1.numero_piedra).toFixed(2)
        }else{
          state.formulario_1.avaluo_provisional_piedra = ''
        }
        state.formulario_1.avaluo_provisional = state.formulario_1.avaluo_provisional_piedra
      }
      if(state.formulario_1.avaluo_provisional_piedra){
        if(state.formulario_1.precio_base_metal && state.formulario_1.peso_gramo_metal && state.formulario_1.numero_pieza){
          state.formulario_1.avaluo_provisional_metal = (state.formulario_1.precio_base_metal*state.formulario_1.peso_gramo_metal*state.formulario_1.numero_pieza).toFixed(2)
        }else{
          state.formulario_1.avaluo_provisional_metal = 0
        }
        state.formulario_1.avaluo_provisional = Number(state.formulario_1.avaluo_provisional_metal)+Number(state.formulario_1.avaluo_provisional_piedra)
        state.formulario_1.avaluo_provisional = state.formulario_1.avaluo_provisional.toFixed(2)
      }
    }else{
      if(state.formulario_1.precio_base_metal && state.formulario_1.peso_gramo_metal && state.formulario_1.numero_pieza){
        state.formulario_1.avaluo_provisional_metal = (state.formulario_1.precio_base_metal*state.formulario_1.peso_gramo_metal*state.formulario_1.numero_pieza).toFixed(2)
      }else{
        state.formulario_1.avaluo_provisional_metal = ''
      }
      state.formulario_1.avaluo_provisional = state.formulario_1.avaluo_provisional_metal
    }
  }

  const getJewelById = async(id_bien_registro: any) => {
    const resultado = await jewelStore.jewel(id_bien_registro)
    if(!resultado.nuevo){
      nuevo.value = false

      const joyas = resultado.formulario_1.joyas
      for (let i = 0; i < joyas.length; i++) {
        state.formulario_1.joyas.push(joyas[i]) 
      }

      const fotografias = resultado.formulario_2.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_2.fotografias.push(fotografias[i]) 
      }

      // VERIFICAREMOS SI EL ARRAY DE JOYAS TIENE UN REGISTRO CON DIAMANTES
      const tiene_diamante = state.formulario_1.joyas.find(
        (joya: any) => joya.id_joya_material_piedra
      )
      tabla_extendida.value = tiene_diamante ? true : false
    }
  }

  const buttonAddJewel = () => {
    if(!state.formulario_1.avaluo_provisional){
      state.formulario_1.avaluo_provisional = 0
    }

    state.formulario_1.joyas.push({
      id_joya_tipo: state.formulario_1.id_joya_tipo,
      nombre_joya: state.formulario_1.nombre_joya,

      id_joya_material_metal: state.formulario_1.id_joya_material_metal,
      nombre_metal: state.formulario_1.nombre_metal,
      pureza: state.formulario_1.pureza,
      numero_pieza: state.formulario_1.numero_pieza,
      color_joya: state.formulario_1.color_joya,
      precio_base_metal: state.formulario_1.precio_base_metal,
      peso_gramo_metal: state.formulario_1.peso_gramo_metal,
      avaluo_provisional_metal: state.formulario_1.avaluo_provisional_metal,
      
      tiene_piedra: state.formulario_1.tiene_piedra,

      id_joya_material_piedra: state.formulario_1.id_joya_material_piedra,
      nombre_piedra: state.formulario_1.nombre_piedra,
      calidad: state.formulario_1.calidad,
      numero_piedra: state.formulario_1.numero_piedra,
      color_piedra: state.formulario_1.color_piedra,
      precio_base_piedra: state.formulario_1.precio_base_piedra,
      peso_gramo_piedra: state.formulario_1.peso_gramo_piedra,
      avaluo_provisional_piedra: state.formulario_1.avaluo_provisional_piedra,

      marca: state.formulario_1.marca,
      autenticidad: state.formulario_1.autenticidad,
      observaciones: state.formulario_1.observaciones,
      avaluo_provisional: state.formulario_1.avaluo_provisional
    })
    state.formulario_1.id_joya_tipo = ''
    state.formulario_1.nombre_joya = ''
    state.formulario_1.id_joya_material_metal = ''
    state.formulario_1.nombre_metal = ''
    state.formulario_1.pureza = ''
    state.formulario_1.numero_pieza = ''
    state.formulario_1.color_joya = ''
    state.formulario_1.precio_base_metal = ''
    state.formulario_1.peso_gramo_metal = ''
    state.formulario_1.avaluo_provisional_metal = ''
    state.formulario_1.tiene_piedra = ''
    state.formulario_1.id_joya_material_piedra = ''
    state.formulario_1.nombre_piedra = ''
    state.formulario_1.calidad = ''
    state.formulario_1.numero_piedra = ''
    state.formulario_1.color_piedra = ''
    state.formulario_1.precio_base_piedra = ''
    state.formulario_1.peso_gramo_piedra = ''
    state.formulario_1.avaluo_provisional_piedra = ''
    state.formulario_1.marca = ''
    state.formulario_1.autenticidad = ''
    state.formulario_1.observaciones = ''
    state.formulario_1.avaluo_provisional = ''

    // VERIFICAREMOS SI EL ARRAY DE JOYAS TIENE UN REGISTRO CON DIAMANTES
    const tiene_diamante = state.formulario_1.joyas.find(
      (joya: any) => joya.id_joya_material_piedra
    )
    tabla_extendida.value = tiene_diamante ? true : false
  }

  const buttonDeleteJewel = (index: number) => {
    state.formulario_1.joyas.splice(index,1)
    // VERIFICAREMOS SI EL ARRAY DE JOYAS TIENE UN REGISTRO CON DIAMANTES
    const tiene_diamante = state.formulario_1.joyas.find(
      (joya: any) => joya.id_joya_material_piedra
    )
    tabla_extendida.value = tiene_diamante ? true : false
  }

  const buttonDeletePicture = (index: number) => {
    state.formulario_2.fotografias.splice(index,1)
  }

  // VALIDACIONES
 
   const buttonReturnList = () => {
    router.back()
  }
   // VALIDACIONES
  const miValidacion = async () => {
      sendForm.value = true
  if (state.formulario_1.joyas.length == 0 || 
      state.formulario_2.fotografias.length == 0) {
      sendForm.value = false
      sendForm_1.value = false
      sendForm_2.value = false
        
     }else{
      sendForm.value = true
      sendForm_1.value = true
      sendForm_2.value = true
     }   
   
   }

    const submitButton = ref(false)
    const buttonSendForm = async () => {
    submitButton.value = true  

    await miValidacion()
    if(!sendForm.value)return 

    state.formData.id_bien_registro = route.params.id_bien_registro
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    isLoading.value = true
    // SI ES ACTUALIZACION, ELIMINAMOS LAS IMAGENES QUE YA NO EXISTEN
   
    // GUARDADO DEL FORMULARIO 1
    const { ok, message, id } = nuevo.value ? await jewelStore.createJewel(state.formData) : await jewelStore.updateJewel(state.formData)
    // GUARDADO DEL FORMULARIO 2
   

    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })
    if(id != 0){
      jewelStore.jewelReport(id)
    }
  }

  onMounted( async () => {
    await getJewelsList()
    await getMetalJewelryMaterials()
    await getStoneJewelryMaterials()

    await getJewelById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Joyas</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. INVENTARIO DE LAS JOYAS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">

            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TIPO DE JOYERÍA</v-label>
                <v-select
                  v-model="state.formulario_1.id_joya_tipo"
                  :items="lista_joyas"
                  item-title="nombre_joya"
                  item-value="id"
                  @update:model-value="miValidacion(),setJewelName()"
                  :error="submitButton && !state.formulario_1.id_joya_tipo
                   && state.formulario_1.joyas.length < 1"
                   hide-details 
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.id_joya_tipo
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">MARCA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.marca"
                  @input="miValidacion(),state.formulario_1.marca = validateText(state.formulario_1.marca.toUpperCase())"
                  :error="submitButton && !state.formulario_1.marca
                   && state.formulario_1.joyas.length < 1"
                   hide-details
                  >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.marca
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">AUTENTICIDAD</v-label>
                <v-select
                  v-model="state.formulario_1.autenticidad"
                  :items="lista_autenticidad"
                  item-title="title"
                  item-value="title"
                  :error="submitButton && !state.formulario_1.autenticidad
                   && state.formulario_1.joyas.length < 1"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.autenticidad
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
            </v-row>

            <h3 class="mb-3 text-primary">Descripción Metal</h3>

            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TIPO DE METAL</v-label>
                <v-select
                  v-model="state.formulario_1.id_joya_material_metal"
                  :items="lista_materiales_metal"
                  item-title="nombre_metal"
                  item-value="id"
                  @update:model-value="miValidacion(),setMetalName(); getMetalJewelryPrices()"
                  :error="submitButton && !state.formulario_1.id_joya_material_metal
                   && state.formulario_1.joyas.length < 1"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.id_joya_material_metal
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PUREZA</v-label>
                <v-select
                  v-model="state.formulario_1.pureza"
                  :items="lista_precios_metal"
                  item-title="pureza_mod"
                  item-value="pureza"
                  @update:model-value="miValidacion(),setMetalPrice(); setProvisionalAppraisal();"
                  :error="submitButton && !state.formulario_1.pureza
                   && state.formulario_1.joyas.length < 1"
                   hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.pureza
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.precio_base_metal"
                  readonly
                  :error="submitButton && !state.formulario_1.precio_base_metal
                   && state.formulario_1.joyas.length < 1"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.precio_base_metal
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>

              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PESO GRAMO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_1.peso_gramo_metal"
                  @input="miValidacion(),setProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_1.precio_base_metal
                   && state.formulario_1.joyas.length < 1"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.peso_gramo_metal
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">NÚMERO DE PIEZAS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="1"
                  v-model="state.formulario_1.numero_pieza"
                  @input="miValidacion(),setProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_1.numero_pieza
                   && state.formulario_1.joyas.length < 1"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.numero_pieza
                 && state.formulario_1.joyas.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">COLOR</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.color_joya"
                  @input="state.formulario_1.color_joya = validateText(state.formulario_1.color_joya.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <h3 class="mb-3 text-primary">¿Contiene piedras preciosas?</h3>
                <v-radio-group
                  inline
                  v-model="state.formulario_1.tiene_piedra"
                  @update:model-value="evaluateField(); setProvisionalAppraisal()"
                >
                  <v-radio label="Sí" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <h3 class="mb-3 text-primary" v-if="state.formulario_1.tiene_piedra">Descripción Piedra</h3>

            <v-row v-if="state.formulario_1.tiene_piedra">
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TIPO DE PIEDRA</v-label>
                <v-select
                  v-model="state.formulario_1.id_joya_material_piedra"
                  :items="lista_materiales_piedra"
                  item-title="nombre_piedra"
                  item-value="id"
                  @update:model-value="setStoneName(); getStoneJewelryPrices()"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">CALIDAD</v-label>
                <v-select
                  v-model="state.formulario_1.calidad"
                  :items="lista_precios_piedra"
                  item-title="calidad"
                  item-value="calidad"
                  @update:model-value="setStonePrice(); setProvisionalAppraisal();"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.precio_base_piedra"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PESO GRAMO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_1.peso_gramo_piedra"
                  @input="setProvisionalAppraisal();"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">NÚMERO DE PIEDRAS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="1"
                  v-model="state.formulario_1.numero_piedra"
                  @input="setProvisionalAppraisal();"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">COLOR</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.color_piedra"
                  @input="state.formulario_1.color_piedra = validateText(state.formulario_1.color_piedra.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">AVALÚO PROVISIONAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.avaluo_provisional"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="8">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.observaciones"
                  @input="state.formulario_1.observaciones = validateText(state.formulario_1.observaciones.toUpperCase())"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddJewel()
                    :disabled="
                      !state.formulario_1.id_joya_tipo ||
                      !state.formulario_1.autenticidad
                    ">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row class="mb-3">
              <v-col v-if="state.formulario_1.joyas.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Tipo Joya</th>
                      <th class="text-center">Marca</th>
                      <th class="text-center">Autenticidad</th>
                      <th class="text-center">Nombre Metal</th>
                      <th class="text-center">Pureza</th>
                      <th class="text-center">Color</th>
                      <th class="text-center">N° Pieza</th>
                      <th class="text-center">Precio Base</th>
                      <th class="text-center">Peso [g]</th>
                      <template v-if="tabla_extendida">
                        <th class="text-center">Nombre Piedra</th>
                        <th class="text-center">Calidad</th>
                        <th class="text-center">Color</th>
                        <th class="text-center">Precio Base</th>
                        <th class="text-center">Peso [g]</th>
                      </template>
                      <th class="text-center">Observaciones</th>
                      <th class="text-center">Avalúo provisional</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_1.joyas"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_joya }}</td>
                      <td class="text-center">{{ item.marca }}</td>
                      <td class="text-center">{{ item.autenticidad }}</td>
                      <td class="text-center">{{ item.nombre_metal }}</td>
                      <td class="text-center">{{ item.pureza }}</td>
                      <td class="text-center">{{ item.color_joya }}</td>
                      <td class="text-center">{{ item.numero_pieza }}</td>
                      <td class="text-center">{{ item.precio_base_metal }}</td>
                      <td class="text-center">{{ item.peso_gramo_metal }}</td>
                      <template v-if="tabla_extendida">
                        <td class="text-center">{{ item.nombre_piedra }}</td>
                        <td class="text-center">{{ item.calidad }}</td>
                        <td class="text-center">{{ item.color_piedra }}</td>
                        <td class="text-center">{{ item.precio_base_piedra }}</td>
                        <td class="text-center">{{ item.peso_gramo_piedra }}</td>
                      </template>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center">{{ item.avaluo_provisional }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteJewel(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
              
            </v-row>


          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm_1  && state.formulario_1.joyas.length < 1">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">2. FOTOGRAFIA</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            
            <v-row class="mb-5">
              <v-col cols="12">
                <v-btn class="bg-primary" @click="openModal('joya-general')" block>
                  <CloudUploadIcon class="mx-2"></CloudUploadIcon> Subir Imagen
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-if="state.formulario_2.fotografias.length > 0">
              <v-col cols="12" md="6" v-for="(imagen, index) in state.formulario_2.fotografias">
                <v-card elevation="10" rounded="md">
                  <div class="text-center py-3">
                    <img :src="imagen.imagen" alt="noImage" height="250"/>
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
            </v-row>

          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm_1  && state.formulario_2.fotografias.length < 1">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

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