<script setup lang="ts">
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue';
import { TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { format } from 'date-fns'
import { useResourceStore } from '@/stores/resource';
import { useDocumentaryReceptionStore } from '@/stores/moduleOne/documentaryReception';
import { validateText } from '@/utils/helpers/validateText'
import { editPermission } from '@/utils/helpers/editPermission' 

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'

  const route = useRoute()
  const resourceStore = useResourceStore()
  const documentaryReceptionStore = useDocumentaryReceptionStore()

  const submitButton = ref(false)
  const addButton = ref(false)
  const sendForm = ref(true)
  const sendPerson = ref(true)
  const testEmail = ref(true)
  const searchLoading = ref(false)
  const isLoading = ref(false)

  // BREADCRUMB
  const page = ref({ title: 'Recepción documental' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '/home'
    },
    {
      text: 'Recepción documental',
      disabled: true,
      href: '#'
    }
  ]);
  const editar = ref<any>(false)

  // DECLARACION DE VARIABLES Y STATE
  const perfilUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  const oficinaUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_oficina
  const permisoFecha = JSON.parse(localStorage.getItem('user') || '').estado
  const permisoEdicion = ref<any>(true)
  const panel = ref<any>(false)
  const currentDate = (route.params.id_caso != '0') ? '' : format(new Date(),"yyyy-MM-dd")
  const state = reactive({
    formData: {
      id_caso: '',
      id_recepcion_documental: '',
      citeActa: '',
      numero_fojas: 0,
      numero_hoja_ruta: '',
      fecha_formulario: currentDate,
      jurisdiccion: '',
      observaciones: '',

      numero_caso_felcn_felcc: '',

      id_tipo_codigo: '',
      nombre_tipo_codigo: '',
      numero_codigo: '',
      codigos: [] as any,

      id_persona: '',
      id_dependencia: '',
      nombre_dependencia: '',

      cedula_identidad: '',
      complemento: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      genero: '',
      fecha_nacimiento: '',
      pais: '',
      departamento: '',
      provincia: '',
      localidad: '',
      domicilio: '',
      imagen: '',

      tipo: '',
      cargo: '',
      telefono: '',
      celular: '',
      correo_electronico: '',
      implicados: [] as any,
      investigador_presente: false,
    }
  });

  const lista_tipo = ref([
    { title: 'INVESTIGADOR' },
    { title: 'ENLACE' }
  ]);

  // RECURSOS
  const lista_tipo_codigo = ref([]) as any
  const lista_dependencia = ref([]) as any
  const jurisdicciones = ref([]) as any
  const lista_casos = ref([]) as any
  const getResourcesList = async () => {
    lista_tipo_codigo.value = await resourceStore.getCodesType()      // LISTA DE TIPOS DE CODIGO
    lista_dependencia.value = await resourceStore.getDependencies()   // LISTA DE DEPENDENCIAS
    const jurisdictions = await resourceStore.getOffices()            // LISTA DE JURISDICCIONES
    if(perfilUsuario != 'SUPERADMIN'){
      jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.nombre_oficina == oficinaUsuario )
    }else{
      jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.departamento != 'NACIONAL' )
    }
    lista_casos.value = await resourceStore.getInstances()
  }

  const recepciones = ref([]) as any
  const getDocumentaryReceptionsByCase = async() => {
    const documentaryReceptions = await documentaryReceptionStore.documentaryReceptionsByCase(route.params.id_caso)
    recepciones.value = documentaryReceptions
    await getDocumentaryReceptionById(documentaryReceptions[0].id)
  }

  const getDocumentaryReceptionById = async (id: any) => {
    // LLAMADA DE LISTAS
    lista_tipo_codigo.value = await resourceStore.getCodesType()
    lista_dependencia.value = await resourceStore.getDependencies()

    const data = await documentaryReceptionStore.documentaryReceptionById(id)
    state.formData.id_recepcion_documental = data.id
    state.formData.id_caso = data.id_caso
    state.formData.fecha_formulario = data.fecha_formulario
    state.formData.citeActa = data.cite
    state.formData.numero_caso_felcn_felcc = data.numero_caso_felcn_felcc
    state.formData.numero_fojas = data.numero_fojas
    state.formData.numero_hoja_ruta = data.numero_hoja_ruta
    state.formData.jurisdiccion = data.jurisdiccion
    state.formData.observaciones = data.observaciones

    const codigos = data.codigos
    state.formData.codigos = []
    for (let i = 0; i < codigos.length; i++) {
      state.formData.codigos.push(codigos[i])
      lista_tipo_codigo.value = lista_tipo_codigo.value.filter( (tipo: any) => tipo.id != codigos[i].id_tipo_codigo)
    }

    const implicados = data.implicados
    state.formData.implicados = []
    for (let i = 0; i < implicados.length; i++) {
      state.formData.implicados.push(implicados[i])
      lista_tipo.value = lista_tipo.value.filter( (registro: any) => registro.title != implicados[i].tipo )
    }

    state.formData.investigador_presente = true
  }

  const placeholderHojaRuta = () => {
    const arrayfechas = currentDate.split('-')
    const respuesta = 'MG-'+arrayfechas[0]+arrayfechas[1]+arrayfechas[2]+'-###'
    return respuesta
  }

  const setCodeName = () => {
    const registro: any = lista_tipo_codigo.value.find(
      (codigo: any) => 
      codigo.id == state.formData.id_tipo_codigo
    )
    state.formData.nombre_tipo_codigo = registro.nombre_tipo_codigo
  }

  // AGREGA TIPO DE CODIGO A LA TABLA DE CODIGOS
  const buttonAddCode = () => {
    if(state.formData.id_tipo_codigo && state.formData.nombre_tipo_codigo && state.formData.numero_codigo){
      lista_tipo_codigo.value = lista_tipo_codigo.value.filter(
        (codigo: any) =>
        codigo.id != state.formData.id_tipo_codigo
      )
      state.formData.codigos.push({
        id_tipo_codigo: state.formData.id_tipo_codigo,
        nombre_tipo_codigo: state.formData.nombre_tipo_codigo,
        numero_codigo: state.formData.numero_codigo
      })
      state.formData.id_tipo_codigo = ''
      state.formData.nombre_tipo_codigo = ''
      state.formData.numero_codigo = ''
    }
  }

  // ELIMINA TIPO DE CODIGO DE LA TABLA DE CODIGOS
  const buttonDeleteCode = (index: number) => {
    const registro: any = state.formData.codigos[index]
    lista_tipo_codigo.value.push({
      id: registro.id_tipo_codigo,
      nombre_tipo_codigo: registro.nombre_tipo_codigo
    })
    // REORDENAMIENTO DE LISTA
    lista_tipo_codigo.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_tipo_codigo
      const codigo_b = b.nombre_tipo_codigo
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    state.formData.codigos.splice(index,1)
  }

  const setDependencyName = () => {
    const registro: any = lista_dependencia.value.find(
      (dependencia: any) => 
      dependencia.id == state.formData.id_dependencia
    )
    state.formData.nombre_dependencia = registro.nombre_dependencia
  }

  const setInstanceName = (caso: string) => {
    state.formData.numero_caso_felcn_felcc = caso
    coincidences.value = []
  }

  const closeInstances = () => {
    // @blur="closeInstances()" // el evento se activa una vez se deja el input
    coincidences.value = []
  }

  const coincidences = ref([]) as any
  const searchInstance = () => {
    if(state.formData.numero_caso_felcn_felcc.length > 3){
      coincidences.value = lista_casos.value.filter(
        (caso: any) => caso.numero_caso_felcn_felcc.includes(state.formData.numero_caso_felcn_felcc)
      )
    }else{
      coincidences.value = []
    }
  }

  // AGREGA TIPO DE CODIGO A LA TABLA DE CODIGOS
  const buttonAddInvolved = async () => {
    addButton.value = true
    await validatePerson()
    if(!sendPerson.value) return

    lista_tipo.value = lista_tipo.value.filter(
      (registro: any) => registro.title != state.formData.tipo
    )

    state.formData.implicados.push({
      id_persona: state.formData.id_persona,
      cedula_identidad: state.formData.cedula_identidad,
      complemento: state.formData.complemento,
      nombres: state.formData.nombres,
      apellido_paterno: state.formData.apellido_paterno,
      apellido_materno: state.formData.apellido_materno,
      genero: state.formData.genero,
      fecha_nacimiento: state.formData.fecha_nacimiento,
      pais: state.formData.pais,
      departamento: state.formData.departamento,
      provincia: state.formData.provincia,
      localidad: state.formData.localidad,
      domicilio: state.formData.domicilio,
      imagen: state.formData.imagen,

      id_dependencia: state.formData.id_dependencia,
      nombre_dependencia: state.formData.nombre_dependencia,

      tipo: state.formData.tipo,
      cargo: state.formData.cargo,
      telefono: state.formData.telefono,
      celular: state.formData.celular,
      correo_electronico: state.formData.correo_electronico
    })

    if(state.formData.tipo == 'INVESTIGADOR'){
      state.formData.investigador_presente = true
    }

    buttonClearPerson()
    panel.value = false
    addButton.value = false
  }

  // ELIMINA TIPO DE CODIGO DE LA TABLA DE CODIGOS
  const buttonDeleteInvolved = (index: number) => {
    const registro: any = state.formData.implicados[index]
    if(registro.tipo == 'INVESTIGADOR'){
      state.formData.investigador_presente = false
    }

    lista_tipo.value.push({
      title: registro.tipo
    })
    // REORDENAMIENTO DE LISTA
    lista_tipo_codigo.value.sort(function(a: any, b: any) {
      const codigo_a = a.tipo
      const codigo_b = b.tipo
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    state.formData.implicados.splice(index,1)
  }

  // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
  const buttonSearchPerson = async () => {
    // VALIDACION DE MISMO USUARIO EN LISTA
    const yaExiste = state.formData.implicados.find(
      (personal:any) => personal.cedula_identidad == state.formData.cedula_identidad
    )
    if(yaExiste){
      Toast.fire({
        icon: 'error',
        title: 'Persona ya registrada en lista'
      })
      return
    }
    searchLoading.value = true
    state.formData.id_persona = ''
    const respuesta = await resourceStore.getPerson(state.formData)
    // console.log('de DB', respuesta);
    if(Object.prototype.hasOwnProperty.call(respuesta, 'id')){
      // console.log('UTILIZANDO DESDE DB');
      Toast.fire({
        icon: 'success',
        title: 'Resultado Obtenido Satisfactoriamente'
      })
      state.formData.id_persona = respuesta.id
      state.formData.nombres = respuesta.nombres
      state.formData.apellido_paterno = respuesta.apellido_paterno
      state.formData.apellido_materno = respuesta.apellido_materno
      // BLOQUEAR EL INPUT
    }else{
      // console.log('UTILIZANDO DESDE API SEGIP');
      const { data } = await resourceStore.dataSegip(state.formData)
      if(data.respuesta){
        Toast.fire({
          icon: 'error',
          title: data.respuesta
        })
      // DESBLOQUEAR EL INPUT
      }else{
        Toast.fire({
          icon: 'success',
          title: 'Resultado Obtenido Satisfactoriamente'
        })
        state.formData.nombres = data.Nombres
        state.formData.apellido_paterno = data.PrimerApellido
        state.formData.apellido_materno = data.SegundoApellido
        state.formData.genero = data.Genero
        state.formData.fecha_nacimiento = birthDate(data.FechaNacimiento)
        state.formData.pais = data.LugarNacimientoPais
        state.formData.departamento = data.LugarNacimientoDepartamento
        state.formData.provincia = data.LugarNacimientoProvincia
        state.formData.localidad = data.LugarNacimientoLocalidad
        state.formData.domicilio = data.Domicilio
        state.formData.imagen = 
          data.Fotografia !== undefined
          ? 'data:image/jpeg;base64,' + data.Fotografia
          : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'
        // BLOQUEAR EL INPUT
      }
    }
    searchLoading.value = false
    // if(state.formData.cedula_identidad.includes('-') || state.formData.cedula_identidad.includes('e')){
    //     alert("NO!!!!!")
    // }
  }

  const buttonClearPerson = () => {
    state.formData.id_persona = ''
    state.formData.cedula_identidad = ''
    state.formData.complemento = ''
    state.formData.nombres = ''
    state.formData.apellido_paterno = ''
    state.formData.apellido_materno = ''
    state.formData.genero = ''
    state.formData.fecha_nacimiento = ''
    state.formData.pais = ''
    state.formData.departamento = ''
    state.formData.provincia = ''
    state.formData.localidad = ''
    state.formData.domicilio = ''
    state.formData.imagen = ''
    state.formData.id_dependencia = ''
    state.formData.nombre_dependencia = ''
    state.formData.tipo = ''
    state.formData.cargo = ''
    state.formData.telefono = ''
    state.formData.celular = ''
    state.formData.correo_electronico = ''
  }


  const buttonReturnList = () => {
    router.push({ name: 'documentaryReceptionList' })
  }

  // ENVIO DE FORMULARIO
  const buttonSendForm = async () => {
    submitButton.value = true
    await validateForm()
    if(!sendForm.value) return

    isLoading.value = true
    if(route.params.id_caso == '0'){
      // ES NUEVO REGISTRO
      Swal.fire({
        title: 'Estás seguro?',
        text: "Verifica que la información registrada sea correcta",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#FA896B',
        confirmButtonColor: '#5D87FF',
        cancelButtonText: 'No, volver',
        confirmButtonText: 'Si, enviar formulario',
      }).then(async (result) => {
        if(result.isConfirmed){

          const { ok, message, caso, rd } = await documentaryReceptionStore.createDocumentaryReception(state.formData)
          const icono = (ok ? 'success' : 'error')
          Toast.fire({ icon: icono, title: message })
          if(caso != 0 && rd != 0){
            await documentaryReceptionStore.minutesReport(caso, rd)
          }
        }
      })
    }else{
      // NO ES NUEVO REGISTRO
      if(permisoEdicion.value){
        // SI TIENE PERMISO DE EDICIO
        const { ok, message, caso, rd } = await documentaryReceptionStore.updateDocumentaryReception(state.formData)
        const icono = (ok ? 'success' : 'error')
        Toast.fire({ icon: icono, title: message })
        if(caso != 0 && rd != 0){
          await documentaryReceptionStore.minutesReport(caso, rd)
        }
      }else{
        // NO TIENE PERMISO DE EDICION, SOLO REPORTE
        await documentaryReceptionStore.minutesReport(Number(state.formData.id_caso), Number(state.formData.id_recepcion_documental))
        router.push({ name: 'documentaryReceptionList' });
      }
    }
    isLoading.value = false
  }

  const birthDate = (date: string) => {
    if(date !== undefined){
      let format = date.split("/")
      let lastFormat = format[2] + "-" + format[1] + "-" + format[0];
      return lastFormat;
    }
    return  ''
  }

  // VALIDACION PARA INGRESAR UN PERSONAL ASIGNADO A ENTREGA
  const validatePerson = async () => {
    sendPerson.value = true
    testEmail.value = true
    if(!state.formData.cedula_identidad ||
    !state.formData.nombres ||
    !state.formData.tipo ||
    !state.formData.id_dependencia ||
    !state.formData.cargo ||
    !state.formData.celular){
      sendPerson.value = false
    }

    const validarEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    if(state.formData.correo_electronico && !validarEmail.test(state.formData.correo_electronico)){
      testEmail.value = false
      sendPerson.value = false
    }
  }

  // VALIDACION GENERAL
  const validateForm = async () => {
    sendForm.value = true
    if(!state.formData.numero_caso_felcn_felcc ||
      !state.formData.numero_fojas ||
      !state.formData.numero_hoja_ruta ||
      !state.formData.jurisdiccion ||
      state.formData.implicados.length == 0 ||
      !state.formData.investigador_presente){
      sendForm.value = false
    }
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

    await placeholderHojaRuta()
    if(route.params.id_caso != '0'){
      permisoEdicion.value = editPermission('RECEPCION DOCUMENTAL')
      await getDocumentaryReceptionsByCase()
    }
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
        - <span class="text-primary">La documentación debe estar correctamente foliada por parte de la FELCN/FELCC.</span><br>
        - <span class="text-primary">Se deberá generar un acta por cada caso presentado.</span><br>
        <!-- - Para ingresar nueva documentación en un caso previamente registrado, debe asegurarse que al completar el campo "Número Caso FELCN/FELCC" sea igual al caso correspondiente. <br> -->
        - <span class="text-primary">Por convenio con las distritales se estableció que para el registro del campo Número caso FELCN/FELCC, si el caso es del formato <span class="text-secondary font-weight-medium">DEP-X-123/2024</span> debe registrar <span class="text-secondary font-weight-medium">DEP-X-123/24</span> donde solo se registra los ultimos 2 digitos del año.</span><br>
        - <span class="text-primary">Conforme registre información en el campo <span class="text-warning font-weight-medium">Número Caso FELCN/FELCC</span>, el sistema le mostrará sugerencias de casos existentes/similares. Si el caso <span class="text-warning font-weight-medium">ES NUEVO</span> no debería mostrarle un registro igual, si el caso <span class="text-warning font-weight-medium">NO ES NUEVO</span> (ya fue registrado previamente en el sistema) seleccione el caso de la lista.</span><br>
        - <span class="text-primary">Si el investigador trae documentos para completar información de un caso previamente ingresado <span class="text-warning font-weight-medium">DEBE</span> generar su acta para esta recepción, Toda recepción de documentos conlleva la generación de su respectiva acta.</span><br>
        - <span class="text-primary">En el campo <span class="text-secondary font-weight-medium">Dependencia</span> si no encuentra la opción requerida, debe comunicarse con el Área de Registro y Sistemas mediante el correo institucional, solicitar el agregado de la opción.</span><br>
      </v-alert>
    </v-col>
  </v-row>

  <template v-if="route.params.id_caso != '0'">
    <v-row>
      <v-col cols="12" lg="12" class="my-3">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Fecha de Formulario</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(recepcion, index) in recepciones"
              :key="recepcion.id"
            >
              <td class="text-center">{{ recepcion.fecha_formulario_mod }}</td>
              <td class="text-center">{{ recepcion.cite }}</td>
              <td class="text-center"><EyeIcon style="color: teal; cursor: pointer;" @click="getDocumentaryReceptionById(recepcion.id)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>    
  </template>

  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> REGISTRO DEL DOCUMENTO: </strong>Los campos con <span style="color:red">*</span> son obligatorios
      </h4>
    </v-col>
  </v-row>

  <v-row>

    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">
        Fecha Formulario<span style="color:red">*</span>
      </v-label>
      <v-text-field 
        type="date" 
        id="date-form" 
        name="date-form"
        v-model="state.formData.fecha_formulario"
        :max="currentDate"
        :readonly="!permisoFecha"
        hide-details
      />
      <template v-if="submitButton && !state.formData.fecha_formulario">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">
        Cite Acta
      </v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model="state.formData.citeActa"
        readonly
        placeholder="CITE AUTOGENERADO"
        hide-details
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">
        Número Caso FELCN/FELCC<span style="color:red">*</span>
      </v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model.trim="state.formData.numero_caso_felcn_felcc"
        @input="state.formData.numero_caso_felcn_felcc = validateText(state.formData.numero_caso_felcn_felcc.toUpperCase()); searchInstance()"
        :error="submitButton && !state.formData.numero_caso_felcn_felcc"
        :disabled="route.params.id_caso != '0'"
        hide-details
      />
      <template v-if="coincidences.length>0">
        <v-card class="mx-auto">
          <v-list density="compact" style="height: 200px; overflow-y: auto;">
            <v-list-item
              v-for="(item, i) in coincidences"
              :value="item.numero_caso_felcn_felcc"
              color="primary"
              @click="setInstanceName(item.numero_caso_felcn_felcc)"
            >
              <v-list-item-title v-text="item.numero_caso_felcn_felcc"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
      <template v-if="submitButton && !state.formData.numero_caso_felcn_felcc">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">
        Número de Fojas<span style="color:red">*</span>
      </v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        type="number"
        min="0"
        v-model="state.formData.numero_fojas"
        oninput="if(this.value < 0) this.value = ''"
        :disabled="!permisoEdicion"
        :error="submitButton && !state.formData.numero_fojas"
        hide-details
      />
      <template v-if="submitButton && !state.formData.numero_fojas">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">Número Hoja de Ruta<span style="color:red">*</span></v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model.trim="state.formData.numero_hoja_ruta"
        @input="state.formData.numero_hoja_ruta = validateText(state.formData.numero_hoja_ruta.toUpperCase())"
        :placeholder="placeholderHojaRuta()"
        :disabled="!permisoEdicion"
        :error="submitButton && !state.formData.numero_hoja_ruta"
        hide-details
      ></v-text-field>
      <template v-if="submitButton && !state.formData.numero_hoja_ruta">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="6">
      <v-label class="mb-2 font-weight-medium">Jurisdicción<span style="color:red">*</span></v-label>
      <v-select
        :items="jurisdicciones"
        item-title="departamento"
        item-value="departamento"
        v-model="state.formData.jurisdiccion" 
        :disabled="route.params.id_caso != '0'"
        :error="submitButton && !state.formData.jurisdiccion"
        hide-details
      />
      <template v-if="submitButton && !state.formData.jurisdiccion">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="12">
      <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.observaciones"
        @input="state.formData.observaciones = validateText(state.formData.observaciones.toUpperCase())"
        :disabled="!permisoEdicion"
        hide-details
      ></v-textarea>
    </v-col>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Tipo Código
        </v-label>
        <v-select
          :items="lista_tipo_codigo"
          v-model="state.formData.id_tipo_codigo"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id"
          item-title="nombre_tipo_codigo"
          @update:model-value="setCodeName()"
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Número Código
        </v-label>
        <v-text-field 
          variant="outlined"
          color="primary"
          v-model.trim="state.formData.numero_codigo"
          @input="state.formData.numero_codigo = validateText(state.formData.numero_codigo.toUpperCase())"
          @keydown.enter=buttonAddCode()
        >
        <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_tipo_codigo || !state.formData.numero_codigo">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
        </v-text-field>
      </v-col>
    </template>

    <template v-if="state.formData.codigos.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Nombre Código</th>
              <th class="text-center">Número de Código</th>
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.codigos"
              :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_tipo_codigo }}</td>
              <td class="text-center">{{ item.numero_codigo }}</td>
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <v-col cols="12" lg="12">
      <h3 class="my-3 text-primary">INFORMACIÓN DE PERSONAL ASIGNADO A ENTREGA</h3>
    </v-col>

    <v-col cols="12" lg="12">
      <v-expansion-panels v-model="panel">
        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">FORMULARIO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">

            <v-row>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">
                  Número de Documento<span style="color:red">*</span>
                </v-label>
                <v-text-field
                  variant="outlined" 
                  color="primary"
                  type="number"
                  min="0"
                  v-model="state.formData.cedula_identidad"
                  oninput="if(this.value < 0) this.value = '';"
                  hide-details
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Complemento</v-label>
                <v-text-field
                  variant="outlined"
                  color="primary"
                  :readonly="!permisoEdicion"
                  v-model.trim="state.formData.complemento"
                  @input="state.formData.complemento = validateText(state.formData.complemento)"
                  hide-details
                >
                  <template v-slot:append>
                    <template v-if="!searchLoading">
                      <v-btn
                        color="primary"
                        @click= buttonSearchPerson()
                        :disabled="!state.formData.cedula_identidad"><SearchIcon/>Buscar
                      </v-btn>
                      <v-btn
                        color="secondary"
                        @click= buttonClearPerson()
                        :disabled="!state.formData.cedula_identidad"><TrashIcon/>Limpiar
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
                </v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Nombres<span style="color:red">*</span></v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  v-model.trim="state.formData.nombres"
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Apellido Paterno</v-label>
                <v-text-field 
                  variant="outlined" 
                  color="primary"
                  v-model.trim="state.formData.apellido_paterno"
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Apellido Materno</v-label>
                <v-text-field 
                  variant="outlined" 
                  color="primary"
                  v-model.trim="state.formData.apellido_materno"
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Tipo<span style="color:red">*</span></v-label>
                <v-select
                  v-model="state.formData.tipo"
                  :items="lista_tipo"
                  item-title="title"
                  item-value="title"
                  :disabled="!permisoEdicion"
                  hide-details
                ></v-select>
                <template v-if="addButton && !state.formData.tipo">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Dependencia<span style="color:red">*</span></v-label>
                <v-autocomplete
                  v-model="state.formData.id_dependencia"
                  :items="lista_dependencia"
                  item-title="nombre_dependencia"
                  item-value="id"
                  no-data-text="No existe opciones para seleccionar"
                  color="primary"
                  variant="outlined"
                  @update:model-value="setDependencyName()"
                  :disabled="!permisoEdicion"
                  hide-details
                ></v-autocomplete>
                <template v-if="addButton && !state.formData.id_dependencia">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Cargo<span style="color:red">*</span></v-label>
                <v-text-field 
                  variant="outlined" 
                  color="primary"
                  v-model.trim="state.formData.cargo"
                  @input="state.formData.cargo = validateText(state.formData.cargo.toUpperCase())"
                  :disabled="!permisoEdicion"
                  hide-details
                ></v-text-field>
                <template v-if="addButton && !state.formData.cargo">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Teléfono</v-label>
                <v-text-field
                  type="number"
                  min="0"
                  variant="outlined"
                  color="primary"
                  v-model="state.formData.telefono"
                  :disabled="!permisoEdicion"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Celular<span style="color:red">*</span></v-label>
                <v-text-field 
                  type="number"
                  variant="outlined"
                  color="primary"
                  v-model.trim="state.formData.celular"
                  :disabled="!permisoEdicion"
                  hide-details
                ></v-text-field>
                <template v-if="addButton && !state.formData.celular">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Correo Electrónico</v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  v-model.trim="state.formData.correo_electronico"
                  @input="state.formData.correo_electronico = validateText(state.formData.correo_electronico); validatePerson()"
                  :disabled="!permisoEdicion"
                  hide-details
                ></v-text-field>
                <template v-if="addButton && state.formData.correo_electronico && !testEmail">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      Debe ser un correo válido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12">
                <v-btn
                  class="bg-primary my-3" 
                  block
                  @click= buttonAddInvolved()
                  :disabled="!state.formData.nombres || !state.formData.tipo || !state.formData.id_dependencia || !state.formData.cargo || !state.formData.celular"
                >
                  AGREGAR
                </v-btn>
              </v-col>

            </v-row>  
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-row class="my-3">
        <v-col v-if="state.formData.implicados.length>0" cols="12" md="12">
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-center">#</th>
                <th class="text-center">Número de Documento</th>
                <th class="text-center">Nombres y Apellidos</th>
                <th class="text-center">Tipo</th>
                <th class="text-center">Cargo</th>
                <th class="text-center">Dependencia</th>
                <th class="text-center">Teléfono</th>
                <th class="text-center">Celular</th>
                <th class="text-center">Correo electrónico</th>
                <th class="text-center" v-if="permisoEdicion">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in state.formData.implicados"
                :key="index"
              >
                <td class="text-center">{{ index+1 }}</td>
                <td class="text-center">{{ item.cedula_identidad }}</td>
                <td class="text-center">{{ item.nombres }} {{ item.apellido_paterno }} {{ item.apellido_materno }}</td>
                <td class="text-center">{{ item.tipo }}</td>
                <td class="text-center">{{ item.cargo }}</td>
                <td class="text-center">{{ item.nombre_dependencia }}</td>
                <td class="text-center">{{ item.telefono }}</td>
                <td class="text-center">{{ item.celular }}</td>
                <td class="text-center">{{ item.correo_electronico }}</td>
                <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteInvolved(index)"/></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <template v-if="submitButton && state.formData.implicados.length == 0">
        <div class="text-center v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            Debe registrar información del Personal Asignado a Entrega
          </div>
        </div>
      </template>
      <template v-if="submitButton && state.formData.implicados.length != 0 && !state.formData.investigador_presente">
        <div class="text-center v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            Debe registrar información del Investigador
          </div>
        </div>
      </template>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" class="text-lg-right pt-5">
      <template v-if="!isLoading">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
        <v-btn color="primary" @click="buttonSendForm()">
          <template v-if="route.params.id_caso == '0'">
            Enviar    
          </template>
          <template v-if="route.params.id_caso != '0' && permisoEdicion">
            Actualizar
          </template>
          <template v-if="route.params.id_caso != '0' && !permisoEdicion">
            Imprimir
          </template>
        </v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" disabled>
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
