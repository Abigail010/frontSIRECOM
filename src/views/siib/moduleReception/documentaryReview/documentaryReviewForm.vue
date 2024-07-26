<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { CircleCheckIcon } from 'vue-tabler-icons';
import { useInstanceStore } from '@/stores/moduleOne/instance';
import { useResourceStore } from '@/stores/resource';
import { useDocumentaryReviewStore } from '@/stores/moduleOne/documentaryReview';
import { format } from 'date-fns'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import viewPdf from '../../resources/viewPdf.vue';
// import viewPdf from '';
  const instanceStore = useInstanceStore()
  const resourceStore = useResourceStore()
  const documentaryReviewStore = useDocumentaryReviewStore()

  const route = useRoute()
  const page = ref({ title: 'Revisión Documental' });

  const id_bien = ref(Number(route.params.id_bien))
  const id_caso = Number(route.params.id_caso)
  const id_bien_registro = ref(Number(route.params.id_bien_registro))
  const caso = ref({}) as any
  const bien = ref({}) as any

  const enable_ejecutoriada = ref(true)
  const submitButton = ref(false)
  const sendForm = ref(true)
  const isLoading = ref(false)
  const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil

  const currentDate = format(new Date(),"yyyy-MM-dd");
  const id_file = ref<any>('');
  const dialog = ref<boolean>(false);

  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Revisión Documental',
      disabled: true,
      href: '#'
    }
  ]);

  const state = reactive({
    formData: {
      id_caso: route.params.id_caso,
      id_bien: route.params.id_bien,
      id_bien_registro: route.params.id_bien_registro,
      id_recepcion_documental: '',
      requerimientos: [] as any,
    } as any,
  });

  const revisiones_aprobadas = ref([]) as any
  // OBTENEMOS EL LISTADO DE REVISIONES DOCUMENTALES 
  const lista_revisiones = ref([]) as any
  const getDocumentaryReviewsByPropertyIdList = async() => {
    lista_revisiones.value = await documentaryReviewStore.getDocumentaryReviewsByPropertyId(id_bien_registro.value)
    // BUSQUEDA DE REQUERIMIENTOS APROBADOS
    revisiones_aprobadas.value = lista_revisiones.value.filter(
      (revision:any) => revision.estado_documento == 'APROBADO'
    )
  }

  // OBTENEMOS EL LISTADO DE RECEPCIONES DOCUMENTALES
  const lista_recepciones = ref([]) as any
  const getDocumentaryReceptionsByCase = async() => {
    lista_recepciones.value = await resourceStore.getReceptionsForReview(id_caso, id_bien_registro.value)
  }

  const lista_acreditaciones = ref([]) as any
  const lista_observaciones = ref([])
  const getResourcesList = async () => {
    lista_acreditaciones.value = await resourceStore.getAccreditations()  // LISTA DE ACREDITACIONES
    lista_observaciones.value = await resourceStore.getDocumentaryReviewObservations()  // LISTA DE OBSERVACIONES
    caso.value = await instanceStore.instance(id_caso)  // INFORMACION DEL CASO
    bien.value = await resourceStore.getPropertyCharacteristic(id_bien_registro.value)  // INFORMACION DEL BIEN
  }

  // LISTA EJECUTORIADO
  const lista_ejecutoriado = ref([
    { title: 'SI' },
    { title: 'NO' },
  ])

  // LISTA DE REGIONES COMPLETA
  const lista_regiones = ref([]) as any
  const lista_departamentos = ref([]) as any
  const getRegionList = async () => {
    lista_regiones.value = await resourceStore.getPlaces()
    lista_departamentos.value = lista_regiones.value.filter(
      (region:any) => region.tipo == 'DEPARTAMENTO'
    )
  }

  // LISTA DE PROVINCIAS POR DEPARTAMENTO
  const lista_provincias = ref([]) as any
  const getProvinceList = async (department: any, i: any) => {
    const padre = lista_departamentos.value.find(
      (region:any) => region.nombre_region == department
    )
    state.formData.requerimientos[i].provincia = ''
    state.formData.requerimientos[i].municipio = ''
    lista_provincias.value = lista_regiones.value.filter(
      (region:any) => region.tipo == 'PROVINCIA' && region.padre == padre.id
    )
    lista_municipios.value = []
  }

  // LISTA DE MUNICIPIOS POR PROVINCIA
  const lista_municipios = ref([]) as any
  const getMunicipalityList = async (province: any, i: any) => {
    const padre = lista_provincias.value.find(
      (region:any) => region.nombre_region == province
    )
    state.formData.requerimientos[i].municipio = ''
    lista_municipios.value = lista_regiones.value.filter(
      (region:any) => region.tipo == 'MUNICIPIO' && region.padre == padre.id
    )
  }

  // LISTA DE JUZGADOS POR DEPARTAMENTO
  const lista_juzgados = ref([]) as any
  const getCourtByDepartmentList = async (department: any, i:any) => {
    state.formData.requerimientos[i].juzgado = ''
    lista_juzgados.value = await resourceStore.getCourtsByDepartment(department)
  }

  // MEDIANTE ESTA FUNCION SE ARMA LOS FORMULARIOS DE LOS REQUERIMIENTOS DEL BIEN
  const getPropertyInfo = async () => {
    const requerimientos = [] as any
    // EN documentacion OBTENEMOS LOS REQUISITOS DEL BIEN
    const documentacion = await resourceStore.getDocumentationByPropertyId(id_bien.value)
    for (let i = 0; i < documentacion.length; i++) {
      let esta_aprobado = revisiones_aprobadas.value.find(
        (revision:any) => revision.id_tipo_documentacion == documentacion[i].id
      )
      esta_aprobado = esta_aprobado ? true : false

      const requerimiento_base = {
        id_caso: id_caso,
        id_bien_registro: id_bien_registro.value,
        id : documentacion[i].id,
        nombre_tipo_documentacion : documentacion[i].nombre_tipo_documentacion,
        formulario: documentacion[i].formulario,
        obligatorio: documentacion[i].obligatorio,
        presenta_documentacion: '',
        observaciones: '',
        aprobado: esta_aprobado,
        documento : []
      }
      const requerimiento_anexo = (documentacion[i].formulario) ? {
        id_acreditacion_estado_juridico: '',
        acreditacion_situacion_juridica: '',
        estado_juridico: '',
        ejecutoriada: '',
        fecha_documento: '',
        departamento: '',
        provincia: '',
        municipio: '',
        juzgado: '',
      } : {}
      const requerimiento = {...requerimiento_base, ...requerimiento_anexo}
      requerimientos.push(requerimiento)
    }
    state.formData.requerimientos = requerimientos
    // CREAR UNA FUNCION QUE LOS DOCUMENTOS REQUERIDOS POR BIEN, OMITIENDO EL BIEN
  }

  // MODIFICA FORMULARIO DE ACREDITACION EN BASE AL VALOR SELECCIONADO
  const evaluarAcreditacion = async (index: any) => {
    state.formData.requerimientos[index].ejecutoriada = ''
    const acreditacion = lista_acreditaciones.value.find(
      (acreditacion:any) => acreditacion.id == state.formData.requerimientos[index].id_acreditacion_estado_juridico
    )
    state.formData.requerimientos[index].acreditacion_situacion_juridica = acreditacion.nombre_acreditacion
    state.formData.requerimientos[index].estado_juridico = acreditacion.nombre_estado_juridico
    enable_ejecutoriada.value = acreditacion.ejecutoriado ? false : true
  }

  // VALIDACIONES PARA FORMULARIO
  const miValidacion = async () => {
    sendForm.value = true

    if(!state.formData.id_recepcion_documental){
      sendForm.value = false
    }

    const requerimientos = state.formData.requerimientos
    for (let i = 0; i < requerimientos.length; i++) {
      const requerimiento = requerimientos[i]
      // SI EL REQUERIMIENTO NO ESTA APROBADO, INGRESA A LAS VALIDACIONES
      if(!requerimiento.aprobado){
        // 1RA VALIDACION, QUE LOS CAMPOS PRESENTA DOCUMENTACION ESTEN SELECCIONADOS
        if(requerimiento.presenta_documentacion == ''){
          sendForm.value = false
          break
        }

        // 2DA VALIDACION, SI PRESENTA DOCUMENTACION DEBE ENVIAR EL DOCUMENTO
        if(requerimiento.presenta_documentacion == 'SI' && requerimiento.documento.length == 0){
          sendForm.value = false
          break
        }

        // 3RA VALIDACION, SI EL REQUERIMIENTO TIENE FORMULARIO DEBE COMPLETAR CIERTOS CAMPOS
        if(requerimiento.presenta_documentacion == 'SI' && requerimiento.formulario){
          // SI ALGUNO DE LOS CAMPOS ESTA VACIO, NO PASA
          if(requerimiento.id_acreditacion_estado_juridico == '' ||
          requerimiento.estado_juridico == '' ||
          requerimiento.fecha_documento == '' ||
          requerimiento.departamento == ''){
            sendForm.value = false
            break
          }

          // SI SE ELIGE UNA ACREDITACION QUE TENGA PARA EJECUTORIADO
          if(!enable_ejecutoriada.value && requerimiento.ejecutoriada == ''){
            sendForm.value = false
            break
          }
        }
      }
    }
  }

  // LIMPIA FORMULARIOS AL CAMBIAR, PRESENTA DOCUMENTACION?
  const limpiaRequisito = (i: any) => {
    state.formData.requerimientos[i].observaciones = ''
    state.formData.requerimientos[i].documento = []
    if(state.formData.requerimientos[i].formulario){
      state.formData.requerimientos[i].id_acreditacion_estado_juridico = ''
      state.formData.requerimientos[i].acreditacion_situacion_juridica = ''
      state.formData.requerimientos[i].estado_juridico = ''
      state.formData.requerimientos[i].ejecutoriada = ''
      state.formData.requerimientos[i].fecha_documento = ''
      state.formData.requerimientos[i].departamento= ''
      state.formData.requerimientos[i].provincia = ''
      state.formData.requerimientos[i].municipio = ''
      state.formData.requerimientos[i].juzgado = ''
      enable_ejecutoriada.value = true
    }
  }

  // BOTON PARA ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value) return

    Swal.fire({
      title: 'Estás seguro?',
      text: "Comprueba que la información registrada sea correcta",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#FA896B',
      confirmButtonColor: '#5D87FF',
      cancelButtonText: 'No, volver',
      confirmButtonText: 'Si, enviar formulario',
    }).then(async (result) => {
      if(result.isConfirmed){
        isLoading.value = true
        const { ok, message } = await documentaryReviewStore.createDocumentaryReview(state.formData)
        const icono = ok ? 'success' : 'error'
        Swal.fire({
          icon: icono,
          title: message,
          confirmButtonText: 'Ok',
        }).then(() => {
          router.push({ name: 'bienFile', params: {id: id_caso} })
        })
        isLoading.value = false
      }
    })
  }

  // FUNCION PARA ELIMINAR REGISTRO --> PENDIENTE
  const deleteRecord = async (id:number) => {
    Swal.fire({
      title: 'Estas seguro?',
      text: "No se podrá revertir el cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await documentaryReviewStore.deleteDocumentaryReview(id)
        Swal.fire(
          'Eliminado!',
          'Registro eliminado correctamente.',
          'success'
        )
        await getDocumentaryReviewsByPropertyIdList()
      }
    })
  }

  // RETORNA A VISTA DE BIENES DEL CASO
  const buttonReturnList = () => {
    router.push({ name: 'bienFile', params: { id: route.params.id_caso }})
  }

  // FUNCION PARA ABRIR MODAL
  const modalViewPdf = ref<any>(null);
  const openModal = async(id:any) =>{
    id_file.value = id;
    dialog.value = true;
    await modalViewPdf.value.showModal(id_file.value);
  }

  // FUNCION PARA CERRAR MODAL
  const closeModal = async (value : any) =>{
    dialog.value = value.dialog
    id_file.value = value.value
    // await documentaryReviewStore.removePdfFile(value.value)
  }

  onMounted(async () => {
    await getResourcesList()
    await getDocumentaryReceptionsByCase()
    await getDocumentaryReviewsByPropertyIdList()
    await getRegionList()
    await getPropertyInfo()
  })
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <template v-if="userProfile == 'SUPERADMIN'">
    <v-row>
      <v-col cols="12" lg="12">
        <v-alert
          variant="outlined"
          type="warning"
          border="top"
          icon="$warning"
          title="ATENCIÓN ADMINISTRADOR"
          closable
        >
          - <span class="text-primary">Si elimina algún documento del <span class="text-warning font-weight-medium">CITE X</span>, y tiene que realizar nuevamente la revisión documental con el <span class="text-warning font-weight-medium">CITE X</span>, debe eliminar todos los documentos correspondientes al <span class="text-warning font-weight-medium">CITE X</span>.</span><br>
        </v-alert>
      </v-col>
    </v-row>
  </template>
  
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
        - <span class="text-primary">La documentación de un bien se considera <span class="text-warning font-weight-medium">APROBADO</span>, cuando todos los requisitos de color azul tienen su documentación cargada en el sistema y NINGÚN requisito tiene observaciones.</span><br>
        - <span class="text-primary">La documentación de un bien se considera <span class="text-warning font-weight-medium">OBSERVADO</span>, cuando algún requisito de color azul, no presenta documentación o en la documentación presentada se tiene alguna observación.</span><br>
        - <span class="text-primary">En la sección de <span class="text-secondary font-weight-medium">OTROS DOCUMENTOS NO DETERMINANTES</span>, puede cargar varios documentos que considere reelevantes.</span><br>
        - <span class="text-primary">Para volver a evaluar la documentación de un bien que fue OBSERVADO con el <span class="text-warning font-weight-medium">CITE X1</span>, en la fase de RECEPCIÓN DOCUMENTAL se debe generar una nueva acta con su respectivo <span class="text-warning font-weight-medium">CITE X2</span>, ya que con este <span class="text-warning font-weight-medium">CITE X2</span> podrá evaluar nuevamente la documentación faltante/observada del bien.</span><br>
        - <span class="text-primary">En los campos <span class="text-secondary font-weight-medium">Departamento, Provincia, Municipio, Fiscalia/Juzgado</span> si no encuentra la opción requerida, debe comunicarse con el Área de Registro y Sistemas mediante el correo institucional, solicitar el agregado de la opción.</span><br>
      </v-alert>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card elevation="0" rounded="md" class="bg-lightprimary border-0">
        <div class="pa-3 text-justify">
          <p class="text-h5"><span class="font-weight-bold text-primary">CASO FELCN/FELCC:</span> {{ caso.numero_caso_felcn_felcc }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">TIPO DE BIEN:</span> {{ bien.nombre_bien }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">JURISDICCIÓN DEL BIEN:</span> {{ bien.jurisdiccion }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">CARACTERÍSTICAS:</span> {{ bien.caracteristicas }}</p>
          <p class="text-h5"><span class="font-weight-bold text-primary">OBSERVACIONES:</span> {{ bien.observaciones }}</p>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card elevation="0" class="border">
        <v-table>
          <thead>
            <tr class="bg-primary">
              <th class="text-h6 text-center"></th>
              <th class="text-h6 text-center">NOMBRE DE DOCUMENTO</th>
              <th class="text-h6 text-center">CITE</th>
              <th class="text-h6 text-center">PRESENTÓ</th>
              <th class="text-h6 text-center">ESTADO</th>
              <th class="text-h6 text-center">OBSERVACIÓN</th>
              <th class="text-h6 text-center">FECHA DE REVISIÓN</th>
              <th class="text-h6 text-center">USUARIO REVISOR</th>
              <th class="text-h6 text-center">ACREDITACIÓN SITUACIÓN JURÍDICA</th>
              <th class="text-h6 text-center">ESTADO JURÍDICO</th>
              <th class="text-h6 text-center">EJECUTORIADO</th>
              <th class="text-h6 text-center">FECHA DE DOCUMENTO</th>
              <th class="text-h6 text-center">DEPARTAMENTO</th>
              <th class="text-h6 text-center">PROVINCIA</th>
              <th class="text-h6 text-center">MUNICIPIO</th>
              <th class="text-h6 text-center">JUZGADO</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="lista_revisiones.length == 0">
              <tr>
                <td class="text-h6 text-center" colspan="16">SIN REGISTROS</td>
              </tr>
            </template>
            <template v-for="(item, index) in lista_revisiones" :key="index">
              <tr>
                <td class="text-center">
                  <v-item-group class="d-flex justify-sm-space-between px-2">
                    <v-item>
                      <v-btn 
                        density="compact"
                        icon="mdi-eye"
                        @click="openModal(item.id)"
                        v-if="item.nombre_documento"
                        title="Ver documento"
                        ><v-icon color="primary"></v-icon>
                      </v-btn>
                    </v-item>
                    <v-item>
                      <v-btn
                        density="compact"
                        icon="mdi-delete"
                        @click="deleteRecord(item.id)"
                        v-if="userProfile == 'SUPERADMIN'"
                        title="Eliminar revisión"
                        ><v-icon color="error"></v-icon>
                      </v-btn>
                    </v-item>
                  </v-item-group>
                </td>
                <td class="text-center">{{ item.nombre_tipo_documentacion }}</td>
                <td class="text-center">{{ item.cite }}</td>
                <td class="text-center">
                  <v-chip rounded="lg" class="font-weight-bold py-4 px-3" :color="item.presenta_documentacion == 'SI' ? '#5D87FE' : '#FA896B'" size="small">
										{{ item.presenta_documentacion }}
									</v-chip>
                </td>
                <td class="text-center">
                  <v-chip rounded="lg" class="font-weight-bold py-4 px-3" :color="item.estado_documento == 'APROBADO' ? '#5D87FE' : '#FA896B'" size="small">
										{{ item.estado_documento }}
									</v-chip>
                </td>
                <td class="text-center">{{ item.observaciones ? item.observaciones : 'NO' }}</td>
                <td class="text-center">{{ item.fecha_revision }}</td>
                <td class="text-center">{{ item.usuario_revisor }}</td>
                <td class="text-center">{{ item.acreditacion_situacion_juridica }}</td>
                <td class="text-center">{{ item.estado_juridico }}</td>
                <td class="text-center">{{ item.ejecutoriada }}</td>
                <td class="text-center">{{ item.fecha_documento }}</td>
                <td class="text-center">{{ item.departamento }}</td>
                <td class="text-center">{{ item.provincia }}</td>
                <td class="text-center">{{ item.municipio }}</td>
                <td class="text-center">{{ item.juzgado }}</td>
              </tr>    
            </template>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

  <template v-if="lista_recepciones.length > 0">
    
    <v-row>
      <v-col cols="12">
        <h4 class="mb-5 mt-2">
          Los campos con <span style="color:red">*</span> son obligatorios
        </h4>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-label class="mb-2 font-weight-medium">CITE DE RECEPCIÓN DOCUMENTAL<span style="color:red">*</span></v-label>
        <v-select
          :items="lista_recepciones"
          item-title="cite"
          item-value="id"
          no-data-text="No existe más opciones para seleccionar"
          v-model="state.formData.id_recepcion_documental"
          :error="submitButton && !state.formData.id_recepcion_documental"
          hide-details
        />
        <template v-if="submitButton && !state.formData.id_recepcion_documental">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              El campo es requerido
            </div>
          </div>
        </template>
      </v-col>
    </v-row>

    <template
      v-for="(requerimiento, index) in state.formData.requerimientos"
      :key="index"
    >
      <v-row class="mt-5" :class="requerimiento.obligatorio ? 'bg-lightprimary' : 'bg-lightsecondary'">
        <v-col cols="12">
          <p class="text-h5 font-weight-bold" :class="requerimiento.obligatorio ? 'text-primary' : 'text-secondary'">{{ index+1 }}.- {{ requerimiento.nombre_tipo_documentacion }}</p>
        </v-col>
      </v-row>

      <template v-if="!requerimiento.aprobado">
        <v-row>
          <template v-if="!requerimiento.obligatorio">
            <v-col cols="12">
              <p class="font-weight-medium text-justify">NO OBLIGATORIOS PARA SU ENTREGA, PERO SU AUSENCIA ES CONSIGNADA BAJO RESPONSABILIDAD</p>
              <p class="font-weight-regular text-justify">
                Comprobante de anotación preventiva (si corresponde)
                <br>
                Informe de retraso y requerimiento fiscal (si corresponde)
                <br>
                Otros que el revisor considere
              </p>
            </v-col>
          </template>
          <v-col cols="12" md="3" class="pb-md-3 pb-0">
            <v-label class="font-weight-medium">¿Presenta Documentación? <span style="color:red">*</span></v-label>
          </v-col>
          <v-col cols="12" md="9">
            <v-radio-group
              v-model="requerimiento.presenta_documentacion"
              class="ml-n3 mb-0"
              inline
              hide-details
              :error="submitButton && !requerimiento.presenta_documentacion"
              @change="limpiaRequisito(index)"
            >
              <v-radio label="SI" color="primary" value="SI" class="px-10"></v-radio>
              <v-radio label="NO" color="warning" value="NO"></v-radio>
            </v-radio-group>
            <template v-if="submitButton && !requerimiento.presenta_documentacion">
              <div class="v-messages font-weight-black px-10">
                <div class="v-messages__message text-error ">
                  El campo es requerido
                </div>
              </div>
            </template>
          </v-col>
        </v-row>

        <v-row>
          <template v-if="requerimiento.formulario && requerimiento.presenta_documentacion == 'SI'">
            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Acreditación de Situación Jurídica<span style="color:red">*</span>
              </v-label>
              <v-select
                :items="lista_acreditaciones"
                v-model="requerimiento.id_acreditacion_estado_juridico"
                item-title="nombre_acreditacion"
                item-value="id"
                no-data-text="No existe más opciones para seleccionar"
                @update:model-value="evaluarAcreditacion(index)"
                hide-details
                :error="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.id_acreditacion_estado_juridico"
              />
              <template v-if="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.id_acreditacion_estado_juridico">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Estado Jurídico<span style="color:red">*</span>
              </v-label>
              <v-text-field
                variant="outlined"
                color="primary"
                v-model="requerimiento.estado_juridico"
                disabled
                hide-details
                :error="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.estado_juridico"
              />
              <template v-if="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.estado_juridico">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Ejecutoriado<span style="color:red" v-if="!enable_ejecutoriada">*</span>
              </v-label>
              <v-select
                :items="lista_ejecutoriado"
                item-title="title"
                item-value="title"
                no-data-text="No existe más opciones para seleccionar"
                v-model="requerimiento.ejecutoriada"
                :disabled="enable_ejecutoriada"
                hide-details
                :error="submitButton && !enable_ejecutoriada && !requerimiento.ejecutoriada"
              />
              <template v-if="submitButton && !enable_ejecutoriada && !requerimiento.ejecutoriada">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Departamento <span style="color:red">*</span>
              </v-label>
              <v-select
                :items="lista_departamentos"
                item-title="nombre_region"
                item-value="nombre_region"
                no-data-text="No existe opciones para seleccionar"
                v-model="requerimiento.departamento"
                @update:model-value="getProvinceList(requerimiento.departamento, index); getCourtByDepartmentList(requerimiento.departamento, index);"
                hide-details
                :error="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.departamento"
              />

              <template v-if="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.departamento">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Provincia
              </v-label>
              <v-select
                :items="lista_provincias"
                item-title="nombre_region"
                item-value="nombre_region"
                no-data-text="No existe opciones para seleccionar"
                v-model="requerimiento.provincia"
                @update:model-value="getMunicipalityList(requerimiento.provincia, index);"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Municipio
              </v-label>
              <v-select
                :items="lista_municipios"
                item-title="nombre_region"
                item-value="nombre_region"
                no-data-text="No existe opciones para seleccionar"
                v-model="requerimiento.municipio"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium" required>
                Fecha Documento<span style="color:red">*</span>
              </v-label>
              <v-text-field
                type="date"
                id="date-form"
                name="date-form"
                v-model="requerimiento.fecha_documento"
                :max="currentDate"
                hide-details
                :error="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.fecha_documento"
              />
              <template v-if="submitButton && requerimiento.presenta_documentacion == 'SI' && !requerimiento.fecha_documento">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
            </v-col>

            <v-col cols="12" md="8">
              <v-label class="mb-2 font-weight-medium">
                Fiscalía/Juzgado
              </v-label>
              <v-autocomplete
                v-model="requerimiento.juzgado"
                :items="lista_juzgados"
                no-data-text="No existe opciones para seleccionar"
                item-title="nombre_juzgado"
                item-value="nombre_juzgado"
                color="primary"
                variant="outlined"
                hide-details
                clearable
              ></v-autocomplete>
            </v-col>
          </template>

          <template v-if="requerimiento.obligatorio">
            <v-col cols="12" md="12">
            <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
            <v-select
              :items="lista_observaciones"
              item-title="nombre_observacion"
              item-value="nombre_observacion"
              no-data-text="No existe más opciones para seleccionar"
              v-model='requerimiento.observaciones'
              hide-details
              clearable
            />
          </v-col>
          </template>
        </v-row>

        <template v-if="requerimiento.presenta_documentacion == 'SI'">
          <v-row>
            <v-col cols="12">
              <v-label class="mb-2 font-weight-medium">Documento<span style="color:red">*</span></v-label>
              <v-file-input
                v-model="requerimiento.documento"
                accept="application/pdf"
                placeholder="Cargue el documento aqui"
                prepend-icon="mdi-paperclip"
                color="deep-purple-accent-4"
                counter
                variant="outlined"
                :show-size=true
                :multiple="!requerimiento.obligatorio"
                hide-details
                :error="submitButton && requerimiento.presenta_documentacion == 'SI' && requerimiento.documento.length==0"
              >
                <template v-slot:selection="{ fileNames }">
                  <template v-for="(fileName, index) in fileNames" :key="fileName">
                    <v-chip
                      v-if="index < 5"
                      color="deep-purple-accent-4"
                      label
                      size="small"
                      class="me-2"
                    >
                      {{ fileName }}
                    </v-chip>
                  </template>
                </template>
              </v-file-input>
              <template v-if="submitButton && requerimiento.presenta_documentacion == 'SI' && requerimiento.documento.length==0">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
            </v-col>
          </v-row>
        </template>
      </template>

      <template v-else>
        <v-row class="mt-3">
          <v-col cols="12">
            <v-chip rounded="lg" class="font-weight-bold py-4 px-3" color="#5EE6C9" size="medium">
              DOCUMENTACION PRESENTADA <CircleCheckIcon class="ml-2"/>
            </v-chip>
          </v-col>
        </v-row>
      </template>

    </template>

  </template>

  <v-row>
    <v-col cols="12" class="text-lg-right pt-10">
      <template v-if="!isLoading">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
        <template v-if="lista_recepciones.length > 0">
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

  <viewPdf :dialog="dialog" ref="modalViewPdf" @dialog-off="closeModal"></viewPdf>
</template>