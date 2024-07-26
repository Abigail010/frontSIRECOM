<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon, SatelliteIcon } from 'vue-tabler-icons';
import { useResourceStore } from '@/stores/resource';
import { useInstanceStore } from '@/stores/moduleOne/instance';
import type deposito  from '@/types/myTypes/deposito'
import Swal from 'sweetalert2'
import { router } from '@/router';
import { useRoute } from 'vue-router'

import type { Header, Item } from "vue3-easy-data-table";
import { format, parseISO } from 'date-fns'
import { validateText } from '@/utils/helpers/validateText'

  const headers: Header[] = [
    { text: "BIEN", value: "nombre_bien" },
    { text: "JURISDICCIÓN", value: "jurisdiccion" },
    { text: "CARACTERÍSTICAS", value: "caracteristicas" },
    { text: "OBSERVACIONES DEL BIEN", value: "observaciones" },
    { text: "TIPO LOGÍSTICA", value: "tipo_logistica" },
    { text: "FECHA RECEPCIÓN", value: "fecha_recepcion", width: 140},
    { text: "DEPOSITO", value: "nombre_deposito" },
    { text: "LUGAR ENCUENTRO", value: "url_encuentro" },
    { text: "LUGAR RECEPCIÓN", value: "url_recepcion" },
    { text: "MOTIVO", value: "motivo" },
    { text: "OBSERVACIONES DE LOGÍSTICA", value: "observaciones_logistica" },
  ];

  // const itemsSelected: Item[] = ref([])
  const itemsSelected: any = ref([])
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const initialDate = ref(null) as any

  const route = useRoute()
  const resourceStore = useResourceStore()
  const instanceStore = useInstanceStore()
  const reporte = ref(false)
  
  const myAccessToken = 'pk.eyJ1IjoiYXJpZWwxMTEiLCJhIjoiY2xmaDZpdnZoMHRvNzN1bnZyeXFwazgydyJ9.cgyfEI8x3E4-0Lo7P4t_jw'
  const page = ref({ title: 'Logistica de recepción' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Logistica de recepción',
      disabled: true,
      href: '#'
    }
  ]);

  const changeLogisticType = () => {
    if(state.formData.tipo_logistica == 'NORMAL'){
      state.formData.motivo = ''
      state.formData.observaciones_logistica = ''
    }
  }

  const arrayFechas = ref([]) as any
  // FUNCION QUE LLAMA LA INFORMACION DEL CASO
  const getInstanceLogisticsReceptionById = async (id_caso: any, id_recepcion_documental: any) => {
    const result = await instanceStore.instanceReceptionLogistics(id_caso, id_recepcion_documental)
    state.formData.id_caso = id_caso
    state.formData.id_recepcion_documental = id_recepcion_documental
    for (let i = 0; i < result.length; i++) {
      state.formData.bienes.push(result[i])
      arrayFechas.value.push(result[i].fecha_revision)
    }
    
    const maxDate = new Date(
      Math.max(
        ...arrayFechas.value.map( (element:any) => {
          return new Date(element)
        })
      )
    )
    initialDate.value = maxDate.toISOString().split('T')[0]

    // PARA LA PARTE DE REPORTE
    let records = await instanceStore.receptionLogisticsRecords(id_caso)
    // console.log(records);
    if(records.length > 0){
      reporte.value = true
    }
  }

  // LISTA DE TIPOS DE CODIGO
  const depositos = ref<deposito[]>([])
  const getDepositsList = async () => {
    depositos.value = await resourceStore.getDeposits()
  }

  // LISTA DE MOTIVOS
  const lista_motivos = ref([])
  const getReceptionLogisticsReasonsList = async () => {
    lista_motivos.value = await resourceStore.getReceptionLogisticsReasons()
  }

  const state = reactive({
    formData: {
      id_caso: '',
      id_recepcion_documental: '',
      
      tipo_logistica: '', // NORMAL O AMPLIACION
      motivo: '',
      observaciones_logistica: '',

      fecha_recepcion: currentDate,
      hora_recepcion: '',
      id_deposito: '',
      nombre_deposito: '',
      bienes: [] as any,

      latitud_encuentro: -16.4997452,
      longitud_encuentro: -68.1297037,
      url_encuentro: '',
      direccion_encuentro: '',

      latitud_recepcion: -16.4997452,
      longitud_recepcion: -68.1297037,
      url_recepcion: '',
      direccion_recepcion: '',
    }
  });

  const addCode = () => {
    if(state.formData.id_deposito != ''){
      let registro:any = depositos.value.find( deposito => deposito.id == Number(state.formData.id_deposito))
      state.formData.nombre_deposito = registro.nombre_deposito
    }else{
      state.formData.nombre_deposito = ''
    }
    
    if(itemsSelected.value.length > 0){
      for (let i = 0; i < itemsSelected.value.length; i++) {
        for (let j = 0; j < state.formData.bienes.length; j++) {
          if(itemsSelected.value[i].id_bien_registro == state.formData.bienes[j].id_bien_registro){
            state.formData.bienes[j].tipo_logistica = state.formData.tipo_logistica
            state.formData.bienes[j].motivo = state.formData.motivo
            state.formData.bienes[j].observaciones_logistica = state.formData.observaciones_logistica

            state.formData.bienes[j].fecha_recepcion = state.formData.fecha_recepcion
            state.formData.bienes[j].hora_recepcion = state.formData.hora_recepcion
            state.formData.bienes[j].id_deposito = state.formData.id_deposito
            state.formData.bienes[j].nombre_deposito = state.formData.nombre_deposito
            state.formData.bienes[j].latitud_encuentro = state.formData.latitud_encuentro
            state.formData.bienes[j].longitud_encuentro = state.formData.longitud_encuentro
            state.formData.bienes[j].url_encuentro = state.formData.url_encuentro
            state.formData.bienes[j].direccion_encuentro = state.formData.direccion_encuentro
            state.formData.bienes[j].latitud_recepcion = state.formData.latitud_recepcion
            state.formData.bienes[j].longitud_recepcion = state.formData.longitud_recepcion
            state.formData.bienes[j].url_recepcion = state.formData.url_recepcion
            state.formData.bienes[j].direccion_recepcion = state.formData.direccion_recepcion
            break
          }
        }
      }
      itemsSelected.value = []
      state.formData.tipo_logistica = ''
      state.formData.motivo = ''
      state.formData.observaciones_logistica = ''

      state.formData.fecha_recepcion = ''
      state.formData.hora_recepcion = ''
      state.formData.id_deposito = ''
      state.formData.nombre_deposito = ''
      state.formData.url_encuentro = ''
      state.formData.direccion_encuentro = ''
      state.formData.url_recepcion = ''
      state.formData.direccion_recepcion = ''
    }
  }

  // REGISTRO DE LATITUD LONGITUD EN BASE A BUCADOR DE MAP BOX
  const pushResultMeeting = (data: any) => {
    state.formData.longitud_encuentro = data.center[0].toFixed(8)
    state.formData.latitud_encuentro = data.center[1].toFixed(8)
    // console.log('longitud: ',state.formData.longitud_encuentro, 'latitud: ',state.formData.latitud_encuentro)
    state.formData.url_encuentro = 'https://maps.google.com/?q=' + data.center[1].toFixed(8) + ',' + data.center[0].toFixed(8)
  };

  // ACTUALIZACIÓN DE LATITUD LONGITUD EN BASE A ARRASTRE DEL PUNTERO MAP BOX
  const newPositionMeeting = (data: any) => {
    state.formData.longitud_encuentro = data.target._lngLat.lng.toFixed(8)
    state.formData.latitud_encuentro = data.target._lngLat.lat.toFixed(8)
    // console.log('longitud: ',state.formData.longitud_encuentro, 'latitud: ',state.formData.latitud_encuentro)
    state.formData.url_encuentro = 'https://maps.google.com/?q=' + data.target._lngLat.lat.toFixed(8) + ',' + data.target._lngLat.lng.toFixed(8)
  };

  const pushResultReception = (data: any) => {
    state.formData.longitud_recepcion = data.center[0].toFixed(8)
    state.formData.latitud_recepcion = data.center[1].toFixed(8)
    state.formData.url_recepcion = 'https://maps.google.com/?q=' + data.center[1].toFixed(8) + ',' + data.center[0].toFixed(8)
  };

  // ACTUALIZACIÓN DE LATITUD LONGITUD EN BASE A ARRASTRE DEL PUNTERO MAP BOX
  const newPositionReception = (data: any) => {
    state.formData.longitud_recepcion = data.target._lngLat.lng.toFixed(8)
    state.formData.latitud_recepcion = data.target._lngLat.lat.toFixed(8)
    state.formData.url_recepcion = 'https://maps.google.com/?q=' + data.target._lngLat.lat.toFixed(8) + ',' + data.target._lngLat.lng.toFixed(8)
  };

  // SETEA LOS VALORES PARA EL FORMULARIO
  const setDepositPosition = (id: any) => {
    const deposit:any = depositos.value.find( deposito => deposito.id == id )
    // ENCUENTRO
    state.formData.latitud_encuentro = deposit.latitud ? deposit.latitud : -16.4997452
    state.formData.longitud_encuentro = deposit.longitud ? deposit.longitud : -68.1297037
    state.formData.url_encuentro = deposit.url_deposito ? deposit.url_deposito : ''
    state.formData.direccion_encuentro = deposit.direccion_deposito ? deposit.direccion_deposito : ''
    // RECEPCION
    state.formData.latitud_recepcion = deposit.latitud ? deposit.latitud : -16.4997452
    state.formData.longitud_recepcion = deposit.longitud ? deposit.longitud : -68.1297037
    state.formData.url_recepcion = deposit.url_deposito ? deposit.url_deposito : ''
    state.formData.direccion_recepcion = deposit.direccion_deposito ? deposit.direccion_deposito : ''
  }

  const validateDate = () => {
    console.log('validacion de fecha');
  }

  const returnList = () => {
    router.push({ name: 'bienFile', params: { id: route.params.id_caso }})
  }

  const sendForm = async () => {
    const { ok, message } = await instanceStore.updateInstanceReceptionLogistics(state.formData)
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }

  // const buttonReport = async () => {
  //   await instanceStore.receptionLogisticsReport(Number(route.params.id))
  // }

  onMounted( async () => {
    await getDepositsList()
    await getReceptionLogisticsReasonsList()
    if(route.params.id != '0'){
      await getInstanceLogisticsReceptionById(route.params.id_caso, route.params.id_recepcion_documental)
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <h4 class="mb-5 mt-2 font-weight-light">
    <strong>NOTA:</strong>
    Seleccione de la tabla los bienes que desea establecer la logística de recepción
  </h4>
  <v-row>
    <v-col cols="12" md="12">
      <EasyDataTable
        v-model:items-selected="itemsSelected"
        :headers="headers"
        :items="state.formData.bienes"
        header-text-direction="center"
        body-text-direction="center"
      >

        <template #item-url_encuentro="item">
          <div class="operation-wrapper">
            <a target="_blank" :href="item.url_encuentro">{{ item.url_encuentro }}</a>
          </div>
        </template>
        
        <template #item-url_recepcion="item">
          <div class="operation-wrapper">
            <a target="_blank" :href="item.url_recepcion">{{ item.url_recepcion }}</a>
          </div>
        </template>

      </EasyDataTable>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="12">
      <v-row>

        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Tipo de logística</v-label>
          <v-radio-group 
            v-model="state.formData.tipo_logistica"
            @update:modelValue="changeLogisticType"
            class="ml-n3"
            inline
            hide-details
          >
            <v-radio label="NORMAL" color="primary" value="NORMAL"></v-radio>
            <v-radio label="AMPLIACIÓN" color="secondary" value="AMPLIACION"></v-radio>
          </v-radio-group>
        </v-col>

        <template v-if="state.formData.tipo_logistica != '' && state.formData.tipo_logistica == 'AMPLIACION'">
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Motivo</v-label>
            <v-select
              :items="lista_motivos"
              item-title="nombre_motivo"
              item-value="nombre_motivo"
              no-data-text="No existe más opciones para seleccionar"
              v-model="state.formData.motivo"
              clearable
            >
            </v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
            <v-text-field 
              variant="outlined" 
              color="primary"
              v-model.trim="state.formData.observaciones_logistica"
              @input="state.formData.observaciones_logistica = validateText(state.formData.observaciones_logistica.toUpperCase())"
            />
          </v-col>
        </template>

        <template v-if="state.formData.tipo_logistica">
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Fecha de recepción</v-label>
            <v-text-field 
              type="date" 
              v-model="state.formData.fecha_recepcion"
              @input="validateDate()"
              :min="currentDate"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Hora de recepción</v-label>
            <v-text-field 
              type="time"
              v-model="state.formData.hora_recepcion"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Asignación de deposito</v-label>
            <v-autocomplete
              v-model="state.formData.id_deposito"  
              :items="depositos"
              item-title="nombre_deposito"
              item-value="id"
              color="primary"
              variant="outlined"
              no-data-text="No existe opciones para seleccionar"
              @update:modelValue="setDepositPosition(state.formData.id_deposito)"
              hide-details
            ></v-autocomplete>
            <!-- <v-select
              :items="depositos"
              item-title="nombre_deposito"
              item-value="id"
              no-data-text="No existe más opciones para seleccionar"
              v-model="state.formData.id_deposito"
              @update:modelValue="setDepositPosition(state.formData.id_deposito)"
            >
            </v-select> -->
          </v-col>

          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Direccion de encuentro</v-label>
            <v-text-field 
              variant="outlined" 
              color="primary"
              v-model.trim="state.formData.direccion_encuentro"
              @input="state.formData.direccion_encuentro = validateText(state.formData.direccion_encuentro.toUpperCase())"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Dirección de recepción</v-label>
            <v-text-field 
              variant="outlined" 
              color="primary"
              v-model.trim="state.formData.direccion_recepcion"
              @input="state.formData.direccion_recepcion = validateText(state.formData.direccion_recepcion.toUpperCase())"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Lugar de encuentro</v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              v-model="state.formData.url_encuentro"
              readonly
            >
            </v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium" required>Lugar de recepción<span style="color:red">*</span></v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              type="url"
              v-model="state.formData.url_recepcion"
              readonly
            >
              <template v-slot:append>
                <v-btn 
                  color="primary"
                  @click= addCode()
                  :disabled="state.formData.fecha_recepcion == '' || state.formData.url_encuentro == ''"
                >
                  <PlusIcon/> Asignar
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </template>
      </v-row>

      <template v-if="state.formData.tipo_logistica">
        <v-row>
          <v-col cols="12" md="6">
            <div style="width: 100%; height: 400px">
              <mapbox-map 
                :accessToken="myAccessToken"
                :center="[ -68.1297037, -16.4997452 ]"
                :zoom=4
              >
                <mapbox-geocoder-control @result="pushResultMeeting" :marker="false"/>
                <mapbox-marker :lngLat="[ state.formData.longitud_encuentro, state.formData.latitud_encuentro ]" :draggable="true" @dragend="newPositionMeeting">
                </mapbox-marker>
                <mapbox-navigation-control position="bottom-left"/>
              </mapbox-map>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div style="width: 100%; height: 400px">
              <mapbox-map 
                :accessToken="myAccessToken"
                :center="[ -68.1297037, -16.4997452 ]"
                :zoom=4
              >
                <mapbox-geocoder-control @result="pushResultReception" :marker="false"/>
                <mapbox-marker :lngLat="[ state.formData.longitud_recepcion, state.formData.latitud_recepcion ]" :draggable="true" @dragend="newPositionReception">
                </mapbox-marker>
                <mapbox-navigation-control position="bottom-left"/>
              </mapbox-map>
            </div>
          </v-col>
        </v-row>
      </template>
      

      <p class="text-lg-right mt-5">
          <v-btn color="error" class="mr-3" @click="returnList()">Cancelar</v-btn>
          <v-btn color="primary" @click.prevent="sendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>
