<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { SearchIcon, ReportIcon } from 'vue-tabler-icons';
import { validateText } from '@/utils/helpers/validateText'
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource'
import { useAdministrativeExpenseStore } from '@/stores/moduleTwo/administrativeExpense'

  const route = useRoute()
  const resourceStore = useResourceStore()
  const administrativeExpenseStore = useAdministrativeExpenseStore()

  const modalExpense = ref(false)
  const sendFormExpense = ref(false)
  const submitButtonExpense = ref(false)

  // BREADCRUMB  
  const page = ref({ title: 'Gasto administrativo del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Listado de gastos administrativos',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      // SOLO INFORMATIVO
      nombre_bien: '',
      jurisdiccion_bien: '',
      caracteristicas: '',
      observaciones: '',

      // PARA MODAL DE REGISTRO NUEVO
      id: '',
      id_bien_registro: Number(route.params.id_bien_registro),
      id_gasto_via: '',
      id_gasto_servicio: '',
      id_gasto_comprobante: '',
      numero_comprobante: '',
      importe_numeral: '',
      importe_literal: '',
      descripcion: '',
      fecha_gasto: '',
    }
  });

  const lista_vias = ref([])
  const getSpendingAvenuesList = async () => {
    lista_vias.value = await resourceStore.getSpendingAvenues()
  }

  const lista_servicios = ref([])
  const getServicesList = async () => {
    lista_servicios.value = await resourceStore.getServices()
  }

  const lista_comprobantes = ref([])
  const getVouchersList = async () => {
    lista_comprobantes.value = await resourceStore.getVouchers()
  }

  const lista_documentos = ref([])
  const getExpenseDocumentsList = async () => {
    lista_documentos.value = await resourceStore.getExpenseDocuments()
  }

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const lista_gastos = ref([]) as any
  const total_gasto = ref(0)
  const getAdministrativeExpenseById = async (id: any) => {
    // DATOS DEL BIEN
    const caracteristica = await resourceStore.getPropertyCharacteristic(id)
    state.formData.nombre_bien = caracteristica.nombre_bien
    state.formData.jurisdiccion_bien = caracteristica.jurisdiccion
    state.formData.caracteristicas = caracteristica.caracteristicas
    state.formData.observaciones = caracteristica.observaciones

    // AQUI LLAMAMOS AL LISTADO DE GASTOS ADMINISTRATIVOS
    lista_gastos.value = await administrativeExpenseStore.administrativeExpenses(id)
    for (let i = 0; i < lista_gastos.value.length; i++) {
      const registro = lista_gastos.value[i]
      total_gasto.value = Number(total_gasto.value) + Number(registro.importe_numeral)
    }

  }

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'administrativeExpenseList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    submitButtonExpense.value = true
    await validateExpense()
    if(!sendFormExpense.value) return
    
    const { ok, message } = await administrativeExpenseStore.createAdministrativeExpense(state.formData)
    if(ok){
      Toast.fire({ icon: 'success', title: message })
    }else{
      Toast.fire({ icon: 'error', title: message })
    }
    getAdministrativeExpenseById(route.params.id_bien_registro)
    await resetFormExpense()
    modalExpense.value = false
  }

  const buttonDownloadReport = async () => {
    await administrativeExpenseStore.reportAdministrativeExpense(route.params.id_bien_registro)
  }

  onMounted(() => {
    getSpendingAvenuesList()
    getServicesList()
    getVouchersList()
    getExpenseDocumentsList()
    getAdministrativeExpenseById(route.params.id_bien_registro)
  })

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  })

  const resetFormExpense = async () => {
    submitButtonExpense.value = false
    state.formData.id_gasto_comprobante = ''
    state.formData.id_gasto_via = ''
    state.formData.id_gasto_servicio = ''
    state.formData.numero_comprobante = ''
    state.formData.importe_numeral = ''
    state.formData.descripcion = ''
    state.formData.fecha_gasto = ''
  }

  const validateExpense = async () => {
    sendFormExpense.value = true
    if(!state.formData.id_gasto_via ||
      !state.formData.id_gasto_servicio ||
      !state.formData.id_gasto_comprobante ||
      !state.formData.numero_comprobante ||
      !state.formData.importe_numeral ||
      !state.formData.descripcion || 
      !state.formData.fecha_gasto){
        sendFormExpense.value = false
    }
  }

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-row>
    <v-col cols="12">
      <v-card elevation="0" rounded="md" class="bg-lightprimary border-0">
        <div class="pa-3 text-justify">
          <p class="text-h5"><span class="font-weight-bold text-primary">TIPO DE BIEN:</span> {{ state.formData.nombre_bien }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">JURISDICCIÓN:</span> {{ state.formData.jurisdiccion_bien }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">CARACTERÍSTICAS:</span> {{ state.formData.caracteristicas }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">OBSERVACIONES:</span> {{ state.formData.observaciones }}</p>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="py-2">
    <v-col cols="12">
      <v-btn class="size_fijo" size="small" color="primary" @click="modalExpense = true">
        <CirclePlusIcon style="cursor: pointer;" class="mr-1"></CirclePlusIcon>Nuevo registro
      </v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card elevation="0" class="border">
        <v-table>
          <thead>
            <tr class="bg-primary">
              <th class="text-h6 text-center"></th>
              <th class="text-h6 text-center">VIA DE GASTO</th>
              <th class="text-h6 text-center">PARTIDA</th>
              <th class="text-h6 text-center">SERVICIO</th>
              <th class="text-h6 text-center">TIPO COMPROBANTE</th>
              <th class="text-h6 text-center">NÚMERO DE COMPROBANTE</th>
              <th class="text-h6 text-center">DESCRIPCIÓN</th>
              <th class="text-h6 text-center py-2">FECHA DE GASTO</th>
              <th class="text-h6 text-center">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="lista_gastos.length == 0">
              <tr>
                <td class="text-h6 text-center" colspan="9">SIN REGISTROS</td>
              </tr>
            </template>
            <template v-for="(item, index) in lista_gastos" :key="index">
              <tr>
                <td class="text-center">
                  <v-item-group class="d-flex justify-sm-space-between px-2">
                    <v-item>
                      <v-btn
                        class="mr-1"
                        size="x-small"
                        height="25"
                        width="25"
                      >
                      <!-- @click="buttonDetail(item.id_bien_registro)" -->
                        <EditIcon style="color: #5D87FF;"/>
                        <v-tooltip activator="parent" location="top">Editar registro</v-tooltip>
                      </v-btn>
                      <v-btn
                        class="mr-1"
                        size="x-small"
                        height="25"
                        width="25"
                      >
                        <FileUploadIcon style="color: #49BEFF;"/>
                        <v-tooltip activator="parent" location="top">Subir documentación</v-tooltip>
                      </v-btn>
                      <v-btn
                        class="mr-1"
                        size="x-small"
                        height="25"
                        width="25"
                      >
                        <TrashIcon style="color: #FA896B;"/>
                        <v-tooltip activator="parent" location="top">Eliminar registro</v-tooltip>
                      </v-btn>
                    </v-item>
                  </v-item-group>
                </td>
                <td class="text-center">{{ item.nombre_via }}</td>
                <td class="text-center">{{ item.partida }}</td>
                <td class="text-center">{{ item.servicio }}</td>
                <td class="text-center">{{ item.nombre_comprobante }}</td>
                <td class="text-center">{{ item.numero_comprobante }}</td>
                <td class="text-center">{{ item.descripcion }}</td>
                <td class="text-center">{{ item.fecha_gasto }}</td>
                <td class="text-center">{{ item.importe_numeral }}</td>
              </tr>
            </template>
            <template v-if="lista_gastos.length != 0">
              <tr>
                <td colspan="8" class="text-h6 text-right bg-primary">TOTAL</td>
                <td class="text-center">{{ total_gasto }}</td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" class="text-lg-right pt-10">
      <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
      <v-btn color="primary" class="mr-3" @click="buttonDownloadReport()">Reporte</v-btn>
    </v-col>
  </v-row>

  <div class="text-center">
    <v-dialog v-model="modalExpense" persistent class="dialog-mw">
      
      <v-card class="overflow-auto">
        <v-container>
          <v-card-title class="pa-5">
            <span class="text-h5">Agregar Gasto Administrativo</span>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Via de gasto</v-label>
                <v-select
                  :items="lista_vias"
                  item-title="nombre_via"
                  item-value="id"
                  no-data-text="No existe más opciones para seleccionar"
                  v-model="state.formData.id_gasto_via"
                  clearable
                  hide-details
                />
                <template v-if="submitButtonExpense && !state.formData.id_gasto_via">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Partida</v-label>
                <v-select
                  :items="lista_servicios"
                  item-title="partida"
                  item-value="id"
                  no-data-text="No existe más opciones para seleccionar"
                  v-model="state.formData.id_gasto_servicio"
                  clearable
                  hide-details
                />
                <template v-if="submitButtonExpense && !state.formData.id_gasto_servicio">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Servicio</v-label>
                <v-select
                  :items="lista_servicios"
                  item-title="servicio"
                  item-value="id"
                  no-data-text="No existe más opciones para seleccionar"
                  v-model="state.formData.id_gasto_servicio"
                  clearable
                  hide-details
                />
                <template v-if="submitButtonExpense && !state.formData.id_gasto_servicio">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Comprobante</v-label>
                <v-select
                  :items="lista_comprobantes"
                  item-title="nombre_comprobante"
                  item-value="id"
                  no-data-text="No existe más opciones para seleccionar"
                  v-model="state.formData.id_gasto_comprobante"
                  clearable
                  hide-details
                />
                <template v-if="submitButtonExpense && !state.formData.id_gasto_comprobante">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Número de Comprobante</v-label>
                <v-text-field
                  v-model.trim="state.formData.numero_comprobante"
                  color="primary"
                  variant="outlined"
                  type="text"
                  hide-details
                  @input="state.formData.numero_comprobante = validateText(state.formData.numero_comprobante.toUpperCase())"
                >
                </v-text-field>
                <template v-if="submitButtonExpense && !state.formData.numero_comprobante">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Importe</v-label>
                <v-text-field
                  v-model.trim="state.formData.importe_numeral"
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  hide-details
                  @input="state.formData.importe_numeral = Number(state.formData.importe_numeral)<0 ? '0' : state.formData.importe_numeral"
                >
                </v-text-field>
                <template v-if="submitButtonExpense && !state.formData.importe_numeral">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Descripción</v-label>
                <v-text-field
                  v-model.trim="state.formData.descripcion"
                  color="primary"
                  variant="outlined"
                  type="text"
                  hide-details
                  @input="state.formData.descripcion = validateText(state.formData.descripcion.toUpperCase())"
                >
                </v-text-field>
                <template v-if="submitButtonExpense && !state.formData.descripcion">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Fecha de gasto</v-label>
                <v-text-field
                  v-model.trim="state.formData.fecha_gasto"
                  color="primary"
                  variant="outlined"
                  type="date"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButtonExpense && !state.formData.fecha_gasto">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              variant="outlined"
              width="100"
              @click="modalExpense = false, resetFormExpense()"
            >
              Cerrar
            </v-btn>
            <v-btn
              color="primary"
              variant="outlined"
              width="100"
              @click="buttonSendForm()"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>

    </v-dialog>
  </div>
</template>