<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useSelfMovingStore } from '@/stores/resources/selfMoving';
import { validateText } from '@/utils/helpers/validateText'
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const resourceStore = useResourceStore()
  const selfMovingStore = useSelfMovingStore()
  
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
      text: 'Semoviente',
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
      id_semoviente_clase_precio_base: '',
      nombre_semoviente: '',
      cantidad: '',
      raza: '',
      observaciones: '',
      precio_base: '',
      avaluo_provisional: '',
      semovientes: []
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

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    state.formulario_2.fotografias.push({
      id_semoviente_imagen: '',
      id_bien: id_bien,
      id_bien_registro: id_bien_registro,
      nombre_imagen: 'semoviente-general',
      imagen: value.respuesta.imagenBase64,
      picture: value.respuesta.picture,
    })
  }

  const lista_semovientes = ref([])
  const getSelfMovingList = async() => {
    lista_semovientes.value = await resourceStore.getSelfMoving()
  }

  const setBasePrice = () => {
    const registro:any = lista_semovientes.value.find( (semoviente: any) => semoviente.id == state.formulario_1.id_semoviente_clase_precio_base )
    if(registro){
      state.formulario_1.nombre_semoviente = registro.nombre_semoviente
      state.formulario_1.precio_base = registro.precio_base
    }
  }

  const setProvisionalAppraisal = () => {
    if(state.formulario_1.precio_base && state.formulario_1.cantidad){
      state.formulario_1.avaluo_provisional = state.formulario_1.precio_base * state.formulario_1.cantidad
    }else{
      state.formulario_1.avaluo_provisional = ''
    }
  }

  const getSelfMovingById = async(id_bien_registro: any) => {
    const resultado = await selfMovingStore.selfMoving(id_bien_registro)
    if(!resultado.nuevo){
      nuevo.value = false

      const semovientes = resultado.formulario_1.semovientes
      for (let i = 0; i < semovientes.length; i++) {
        state.formulario_1.semovientes.push(semovientes[i]) 
      }

      const fotografias = resultado.formulario_2.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_2.fotografias.push(fotografias[i]) 
      }

    }
  }

  const buttonAddSelfMoving = () => {
    state.formulario_1.semovientes.push({
      id_semoviente_clase_precio_base: state.formulario_1.id_semoviente_clase_precio_base,
      nombre_semoviente: state.formulario_1.nombre_semoviente,
      cantidad: state.formulario_1.cantidad,
      raza: state.formulario_1.raza,
      observaciones: state.formulario_1.observaciones,
      precio_base: state.formulario_1.precio_base,
      avaluo_provisional: state.formulario_1.avaluo_provisional
    })
    state.formulario_1.id_semoviente_clase_precio_base = ''
    state.formulario_1.nombre_semoviente = ''
    state.formulario_1.cantidad = ''
    state.formulario_1.raza = ''
    state.formulario_1.observaciones = ''
    state.formulario_1.precio_base = ''
    state.formulario_1.avaluo_provisional = ''
  }

  const buttonDeleteSelfMoving = (index: number) => {
    state.formulario_1.semovientes.splice(index,1)
  }

  const buttonDeletePicture = (index: number) => {
    state.formulario_2.fotografias.splice(index,1)
  }


    
    
  const miValidacion = async () => {
      sendForm.value = true

      if (state.formulario_1.semovientes.length == 0 || state.formulario_2.fotografias.length == 0) {
      sendForm.value = false
      sendForm_1.value = false
      sendForm_2.value = false
        
     }else{
      sendForm.value = true
      sendForm_1.value = true
      sendForm_2.value = true
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
    isLoading.value = true
    // SI ES ACTUALIZACION, ELIMINAMOS LAS IMAGENES QUE YA NO EXISTEN
    
    // GUARDADO DEL FORMULARIO 1
    const { ok, message, id } = nuevo.value ? await selfMovingStore.createSelfMoving(state.formData) : await selfMovingStore.updateSelfMoving(state.formData)
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
      selfMovingStore.selfMovingReport(id)
    }
  }

  onMounted( async () => {
    await getSelfMovingList()
    await getSelfMovingById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Sustancias Controladas</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. INVENTARIO DE LOS SEMOVIENTES</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">

            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">CLASE</v-label>
                <v-select
                  v-model="state.formulario_1.id_semoviente_clase_precio_base"
                  :items="lista_semovientes"
                  item-title="nombre_semoviente"
                  item-value="id"
                  @update:model-value="setBasePrice(); setProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_1.id_semoviente_clase_precio_base
                   && state.formulario_1.semovientes.length < 1"
                   hide-details
                ></v-select>              
                <template v-if="submitButton && !state.formulario_1.estado_operabilidad  && state.formulario_1.semovientes.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">RAZA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.raza"
                  @input="miValidacion(),state.formulario_1.raza = validateText(state.formulario_1.raza.toUpperCase())"
                  :error="submitButton && !state.formulario_1.raza
                   && state.formulario_1.semovientes.length < 1"
                  
                   hide-details
                  >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.raza  && state.formulario_1.semovientes.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
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

              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">CANTIDAD</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_1.cantidad"
                  @input="miValidacion(),setProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_1.cantidad
                   && state.formulario_1.semovientes.length < 1"
                   hide-details                                 
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.cantidad
                 && state.formulario_1.semovientes.length < 1">
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
                  v-model="state.formulario_1.precio_base"
                  readonly
                  :error="submitButton && !state.formulario_1.precio_base
                   && state.formulario_1.semovientes.length < 1"
                   hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.precio_base
                 && state.formulario_1.semovientes.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">AVALUO PROVISIONAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.avaluo_provisional"
                  readonly
                  :error="submitButton && !state.formulario_1.avaluo_provisional
                   && state.formulario_1.semovientes.length < 1"
                   hide-details
                >               
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddSelfMoving()
                    :disabled="
                      !state.formulario_1.id_semoviente_clase_precio_base ||
                      !state.formulario_1.cantidad
                    ">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.avaluo_provisional  && state.formulario_1.semovientes.length < 1">
                 <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    El campo es requerido
                  </div>
                 </div>
               </template>
              </v-col>
            </v-row>

            <v-row class="mb-3">
              <v-col v-if="state.formulario_1.semovientes.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Clase</th>
                      <th class="text-center">Raza</th>
                      <th class="text-center">Precio Base</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Avaluo Provisional</th>
                      <th class="text-center">Observaciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_1.semovientes"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_semoviente }}</td>
                      <td class="text-center">{{ item.raza }}</td>
                      <td class="text-center">{{ item.precio_base }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.avaluo_provisional }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteSelfMoving(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
              
            </v-row>
          </v-expansion-panel-text>

        </v-expansion-panel>
        <template v-if="submitButton && !sendForm_1  && state.formulario_1.semovientes.length < 1">
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
                <v-btn class="bg-primary" @click="openModal('semoviente-general')" block>
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
        <template v-if="submitButton && !sendForm_2 && state.formulario_2.fotografias.length == 0">
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

  <picture-capture :id_bien="id_bien" :id_bien_registro="id_bien_registro" :dialog="dialog" :nombre_imagen="nombre_imagen" ref="pictureModal" @dialog-off="closeModal" @return-image="getImageRecord"></picture-capture>
</template>


<style>
.size_fijo {
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
</style>