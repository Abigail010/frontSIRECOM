<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
// import { usePropertyStore } from '@/stores/moduleOne/property';
import { usePropertyStore } from '@/stores/moduleOne/property';
import { useResourceStore } from '@/stores/resource';
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const propertyStore = usePropertyStore()
  const resourceStore = useResourceStore()

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Vehículo',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state:any = reactive({
    formData: {
      id_caso: route.params.id_caso
    } as any,
    formulario_1: {} as any,
    formulario_2: {} as any,
    formulario_3: {} as any,
    formulario_4: {} as any,
    formulario_5: {} as any,
    formulario_6: {} as any,
    formulario_7: {} as any,
    formulario_8: {
      naturaleza_condicion: '',
      observaciones: '',
      escala_cuantitativa: '',
      escala_cualitativa: '',
      valor_operatividad: '',
    } as any,
    formulario_9: {
      id_vehiculo_industria: '',
      id_vehiculo_kilometraje: '',
      precio_base: '',
      valor_operatividad: '',
      total: '',
    } as any,
  });

  // DECLARACION DE CONSTANTES PARA LECTURA DE FORMULARIO
  const openpanel = ref([0]);
  const formulario_1: any = ref([])
  const formulario_2: any = ref([])
  const formulario_3: any = ref([])
  const formulario_4: any = ref([])
  const formulario_5: any = ref([])
  const formulario_6: any = ref([])
  const formulario_7: any = ref([])
  // const formularios: any = ref([])

  // LISTA DE INDUSTRIAS
  const industrias = ref([])
  const getIndustriesList = async () => {
    const industries = await resourceStore.getIndustries()
    industrias.value = industries
  }

  // LISTA DE KILOMETRAJES
  const kilometrajes = ref([])
  const getMileagesList = async () => {
    const mileages = await resourceStore.getMileages()
    kilometrajes.value = mileages
  }

  // LISTA DE INDUSTRIA KILOMETRAJE
  const industriaKilometrajes = ref([])
  const getIndustriesMileagesList = async () => {
    const industriesMileages = await resourceStore.getIndustriesMileages()
    industriaKilometrajes.value = industriesMileages
  }

  const listaCaja = ref(['AUTOMATICA', 'MECANICA', 'SECUENCIAL']);
  const listaSistema = ref(['CARBURADOR', 'INYECCIÓN', 'OTRO']);
  const listaMotorizacion = ref(['DIESEL', 'GASOLINA', 'GNV']);
  const listaEstado = ref(['BUENO', 'REGULAR', 'MALO']);
  const listaNaturalezaCondicion = ref(['MOTORIZADO OPERABLE', 'MOTORIZADO INOPERABLE', 'CHATARRA'])
  const listaEscala = ref([
    {escala_cuantitativa:"0", escala_cualitativa: '0 - MALO'},
    {escala_cuantitativa:"1", escala_cualitativa: '1 - MALO'},
    {escala_cuantitativa:"2", escala_cualitativa: '2 - MALO'},
    {escala_cuantitativa:"3", escala_cualitativa: '3 - MALO'},
    {escala_cuantitativa:"4" , escala_cualitativa: '4 - REGULAR'},
    {escala_cuantitativa:"5" , escala_cualitativa: '5 - REGULAR'},
    {escala_cuantitativa:"6" , escala_cualitativa: '6 - REGULAR'},
    {escala_cuantitativa:"7" , escala_cualitativa: '7 - REGULAR'},
    {escala_cuantitativa:"8" , escala_cualitativa: '8 - BUENO'},
    {escala_cuantitativa:"9" , escala_cualitativa: '9 - BUENO'},
    {escala_cuantitativa:"10" , escala_cualitativa: '10 - BUENO'},
  ]);
  
  const propertyForm = async(id_bien: any) => {
    const data = await propertyStore.propertyForm(id_bien)
    // console.log('info para formulario', data);
    let objeto: any= {}
    // ASIGNACION DE CAMPOS PARA VISUALIZACION DEL FORMULARIO
    formulario_1.value = data.formulario_1
    formulario_2.value = data.formulario_2
    formulario_3.value = data.formulario_3
    formulario_4.value = data.formulario_4
    formulario_5.value = data.formulario_5
    formulario_6.value = data.formulario_6
    formulario_7.value = data.formulario_7

    // ASIGNACION DE NUMEROS DE FORMULARIO PARA ITERACION EN VISTA  DE FORMULARIO
    // for (let i = 0; i < data.formularios.length; i++) {
    //   formularios.value.push({
    //     'orden': data.formularios[i].orden+1,
    //     'seccion': data.formularios[i].seccion
    //   })
    // }

    // ASIGNACION DE KEYS DEL STATE FORMULARIO 1 
    for (let i = 0; i < data.formulario_1.length; i++) {
      objeto[data.formulario_1[i].column_name] = ''
    }
    state.formulario_1 = objeto
    objeto = {}

    // ASIGNACION DE KEYS DEL STATE FORMULARIOS 2 AL 7
    for (let i = 2; i <= 7; i++) {
      for (let j = 0; j < data['formulario_'+i].length; j++) {
        objeto[data['formulario_'+i][j].cantidad] = ''
        objeto[data['formulario_'+i][j].estado] = ''
      }
      state['formulario_'+i] = objeto
      objeto = {}
    }
  }
  
  
  const getPropertyById = async(id_bien_registro: any) => {
    const vehiculo = await propertyStore.property(id_bien_registro)
    let llaves
    // ASIGNACION DE VALUES DEL STATE FORMULARIO 1
    if(!Array.isArray(vehiculo.grupo_1)){
      llaves = Object.keys(vehiculo.grupo_1)
      for (let i = 0; i < llaves.length; i++) {
        if(llaves[i] in state.formulario_1 === true){
          state.formulario_1[llaves[i]] = vehiculo.grupo_1[llaves[i]]
        }
      }
    }
    
    // ASIGNACION DE VALUES DEL STATE FORMULARIOS 2 AL 7
    if(vehiculo.grupo_2.length>0){
      for (let i = 2; i <= 7; i++) {
        llaves = Object.keys(state['formulario_'+i])
        for (let j = 0; j < llaves.length; j++) {
          const nombreLlave = llaves[j].split('_')
          const valor = vehiculo['grupo_'+i].find( (registro: any) => registro.id_vehiculo_pieza == nombreLlave[1])
          if(nombreLlave[0] == 'c'){
            state['formulario_'+i][llaves[j]] = valor.cantidad
          }else{
            state['formulario_'+i][llaves[j]] = valor.estado
          }
        }
      }
    }
    
    // ASIGNACION DE VALUES DEL STATE FORMULARIO 8
    if(!Array.isArray(vehiculo.grupo_8)){
      state.formulario_8.escala_cuantitativa = vehiculo.grupo_8.escala_cuantitativa
      state.formulario_8.escala_cualitativa = vehiculo.grupo_8.escala_cualitativa
      state.formulario_8.naturaleza_condicion = vehiculo.grupo_8.naturaleza_condicion
      state.formulario_8.observaciones = vehiculo.grupo_8.observaciones
      state.formulario_8.valor_operatividad = vehiculo.grupo_8.valor_operatividad
    }

    // ASIGNACION DE VALUES DEL STATE FORMULARIO 9
    if(!Array.isArray(vehiculo.grupo_9)){
      state.formulario_9.id_vehiculo_industria = vehiculo.grupo_9.id_vehiculo_industria
      state.formulario_9.id_vehiculo_kilometraje = vehiculo.grupo_9.id_vehiculo_kilometraje
      state.formulario_9.precio_base = vehiculo.grupo_9.precio_base
      state.formulario_9.total = vehiculo.grupo_9.total
      state.formulario_9.valor_operatividad = vehiculo.grupo_9.valor_operatividad
    }
  }
  

  const calculate = () => {
    // CALCULO DE VALOR DE OPERATIVIDAD - FORMULARIO 8
    if(state.formulario_8.escala_cuantitativa != ''){
      if(state.formulario_8.escala_cuantitativa >= 0 && state.formulario_8.escala_cuantitativa <= 3){
        state.formulario_8.escala_cualitativa = 'MALO'
      }
      if(state.formulario_8.escala_cuantitativa > 3 && state.formulario_8.escala_cuantitativa <= 7){
        state.formulario_8.escala_cualitativa = 'REGULAR'
      }
      if(state.formulario_8.escala_cuantitativa > 7 && state.formulario_8.escala_cuantitativa <= 10){
        state.formulario_8.escala_cualitativa = 'BUENO'
      }
      state.formulario_8.valor_operatividad = state.formulario_8.escala_cuantitativa/10
      state.formulario_9.valor_operatividad = state.formulario_8.escala_cuantitativa/10
    }else{
      state.formulario_8.escala_cualitativa = 'MALO'
      state.formulario_8.valor_operatividad = 0
      state.formulario_9.valor_operatividad = 0
    }

    // CALCULO DE AVALUO PROVISIONAL - FORMULARIO 9
    if(state.formulario_9.id_vehiculo_industria != '' && state.formulario_9.id_vehiculo_kilometraje != '' && state.formulario_8.escala_cuantitativa != ''){
      const valor: any = industriaKilometrajes.value.find( (registro: any) => registro.id_vehiculo_industria == state.formulario_9.id_vehiculo_industria && registro.id_vehiculo_kilometraje == state.formulario_9.id_vehiculo_kilometraje)
      state.formulario_9.precio_base = valor.precio_base
      state.formulario_9.total = Math.round(state.formulario_9.precio_base * state.formulario_8.valor_operatividad)
    }else{
      state.formulario_9.precio_base = 0
    }
  }

  // VALIDACIONES
  const rules = computed(() => {
    return {
      formulario_1: {
        clase: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        marca: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        modelo: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        tipo: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        placa_control: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        numero_chasis_vin: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        numero_motor: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        numero_puertas: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        color: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        caja: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        sistema: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        motorizacion: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        observaciones_vdm: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      },
      formulario_8: {
        naturaleza_condicion: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        escala_cuantitativa: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      },
      formulario_9: {
        id_vehiculo_industria: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        id_vehiculo_kilometraje: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  const buttonReturnList = () => {
      // router.push({ name: 'documentaryReviewList' })
    router.back()
  }

  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return

    state.formData.id_bien_registro = Number(route.params.id_bien_registro)
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    state.formData.formulario_3 = state.formulario_3
    state.formData.formulario_4 = state.formulario_4
    state.formData.formulario_5 = state.formulario_5
    state.formData.formulario_6 = state.formulario_6
    state.formData.formulario_7 = state.formulario_7
    state.formData.formulario_8 = state.formulario_8
    state.formData.formulario_9 = state.formulario_9
    const { ok, message, id } = await propertyStore.createProperty(state.formData)
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
        icon: icono,
        title: message,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
    })
    if(id!=0){
      propertyStore.propertyReport(id)
    }
  }

  onMounted( async () => {
    await getIndustriesList()
    await getMileagesList()
    await getIndustriesMileagesList()
    await propertyForm(route.params.id_bien)
    await getPropertyById(route.params.id_bien_registro)
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Vehículos</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. DATOS DEL MOTORIZADO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6" v-for="campo in formulario_1">
                <v-label class="font-weight-medium mb-2">{{ campo.titulo.toUpperCase() }}</v-label>
                <v-select
                  v-if="campo.titulo == 'Caja'"
                  v-model="state.formulario_1[campo.column_name]"
                  :items="listaCaja"
                  item-title="state"
                  item-value="abbr"
                  :error="v$.formulario_1[campo.column_name].$error"
                  :error-messages="errors[campo.column_name]"
                ></v-select>
                <v-select
                  v-else-if="campo.titulo == 'Sistema'"
                  v-model="state.formulario_1[campo.column_name]"
                  :items="listaSistema"
                  item-title="state"
                  item-value="abbr"
                  :error="v$.formulario_1[campo.column_name].$error"
                  :error-messages="errors[campo.column_name]"
                ></v-select>
                <v-select
                  v-else-if="campo.titulo == 'Motorizacion'"
                  v-model="state.formulario_1[campo.column_name]"
                  :items="listaMotorizacion"
                  item-title="state"
                  item-value="abbr"
                  :error="v$.formulario_1[campo.column_name].$error"
                  :error-messages="errors[campo.column_name]"
                ></v-select>
                <v-text-field
                  v-else
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1[campo.column_name]"
                  @input="state.formulario_1[campo.column_name] = validateText(state.formulario_1[campo.column_name].toUpperCase())"
                  :error="v$.formulario_1[campo.column_name].$error"
                  :error-messages="errors[campo.column_name]"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">2. INVENTARIO - A) PARTES DEL MOTOR Y SISTEMA ELECTRICO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6" v-for="campo in formulario_2">
                <v-label class="font-weight-medium mb-2">{{ campo.nombre_pieza }}</v-label>
                <v-row class="align-center mb-3">
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Cantidad</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="number"
                        v-model="state.formulario_2[campo.cantidad]"
                        min="0"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Estado</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-select
                        v-model="state.formulario_2[campo.estado]"
                        :items="listaEstado"
                        item-title="state"
                        item-value="abbr"
                      ></v-select>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">B) PARA CAMIONES Y TRACTO CAMIONES</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6" v-for="campo in formulario_3">
                <v-label class="font-weight-medium mb-2">{{ campo.nombre_pieza }}</v-label>
                <v-row class="align-center mb-3">
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Cantidad</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="number"
                        v-model="state.formulario_3[campo.cantidad]"
                        min="0"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Estado</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-select
                        v-model="state.formulario_3[campo.estado]"
                        :items="listaEstado"
                        item-title="state"
                        item-value="abbr"
                      ></v-select>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6"> C) INTERIOR - TABLERO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6" v-for="campo in formulario_4">
                <v-label class="font-weight-medium mb-2">{{ campo.nombre_pieza }}</v-label>
                <v-row class="align-center mb-3">
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Cantidad</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="number"
                        v-model="state.formulario_4[campo.cantidad]"
                        min="0"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Estado</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-select
                        v-model="state.formulario_4[campo.estado]"
                        :items="listaEstado"
                        item-title="state"
                        item-value="abbr"
                      ></v-select>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6"> D) INTERIOR - TAPICERIA</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6" v-for="campo in formulario_5">
                <v-label class="font-weight-medium mb-2">{{ campo.nombre_pieza }}</v-label>
                <v-row class="align-center mb-3">
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Cantidad</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="number"
                        v-model="state.formulario_5[campo.cantidad]"
                        min="0"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Estado</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-select
                        v-model="state.formulario_5[campo.estado]"
                        :items="listaEstado"
                        item-title="state"
                        item-value="abbr"
                      ></v-select>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6"> E) EXTERIORES</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6" v-for="campo in formulario_6">
                <v-label class="font-weight-medium mb-2">{{ campo.nombre_pieza }}</v-label>
                <v-row class="align-center mb-3">
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Cantidad</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="number"
                        v-model="state.formulario_6[campo.cantidad]"
                        min="0"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Estado</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-select
                        v-model="state.formulario_6[campo.estado]"
                        :items="listaEstado"
                        item-title="state"
                        item-value="abbr"
                      ></v-select>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6"> F) HERRAMIENTA Y ACCESORIOS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6" v-for="campo in formulario_7">
                <v-label class="font-weight-medium mb-2">{{ campo.nombre_pieza }}</v-label>
                <v-row class="align-center mb-3">
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Cantidad</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="number"
                        v-model="state.formulario_7[campo.cantidad]"
                        min="0"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" class="pb-sm-3 pb-0">
                        <v-label class="font-weight-medium mb-5">Estado</v-label>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-select
                        v-model="state.formulario_7[campo.estado]"
                        :items="listaEstado"
                        item-title="state"
                        item-value="abbr"
                      ></v-select>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">3. CLASIFICACION</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NATURALEZA Y CONDICION</v-label>
                <v-select
                  v-model="state.formulario_8.naturaleza_condicion"
                  :items="listaNaturalezaCondicion"
                  item-title="state"
                  item-value="abbr"
                  :error="v$.formulario_8.naturaleza_condicion.$error"
                  :error-messages="errors.naturaleza_condicion"
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ESCALA</v-label>
                <v-select
                  v-model="state.formulario_8.escala_cuantitativa"
                  :items="listaEscala"
                  item-title="escala_cualitativa"
                  item-value="escala_cuantitativa"
                  @update:model-value="calculate()"
                  :error="v$.formulario_8.escala_cuantitativa.$error"
                  :error-messages="errors.escala_cuantitativa"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">VALOR DE OPERATIVIDAD</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="state.formulario_8.valor_operatividad"
                  disabled
                >
                </v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
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
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class="mt-3">
            <v-expansion-panel-title class="text-h6">4. AVALUO PROVISIONAL</v-expansion-panel-title>
            <v-expansion-panel-text class="mt-4">
                <v-row>
                    <v-col cols="12" md="6">
                      <v-label class="font-weight-medium mb-2">INDUSTRIA</v-label>
                      <v-select
                        v-model="state.formulario_9.id_vehiculo_industria"
                        :items="industrias"
                        item-title="nombre_vehiculo_industria"
                        item-value="id"
                        @update:model-value="calculate()"
                        :error="v$.formulario_9.id_vehiculo_industria.$error"
                        :error-messages="errors.id_vehiculo_industria"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-label class="font-weight-medium mb-2">KILOMETRAJE</v-label>
                      <v-select
                        v-model="state.formulario_9.id_vehiculo_kilometraje"
                        :items="kilometrajes"
                        item-title="rango_kilometraje"
                        item-value="id"
                        @update:model-value="calculate()"
                        :error="v$.formulario_9.id_vehiculo_kilometraje.$error"
                        :error-messages="errors.id_vehiculo_kilometraje"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="text"
                        v-model="state.formulario_9.precio_base"
                        disabled
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-label class="font-weight-medium mb-2">AVALUO PROVISIONAL</v-label>
                      <v-text-field
                        color="primary"
                        variant="outlined"
                        type="text"
                        v-model="state.formulario_9.total"
                        disabled
                      >
                      </v-text-field>
                    </v-col>
                </v-row>
            </v-expansion-panel-text>
        </v-expansion-panel>
        
        <v-row class="mt-5 text-center">
          <v-col cols="12">
            <v-btn color="error" class="mr-3 size_fijo" @click="buttonReturnList()">Cancelar</v-btn>
            <v-btn color="primary" class="size_fijo" @click.prevent="buttonSendForm()">Enviar</v-btn>
          </v-col>
        </v-row>

      </v-expansion-panels>
    </v-col>
  </v-row>           
</template>


<style>
.size_fijo{
min-width: 150px;
text-align:center;
margin: 1px;

}</style>