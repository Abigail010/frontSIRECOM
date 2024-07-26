<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { useResourceStore } from '@/stores/resource';
import { useInstanceStore } from '@/stores/moduleOne/instance';
import { useDocumentaryReceptionStore } from '@/stores/moduleOne/documentaryReception';
import Swal from 'sweetalert2'
import { format  } from 'date-fns'
// import { lista } from "../instance/region.json";
import viewPdf from '../viewPdf.vue';

  const resourceStore = useResourceStore()
  const instanceStore = useInstanceStore()
  const documentaryReceptionStore = useDocumentaryReceptionStore()
  const route = useRoute()
  const page = ref({ title: 'Revisión Documental' });
  const id_caso = ref();
  const id_recepcion_documental = ref()
  const id_bien = ref();
  const id_bien_registro = ref();

  const docAcreditacion = ref(false);
  const docInventario = ref(false);
  const docMemorandum = ref(false);
  const docActa = ref(false);
  const docInoperables = ref(false);
  const docDeposito = ref(false);
  const docInforme = ref(false);
  const docOtros = ref(false);
  const docDispensable = ref(false)

  const formAcreditacion = ref(false)
  const formInventario = ref(false)
  const formMemorandum = ref(false)
  const formActa = ref(false)
  const formInoperables = ref(false)
  const formDeposito = ref(false)
  const formInforme = ref(false)
  const formOtros = ref(false)
  const formDispensables = ref(false)

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

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });

  // LISTA DE OBSERVACIONES
  const lista_observaciones = ref([])
  const getDocumentaryReviewObservationList = async() => {
    lista_observaciones.value = await resourceStore.getDocumentaryReviewObservations()
  }

  const tipoBien = ref('')
  const getPropertiesList = async (id_bien:number) => {
    // OBTENEMOS EL LISTADO DE BIENES
    const properties = await resourceStore.getProperties()
    const bien:any = properties.find( (register: any) => register.id === id_bien )
    // GUARDAMOS EN LA VARIABLE tipoBien EL NOMBRE DEL BIEN ACTUAL
    tipoBien.value = bien.nombre_bien

    // EVALUAMOS EL BIEN Y QUE FORMULARIOS DEBEN APARECER
    if(bien.nombre_bien == 'VEHICULOS'
    || bien.nombre_bien == 'INMUEBLES'
    || bien.nombre_bien == 'AERONAVES'
    || bien.nombre_bien == 'SEMOVIENTES'
    || bien.nombre_bien == 'JOYAS'
    || bien.nombre_bien == 'CONSUMIBLES'
    || bien.nombre_bien == 'EMBARCACIONES'
    || bien.nombre_bien == 'OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS'
    || bien.nombre_bien == 'EQUIPOS ELECTRONICOS'){
      formAcreditacion.value = true
      formInventario.value = true
      formMemorandum.value = true
      formActa.value = true
    }
    if(bien.nombre_bien == 'DINERO Y VALORES'){
      formAcreditacion.value = true
      formMemorandum.value = true
      formDeposito.value = true
      formActa.value = true
    }
    if(bien.nombre_bien == 'SUSTANCIAS CONTROLADAS'){
      formAcreditacion.value = true
      formInforme.value = true
      formMemorandum.value = true
      formActa.value = true
    }
    if(bien.nombre_bien == 'OTROS BIENES'){
      formAcreditacion.value = true
      formInventario.value = true
      formMemorandum.value = true
      formActa.value = true
      formOtros.value = true
      // formInoperables.value = true
    }
  }

  // OBTENEMOS EL LISTADO DE RECEPCIONES DOCUMENTALES
  const recepciones = ref([]) as any
  const getDocumentaryReceptionsByCase = async() => {
    recepciones.value = await documentaryReceptionStore.documentaryReceptionsByCase(route.params.id_caso)
  }

  // LISTA DE DEPARTAMENTOS
  const lista_departamentos = ref([]) as any
  const getDepartmentList = async () => {
    lista_departamentos.value = await resourceStore.getDepartments()
  }

  // LISTA DE PROVINCIAS
  const lista_provincias = ref([]) as any
  const getProvinceList = async (department: any) => {
    acreditacion.acrData.provincia = ''
    acreditacion.acrData.municipio = ''
    lista_provincias.value = await resourceStore.getProvinces(department)
    lista_municipios.value = []
  }

  // LISTA DE MUNICIPIOS
  const lista_municipios = ref([]) as any
  const getMunicipalityList = async (province: any) => {
    acreditacion.acrData.municipio = ''
    lista_municipios.value = await resourceStore.getMunicipalities(province)
  }

  // LISTA DE JUZGADOS POR DEPARTAMENTO
  const lista_juzgados = ref([]) as any
  const getCourtByDepartmentList = async (department: any) => {
    acreditacion.acrData.juzgado = ''
    lista_juzgados.value = await resourceStore.getCourtsByDepartment(department)
  }

  // OBTENEMOS LA LISTA DE DOCUMENTOS REQUERIDA PARA EL BIEN ACTUAL
  const getDocumentationTypeRequiredList =async (id_bien:number) => {
    const { respuesta } = await instanceStore.getDocumentationTypeRequired(id_bien)
    // console.log(respuesta);
    // console.log('doc req de bien',respuesta);
    // POR CADA REGISTRO QUE SE ENCUENTRA EN EL ARRAY VERIFICAREMOS SI SE TIENEN EL NOMBRE DE ESTOS ELEMENTOS
    // Y SI SE ENCUENTRA, SE IRA SETEANDO EL ID DE ESTOS REGISTROS EN LOS FORMULARIOS CREADOS DE FRONT
    respuesta.forEach((element:any) => {
      switch (element.nombre_tipo_documentacion) {
        case 'ACREDITACION DE LA SITUACION JURIDICA DEL BIEN SUJETO DE ENTREGA':
          acreditacion.acrData.id_tipo_documento = element.id_tipo_documentacion
        break;
        case 'INVENTARIO':
          inventario.invData.id_tipo_documento = element.id_tipo_documentacion
        break;
        case 'COPIA SIMPLE DE MEMORANDUM Y/O CREDENCIAL DEL RESPONSABLE DE LA ENTREGA':
          memorandum.memData.id_tipo_documento = element.id_tipo_documentacion
        break;
        case 'ACTA DE ENTREGA':
          acta.actData.id_tipo_documento = element.id_tipo_documentacion
        break; 
        case 'INFORME DE MUEBLES INOPERABLES O DE DIFICIL TRASLADO':
          inoperable.inoData.id_tipo_documento = element.id_tipo_documentacion
        break;
        case 'BOLETA DE DEPOSITO ORIGINAL':
          deposito.depData.id_tipo_documento = element.id_tipo_documentacion
        break; 
        case 'INFORME CITESC - IDIF':
          informe.infData.id_tipo_documento = element.id_tipo_documentacion
        break;
        case 'OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZON A LA NATURALEZA DEL BIEN':
          otros.otrData.id_tipo_documento = element.id_tipo_documentacion
        break;
        default:
          break;
      }
    });
  }
  
  // LISTADO DE TIPOS DE ACREDITACION JURIDICA
  const acreditacionLista = ref([
    {
      id: "1",
      nombre_acreditacion: "ACTA DE SECUESTRO",
      nombre_estado_juridico: "SECUESTRADO",
      // ejecutoriado: false
      ejecutoriado: null
    },
    {
      id: "2",
      nombre_acreditacion: "RESOLUCIÓN DE INCAUTACIÓN",
      nombre_estado_juridico: "INCAUTADO",
      // ejecutoriado: false
      ejecutoriado: null
    },
    {
      id: "3",
      nombre_acreditacion: "RESOLUCIÓN DE CONFISCACIÓN",
      nombre_estado_juridico: "CONFISCADO",
      ejecutoriado: null
      // ejecutoriado: true/false
      // ejecutoriado: true
    },
    {
      id: "4",
      nombre_acreditacion: "RESOLUCIÓN DE PERDIDA DE DOMINIO",
      nombre_estado_juridico: "CONFISCADO",
      ejecutoriado: null
      // ejecutoriado: true/false
      // ejecutoriado: true
    }
  ]);

  const listaEjecutoriado = ref([
    {
      title: 'SI',
      value: true
    },
    {
      title: 'NO',
      value: false
    },
  ])
  
  // FORMULARIO DE ACREDITACION DE LA SITUACION JURIDICA
  const acreditacion = reactive({
    acrData: {
      acreditacionValor: [] as any,
      fechaDocumento: '',
      departamento: '',
      provincia: '',
      municipio: '',
      juzgado: '',
      fileAcreditacion: [],
      observacionAcreditacion: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA ACREDITACION DE LA SITUACION JURIDICA
  const listaAcreditaciones = ref([]) as any;
  const listaAcreditacion = async (id:number) =>{
    // OBTIENE EL LISTADO TOTAL DE REGISTROS DEL BIEN_REGISTRO CON id
    const {data} = await instanceStore.getListAcreditation(id)
    // FILTRA LOS REGISTROS QUE TENGAN EL NOMBRE DE DOCUMENTO ACREDITACION DE LA SITUACION JURIDICA
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "ACREDITACION DE LA SITUACION JURIDICA DEL BIEN SUJETO DE ENTREGA")
    listaAcreditaciones.value = id_nombre
    // console.log('lista acred',listaAcreditaciones.value);
  }

  // FUNCION PARA AGREGAR REGISTRO DE ACREDITACION DE LA SITUACION JURIDICA
  const agregarAcreditacion = async() => {
    if(id_recepcion_documental.value){
      if(docAcreditacion.value && acreditacion.acrData.fileAcreditacion.length == 0){
        Toast.fire({ icon: 'info', title: 'Cargar un documento antes de enviar' })
      }else{
        const response = await instanceStore.updateLegalStatus({
          val : acreditacion.acrData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({
          icon: 'success',
          title: `${response?.message}`
        })
        await listaAcreditacion(id_bien_registro.value)
        limpiarAcreditacion()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE ACREDITACION DE LA SITUACION JURIDICA
  const limpiarAcreditacion = () => {
    acreditacion.acrData.acreditacionValor = [],
    acreditacion.acrData.fechaDocumento='',
    acreditacion.acrData.juzgado='',
    acreditacion.acrData.departamento='',
    acreditacion.acrData.municipio='',
    acreditacion.acrData.provincia='',
    acreditacion.acrData.fileAcreditacion = [],
    acreditacion.acrData.observacionAcreditacion=''
    docAcreditacion.value=false
  }

  // FORMULARIO DE INVENTARIO
  const inventario = reactive({
    invData: {
      presenta: false,
      file_inventario: [],
      observacion_inventario: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA INVENTARIO
  const listaInventarios = ref([]) as any;
  const listaInventario = async (id:number) =>{
    const {data} = await instanceStore.getListAcreditation(id)
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "INVENTARIO")
    listaInventarios.value=id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE INVENTARIO
  const agregarInventario = async() => {
    if(id_recepcion_documental.value){
      if(docInventario.value && inventario.invData.file_inventario.length == 0){
        Toast.fire({ icon: 'info', title: 'Cargar un documento antes de enviar' })
      }else{
        inventario.invData.presenta = docInventario.value
        const response = await instanceStore.uploadInventory({
          val : inventario.invData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({ icon: 'success', title: `${response?.message}` })
        await listaInventario(id_bien_registro.value)
        limpiarInventario()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE INVENTARIO
  const limpiarInventario = () => {
    inventario.invData.presenta = false
    inventario.invData.file_inventario = [],
    inventario.invData.observacion_inventario = ''
    docInventario.value = false
  }

  // FORMULARIO DE COPIA SIMPLE
  const memorandum = reactive({
    memData: {
      presenta: false,
      file_copia_simple: [],
      observacion_copia_simple: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA COPIA SIMPLE DE MEMORANDUM
  const listaMemorandums = ref([]) as any;
  const listaMemorandum = async (id:number) =>{
    const {data} = await instanceStore.getListAcreditation(id)
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "COPIA SIMPLE DE MEMORANDUM Y/O CREDENCIAL DEL RESPONSABLE DE LA ENTREGA")
    listaMemorandums.value=id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE COPIA SIMPLE DE MEMORANDUM
  const agregarMemorandum = async() => {
    if(id_recepcion_documental.value){
      if(docMemorandum.value && memorandum.memData.file_copia_simple.length == 0){
        Toast.fire({ icon: 'info', title: 'Debe cargar un documento antes de enviar' })
      }else{
        memorandum.memData.presenta = docMemorandum.value
        const response = await instanceStore.uploadSimpleCopy({
          val : memorandum.memData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({ icon: 'success', title: `${response?.message}` })
        await listaMemorandum(id_bien_registro.value)
        limpiarMemorandum()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE COPIA SIMPLE
  const limpiarMemorandum = () => {
    memorandum.memData.presenta = false,
    memorandum.memData.file_copia_simple = [],
    memorandum.memData.observacion_copia_simple = ''
    docMemorandum.value = false
  }
  
  // FORMULARIO DE ACTA DE ENTREGA
  const acta = reactive({
    actData: {
      presenta: false,
      file_acta_entrega: [],
      observacion_acta_entrega: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA ACTA DE ENTREGA
  const listaActas = ref([]) as any;
  const listaActa = async (id:number) =>{
    const {data} = await instanceStore.getListAcreditation(id)
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "ACTA DE ENTREGA")
    listaActas.value=id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE ACTA DE ENTREGA
  const agregarActa = async() => {
    if(id_recepcion_documental.value){
      if(docActa.value && acta.actData.file_acta_entrega.length == 0){
        Toast.fire({ icon: 'info', title: 'Debe cargar un documento antes de enviar' })
      }else{
        acta.actData.presenta = docActa.value
        const response = await instanceStore.uploadActa({
          val : acta.actData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({
          icon: 'success',
          title: `${response?.message}`
        })
        await listaActa(id_bien_registro.value)
        limpiarActa()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE ACTA DE ENTREGA
  const limpiarActa = () => {
    acta.actData.presenta = false,
    acta.actData.file_acta_entrega = [],
    acta.actData.observacion_acta_entrega = ''
    docActa.value = false
  }
  
  // FORMULARIO DE INFORME DE MUEBLES INOPERABLES
  const inoperable = reactive({
    inoData: {
      presenta: false,
      file_mueble_inoperable: [],
      observacion_mueble_inoperable: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA INFORME DE MUEBLES INOPERABLES
  const listaInoperables = ref([]) as any;
  const listaInoperable = async (id:number) =>{
    const {data} = await instanceStore.getListAcreditation(id)
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "INFORME DE MUEBLES INOPERABLES O DE DIFICIL TRASLADO")
    listaInoperables.value=id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE INFORME DE MUEBLES INOPERABLES
  const agregarInoperable = async() => {
    if(id_recepcion_documental.value){
      if(docInoperables.value && inoperable.inoData.file_mueble_inoperable.length == 0){
        Toast.fire({ icon: 'info', title: 'Debe cargar un documento antes de enviar' })
      }else{
        inoperable.inoData.presenta = docInoperables.value
        const response = await instanceStore.uploadInoperableFurniture({
          val : inoperable.inoData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({ icon: 'success', title: `${response?.message}` })
        await listaInoperable(id_bien_registro.value)
        limpiarInoperable()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE INFORME DE MUEBLES INOPERABLES
  const limpiarInoperable = () => {
    inoperable.inoData.presenta = false,
    inoperable.inoData.file_mueble_inoperable = [],
    inoperable.inoData.observacion_mueble_inoperable = ''
    docInoperables.value = false
  }

  // FORMULARIO DE BOLETA DE DEPOSITO
  const deposito = reactive({
    depData: {
      presenta: false,
      file_boleta_deposito: [],
      observacion_boleta_deposito: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA BOLETA DE DEPOSITO
  const listaDepositos = ref([]) as any;
  const listaDeposito = async (id:number) =>{
    const {data} = await instanceStore.getListAcreditation(id)
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "BOLETA DE DEPOSITO ORIGINAL")
    listaDepositos.value=id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE BOLETA DE DEPOSITO
  const agregarDeposito = async() => {
    if(id_recepcion_documental.value){
      if(docDeposito.value && deposito.depData.file_boleta_deposito.length == 0){
        Toast.fire({ icon: 'info', title: 'Debe cargar un documento antes de enviar' })
      }else{
        deposito.depData.presenta = docDeposito.value
        const response = await instanceStore.uploadDepositTicket({
          val : deposito.depData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({ icon: 'success', title: `${response?.message}` })
        await listaDeposito(id_bien_registro.value)
        limpiarDeposito()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE BOLETA DE DEPOSITO
  const limpiarDeposito = () => {
    deposito.depData.presenta = false,
    deposito.depData.file_boleta_deposito = [],
    deposito.depData.observacion_boleta_deposito = ''
    docDeposito.value = false
  }

  // FORMULARIO DE INFORME
  const informe = reactive({
    infData: {
      presenta: false,
      file_informe: [],
      observacion_informe: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA INFORME CITESC - IDIF
  const listaInformes = ref([]) as any;
  const listaInforme = async (id:number) =>{
    const {data} = await instanceStore.getListAcreditation(id)
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "INFORME CITESC - IDIF")
    listaInformes.value = id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE INFORME CITESC - IDIF
  const agregarInforme = async() => {
    if(id_recepcion_documental.value){
      if(docInforme.value && informe.infData.file_informe.length == 0){
        Toast.fire({ icon: 'info', title: 'Debe cargar un documento antes de enviar' })
      }else{
        informe.infData.presenta = docInforme.value
        const response = await instanceStore.uploadcitescInformation({
          val : informe.infData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({ icon: 'success', title: `${response?.message}` })
        await listaInforme(id_bien_registro.value)
        limpiarInforme()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE BOLETA DE DEPOSITO
  const limpiarInforme = () => {
    informe.infData.presenta = false,
    informe.infData.file_informe = [],
    informe.infData.observacion_informe = ''
    docInforme.value = false
  }

  // FORMULARIO DE OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZON A LA NATURALEZA DEL BIEN
  const otros = reactive({
    otrData: {
      presenta: false,
      file_otro: [],
      observacion_otro: '',
      id_tipo_documento: ''
    },
  });

  // FUNCION PARA OBTENER LOS REGISTROS PARA OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZON A LA NATURALEZA DEL BIEN
  const listaOtros = ref([]) as any;
  const listaOtro = async (id:number) =>{
    const {data} = await instanceStore.getListAcreditation(id)
    const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion === "OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZON A LA NATURALEZA DEL BIEN")
    listaOtros.value=id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZON A LA NATURALEZA DEL BIEN
  const agregarOtro = async() => {
    if(id_recepcion_documental.value){
      if(docOtros.value && otros.otrData.file_otro.length == 0){
        Toast.fire({ icon: 'info', title: 'Debe cargar un documento antes de enviar' })
      }else{
        otros.otrData.presenta = docOtros.value
        const response = await instanceStore.uploadOthers({
          val : otros.otrData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({ icon: 'success', title: `${response?.message}` })
        await listaOtro(id_bien_registro.value)
        limpiarOtro()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepcion documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZON A LA NATURALEZA DEL BIEN
  const limpiarOtro = () => {
    otros.otrData.presenta = false,
    otros.otrData.file_otro = [],
    otros.otrData.observacion_otro = ''
    docOtros.value = false
  }

  // FORMULARIO DE DISPENSABLE
  const dispensable = reactive({
    disData: {
      presenta: false,
      file_dispensable: [],
      observacion_dispensable: '',
      id_tipo_documento: ''
    },
  })

  // FUNCION PARA OBTENER LOS REGISROS DE DOCUMENTOS DISPENSABLES
  const listaDispensables = ref([]) as any
  const listaDispensable = async (id:number) => {
    const { data } = await instanceStore.getListAcreditation(id)
    const id_nombre: any = data.respuesta.filter(
      (val:any) => val.nombre_tipo_documentacion === 'DISPENSABLE'
    )
    listaDispensables.value = id_nombre
  }

  // FUNCION PARA AGREGAR REGISTRO DE DOCUMENTOS DISPENSABLES
  const agregarDispensable = async() => {
    if(id_recepcion_documental.value){
      if(docDispensable.value && dispensable.disData.file_dispensable.length == 0){
        console.log(docDispensable.value)
        console.log(dispensable.disData.file_dispensable.length);
        Toast.fire({ icon: 'info', title: 'Cargar un documento antes de enviar' })
      }else{
        dispensable.disData.presenta = docDispensable.value
        const response = await instanceStore.uploadDispensable({
          val : dispensable.disData,
          id_caso : id_caso,
          id_recepcion_documental : id_recepcion_documental,
          id_bien_registro : id_bien_registro
        })
        Toast.fire({ icon: 'success', title: `${response?.message}` })
        await listaDispensable(id_bien_registro.value)
        limpiarDispensable()
      }
    }else{
      Toast.fire({ icon: 'info', title: 'Seleccionar un cite de recepción documental' })
    }
  }

  // FUNCION PARA LIMPIAR FORMULARIO DE DISPENSABLE
  const limpiarDispensable = () => {
    dispensable.disData.presenta = false
    dispensable.disData.file_dispensable = []
    dispensable.disData.observacion_dispensable = ''
    docDispensable.value = false
  }

  // FUNCION DE ENFOQUE EN INPUT FECHA RECEPCION EN ACREDITACION DE SITUACION JURIDICA
  const focoSiguiente = () =>{
    const date = <HTMLElement>document.getElementById("date-form")
    date.focus()
  }

  // FUNCION PARA ABRIR MODAL
  const modalViewPdf = ref<any>(null);
  const openModal = async(id:any) =>{
    id_file.value = id;
    dialog.value = true;
    await modalViewPdf.value.showModal(id_file.value);
  }

  // FUNCION PARA CERRAR MODAL
  const closeModal = (value : any) =>{
    dialog.value = value.dialog
    id_file.value = value.value
  }

  const buttonReturnList = () => {
    router.push({ name: 'bienFile', params: { id: route.params.id_caso }})
  }

  // FUNCION PARA ELIMINAR REGISTRO --> PENDIENTE
  const deleteRecord = async (id:number) => {
    Swal.fire({
      title: 'Estas seguro?',
      text: "No se podra revertir el cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await instanceStore.deleteFile(id)
        Swal.fire(
          'Eliminado!',
          'Archivo eliminado correctamente.',
          'success'
        )
        await listaAcreditacion(id_bien_registro.value)
        await listaInventario(id_bien_registro.value)
        await listaMemorandum(id_bien_registro.value)
        await listaActa(id_bien_registro.value)
        await listaInoperable(id_bien_registro.value)
        await listaDeposito(id_bien_registro.value)
        await listaInforme(id_bien_registro.value)
        await listaOtro(id_bien_registro.value)
        await listaDispensable(id_bien_registro.value)
      }
    })
  }

  // const getName = (id:any) => {
  //   const response = lista.find( val => val.id === id)
  //   return response?.nombre_region
  // }

  const getLiteralDate = (date:any) => {
    if(date === null){
      return '--'
    }else{
      var options:any = { year: 'numeric', month: 'long', day: 'numeric' };
      const value = new Date(date);
      return value.toLocaleDateString('es-ES', options)
    }
  }

  watch(docAcreditacion, (newUsername) => {
    if(!docAcreditacion.value){
      limpiarAcreditacion();
    }else{
      //state.formData.observacionAcreditacion=''
    }
  });

  watch(docInventario, (newUsername) => {
    if(!docInventario.value){
      limpiarInventario()
    }else{
      //state.formData.observacionInventario = ''
    }
  });

  watch(docMemorandum, (newUsername) => {
    if(!docMemorandum.value){
      limpiarMemorandum()
    }else{
      //state.formData.observacionmemorandum=''
    }
  });

  watch(docActa, (newUsername) => {
    if(!docActa.value){
      limpiarActa()
    }else{
      //state.formData.observacionmemorandum=''
    }
  });

  watch(docInoperables, (newUsername) => {
    if(!docInoperables.value){
      limpiarInoperable()
    }else{
      //state.formData.observacionmemorandum=''
    }
  });

  watch(docDeposito, (newUsername) => {
    if(!docDeposito.value){
      limpiarDeposito()
    }else{
      //state.formData.observacionmemorandum=''
    }
  });

  onMounted(() => {
    // con el ID cargar la data
    getDocumentaryReviewObservationList()
    getPropertiesList(Number(route.params.id_bien))
    getDocumentationTypeRequiredList(Number(route.params.id_bien))
    listaAcreditacion(Number(route.params.id_bien_registro))
    listaInventario(Number(route.params.id_bien_registro))
    listaMemorandum(Number(route.params.id_bien_registro))
    listaActa(Number(route.params.id_bien_registro))
    listaInoperable(Number(route.params.id_bien_registro))
    listaDeposito(Number(route.params.id_bien_registro))
    listaInforme(Number(route.params.id_bien_registro))
    listaOtro(Number(route.params.id_bien_registro))
    listaDispensable(Number(route.params.id_bien_registro))
    id_bien.value = route.params.id_bien
    id_bien_registro.value = route.params.id_bien_registro
    id_caso.value = route.params.id_caso
    
    getDepartmentList()
    getDocumentaryReceptionsByCase()
  })
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <h4 class="mb-5 mt-2 font-weight-light">
    Los campos con <span style="color:red">*</span> son obligatorios
  </h4>

  <!-- SELECTOR DE RECEPCIONES DOCUMENTALES -->
  <div>
    <v-row>
      <v-col cols="12">
        <v-label class="mb-2 font-weight-medium">CITE DE RECEPCION DOCUMENTAL<span style="color:red">*</span>
        </v-label>
        <v-select
          :items="recepciones"
          item-title="cite"
          item-value="id"
          no-data-text="No existe más opciones para seleccionar"
          v-model="id_recepcion_documental"
        />
      </v-col>
    </v-row>
  </div>
  

  <!-- ACREDITACIÓN DE LA SITUACIÓN JURÍDICA DEL BIEN SUJETO DE ENTREGA -->
  <div v-if="formAcreditacion">
    <v-row class="ml-2">
      <h4> ACREDITACIÓN DE LA SITUACIÓN JURÍDICA DEL BIEN SUJETO DE ENTREGA :</h4>
      <v-col cols="12" md="12">
        <h4>¿Presenta el documento?</h4>
        <v-radio-group inline v-model = 'docAcreditacion'>
          <v-radio label="Sí" :value="true"></v-radio>
          <v-radio label="No" :value="false"></v-radio>
        </v-radio-group>
      </v-col>
      <v-row v-if="docAcreditacion"> 

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Acreditación de Situación Jurídica<span style="color:red">*</span>
          </v-label>
          <v-select
            :items="acreditacionLista"
            item-title="nombre_acreditacion"
            item-value="acreditacion"
            return-object
            no-data-text="No existe más opciones para seleccionar"
            v-model="acreditacion.acrData.acreditacionValor"
          />
          <!-- @update:model-value="focoSiguiente()" -->
        </v-col>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Estado Jurídico<span style="color:red">*</span>
          </v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            readonly
            :value=acreditacion.acrData.acreditacionValor.nombre_estado_juridico
          />
        </v-col>

        <template v-if="acreditacion.acrData.acreditacionValor.nombre_estado_juridico == 'CONFISCADO'">
          <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">
              Ejecutoriado<span style="color:red">*</span>
            </v-label>
            <v-select
              :items="listaEjecutoriado"
              item-title="title"
              item-value="value"
              return-object
              no-data-text="No existe más opciones para seleccionar"
              v-model="acreditacion.acrData.acreditacionValor.ejecutoriado"
            />
          </v-col>
        </template>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium" required>
            Fecha Documento<span style="color:red">*</span>
          </v-label>
          <v-text-field 
            type="date"
            id="date-form"
            name="date-form"
            v-model="acreditacion.acrData.fechaDocumento"
            :max="currentDate"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Departamento <span style="color:red">*</span>
          </v-label>
          <v-select
            :items="lista_departamentos"
            item-title="nombre_region"
            item-value="nombre_region"
            no-data-text="No existe opciones para seleccionar"
            v-model="acreditacion.acrData.departamento"
            @update:model-value="getProvinceList(acreditacion.acrData.departamento); getCourtByDepartmentList(acreditacion.acrData.departamento);"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Provincia <span style="color:red">*</span>
          </v-label>
          <v-select
            :items="lista_provincias"
            item-title="nombre_region"
            item-value="nombre_region"
            no-data-text="No existe opciones para seleccionar"
            v-model="acreditacion.acrData.provincia"
            @update:model-value="getMunicipalityList(acreditacion.acrData.provincia);"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Municipio <span style="color:red">*</span>
          </v-label>
          <v-select
            :items="lista_municipios"
            item-title="nombre_region"
            item-value="nombre_region"
            no-data-text="No existe opciones para seleccionar"
            v-model="acreditacion.acrData.municipio"
          />
        </v-col>

        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">
            Juzgado<span style="color:red">*</span>
          </v-label>
          <v-select
            :items="lista_juzgados"
            item-title="nombre_juzgado"
            item-value="nombre_juzgado"
            no-data-text="No existe opciones para seleccionar"
            v-model="acreditacion.acrData.juzgado"
          />
        </v-col>

        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Documento Acreditación de situación Jurídica <span style="color:red">*</span></v-label>
          <v-file-input
            v-model="acreditacion.acrData.fileAcreditacion"
            color="deep-purple-accent-4"
            counter
            accept="application/pdf"
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            :show-size="1000"
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 2"
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
        </v-col>

        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
          <v-select
            :items="lista_observaciones"
            item-title="nombre_observacion"
            item-value="nombre_observacion"
            no-data-text="No existe más opciones para seleccionar"
            v-model='acreditacion.acrData.observacionAcreditacion'
          />
        </v-col>

      </v-row>
      <v-row v-else>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
          <v-select
            :items="lista_observaciones"
            item-title="nombre_observacion"
            item-value="nombre_observacion"
            no-data-text="No existe más opciones para seleccionar"
            v-model='acreditacion.acrData.observacionAcreditacion'
          />
        </v-col>
      </v-row>
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarAcreditacion()"><PlusIcon/>Agregar {{docAcreditacion?'Documento Acreditación':'Observación Documento Acreditación'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaAcreditaciones.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Acreditación Situación Jurídica</th>
              <th class="text-center">Estado Jurídico</th>
              <th class="text-center">Ejecutoriado</th>
              <th class="text-center">Fecha Documento</th>
              <th class="text-center">Departamento</th>
              <th class="text-center">Provincia</th>
              <th class="text-center">Municipio</th>
              <th class="text-center">Juzgado</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Archivo</th>
              <!-- <th class="text-center">Acción</th> -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaAcreditaciones"
              :key="item.id"
            >
              <!-- <td class="text-center">{{ getDescriptionBien(item.id_tipo_bien) }}</td> -->
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cite }}</td>
              <td class="text-center">{{ item.nombre_acreditacion }}</td>
              <td class="text-center">{{ item.estado_juridico }} </td>
              <!-- <td class="text-center">{{ (item.ejecutoriada) ? 'SI' : 'NO' }} </td> -->
              <td class="text-center">{{ (item.ejecutoriada === null) ? '' : (item.ejecutoriada) ? 'SI' : 'NO' }} </td>
              <td class="text-center">{{ getLiteralDate(item?.fecha_documento).toUpperCase() }} </td>
              <td class="text-center">{{ item.departamento }} </td>
              <td class="text-center">{{ item.provincia }} </td>
              <td class="text-center">{{ item.municipio }} </td>
              <td class="text-center">{{ item.juzgado }} </td>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                    <v-icon color="primary"></v-icon>
                  </v-btn>
                  <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                    <v-icon color="error"></v-icon>
                  </v-btn>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>


  <!-- INVENTARIO -->
  <div v-if="formInventario">
    <h4 class="pt-3"> INVENTARIO :</h4>
    <v-col cols="12" md="12">
      <h4>¿Presenta el documento?</h4>
      <v-radio-group inline v-model = 'docInventario'>
        <v-radio label="Sí" :value="true"></v-radio>
        <v-radio label="No" :value="false"></v-radio>
      </v-radio-group>
    </v-col>
    <v-row v-if="docInventario">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Documento Inventario <span style="color:red">*</span></v-label>
        <v-file-input
          v-model="inventario.invData.file_inventario"
          color="deep-purple-accent-4"
          counter
          accept="application/pdf"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
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
      </v-col>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='inventario.invData.observacion_inventario'
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='inventario.invData.observacion_inventario'
        />
      </v-col>      
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarInventario()"><PlusIcon/>Agregar {{docInventario?'Documento Inventario':'Observación Inventario'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaInventarios.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Archivo</th>
              <!-- <th class="text-center">Acción</th> -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaInventarios"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cite }}</td>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-col>
                    <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                      <v-icon color="primary"></v-icon>
                    </v-btn>
                    <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                      <v-icon color="error"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div> 


  <!-- COPIA SIMPLE DE MEMORANDUM Y/O CREDENCIAL DEL RESPONSABLE DE LA ENTREGA -->
  <div v-if="formMemorandum">
    <h4 class="mt-4"> COPIA SIMPLE DE MEMORANDUM Y/O CREDENCIAL DEL RESPONSABLE DE LA ENTREGA :</h4>
    <v-col cols="12" md="12">
      <h4>¿Presenta el documento?</h4>
      <v-radio-group inline v-model = 'docMemorandum'>
        <v-radio label="Sí" :value="true"></v-radio>
        <v-radio label="No" :value="false"></v-radio>
      </v-radio-group>
    </v-col>
    <v-row v-if="docMemorandum">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Documento Copia Simple <span style="color:red">*</span></v-label>
        <v-file-input
          v-model="memorandum.memData.file_copia_simple"
          color="deep-purple-accent-4"
          counter
          accept="application/pdf"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
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
      </v-col>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='memorandum.memData.observacion_copia_simple'
        />
    </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='memorandum.memData.observacion_copia_simple'
        />
      </v-col>      
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarMemorandum()"><PlusIcon/>Agregar {{docInventario?'Copia Simple':'Observación Copia Simple'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaMemorandums.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Archivo</th>
              <!-- <th class="text-center">Acción</th> -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaMemorandums"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cite }}</td>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-col>
                    <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                      <v-icon color="primary"></v-icon>
                    </v-btn>
                    <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                      <v-icon color="error"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>


   <!-- ACTA DE ENTREGA -->
   <div v-if="formActa">
    <h4 class="mt-4"> ACTA DE ENTREGA:</h4>
    <v-col cols="12" md="12">
      <h4>¿Presenta el documento?</h4>
      <v-radio-group inline v-model = 'docActa'>
        <v-radio label="Sí" :value="true"></v-radio>
        <v-radio label="No" :value="false"></v-radio>
      </v-radio-group>
    </v-col>
    <v-row v-if="docActa">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Acta de Entrega <span style="color:red">*</span></v-label>
        <v-file-input
          v-model="acta.actData.file_acta_entrega"
          color="deep-purple-accent-4"
          counter
          accept="application/pdf"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
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
      </v-col>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='acta.actData.observacion_acta_entrega'
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='acta.actData.observacion_acta_entrega'
        />
      </v-col>      
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarActa()"><PlusIcon/>Agregar {{docInventario ? 'Acta de Entrega':'Observación Acta de Entrega'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaActas.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Archivo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaActas"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cite }}</td>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-col>
                    <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                      <v-icon color="primary"></v-icon>
                    </v-btn>
                    <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                      <v-icon color="error"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>


  <!-- INFORME DE MUEBLES INOPERABLES O DE DIFÍCIL TRASLADO -->
  <div v-if="formInoperables">
    <h4 class="mt-4">	INFORME DE MUEBLES INOPERABLES O DE DIFÍCIL TRASLADO :</h4>
    <v-col cols="12" md="12">
          <h4>¿Presenta el documento?</h4>
      <v-radio-group inline v-model = 'docInoperables'>
        <v-radio label="Sí" :value="true"></v-radio>
        <v-radio label="No" :value="false"></v-radio>
      </v-radio-group>
    </v-col>
    <v-row v-if="docInoperables">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Documento Informe Muebles Inoperables :<span style="color:red">*</span></v-label>
        <v-file-input
          v-model="inoperable.inoData.file_mueble_inoperable"
          color="deep-purple-accent-4"
          counter
          accept="application/pdf"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
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
      </v-col>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='inoperable.inoData.observacion_mueble_inoperable'
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='inoperable.inoData.observacion_mueble_inoperable'
        />
      </v-col>      
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarInoperable()"><PlusIcon/>Agregar {{docInventario?'Informe':'Observación de Informe'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaInoperables.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
               <th class="text-center">Observaciones</th>
               <th class="text-center">Archivo</th>
               <!-- <th class="text-center">Acción</th> -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaInoperables"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cite }}</td>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-col>
                    <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                      <v-icon color="success"></v-icon>
                    </v-btn>
                    <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                      <v-icon color="error"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>


  <!-- BOLETA DE DEPÓSITO ORIGINAL -->
  <div v-if="formDeposito">
    <h4 class="mt-4">	BOLETA DE DEPÓSITO ORIGINAL</h4>
      <v-col cols="12" md="12">
            <h4>¿Presenta el documento?</h4>
        <v-radio-group inline v-model = 'docDeposito'>
          <v-radio label="Sí" :value="true"></v-radio>
          <v-radio label="No" :value="false"></v-radio>
        </v-radio-group>
      </v-col>
      <v-row v-if="docDeposito">
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Documento Informe Muebles Inoperables<span style="color:red">*</span></v-label>
          <v-file-input
            v-model="deposito.depData.file_boleta_deposito"
            color="deep-purple-accent-4"
            counter
            accept="application/pdf"
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            :show-size="1000"
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 2"
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
        </v-col>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
          <v-select
            :items="lista_observaciones"
            item-title="nombre_observacion"
            item-value="nombre_observacion"
            no-data-text="No existe más opciones para seleccionar"
            v-model='deposito.depData.observacion_boleta_deposito'
          />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='deposito.depData.observacion_boleta_deposito'
        />
      </v-col>
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarDeposito()"><PlusIcon/>Agregar {{docInventario?'Boleta de Depósito':'Observación de Boleta de Depósito'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaDepositos.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
               <th class="text-center">Observaciones</th>
               <th class="text-center">Archivo</th>
               <!-- <th class="text-center">Acción</th> -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaDepositos"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <th class="text-center">{{ item.cite }}</th>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-col>
                    <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                      <v-icon color="success"></v-icon>
                    </v-btn>
                    <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                      <v-icon color="error"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>


  <!-- INFORME CITESC - IDIF -->
  <div v-if="formInforme">
    <h4 class="mt-4">	INFORME CITESC - IDIF : </h4>
    <v-col cols="12" md="12">
      <h4>¿Presenta el documento?</h4>
      <v-radio-group inline v-model = 'docInforme'>
        <v-radio label="Sí" :value="true"></v-radio>
        <v-radio label="No" :value="false"></v-radio>
      </v-radio-group>
    </v-col>
    <v-row v-if="docInforme">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Informe CITESC - IDIF<span style="color:red">*</span></v-label>
        <v-file-input
          v-model="informe.infData.file_informe"
          color="deep-purple-accent-4"
          counter
          accept="application/pdf"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
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
      </v-col>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='informe.infData.observacion_informe'
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='informe.infData.observacion_informe'
        />
      </v-col>      
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarInforme()"><PlusIcon/>Agregar {{docInventario ? 'Acta de Entrega':'Observación Acta de Entrega'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaInformes.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Archivo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaInformes"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cite }}</td>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-col>
                    <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                      <v-icon color="primary"></v-icon>
                    </v-btn>
                    <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                      <v-icon color="error"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>

  <!-- OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZÓN A LA NATURALEZA DEL BIEN -->
  <div v-if="formOtros">
    <h4 class="mt-4">	OTRO QUE EL RESPONSABLE DISTRITAL DETERMINE EN RAZÓN A LA NATURALEZA DEL BIEN : </h4>
    <v-col cols="12" md="12">
      <h4>¿Presenta el documento?</h4>
      <v-radio-group inline v-model = 'docOtros'>
        <v-radio label="Sí" :value="true"></v-radio>
        <v-radio label="No" :value="false"></v-radio>
      </v-radio-group>
    </v-col>
    <v-row v-if="docOtros">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Otro que el responsable distrital determine en razón a la naturaleza del bien<span style="color:red">*</span></v-label>
        <v-file-input
          v-model="otros.otrData.file_otro"
          color="deep-purple-accent-4"
          counter
          accept="application/pdf"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
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
      </v-col>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='otros.otrData.observacion_otro'
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
        <v-select
          :items="lista_observaciones"
          item-title="nombre_observacion"
          item-value="nombre_observacion"
          no-data-text="No existe más opciones para seleccionar"
          v-model='otros.otrData.observacion_otro'
        />
      </v-col>      
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarOtro()"><PlusIcon/>Agregar {{docOtros ? 'Otros':'Observación Otros'}}</v-btn>
    </div>
    <v-row>
      <v-col  v-if="listaOtros.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Archivo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaOtros"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cite }}</td>
              <!-- <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td> -->
              <td class="text-center">{{ item.observaciones }} </td>
              <td class="text-center">
                <v-row>
                  <v-col>
                    <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                      <v-icon color="primary"></v-icon>
                    </v-btn>
                    <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                      <v-icon color="error"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>

  <!-- DISPENSABLES -->
  <h4 class="mt-4">OTROS DOCUMENTOS: </h4>
  <p class="font-weight-medium text-justify">NO OBLIGATORIOS PARA SU ENTREGA, PERO SU AUSENCIA ES CONSIGNADA BAJO RESPONSABILIDAD</p>
  <p class="font-weight-regular text-justify">
    Comprobante de anotación preventiva (si corresponde)
    <br>
    Informe de retraso y requerimiento fiscal (si corresponde)
    <br>
    Otros que el revisor considere
  </p>
  <v-col cols="12" md="12">
    <h4>¿Presenta el documento?</h4>
    <v-radio-group inline v-model="docDispensable">
      <v-radio label="Sí" :value="true"></v-radio>
      <v-radio label="No" :value="false"></v-radio>
    </v-radio-group>
    <v-row v-if="docDispensable">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
          Otros documentos
        </v-label>
        <v-file-input
          v-model="dispensable.disData.file_dispensable"
          color="deep-purple-accent-4"
          counter
          accept="application/pdf"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
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
      </v-col>
    </v-row>
    <div class="d-flex justify-end mt-5 mb-5" v-if="docDispensable">
      <v-btn color="secondary" @click="agregarDispensable()"><PlusIcon/>Agregar Otros Documentos</v-btn>
    </div>
    <v-row>
      <v-col cols="12" md="12" v-if="listaDispensables.length>0">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
              <th class="text-center">Cite</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Archivo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaDispensables"
              :key="item.id"
            >
            <td class="text-center">{{ index+1 }}</td>
            <td class="text-center">{{ item.cite }}</td>
            <td class="text-center">{{ item.observaciones }}</td>
            <td class="text-center">
              <v-row>
                <v-col>
                  <v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)" v-if="item.nombre_documento">
                    <v-icon color="primary"></v-icon>
                  </v-btn>
                  <v-btn density="compact" icon="mdi-delete" @click="deleteRecord(item.id)">
                    <v-icon color="error"></v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-col>

  <p class="text-lg-right pt-3">
    <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
  </p>
  <viewPdf :dialog="dialog" ref="modalViewPdf" @dialog-off="closeModal"></viewPdf>
</template>