<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useControlledSubstanceStore } from '@/stores/moduleOne/controlledSubstance';
import { validateText } from '@/utils/helpers/validateText'
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const resourceStore = useResourceStore()        
  const controlledSubstanceStore = useControlledSubstanceStore()

  const addInventoryButton = ref(false)
  const sendInventory=ref(true)
  const addSubstance=ref(true)
  const addSubstanceButton=ref(false)
  const sendForm = ref(true)
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
      text: 'Sustancia controlada',
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
      id_sustancia_tipo: '',
      observaciones: '',
    } as any,
    formulario_2: {
      tipo_contenedor: '',
      tamanio_contenedor: '',
      cantidad: '',
      volumen_peso_unidad: '',
      volumen_peso_total: '',
      unidad_medida: '',
      estado_sustancia: '',
      fecha_vencimiento: '',
      marca: '',
      observaciones: '',
      contenedores: []
    } as any,
    formulario_3: {
      descripcion: '',
      unidad_medida: '',
      cantidad: '',
      observaciones: '',
      inventarios: []
    } as any,
    formulario_4: {
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
    // getImages()
  }

  //VALIDACION FORMULARIO 3 (INVENTARIO)
    const inventoryValidation = async () => {
      sendInventory.value=true
      if(!state.formulario_3.descripcion || !state.formulario_3.unidad_medida || !state.formulario_3.cantidad)
        {
          sendInventory.value=false
        }
    }

  const getImageRecord = async (res: any) => {
    // UNA VEZ OBTENIDA LA IMAGEN, SE GUARDA LA INFORMACION DEL FORMULARIO Y LA IMAGEN EN UN ARRAY
    if(res.respuesta.nombre_imagen.includes('inventario')){
        state.formulario_3.inventarios.push({
        descripcion: state.formulario_3.descripcion,
        unidad_medida: state.formulario_3.unidad_medida,
        cantidad_envase: state.formulario_3.cantidad,
        observaciones: state.formulario_3.observaciones,
        id_bien: id_bien,
        id_bien_registro: id_bien_registro,
        nombre_imagen: 'sscc-inventario',
        imagen: res.respuesta.imagenBase64,
        picture: res.respuesta.picture,

        id_sustancia_imagen: ''
      })
      state.formulario_3.descripcion = ''
      state.formulario_3.unidad_medida = ''
      state.formulario_3.cantidad = ''
      state.formulario_3.observaciones = ''
    }else{
      // EL RESULTADO ES PARA FOTOGRAFIAS GENERALES
      state.formulario_4.fotografias.push({
        id_sustancia_imagen: '',
        id_bien: id_bien,
        id_bien_registro: id_bien_registro,
        nombre_imagen: 'sscc-general',
        imagen: res.respuesta.imagenBase64,
        picture: res.respuesta.picture,
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
   const lista_estado_sustancia = ref([
    { title: 'LIQUIDO' },
    { title: 'SOLIDO' },
    { title: 'OTRO' }
  ])

  const lista_tipos_sustancia = ref([])
  const getSubstancesList = async() => {
    lista_tipos_sustancia.value = await resourceStore.getSubstances()
  }

  const lista_contenedores = ref([])
  const getContainersList = async() => {
    lista_contenedores.value = await resourceStore.getControlledSubstanceContainers()
  }

  const getControlledSubstanceById = async(id_bien_registro: any) => {
    const resultado = await controlledSubstanceStore.controlledSubstance(id_bien_registro)
    if(!resultado.nuevo){
      nuevo.value = false

      state.formulario_1.id_sustancia_tipo = resultado.formulario_1.id_sustancia_tipo
      state.formulario_1.observaciones = resultado.formulario_1.observaciones

      const contenedores = resultado.formulario_2.contenedores
      for (let i = 0; i < contenedores.length; i++) {
        state.formulario_2.contenedores.push(contenedores[i])
      }

      const inventarios = resultado.formulario_3.inventarios
      for (let i = 0; i < inventarios.length; i++) {
        state.formulario_3.inventarios.push(inventarios[i])
      }

      const fotografias = resultado.formulario_4.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_4.fotografias.push(fotografias[i]) 
      }

    }
  }

  const calculateTotal = () => {
    if(state.formulario_2.cantidad && state.formulario_2.volumen_peso_unidad){
      state.formulario_2.volumen_peso_total = state.formulario_2.cantidad * state.formulario_2.volumen_peso_unidad
    }else{
      state.formulario_2.volumen_peso_total = ''
    }
  }

  //VALIDACION FORMUALARIO 2 
    const substanceValidation = async () => {
      addSubstance.value=true
      //VALIDACION DE CONTENEDORES
      if(!state.formulario_2.tipo_contenedor || !state.formulario_2.tamanio_contenedor || !state.formulario_2.unidad_medida 
        || !state.formulario_2.cantidad || !state.formulario_2.volumen_peso_unidad || !state.formulario_2.estado_sustancia
      ){
        addSubstance.value=false
      }
    }


  const buttonAddContainer = async () => {
    addSubstanceButton.value=true
    await substanceValidation()
    if(!addSubstance.value)return
    state.formulario_2.contenedores.push({
      tipo_contenedor: state.formulario_2.tipo_contenedor,
      tamanio_contenedor: state.formulario_2.tamanio_contenedor,
      cantidad: state.formulario_2.cantidad,
      volumen_peso_unidad: state.formulario_2.volumen_peso_unidad,
      volumen_peso_total: state.formulario_2.volumen_peso_total,
      unidad_medida: state.formulario_2.unidad_medida,
      estado_sustancia: state.formulario_2.estado_sustancia,
      fecha_vencimiento: state.formulario_2.fecha_vencimiento,
      marca: state.formulario_2.marca,
      observaciones: state.formulario_2.observaciones
    })
    state.formulario_2.tipo_contenedor = ''
    state.formulario_2.tamanio_contenedor = ''
    state.formulario_2.cantidad = ''
    state.formulario_2.volumen_peso_unidad = ''
    state.formulario_2.volumen_peso_total = ''
    state.formulario_2.unidad_medida = ''
    state.formulario_2.estado_sustancia = ''
    state.formulario_2.fecha_vencimiento = ''
    state.formulario_2.marca = ''
    state.formulario_2.observaciones = ''
    //state.formulario_1.id_sustancia_tipo = ''
  }

  const buttonDeleteContainer = (index: number) => {
    state.formulario_2.contenedores.splice(index,1)
  }

  const buttonDeleteInventory = (index: number, id_sustancia_imagen: number) => {
    state.id_imagenes_eliminadas.push(id_sustancia_imagen)
    state.formulario_3.inventarios.splice(index,1)
   
  }

  const buttonDeletePicture = (index: number,id_sustancia_imagen:number) => {
    state.id_imagenes_eliminadas.push(id_sustancia_imagen)
    state.formulario_4.fotografias.splice(index,1)
  }


  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const buttonReturnList = () => {
    router.back()
  } 

//VALIDACION PARA TODO EL FORMULARIO

  const miValidacion = async () => {
  sendForm.value = true
  if(state.formulario_2.contenedores.length==0 ||
  state.formulario_3.inventarios.length==0 ||
  state.formulario_4.fotografias.length==0){
          sendForm.value = false
        }
      }

// BOTON PARA ENVIAR
  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
      state.formData.id_bien_registro = route.params.id_bien_registro
      state.formData.formulario_1 = state.formulario_1
      state.formData.formulario_2 = state.formulario_2
      state.formData.formulario_3 = state.formulario_3
      state.formData.formulario_4 = state.formulario_4
      state.formData.id_imagenes_eliminadas = state.id_imagenes_eliminadas
      isLoading.value = true

    // GUARDADO DEL FORMULARIO 
      const { ok, message, id } = nuevo.value ? await controlledSubstanceStore.createControlledSubstance(state.formData) : await controlledSubstanceStore.updateControlledSubstance(state.formData)
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
        controlledSubstanceStore.controlledSubstanceReport(id)
      }
  }

  onMounted( async () => {
    await getSubstancesList()
    await getContainersList()
    await getControlledSubstanceById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Sustancias Controladas</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. DATOS DE LA SUSTANCIA CONTROLADA</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO DE SUSTANCIA CONTROLADA<span style="color:red">*</span></v-label>
                <v-select 
                  v-model="state.formulario_1.id_sustancia_tipo"
                  :items="lista_tipos_sustancia"
                  item-title="nombre_sustancia"
                  item-value="id"
                  @input=" substanceValidation(), miValidacion()"
                  :error="addSubstanceButton && !state.formulario_1.id_sustancia_tipo || submitButton && !state.formulario_1.id_sustancia_tipo && state.formulario_2.contenedores.length==0"
                  hide-details
                ></v-select>
                <template v-if="addSubstanceButton && !state.formulario_1.id_sustancia_tipo || submitButton && !state.formulario_1.id_sustancia_tipo && state.formulario_2.contenedores.length==0">
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
            </v-row>

            <h3 class="mb-3 text-primary">Detalle de contenedor</h3>

            <v-row >
              <v-col  cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TIPO<span style="color:red">*</span></v-label>
                <v-select
                  v-model="state.formulario_2.tipo_contenedor"
                  :items="lista_contenedores"
                  item-title="nombre_contenedor"
                  item-value="nombre_contenedor"
                  @input="substanceValidation()"
                  :error="addSubstanceButton && !state.formulario_2.tipo_contenedor && state.formulario_2.contenedores.length==0 || submitButton && !state.formulario_2.tipo_contenedor && state.formulario_2.contenedores.length==0"
                  hide-details
                ></v-select>
                <template v-if="addSubstanceButton && !state.formulario_2.tipo_contenedor && state.formulario_2.contenedores.length==0 || submitButton && !state.formulario_2.tipo_contenedor && state.formulario_2.contenedores.length==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">TAMAÑO<span style="color:red">*</span></v-label>
                <v-select
                  v-model="state.formulario_2.tamanio_contenedor"
                  :items="lista_tamanio_contenedor"
                  item-title="title"
                  item-value="title"
                   @input="substanceValidation()"
                  :error="addSubstanceButton && !state.formulario_2.tamanio_contenedor &&  state.formulario_2.contenedores.length == 0 || submitButton && !state.formulario_2.tamanio_contenedor && state.formulario_2.contenedores.length==0"
                  hide-details
                ></v-select>
                <template v-if="addSubstanceButton  && !state.formulario_2.tamanio_contenedor &&  state.formulario_2.contenedores.length == 0 || submitButton && !state.formulario_2.tamanio_contenedor && state.formulario_2.contenedores.length==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">UNIDAD DE MEDIDA<span style="color:red">*</span></v-label>
                <v-select
                  v-model="state.formulario_2.unidad_medida"
                  :items="lista_unidad_medida"
                  item-title="title"
                  item-value="title"
                  @input="substanceValidation()"
                  :error="addSubstanceButton && !state.formulario_2.unidad_medida && state.formulario_2.contenedores.length ==0 || submitButton  && !state.formulario_2.unidad_medida && state.formulario_2.contenedores.length==0"
                  hide-details
                ></v-select>
                <template v-if="addSubstanceButton &&  !state.formulario_2.unidad_medida && state.formulario_2.contenedores.length ==0 || submitButton  && !state.formulario_2.unidad_medida && state.formulario_2.contenedores.length==0">
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
                  v-model="state.formulario_2.cantidad"
                  @input="substanceValidation(),calculateTotal()"
                  :error="addSubstanceButton && !state.formulario_2.cantidad && state.formulario_2.contenedores.length == 0 || submitButton && !state.formulario_2.cantidad  && state.formulario_2.contenedores.length==0"
                  hide-details
                >
                </v-text-field>
                <template v-if="addSubstanceButton  && !state.formulario_2.cantidad && state.formulario_2.contenedores.length == 0 || submitButton && !state.formulario_2.cantidad && state.formulario_2.contenedores.length==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">VOLUMEN/PESO (UNIDAD)<span style="color:red">*</span></v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_2.volumen_peso_unidad"
                  @input="substanceValidation(),calculateTotal()"
                  :error="addSubstanceButton && !state.formulario_2.volumen_peso_unidad && state.formulario_2.contenedores.length ==0 || submitButton && !state.formulario_2.volumen_peso_unidad && state.formulario_2.contenedores.length==0"
                  hide-details
                >
                </v-text-field>
                <template v-if="addSubstanceButton &&  !state.formulario_2.volumen_peso_unidad && state.formulario_2.contenedores.length ==0 || submitButton && !state.formulario_2.volumen_peso_unidad &&  state.formulario_2.contenedores.length==0">
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
                  @input="calculateTotal()"
                  v-model="state.formulario_2.volumen_peso_total"
                  readonly
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO SUSTANCIA<span style="color:red">*</span></v-label>
                <v-select
                  v-model="state.formulario_2.estado_sustancia"
                  :items="lista_estado_sustancia"
                  item-title="title"
                  item-value="title"
                  @input=" substanceValidation()"
                  :error="addSubstanceButton && !state.formulario_2.estado_sustancia && state.formulario_2.contenedores.length ==0 || submitButton  && !state.formulario_2.estado_sustancia && state.formulario_2.contenedores.length==0"
                  hide-details
                ></v-select>
                <template v-if="addSubstanceButton && !state.formulario_2.estado_sustancia  && state.formulario_2.contenedores.length ==0 || submitButton  && !state.formulario_2.estado_sustancia && state.formulario_2.contenedores.length==0">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">FECHA DE VENCIMIENTO<span style="color:red">*</span></v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="date"
                  v-model.trim="state.formulario_2.fecha_vencimiento"
                  @input=" substanceValidation(),state.formulario_2.fecha_vencimiento = validateText(state.formulario_2.fecha_vencimiento.toUpperCase())"
                  :error="addSubstanceButton && !state.formulario_2.fecha_vencimiento && state.formulario_2.contenedores.length ==0 || submitButton && !state.formulario_2.fecha_vencimiento && state.formulario_2.contenedores.length==0"
                  hide-details
                >
                </v-text-field>
                <template v-if="addSubstanceButton &&  !state.formulario_2.fecha_vencimiento  && state.formulario_2.contenedores.length ==0 || submitButton && !state.formulario_2.fecha_vencimiento && state.formulario_2.contenedores.length==0 ">
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
                  type="text"
                  v-model.trim="state.formulario_2.marca"
                  @input="state.formulario_2.marca = validateText(state.formulario_2.marca.toUpperCase())"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.observaciones"
                  @input="state.formulario_2.observaciones = validateText(state.formulario_2.observaciones.toUpperCase())"
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
              <v-col v-if="state.formulario_2.contenedores.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
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
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_2.contenedores"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.tipo_contenedor }}</td>
                      <td class="text-center">{{ item.tamanio_contenedor }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.volumen_peso_unidad }}</td>
                      <td class="text-center">{{ item.volumen_peso_total }}</td>
                      <td class="text-center">{{ item.unidad_medida }}</td>
                      <td class="text-center">{{ item.estado_sustancia }}</td>
                      <td class="text-center">{{ item.fecha_vencimiento }}</td>
                      <td class="text-center">{{ item.marca }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteContainer(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm && state.formulario_2.contenedores.length==0">
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
                <v-label class="font-weight-medium mb-2">DESCRIPCION<span style="color:red">*</span></v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.descripcion"
                  @input="state.formulario_3.descripcion = validateText(state.formulario_3.descripcion.toUpperCase())"
                  :error=" addInventoryButton && !state.formulario_3.descripcion ||submitButton && !state.formulario_3.descripcion && state.formulario_3.inventarios.length <1"
                  hide-details
                  >
                </v-text-field>
                <template v-if="addInventoryButton && !state.formulario_3.descripcion ||submitButton && !state.formulario_3.descripcion&& state.formulario_3.inventarios.length <1">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>

              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">UNIDAD DE MEDIDA<span style="color:red">*</span></v-label>
                <v-select
                  v-model="state.formulario_3.unidad_medida"
                  :items="lista_unidad_medida"
                  item-title="title"
                  item-value="title"
                  :error="addInventoryButton && !state.formulario_3.unidad_medida ||submitButton && !state.formulario_3.unidad_medida && state.formulario_3.inventarios.length <1"
                  hide-details
                ></v-select>
                <template v-if="addInventoryButton && !state.formulario_3.unidad_medida ||submitButton && !state.formulario_3.unidad_medida && state.formulario_3.inventarios.length <1">
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
                  v-model="state.formulario_3.cantidad"
                  :error="addInventoryButton && !state.formulario_3.cantidad ||submitButton && !state.formulario_3.cantidad && state.formulario_3.inventarios.length <1"
                  hide-details
                >
                </v-text-field>
                <template v-if="addInventoryButton && !state.formulario_3.cantidad ||submitButton && !state.formulario_3.cantidad && state.formulario_3.inventarios.length <1">
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
                  v-model.trim="state.formulario_3.observaciones"
                  @input="state.formulario_3.observaciones = validateText(state.formulario_3.observaciones.toUpperCase())"
                >
                  <template v-slot:append>
                    <v-btn 
                      color="primary"
                      @click="openModal('sscc-inventario')"
                      
                    >
                      <PlusIcon/> Imagen
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col v-if="state.formulario_3.inventarios.length > 0" cols="12" md="12">
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
                      v-for="(item, index) in state.formulario_3.inventarios"
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
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteInventory(index, item.id_sustancia_imagen)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm && state.formulario_3.inventarios.length==0">
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
                <v-label class="font-weight-medium mb-2"><span style="color:red">*</span>Se debe cargar al menos una imagen</v-label>
                <v-btn class="mt-1 bg-primary" @click="openModal('sscc-general')" block>
                  <CloudUploadIcon class="mx-2"></CloudUploadIcon> Subir Imagen
                </v-btn>

              </v-col>
            </v-row>

            <v-row v-if="state.formulario_4.fotografias.length > 0">
              <v-col cols="12" md="6" v-for="(imagen, index) in state.formulario_4.fotografias">
                <v-card elevation="10" rounded="md">
                  <div class="text-center py-3">
                    <img :src="imagen.imagen" alt="noImage" height="250"/>
                  </div>
                  <div class="d-flex justify-end mr-3 mt-n3 pb-1">
                    <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index,imagen.id_sustancia_imagen)">
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
        <template v-if="submitButton && state.formulario_4.fotografias.length==0">
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
              <v-btn color="primary"  class="size_fijo"  @click.prevent="buttonSendForm()">Enviar</v-btn>
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