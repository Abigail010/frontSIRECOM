<script setup lang="ts">
import { ref, reactive } from 'vue';
import { validateText } from '@/utils/helpers/validateText'
import { router } from '@/router';
import { SearchIcon, ReportIcon } from 'vue-tabler-icons';
import { useResourceStore } from '@/stores/resource';
import { useAdministrativeExpenseStore } from '@/stores/moduleTwo/administrativeExpense'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'

  const administrativeExpenseStore = useAdministrativeExpenseStore()

  const page = ref({ title: 'Gastos Administrativos' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Listado de Bienes',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      numero_caso_felcn_felcc: '',
    }
  });

  const isLoading = ref(false)
  const submitButton = ref(false)
  const sendForm = ref(false)

  const numeroPagina = ref(1)
  const elementosPorPagina = ref(5)
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
    lista_coincidencias.value = await administrativeExpenseStore.searchAdministrativeExpense(state.formData)
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
    if(state.formData.numero_caso_felcn_felcc != ''){
      lista_total.value = lista_coincidencias.value
      totalPaginas.value = Math.ceil(lista_coincidencias.value.length / elementosPorPagina.value)
      await getCoincidencesPage(1)
    }
  }

  const buttonDetail = async (id_bien_registro: any) => {
    router.push({ name: 'administrativeExpenseForm', params: { id_bien_registro: id_bien_registro }})
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
    if(!state.formData.numero_caso_felcn_felcc){
      sendForm.value = false
    }
  }
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"/>
  <v-row>
    <v-col cols="12">
      <v-label class="mb-2 font-weight-medium">Número Caso FELCN/FELCC</v-label>
      <v-text-field
        v-model.trim="state.formData.numero_caso_felcn_felcc"
        @input="state.formData.numero_caso_felcn_felcc = validateText(state.formData.numero_caso_felcn_felcc.toUpperCase())"
        color="primary"
        variant="outlined"
        type="text"
        hide-details
      >
      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <template v-if="!isLoading">
              <v-btn 
                v-bind="props"
                color="primary"
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
      <template v-if="submitButton && !state.formData.numero_caso_felcn_felcc">
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
              <th class="text-h6 text-center">Número caso FELCN/FELCC</th>
              <th class="text-h6 text-center">Nombre del caso</th>
              <th class="text-h6 text-center">Jurisdicción del bien</th>
              <th class="text-h6 text-center">Tipo de bien</th>
              <th class="text-h6 text-center">Características</th>
              <th class="text-h6 text-center">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="datosPaginados.length == 0">
              <tr>
                <td colspan="6" class="text-center">SIN REGISTROS</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="item in datosPaginados" :key="item.id" class="month-item">
                <td>
                  <div class="text-center">
                    <v-btn
                      class="mr-1"
                      size="x-small"
                      title="Detalle del bien"
                      height="25"
                      width="25"
                      color="white"
                      @click="buttonDetail(item.id_bien_registro)"
                    >
                      <ReportIcon/>
                    </v-btn>
                  </div>
                </td>
                <td>
                  <h6 class="text-h6 text-center">{{ item.numero_caso_felcn_felcc }}</h6>
                </td>
                <td>
                  <h6 class="text-h6 text-center">{{ item.nombre_clave_caso }}</h6>
                </td>
                <td>
                  <h6 class="text-h6 text-center">{{ item.jurisdiccion_bien }}</h6>
                </td>
                <td>
                  <h6 class="text-h6 text-center">{{ item.nombre_bien }}</h6>
                </td>
                <td>
                  <v-chip rounded="md" class="font-weight-bold" color="primary" size="small" label>
                    <h6 class="text-h6">{{ item.caracteristicas }}</h6>
                  </v-chip>
                </td>
                <td>
                  <template v-if="item.observaciones">
                    <v-chip rounded="md" class="font-weight-bold" color="primary" size="small" label>
                      <h6 class="text-h6">{{ item.observaciones }}</h6>
                    </v-chip>
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