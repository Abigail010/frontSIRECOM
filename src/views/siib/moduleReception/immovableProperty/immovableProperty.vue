<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useImmovablePropertyStore } from '@/stores/moduleOne/immovableProperty';
// import { useVuelidate } from '@vuelidate/core'
// import { required, helpers } from '@vuelidate/validators'
// import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
// import { useValidationErrors } from '@/stores/useValidationErrors';
import pictureCapture from './pictureCapture.vue';  // IMAGENES
import htmlToCanvas from "@/utils/helpers/htmlToCanvas";
import ImageLoad from '../property/imageLoad.vue';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const immovablePropertyStore = useImmovablePropertyStore()
  const zoom = ref(4.5)

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Bien Inmueble',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DE CONSTANTES PARA LECTURA DE FORMULARIO
  let openpanel = ref([0])
  const nuevo = ref(true)
  const dialog = ref<boolean>(false)
  const pictureModal = ref<any>(null)
  const id_bien = route.params.id_bien
  const id_bien_registro = route.params.id_bien_registro
  const nombre_imagen = ref<any>('')
  const myAccessToken = 'pk.eyJ1IjoiYXJpZWwxMTEiLCJhIjoiY2xmaDZpdnZoMHRvNzN1bnZyeXFwazgydyJ9.cgyfEI8x3E4-0Lo7P4t_jw'
  const isLoading = ref(false)

  // DECLARACION DE LAS VARIABLES PARA LAS VALIDACIONES
  const submitButton = ref(false)
  const sendForm = ref(true)
  const sendForm1 = ref(true)
  const sendForm2 = ref(true)
  const sendForm3 = ref(true)
  const sendForm6 = ref(true)
  const sendForm7 = ref(true)
  const sendForm8 = ref(true)
  const tiene_mapa = ref(true)

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    state.formulario_8.fotografias.push({
      id_inmueble_imagen: '',
      id_bien: id_bien,
      id_bien_registro: id_bien_registro,
      nombre_imagen: 'inmueble-general',
      imagen: value.respuesta.imagenBase64,
      picture: value.respuesta.picture,
    })
  }

  // DECLARACION DEL STATE
  const state:any = reactive({
    formData: {
      id_caso: route.params.id_caso
    } as any,
    formulario_1: {
      habitado: '',
      tipo_habitado: '',
      amoblado: '',
      otros: '',
      observaciones: '',
    } as any,
    formulario_2: {
      id_inmueble_tipo: '',
      tipo_construccion: '',
      numero_pisos: '',
      superficie_aproximada: '',
      unidad_medida: '',
      fachada: '',
      color: '',
      numero_medidor_luz: '',
      numero_medidor_agua: '',
      numero_medidor_gas: '',
      numero_folio_partida_matricula: '',
      observaciones: '',
    } as any,
    formulario_3: {
      ciudad: '',
      provincia: '',
      municipio: '',
      zona: '',
      calle_avenida: '',
      calles_colindantes: '',
      numero_puerta: '',
      barrio: '',
      manzano_uv: '',
      latitud: -16.4997452,
      longitud: -68.1297037,
      url_coordenada: '',
      referencias: '',
      zoom: zoom.value,
      confirmado: false
    } as any,
    formulario_4: {
      id_inmueble_ambiente: '',
      nombre_ambiente: '',
      id_inmueble_acabado_albanileria: '',
      nombre_acabado_albanileria: '',
      cantidad: '',
      estado: '',
      observaciones: '',
      ambientes: [] as any,
    } as any,
    formulario_5: {
      id_inmueble_equipamiento: '',
      nombre_equipamiento: '',
      existencia: '',
      cantidad: '',
      estado: '',
      observaciones: '',
      equipamiento: [] as any
    } as any,
    formulario_6: {
      habitable: '',
      escala_cuantitativa: '',
      escala_cualitativa: '',
      observaciones: ''
    } as any,
    formulario_7: {
      departamento: '',
      area: '',
      zona: '',
      valor_unitario: '',
      superficie_aproximada: '',
      avaluo_provisional: ''
    } as any,
    formulario_8: {
      fotografias: []
    }, 
    id_fotografias_eliminadas: []
  });

  // LISTA DE INMUEBLES
  const lista_inmuebles = ref([])
  const getImmovablePropertiesList = async () => {
    lista_inmuebles.value = await resourceStore.getImmovableProperties()
  }

  // LISTA DE DEPARTAMENTOS
  const lista_regiones = ref([]) as any
  const lista_departamentos = ref([]) as any
  const getDepartmentsList = async () => {
    lista_regiones.value = await resourceStore.getPlaces()
    lista_departamentos.value = lista_regiones.value.filter(
      (region: any) => region.tipo == 'DEPARTAMENTO'
    )
  }

  // LISTA DE PROVINCIAS
  const lista_provincias = ref([]) as any
  const getProvinceList = async (department: any) => {
    const padre = lista_departamentos.value.find(
      (region: any) => region.nombre_region == department
    )
    state.formulario_3.provincia = ''
    state.formulario_3.municipio = ''
    lista_provincias.value = lista_regiones.value.filter(
      (region: any) => region.tipo == 'PROVINCIA' && region.padre == padre.id
    )
    lista_municipios.value = []
  }

  // LISTA DE MUNICIPIOS
  const lista_municipios = ref([]) as any
  const getMunicipalityList = async (province: any) => {
    const padre = lista_provincias.value.find(
      (region: any) => region.nombre_region == province
    )
    state.formulario_3.municipio = ''
    lista_municipios.value = lista_regiones.value.filter(
      (region: any) => region.tipo == 'MUNICIPIO' && region.padre == padre.id
    )
  }

  // LISTA DE ACABADOS
  const lista_acabados = ref([]) as any
  const getWallFinishesList = async () => {
    lista_acabados.value = await resourceStore.getWallFinishes()
  }

  // LISTA DE AMBIENTES
  const lista_ambientes = ref([]) as any
  const getEnvironmentsList = async () => {
    lista_ambientes.value = await resourceStore.getEnvironments()
  }

  // LISTA DE EQUIPAMIENTO
  const lista_equipamiento = ref([]) as any
  const getBuildingEquipmentList = async () => {
    lista_equipamiento.value = await resourceStore.getBuildingEquipment()
  }
  
  const lista_estado_inmueble = ref([
    {value: true, title: 'HABITADO'},
    {value: false, title: 'DESHABITADO'}
  ])
  const lista_amoblado = ref([
    {value: true, title: 'SI'},
    {value: false, title: 'NO'}
  ])
  const lista_tipo_habitado = ref([
    {title: 'ANTICRESISTA'},
    {title: 'INQUILINO'},
    {title: 'FAMILIAR DEL IMPUTADO'},
    {title: 'PROPIETARIO'}
  ])
  const lista_tipo_construccion = ref([
    {title: 'ANTIGUA'},
    {title: 'MODERNA'},
    {title: 'PRECARIA'}
  ])
  const lista_estado = ref([
    {title: 'BUENO'},
    {title: 'REGULAR'},
    {title: 'MALO'}
  ]);
  const lista_habitable = ref([
    {value: true, title: 'HABITABLE'},
    {value: false, title: 'INHABITABLE'}
  ])
  const lista_area = ref([
    {title: 'URBANO'},
    {title: 'RURAL'}
  ])
  const lista_fachada = ref([
    {title: 'LADRILLO'},
    {title: 'REVOCADA'},
    {title: 'PINTADA'}
  ])
  const lista_unidad = ref([
    {value: 'ha', title: 'HECTÁREA [ha]'},
    {value: 'm', title: 'METRO [m²]'},
  ])
  const lista_zona: any = ref([])
  const lista_avaluo = ref([])

  const lista_escala = ref([
    {escala_cuantitativa:"0", escala_cualitativa: '0 - MALO'},
    {escala_cuantitativa:"1", escala_cualitativa: '1 - MALO'},
    {escala_cuantitativa:"2", escala_cualitativa: '2 - MALO'},
    {escala_cuantitativa:"3", escala_cualitativa: '3 - MALO'},
    {escala_cuantitativa:"4" , escala_cualitativa: '4 - MALO'},
    {escala_cuantitativa:"5" , escala_cualitativa: '5 - REGULAR'},
    {escala_cuantitativa:"6" , escala_cualitativa: '6 - REGULAR'},
    {escala_cuantitativa:"7" , escala_cualitativa: '7 - REGULAR'},
    {escala_cuantitativa:"8" , escala_cualitativa: '8 - BUENO'},
    {escala_cuantitativa:"9" , escala_cualitativa: '9 - BUENO'},
    {escala_cuantitativa:"10" , escala_cualitativa: '10 - BUENO'},
  ]);

  // REGISTRO DE LATITUD LONGITUD EN BASE A BUCADOR DE MAP BOX
  const pushResultMeeting = (data: any) => {
    state.formulario_3.confirmado = false
    state.formulario_3.longitud = data.center[0].toFixed(8)
    state.formulario_3.latitud = data.center[1].toFixed(8)
    state.formulario_3.url_coordenada = 'https://maps.google.com/?q=' + data.center[1].toFixed(8) + ',' + data.center[0].toFixed(8)
  };

  // ACTUALIZACIÓN DE LATITUD LONGITUD EN BASE A ARRASTRE DEL PUNTERO MAP BOX
  const newPositionMeeting = (data: any) => {
    state.formulario_3.confirmado = false
    state.formulario_3.longitud = data.target._lngLat.lng.toFixed(8)
    state.formulario_3.latitud = data.target._lngLat.lat.toFixed(8)
    state.formulario_3.url_coordenada = 'https://maps.google.com/?q=' + data.target._lngLat.lat.toFixed(8) + ',' + data.target._lngLat.lng.toFixed(8)
  };

  const setMapZoom = async (data: any) => {
    const resultado = await immovablePropertyStore.immovableProperty(Number(id_bien_registro))
    if(resultado.formulario_3.zoom){
      data.setZoom(resultado.formulario_3.zoom)
      data.setCenter([state.formulario_3.longitud, state.formulario_3.latitud])
      state.formulario_3.confirmado = true
    }
  }

  const updateZoom = (data: any) => {
    state.formulario_3.confirmado = false
    zoom.value = data.target.transform._zoom
  };

  const capturarImagen = async () => {
    if(state.formulario_3.confirmado){
      html2canvas(document.getElementById("mapa")).then( function (canvas) {
        const image64 = canvas.toDataURL("image/jpeg", 0.9)

        const pos = image64.indexOf(';base64,')
        const type = image64.substring(5, pos)
        const b64 = image64.substr(pos + 8)

        // DECODIFICANDO BASE64
        const imageContent = atob(b64)
        
        // CREANDO UN ARRAYBUFFER Y UNA VISTA COMO 8-BIT
        const buffer = new ArrayBuffer(imageContent.length)
        const view = new Uint8Array(buffer)

        // LLENAR VIEW UTILIZANDO EL BASE64 DECODIFICADO
        for (let i = 0; i < imageContent.length; i++) {
          view[i] = imageContent.charCodeAt(i)
        }

        // CONVERTIR ARRAYBUFFER A BLOB
        const blob = new Blob([buffer], { type: type })

        // CONVERTIREMOS A ARCHIVO
        const archivo = new File(
          [blob],
          new Date().getTime()+'-'+'inmueble-mapa'+'.'+'jpeg',
          { type: 'image/jpeg' }
        )

        // VERIFICACION DE SI EXISTE EL REGISTRO
        let index
        for (let i = 0; i < state.formulario_8.fotografias.length; i++) {
          // console.log(state.formulario_8.fotografias[i]);
          if(state.formulario_8.fotografias[i].nombre_imagen){
            if(state.formulario_8.fotografias[i].nombre_imagen.includes('mapa')){
              index = i
            }
          }
          
          if(state.formulario_8.fotografias[i].imagen.includes('mapa')){
            index = i
          }
        }
        if(index >= 0){
          state.id_fotografias_eliminadas.push(state.formulario_8.fotografias[index].id_inmueble_imagen)
          state.formulario_8.fotografias.splice(index,1)
        }
        
        state.formulario_8.fotografias.push({
          id_inmueble_imagen: '',
          id_bien: id_bien,
          id_bien_registro: id_bien_registro,
          nombre_imagen: 'inmueble-mapa',
          imagen: image64,
          picture: archivo,
        })
      })
    }
  }
  
  const getImmovablePropertyById = async(id_bien_registro: any) => {
    const resultado = await immovablePropertyStore.immovableProperty(id_bien_registro)
    if(!resultado.nuevo){
      nuevo.value = false

      // FORMULARIO 1 - SITUACION HABITACIONAL
      const formulario_1 = resultado.formulario_1
      state.formulario_1.habitado = formulario_1.habitado
      if(formulario_1.anticresista){
        state.formulario_1.tipo_habitado = 'ANTICRESISTA'
      }
      if(formulario_1.inquilino){
        state.formulario_1.tipo_habitado = 'INQUILINO'
      }
      if(formulario_1.familiar_imputado){
        state.formulario_1.tipo_habitado = 'FAMILIAR DEL IMPUTADO'
      }
      if(formulario_1.propietario){
        state.formulario_1.tipo_habitado = 'PROPIETARIO'
      }
      state.formulario_1.amoblado = formulario_1.amoblado
      state.formulario_1.otros = formulario_1.otros
      state.formulario_1.observaciones = formulario_1.observaciones

      // FORMULARIO 2 - CARACTERISTICAS GENERALES
      const formulario_2 = resultado.formulario_2
      state.formulario_2.id_inmueble_tipo = formulario_2.id_inmueble_tipo
      state.formulario_2.tipo_construccion = formulario_2.tipo_construccion
      state.formulario_2.numero_pisos = formulario_2.numero_pisos
      state.formulario_2.superficie_aproximada = formulario_2.superficie_aproximada
      state.formulario_2.unidad_medida = formulario_2.unidad_medida
      state.formulario_2.fachada = formulario_2.fachada
      state.formulario_2.color = formulario_2.color
      state.formulario_2.numero_medidor_luz = formulario_2.numero_medidor_luz
      state.formulario_2.numero_medidor_agua = formulario_2.numero_medidor_agua
      state.formulario_2.numero_medidor_gas = formulario_2.numero_medidor_gas
      state.formulario_2.numero_folio_partida_matricula = formulario_2.numero_folio_partida_matricula
      state.formulario_2.observaciones = formulario_2.observaciones

      // FORMULARIO 3 - UBICACION - CROQUIS Y COLINDANCIAS
      const formulario_3 = resultado.formulario_3
      getProvinceList(formulario_3.ciudad)
      getMunicipalityList(formulario_3.provincia)
      state.formulario_3.ciudad = formulario_3.ciudad
      state.formulario_3.provincia = formulario_3.provincia
      state.formulario_3.municipio = formulario_3.distrito
      state.formulario_3.zona = formulario_3.zona
      state.formulario_3.calle_avenida = formulario_3.calle_avenida
      state.formulario_3.calles_colindantes = formulario_3.calles_colindantes
      state.formulario_3.numero_puerta = formulario_3.numero_puerta
      state.formulario_3.barrio = formulario_3.barrio
      state.formulario_3.manzano_uv = formulario_3.manzano_uv
      state.formulario_3.latitud = formulario_3.latitud
      state.formulario_3.longitud = formulario_3.longitud
      state.formulario_3.url_coordenada = formulario_3.url_coordenada
      state.formulario_3.referencias = formulario_3.referencias
      
      // FORMULARIO 4 - INVENTARIO - A) ACABADOS DE ALBANILERIA
      const ambientes = resultado.formulario_4.ambientes
      for (let i = 0; i < ambientes.length; i++) {
        state.formulario_4.ambientes.push(ambientes[i])
        lista_ambientes.value = lista_ambientes.value.filter((ambiente: any) => ambiente.id != ambientes[i].id_inmueble_ambiente)
      }

      // FORMULARIO 5 - INVENTARIO - B) ACABADOS DE EQUIPAMIENTO, GRIFERIA Y CARPINTERIA
      const equipamiento = resultado.formulario_5.equipamiento
      for (let i = 0; i < equipamiento.length; i++) {
        state.formulario_5.equipamiento.push(equipamiento[i])
        lista_equipamiento.value = lista_equipamiento.value.filter((equipo: any) => equipo.id != equipamiento[i].id_inmueble_equipamiento)
      }

      // FORMULARIO 6 - CLASIFICACION
      const formulario_6 = resultado.formulario_6
      state.formulario_6.habitable = formulario_6.habitable
      state.formulario_6.escala_cuantitativa = formulario_6.escala_cuantitativa
      state.formulario_6.escala_cualitativa = formulario_6.escala_cualitativa
      state.formulario_6.observaciones = formulario_6.observaciones

      // FORMULARIO 7 - AVALUO PROVISIONAL
      const formulario_7 = resultado.formulario_7
      state.formulario_7.departamento = formulario_7.departamento
      state.formulario_7.area = formulario_7.area
      state.formulario_7.zona = formulario_7.zona
      state.formulario_7.valor_unitario = formulario_7.valor_unitario
      state.formulario_7.superficie_aproximada = formulario_7.superficie_aproximada
      state.formulario_7.avaluo_provisional = formulario_7.avaluo_provisional

      // FORMULARIO 8 - FOTOGRAFIAS
      const fotografias = resultado.formulario_8.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_8.fotografias.push(fotografias[i]) 
      }
    }
  }

  const calculate = () => {
    if(state.formulario_6.escala_cuantitativa != ''){
      if(state.formulario_6.escala_cuantitativa >= 0 && state.formulario_6.escala_cuantitativa <= 4){
        state.formulario_6.escala_cualitativa = 'MALO'
      }
      if(state.formulario_6.escala_cuantitativa > 4 && state.formulario_6.escala_cuantitativa <= 7){
        state.formulario_6.escala_cualitativa = 'REGULAR'
      }
      if(state.formulario_6.escala_cuantitativa > 7 && state.formulario_6.escala_cuantitativa <= 10){
        state.formulario_6.escala_cualitativa = 'BUENO'
      }
    }
  }

  const getZoneList = async () => {
    state.formulario_7.zona = ''
    state.formulario_7.valor_unitario = ''
    state.formulario_7.avaluo_provisional = ''
    lista_avaluo.value = []
    if(state.formulario_7.departamento && state.formulario_7.area){
      if(state.formulario_7.area == 'URBANO'){
        lista_zona.value = [
          {title: 'MARGINAL'},
          {title: 'PROMEDIO'},
          {title: 'EXCLUSIVO'},
          {title: 'COMERCIAL'}
        ]
      }else{
        lista_zona.value = [
          {title: 'FINCA-RANCHO-PARCELA'},
          {title: 'QUINTA-CHACRA-HACIENDA'}
        ]
      }
    }
  }
  
  const setEnvironmentName = () => {
    const registro: any = lista_ambientes.value.find( (ambiente: any) => ambiente.id == state.formulario_4.id_inmueble_ambiente )
    state.formulario_4.nombre_ambiente = registro.nombre_ambiente
  }
  
  const setWallFinishesName = () => {
    const registro: any = lista_acabados.value.find( (acabado: any) => acabado.id == state.formulario_4.id_inmueble_acabado_albanileria )
    state.formulario_4.nombre_acabado_albanileria = registro.nombre_acabado_albanileria
  }

  const buttonAddEnvironment = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_ambientes.value = lista_ambientes.value.filter((ambiente: any) => ambiente.id != state.formulario_4.id_inmueble_ambiente)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_4.ambientes.push({
      id_inmueble_ambiente: state.formulario_4.id_inmueble_ambiente,
      nombre_ambiente: state.formulario_4.nombre_ambiente,
      id_inmueble_acabado_albanileria: state.formulario_4.id_inmueble_acabado_albanileria,
      nombre_acabado_albanileria: state.formulario_4.nombre_acabado_albanileria,
      cantidad: state.formulario_4.cantidad,
      estado: state.formulario_4.estado,
      observaciones: state.formulario_4.observaciones
    })
    state.formulario_4.id_inmueble_ambiente = ''
    state.formulario_4.nombre_ambiente = ''
    state.formulario_4.id_inmueble_acabado_albanileria = ''
    state.formulario_4.nombre_acabado_albanileria = ''
    state.formulario_4.cantidad = ''
    state.formulario_4.estado = ''
    state.formulario_4.observaciones = ''
  }

  const buttonDeleteEnvironment = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO AMBIENTES EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS
    const ambiente = state.formulario_4.ambientes[index]
    lista_ambientes.value.push({
      id: ambiente.id_inmueble_ambiente,
      nombre_ambiente: ambiente.nombre_ambiente
    })
    lista_ambientes.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_ambiente
      const codigo_b = b.nombre_ambiente
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_4.ambientes.splice(index,1)
  }

  const setEquipmentName = () => {
    const registro: any = lista_equipamiento.value.find( (equipo: any) => equipo.id == state.formulario_5.id_inmueble_equipamiento )
    state.formulario_5.nombre_equipamiento = registro.nombre_equipamiento
  }

  const buttonAddEquipment = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_equipamiento.value = lista_equipamiento.value.filter((equipo: any) => equipo.id != state.formulario_5.id_inmueble_equipamiento)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_5.equipamiento.push({
      id_inmueble_equipamiento: state.formulario_5.id_inmueble_equipamiento,
      nombre_equipamiento: state.formulario_5.nombre_equipamiento,
      existencia: state.formulario_5.existencia,
      cantidad: state.formulario_5.cantidad,
      estado: state.formulario_5.estado,
      observaciones: state.formulario_5.observaciones
    })
    state.formulario_5.id_inmueble_equipamiento = ''
    state.formulario_5.nombre_equipamiento = ''
    state.formulario_5.existencia = ''
    state.formulario_5.cantidad = ''
    state.formulario_5.estado = ''
    state.formulario_5.observaciones = ''
  }

  const buttonDeleteEquipment = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO EQUIPAMIENTO EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS
    const equipo = state.formulario_5.equipamiento[index]
    lista_equipamiento.value.push({
      id: equipo.id_inmueble_equipamiento,
      nombre_equipamiento: equipo.nombre_equipamiento
    })
    lista_equipamiento.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_equipamiento
      const codigo_b = b.nombre_equipamiento
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_5.equipamiento.splice(index,1)
  }

  const buttonDeletePicture = (index: number, id_inmueble_imagen: number) => {
    state.id_fotografias_eliminadas.push(id_inmueble_imagen)
    state.formulario_8.fotografias.splice(index,1)
  }

  const appraisalList = async () => {
    state.formulario_7.valor_unitario = ''
    state.formulario_7.avaluo_provisional = ''
    if(state.formulario_7.departamento && state.formulario_7.zona){
      const departamento = state.formulario_7.departamento
      const zona = state.formulario_7.zona
      const appraisals = await resourceStore.getAppraisalsByDepartmentZone(departamento, zona)
      lista_avaluo.value = appraisals
    }
  }

  const appraisalCalculation = () => {
    if(state.formulario_2.superficie_aproximada && state.formulario_7.valor_unitario){
      state.formulario_7.avaluo_provisional = (Number(state.formulario_2.superficie_aproximada) * Number(state.formulario_7.valor_unitario)).toFixed(2)
    }
  }
  
  // MIS VALIDACIONES NUEVAS
  const miValidacion = async () => {
    sendForm.value = true
    sendForm1.value = true
    sendForm2.value = true
    sendForm3.value = true
    sendForm6.value = true
    sendForm7.value = true
    sendForm8.value = true
    tiene_mapa.value = false
    let numero = 0
    if(state.formulario_1.habitado === '' || state.formulario_1.amoblado === ''){
      sendForm.value = false
      sendForm1.value = false
      numero++
    }
    if(!state.formulario_2.tipo_construccion || !state.formulario_2.id_inmueble_tipo || !state.formulario_2.numero_pisos || !state.formulario_2.superficie_aproximada || !state.formulario_2.unidad_medida){
      sendForm.value = false
      sendForm2.value = false
      numero++
    }
    if(!state.formulario_3.ciudad || !state.formulario_3.provincia || !state.formulario_3.municipio || !state.formulario_3.url_coordenada){
      sendForm.value = false
      sendForm3.value = false
      if(numero == 0){
        openpanel.value = [2]
      }
    }

    if(!state.formulario_6.habitable || !state.formulario_6.escala_cuantitativa){
      sendForm.value = false
      sendForm6.value = false
    }

    if(!state.formulario_7.departamento || !state.formulario_7.area || !state.formulario_7.zona || !state.formulario_7.valor_unitario){
      sendForm.value = false
      sendForm7.value = false
    }

    for (let i = 0; i < state.formulario_8.fotografias.length; i++) {
      if(state.formulario_8.fotografias[i].nombre_imagen){
        if(state.formulario_8.fotografias[i].nombre_imagen.includes('mapa')){
          tiene_mapa.value = true
        }
      }
    }

    if(tiene_mapa.value){
      if(state.formulario_8.fotografias.length == 1){
        sendForm.value = false
        sendForm8.value = false
      }
    } else {
      if(state.formulario_8.fotografias.length == 0){
        sendForm.value = false
        sendForm8.value = false
      }
    }
  }

  const buttonReturnList = () => {
    router.back()
  }

  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return
    
    if(!state.formulario_3.confirmado){
      Toast.fire({
        icon: 'info',
        title: 'Confirmar captura de mapa'
      })
      return
    }

    state.formData.id_bien_registro = Number(route.params.id_bien_registro)
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    state.formulario_3.zoom = zoom.value
    state.formData.formulario_3 = state.formulario_3
    state.formData.formulario_4 = state.formulario_4
    state.formData.formulario_5 = state.formulario_5
    state.formData.formulario_6 = state.formulario_6
    state.formulario_7.superficie_aproximada = state.formulario_2.superficie_aproximada
    state.formData.formulario_7 = state.formulario_7
    state.formData.formulario_8 = state.formulario_8
    state.formData.id_fotografias_eliminadas = state.id_fotografias_eliminadas
    isLoading.value = true
    // GUARDADO DEL FORMULARIO
    const { ok, message, id } = nuevo.value ? await immovablePropertyStore.createImmovableProperty(state.formData) : await immovablePropertyStore.updateImmovableProperty(state.formData)

    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      confirmButtonText: 'Ok'
    }).then(() => {
      isLoading.value = false
      router.push({ name: 'bienFile', params: { id:route.params.id_caso } });
    })
    if(id!=0){
      immovablePropertyStore.immovablePropertyReport(id)
    }
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  onMounted( async () => {
    await getImmovablePropertiesList()
    await getDepartmentsList()
    await getWallFinishesList()
    await getEnvironmentsList()
    await getBuildingEquipmentList()
    await getImmovablePropertyById(route.params.id_bien_registro)
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Bienes Inmuebles</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. SITUACIÓN HABITACIONAL</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ESTADO BIEN INMUEBLE</v-label>
                <v-select
                  v-model="state.formulario_1.habitado"
                  :items="lista_estado_inmueble"
                  item-title="title"
                  item-value="value"
                  @input="miValidacion()"
                  :error="submitButton && state.formulario_1.habitado === ''"
                  hide-details
                ></v-select>
                <template v-if="submitButton && state.formulario_1.habitado === ''">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6" v-if="state.formulario_1.habitado">
                <v-label class="font-weight-medium mb-2">TIPO OCUPACION</v-label>
                <v-select
                  v-model="state.formulario_1.tipo_habitado"
                  :items="lista_tipo_habitado"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2" >AMOBLADO</v-label>
                <v-select
                  v-model="state.formulario_1.amoblado"
                  :items="lista_amoblado"
                  item-title="title"
                  item-value="value"
                  @input="miValidacion()"
                  :error="submitButton && state.formulario_1.amoblado === ''"
                  hide-details
                ></v-select>
                <template v-if="submitButton && state.formulario_1.amoblado === ''">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OTROS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.otros"
                  @input="miValidacion(), state.formulario_1.otros = validateText(state.formulario_1.otros.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.observaciones"
                  @input="state.formulario_1.observaciones = validateText(state.formulario_1.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm1">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">2. CARACTERÍSTICAS GENERALES</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO DE CONSTRUCCIÓN</v-label>
                <v-select
                  v-model="state.formulario_2.tipo_construccion"
                  :items="lista_tipo_construccion"
                  item-title="title"
                  item-value="title"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_2.tipo_construccion"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_2.tipo_construccion">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO DE INMUEBLE</v-label>
                <v-select
                  v-model="state.formulario_2.id_inmueble_tipo"
                  :items="lista_inmuebles"
                  item-title="nombre_inmueble"
                  item-value="id"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_2.id_inmueble_tipo"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_2.id_inmueble_tipo">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE PISOS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_2.numero_pisos"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_2.numero_pisos"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_2.numero_pisos">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">SUPERFICIE APROXIMADA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  @update:model-value="appraisalCalculation()"
                  @blur="appraisalCalculation()"
                  v-model="state.formulario_2.superficie_aproximada"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_2.superficie_aproximada"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_2.superficie_aproximada">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MEDIDA DE SUPERFICIE</v-label>
                <v-select
                  v-model="state.formulario_2.unidad_medida"
                  :items="lista_unidad"
                  item-title="title"
                  item-value="value"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_2.unidad_medida"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_2.unidad_medida">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">FACHADA</v-label>
                <v-select
                  v-model="state.formulario_2.fachada"
                  :items="lista_fachada"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">COLOR</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.color"
                  @input="state.formulario_2.color = validateText(state.formulario_2.color.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO MEDIDOR DE LUZ</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.numero_medidor_luz"
                  @input="state.formulario_2.numero_medidor_luz = validateText(state.formulario_2.numero_medidor_luz.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO MEDIDOR DE AGUA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.numero_medidor_agua"
                  @input="state.formulario_2.numero_medidor_agua = validateText(state.formulario_2.numero_medidor_agua.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO MEDIDOR DE GAS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.numero_medidor_gas"
                  @input="state.formulario_2.numero_medidor_gas = validateText(state.formulario_2.numero_medidor_gas.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO FOLIO/PARTIDA/MATRÍCULA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.numero_folio_partida_matricula"
                  @input="state.formulario_2.numero_folio_partida_matricula = validateText(state.formulario_2.numero_folio_partida_matricula.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_2.observaciones"
                  @input="state.formulario_2.observaciones = validateText(state.formulario_2.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm2">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">3. UBICACIÓN - CROQUIS Y COLINDANCIAS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CIUDAD</v-label>
                <v-select
                  v-model="state.formulario_3.ciudad"
                  :items="lista_departamentos"
                  item-title="nombre_region"
                  item-value="nombre_region"
                  @update:model-value="getProvinceList(state.formulario_3.ciudad);"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_3.ciudad"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_3.ciudad">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">PROVINCIA</v-label>
                <v-select
                  v-model="state.formulario_3.provincia"
                  :items="lista_provincias"
                  item-title="nombre_region"
                  item-value="nombre_region"
                  no-data-text="No existe opciones para seleccionar"
                  @update:model-value="getMunicipalityList(state.formulario_3.provincia);"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_3.provincia"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_3.provincia">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MUNICIPIO</v-label>
                <v-select
                  v-model="state.formulario_3.municipio"
                  :items="lista_municipios"
                  item-title="nombre_region"
                  item-value="nombre_region"
                  no-data-text="No existe opciones para seleccionar"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_3.municipio"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_3.municipio">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ZONA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.zona"
                  @input="state.formulario_3.zona = validateText(state.formulario_3.zona.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CALLE O AVENIDA PRINCIPAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.calle_avenida"
                  @input="state.formulario_3.calle_avenida = validateText(state.formulario_3.calle_avenida.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CALLES COLINDANTES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.calles_colindantes"
                  @input="state.formulario_3.calles_colindantes = validateText(state.formulario_3.calles_colindantes.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE PUERTA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model.trim="state.formulario_3.numero_puerta"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">BARRIO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.barrio"
                  @input="state.formulario_3.barrio = validateText(state.formulario_3.barrio.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MANZANO UV</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.manzano_uv"
                  @input="state.formulario_3.manzano_uv = validateText(state.formulario_3.manzano_uv.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">REFERENCIAS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_3.referencias"
                  @input="state.formulario_3.referencias = validateText(state.formulario_3.referencias.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">LATITUD</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="state.formulario_3.latitud"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">LONGITUD</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="state.formulario_3.longitud"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ENLACE GMAPS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="state.formulario_3.url_coordenada"
                  readonly
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_3.url_coordenada"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_3.url_coordenada">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
            </v-row>
            
          </v-expansion-panel-text>
          <v-row class="my-5 mx-5">
            <v-col cols="12" >
              <div style="width: 100%; height: 600px" >
                <mapbox-map 
                  id="mapa"
                  :accessToken="myAccessToken"
                  :center="[ -68.1297037, -16.4997452 ]"
                  :zoom=state.formulario_3.zoom
                  @wheel="updateZoom"
                  @zoom="updateZoom"
                  @loaded="setMapZoom"
                >
                  <mapbox-geocoder-control @result="pushResultMeeting" :marker="false"/>
                  <mapbox-marker
                    :lngLat="[ state.formulario_3.longitud, state.formulario_3.latitud ]"
                    :draggable="true"
                    @dragend="newPositionMeeting"
                  >
                  </mapbox-marker>
                  <mapbox-navigation-control position="bottom-left"/>
                </mapbox-map>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="text-center">
              <h4 class="text-primary">¿Confirmar captura de mapa?</h4>
              <v-radio-group 
                inline
                v-model ="state.formulario_3.confirmado"
                style="display: flex; flex-direction: column; align-items: center;"
                @update:model-value="capturarImagen()"
              >
                <v-radio label="Sí" :value="true" color="secondary"></v-radio>
                <v-radio label="No" :value="false" color="error"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

        </v-expansion-panel>
        <template v-if="submitButton && !sendForm3">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">4. INVENTARIO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <h3 class="my-3 text-primary">A) Acabados de albañilería</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">AMBIENTE</v-label>
                <v-select
                  v-model="state.formulario_4.id_inmueble_ambiente"
                  :items="lista_ambientes"
                  item-title="nombre_ambiente"
                  item-value="id"
                  @update:model-value="setEnvironmentName()"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ACABADO</v-label>
                <v-select
                  v-model="state.formulario_4.id_inmueble_acabado_albanileria"
                  :items="lista_acabados"
                  item-title="nombre_acabado_albanileria"
                  item-value="id"
                  @update:model-value="setWallFinishesName()"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">CANTIDAD</v-label>
                <v-text-field
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model="state.formulario_4.cantidad"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                <v-select
                  v-model="state.formulario_4.estado"
                  :items="lista_estado"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="8">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_4.observaciones"
                  @input="state.formulario_4.observaciones = validateText(state.formulario_4.observaciones.toUpperCase())"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddEnvironment()
                    :disabled="!state.formulario_4.id_inmueble_ambiente || !state.formulario_4.id_inmueble_acabado_albanileria || !state.formulario_4.cantidad || !state.formulario_4.estado">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_4.ambientes.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Ambiente</th>
                      <th class="text-center">Acabado</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Observaciones</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_4.ambientes"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_ambiente }}</td>
                      <td class="text-center">{{ item.nombre_acabado_albanileria }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteEnvironment(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

            <h3 class="my-3 text-primary">B) Acabados de equipamiento, grifería y carpintería</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">EQUIPAMIENTO</v-label>
                <v-select
                  v-model="state.formulario_5.id_inmueble_equipamiento"
                  :items="lista_equipamiento"
                  item-title="nombre_equipamiento"
                  item-value="id"
                  @update:model-value="setEquipmentName()"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">EXISTENCIA</v-label>
                <v-select
                  v-model="state.formulario_5.existencia"
                  :items="lista_amoblado"
                  item-title="title"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">CANTIDAD</v-label>
                <v-text-field
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model="state.formulario_5.cantidad"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                <v-select
                  v-model="state.formulario_5.estado"
                  :items="lista_estado"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="8">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_5.observaciones"
                  @input="state.formulario_5.observaciones = validateText(state.formulario_5.observaciones.toUpperCase())"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddEquipment()
                    :disabled="!state.formulario_5.id_inmueble_equipamiento || state.formulario_5.existencia==='' || !state.formulario_5.cantidad || !state.formulario_5.estado">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_5.equipamiento.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Equipamiento</th>
                      <th class="text-center">Existencia</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Observaciones</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_5.equipamiento"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_equipamiento }}</td>
                      <td class="text-center">{{ item.existencia ? 'SI' : 'NO' }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.observaciones }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteEquipment(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">5. CLASIFICACION</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">HABITABILIDAD</v-label>
                <v-select
                  v-model="state.formulario_6.habitable"
                  :items="lista_habitable"
                  item-title="title"
                  item-value="value"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_6.habitable"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_6.habitable">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">ESCALA</v-label>
                <v-select
                  v-model="state.formulario_6.escala_cuantitativa"
                  :items="lista_escala"
                  item-title="escala_cualitativa"
                  item-value="escala_cuantitativa"
                  @update:model-value="calculate()"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_6.escala_cuantitativa"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_6.escala_cuantitativa">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_6.observaciones"
                  @input="state.formulario_6.observaciones = validateText(state.formulario_6.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm6">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
            <v-expansion-panel-title class="text-h6">6. AVALÚO PROVISIONAL</v-expansion-panel-title>
            <v-expansion-panel-text class="mt-4">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-label class="font-weight-medium mb-2">DEPARTAMENTO</v-label>
                    <v-select
                      v-model="state.formulario_7.departamento"
                      :items="lista_departamentos"
                      item-title="nombre_region"
                      item-value="nombre_region"
                      @update:model-value="getZoneList()"
                      @input="miValidacion()"
                      :error="submitButton && !state.formulario_7.departamento"
                      hide-details
                    ></v-select>
                    <template v-if="submitButton && !state.formulario_7.departamento">
                      <div class="v-messages font-weight-black px-2 py-2">
                        <div class="v-messages__message text-error ">
                          El campo es requerido
                        </div>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="font-weight-medium mb-2">ÁREA</v-label>
                    <v-select
                      v-model="state.formulario_7.area"
                      :items="lista_area"
                      item-title="title"
                      item-value="title"
                      @update:model-value="getZoneList()"
                      @input="miValidacion()"
                      :error="submitButton && !state.formulario_7.area"
                      hide-details
                    ></v-select>
                    <template v-if="submitButton && !state.formulario_7.area">
                      <div class="v-messages font-weight-black px-2 py-2">
                        <div class="v-messages__message text-error ">
                          El campo es requerido
                        </div>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="font-weight-medium mb-2">ZONA</v-label>
                    <v-select
                      v-model="state.formulario_7.zona"
                      :items="lista_zona"
                      item-title="title"
                      item-value="title"
                      @update:model-value="appraisalList()"
                      @input="miValidacion()"
                      :error="submitButton && !state.formulario_7.zona"
                      hide-details
                    ></v-select>
                    <template v-if="submitButton && !state.formulario_7.zona">
                      <div class="v-messages font-weight-black px-2 py-2">
                        <div class="v-messages__message text-error ">
                          El campo es requerido
                        </div>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="font-weight-medium mb-2">VALOR PORCENTUAL</v-label>
                    <v-select
                      v-model="state.formulario_7.valor_unitario"
                      :items="lista_avaluo"
                      item-title="valor_unitario"
                      item-value="valor_unitario"
                      @update:model-value="appraisalCalculation()"
                      @input="miValidacion()"
                      :error="submitButton && !state.formulario_7.valor_unitario"
                      hide-details
                    ></v-select>
                    <template v-if="submitButton && !state.formulario_7.valor_unitario">
                      <div class="v-messages font-weight-black px-2 py-2">
                        <div class="v-messages__message text-error ">
                          El campo es requerido
                        </div>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="font-weight-medium mb-2">SUPERFICIE APROXIMADA</v-label>
                    <v-text-field
                      color="primary"
                      variant="outlined"
                      type="number"
                      v-model="state.formulario_2.superficie_aproximada"
                      readonly
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="font-weight-medium mb-2">AVALUO PROVISIONAL</v-label>
                    <v-text-field
                      color="primary"
                      variant="outlined"
                      type="number"
                      v-model="state.formulario_7.avaluo_provisional"
                      readonly
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm7">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">7. FOTOGRAFIAS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            
            <v-row class="mb-5">
              <v-col cols="12">
                <v-btn class="bg-primary" @click="openModal('inmueble-general')" block>
                  <CloudUploadIcon class="mx-2"></CloudUploadIcon> Subir Imagen
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-if="state.formulario_8.fotografias.length > 0">
              <template v-for="(imagen, index) in state.formulario_8.fotografias">
                <template v-if="imagen.imagen.includes('general') || imagen.nombre_imagen.includes('general')">
                  <v-col cols="12" md="6" >
                    <v-card elevation="10" rounded="md">
                      <div class="text-center py-3">
                        <img :src="imagen.imagen" alt="noImage" height="250"/>
                      </div>
                      <div class="d-flex justify-end mr-3 mt-n3 pb-1">
                        <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index, imagen.id_inmueble_imagen)">
                          <v-avatar size="30" class="text-white">
                            <TrashIcon size="20" />
                          </v-avatar>
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                          >ELIMINAR IMAGEN
                          </v-tooltip>
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>
                </template>
              </template>
            </v-row>

          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm8">
          <v-col cols="12">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                Debe agregar al menos una fotografía
              </div>
            </div>
          </v-col>
        </template>

        <v-row class="mt-5 text-center">
          <v-col cols="12">
            <template v-if="!isLoading">
              <v-btn color="error" class="mr-3 size_fijo" @click="buttonReturnList()">Volver</v-btn>
              <v-btn color="primary" class="size_fijo" @click.prevent="buttonSendForm()">Enviar</v-btn>
            </template>
            <template v-else>
              <v-btn color="primary" class="mr-3 size_fijo" disabled>
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

      </v-expansion-panels>
    </v-col>
  </v-row>

  <picture-capture :id_bien="id_bien" :id_bien_registro="id_bien_registro" :dialog="dialog" :nombre_imagen="nombre_imagen" ref="pictureModal" @dialog-off="closeModal" @return-image="getImageRecord"></picture-capture>
</template>


<style>
.size_fijo{
min-width: 150px;
text-align:center;
margin: 1px;

}</style>