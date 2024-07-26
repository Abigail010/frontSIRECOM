<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { PlusIcon } from 'vue-tabler-icons';
import { useResourceStore } from '@/stores/resource';
import { useReceptionLogisticsStore } from '@/stores/resources/receptionLogistics'
import { format } from 'date-fns'
import { validateText } from '@/utils/helpers/validateText'
import type { Header } from "vue3-easy-data-table";
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import 'mapbox-gl/dist/mapbox-gl.css';
//import { DateTime } from 'carbon';


  const route = useRoute()
  const resourceStore = useResourceStore()
  const receptionLogisticsStore = useReceptionLogisticsStore()
  
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const myAccessToken = 'pk.eyJ1IjoiYXJpZWwxMTEiLCJhIjoiY2xmaDZpdnZoMHRvNzN1bnZyeXFwazgydyJ9.cgyfEI8x3E4-0Lo7P4t_jw'
  const zoom = ref(4)
  const isLoading = ref(false)
  const id_caso = route.params.id_caso
  const id_recepcion_documental = route.params.id_recepcion_documental

  const assignForm = ref(true)
  const assignButton = ref(false)
  const sendForm = ref(true)
  const submitButton = ref(false)

  const page = ref({ title: 'Logística de recepción' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Logística de recepción',
      disabled: true,
      href: '#'
    }
  ]);

 // var fechaString = '08/07/2024';
//var fechaDatetime = format(new Date(fechaString), 'yyyy-MM-dd');
//console.log(fechaDatetime)
 // DATATABLE
 const itemsSelected: any = ref([])
  const state = reactive({
    formData: {
      id_caso: id_caso,
      id_recepcion_documental: id_recepcion_documental,
      
      tipo_logistica: '', // NORMAL O AMPLIACION
      motivo: '',
      observaciones_logistica: '',

      fecha_recepcion: currentDate,
      hora_recepcion: '',
      id_deposito: '',
      nombre_deposito: '',
      bienes: [] as any,
      fecha_add:'',
      fecha_fin:'',
      fecha_fin2:'',

      latitud_encuentro: -16.4997452,
      longitud_encuentro: -68.1297037,
      url_encuentro: '',
      direccion_encuentro: '',
      zoom_encuentro: zoom.value,

      latitud_recepcion: -16.4997452,
      longitud_recepcion: -68.1297037,
      url_recepcion: '',
      direccion_recepcion: '',
      zoom_recepcion: zoom.value,

      logistica_habilitada: true
    }
  });


  const fecha_feriados = [ { fecha:'01/01/2024', descripcion: 'Año Nuevo', tipo:'Nacional '},
{ fecha:'22/01/2024', descripcion: 'Día del Estado Plurinacional', tipo:'Nacional '},
{ fecha:'12/02/2024', descripcion: 'Carnaval', tipo:'Nacional '},
{ fecha:'13/02/2024', descripcion: 'Carnaval', tipo:'Nacional '},
{ fecha:'29/03/2024', descripcion: 'Viernes Santo', tipo:'Nacional '},
{ fecha:'01/05/2024', descripcion: 'Día del Trabajo', tipo:'Nacional '},
{ fecha:'30/05/2024', descripcion: 'Corpus Christi', tipo:'Nacional '},
{ fecha:'21/06/2024', descripcion: 'Año Nuevo Aymara', tipo:'Nacional '},
{ fecha:'06/08/2024', descripcion: 'Día de la Independencia', tipo:'Nacional '},
{ fecha:'02/11/2024', descripcion: 'Día de Todos los Difuntos', tipo:'Nacional '},
{ fecha:'25/12/2024', descripcion: 'Navidad', tipo:'Nacional '},
{ fecha:'16/07/2024', descripcion: 'Aniversario de La Paz', tipo:'Departamento de La Paz'},
{ fecha:'24/09/2024', descripcion: 'Aniversario de Santa Cruz', tipo:'Departamento de Santa Cruz'},
{ fecha:'14/09/2024', descripcion: 'Aniversario de Cochabamba', tipo:'Departamento de Cochabamba'},
{ fecha:'10/02/2024', descripcion: 'Aniversario de Oruro', tipo:'Departamento de Oruro'},
{ fecha:'10/11/2024', descripcion: 'Aniversario de Potosi', tipo:'Departamento de Potosi'},
{ fecha:'15/04/2024', descripcion: 'Aniversario de Tarija', tipo:'Departamento de Tarija'},
{ fecha:'18/11/2024', descripcion: 'Aniversario de Beni', tipo:'Departamento de Beni'},
{ fecha:'25/05/2024', descripcion: 'Aniversario de Chuquisaca ', tipo:'Departamento de Chuquisaca'}
]
 

//console.log(fecha_feriados[0]['fecha'])
const fines_semana = ['Sat', 'Sun' ]; 
  const headers: Header[] = [
   
    { text: "BIEN", value: "nombre_bien" },
    { text: "JURISDICCIÓN", value: "jurisdiccion" },
    { text: "CARACTERÍSTICAS", value: "caracteristicas" },
  
    { text: "OBSERVACIONES DEL BIEN", value: "observaciones" },
    { text: "TIPO LOGÍSTICA", value: "tipo_logistica" },
    { text: "FECHA RECEPCIÓN", value: "fecha_revision", width: 140},
    { text: "DEPOSITO", value: "nombre_deposito" },
    { text: "LUGAR ENCUENTRO", value: "url_encuentro" },
    { text: "LUGAR RECEPCIÓN", value: "url_recepcion" },
    { text: "MOTIVO", value: "motivo" },
    { text: "OBSERVACIONES DE LOGÍSTICA", value: "observaciones_logistica" },
  ];

  const informacion_logistica = ref({}) as any
  const getDataByCaseCiteList = async (id_caso: any, id_recepcion_documental: any) => {
    const data = await receptionLogisticsStore.getDataByCaseCite(id_caso, id_recepcion_documental)
    const objeto = {
      numero_caso_felcn_felcc : data.numero_caso_felcn_felcc,
      nombre_clave_caso : data.nombre_clave_caso,
      cite : data.cite
    }
    informacion_logistica.value = objeto
  }

  // LISTA DE LOGISTICAS REALIZADAS
  const lista_logisticas = ref([]) as any
  const getReceptionLogisticsList = async (id_caso: any, id_recepcion_documental: any) => {
    lista_logisticas.value = await receptionLogisticsStore.getReceptionLogisticsByCase(id_caso, id_recepcion_documental)
  }
  
  // LISTA DE BIENES DISPONIBLES PARA LOGISTICA
  const getAvailablePropertiesList = async(id_caso: any, id_recepcion_documental: any) => {
    state.formData.bienes = await receptionLogisticsStore.getAvailableProperties(id_caso, id_recepcion_documental)
  }

  // LISTA DE MOTIVOS
  const lista_motivos = ref([]) as any
  const getReceptionLogisticsReasonsList = async () => {
    lista_motivos.value = await resourceStore.getReceptionLogisticsReasons()
  }

  // LISTA DE DEPOSITOS
  const lista_depositos = ref([]) as any
  const getDepositsList = async () => {
    lista_depositos.value = await resourceStore.getDeposits()
  }

  // AL CAMBIAR EL TIPO DE LOGISTICA ACTUALIZA FORMULARIO
  const changeLogisticType = () => {
    if(state.formData.tipo_logistica == 'NORMAL'){
      state.formData.motivo = ''
      state.formData.observaciones_logistica = ''
    }
  }

  // REGISTRO DE LATITUD LONGITUD EN BASE A BUCADOR DE MAP BOX
  const pushResultMeeting = (data: any) => {
    state.formData.longitud_encuentro = data.center[0].toFixed(8)
    state.formData.latitud_encuentro = data.center[1].toFixed(8)
    state.formData.url_encuentro = 'https://maps.google.com/?q=' + data.center[1].toFixed(8) + ',' + data.center[0].toFixed(8)
  };

  // ACTUALIZACIÓN DE LATITUD LONGITUD EN BASE A ARRASTRE DEL PUNTERO MAP BOX
  const newPositionMeeting = (data: any) => {
    state.formData.longitud_encuentro = data.target._lngLat.lng.toFixed(8)
    state.formData.latitud_encuentro = data.target._lngLat.lat.toFixed(8)
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

  const setZoom = async (data: any) => {
    data.setZoom(zoom.value)
    data.setCenter([state.formData.longitud_encuentro, state.formData.latitud_encuentro])
  }

  const updateZoom = (data: any) => {
    zoom.value = data.target.transform._zoom
  };
  

  // SETEA LOS VALORES PARA EL FORMULARIO
  const setDepositPosition = (id: any) => {
    if(id){
      const deposito = lista_depositos.value.find( (registro: any) => registro.id == id )
      // ENCUENTRO
      state.formData.latitud_encuentro = deposito.latitud ? deposito.latitud : -16.4997452
      state.formData.longitud_encuentro = deposito.longitud ? deposito.longitud : -68.1297037
      state.formData.url_encuentro = deposito.url_deposito ? deposito.url_deposito : ''
      state.formData.direccion_encuentro = deposito.direccion_deposito ? deposito.direccion_deposito : ''
      // RECEPCION
      state.formData.latitud_recepcion = deposito.latitud ? deposito.latitud : -16.4997452
      state.formData.longitud_recepcion = deposito.longitud ? deposito.longitud : -68.1297037
      state.formData.url_recepcion = deposito.url_deposito ? deposito.url_deposito : ''
      state.formData.direccion_recepcion = deposito.direccion_deposito ? deposito.direccion_deposito : ''
      if(deposito.latitud && deposito.longitud){
        zoom.value = 12
      }
    }else{
      state.formData.latitud_encuentro = -16.4997452
      state.formData.longitud_encuentro = -68.1297037
      state.formData.url_encuentro = ''
      state.formData.direccion_encuentro = ''
      state.formData.latitud_recepcion = -16.4997452
      state.formData.longitud_recepcion = -68.1297037
      state.formData.url_recepcion = ''
      state.formData.direccion_recepcion = ''
    }
  }

  const buttonAddLogistics = async () => {

    assignButton.value = true
    await asignacionValidacion()
    if(!assignForm.value) return

   
    if(state.formData.id_deposito){
      const registro = lista_depositos.value.find( (deposito: any) => deposito.id == Number(state.formData.id_deposito))
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
            //console.log(state.formData.bienes[j]. direccion_recepcion)
            
           break
          }
        }
      }
      itemsSelected.value = []
 
      state.formData.tipo_logistica = ''
      state.formData.motivo = ''
      state.formData.observaciones_logistica = ''

      state.formData.fecha_recepcion = currentDate
      state.formData.hora_recepcion = ''
      state.formData.id_deposito = ''
      state.formData.nombre_deposito = ''
      state.formData.url_encuentro = ''
      state.formData.direccion_encuentro = ''
      state.formData.url_recepcion = ''
      state.formData.direccion_recepcion = ''
      
      state.formData.logistica_habilitada = true
    }
  }


  const buttonReport = async (id: any) => {
    await receptionLogisticsStore.receptionLogisticsReport(id)
  }
  
  const buttonReturnList = () => {
    router.push({ name: 'bienFile', params: { id: id_caso }})
  }

  const asignacionValidacion = async () => {
    assignForm.value = true
    if(!state.formData.tipo_logistica ||
      !state.formData.fecha_recepcion ||
      !state.formData.hora_recepcion ||
      !state.formData.url_recepcion ||
      !state.formData.url_encuentro
    ){
      assignForm.value = false
    }

    if(state.formData.tipo_logistica == 'AMPLIACION' && !state.formData.motivo){
      assignForm.value = false
    }

    // state.formData.logistica_habilitada = false
    // for (let i = 0; i < state.formData.bienes.length; i++) {
    //   const bien = state.formData.bienes[i]
    //   if(bien.fecha_recepcion &&
    //     bien.hora_recepcion &&
    //     bien.url_encuentro &&
    //     bien.url_recepcion){
    //     state.formData.logistica_habilitada = true
    //     break
    //   }
    // }
  }

  const miValidacion = async () => {
    sendForm.value = true
    if(!state.formData.logistica_habilitada){ 
      
      sendForm.value = false
    }
  }

  const dias = [
  
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
  'domingo',
];

  const mifuncion = async () => {
    if(itemsSelected.value.length>0){
      const indice = itemsSelected.value.length-1
      state.formData.fecha_add=itemsSelected.value[indice].fecha_revision
      //console.log(itemsSelected.value[indice].fecha_revision)
     // console.log(state.formData.fecha_add)
      const fecha=  new Date(state.formData.fecha_add);
      const dia = format(fecha, "dd");
      const mes = format(fecha, "MM");
      const year2 = format(fecha, "yyyy");
      const ultimo= new Date(year2, mes, 0);
      const diaf= format(ultimo, "dd");
      const diaff= parseInt(diaf);
      const contador=0;
      const fechas_fe=fecha_feriados.length;
      //console.log(fechas_fe)
      const normal=22;
      const ampliado=42;
        const a =parseInt(dia);
        console.log(a + " mes "+ mes);
       const fechaad= parseInt(diaf)- a;
       //console.log('fechai '+a+ " fecha final:"+ parseInt(diaf)+ "dias restantes"+ fechaad)
       const fechar =new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDay());
       const numeroDia = new Date(fechar).getDay();
       const nombreDia = dias[numeroDia];
       console.log("Nombre de día de la semana: ", nombreDia);
        if(fechaad>normal){
            const nuevo =  parseInt(dia) + normal;
            const currentDate2 = format(fecha, "yyyy-MM-"+ nuevo);
            state.formData.fecha_fin= currentDate2;

        }else{
          const diferencia = ampliado - fechaad;
          const currentDate2 = format(fecha, "yyyy-MM-"+ diferencia);
            state.formData.fecha_fin= currentDate2;

        }

        if(ampliado>fechaad){
          const diferencia = ampliado - fechaad;
          const fechar =new Date(year2, mes, diferencia);
          //console.log(fechar.)
          const currentDate3 = format(fechar, "yyyy-MM-dd");
          state.formData.fecha_fin2= currentDate3;
        }
        
     
    

    }
  }


  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value) return

    Swal.fire({
      title: 'Estás seguro?',
      text: "Una vez enviada la información no podrá ser modificada",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#FA896B',
      confirmButtonColor: '#5D87FF',
      cancelButtonText: 'No, volver',
      confirmButtonText: 'Si, enviar formulario',
    }).then(async (result) => {
      if (result.isConfirmed) {
        isLoading.value = true
        const { ok, message } = await receptionLogisticsStore.createReceptionLogistics(state.formData)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
          icon: icono,
          title: message,
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        })
        !ok ? isLoading.value = false : ''
      }
    })
  }

  onMounted( async () => {
    await getDataByCaseCiteList(id_caso, id_recepcion_documental)
    await getReceptionLogisticsList(id_caso, id_recepcion_documental)
    await getAvailablePropertiesList(id_caso, id_recepcion_documental)
    await getDepositsList()
    await getReceptionLogisticsReasonsList()
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-row>
    <v-col cols="12" lg="12">
      <v-alert
        variant="outlined"
        type="warning"
        border="top"
        icon="$warning"
        title="ATENCIÓN"
        closable
      >
        - <span class="text-primary">Para establecer la logística de recepción, debe seleccionar a los bienes y elegir el tipo de logística que realizará, el formulario desplegará los campos dependiendo del tipo de logística elegida.</span><br>
        <!-- - <span class="text-primary">Para todo bien exceptuando los inmuebles debe asignarse el deposito.</span><br>
        - <span class="text-primary">Al elegir los depositos se autocompletaran automaticamente los campos (lugar y dirección) dependiendo estos mismos cuentan con su información completa.</span><br> -->
        - <span class="text-primary">Una vez se completo el formulario del bien a asignar debe seleccionar el botón <span class="text-warning font-weight-medium">Asignar</span> para guardar los datos establecidos.</span><br>
        - <span class="text-primary">Los bienes a los que se aplicara la logística de recepción se encuentran en la tabla de bienes disponibles, debe verificar que la información asignada con los formularios se encuentre presente en la tabla.</span><br>
        - <span class="text-primary">En el campo <span class="text-secondary font-weight-medium">Asignación de Deposito y Motivo (Ampliación)</span> si no encuentra la opción requerida, debe comunicarse con el Área de Registro y Sistemas mediante el correo institucional, solicitar el agregado de la opción.</span><br>
      </v-alert>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card elevation="0" rounded="md" class="bg-lightprimary border-0">
        <div class="pa-3 text-justify">
          <p class="text-h5"><span class="font-weight-bold text-primary">CASO FELCN/FELCC:</span> {{ informacion_logistica.numero_caso_felcn_felcc }} </p>
          <p class="text-h5"><span class="font-weight-bold text-primary">NOMBRE CLAVE DEL CASO:</span> {{ informacion_logistica.nombre_clave_caso }} </p>
          <p class="text-h5"><span class="font-weight-bold text-primary">CITE:</span> {{ informacion_logistica.cite }} </p>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="mb-5">
    <v-col cols="12">
      <v-card elevation="0" class="border">
        <v-card-title class="bg-lightprimary text-primary">Logísticas de recepción efectuadas</v-card-title>
        <v-table>
          <thead>
            <tr class="">
              <th class="text-h6 text-center"></th>
              <th class="text-h6 text-center text-primary">BIEN</th>
              <th class="text-h6 text-center text-primary">JURISDICCIÓN</th>
              <th class="text-h6 text-center text-primary">CARACTERÍSTICAS</th>
              <th class="text-h6 text-center text-primary">OBSERVACIONES DEL BIEN</th>
              <th class="text-h6 text-center text-primary">TIPO LOGÍSTICA</th>
              <th class="text-h6 text-center text-primary">FECHA LOGÍSTICA RECEPCIÓN</th>
              <th class="text-h6 text-center text-primary">DEPÓSITO</th>
              <th class="text-h6 text-center text-primary">LUGAR ENCUENTRO</th>
              <th class="text-h6 text-center text-primary">LUGAR RECEPCIÓN</th>
              <th class="text-h6 text-center text-primary">MOTIVO</th>
              <th class="text-h6 text-center text-primary">OBSERVACIÓN LOGÍSTICA</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="lista_logisticas.length == 0">
              <tr>
                <td class="text-h6 text-center" colspan="13">SIN REGISTROS</td>
              </tr>
            </template>
            <template v-for="(item, index) in lista_logisticas" :key="index">
              <tr>
                <td class="text-center">
                  <v-item-group class="d-flex justify-sm-space-between px-2">
                    <v-item>
                      <v-btn
                        density="compact"
                        icon="mdi-download"
                        title="Descargar reporte"
                        @click="buttonReport(item.id)"
                        ><v-icon color="primary"></v-icon>
                      </v-btn>
                    </v-item>
                  </v-item-group>
                </td>
                <td class="text-center">{{ item.nombre_bien }}</td>
                <td class="text-center">{{ item.jurisdiccion }}</td>
                <td class="text-center">{{ item.caracteristicas }}</td>
                <td class="text-center">{{ item.observaciones }}</td>
                <td class="text-center">
                  <v-chip rounded="lg" class="font-weight-black py-4 px-3" :color="item.tipo_logistica == 'NORMAL' ? 'success' : 'warning'">
                    {{ item.tipo_logistica }}
                  </v-chip>
                </td>
                <td class="text-center">{{ item.fecha_recepcion_literal }}</td>
                <td class="text-center">{{ item.nombre_deposito }}</td>
                <td class="text-center">
                  <v-btn icon size="small" color="secondary" variant="tonal" :href="item.url_encuentro" target="_blank">
                    <MapPinIcon/>
                  </v-btn>
                </td>
                <td class="text-center">
                  <v-btn icon size="small" color="secondary" variant="tonal" :href="item.url_recepcion" target="_blank">
                    <MapPinIcon/>
                  </v-btn>
                </td>
                <td class="text-center">{{ item.motivo }}</td>
                <td class="text-center">{{ item.observacion_logistica }}</td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

  <template v-if="state.formData.bienes.length > 0">
    <v-row>
      <v-col cols="12">
        <h4 class="font-weight-light">
          <span class="text-error text-decoration-underline">NOTA:</span> Marque el recuadro del bien, que desea asignar valores para establecer la logística de recepción.
        </h4>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="12">
        <v-card variant="flat" color="primary" :style="submitButton && !state.formData.logistica_habilitada ? 'border: 1px solid #FA896B;' : ''">
          <v-card-title class="text-white">Bienes disponibles para establecer logística de recepción</v-card-title>

          <EasyDataTable
            v-model:items-selected="itemsSelected"
            :headers="headers"
            :items="state.formData.bienes"
            header-text-direction="center"
            body-text-direction="center"
            @update-page-items="mifuncion()"
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
          
        </v-card>
        <template v-if="submitButton && !state.formData.logistica_habilitada">
          <div class="text-center v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Debe establecer la logística de recepción al menos para un bien.
            </div>
          </div>
        </template>
      </v-col>
    </v-row>
  </template>

 

 
  <template v-if="itemsSelected.length>0">
    <v-row>
      <v-col cols="12">
        <h4 class="mt-5">
          Los campos con <span style="color:red">*</span> son obligatorios
        </h4>
      </v-col>

      <v-col cols="12" md="4">
        <v-label class="mb-2 font-weight-medium">Tipo de logística <span style="color:red">*</span></v-label>
        <v-radio-group 
          v-model="state.formData.tipo_logistica"
          @update:modelValue="changeLogisticType"
          class="ml-n3"
          inline
          :error="assignButton && !state.formData.tipo_logistica"
          hide-details
        >
          <v-radio label="NORMAL" color="primary" value="NORMAL"></v-radio>
          <v-radio label="AMPLIACIÓN" color="secondary" value="AMPLIACION"></v-radio>
        </v-radio-group>
        <template v-if="assignButton && !state.formData.tipo_logistica">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              El campo es requerido
            </div>
          </div>
        </template>

      </v-col>

      <template v-if="state.formData.tipo_logistica != '' && state.formData.tipo_logistica == 'AMPLIACION'">
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Motivo <span style="color:red">*</span></v-label>
          <v-select
            :items="lista_motivos"
            item-title="nombre_motivo"
            item-value="nombre_motivo"
            no-data-text="No existe más opciones para seleccionar"
            v-model="state.formData.motivo"
            clearable
            :error="assignButton && !state.formData.motivo && state.formData.tipo_logistica == 'AMPLIACION'"
            hide-details
          >
          </v-select>
          <template v-if="assignButton && !state.formData.motivo && state.formData.tipo_logistica == 'AMPLIACION'">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>

        <v-col cols="12" md="">
          <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            v-model.trim="state.formData.observaciones_logistica"
            @input="state.formData.observaciones_logistica = validateText(state.formData.observaciones_logistica.toUpperCase())"
            hide-details
          />
        </v-col>
           
      </template>
      <template v-else>
        <v-col cols="md-8"></v-col>
      </template>

      <v-col cols="12" md="4">
        <v-label class="mb-2 font-weight-medium">Asignación de depósito</v-label>
        <v-autocomplete
          v-model="state.formData.id_deposito"
          :items="lista_depositos"
          item-title="nombre_deposito"
          item-value="id"
          color="primary"
          variant="outlined"
          no-data-text="No existe opciones para seleccionar"
          @update:modelValue="setDepositPosition(state.formData.id_deposito)"
          hide-details
          clearable
        ></v-autocomplete>
      </v-col>
    
      <v-col cols="12" md="4">
       
        <v-label class="mb-2 font-weight-medium">Fecha de recepción <span style="color:red">*</span></v-label>
        <div v-if="state.formData.tipo_logistica === ''">
          <v-text-field 
          type="date" 
          v-model="state.formData.fecha_recepcion"
          :min="currentDate"
          :max="currentDate"
        
          :error="assignButton && !state.formData.fecha_recepcion"
          hide-details
        />
        </div>
        <div v-else-if="state.formData.tipo_logistica === 'NORMAL'">
          <v-text-field 
            type="date" 
            v-model="state.formData.fecha_recepcion"
            :min="state.formData.fecha_add"
            :max="state.formData.fecha_fin"
            :error="assignButton && !state.formData.fecha_recepcion"
            hide-details
          />
       </div>
       <div v-else-if="state.formData.tipo_logistica === 'AMPLIACION'">
          <v-text-field 
            type="date" 
            v-model="state.formData.fecha_recepcion"
            :min="state.formData.fecha_add"
            :max="state.formData.fecha_fin2"
            :error="assignButton && !state.formData.fecha_recepcion"
            hide-details
          />
       </div>
       
        <template v-if="assignButton && !state.formData.fecha_recepcion">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              El campo es requerido
            </div>
          </div>
        </template>
      </v-col>

      <v-col cols="12" md="4">
        <v-label class="mb-2 font-weight-medium">Hora de recepción <span style="color:red">*</span></v-label>
        <v-text-field 
          type="time"
          v-model="state.formData.hora_recepcion"
          :error="assignButton && !state.formData.hora_recepcion"
          hide-details
        />
        <template v-if="assignButton && !state.formData.hora_recepcion">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              El campo es requerido
            </div>
          </div>
        </template>
      </v-col>

      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Dirección de encuentro <span style="color:red">*</span></v-label>
            <v-text-field 
              variant="outlined" 
              color="primary"
              v-model.trim="state.formData.direccion_encuentro"
              @input="state.formData.direccion_encuentro = validateText(state.formData.direccion_encuentro.toUpperCase())"
              :error="assignButton && !state.formData.direccion_encuentro"
              hide-details
            />
            <template v-if="assignButton && !state.formData.direccion_encuentro">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Latitud de encuentro<span style="color:red">*</span></v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              type="number"
              step=".0001"
              v-model="state.formData.latitud_encuentro"
              :error="assignButton && !state.formData.latitud_encuentro"
              hide-details
            />
            <template v-if="assignButton && !state.formData.latitud_encuentro">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Longitud de encuentro<span style="color:red">*</span></v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              type="number"
              step=".0001"
              v-model="state.formData.longitud_encuentro"
              :error="assignButton && !state.formData.longitud_encuentro"
              hide-details
            />
            <template v-if="assignButton && !state.formData.longitud_encuentro">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Lugar de encuentro <span style="color:red">*</span></v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              v-model="state.formData.url_encuentro"
              readonly
              :error="assignButton && !state.formData.url_encuentro"
              hide-details
            />
            <template v-if="assignButton && !state.formData.url_encuentro">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="8">
        <v-card variant="elevated" color="lightprimary">
          <div style="width: 100%; height: 400px" class="px-2 py-2">
            <mapbox-map 
              :accessToken="myAccessToken"
              :center="[ state.formData.longitud_encuentro, state.formData.latitud_encuentro ]"
              :zoom= state.formData.zoom_encuentro
              @wheel="updateZoom"
              @zoom="updateZoom"
              @loaded="setZoom"
            >
            <!-- :center="[ -68.1297037, -16.4997452 ]" -->
              <mapbox-geocoder-control @result="pushResultMeeting" :marker="false"/>
              <mapbox-marker
                :lngLat="[ state.formData.longitud_encuentro, state.formData.latitud_encuentro ]"
                :draggable="true"
                @dragend="newPositionMeeting"
              >
              </mapbox-marker>
              <mapbox-navigation-control position="bottom-left"/>
            </mapbox-map>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Dirección de recepción <span style="color:red">*</span></v-label>
            <v-text-field 
              variant="outlined" 
              color="primary"
              v-model.trim="state.formData.direccion_recepcion"
              @input="state.formData.direccion_recepcion = validateText(state.formData.direccion_recepcion.toUpperCase())"
              :error="assignButton && !state.formData.direccion_recepcion"
              hide-details
            />
            <template v-if="assignButton && !state.formData.direccion_recepcion">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Latitud de recepción<span style="color:red">*</span></v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              type="number"
              step=".0001"
              v-model="state.formData.latitud_recepcion"
              :error="assignButton && !state.formData.latitud_recepcion"
              hide-details
            />
            <template v-if="assignButton && !state.formData.latitud_recepcion">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Longitud de recepción<span style="color:red">*</span></v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              type="number"
              step=".0001"
              v-model="state.formData.longitud_recepcion"
              :error="assignButton && !state.formData.longitud_recepcion"
              hide-details
            />
            <template v-if="assignButton && !state.formData.longitud_recepcion">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium" required>Lugar de recepción <span style="color:red">*</span></v-label>
            <v-text-field
              variant="outlined" 
              color="primary"
              type="url"
              v-model="state.formData.url_recepcion"
              readonly
              :error="assignButton && !state.formData.url_recepcion"
              hide-details
            />
            <template v-if="assignButton && !state.formData.url_recepcion">
              <div class="v-messages font-weight-black px-2 py-2">
                <div class="v-messages__message text-error">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="8">
        <v-card variant="elevated" color="lightprimary">
          <div style="width: 100%; height: 400px" class="px-2 py-2">
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
        </v-card>
      </v-col>

      <v-col>
        <v-btn 
          color="primary"
          @click= buttonAddLogistics()
        >
          <PlusIcon/> Asignar datos de formulario
        </v-btn>
      </v-col>
    </v-row>
  </template>

  <v-row>
    <v-col cols="12" class="text-lg-right pt-10">
      <template v-if="!isLoading">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
        <template v-if="state.formData.bienes.length > 0 && state.formData.logistica_habilitada == true">
          <v-btn color="primary" class="mr-3" @click="buttonSendForm()">Enviar</v-btn>
        </template>
      </template>
      <template v-else>
        <v-btn color="primary" class="mr-3" disabled>
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
</template>