<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useBoatStore } from '@/stores/moduleOne/boat';
import { validateText } from '@/utils/helpers/validateText'
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const resourceStore = useResourceStore()
  const boatStore = useBoatStore()

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Embarcación',
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
      id_embarcacion_tipo: '',
      id_embarcacion_categoria: '',
      operabilidad: '',
      observaciones: '',
      fabricante: '',
      modelo: '',
      numero_serie: '',
      documentacion_existente: '',
      funciona: '',
      color: '',
      matricula: '',
      lugar_radica: '',
    } as any,
    formulario_2: {
      id_embarcacion_pieza_equipamiento: '',
      nombre_pieza_equipamiento: '',
      cantidad: '',
      observaciones: '',
      inventario: [],
    },
    formulario_3: {
      nombre_embarcacion: '',
      precio_base: '',
      valor_operabilidad: '',
      total: ''
    },
    formulario_4: {
      fotografias: []
    }, 
    id_fotografias_eliminadas: []
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

  // DECLARACION DE LAS VARIABLES PARA LAS VALIDACIONES
  const submitButton = ref(false)
  const sendForm = ref(true)
  const sendForm1 = ref(true)
  const sendForm2 = ref(true)
  const sendForm3 = ref(true)
  const sendForm4 = ref(true)

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    state.formulario_4.fotografias.push({
      id_embarcacion_imagen: '',
      id_bien: id_bien,
      id_bien_registro: id_bien_registro,
      nombre_imagen: 'embarcacion-general',
      imagen: value.respuesta.imagenBase64,
      picture: value.respuesta.picture,
    })
    miValidacion()
  }

  const lista_operabilidad = ref([
    {escala_cuantitativa:"0", escala_cualitativa: '0 - MALO'},
    {escala_cuantitativa:"0.1", escala_cualitativa: '1 - MALO'},
    {escala_cuantitativa:"0.2", escala_cualitativa: '2 - MALO'},
    {escala_cuantitativa:"0.3", escala_cualitativa: '3 - MALO'},
    {escala_cuantitativa:"0.4" , escala_cualitativa: '4 - REGULAR'},
    {escala_cuantitativa:"0.5" , escala_cualitativa: '5 - REGULAR'},
    {escala_cuantitativa:"0.6" , escala_cualitativa: '6 - REGULAR'},
    {escala_cuantitativa:"0.7" , escala_cualitativa: '7 - REGULAR'},
    {escala_cuantitativa:"0.8" , escala_cualitativa: '8 - BUENO'},
    {escala_cuantitativa:"0.9" , escala_cualitativa: '9 - BUENO'},
    {escala_cuantitativa:"1" , escala_cualitativa: '10 - BUENO'},
  ]);

  const lista_tipos = ref([])
  const getBoatTypesList = async() => {
    lista_tipos.value = await resourceStore.getBoatTypes()
  }

  const lista_categorias = ref([])
  const getBoatCategoriesList = async() => {
    lista_categorias.value = await resourceStore.getBoatCategories()
  }

  const lista_equipamiento = ref([]) as any
  const getBoatEquipmentList = async() => {
    lista_equipamiento.value = await resourceStore.getBoatEquipment()
  }

  const setBasePrice = () => {
    const registro: any = lista_tipos.value.find( (tipo: any) => tipo.id == state.formulario_1.id_embarcacion_tipo )
    state.formulario_3.nombre_embarcacion = registro.nombre_embarcacion
    state.formulario_3.precio_base = registro.precio_base_inicial
  }

  const setEquipmentName = () => {
    const registro: any = lista_equipamiento.value.find( (equipamiento: any) => equipamiento.id == state.formulario_2.id_embarcacion_pieza_equipamiento )
    state.formulario_2.nombre_pieza_equipamiento = registro.nombre_pieza_equipamiento
  }

  const setProvisionalAppraisal = () => {
    if(state.formulario_3.precio_base && state.formulario_3.valor_operabilidad){
      state.formulario_3.total = state.formulario_3.precio_base*state.formulario_3.valor_operabilidad
      state.formulario_3.total = Number(state.formulario_3.total).toFixed(2)
    }else{
      state.formulario_3.total
    }
    miValidacion()
  }

  const getBoatById = async(id_bien_registro: any) => {
    const resultado = await boatStore.boat(id_bien_registro)
    if(!resultado.nuevo){
      nuevo.value = false

      const formulario_1 = resultado.formulario_1
      state.formulario_1.id_embarcacion_tipo = formulario_1.id_embarcacion_tipo
      state.formulario_1.id_embarcacion_categoria = formulario_1.id_embarcacion_categoria
      state.formulario_1.operabilidad = formulario_1.operabilidad
      state.formulario_1.observaciones = formulario_1.observaciones
      state.formulario_1.fabricante = formulario_1.fabricante
      state.formulario_1.modelo = formulario_1.modelo
      state.formulario_1.numero_serie = formulario_1.numero_serie
      state.formulario_1.documentacion_existente = formulario_1.documentacion_existente
      state.formulario_1.funciona = formulario_1.funciona
      state.formulario_1.color = formulario_1.color
      state.formulario_1.matricula = formulario_1.matricula
      state.formulario_1.lugar_radica = formulario_1.lugar_radica

      const inventario = resultado.formulario_2.inventario
      for (let i = 0; i < inventario.length; i++) {
        state.formulario_2.inventario.push(inventario[i])
      }

      const formulario_3 = resultado.formulario_3
      const registro: any = lista_tipos.value.find( (tipo: any) => tipo.id == formulario_1.id_embarcacion_tipo )
      state.formulario_3.nombre_embarcacion = registro.nombre_embarcacion
      state.formulario_3.precio_base = formulario_3.precio_base
      state.formulario_3.valor_operabilidad = formulario_3.valor_operabilidad
      state.formulario_3.total = formulario_3.total

      const fotografias = resultado.formulario_4.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_4.fotografias.push(fotografias[i]) 
      }
    }
  }
  const buttonAddEquipment = () => {
    
    lista_equipamiento.value = lista_equipamiento.value.filter(
      (equipo: any) => equipo.id != state.formulario_2.id_embarcacion_pieza_equipamiento
    )
    state.formulario_2.inventario.push({
      id_embarcacion_pieza_equipamiento: state.formulario_2.id_embarcacion_pieza_equipamiento,
      nombre_pieza_equipamiento: state.formulario_2.nombre_pieza_equipamiento,
      cantidad: state.formulario_2.cantidad,
      observaciones: state.formulario_2.observaciones
    })
    state.formulario_2.id_embarcacion_pieza_equipamiento = ''
    state.formulario_2.nombre_pieza_equipamiento = ''
    state.formulario_2.cantidad = ''
    state.formulario_2.observaciones = ''
    miValidacion()
  }

  const buttonDeleteEquipment = (index: number) => {
    
    const equipo = state.formulario_2.inventario[index]
    lista_equipamiento.value.push({
      id: equipo.id_embarcacion_pieza_equipamiento,
      nombre_pieza_equipamiento: equipo.nombre_pieza_equipamiento
    })
    lista_equipamiento.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_pieza_equipamiento
      const codigo_b = b.nombre_pieza_equipamiento
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    state.formulario_2.inventario.splice(index,1)
    miValidacion()
  }
  const buttonDeletePicture = (index: number, id_embarcacion_imagen: number) => {
    state.id_fotografias_eliminadas.push(id_embarcacion_imagen)
    state.formulario_4.fotografias.splice(index,1)
  }

  // MIS VALIDACIONES NUEVAS
  const miValidacion = async () => {
    sendForm.value = true
    sendForm1.value = true
    sendForm2.value = true
    sendForm3.value = true
    sendForm4.value = true

    if(!state.formulario_1.operabilidad || !state.formulario_1.id_embarcacion_tipo || !state.formulario_1.id_embarcacion_categoria || !state.formulario_1.funciona || !state.formulario_1.color || !state.formulario_1.matricula || !state.formulario_1.lugar_radica){
      sendForm.value = false
      sendForm1.value = false
    }
    if(state.formulario_2.inventario.length == 0){
      sendForm.value = false
      sendForm2.value = false
    }

    if(!state.formulario_3.nombre_embarcacion || !state.formulario_3.precio_base || !state.formulario_3.valor_operabilidad || !state.formulario_3.total){
      sendForm.value = false
      sendForm3.value = false
    }

    if(state.formulario_4.fotografias.length == 0){
      sendForm.value = false
      sendForm4.value = false
    }
  }

  const buttonReturnList = () => {
    router.back()
  }

  const buttonSendForm = async () => {
    // const result = await v$.value.$validate()
    // if(!result) return

    submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return
    // console.log(state.id_fotografias_eliminadas)
    state.formData.id_bien_registro = route.params.id_bien_registro
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    state.formData.formulario_3 = state.formulario_3
    state.formData.formulario_4 = state.formulario_4
    state.formData.id_fotografias_eliminadas = state.id_fotografias_eliminadas
    isLoading.value = true
    // SI ES ACTUALIZACION, ELIMINAMOS LAS IMAGENES QUE YA NO EXISTEN
    // if(!nuevo.value){
    //   await boatStore.deleteBoatImage(state.formData)
    // }
    // GUARDADO DEL FORMULARIO 1
    const { ok, message, id } = nuevo.value ? await boatStore.createBoat(state.formData) : await boatStore.updateBoat(state.formData)

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
      boatStore.boatReport(id)
    }
  }

  onMounted( async () => {
    await getBoatTypesList()
    await getBoatCategoriesList()
    await getBoatEquipmentList()

    await getBoatById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Embarcaciones</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. DATOS GENERALES</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ESTADO OPERABILIDAD</v-label>
                <v-radio-group
                inline 
                v-model="state.formulario_1.operabilidad"
                @click="miValidacion(), state.formulario_1.operabilidad == 'NO' ? '' : ''"
                :disabled="!nuevo"
                :error="submitButton && !state.formulario_1.operabilidad"
                hide-details
                >
                  <v-radio label="OPERABLE" value="OPERABLE" color="secondary"></v-radio>
                  <v-radio label="INOPERABLE" value="INOPERABLE" color="error"></v-radio>
                </v-radio-group>
                <template v-if="submitButton && !state.formulario_1.operabilidad">
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
                  v-model.trim="state.formulario_1.observaciones"
                  @input="state.formulario_1.observaciones = validateText(state.formulario_1.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO EMBARCACIÓN</v-label>
                <v-select
                  v-model="state.formulario_1.id_embarcacion_tipo"
                  :items="lista_tipos"
                  item-title="nombre_embarcacion"
                  item-value="id"
                  @input="miValidacion()"
                  @update:model-value="setBasePrice(); setProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_1.id_embarcacion_tipo"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.id_embarcacion_tipo">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CATEGORÍA</v-label>
                <v-select
                  v-model="state.formulario_1.id_embarcacion_categoria"
                  :items="lista_categorias"
                  item-title="nombre_categoria"
                  item-value="id"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_1.id_embarcacion_categoria"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.id_embarcacion_categoria">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FABRICANTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_1.fabricante"
                  @input="state.formulario_1.fabricante = validateText(state.formulario_1.fabricante.toUpperCase())"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MODELO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_1.modelo"
                  @input="state.formulario_1.modelo = validateText(state.formulario_1.modelo.toUpperCase())"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE SERIE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_1.numero_serie"
                  @input="state.formulario_1.numero_serie = validateText(state.formulario_1.numero_serie.toUpperCase())"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">DOCUMENTACIÓN EXISTENTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_1.documentacion_existente"
                  @input="state.formulario_1.documentacion_existente = validateText(state.formulario_1.documentacion_existente.toUpperCase())"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FUNCIONA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_1.funciona"
                  @input="miValidacion(), state.formulario_1.funciona = validateText(state.formulario_1.funciona.toUpperCase())"
                  :error="submitButton && !state.formulario_1.funciona"
                  hide-details
                  >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.funciona">
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
                  v-model.trim="state.formulario_1.color"
                  @input="miValidacion(), state.formulario_1.color = validateText(state.formulario_1.color.toUpperCase())"
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
                <v-label class="font-weight-medium mb-2">MATRÍCULA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_1.matricula"
                  @input="miValidacion(), state.formulario_1.matricula = validateText(state.formulario_1.matricula.toUpperCase())"
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
                <v-label class="font-weight-medium mb-2">LUGAR RADICA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_1.lugar_radica"
                  @input="miValidacion(), state.formulario_1.lugar_radica = validateText(state.formulario_1.lugar_radica.toUpperCase())"
                  :error="submitButton && !state.formulario_1.lugar_radica"
                  hide-details
                  >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.lugar_radica">
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
        <template v-if="submitButton && !sendForm1">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">2. PIEZAS Y EQUIPAMIENTO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">

            <v-row>
              <v-col cols="12" md="3">
                <v-label class="font-weight-medium mb-2">DESCRIPCIÓN</v-label>
                <v-select
                  v-model="state.formulario_2.id_embarcacion_pieza_equipamiento"
                  :items="lista_equipamiento"
                  item-title="nombre_pieza_equipamiento"
                  item-value="id"
                  @update:model-value="setEquipmentName()"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-label class="font-weight-medium mb-2">CANTIDAD</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_2.cantidad"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_2.observaciones"
                  @input="state.formulario_2.observaciones = validateText(state.formulario_2.observaciones.toUpperCase())"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddEquipment()
                    :disabled="
                      !state.formulario_2.id_embarcacion_pieza_equipamiento ||
                      !state.formulario_2.cantidad
                    ">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
              <template v-if="submitButton && state.formulario_2.inventario.length == 0">
                <div class="v-messages font-weight-black px-2 py-2">
                  <div class="v-messages__message text-error ">
                    Debe agregar al menos un registro
                  </div>
                </div>
              </template>
            </v-row>

            <v-row class="mb-3">
              <v-col v-if="state.formulario_2.inventario.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Descripción</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Observaciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_2.inventario"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_pieza_equipamiento }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteEquipment(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
              
            </v-row>

          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm2">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">3. AVALÚO PROVISIONAL</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO EMBARCACIÓN</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_3.nombre_embarcacion"
                  @input="miValidacion()"
                  readonly
                  :error="submitButton && !state.formulario_3.nombre_embarcacion"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_3.nombre_embarcacion">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_3.precio_base"
                  @input="miValidacion(), setProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_3.precio_base"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_3.precio_base">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">VALOR DE OPERABILIDAD</v-label>
                <v-select
                  v-model="state.formulario_3.valor_operabilidad"
                  :items="lista_operabilidad"
                  item-title="escala_cualitativa"
                  item-value="escala_cuantitativa"
                  @update:model-value="setProvisionalAppraisal()"
                  :error="submitButton && !state.formulario_3.valor_operabilidad"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_3.valor_operabilidad">
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
                  color="primary"
                  variant="outlined"
                  v-model.trim="state.formulario_3.total"
                  @input="state.formulario_3.total = validateText(state.formulario_3.total.toUpperCase())"
                  :error="submitButton && !state.formulario_3.total"
                  hide-details
                  >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_3.total">
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
        <template v-if="submitButton && !sendForm3">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">4. FOTOGRAFIA</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            
            <v-row class="mb-5">
              <v-col cols="12">
                <v-btn class="bg-primary" @click="openModal('embarcacion-general')" block>
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
                    <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index,imagen.id_embarcacion_imagen)">
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
        <template v-if="submitButton && !sendForm4">
          <v-col cols="12">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                Debe agregar al menos una fotografía
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