<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { validateText } from '@/utils/helpers/validateText'
import { router } from '@/router';
import { useResourceStore } from '@/stores/resource'
import { useExploreStore } from '@/stores/explore'
import { useVehicleStore } from '@/stores/resources/vehicle'
import { useImmovablePropertyStore } from '@/stores/moduleOne/immovableProperty'
import { useAircraftStore } from '@/stores/moduleOne/aircraft'
import { useMoneyValuesStore } from '@/stores/resources/moneyValues'
import { useBoatStore } from '@/stores/moduleOne/boat'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'

  const resourceStore = useResourceStore()
  const exploreStore = useExploreStore()
  const vehicleStore = useVehicleStore()
  const aircraftStore = useAircraftStore()
  const moneyValuesStore = useMoneyValuesStore()
  const immovablePropertyStore = useImmovablePropertyStore()
  const boatStore = useBoatStore()

  const page = ref({ title: 'Búsqueda' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Tipo de bien',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      tipo_bien: '',
      caracteristica: '',
      valor: '',
    }
  });

  const isLoadingFirst = ref(false)
  const submitButton = ref(false)
  const sendForm = ref(false)

  const numeroPagina = ref(1)
  const elementosPorPagina = ref(10)
  const totalPaginas = ref(1)
  const cantidad = ref([
    { value: 5 },
    { value: 10 },
    { value: 30 },
    { value: 50 },
    { value: 100 },
  ]);

  const lista_coincidencias = ref([]) as any
  const lista_total = ref([]) as any
  const getCoincidences = async () => {
    lista_coincidencias.value = await exploreStore.searchByType(state.formData)
    // console.log('resultado:',lista_coincidencias.value);
    lista_total.value = lista_coincidencias.value
    totalPaginas.value = Math.ceil(lista_coincidencias.value.length / elementosPorPagina.value)

    const mensaje = lista_coincidencias.value.length == 0 ? 'No se encontraron registros' : 'Registros encontrados'
    const icono = lista_coincidencias.value.length == 0 ? 'error' : 'success'
    Toast.fire({ icon: icono, title: mensaje })
  }

  const datosPaginados = ref([]) as any
  const getCoincidencesPage = async (numeroPagina: number) => {
    datosPaginados.value = []
    let inicio = (numeroPagina * elementosPorPagina.value) - elementosPorPagina.value
    let fin = (numeroPagina * elementosPorPagina.value)
    datosPaginados.value =  lista_coincidencias.value.slice(inicio, fin)
  }

  const changeElementsPerPage = async (cantidad: any) => {
    if(state.formData.tipo_bien != '' && state.formData.caracteristica != '' && state.formData.valor != ''){
      lista_total.value = lista_coincidencias.value
      totalPaginas.value = Math.ceil(lista_coincidencias.value.length / elementosPorPagina.value)
      await getCoincidencesPage(1)
    }
  }

  // LISTA DE BIENES
  const bienes = ref([]) as any
  const getPropertiesList = async () => {
    bienes.value = await resourceStore.getProperties()
    bienes.value = bienes.value.filter( (bien: any) => bien.nombre_bien != 'CONSUMIBLES' )
    bienes.value = bienes.value.filter( (bien: any) => bien.nombre_bien != 'EQUIPOS ELECTRONICOS' )
    bienes.value = bienes.value.filter( (bien: any) => bien.nombre_bien != 'JOYAS' )
    bienes.value = bienes.value.filter( (bien: any) => bien.nombre_bien != 'OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS' )
    bienes.value = bienes.value.filter( (bien: any) => bien.nombre_bien != 'OTROS BIENES' )
    bienes.value = bienes.value.filter( (bien: any) => bien.nombre_bien != 'SEMOVIENTES' )
    bienes.value = bienes.value.filter( (bien: any) => bien.nombre_bien != 'SUSTANCIAS CONTROLADAS' )
  }

  const caracteristicas = ref([]) as any
  const getCharacteristics = async () => {
    caracteristicas.value = []
    datosPaginados.value = []
    state.formData.caracteristica = ''
    state.formData.valor = ''
    if(!state.formData.tipo_bien) return

    let array_caracteristicas = [] as any
    const bien = bienes.value.find(
      (registro: any) => registro.id == state.formData.tipo_bien
    )
    switch(bien.nombre_bien) {
      case 'VEHICULOS':
        array_caracteristicas = [
          { caracteristica: 'placa_control', titulo: 'PLACA DE CONTROL' },
          { caracteristica: 'numero_chasis_vin', titulo: 'NÚMERO DE CHASIS' },
          { caracteristica: 'numero_motor', titulo: 'NÚMERO DE MOTOR' },
        ]
        break
      case 'INMUEBLES':
        array_caracteristicas = [
          { caracteristica: 'numero_folio_partida_matricula', titulo: 'NÚMERO DE FOLIO/PARTIDA/MATRÍCULA' },
          { caracteristica: 'ciudad', titulo: 'CIUDAD' },
          { caracteristica: 'direccion', titulo: 'DIRECCIÓN' },
        ]
        break
      case 'AERONAVES':
        array_caracteristicas = [
          { caracteristica: 'numero_serie', titulo: 'NÚMERO DE SERIE' },
          { caracteristica: 'matricula', titulo: 'MATRÍCULA' },
          { caracteristica: 'tipo_aeronave', titulo: 'TIPO DE AERONAVE' },
          { caracteristica: 'fabricante', titulo: 'FABRICANTE' },
          { caracteristica: 'categoria', titulo: 'CATEGORÍA' },
          { caracteristica: 'modelo', titulo: 'MODELO' },
        ]
        break
      case 'DINERO Y VALORES':
        array_caracteristicas = [
          { caracteristica: 'numero_boleta', titulo: 'NÚMERO DE BOLETA' },
          { caracteristica: 'numero_cuenta', titulo: 'NÚMERO DE CUENTA' },
          { caracteristica: 'nombre_entidad', titulo: 'NOMBRE DE ENTIDAD' },
          { caracteristica: 'nombre_depositante', titulo: 'NOMBRE DEPOSITANTE' },
        ]
        break
      case 'EMBARCACIONES':
        array_caracteristicas = [
          { caracteristica: 'fabricante', titulo: 'FABRICANTE' },
          { caracteristica: 'modelo', titulo: 'MODELO' },
          { caracteristica: 'numero_serie', titulo: 'NÚMERO DE SERIE' },
          { caracteristica: 'matricula', titulo: 'MATRÍCULA' },
          { caracteristica: 'color', titulo: 'COLOR' },
        ]
        break
    }
    caracteristicas.value = array_caracteristicas
  }

  const buttonKardexReport = async (nombre_bien:any, id_bien_registro: any) => {
    switch (nombre_bien) {
      case 'VEHICULOS':
        await vehicleStore.kardexVehicleReport(id_bien_registro)
        break
      case 'INMUEBLES':
        await immovablePropertyStore.kardexImmovablePropertyReport(id_bien_registro)
        break
      case 'AERONAVES':
        await aircraftStore.kardexAircraftReport(id_bien_registro)
        break
      case 'DINERO Y VALORES':
        await moneyValuesStore.kardexMoneyValueReport(id_bien_registro)
        break
      case 'EMBARCACIONES':
        await boatStore.kardexBoatReport(id_bien_registro)
        break
    }
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })

  const buttonSearch = async () => {
    submitButton.value = true
    await validateForm()
    if(!sendForm.value) return
    
    await getCoincidences()
    await getCoincidencesPage(1)
  }

  const validateForm = async () => {
    sendForm.value = true
    if(!state.formData.tipo_bien || !state.formData.caracteristica || !state.formData.valor){
      sendForm.value = false
    }
  }

  onMounted(async () => {
    await getPropertiesList()
  });

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Tipo de Bien</v-label>
      <v-select
        v-model="state.formData.tipo_bien"
        :items="bienes"
        item-title="nombre_bien"
        item-value="id"
        color="primary"
        variant="outlined"
        hide-details
        clearable
        @update:model-value="getCharacteristics()"
      />
      <template v-if="submitButton && !state.formData.tipo_bien">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Característica</v-label>
      <v-select
        v-model="state.formData.caracteristica"
        :items="caracteristicas"
        no-data-text="Sin registros para seleccionar"
        item-title="titulo"
        item-value="caracteristica"
        color="primary"
        variant="outlined"
        hide-details
        clearable
        @update:model-value="state.formData.valor = ''"
      />
      <template v-if="submitButton && !state.formData.caracteristica">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Valor</v-label>
      <v-text-field
        v-model.trim="state.formData.valor"
        @input="state.formData.valor = validateText(state.formData.valor.toUpperCase())"
        :disabled="!state.formData.tipo_bien || !state.formData.caracteristica"
        color="primary"
        variant="outlined"
        type="text"
        hide-details
      >
      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <template v-if="!isLoadingFirst">
              <v-btn 
                v-bind="props"
                color="primary"
                :disabled="!state.formData.tipo_bien || !state.formData.caracteristica || !state.formData.valor"
                @click="buttonSearch()"
              >
                <SearchIcon class="mr-2" />
                <span >Buscar</span>
              </v-btn>
            </template>
            <template v-else>
              <v-btn color="primary" class="mr-3" disabled>
                <v-progress-circular
                  indeterminate
                  color="white"
                  class="mr-2"
                ></v-progress-circular>
                Buscando...
              </v-btn>
            </template>
          </template>
        </v-menu>
      </template>
      </v-text-field>
      <template v-if="submitButton && !state.formData.valor">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card class="border" elevation="10">
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-h6"></th>
              <th class="text-h6 text-center">Caso</th>
              <th class="text-h6 text-center">Tipo</th>
              <th class="text-h6 text-center">Jurisdicción del bien</th>
              <th class="text-h6 text-center">Características</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="datosPaginados.length == 0">
              <tr>
                <td colspan="5" class="text-center">SIN REGISTROS</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="item in datosPaginados" :key="item.id" class="month-item">
                <td>
                  <div class="text-center">
                    <v-btn
                      class="mr-1"
                      size="x-small"
                      title="Kardex del bien"
                      height="25"
                      width="25"
                      color="white"
                      @click="buttonKardexReport(item.tipo_bien, item.id_bien_registro)"
                    >
                      <ReportIcon style="cursor: pointer;"/>
                    </v-btn>
                  </div>
                </td>
                <td>
                  <h6 class="text-h6 text-center">{{ item.caso }}</h6>
                </td>
                <td>
                  <h6 class="text-h6 text-center">{{ item.tipo_bien }}</h6>
                </td>
                <td>
                  <h6 class="text-h6 text-center">{{ item.jurisdiccion_bien }}</h6>
                </td>
                <td>
                  <template v-if="item.tipo_bien == 'VEHICULOS'">
                    <v-chip rounded="md" class="font-weight-bold" color="primary" size="small" label>
                      <h6 class="text-h6">{{ item.clase }} {{ item.marca }} {{ item.modelo }}</h6>
                    </v-chip>
                    <br/>
                    <div class="pl-3">
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">PLACA: </span>{{ item.placa_control }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">CHASIS: </span>{{ item.numero_chasis_vin }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">MOTOR: </span>{{ item.numero_motor }}</h6>
                    </div>
                  </template>
                  <template v-if="item.tipo_bien == 'INMUEBLES'">
                    <v-chip rounded="md" class="font-weight-bold" color="primary" size="small" label>
                      <h6 class="text-h6">{{ item.nombre_inmueble }} - Folio/Matricula: {{ item.numero_folio_partida_matricula }}</h6>
                    </v-chip>
                    <br/>
                    <div class="pl-3">
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">CIUDAD: </span>{{ item.ciudad }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">DISTRITO: </span>{{ item.distrito }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">DIRECCIÓN: </span>{{ item.zona }} ; {{ item.calle_avenida }} ; {{ item.barrio }} ; Nro: {{ item.numero_puerta }}</h6>
                    </div>
                  </template>
                  <template v-if="item.tipo_bien == 'AERONAVES'">
                    <v-chip rounded="md" class="font-weight-bold" color="primary" size="small" label>
                      <h6 class="text-h6">{{ item.fabricante }} {{ item.modelo }}</h6>
                    </v-chip>
                    <br/>
                    <div class="pl-3">
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">MATRÍCULA: </span>{{ item.matricula }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">NUM. SERIE: </span>{{ item.numero_serie }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">OBS: </span>{{ item.observaciones }}</h6>
                    </div>
                  </template>
                  <template v-if="item.tipo_bien == 'DINERO Y VALORES'">
                    <v-chip rounded="md" class="font-weight-bold" color="primary" size="small" label>
                      <h6 class="text-h6">DEPOSITANTE: {{ item.nombre_depositante }}</h6>
                    </v-chip>
                    <br/>
                    <div class="pl-3">
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">NUM. BOLETA: </span>{{ item.numero_boleta }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">NUM. CUENTA: </span>{{ item.numero_cuenta }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">MONTO SECUESTRADO: </span>{{ item.monto_secuestrado }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">MONTO DEPOSITADO: </span>{{ item.monto_depositado }}</h6>
                    </div>
                  </template>
                  <template v-if="item.tipo_bien == 'EMBARCACIONES'">
                    <v-chip rounded="md" class="font-weight-bold" color="primary" size="small" label>
                      <h6 class="text-h6">{{ item.nombre_embarcacion }} {{ item.nombre_categoria }}</h6>
                    </v-chip>
                    <br/>
                    <div class="pl-3">
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">MODELO: </span>{{ item.modelo }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">MATRÍCULA: </span>{{ item.matricula }}</h6>
                      <h6 class="text-h6 text-subtitle-1 "><span class="text-primary">NUM. SERIE: </span>{{ item.numero_serie }}</h6>
                    </div>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

  <div class="text-center mt-5">
    <v-select
      v-model="elementosPorPagina"
      :items="cantidad"
      item-title="value"
      item-value="value"
      label="Mostrando"
      hint="registros"
      persistent-hint
      color="primary"
      variant="outlined"
      style="width: 100px;"
      @update:modelValue="changeElementsPerPage(elementosPorPagina)"
    ></v-select>
    <v-pagination
      v-model="numeroPagina"
      :length="totalPaginas"
      :total-visible="5"
      @click="getCoincidencesPage(numeroPagina)"
    ></v-pagination>
  </div>

</template>
