<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, FileUploadIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { useResourceStore } from '@/stores/resource'; // RECURSOS
import { useInstanceStore } from '@/stores/moduleOne/instance';
import { useImmovablePropertyStore } from '@/stores/moduleOne/immovableProperty'  // INMUEBLES
import { usePropertyStore } from '@/stores/moduleOne/property';  // VEHICULOS ANTIGUO
import { useVehicleStore } from '@/stores/resources/vehicle'; // VEHICULOS NUEVO
import { useMoneyValuesStore } from '@/stores/resources/moneyValues';  // DINERO Y VALORES
import { useAircraftStore } from '@/stores/moduleOne/aircraft'  // AERONAVES
import { useControlledSubstanceStore } from '@/stores/moduleOne/controlledSubstance'  // SUSTANCIAS CONTROLADAS
import { useSelfMovingStore } from '@/stores/resources/selfMoving'; // SEMOVIENTES
import { useJewelStore } from '@/stores/resources/jewel'; // JOYAS
import { useArtworkStore } from '@/stores/moduleOne/artwork'; // OBRAS DE ARTE Y PIEZAS ARQUEOLOGICAS
import { useConsumableStore } from '@/stores/moduleOne/consumable'; // CONSUMIBLES
import { useOtherPropertyStore } from '@/stores/resources/otherProperty'; // OTROS BIENES
import { useBoatStore } from '@/stores/moduleOne/boat'; // EMBARCACIONES
import { useElectronicStore } from '@/stores/moduleOne/electronic';
import Swal from 'sweetalert2'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const instanceStore = useInstanceStore()
  const immovablePropertyStore = useImmovablePropertyStore()  // INMUEBLES
  const propertyStore = usePropertyStore()  // VEHICULOS
  const vehicleStore = useVehicleStore()  // VEHICULOS
  const moneyValuesStore = useMoneyValuesStore()  // DINERO Y VALORES
  const aircraftStore = useAircraftStore()  // AERONAVES
  const controlledSubstanceStore = useControlledSubstanceStore()  // SUSTANCIA CONTROLADA
  const selfMovingStore = useSelfMovingStore()  // SEMOVIENTES
  const jewelStore = useJewelStore()  // JOYAS
  const artworkStore = useArtworkStore()  // OBRAS DE ARTE Y PIEZAS ARQUEOLOGICAS
  const consumableStore = useConsumableStore()  // CONSUMIBLES
  const otherProperyStore = useOtherPropertyStore() // OTROS BIENES
  const boatStore = useBoatStore()  // EMBARCACIONES
  const electronicStore = useElectronicStore()  // EQUIPOS ELECTRONICOS
  
  // BREADCRUMB
  const page = ref({ title: 'Registro de Bienes' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Registro de Bienes',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DE STATE
  const state = reactive({
    formData: {
      id_caso: '',
      bienes:[] as any,
    }
  })

  // DECLARACION DE BIEN FORMULARIO 
  const bien: any = reactive({
    bienData: {
      id_bien: '',
      jurisdiccion: '',
      caracteristicas: '',
      observaciones: ''
    }
  });

  const id_caso = Number(route.params.id)
  const caso = ref({}) as any
  const revisado = ref(false)
  const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  const isLoading = ref(false)

  // RECURSOS
  const tipoBien = ref([]) as any
  const jurisdicciones = ref([]) as any
  const getResourcesList = async () => {
    // LISTA DE BIENES
    tipoBien.value = await resourceStore.getProperties()
    // LISTA DE JURISDICCIONES
    const jurisdictions = await resourceStore.getOffices()
    jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.departamento != 'NACIONAL' ) // RETIRAMOS EL REGISTRO QUE TENGA NACIONAL 
    // INFORMACION DEL CASO
    caso.value = await instanceStore.instance(id_caso)
  }

  // FUNCION QUE LLAMA LA INFORMACION DEL CASO
  const getInstancePropertiesById = async (id: any) => {
    const properties = await instanceStore.instanceProperties(id)
    if(properties.bienes.length > 0){
      // EN ESTA CONSULTAD SE DEBE DEVOLVER EL ESTADO DEL BIEN, PERO YA NO SE BUSCA SOLO EN LA TABLA DE CASO BIEN REGISTOR GENERAL
      // SINO QUE SE TIENE QUE HACER UN CRUCE DE INFORMACION CON LA TABLA ESTAD REVISION DOCUMENTAL

      // AQUI SE EVALUA SI EXISTE ALGUN BIEN QUE NO FUE REVISADO
      const valor = properties.bienes.find( (registro:any) => registro.aprobado === null )
      if(!valor){
        revisado.value = true
      }
    }

    // PARA VERIFICAR SI EL BIEN ESTA HABILITADO (QUE YA SE LE ASIGNO LA LOGISTICA DE RECEPCION)
    const reception = await instanceStore.receptionLogisticsRecords(id)
    state.formData.id_caso = properties.id_caso
    for (let i = 0; i < properties.bienes.length; i++) {
      const record = reception.find( (registro:any) => registro.id_bien_registro == properties.bienes[i].id_bien_registro )
      const enableProperty = record ? true : false
      state.formData.bienes.push({
        id: properties.bienes[i].id_bien_registro,
        id_bien: properties.bienes[i].id_bien,
        jurisdiccion: properties.bienes[i].jurisdiccion,
        caracteristicas: properties.bienes[i].caracteristicas,
        observaciones: properties.bienes[i].observaciones,
        inventario: properties.bienes[i].inventario,
        habilitado: enableProperty
      })
    }
  }

  // FUNCION QUE LLAMA LA INFORMACION DEL CASO PARA LAS RECEPCIONES DEL CASO
  const recepciones = ref([]) as any;
  const getInstanceDocumentaryReceptionById = async (id: any) => {
    recepciones.value = await instanceStore.instanceDocumentaryReceptions(id)
  }

  // VALIDACIONES INICIO
  const rules = computed(() => {
    return {
      bienData: {
        id_bien: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        jurisdiccion: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        caracteristicas: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, bien)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  const buttonReturnList = () => {
    router.push({ name: 'documentaryReviewList' })
  }

  // AGREGAR BIEN A LA TABLA DE BIENES
  const buttonAddProperty = async () => {
    const result = await v$.value.$validate()
    if(!result) return

    isLoading.value = true

    const { ok, message, id } = await instanceStore.updateInstanceProperty({
      id_caso: state.formData.id_caso,
      bien: bien.bienData
    })
    
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })

    if(ok){
      state.formData.bienes.push({
        id: id,
        id_bien: bien.bienData.id_bien,
        jurisdiccion: bien.bienData.jurisdiccion,
        caracteristicas: bien.bienData.caracteristicas,
        observaciones: bien.bienData.observaciones
      })
      clearProperty()
      v$.value.$reset()
      isLoading.value = false
    }
  }

  // ELIMINAR BIEN DE LA TABLA DE BIENES
  const buttonDeleteProperty = (id:number) => {
    console.log('eliminar bien con el id ', id)
  }

  // BOTON PARA FORMULARIO DE ARCHIVOS DE LOS BIENES
  const documentaryReviewForm = (id_bien:number, id_caso:number, id_bien_registro:number) => {
    // PARAMETROS ENVIADOS id_bien, id_caso=id_caso, id_bien_registro
    router.push({ name: 'documentaryReviewForm', params: { id_bien, id_caso, id_bien_registro  }})
  }

  // BOTON A FORMULARIO DE INVENTARIO DEL BIEN
  const buttonPropertyInformation = (id_caso:number, id_bien:number, id_bien_registro:number) => {
    let bien: any = tipoBien.value.filter((registro: any) => registro.id == id_bien)
    bien = bien[0].nombre_bien
    if(bien == 'INMUEBLES'){
      router.push({ name: 'immovableProperty', params: { id_caso, id_bien, id_bien_registro }})
    }
    if(bien == 'VEHICULOS'){
      // router.push({ name: 'propertyFile', params: { id_caso, id_bien, id_bien_registro }})
      router.push({ name: 'vehicle', params: { id_caso, id_bien, id_bien_registro }})
    }
    if(bien == 'DINERO Y VALORES'){
      router.push({ name: 'moneyValues', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'AERONAVES'){
      router.push({ name: 'aircraft', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'SUSTANCIAS CONTROLADAS'){
      router.push({ name: 'controlledSubstance', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'SEMOVIENTES'){
      router.push({ name: 'selfMoving', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'JOYAS'){
      router.push({ name: 'jewel', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS'){
      router.push({ name: 'artwork', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'CONSUMIBLES'){
      router.push({ name: 'consumable', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'OTROS BIENES'){
      router.push({ name: 'otherProperty', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'EMBARCACIONES'){
      router.push({ name: 'boat', params: { id_caso, id_bien, id_bien_registro } })
    }
    if(bien == 'EQUIPOS ELECTRONICOS'){
      router.push({ name: 'electronic', params: { id_caso, id_bien, id_bien_registro } })
    }
  }

  // REPORTE DE REVISION DOCUMENTAL
  const buttonReviewReport = async (id_caso: number, id_recepcion_documental: number) => {
    await instanceStore.reviewReport(id_caso, id_recepcion_documental)
  }

  // REPORTES DE LOS BIENES
  const buttonPropertyReport = async (id_bien:number, id_bien_registro: number) => {
    // await propertyStore.propertyReport(id_bien_registro)

    let bien: any = tipoBien.value.filter((registro: any) => registro.id == id_bien)
    bien = bien[0].nombre_bien
    if(bien == 'INMUEBLES'){
      await immovablePropertyStore.immovablePropertyReport(id_bien_registro)
    }
    if(bien == 'VEHICULOS'){
      // await propertyStore.propertyReport(id_bien_registro)
      await vehicleStore.vehicleReport(id_bien_registro)
    }
    if(bien == 'DINERO Y VALORES'){
      // router.push({ name: 'moneyValues', params: { id_bien, id_bien_registro } })
      await moneyValuesStore.moneyValueReport(id_bien_registro)
    }
    if(bien == 'AERONAVES'){
      await aircraftStore.aircraftReport(id_bien_registro)
    }
    if(bien == 'SUSTANCIAS CONTROLADAS'){
      await controlledSubstanceStore.controlledSubstanceReport(id_bien_registro)
    }
    if(bien == 'SEMOVIENTES'){
      await selfMovingStore.selfMovingReport(id_bien_registro)
    }
    if(bien == 'JOYAS'){
      await jewelStore.jewelReport(id_bien_registro)
    }
    if(bien == 'OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS'){
      await artworkStore.artworkReport(id_bien_registro)
    }
    if(bien == 'CONSUMIBLES'){
      await consumableStore.consumableReport(id_bien_registro)
    }
    if(bien == 'OTROS BIENES'){
      await otherProperyStore.otherPropertyReport(id_bien_registro)
    }
    if(bien == 'EMBARCACIONES'){
      await boatStore.boatReport(id_bien_registro)
    }
    if(bien == 'EQUIPOS ELECTRONICOS'){
      await electronicStore.electronicReport(id_bien_registro)
    }
  }

  const getDescriptionProperty = (id:number) => {
    const response: any = tipoBien.value.find( (val:any) => val.id === id)
    return response?.nombre_bien
  }

  // REGISTRAR LOGISTICA DE RECEPCION DE BIENES DEL CASO
  const receptionLogistics = (id_caso: number, id_recepcion_documental: number) =>{
    // router.push({ name: 'receptionLogistics', params: { id_caso: id_caso, id_recepcion_documental: id_recepcion_documental }})
    router.push({ name: 'receptionLogisticsForm', params: { id_caso: id_caso, id_recepcion_documental: id_recepcion_documental }})
  }

  // LIMPIEZA DEL FORMULARIO
  const clearProperty = () => {
    bien.bienData.id_bien = ''
    bien.bienData.jurisdiccion = ''
    bien.bienData.caracteristicas = ''
    bien.bienData.observaciones = ''
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  onMounted(async () => {
    await getResourcesList()
    await getInstancePropertiesById(route.params.id)
    await getInstanceDocumentaryReceptionById(route.params.id)
  })
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
     
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" rounded="md" class="bg-lightprimary border-0">
        <div class="pa-3 text-justify">
          <p class="text-h5"><span class="font-weight-bold text-primary">CASO FELCN/FELCC:</span> {{ caso.numero_caso_felcn_felcc }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">NOMBRE CLAVE:</span> {{ caso.nombre_clave_caso }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">JURISDICCIÓN DEL CASO:</span> {{ caso.jurisdiccion_caso }}</p>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <h4 class="mb-5 mt-2 font-weight-light" v-if="userProfile == 'SUPERADMIN' || userProfile.includes('JURIDICO') || userProfile == 'MULTIPLE'">
    <strong> DATOS DEL BIEN:</strong> Los campos con <span style="color:red">*</span> son obligatorios
  </h4>

  <v-row v-if="userProfile == 'SUPERADMIN' || userProfile.includes('JURIDICO') || userProfile == 'MULTIPLE'">
    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">Tipo de Bien<span style="color:red">*</span>
      </v-label>
      <v-select
        :items="tipoBien"
        item-title="nombre_bien"
        item-value="id"
        no-data-text="No existe más opciones para seleccionar"
        v-model="bien.bienData.id_bien"
        :error="v$.bienData.id_bien.$error"
        :error-messages="errors.id_bien"
        clearable
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">Jurisdicción<span style="color:red">*</span>
      </v-label>
      <v-select
        :items="jurisdicciones"
        item-title="departamento"
        item-value="departamento"
        no-data-text="No existe más opciones para seleccionar"
        v-model="bien.bienData.jurisdiccion"
        :error="v$.bienData.jurisdiccion.$error"
        :error-messages="errors.jurisdiccion"
        clearable
      />
    </v-col>

    <v-col cols="12" md="12">
      <v-label class="mb-2 font-weight-medium">Caracteristicas del Bien<span style="color:red">*</span>
      </v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model="bien.bienData.caracteristicas"
        @input="bien.bienData.caracteristicas = validateText(bien.bienData.caracteristicas.toUpperCase())"
        :error="v$.bienData.caracteristicas.$error"
        :error-messages="errors.caracteristicas"
      >
      </v-textarea>
      <!-- <template v-for="error of v$.bienData.caracteristicas.$errors" :key="error.$uid">
        <span class="text-danger" v-if="error.$validator == 'required'">caracteristica requerida</span>
      </template> -->
    </v-col>

    <v-col cols="12" md="12">
      <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model="bien.bienData.observaciones"
        @input="bien.bienData.observaciones = validateText(bien.bienData.observaciones.toUpperCase())"
      >
        <template v-slot:append>
          <template v-if="!isLoading">
            <v-btn
              color="primary"
              @click="buttonAddProperty()"
            >
              <PlusIcon/>Agregar Bien
            </v-btn>
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
          
        </template>
      </v-textarea>
    </v-col>
  </v-row>

  <h5 class="mb-5 mt-2 text-error" v-if="state.formData.bienes.length > 0">
    <strong>BIENES REGISTRADOS EN CASO</strong>
  </h5>

  <v-row class="mb-5">
    <v-col v-if="state.formData.bienes.length > 0" cols="12" md="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-center">Acción</th>
            <th class="text-center">Tipo Bien</th>
            <th class="text-center">Jurisdicción</th>
            <th class="text-center">Descripción</th>
            <th class="text-center">Observación</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in state.formData.bienes"
            :key="index"
          >
            <td class="text-center" nowrap>
              <button v-if="userProfile == 'SUPERADMIN'" title="Eliminar bien">
                <TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteProperty(item.id)"/>
              </button>
              <button v-if="(userProfile == 'SUPERADMIN' || userProfile.includes('INSPECTOR') || userProfile == 'MULTIPLE') && item.habilitado" title="Informacion del bien">
                <PencilIcon style="color: blue; cursor: pointer;" @click="buttonPropertyInformation(id_caso, item.id_bien, item.id)"/>
              </button>

              <button v-if="(userProfile == 'SUPERADMIN' || userProfile.includes('INSPECTOR') || userProfile == 'MULTIPLE') && item.inventario" title="Reporte inventario del bien">
                <FileDescriptionIcon style="color: black; cursor: pointer;" @click="buttonPropertyReport(item.id_bien, item.id)"/>
              </button>
              <button v-if="userProfile == 'SUPERADMIN' || userProfile.includes('JURIDICO') || userProfile == 'MULTIPLE'" title="Revisión documental">
                <FileUploadIcon style="color: blueviolet; cursor: pointer;" @click="documentaryReviewForm(item.id_bien, id_caso, item.id)"/>
              </button>
            </td>
            <td class="text-center">{{ getDescriptionProperty(item.id_bien) }}</td>
            <td class="text-center">{{ item.jurisdiccion }}</td>
            <td class="text-center">{{ item.caracteristicas }}</td>
            <td class="text-center">{{ item.observaciones }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>

  <h5 class="mb-5 mt-5 text-error" v-if="recepciones.length > 0">
    <strong>RECEPCIONES DOCUMENTALES DE CASO</strong>
  </h5>

  <v-row>
    <v-col  v-if="recepciones.length > 0" cols="12" md="12">
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-center">Acción</th>
            <th class="text-center">Cite</th>
            <!-- <th class="text-center">Fecha revision</th>
            <th class="text-center">Estado</th> -->
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in recepciones"
            :key="index"
          >
            <td class="text-center">
              <button v-if="userProfile == 'SUPERADMIN' || userProfile.includes('JURIDICO') || userProfile == 'MULTIPLE'" title="Reporte revisión documental">
                <ReportIcon style="color: blue; cursor: pointer;" @click="buttonReviewReport(item.id_caso, item.id_recepcion_documental)"/>
              </button>

              <button v-if="userProfile == 'SUPERADMIN' || userProfile.includes('INSPECTOR') || userProfile == 'MULTIPLE'" title="Establecer logística de recepcion">
                <MapPinIcon style="color: #FA896A; cursor: pointer;" @click="receptionLogistics(item.id_caso, item.id_recepcion_documental)"/>
              </button>
            </td>
            <td class="text-center">{{ item.cite }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>

  <p class="text-lg-right pt-3">
    <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
  </p>
</template>