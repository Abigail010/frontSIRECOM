<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useArtworkStore } from '@/stores/moduleOne/artwork';
import { validateText } from '@/utils/helpers/validateText'
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const resourceStore = useResourceStore()
  const artworkStore = useArtworkStore()
  const addContainerButton=ref(false)
  const sendContainer=ref(true)
  const sendForm=ref(true)
  const submitButton= ref(false)

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Obra de Arte o Pieza Arqueológica',
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
      id_obra_pieza_tipo: '',
      nombre_obra_pieza: '',
      cantidad: '',
      precio_base: '',
      avaluo_provisional: '',
      observaciones: '',
      obras_piezas: [],
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
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    state.formulario_2.fotografias.push({
      id_obra_pieza_imagen: '',
      id_bien: id_bien,
      id_bien_registro: id_bien_registro,
      nombre_imagen: 'arte-general',
      imagen: value.respuesta.imagenBase64,
      picture: value.respuesta.picture,
    })
  }

  // LISTA DE RECURSOS A UTILIZARSE EN EL FORMULARIO

  const lista_tipos_obras_piezas = ref([])
  const getArtworkArchaeologicalPiecesList = async() => {
    lista_tipos_obras_piezas.value = await resourceStore.getArtworkArchaeologicalPieces()
  }

  const setArtworkName = () => {
    const registro:any = lista_tipos_obras_piezas.value.find( (obra: any) => obra.id == state.formulario_1.id_obra_pieza_tipo )
    state.formulario_1.nombre_obra_pieza = registro.nombre_obra_pieza
  }

  const getArtworkById = async(id_bien_registro: any) => {
    const resultado = await artworkStore.artwork(id_bien_registro)

    if(!resultado.nuevo){
      nuevo.value = false

      const obras_piezas = resultado.formulario_1.obras_piezas
      for (let i = 0; i < obras_piezas.length; i++) {
        state.formulario_1.obras_piezas.push(obras_piezas[i])
      }

      const fotografias = resultado.formulario_2.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_2.fotografias.push(fotografias[i])
      }

    }
  }

  const calculateTotal = () => {
    if(state.formulario_1.cantidad && state.formulario_1.precio_base){
      state.formulario_1.avaluo_provisional = state.formulario_1.cantidad * state.formulario_1.precio_base
    }else{
      state.formulario_1.avaluo_provisional = ''
    }
  }
  

  const buttonAddContainer = async() => {
    addContainerButton.value=true
    await addContainerValidacion()
    if(!sendContainer.value)return
    state.formulario_1.obras_piezas.push({
      id_obra_pieza_tipo: state.formulario_1.id_obra_pieza_tipo,
      nombre_obra_pieza: state.formulario_1.nombre_obra_pieza,
      cantidad: state.formulario_1.cantidad,
      precio_base: state.formulario_1.precio_base,
      avaluo_provisional: state.formulario_1.avaluo_provisional,
      observaciones: state.formulario_1.observaciones
    })
    state.formulario_1.id_obra_pieza_tipo = ''
    state.formulario_1.nombre_obra_pieza = ''
    state.formulario_1.cantidad = ''
    state.formulario_1.precio_base = ''
    state.formulario_1.avaluo_provisional = ''
    state.formulario_1.observaciones = ''
  }

  const buttonDeleteArtwork = (index: number) => {
    state.formulario_1.obras_piezas.splice(index,1)
  }

  const buttonDeletePicture = (index: number, id_obra_pieza_imagen: number) => {
    state.id_imagenes_eliminadas.push(id_obra_pieza_imagen)
    state.formulario_2.fotografias.splice(index,1)
  }

  const buttonReturnList = () => {
    router.back()
  }
//VALIDACION CONTENEDOR
  const addContainerValidacion= async()=>{
    sendContainer.value=true
    if(!state.formulario_1.id_obra_pieza_tipo || !state.formulario_1.cantidad || 
       !state.formulario_1.precio_base){
        sendContainer.value=false
    }
  }


//VALIDACION FORMULARIO  
  const miValidacion= async()=>{
  sendForm.value=true
    if(state.formulario_1.obras_piezas.length==0 ||state.formulario_2.fotografias.length==0){
      sendForm.value=false
    }
  }

  const buttonSendForm = async () => {
  submitButton.value=true
  await miValidacion() 
   if(!sendForm.value) return
    state.formData.id_bien_registro = route.params.id_bien_registro
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    state.formData.id_imagenes_eliminadas = state.id_imagenes_eliminadas
    // SI ES ACTUALIZACION, ELIMINAMOS LAS IMAGENES QUE YA NO EXISTEN
    isLoading.value = true
    // GUARDADO DEL FORMULARIO 1
    const { ok, message, id } = nuevo.value ? await artworkStore.createArtwork(state.formData) : await artworkStore.updateArtwork(state.formData)
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })
    if(id != 0){
      artworkStore.artworkReport(id)
    }
  }

  onMounted( async () => {
    await getArtworkArchaeologicalPiecesList()
    await getArtworkById(route.params.id_bien_registro)
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Obras de arte o piezas arqueológicas</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. INVENTARIO DE OBRAS DE ARTE O PIEZAS ARQUEOLÓGICAS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TIPO<span style="color:red">*</span></v-label>
                <v-select
                  v-model="state.formulario_1.id_obra_pieza_tipo"
                  :items="lista_tipos_obras_piezas"
                  item-title="nombre_obra_pieza"
                  item-value="id"
                  @update:model-value="setArtworkName()"
                  @input="addContainerValidacion(), miValidacion()"
                  :error="  addContainerButton && !state.formulario_1.id_obra_pieza_tipo && state.formulario_1.obras_piezas.length==0|| submitButton && !state.formulario_1.id_obra_pieza_tipo && state.formulario_1.obras_piezas.length==0 "
                  hide-details                  
                ></v-select>
                <template v-if="addContainerButton && !state.formulario_1.id_obra_pieza_tipo && state.formulario_1.obras_piezas.length==0 || submitButton && !state.formulario_1.id_obra_pieza_tipo && state.formulario_1.obras_piezas.length==0  ">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">CANTIDAD<span style="color:red">*</span></v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_1.cantidad"
                  @input="addContainerValidacion(), calculateTotal()"
                  :error="  addContainerButton && !state.formulario_1.cantidad && state.formulario_1.obras_piezas.length==0  || submitButton  && !state.formulario_1.cantidad && state.formulario_1.obras_piezas.length==0 "
                  hide-details 
                >
                </v-text-field>
                <template v-if="addContainerButton && !state.formulario_1.cantidad && state.formulario_1.obras_piezas.length==0 || submitButton  && !state.formulario_1.cantidad && state.formulario_1.obras_piezas.length==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PRECIO BASE<span style="color:red">*</span></v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_1.precio_base"
                  @input="addContainerValidacion(), calculateTotal()"
                  :error="  addContainerButton && !state.formulario_1.precio_base && state.formulario_1.obras_piezas.length==0 || submitButton && !state.formulario_1.precio_base && state.formulario_1.obras_piezas.length==0"
                  hide-details 
                >
                </v-text-field>
                <template v-if="addContainerButton && !state.formulario_1.precio_base  && state.formulario_1.obras_piezas.length==0|| submitButton && !state.formulario_1.precio_base && state.formulario_1.obras_piezas.length==0">
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
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="8">
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
                    @click= buttonAddContainer()>
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row class="mb-3">
              <v-col v-if="state.formulario_1.obras_piezas.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Tipo</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Precio base</th>
                      <th class="text-center">Avaluo provisional</th>
                      <th class="text-center">Observaciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_1.obras_piezas"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_obra_pieza }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.precio_base }}</td>
                      <td class="text-center">{{ item.avaluo_provisional }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteArtwork(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && state.formulario_1.obras_piezas.length==0">
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
                <v-btn class="bg-primary" @click="openModal('arte-general')" block>
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
                    <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index,imagen.id_obra_pieza_imagen)">
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
          <v-col cols="12">
            <div class="v-messages font-weight-black py-2">
              <div class="v-messages__message text-error">
                Se debe cargar al menos una foto
              </div>
            </div>
          </v-col>
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