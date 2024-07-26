<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useOtherPropertyStore } from '@/stores/resources/otherProperty';
import { validateText } from '@/utils/helpers/validateText'
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const resourceStore = useResourceStore()     
  const otherPropertyStore = useOtherPropertyStore()

  const addInventoryButton=ref(false) 
  const sendInventory=ref(true) 
  const sendForm=ref(true)
  const submitButton = ref(false)

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Otro bien',
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
      descripcion: '',
      identificacion_bien: '',
      cantidad: '',
      precio_base: '',
      avaluo_provisional: '',
      observaciones: '',
      inventarios: []
    } as any,
    formulario_2: {
      fotografias: []
    },
    id_imagenes_eliminadas:[]

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
    

  const openModal = async(imagen: any) =>{
    if(imagen.includes('inventario')){
    addInventoryButton.value=true
    await inventoryValidation()
    if(!sendInventory.value) return
   }
    nombre_imagen.value = imagen
    dialog.value = true;
    addInventoryButton.value = false
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  //VALIDACION FORMULARIO 3 (INVENTARIO)

  const inventoryValidation = async () => {
    sendInventory.value=true
    //VALIDACION DE INVENTARIO
    if(!state.formulario_1.descripcion || 
    !state.formulario_1.identificacion_bien || 
    !state.formulario_1.cantidad || 
    !state.formulario_1.precio_base)
      {
        sendInventory.value=false
      }
  }

  
  const getImageRecord = async (value: any) => {

    // UNA VEZ OBTENIDA LA IMAGEN, SE GUARDA LA INFORMACION DEL FORMULARIO Y LA IMAGEN EN UN ARRAY
    if(value.respuesta.nombre_imagen.includes('inventario')){
      // SI EL RESULTADO ES PARA INVENTARIO
      state.formulario_1.inventarios.push({
        descripcion: state.formulario_1.descripcion,
        identificacion_bien: state.formulario_1.identificacion_bien,
        cantidad: state.formulario_1.cantidad,
        precio_base: state.formulario_1.precio_base,
        avaluo_provisional: state.formulario_1.avaluo_provisional,
        observaciones: state.formulario_1.observaciones,

        id_bien: id_bien,
        id_bien_registro: id_bien_registro,
        nombre_imagen: 'otro-bien-inventario',
        imagen: value.respuesta.imagenBase64,
        picture: value.respuesta.picture,

        id_otro_bien_imagen: ''
      })
      state.formulario_1.descripcion = ''
      state.formulario_1.identificacion_bien = ''
      state.formulario_1.cantidad = ''
      state.formulario_1.precio_base = ''
      state.formulario_1.avaluo_provisional = ''
      state.formulario_1.observaciones = ''
    }else{
    // EL RESULTADO ES PARA FOTOGRAFIAS GENERALES
      state.formulario_2.fotografias.push({
        id_otro_bien_imagen: '',
        id_bien: id_bien,
        id_bien_registro: id_bien_registro,
        nombre_imagen: 'otro-bien-general',
        imagen: value.respuesta.imagenBase64,
        picture: value.respuesta.picture,
      })
    }
  }

  const getOtherPropertyById = async(id_bien_registro: any) => {
    const resultado = await otherPropertyStore.otherProperty(id_bien_registro)

    if(!resultado.nuevo){
      nuevo.value = false

      const inventarios = resultado.formulario_1.inventarios
      for (let i = 0; i < inventarios.length; i++) {
        state.formulario_1.inventarios.push(inventarios[i])
      }

      const fotografias = resultado.formulario_2.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_2.fotografias.push(fotografias[i]) 
      }
    }

  }

  const calculateProvisionalAppraisal = () => {
    if(state.formulario_1.cantidad && state.formulario_1.precio_base){
      state.formulario_1.avaluo_provisional = state.formulario_1.cantidad * state.formulario_1.precio_base
    }else{
      state.formulario_1.avaluo_provisional = ''
    }
  }

  const buttonDeleteInventory = (index: number, id_otro_bien_imagen:number) => {
    state.id_imagenes_eliminadas.push(id_otro_bien_imagen)
    state.formulario_1.inventarios.splice(index,1)
  }

  const buttonDeletePicture = (index: number, id_otro_bien_imagen:number) => {
    state.id_imagenes_eliminadas.push(id_otro_bien_imagen)
    state.formulario_2.fotografias.splice(index,1)
  }
  const buttonReturnList = () => {
    router.back()
  } 
  //VALIDACION FORMULARIO 
  const miValidacion= async()=>{
    sendForm.value=true
      if(state.formulario_1.inventarios.length==0 
      || state.formulario_2.fotografias.length==0){
        sendForm.value=false
      }
  }

  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value) return
    state.formData.id_bien_registro = route.params.id_bien_registro
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    state.formData.id_imagenes_eliminadas = state.id_imagenes_eliminadas
    isLoading.value = true
    // GUARDADO DEL FORMULARIO 
    const { ok, message, id } = nuevo.value ? await otherPropertyStore.createOtherProperty(state.formData) : await otherPropertyStore.updateOtherProperty(state.formData)
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      confirmButtonText: 'Ok'
      }).then(() => {
        isLoading.value = false
        router.push({ name: 'bienFile', params: { id:route.params.id_caso } });
      })
      if(id != 0){
        otherPropertyStore.otherPropertyReport(id)
      }
  }

  onMounted( async () => {
    await getOtherPropertyById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de otros bienes</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. INVENTARIO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">DESCRIPCION <span style="color:red">*</span></v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.descripcion"
                  @input=" miValidacion(),state.formulario_1.descripcion = validateText(state.formulario_1.descripcion.toUpperCase())"
                  :error="addInventoryButton  && !state.formulario_1.descripcion || submitButton  && !state.formulario_1.descripcion && state.formulario_1.inventarios.length ==0"
                  hide-details
                  >
                </v-text-field>
                <template v-if=" addInventoryButton  && !state.formulario_1.descripcion ||submitButton  && !state.formulario_1.descripcion && state.formulario_1.inventarios.length ==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">IDENTIFICACIÓN DEL BIEN<span style="color:red">*</span></v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.identificacion_bien"
                  @input=" miValidacion(),state.formulario_1.identificacion_bien = validateText(state.formulario_1.identificacion_bien.toUpperCase())"
                  :error="addInventoryButton && !state.formulario_1.identificacion_bien||submitButton && !state.formulario_1.identificacion_bien && state.formulario_1.inventarios.length ==0"
                  hide-details
                  >
                </v-text-field>
                <template v-if="addInventoryButton && !state.formulario_1.identificacion_bien||submitButton && !state.formulario_1.identificacion_bien && state.formulario_1.inventarios.length ==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CANTIDAD<span style="color:red">*</span></v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  min="0"
                  type="number"
                  v-model="state.formulario_1.cantidad"
                  @input="miValidacion(),calculateProvisionalAppraisal()" 
                  :error="addInventoryButton  && !state.formulario_1.descripcion ||submitButton && !state.formulario_1.cantidad && state.formulario_1.inventarios.length ==0"
                  hide-details 
                >
                </v-text-field>
                <template v-if="addInventoryButton  && !state.formulario_1.descripcion ||submitButton && !state.formulario_1.cantidad && state.formulario_1.inventarios.length ==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">PRECIO BASE<span style="color:red">*</span></v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  min="0"
                  type="number"
                  v-model="state.formulario_1.precio_base"
                  @input="miValidacion(),calculateProvisionalAppraisal()" 
                  :error="addInventoryButton && !state.formulario_1.precio_base||submitButton && !state.formulario_1.precio_base && state.formulario_1.inventarios.length ==0"
                  hide-details 
                >
                </v-text-field>
                <template v-if="addInventoryButton && !state.formulario_1.precio_base||submitButton && !state.formulario_1.precio_base && state.formulario_1.inventarios.length ==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">AVALÚO PROVISIONAL</v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  v-model="state.formulario_1.avaluo_provisional"
                  readonly
                >
                </v-text-field>
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
                  <template v-slot:append>
                    <v-btn 
                      color="primary"
                      @click="openModal('otro-bien-inventario')"
                      
                    >
                      <PlusIcon/> Imagen
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col v-if="state.formulario_1.inventarios.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Imagen</th>
                      <th class="text-center">Descripcion</th>
                      <th class="text-center">Identificación del bien</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Precio base</th>
                      <th class="text-center">Avalúo provisional</th>
                      <th class="text-center">Observaciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_1.inventarios"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">
                        <v-avatar size="150">
                          <img :src="item.imagen" width="150"/>
                        </v-avatar>
                      </td>
                      <td class="text-center">{{ item.descripcion }}</td>
                      <td class="text-center">{{ item.identificacion_bien }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.precio_base }}</td>
                      <td class="text-center">{{ item.avaluo_provisional }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteInventory(index, item.id_otro_bien_imagen)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && state.formulario_1.inventarios.length==0">
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
                <v-label class="font-weight-medium mb-2"><span style="color:red">*</span>Se debe cargar al menos una imagen</v-label>
                <v-btn class="bg-primary" @click="openModal('otro-bien-general')" block>
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
                    <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index,imagen.id_otro_bien_imagen)">
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
        <template v-if="submitButton && state.formulario_2.fotografias.length==0">
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

  <picture-capture :id_bien="id_bien" 
  :id_bien_registro="id_bien_registro" 
  :dialog="dialog" 
  :nombre_imagen="nombre_imagen" ref="pictureModal" 
  @dialog-off="closeModal" 
  @return-image="getImageRecord">
  </picture-capture>
</template>


<style>
.size_fijo {
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
</style>