<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useMoneyValuesStore } from '@/stores/resources/moneyValues';

import { validateText } from '@/utils/helpers/validateText'
import numberToLetterBo from "@/utils/helpers/numerToLetterBo";
import numberToLetterUs from "@/utils/helpers/numerToLetterUs";
import numberToLetterOther from '@/utils/helpers/numerToLetterOther';

  const route = useRoute()
  const moneyValuesStore = useMoneyValuesStore()

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Dinero y Valores',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state:any = reactive({
    formData: {
      id_caso: route.params.id_caso,
      id: '',
      id_bien_registro: route.params.id_bien_registro,
      numero_boleta: '',
      numero_cuenta: '',
      nombre_entidad: '',
      monto_secuestrado: '',
      monto_depositado: '',
      monto_secuestrado_literal: '',
      monto_depositado_literal: '',
      tipo_moneda_secuestrado: '',
      tipo_moneda_depositado: '',
      fecha_deposito: '',
      nombre_depositante: '',
      observaciones: '',
      descripcion_valores: '',
    } as any,
  });

  // DECLARACION DE CONSTANTES PARA LECTURA DE FORMULARIO
  const openpanel = ref([0]);
  const isLoading = ref(false)

  const lista_tipo_moneda = ref([
    {title: 'BOLIVIANO'},
    {title: 'DOLAR'},
    {title: 'OTRO'},
  ])

  // DECLARACION DE LAS VARIABLES PARA LAS VALIDACIONES
  const submitButton = ref(false)
  const sendForm = ref(true)
  const sendForm1 = ref(true)
  const sendForm8 = ref(true)
  const sendForm9 = ref(true)
  const sendForm10 = ref(true)
  
  const getMoneyValueById = async(id_bien_registro: any) => {
    const resultado = await moneyValuesStore.moneyValue(id_bien_registro)
    if(resultado){
      state.formData.id = resultado.id
      state.formData.id_bien_registro = resultado.id_bien_registro
      state.formData.numero_boleta = resultado.numero_boleta
      state.formData.numero_cuenta = resultado.numero_cuenta
      state.formData.nombre_entidad = resultado.nombre_entidad
      state.formData.monto_secuestrado = resultado.monto_secuestrado
      state.formData.monto_depositado = resultado.monto_depositado
      state.formData.monto_secuestrado_literal = resultado.monto_secuestrado_literal
      state.formData.monto_depositado_literal = resultado.monto_depositado_literal
      state.formData.tipo_moneda_secuestrado = resultado.tipo_moneda_secuestrado
      state.formData.tipo_moneda_depositado = resultado.tipo_moneda_depositado
      state.formData.fecha_deposito = resultado.fecha_deposito
      state.formData.nombre_depositante = resultado.nombre_depositante
      state.formData.observaciones = resultado.observaciones
      state.formData.descripcion_valores = resultado.descripcion_valores
    }
  }

  const literalSequesteredAmount = (numero: number) => {
    if(state.formData.tipo_moneda_secuestrado == 'DOLAR'){
      return numberToLetterUs(numero)
    }
    if(state.formData.tipo_moneda_secuestrado == 'BOLIVIANO'){
      return numberToLetterBo(numero)
    }
    if(state.formData.tipo_moneda_secuestrado == 'OTRO'){
      return numberToLetterOther(numero)
    }
  }

  const literalDepositedAmount = (numero: number) => {
    if(state.formData.tipo_moneda_depositado == 'DOLAR'){
      return numberToLetterUs(numero)
    }
    if(state.formData.tipo_moneda_depositado == 'BOLIVIANO'){
      return numberToLetterBo(numero)
    }
    if(state.formData.tipo_moneda_depositado == 'OTRO'){
      return numberToLetterOther(numero)
    }
  }

  const evaluateMoney = async () => {
    if(state.formData.monto_secuestrado && state.formData.tipo_moneda_secuestrado){
      state.formData.monto_secuestrado_literal = literalSequesteredAmount(state.formData.monto_secuestrado) 
    }
    if(state.formData.monto_depositado && state.formData.tipo_moneda_depositado){
      state.formData.monto_depositado_literal = literalDepositedAmount(state.formData.monto_depositado) 
    }
  }

   // MIS VALIDACIONES NUEVAS
   const miValidacion = async () => {
    sendForm.value = true
    sendForm1.value = true

    if(!state.formData.numero_boleta || !state.formData.numero_cuenta || 
    !state.formData.nombre_entidad || !state.formData.monto_secuestrado || 
    !state.formData.monto_secuestrado_literal || !state.formData.tipo_moneda_secuestrado || 
    !state.formData.monto_depositado || !state.formData.monto_depositado_literal || 
    !state.formData.tipo_moneda_depositado || !state.formData.fecha_deposito || 
    !state.formData.nombre_depositante ){
      sendForm.value = false
      sendForm1.value = false
    }

  }

  const buttonReturnList = () => {
    router.back()
  }

  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return

    isLoading.value = true

    const { ok, message, id } = state.formData.id == '' ? await moneyValuesStore.createMoneyValue(state.formData) : await moneyValuesStore.updateMoneyValue(state.formData)
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
      moneyValuesStore.moneyValueReport(id)
    }
  }

  onMounted( async () => {
    await getMoneyValueById(route.params.id_bien_registro)
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Dinero y Valores</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. INVENTARIO Y CARACTERÍSTICAS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE BOLETA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.numero_boleta"
                  @input="miValidacion(), state.formData.numero_boleta = validateText(state.formData.numero_boleta.toUpperCase())"
                  :error="submitButton && !state.formData.numero_boleta"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE CUENTA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.numero_cuenta"
                  @input="miValidacion(), state.formData.numero_cuenta = validateText(state.formData.numero_cuenta.toUpperCase())"
                  :error="submitButton && !state.formData.numero_cuenta"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ENTIDAD</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.nombre_entidad"
                  @input="miValidacion(), state.formData.nombre_entidad = validateText(state.formData.nombre_entidad.toUpperCase())"
                  :error="submitButton && !state.formData.nombre_entidad"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FECHA DE DEPOSITO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="date"
                  v-model.trim="state.formData.fecha_deposito"
                  @input="miValidacion(), state.formData.fecha_deposito = validateText(state.formData.fecha_deposito.toUpperCase())"
                  :error="submitButton && !state.formData.fecha_deposito"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MONTO SECUESTRADO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  step=".01"
                  min="0"
                  v-model="state.formData.monto_secuestrado"
                  @input="evaluateMoney()"
                  :error="submitButton && !state.formData.monto_secuestrado"
                  hide-details
                >
                <!-- @input="state.formData.monto_secuestrado_literal = literalSequesteredAmount(state.formData.monto_secuestrado)" -->
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MONTO DEPOSITADO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  step=".01"
                  min="0"
                  v-model="state.formData.monto_depositado"
                  @input="evaluateMoney()"
                  :error="submitButton && !state.formData.monto_depositado"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO MONEDA SECUESTRADA</v-label>
                <v-select
                  v-model="state.formData.tipo_moneda_secuestrado"
                  :items="lista_tipo_moneda"
                  item-title="title"
                  item-value="title"
                  @update:model-value="evaluateMoney()"
                  :error="submitButton && !state.formData.tipo_moneda_secuestrado"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO MONEDA DEPOSITADA</v-label>
                <v-select
                  v-model="state.formData.tipo_moneda_depositado"
                  :items="lista_tipo_moneda"
                  item-title="title"
                  item-value="title"
                  @update:model-value="evaluateMoney()"
                  :error="submitButton && !state.formData.tipo_moneda_depositado"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MONTO SECUESTRADO LITERAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.monto_secuestrado_literal"
                  @input="state.formData.monto_secuestrado_literal = validateText(state.formData.monto_secuestrado_literal.toUpperCase())"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MONTO DEPOSITADO LITERAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.monto_depositado_literal"
                  @input="state.formData.monto_depositado_literal = validateText(state.formData.monto_depositado_literal.toUpperCase())"
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NOMBRE DEPOSITANTE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.nombre_depositante"
                  @input="miValidacion(), state.formData.nombre_depositante = validateText(state.formData.nombre_depositante.toUpperCase())"
                  :error="submitButton && !state.formData.nombre_depositante"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.observaciones"
                  @input="state.formData.observaciones = validateText(state.formData.observaciones.toUpperCase())"
                >
                </v-text-field>
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

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">2. INVENTARIO EN CASO DE VALORES</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="12">
                <v-label class="font-weight-medium mb-2">DESCRIPCIÓN</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formData.descripcion_valores"
                  @input="state.formData.descripcion_valores = validateText(state.formData.descripcion_valores.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
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
</template>


<style>
.size_fijo {
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
</style>@/utils/helpers/numerToLetterBo