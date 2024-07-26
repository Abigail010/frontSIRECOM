<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { useResourceStore } from '@/stores/resource';
import { useConsumableStore } from '@/stores/moduleOne/consumable';
import { validateText } from '@/utils/helpers/validateText'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import pictureCapture from './pictureCapture.vue';  // IMAGENES
import Swal from 'sweetalert2'

  const route = useRoute()
  const resourceStore = useResourceStore()
  const consumableStore = useConsumableStore()
  
  const addContainerButton = ref(false)
  const addInventoryButton = ref(false)
  const submitButton = ref(false)
  const sendContainer = ref(true)
  const sendInventory = ref(true)
  const sendForm = ref(true)
  const isLoading = ref(false)

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Consumible',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state:any = reactive({
    formData: {
      id_caso: route.params.id_caso,
      id_bien_registro: route.params.id_bien_registro,
      contenedores: [] as any,
      contenedores_eliminados: [] as any,
      inventarios: [] as any,
      inventarios_eliminados: [] as any,
      fotografias: [] as any,
      fotografias_eliminadas: [] as any,
    } as any,
    formulario_1: {
      nombre_consumible: '',
      tipo_contenedor: '',
      tamanio_contenedor: '',
      cantidad: '',
      volumen_peso_unidad: '',
      volumen_peso_total: '',
      unidad_medida: '',
      estado_consumible: '',
      fecha_vencimiento: '',
      marca: '',
      observaciones: '',
      precio_base: '',
      avaluo_provisional: ''
    } as any,
    formulario_2: {
      descripcion: '',
      unidad_medida: '',
      cantidad: '',
      observaciones: ''
    } as any
  });

  // DECLARACION DE CONSTANTES PARA LECTURA DE FORMULARIO
  const openpanel = ref([0])
  const nuevo = ref(true)
  const dialog = ref<boolean>(false)
  const pictureModal = ref<any>(null)
  const id_bien = route.params.id_bien
  const id_bien_registro = route.params.id_bien_registro
  const nombre_imagen = ref<any>('')

  const openModal = async(imagen: any) =>{
    if(imagen.includes('inventario')){
      addInventoryButton.value = true
      await addInventoryValidacion()
      if(!sendInventory.value) return
    }

    nombre_imagen.value = imagen
    dialog.value = true;
    addInventoryButton.value = false
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    // UNA VEZ OBTENIDA LA IMAGEN, SE GUARDA LA INFORMACION DEL FORMULARIO Y LA IMAGEN EN UN ARRAY
    if(value.respuesta.nombre_imagen.includes('inventario')){
      // SI EL RESULTADO ES PARA INVENTARIO
      state.formData.inventarios.push({
        descripcion: state.formulario_2.descripcion,
        unidad_medida: state.formulario_2.unidad_medida,
        cantidad_envase: state.formulario_2.cantidad,
        observaciones: state.formulario_2.observaciones,

        id_bien: id_bien,
        id_bien_registro: id_bien_registro,
        nombre_imagen: 'consumible-inventario',
        imagen: value.respuesta.imagenBase64,
        picture: value.respuesta.picture,

        id_consumible_imagen: ''
      })
      state.formulario_2.descripcion = ''
      state.formulario_2.unidad_medida = ''
      state.formulario_2.cantidad = ''
      state.formulario_2.observaciones = ''
    }else{
      // EL RESULTADO ES PARA FOTOGRAFIAS GENERALES
      state.formData.fotografias.push({
        id_consumible_imagen: '',
        id_bien: id_bien,
        id_bien_registro: id_bien_registro,
        nombre_imagen: 'consumible-general',
        imagen: value.respuesta.imagenBase64,
        picture: value.respuesta.picture,
      })
    }
  }

  // LISTA DE RECURSOS A UTILIZARSE EN EL FORMULARIO
  // TAMANIO DE CONTENEDORES
  const lista_tamanio_contenedor = ref([
    { title: 'GRANDE' },
    { title: 'MEDIANO' },
    { title: 'PEQUEÑO' }
  ])
  // UNIDAD DE MEDIDA
  const lista_unidad_medida = ref([
    { title: 'GRAMO [g]' },
    { title: 'KILOGRAMO [kg]' },
    { title: 'TONELADA [t]' },
    { title: 'CENTIMETRO CUBICO [cm³]' },
    { title: 'LITRO [l]' },
    { title: 'METRO CUBICO [m³]' },
    { title: 'OTRO' }
  ])
  // TIPO DE SUSTANCIA
   const lista_estado_consumible = ref([
    { title: 'LIQUIDO' },
    { title: 'SOLIDO' },
    { title: 'OTRO' }
  ])

  const lista_contenedores = ref([])
  const getContainersList = async() => {
    lista_contenedores.value = await resourceStore.getConsumableContainers()
  }

  const getConsumableById = async(id_bien_registro: any) => {
    const resultado = await consumableStore.consumable(id_bien_registro)

    if(!resultado.nuevo){
      nuevo.value = false

      const contenedores = resultado.formulario_1.contenedores
      for (let i = 0; i < contenedores.length; i++) {
        state.formData.contenedores.push(contenedores[i])
      }

      const inventarios = resultado.formulario_2.inventarios
      for (let i = 0; i < inventarios.length; i++) {
        state.formData.inventarios.push(inventarios[i])
      }

      const fotografias = resultado.formulario_3.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formData.fotografias.push(fotografias[i]) 
      }
    }

  }

  const calculateTotal = () => {
    if(state.formulario_1.cantidad && state.formulario_1.volumen_peso_unidad){
      state.formulario_1.volumen_peso_total = state.formulario_1.cantidad * state.formulario_1.volumen_peso_unidad
    }else{
      state.formulario_1.volumen_peso_total = ''
    }
  }

  const calculateProvisionalAppraisal = () => {
    if(state.formulario_1.cantidad && state.formulario_1.precio_base){
      state.formulario_1.avaluo_provisional = state.formulario_1.cantidad * state.formulario_1.precio_base
    }else{
      state.formulario_1.avaluo_provisional = ''
    }
  }

  const buttonAddContainer = async () => {
    addContainerButton.value = true
    await addContainerValidacion()
    if(!sendContainer.value) return

    state.formData.contenedores.push({
      nombre_consumible: state.formulario_1.nombre_consumible,
      tipo_contenedor: state.formulario_1.tipo_contenedor,
      tamanio_contenedor: state.formulario_1.tamanio_contenedor,
      cantidad: state.formulario_1.cantidad,
      volumen_peso_unidad: state.formulario_1.volumen_peso_unidad,
      volumen_peso_total: state.formulario_1.volumen_peso_total,
      unidad_medida: state.formulario_1.unidad_medida,
      estado_consumible: state.formulario_1.estado_consumible,
      fecha_vencimiento: state.formulario_1.fecha_vencimiento,
      marca: state.formulario_1.marca,
      observaciones: state.formulario_1.observaciones,
      precio_base: state.formulario_1.precio_base,
      avaluo_provisional: state.formulario_1.avaluo_provisional
    })
    state.formulario_1.nombre_consumible = ''
    state.formulario_1.tipo_contenedor = ''
    state.formulario_1.tamanio_contenedor = ''
    state.formulario_1.cantidad = ''
    state.formulario_1.volumen_peso_unidad = ''
    state.formulario_1.volumen_peso_total = ''
    state.formulario_1.unidad_medida = ''
    state.formulario_1.estado_consumible = ''
    state.formulario_1.fecha_vencimiento = ''
    state.formulario_1.marca = ''
    state.formulario_1.observaciones = ''
    state.formulario_1.precio_base = ''
    state.formulario_1.avaluo_provisional = ''
    addContainerButton.value = false
  }

  const buttonDeleteContainer = (index: number, id_consumible_caracteristicas_envase: any) => {
    if(id_consumible_caracteristicas_envase){
      state.formData.contenedores_eliminados.push(id_consumible_caracteristicas_envase)
    }
    state.formData.contenedores.splice(index,1)
  }

  const buttonDeleteInventory = (index: number, id_consumible_inventario: any) => {
    if(id_consumible_inventario){
      state.formData.inventarios_eliminados.push(id_consumible_inventario)
    }
    state.formData.inventarios.splice(index,1)
  }

  const buttonDeletePicture = (index: number, id_consumible_imagen: any) => {
    console.log(id_consumible_imagen);
    if(id_consumible_imagen){
      state.formData.fotografias_eliminadas.push(id_consumible_imagen)
    }
    state.formData.fotografias.splice(index,1)
  }

  const addContainerValidacion = async () => {
    sendContainer.value = true
    if(!state.formulario_1.nombre_consumible ||
      !state.formulario_1.tipo_contenedor ||
      !state.formulario_1.tamanio_contenedor ||
      !state.formulario_1.estado_consumible ||
      !state.formulario_1.unidad_medida ||
      !state.formulario_1.cantidad ||
      !state.formulario_1.volumen_peso_unidad ||
      !state.formulario_1.volumen_peso_total ||
      !state.formulario_1.precio_base){
      sendContainer.value = false
    }
  }

  const addInventoryValidacion = async () => {
    sendInventory.value = true
    if(!state.formulario_2.descripcion ||
      !state.formulario_2.unidad_medida ||
      !state.formulario_2.cantidad){
      sendInventory.value = false
    }
  }

  const miValidacion = async () => {
    sendForm.value = true
    if(state.formData.contenedores.length==0 ||
      state.formData.inventarios.length==0 ||
      state.formData.fotografias.length==0){
      sendForm.value = false
    }
  }

  const buttonReturnList = () => {
    router.back()
  }

  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value) return

    isLoading.value = true
    const { ok, message, id } = nuevo.value ? await consumableStore.createConsumable(state.formData) : await consumableStore.updateConsumable(state.formData)

    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })
    if(id != 0){
      consumableStore.consumableReport(id)
    }
    isLoading.value = false
  }

  onMounted( async () => {
    await getContainersList()
    await getConsumableById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Consumibles</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. DATOS DEL CONSUMIBLE</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">NOMBRE DE CONSUMIBLE</v-label>
                <v-text-field
                  v-model.trim="state.formulario_1.nombre_consumible"
                  @input="state.formulario_1.nombre_consumible = validateText(state.formulario_1.nombre_consumible.toUpperCase())"
                  :error="addContainerButton && !state.formulario_1.nombre_consumible"
                  color="primary"
                  variant="outlined"
                  type="text"
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.nombre_consumible">
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
                  v-model.trim="state.formulario_1.marca"
                  @input="state.formulario_1.marca = validateText(state.formulario_1.marca.toUpperCase())"
                  color="primary"
                  variant="outlined"
                  type="text"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TIPO</v-label>
                <v-select
                  v-model="state.formulario_1.tipo_contenedor"
                  :items="lista_contenedores"
                  :error="addContainerButton && !state.formulario_1.tipo_contenedor"
                  item-title="nombre_contenedor"
                  item-value="nombre_contenedor"
                  clearable
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.tipo_contenedor">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TAMAÑO</v-label>
                <v-select
                  v-model="state.formulario_1.tamanio_contenedor"
                  :items="lista_tamanio_contenedor"
                  :error="addContainerButton && !state.formulario_1.tamanio_contenedor"
                  item-title="title"
                  item-value="title"
                  clearable
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.tamanio_contenedor">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO CONSUMIBLE</v-label>
                <v-select
                  v-model="state.formulario_1.estado_consumible"
                  :items="lista_estado_consumible"
                  :error="addContainerButton && !state.formulario_1.estado_consumible"
                  item-title="title"
                  item-value="title"
                  clearable
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.estado_consumible">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">UNIDAD DE MEDIDA</v-label>
                <v-select
                  v-model="state.formulario_1.unidad_medida"
                  :items="lista_unidad_medida"
                  :error="addContainerButton && !state.formulario_1.unidad_medida"
                  item-title="title"
                  item-value="title"
                  clearable
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.unidad_medida">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">CANTIDAD</v-label>
                <v-text-field
                  v-model="state.formulario_1.cantidad"
                  @input="calculateTotal(); calculateProvisionalAppraisal();"
                  :error="addContainerButton && !state.formulario_1.cantidad"
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.cantidad">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">VOLUMEN/PESO (UNIDAD)</v-label>
                <v-text-field
                  v-model="state.formulario_1.volumen_peso_unidad"
                  @input="calculateTotal()"
                  :error="addContainerButton && !state.formulario_1.volumen_peso_unidad"
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.volumen_peso_unidad">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">VOLUMEN/PESO (TOTAL)</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model="state.formulario_1.volumen_peso_total"
                  :error="addContainerButton && !state.formulario_1.volumen_peso_total"
                  hide-details
                  readonly
                />
                <template v-if="addContainerButton && !state.formulario_1.volumen_peso_total">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">FECHA DE VENCIMIENTO</v-label>
                <v-text-field
                  v-model.trim="state.formulario_1.fecha_vencimiento"
                  @input="state.formulario_1.fecha_vencimiento = validateText(state.formulario_1.fecha_vencimiento.toUpperCase())"
                  color="primary"
                  variant="outlined"
                  type="date"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                <v-text-field
                  v-model="state.formulario_1.precio_base"
                  @input="calculateProvisionalAppraisal();"
                  :error="addContainerButton && !state.formulario_1.precio_base"
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  hide-details
                />
                <template v-if="addContainerButton && !state.formulario_1.precio_base">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">AVALÚO PROVISIONAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  min="0"
                  v-model="state.formulario_1.avaluo_provisional"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="12">
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
                    @click="buttonAddContainer()"
                  >
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row class="mb-3">
              <v-col v-if="state.formData.contenedores.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Nombre consumible</th>
                      <th class="text-center">Tipo</th>
                      <th class="text-center">Tamaño</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Volumen/Peso (U)</th>
                      <th class="text-center">Volumen/Peso (T)</th>
                      <th class="text-center">Unidad Medida</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Fecha Vencimiento</th>
                      <th class="text-center">Marca</th>
                      <th class="text-center">Observaciones</th>
                      <th class="text-center">Precio Base</th>
                      <th class="text-center">Avalúo Provisional</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formData.contenedores"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_consumible }}</td>
                      <td class="text-center">{{ item.tipo_contenedor }}</td>
                      <td class="text-center">{{ item.tamanio_contenedor }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.volumen_peso_unidad }}</td>
                      <td class="text-center">{{ item.volumen_peso_total }}</td>
                      <td class="text-center">{{ item.unidad_medida }}</td>
                      <td class="text-center">{{ item.estado_consumible }}</td>
                      <td class="text-center">{{ item.fecha_vencimiento }}</td>
                      <td class="text-center">{{ item.marca }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center">{{ item.precio_base }}</td>
                      <td class="text-center">{{ item.avaluo_provisional }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteContainer(index, item.id_consumible_caracteristicas_envase)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && state.formData.contenedores.length==0">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">2. INVENTARIO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">DESCRIPCION</v-label>
                <v-text-field
                  v-model.trim="state.formulario_2.descripcion"
                  @input="state.formulario_2.descripcion = validateText(state.formulario_2.descripcion.toUpperCase())"
                  :error="addInventoryButton && !state.formulario_2.descripcion"
                  color="primary"
                  variant="outlined"
                  type="text"
                  hide-details
                />
                <template v-if="addInventoryButton && !state.formulario_2.descripcion">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">UNIDAD DE MEDIDA</v-label>
                <v-select
                  v-model="state.formulario_2.unidad_medida"
                  :items="lista_unidad_medida"
                  :error="addInventoryButton && !state.formulario_2.unidad_medida"
                  item-title="title"
                  item-value="title"
                  clearable
                  hide-details
                />
                <template v-if="addInventoryButton && !state.formulario_2.unidad_medida">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CANTIDAD</v-label>
                <v-text-field 
                  v-model="state.formulario_2.cantidad"
                  :error="addInventoryButton && !state.formulario_2.cantidad"
                  variant="outlined"
                  color="primary"
                  min="0"
                  type="number"
                  hide-details
                />
                <template v-if="addInventoryButton && !state.formulario_2.cantidad">
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
                  v-model.trim="state.formulario_2.observaciones"
                  @input="state.formulario_2.observaciones = validateText(state.formulario_2.observaciones.toUpperCase())"
                  color="primary"
                  variant="outlined"
                  type="text"
                  hide-details
                >
                  <template v-slot:append>
                    <v-btn 
                      color="primary"
                      @click="openModal('consumible-inventario')"
                    >
                      <PlusIcon/> Imagen
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col v-if="state.formData.inventarios.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Imagen</th>
                      <th class="text-center">Descripcion</th>
                      <th class="text-center">Unidad de Medida</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Observaciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formData.inventarios"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">
                        <v-avatar size="150">
                          <img :src="item.imagen" width="150"/>
                        </v-avatar>
                      </td>
                      <td class="text-center">{{ item.descripcion }}</td>
                      <td class="text-center">{{ item.unidad_medida }}</td>
                      <td class="text-center">{{ item.cantidad_envase }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteInventory(index, item.id_consumible_inventario)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && state.formData.inventarios.length==0">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">3. FOTOGRAFIA</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            
            <v-row class="mb-5">
              <v-col cols="12">
                <v-btn class="bg-primary" @click="openModal('consumible-general')" block>
                  <CloudUploadIcon class="mx-2"></CloudUploadIcon> Subir Imagen
                </v-btn>
              </v-col>
            </v-row>

            <template v-if="state.formData.fotografias.length>0">
              <v-row>
                <v-col cols="12" md="6" v-for="(imagen, index) in state.formData.fotografias">
                  <v-card elevation="10" rounded="md">
                    <div class="text-center py-3">
                      <img :src="imagen.imagen" alt="noImage" height="250"/>
                    </div>
                    <div class="d-flex justify-end mr-3 mt-n3 pb-1">
                      <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index, imagen.id_consumible_imagen)">
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
            </template>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && state.formData.fotografias.length==0">
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
  />

</template>


<style>
.size_fijo {
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
</style>