<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useUserStore } from '@/stores/resources/user';
import { usePropertyApprovalStore } from '@/stores/resources/propertyApproval'
import { useDocumentaryReceptionStore } from '@/stores/moduleOne/documentaryReception';
import { useInstanceStore } from '@/stores/moduleOne/instance';
import { useImmovablePropertyStore } from '@/stores/moduleOne/immovableProperty';
import { useVehicleStore } from '@/stores/resources/vehicle';
import { useMoneyValuesStore } from '@/stores/resources/moneyValues';
import { useAircraftStore } from '@/stores/moduleOne/aircraft';
import { useControlledSubstanceStore } from '@/stores/moduleOne/controlledSubstance';
import { useSelfMovingStore } from '@/stores/resources/selfMoving';
import { useJewelStore } from '@/stores/resources/jewel';
import { useArtworkStore } from '@/stores/moduleOne/artwork';
import { useConsumableStore } from '@/stores/moduleOne/consumable';
import { useOtherPropertyStore } from '@/stores/resources/otherProperty';
import { useBoatStore } from '@/stores/moduleOne/boat';
import { useElectronicStore } from '@/stores/moduleOne/electronic';

import Swal from 'sweetalert2'

import "devextreme/dist/css/dx.light.css";
import { AwardIcon } from 'vue-tabler-icons';
const userStore = useUserStore()
const propertyApprovalStore = usePropertyApprovalStore()
const documentaryReception = useDocumentaryReceptionStore()
const instanceStore = useInstanceStore()
const immovablePropertyStore = useImmovablePropertyStore()
const vehicleStore = useVehicleStore()
const moneyValuesStore = useMoneyValuesStore()
const aircraftStore = useAircraftStore()
const controlledSubstanceStore = useControlledSubstanceStore()
const selfMovingStore = useSelfMovingStore()
const jewelStore = useJewelStore()
const artworkStore = useArtworkStore()
const consumableStore = useConsumableStore()
const otherPropertyStore = useOtherPropertyStore()
const boatStore = useBoatStore()
const electronicStore = useElectronicStore()

const page = ref({ title: 'Aprobación de bienes' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de bienes por aprobar',
    disabled: true,
    href: '#'
  }
]);

  const bienes = ref([])

  const getPropertyApprovalsList = async() => {
    bienes.value = await propertyApprovalStore.propertyApprovals()
  }

  const usuarios = ref([])
  const getUsersList = async() => {
    usuarios.value = await userStore.users() 
  }
//no usar
  const buttonReceptionReport = async (id_caso: any, id_recepcion_documental: any) => {
    await documentaryReception.minutesReport(id_caso, id_recepcion_documental)
  }

  const buttonReviewReport = async (id_caso: any, id_recepcion_documental: any) => {
    await instanceStore.reviewReport(id_caso, id_recepcion_documental)
  }

  const buttonLogisticsReport = async (id_caso: any, id_recepcion_documental: any) => {
    await instanceStore.receptionLogisticsReport(id_caso, id_recepcion_documental)
  }

  const buttonInventoryReport = async (nombre_bien:any, id_bien_registro: any) => {
    // router.push({ name : 'userForm', params: { id_usuario: id_usuario }})
    if(nombre_bien == 'INMUEBLES'){
      await immovablePropertyStore.immovablePropertyReport(id_bien_registro)
    }
    if(nombre_bien == 'VEHICULOS'){
      await vehicleStore.vehicleReport(id_bien_registro)
    }
    if(nombre_bien == 'DINERO Y VALORES'){
      await moneyValuesStore.moneyValueReport(id_bien_registro)
    }
    if(nombre_bien == 'AERONAVES'){
      await aircraftStore.aircraftReport(id_bien_registro)
    }
    if(nombre_bien == 'SUSTANCIAS CONTROLADAS'){
      await controlledSubstanceStore.controlledSubstanceReport(id_bien_registro)
    }
    if(nombre_bien == 'SEMOVIENTES'){
      await selfMovingStore.selfMovingReport(id_bien_registro)
    }
    if(nombre_bien == 'JOYAS'){
      await jewelStore.jewelReport(id_bien_registro)
    }
    if(nombre_bien == 'OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS'){
      await artworkStore.artworkReport(id_bien_registro)
    }
    if(nombre_bien == 'CONSUMIBLES'){
      await consumableStore.consumableReport(id_bien_registro)
    }
    if(nombre_bien == 'OTROS BIENES'){
      await otherPropertyStore.otherPropertyReport(id_bien_registro)
    }
    if(nombre_bien == 'EMBARCACIONES'){
      await boatStore.boatReport(id_bien_registro)
    }
    if(nombre_bien == 'EQUIPOS ELECTRONICOS'){
      await electronicStore.electronicReport(id_bien_registro)
    }
  }

  const buttonKardexReport = async (nombre_bien:any, id_bien_registro: any) => {
    // router.push({ name: 'userForm', params: { id_usuario: id_usuario }})
    if(nombre_bien == 'INMUEBLES'){
      await immovablePropertyStore.kardexImmovablePropertyReport(id_bien_registro)
    }
    if(nombre_bien == 'VEHICULOS'){
      await vehicleStore.kardexVehicleReport(id_bien_registro)
    }
    if(nombre_bien == 'DINERO Y VALORES'){
      await moneyValuesStore.kardexMoneyValueReport(id_bien_registro)
    }
    if(nombre_bien == 'AERONAVES'){
      await aircraftStore.kardexAircraftReport(id_bien_registro)
    }
    if(nombre_bien == 'SUSTANCIAS CONTROLADAS'){
      await controlledSubstanceStore.kardexControlledSubstanceReport(id_bien_registro)
    }
    if(nombre_bien == 'SEMOVIENTES'){
      await selfMovingStore.kardexSelfMovingReport(id_bien_registro)
    }
    if(nombre_bien == 'JOYAS'){
      await jewelStore.kardexJewelReport(id_bien_registro)
    }
    if(nombre_bien == 'OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS'){
      await artworkStore.kardexArtworkReport(id_bien_registro)
    }
    if(nombre_bien == 'CONSUMIBLES'){
      await consumableStore.kardexConsumableReport(id_bien_registro)
    }
    if(nombre_bien == 'OTROS BIENES'){
      await otherPropertyStore.kardexOtherPropertyReport(id_bien_registro)
    }
    if(nombre_bien == 'EMBARCACIONES'){
      await boatStore.kardexBoatReport(id_bien_registro)
    }
    if(nombre_bien == 'EQUIPOS ELECTRONICOS'){
      await electronicStore.kardexElectronicReport(id_bien_registro)
    }
  }
//no usar
  const buttonApprove = (id_bien_registro: any) => {
    Swal.fire({
      title: 'Estas seguro?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, aprobar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { ok, message } = await propertyApprovalStore.approveProperty({id_bien_registro: id_bien_registro})
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
          icon: icono,
          title: message,
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        })
        getPropertyApprovalsList()
      }
    })
  }


  // ver
  const search = ref() as any

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});


// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Tipo de bien ', key: 'nombre_bien' },
  { title: 'Nombre de clave de caso', key: 'nombre_clave_caso' },
  { title: 'N° de caso FELCN/FELCC', key: 'numero_caso_felcn_felcc' },
  { title: 'Jurisdicción del Bien', key: 'jurisdiccion_bien' },
  { title: 'Estado del bien', key: 'condicion' },
  { title: 'Fecha de aprobación', key: 'fecha_aprobacion' },
  { title: 'Usuario que aprobo', key: 'nombre_usuario' },
])



  onMounted(() => {
    getUsersList()
    getPropertyApprovalsList()
  });

</script>

<template>

  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-row>
    <v-col cols="12"> 
      
      <v-data-table 
            class="border rounded-md" 
            :headers="headers" 
            :items="bienes" 
            :sort-by="[{ key: 'nombre_clave_caso', order: 'asc' }]" 
            :search="search"
          >
            <template v-slot:top>
              
              <v-toolbar class="bg-lightprimary px-4" flat>
                <v-text-field 
                  v-model.trim="search" 
                  append-inner-icon="mdi-magnify" 
                  label="Busqueda" 
                  hide-details 
                />
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="text-center">
                <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Recepción documental"
                  height="25"
                  width="25"
                  color="white"
                  text="hola"
                  @click="buttonReceptionReport(item.id_caso, item.id_recepcion_documental)"
                >
                  <ReportIcon style=" cursor: pointer;"></ReportIcon>
                </v-btn>
                <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Revisión documental"
                  height="25"
                  width="25"
                  color="white"
                  text="hola"
                  @click="buttonReviewReport(item.id_caso, item.id_recepcion_documental)"
                >
                  <ReportIcon style=" cursor: pointer;"></ReportIcon>
                </v-btn>
                <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Logística de recepción"
                  height="25"
                  width="25"
                  color="white"
                  text="hola"
                  @click="buttonLogisticsReport(item.id_caso, item.id_recepcion_documental)"
                >
                  <ReportIcon style=" cursor: pointer;"></ReportIcon>
                </v-btn>
                <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Inventario de bien"
                  height="25"
                  width="25"
                  color="white"
                  text="hola"
                  @click="buttonInventoryReport(item.nombre_bien, item.id_bien_registro)"
                >
                  <ReportIcon style=" cursor: pointer;"></ReportIcon>
                </v-btn>
                <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Kardex de bien"
                  height="25"
                  width="25"
                  color="white"
                  text="hola"
                  @click="buttonKardexReport(item.nombre_bien, item.id_bien_registro)"
                >
                  <ReportIcon style=" cursor: pointer;"></ReportIcon>
                </v-btn>
                <v-btn
                  v-if="!item.condicion"
                  class=""
                  size="x-small"
                  title="Aprobar bien"
                  height="25"
                  width="25"
                  color="white"
                  @click="buttonApprove(item.id_bien_registro)"
                >
                  <FileCheckIcon color="#5D87FE" style=" cursor: pointer;"></FileCheckIcon>
                </v-btn>
              </div>
                
            </template>
          </v-data-table>
    </v-col>
      
  </v-row>
  
</template>
