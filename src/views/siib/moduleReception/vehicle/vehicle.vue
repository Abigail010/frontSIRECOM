<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useVehicleStore } from '@/stores/resources/vehicle'; 

import { validateText } from '@/utils/helpers/validateText'
import pictureCapture from './pictureCapture.vue';  // IMAGENES

  const route = useRoute()
  const resourceStore = useResourceStore()
  const vehicleStore = useVehicleStore()

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Vehículo',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DE CONSTANTES PARA LECTURA DE FORMULARIO
  const openpanel = ref([0])
  const nuevo = ref(true)
  const dialog = ref<boolean>(false)
  const pictureModal = ref<any>(null)
  const id_bien = route.params.id_bien
  const id_bien_registro = route.params.id_bien_registro
  const nombre_imagen = ref<any>('')
  const isLoading = ref(false)
  
  // DECLARACION DE LAS VARIABLES PARA LAS VALIDACIONES
  const submitButton = ref(false)
  const sendForm = ref(true)
  const sendForm1 = ref(true)
  const sendForm8 = ref(true)
  const sendForm9 = ref(true)
  const sendForm10 = ref(true)

  // DECLARACION DEL STATE
  const state:any = reactive({
    formData: {
      id_caso: route.params.id_caso,
      id_bien_registro: route.params.id_bien_registro,
    } as any,
    formulario_1: {
      clase: '',
      marca: '',
      modelo: '',
      tipo: '',
      placa_control: '',
      numero_chasis_vin: '',
      numero_motor: '',
      numero_puertas: '',
      color: '',
      caja: '',
      sistema: '',
      motorizacion: '',
      observaciones_vdm: '',
      cuenta_placa: '',
      codigo: ''
    },
    formulario_2: {
      id_vehiculo_pieza: '',
      nombre_pieza: '',
      cantidad: '',
      estado: '',
      inventario_partes_motor: []
    },
    formulario_3: {
      id_vehiculo_pieza: '',
      nombre_pieza: '',
      cantidad: '',
      estado: '',
      inventario_camion_tracto: []
    },
    formulario_4: {
      id_vehiculo_pieza: '',
      nombre_pieza: '',
      cantidad: '',
      estado: '',
      inventario_interior_tablero: []
    },
    formulario_5: {
      id_vehiculo_pieza: '',
      nombre_pieza: '',
      cantidad: '',
      estado: '',
      inventario_interior_tapiceria: []
    },
    formulario_6: {
      id_vehiculo_pieza: '',
      nombre_pieza: '',
      cantidad: '',
      estado: '',
      inventario_exteriores: []
    },
    formulario_7: {
      id_vehiculo_pieza: '',
      nombre_pieza: '',
      cantidad: '',
      estado: '',
      inventario_accesorios: []
    },
    formulario_8: {
      naturaleza_condicion: '',
      observaciones: '',
      escala_cuantitativa: '',
      escala_cualitativa: '',
      valor_operatividad: ''
    },
    formulario_9: {
      id_vehiculo_industria: '',
      id_vehiculo_kilometraje: '',
      precio_base: '',
      valor_operatividad: '',
      total: ''
    },
    formulario_10: {
      fotografias: [
        {
          id_vehiculo_imagen: '',
          id_bien: id_bien,
          id_bien_registro: id_bien_registro,
          nombre_imagen: 'vehiculo-frente',
          imagen: '',
          picture: '',
          titulo: 'IMAGEN FRONTAL'
        },
        {
          id_vehiculo_imagen: '',
          id_bien: id_bien,
          id_bien_registro: id_bien_registro,
          nombre_imagen: 'vehiculo-izquierda',
          imagen: '',
          picture: '',
          titulo: 'IMAGEN IZQUIERDO'
        },
        {
          id_vehiculo_imagen: '',
          id_bien: id_bien,
          id_bien_registro: id_bien_registro,
          nombre_imagen: 'vehiculo-derecha',
          imagen: '',
          picture: '',
          titulo: 'IMAGEN DERECHO'
        },
        {
          id_vehiculo_imagen: '',
          id_bien: id_bien,
          id_bien_registro: id_bien_registro,
          nombre_imagen: 'vehiculo-atras',
          imagen: '',
          picture: '',
          titulo: 'IMAGEN TRASERA'
        },
        {
          id_vehiculo_imagen: '',
          id_bien: id_bien,
          id_bien_registro: id_bien_registro,
          nombre_imagen: 'vehiculo-angular',
          imagen: '',
          picture: '',
          titulo: 'IMAGEN ANGULAR'
        }
      ]
    }
  });

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    for (let i = 0; i < state.formulario_10.fotografias.length; i++) {
      if(state.formulario_10.fotografias[i].nombre_imagen == value.respuesta.nombre_imagen){
        state.formulario_10.fotografias[i].imagen = value.respuesta.imagenBase64
        state.formulario_10.fotografias[i].picture = value.respuesta.picture
      }
    }
  }

  const removeImage = async (index: any) => {
    state.formulario_10.fotografias[index].imagen = ''
    state.formulario_10.fotografias[index].picture = ''
  }

  const lista_caja = ref([
    { title: 'AUTOMATICA' },
    { title: 'MECANICA' },
    { title: 'SECUENCIAL' }
  ]);

  const lista_sistema = ref([
    { title: 'CARBURADOR' },
    { title: 'INYECCION' },
    { title: 'OTRO' }
  ]);

  const lista_motorizacion = ref([
    { title: 'DIESEL' },
    { title: 'GASOLINA' },
    { title: 'GNV' }
  ]);

  const lista_estado = ref([
    { title: 'BUENO' },
    { title: 'REGULAR' },
    { title: 'MALO' }
  ]);

  const lista_condicion = ref([
    { title: 'MOTORIZADO OPERABLE' },
    { title: 'MOTORIZADO INOPERABLE' },
    { title: 'CHATARRA' }
  ]);

  const lista_escala = ref([
    {escala_cuantitativa:"0", escala_cualitativa: '0 - MALO'},
    {escala_cuantitativa:"1", escala_cualitativa: '1 - MALO'},
    {escala_cuantitativa:"2", escala_cualitativa: '2 - MALO'},
    {escala_cuantitativa:"3", escala_cualitativa: '3 - MALO'},
    {escala_cuantitativa:"4" , escala_cualitativa: '4 - REGULAR'},
    {escala_cuantitativa:"5" , escala_cualitativa: '5 - REGULAR'},
    {escala_cuantitativa:"6" , escala_cualitativa: '6 - REGULAR'},
    {escala_cuantitativa:"7" , escala_cualitativa: '7 - REGULAR'},
    {escala_cuantitativa:"8" , escala_cualitativa: '8 - BUENO'},
    {escala_cuantitativa:"9" , escala_cualitativa: '9 - BUENO'},
    {escala_cuantitativa:"10" , escala_cualitativa: '10 - BUENO'},
  ]);

  // LISTA DE PIEZAS DE VEHICULO
  const lista_total_piezas = ref([])
  const lista_partes_motor = ref([]) as any
  const lista_camion_tracto = ref([]) as any
  const lista_interior_tablero = ref([]) as any
  const lista_interior_tapiceria = ref([]) as any
  const lista_exteriores = ref([]) as any
  const lista_herramientas = ref([]) as any
  const getVehiclePartsList = async() => {
    const piezas = await resourceStore.getVehicleParts()
    lista_total_piezas.value = piezas
    lista_partes_motor.value = piezas.filter( (pieza:any) => pieza.seccion == 'PARTES DEL MOTOR Y SISTEMA ELECTRICO' )
    lista_camion_tracto.value = piezas.filter( (pieza:any) => pieza.seccion == 'PARA CAMIONES Y TRACTO CAMIONES' )
    lista_interior_tablero.value = piezas.filter( (pieza:any) => pieza.seccion == 'INTERIOR - TABLERO' )
    lista_interior_tapiceria.value = piezas.filter( (pieza:any) => pieza.seccion == 'INTERIOR - TAPICERIA' )
    lista_exteriores.value = piezas.filter( (pieza:any) => pieza.seccion == 'EXTERIORES' )
    lista_herramientas.value = piezas.filter( (pieza:any) => pieza.seccion == 'HERRAMIENTA Y ACCESORIOS' )
  }

  // LISTA DE INDUSTRIAS
  const lista_industria = ref([])
  const getIndustriesList = async () => {
    lista_industria.value = await resourceStore.getIndustries()
  }

  // LISTA DE KILOMETRAJES
  const lista_kilometraje = ref([])
  const getMileagesList = async () => {
    lista_kilometraje.value = await resourceStore.getMileages()
  }

  // LISTA DE INDUSTRIA KILOMETRAJE
  const lista_industria_kilometraje = ref([])
  const getIndustriesMileagesList = async () => {
    lista_industria_kilometraje.value = await resourceStore.getIndustriesMileages()
  }

  const getVehicleById = async(id_bien_registro: any) => {
    const resultado = await vehicleStore.vehicle(id_bien_registro)
    if(!resultado.nuevo){
      nuevo.value = false

      const formulario_1 = resultado.formulario_1
      state.formulario_1.clase = formulario_1.clase
      state.formulario_1.marca = formulario_1.marca
      state.formulario_1.modelo = formulario_1.modelo
      state.formulario_1.tipo = formulario_1.tipo
      state.formulario_1.placa_control = formulario_1.placa_control
      state.formulario_1.numero_chasis_vin = formulario_1.numero_chasis_vin
      state.formulario_1.numero_motor = formulario_1.numero_motor
      state.formulario_1.numero_puertas = formulario_1.numero_puertas
      state.formulario_1.color = formulario_1.color
      state.formulario_1.caja = formulario_1.caja
      state.formulario_1.sistema = formulario_1.sistema
      state.formulario_1.motorizacion = formulario_1.motorizacion
      state.formulario_1.observaciones_vdm = formulario_1.observaciones_vdm
      state.formulario_1.cuenta_placa = formulario_1.placa_control != '' ? 'SI' : 'NO'
      state.formulario_1.codigo = formulario_1.codigo

      const partes_motor = resultado.formulario_2.inventario_partes_motor
      for (let i = 0; i < partes_motor.length; i++) {
        state.formulario_2.inventario_partes_motor.push(partes_motor[i])
        lista_partes_motor.value = lista_partes_motor.value.filter((pieza: any) => pieza.id != partes_motor[i].id_vehiculo_pieza)
      }

      const camion_tracto = resultado.formulario_3.inventario_camion_tracto
      for (let i = 0; i < camion_tracto.length; i++) {
        state.formulario_3.inventario_camion_tracto.push(camion_tracto[i])
        lista_camion_tracto.value = lista_camion_tracto.value.filter((pieza: any) => pieza.id != camion_tracto[i].id_vehiculo_pieza)
      }

      const interior_tablero = resultado.formulario_4.inventario_interior_tablero
      for (let i = 0; i < interior_tablero.length; i++) {
        state.formulario_4.inventario_interior_tablero.push(interior_tablero[i])
        lista_interior_tablero.value = lista_interior_tablero.value.filter((pieza: any) => pieza.id != interior_tablero[i].id_vehiculo_pieza)
      }

      const interior_tapiceria = resultado.formulario_5.inventario_interior_tapiceria
      for (let i = 0; i < interior_tapiceria.length; i++) {
        state.formulario_5.inventario_interior_tapiceria.push(interior_tapiceria[i])
        lista_interior_tapiceria.value = lista_interior_tapiceria.value.filter((pieza: any) => pieza.id != interior_tapiceria[i].id_vehiculo_pieza)
      }

      const exteriores = resultado.formulario_6.inventario_exteriores
      for (let i = 0; i < exteriores.length; i++) {
        state.formulario_6.inventario_exteriores.push(exteriores[i])
        lista_exteriores.value = lista_exteriores.value.filter((pieza: any) => pieza.id != exteriores[i].id_vehiculo_pieza)
      }

      const accesorios = resultado.formulario_7.inventario_accesorios
      for (let i = 0; i < accesorios.length; i++) {
        state.formulario_7.inventario_accesorios.push(accesorios[i])
        lista_herramientas.value = lista_herramientas.value.filter((pieza: any) => pieza.id != accesorios[i].id_vehiculo_pieza)
      }

      const formulario_8 = resultado.formulario_8
      state.formulario_8.naturaleza_condicion = formulario_8.naturaleza_condicion
      state.formulario_8.observaciones = formulario_8.observaciones
      state.formulario_8.escala_cuantitativa = formulario_8.escala_cuantitativa
      state.formulario_8.escala_cualitativa = formulario_8.escala_cualitativa
      state.formulario_8.valor_operatividad = formulario_8.valor_operatividad

      const formulario_9 = resultado.formulario_9
      state.formulario_9.id_vehiculo_industria = formulario_9.id_vehiculo_industria
      state.formulario_9.id_vehiculo_kilometraje = formulario_9.id_vehiculo_kilometraje
      state.formulario_9.precio_base = formulario_9.precio_base
      state.formulario_9.valor_operatividad = formulario_9.valor_operatividad
      state.formulario_9.total = formulario_9.total
      console.log('form', resultado)
      const fotografias = resultado.formulario_10.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        for (let j = 0; j < state.formulario_10.fotografias.length; j++) {
          if(state.formulario_10.fotografias[j].nombre_imagen == fotografias[i].nombre_imagen){
            state.formulario_10.fotografias[j].imagen = fotografias[i].imagen
            console.log('foto', fotografias[i].imagen)
          }
        }
      }
    }
  }

  const calculate = () => {
    // CALCULO DE VALOR DE OPERATIVIDAD - FORMULARIO 8
    if(state.formulario_8.escala_cuantitativa != ''){
      if(state.formulario_8.escala_cuantitativa >= 0 && state.formulario_8.escala_cuantitativa <= 3){
        state.formulario_8.escala_cualitativa = 'MALO'
      }
      if(state.formulario_8.escala_cuantitativa > 3 && state.formulario_8.escala_cuantitativa <= 7){
        state.formulario_8.escala_cualitativa = 'REGULAR'
      }
      if(state.formulario_8.escala_cuantitativa > 7 && state.formulario_8.escala_cuantitativa <= 10){
        state.formulario_8.escala_cualitativa = 'BUENO'
      }
      state.formulario_8.valor_operatividad = state.formulario_8.escala_cuantitativa/10
      state.formulario_9.valor_operatividad = state.formulario_8.escala_cuantitativa/10
      if(state.formulario_8.valor_operatividad == 0){
        state.formulario_8.valor_operatividad = '0'
        state.formulario_9.valor_operatividad = '0'
      }
    }else{
      state.formulario_8.escala_cualitativa = 'MALO'
      state.formulario_8.valor_operatividad = '0'
      state.formulario_9.valor_operatividad = '0'
    }

    // CALCULO DE AVALUO PROVISIONAL - FORMULARIO 9
    if(state.formulario_9.id_vehiculo_industria != '' &&
      state.formulario_9.id_vehiculo_kilometraje != '' &&
      state.formulario_8.escala_cuantitativa != ''){
      const valor: any = lista_industria_kilometraje.value.find(
        (registro: any) =>
        registro.id_vehiculo_industria == state.formulario_9.id_vehiculo_industria &&
        registro.id_vehiculo_kilometraje == state.formulario_9.id_vehiculo_kilometraje
      )
      state.formulario_9.precio_base = valor.precio_base
      state.formulario_9.total = Math.round(state.formulario_9.precio_base * state.formulario_8.valor_operatividad)
      if(state.formulario_9.total == 0){
        state.formulario_9.total = '0'
      }
    }else{
      state.formulario_9.precio_base = 0
    }
  }

  const setProvisionalAppraisal = () => {
    if(state.formulario_9.precio_base != '' && state.formulario_8.valor_operatividad != ''){
      state.formulario_9.total = Math.round(state.formulario_9.precio_base * state.formulario_8.valor_operatividad)
    }else{
      state.formulario_9.total = ''
    }
  }

  // 2 INVENTARIO - PARTES DEL MOTOR Y SISTEMA ELECTRICO
  
  const setMotorPartName = () => {
    const registro: any = lista_partes_motor.value.find( (pieza: any) => pieza.id == state.formulario_2.id_vehiculo_pieza )
    state.formulario_2.nombre_pieza = registro.nombre_pieza
  }

  const buttonAddMotorPart = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_partes_motor.value = lista_partes_motor.value.filter((pieza: any) => pieza.id != state.formulario_2.id_vehiculo_pieza)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_2.inventario_partes_motor.push({
      id_vehiculo_pieza: state.formulario_2.id_vehiculo_pieza,
      nombre_pieza: state.formulario_2.nombre_pieza,
      cantidad: state.formulario_2.cantidad,
      estado: state.formulario_2.estado,
    })
    state.formulario_2.id_vehiculo_pieza = ''
    state.formulario_2.nombre_pieza = ''
    state.formulario_2.cantidad = ''
    state.formulario_2.estado = ''
  }

  const buttonDeleteMotorPart = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO DE PARTES EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS 
    const id = state.formulario_2.inventario_partes_motor[index].id_vehiculo_pieza
    const registro: any = lista_total_piezas.value.find( (pieza: any) => pieza.id == id )
    lista_partes_motor.value.push(registro)
    lista_partes_motor.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_pieza
      const codigo_b = b.nombre_pieza
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_2.inventario_partes_motor.splice(index,1)
  }

  // 2 INVENTARIO - PARA CAMIONES Y TRACTO CAMIONES
  
  const setTruckName = () => {
    const registro: any = lista_camion_tracto.value.find( (pieza: any) => pieza.id == state.formulario_3.id_vehiculo_pieza )
    state.formulario_3.nombre_pieza = registro.nombre_pieza
  }

  const buttonAddTruck = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_camion_tracto.value = lista_camion_tracto.value.filter((pieza: any) => pieza.id != state.formulario_3.id_vehiculo_pieza)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_3.inventario_camion_tracto.push({
      id_vehiculo_pieza: state.formulario_3.id_vehiculo_pieza,
      nombre_pieza: state.formulario_3.nombre_pieza,
      cantidad: state.formulario_3.cantidad,
      estado: state.formulario_3.estado,
    })
    state.formulario_3.id_vehiculo_pieza = ''
    state.formulario_3.nombre_pieza = ''
    state.formulario_3.cantidad = ''
    state.formulario_3.estado = ''
  }

  const buttonDeleteTruck = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO DE PARTES EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS 
    const id = state.formulario_3.inventario_camion_tracto[index].id_vehiculo_pieza
    const registro: any = lista_total_piezas.value.find( (pieza: any) => pieza.id == id )
    lista_camion_tracto.value.push(registro)
    lista_camion_tracto.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_pieza
      const codigo_b = b.nombre_pieza
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_3.inventario_camion_tracto.splice(index,1)
  }

  // 2 INVENTARIO - INTERIOR - TABLERO
  
  const setBoardName = () => {
    const registro: any = lista_interior_tablero.value.find( (pieza: any) => pieza.id == state.formulario_4.id_vehiculo_pieza )
    state.formulario_4.nombre_pieza = registro.nombre_pieza
  }

  const buttonAddBoard = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_interior_tablero.value = lista_interior_tablero.value.filter((pieza: any) => pieza.id != state.formulario_4.id_vehiculo_pieza)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_4.inventario_interior_tablero.push({
      id_vehiculo_pieza: state.formulario_4.id_vehiculo_pieza,
      nombre_pieza: state.formulario_4.nombre_pieza,
      cantidad: state.formulario_4.cantidad,
      estado: state.formulario_4.estado,
    })
    state.formulario_4.id_vehiculo_pieza = ''
    state.formulario_4.nombre_pieza = ''
    state.formulario_4.cantidad = ''
    state.formulario_4.estado = ''
  }

  const buttonDeleteBoard = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO DE PARTES EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS 
    const id = state.formulario_4.inventario_interior_tablero[index].id_vehiculo_pieza
    const registro: any = lista_total_piezas.value.find( (pieza: any) => pieza.id == id )
    lista_interior_tablero.value.push(registro)
    lista_interior_tablero.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_pieza
      const codigo_b = b.nombre_pieza
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_4.inventario_interior_tablero.splice(index,1)
  }

  // 2 INVENTARIO - INTERIOR - TAPICERIA
  
  const setUpholsteryName = () => {
    const registro: any = lista_interior_tapiceria.value.find( (pieza: any) => pieza.id == state.formulario_5.id_vehiculo_pieza )
    state.formulario_5.nombre_pieza = registro.nombre_pieza
  }

  const buttonAddUpholstery = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_interior_tapiceria.value = lista_interior_tapiceria.value.filter((pieza: any) => pieza.id != state.formulario_5.id_vehiculo_pieza)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_5.inventario_interior_tapiceria.push({
      id_vehiculo_pieza: state.formulario_5.id_vehiculo_pieza,
      nombre_pieza: state.formulario_5.nombre_pieza,
      cantidad: state.formulario_5.cantidad,
      estado: state.formulario_5.estado,
    })
    state.formulario_5.id_vehiculo_pieza = ''
    state.formulario_5.nombre_pieza = ''
    state.formulario_5.cantidad = ''
    state.formulario_5.estado = ''
  }

  const buttonDeleteUpholstery = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO DE PARTES EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS 
    const id = state.formulario_5.inventario_interior_tapiceria[index].id_vehiculo_pieza
    const registro: any = lista_total_piezas.value.find( (pieza: any) => pieza.id == id )
    lista_interior_tapiceria.value.push(registro)
    lista_interior_tapiceria.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_pieza
      const codigo_b = b.nombre_pieza
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_5.inventario_interior_tapiceria.splice(index,1)
  }

  // 2 INVENTARIO - EXTERIORES
  
  const setExteriorName = () => {
    const registro: any = lista_exteriores.value.find( (pieza: any) => pieza.id == state.formulario_6.id_vehiculo_pieza )
    state.formulario_6.nombre_pieza = registro.nombre_pieza
  }

  const buttonAddExterior = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_exteriores.value = lista_exteriores.value.filter((pieza: any) => pieza.id != state.formulario_6.id_vehiculo_pieza)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_6.inventario_exteriores.push({
      id_vehiculo_pieza: state.formulario_6.id_vehiculo_pieza,
      nombre_pieza: state.formulario_6.nombre_pieza,
      cantidad: state.formulario_6.cantidad,
      estado: state.formulario_6.estado,
    })
    state.formulario_6.id_vehiculo_pieza = ''
    state.formulario_6.nombre_pieza = ''
    state.formulario_6.cantidad = ''
    state.formulario_6.estado = ''
  }

  const buttonDeleteExterior = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO DE PARTES EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS 
    const id = state.formulario_6.inventario_exteriores[index].id_vehiculo_pieza
    const registro: any = lista_total_piezas.value.find( (pieza: any) => pieza.id == id )
    lista_exteriores.value.push(registro)
    lista_exteriores.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_pieza
      const codigo_b = b.nombre_pieza
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_6.inventario_exteriores.splice(index,1)
  }

  // 2 INVENTARIO - ACCESORIOS
  
  const setAccessoriesName = () => {
    const registro: any = lista_herramientas.value.find( (pieza: any) => pieza.id == state.formulario_7.id_vehiculo_pieza )
    state.formulario_7.nombre_pieza = registro.nombre_pieza
  }

  const buttonAddAccessories = () => {
    // AQUI ELIMINAR DEL LISTADO DE PARTES EL REGISTRO RECIEN AGREGADO
    lista_herramientas.value = lista_herramientas.value.filter((pieza: any) => pieza.id != state.formulario_7.id_vehiculo_pieza)
    // AGREGAMOS EL REGISTRO AL ARRAY
    state.formulario_7.inventario_accesorios.push({
      id_vehiculo_pieza: state.formulario_7.id_vehiculo_pieza,
      nombre_pieza: state.formulario_7.nombre_pieza,
      cantidad: state.formulario_7.cantidad,
      estado: state.formulario_7.estado,
    })
    state.formulario_7.id_vehiculo_pieza = ''
    state.formulario_7.nombre_pieza = ''
    state.formulario_7.cantidad = ''
    state.formulario_7.estado = ''
  }

  const buttonDeleteAccessories = (index: number) => {
    // AQUI AGREGAMOS AL LISTADO DE PARTES EL REGISTRO RECIEN ELIMINADO Y ORDENAMOS 
    const id = state.formulario_7.inventario_accesorios[index].id_vehiculo_pieza
    const registro: any = lista_total_piezas.value.find( (pieza: any) => pieza.id == id )
    lista_herramientas.value.push(registro)
    lista_herramientas.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_pieza
      const codigo_b = b.nombre_pieza
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    // ELIMINAMOS REGISTRO DEL ARRAY
    state.formulario_7.inventario_accesorios.splice(index,1)
  }

  // MIS VALIDACIONES NUEVAS
  const miValidacion = async () => {
    sendForm.value = true
    sendForm1.value = true
    sendForm8.value = true
    sendForm9.value = true
    sendForm10.value = true

    if(!state.formulario_1.clase || !state.formulario_1.marca || !state.formulario_1.modelo || !state.formulario_1.tipo || !state.formulario_1.numero_puertas || !state.formulario_1.color || !state.formulario_1.caja || !state.formulario_1.sistema || !state.formulario_1.motorizacion){
      sendForm.value = false
      sendForm1.value = false
    }
    if(!state.formulario_8.naturaleza_condicion || !state.formulario_8.escala_cuantitativa || !state.formulario_8.valor_operatividad){
      sendForm.value = false
      sendForm8.value = false
    }
    if(!state.formulario_9.id_vehiculo_industria || !state.formulario_9.id_vehiculo_kilometraje || !state.formulario_9.precio_base || !state.formulario_9.total){
      sendForm.value = false
      sendForm9.value = false
    }

    if(!state.formulario_10.fotografias[4].imagen){
      sendForm.value = false
      sendForm10.value = false
    }

  }

  const buttonReturnList = () => {
    router.back()
  }

  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return
    state.formData.formulario_1 = state.formulario_1
    state.formData.formulario_2 = state.formulario_2
    state.formData.formulario_3 = state.formulario_3
    state.formData.formulario_4 = state.formulario_4
    state.formData.formulario_5 = state.formulario_5
    state.formData.formulario_6 = state.formulario_6
    state.formData.formulario_7 = state.formulario_7
    state.formData.formulario_8 = state.formulario_8
    state.formData.formulario_9 = state.formulario_9
    state.formData.formulario_10 = state.formulario_10

    isLoading.value = true
    // SI ES ACTUALIZACION, ELIMINAMOS LAS IMAGENES QUE YA NO EXISTEN
    // if(!nuevo.value){
    //   await vehicleStore.deleteVehicleImage(state.formData)
    // }
    const { ok, message, id } = nuevo.value ? await vehicleStore.createVehicle(state.formData) : await vehicleStore.updateVehicle(state.formData)
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      confirmButtonText: 'Ok'
    }).then(() => {
      isLoading.value = false
      router.push({ name: 'bienFile', params: { id:route.params.id_caso } });
    })
    if(id != 0){
      vehicleStore.vehicleReport(id)
    }
  }

  onMounted( async () => {
    await getVehiclePartsList()
    await getIndustriesList()
    await getMileagesList()
    await getIndustriesMileagesList()

    await getVehicleById(route.params.id_bien_registro)
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Vehículos</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. DATOS DEL MOTORIZADO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CLASE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.clase"
                  @input="miValidacion(), state.formulario_1.clase = validateText(state.formulario_1.clase.toUpperCase())"
                  :error="submitButton && !state.formulario_1.clase"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.clase">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MARCA</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.marca"
                  @input="miValidacion(), state.formulario_1.marca = validateText(state.formulario_1.marca.toUpperCase())"
                  :error="submitButton && !state.formulario_1.marca"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.marca">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MODELO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.modelo"
                  @input="miValidacion(), state.formulario_1.modelo = validateText(state.formulario_1.modelo.toUpperCase())"
                  :error="submitButton && !state.formulario_1.modelo"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.modelo">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">TIPO</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.tipo"
                  @input="miValidacion(), state.formulario_1.tipo = validateText(state.formulario_1.tipo.toUpperCase())"
                  :error="submitButton && !state.formulario_1.tipo"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.tipo">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>

              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CUENTA CON PLACA DE CONTROL</v-label>
                <v-row>
                  <v-col cols="12">
                    <v-radio-group
                      v-model="state.formulario_1.cuenta_placa"
                      inline
                      class="ml-4"
                      @click="miValidacion(), state.formulario_1.cuenta_placa == 'NO' ? state.formulario_1.placa_control = '' : ''"
                      :disabled="!nuevo"
                      :error="submitButton && !state.formulario_1.cuenta_placa"
                      hide-details
                    >
                      <v-radio label="SI" color="primary" value="SI" class="mr-10"></v-radio>
                      <v-radio label="NO" value="NO"></v-radio>
                    </v-radio-group>
                    <template v-if="submitButton && !state.formulario_1.cuenta_placa">
                      <div class="v-messages font-weight-black px-2 py-2">
                        <div class="v-messages__message text-error ">
                          El campo es requerido
                        </div>
                      </div>
                    </template>
                  </v-col>
                </v-row>
              </v-col>

              <template v-if="state.formulario_1.cuenta_placa == 'NO' && !nuevo">
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">CÓDIGO MOTORIZADO SIIB</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="state.formulario_1.codigo"
                    disabled
                  >
                  </v-text-field>
                </v-col>
              </template>

              <template v-if="state.formulario_1.cuenta_placa == 'SI'">
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">PLACA DE CONTROL</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model.trim="state.formulario_1.placa_control"
                    @input="state.formulario_1.placa_control = validateText(state.formulario_1.placa_control.toUpperCase())"
                  >
                  </v-text-field>
                </v-col>
              </template>
              
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE CHASIS/VIN</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.numero_chasis_vin"
                  @input="state.formulario_1.numero_chasis_vin = validateText(state.formulario_1.numero_chasis_vin.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE MOTOR</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.numero_motor"
                  @input="state.formulario_1.numero_motor = validateText(state.formulario_1.numero_motor.toUpperCase())"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NÚMERO DE PUERTAS</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_1.numero_puertas"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_1.numero_puertas"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.numero_puertas">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">COLOR</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model.trim="state.formulario_1.color"
                  @input="miValidacion(), state.formulario_1.color = validateText(state.formulario_1.color.toUpperCase())"
                  :error="submitButton && !state.formulario_1.color"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_1.color">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">CAJA</v-label>
                <v-select
                  v-model="state.formulario_1.caja"
                  :items="lista_caja"
                  item-title="title"
                  item-value="title"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_1.caja"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.caja">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
                <!-- @update:model-value="setJewelName()" -->
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">SISTEMA</v-label>
                <v-select
                  v-model="state.formulario_1.sistema"
                  :items="lista_sistema"
                  item-title="title"
                  item-value="title"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_1.sistema"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.sistema">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">MOTORIZACIÓN</v-label>
                <v-select
                  v-model="state.formulario_1.motorizacion"
                  :items="lista_motorizacion"
                  item-title="title"
                  item-value="title"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_1.motorizacion"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_1.motorizacion">
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
                  v-model.trim="state.formulario_1.observaciones_vdm"
                  @input="state.formulario_1.observaciones_vdm = validateText(state.formulario_1.observaciones_vdm.toUpperCase())"
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
          <v-expansion-panel-title class="text-h6">2. INVENTARIO</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <h3 class="my-3 text-primary">A) Partes del motor y sistema electrico</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PIEZA</v-label>
                <v-select
                  v-model="state.formulario_2.id_vehiculo_pieza"
                  :items="lista_partes_motor"
                  item-title="nombre_pieza"
                  item-value="id"
                  @update:model-value="setMotorPartName()"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                <v-select
                  v-model="state.formulario_2.estado"
                  :items="lista_estado"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  CANTIDAD
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model.trim="state.formulario_2.cantidad"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddMotorPart()
                    :disabled="!state.formulario_2.id_vehiculo_pieza || !state.formulario_2.estado || !state.formulario_2.cantidad">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_2.inventario_partes_motor.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Nombre de pieza</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_2.inventario_partes_motor"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_pieza }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteMotorPart(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

            <h3 class="my-3 text-primary">B) Para camiones y tracto camiones</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PIEZA</v-label>
                <v-select
                  v-model="state.formulario_3.id_vehiculo_pieza"
                  :items="lista_camion_tracto"
                  item-title="nombre_pieza"
                  item-value="id"
                  @update:model-value="setTruckName()"
                ></v-select>

              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                <v-select
                  v-model="state.formulario_3.estado"
                  :items="lista_estado"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  CANTIDAD
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model.trim="state.formulario_3.cantidad"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddTruck()
                    :disabled="!state.formulario_3.id_vehiculo_pieza || !state.formulario_3.estado || !state.formulario_3.cantidad">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_3.inventario_camion_tracto.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Nombre de pieza</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_3.inventario_camion_tracto"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_pieza }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteTruck(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

            <h3 class="my-3 text-primary">C) Interior - Tablero</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PIEZA</v-label>
                <v-select
                  v-model="state.formulario_4.id_vehiculo_pieza"
                  :items="lista_interior_tablero"
                  item-title="nombre_pieza"
                  item-value="id"
                  @update:model-value="setBoardName()"
                ></v-select>

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
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  CANTIDAD
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model.trim="state.formulario_4.cantidad"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddBoard()
                    :disabled="!state.formulario_4.id_vehiculo_pieza || !state.formulario_4.estado || !state.formulario_4.cantidad">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_4.inventario_interior_tablero.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Nombre de pieza</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_4.inventario_interior_tablero"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_pieza }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteBoard(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

            <h3 class="my-3 text-primary">D) Interior - Tapicería</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PIEZA</v-label>
                <v-select
                  v-model="state.formulario_5.id_vehiculo_pieza"
                  :items="lista_interior_tapiceria"
                  item-title="nombre_pieza"
                  item-value="id"
                  @update:model-value="setUpholsteryName()"
                ></v-select>

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
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  CANTIDAD
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model.trim="state.formulario_5.cantidad"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddUpholstery()
                    :disabled="!state.formulario_5.id_vehiculo_pieza || !state.formulario_5.estado || !state.formulario_5.cantidad">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_5.inventario_interior_tapiceria.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Nombre de pieza</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_5.inventario_interior_tapiceria"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_pieza }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteUpholstery(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

            <h3 class="my-3 text-primary">E) Exteriores</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PIEZA</v-label>
                <v-select
                  v-model="state.formulario_6.id_vehiculo_pieza"
                  :items="lista_exteriores"
                  item-title="nombre_pieza"
                  item-value="id"
                  @update:model-value="setExteriorName()"
                ></v-select>

              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                <v-select
                  v-model="state.formulario_6.estado"
                  :items="lista_estado"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  CANTIDAD
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model.trim="state.formulario_6.cantidad"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddExterior()
                    :disabled="!state.formulario_6.id_vehiculo_pieza || !state.formulario_6.estado || !state.formulario_6.cantidad">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_6.inventario_exteriores.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Nombre de pieza</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_6.inventario_exteriores"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_pieza }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteExterior(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

            <h3 class="my-3 text-primary">F) Herramientas y accesorios</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">PIEZA</v-label>
                <v-select
                  v-model="state.formulario_7.id_vehiculo_pieza"
                  :items="lista_herramientas"
                  item-title="nombre_pieza"
                  item-value="id"
                  @update:model-value="setAccessoriesName()"
                ></v-select>

              </v-col>
              <v-col cols="12" md="4">
                <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                <v-select
                  v-model="state.formulario_7.estado"
                  :items="lista_estado"
                  item-title="title"
                  item-value="title"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium" required>
                  CANTIDAD
                </v-label>
                <v-text-field 
                  variant="outlined"
                  color="primary"
                  type="number"
                  min="0"
                  v-model.trim="state.formulario_7.cantidad"
                >
                <template v-slot:append>
                  <v-btn 
                    color="primary"
                    @click= buttonAddAccessories()
                    :disabled="!state.formulario_7.id_vehiculo_pieza || !state.formulario_7.estado || !state.formulario_7.cantidad">
                    <PlusIcon/> Agregar
                  </v-btn>
                </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="state.formulario_7.inventario_accesorios.length > 0" cols="12" md="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Nombre de pieza</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in state.formulario_7.inventario_accesorios"
                      :key="index"
                    >
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">{{ item.nombre_pieza }}</td>
                      <td class="text-center">{{ item.estado }}</td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteAccessories(index)"/></td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>

          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">3. CLASIFICACIÓN</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">NATURALEZA Y CONDICIÓN</v-label>
                <v-select
                  v-model="state.formulario_8.naturaleza_condicion"
                  :items="lista_condicion"
                  item-title="title"
                  item-value="title"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_8.naturaleza_condicion"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_8.naturaleza_condicion">
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
                  v-model="state.formulario_8.escala_cuantitativa"
                  :items="lista_escala"
                  item-title="escala_cualitativa"
                  item-value="escala_cuantitativa"
                  @update:model-value="calculate()"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_8.escala_cuantitativa"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_8.escala_cuantitativa">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">VALOR DE OPERATIVIDAD</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_8.valor_operatividad"
                  readonly
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_8.valor_operatividad"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_8.valor_operatividad">
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
                  v-model.trim="state.formulario_8.observaciones"
                  @input="state.formulario_8.observaciones = validateText(state.formulario_8.observaciones.toUpperCase())"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm8">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>
        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">4. AVALÚO PROVISIONAL</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">

            <!-- <v-card class="border mb-4" elevation="5">
              <v-table class="month-table" density="compact">
                <thead>
                  <tr>
                      <th class="text-h6 text-center" colspan="7">PRECIO BASE SEGUN EL KILOMETRAJE DEL VEHICULO [$us]</th>
                  </tr>
                  <tr>
                      <th class="text-h6" rowspan="2">INDUSTRIA</th>
                      <th class="text-h6 text-center" :colspan="lista_kilometraje.length">KILOMETRAJE [km]</th>
                  </tr>
                  <tr>
                    <th nowrap class="text-h6" v-for="item in lista_kilometraje">
                      {{ item.rango_kilometraje }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in lista_industria" class="month-item">
                    <td>
                      <h6 class="text-h6 text-left">{{ item.nombre_vehiculo_industria }}</h6>
                    </td>
                    <td>
                      <div class="text-subtitle-1 text-medium-emphasis">col 2</div>
                    </td>
                    <td>
                      <div class="text-subtitle-1 text-medium-emphasis">col 2</div>
                    </td>
                    <td>
                      <div class="text-subtitle-1 text-medium-emphasis">col 2</div>
                    </td>
                    <td>
                      <div class="text-subtitle-1 text-medium-emphasis">col 2</div>
                    </td>
                    <td>
                      <div class="text-subtitle-1 text-medium-emphasis">col 2</div>
                    </td>
                    <td>
                      <div class="text-subtitle-1 text-medium-emphasis">col 2</div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card> -->

            <v-row>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">INDUSTRIA</v-label>
                <v-select
                  v-model="state.formulario_9.id_vehiculo_industria"
                  :items="lista_industria"
                  item-title="nombre_vehiculo_industria"
                  item-value="id"
                  @update:model-value="calculate()"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_9.id_vehiculo_industria"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_9.id_vehiculo_industria">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">KILOMETRAJE</v-label>
                <v-select
                  v-model="state.formulario_9.id_vehiculo_kilometraje"
                  :items="lista_kilometraje"
                  item-title="rango_kilometraje"
                  item-value="id"
                  @update:model-value="calculate()"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_9.id_vehiculo_kilometraje"
                  hide-details
                ></v-select>
                <template v-if="submitButton && !state.formulario_9.id_vehiculo_kilometraje">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_9.precio_base"
                  @update:model-value="setProvisionalAppraisal()"
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_9.precio_base"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_9.precio_base">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="font-weight-medium mb-2">AVALÚO PROVISIONAL</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="number"
                  min="0"
                  v-model="state.formulario_9.total"
                  readonly
                  @input="miValidacion()"
                  :error="submitButton && !state.formulario_9.total"
                  hide-details
                >
                </v-text-field>
                <template v-if="submitButton && !state.formulario_9.total">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm9">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template>

        <v-expansion-panel elevation="10" class=" mt-3">
          <v-expansion-panel-title class="text-h6">5. FOTOGRAFIAS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>
              <v-col
                cols="12"
                md="6"
                v-for="(imagen, index) in state.formulario_10.fotografias"
              >
                
                <v-card elevation="10" rounded="md">
                  <div class="text-center py-3">
                    <img
                      v-if="imagen.imagen"
                      :src="imagen.imagen"
                      alt="noImage"
                      height="250"
                      width="350"
                    />
                    <img
                      v-else
                      src="@/assets/images/misimagenes/noimage1.png"
                      alt="noImage"
                      height="250"
                    />
                  </div>
                  <div class="d-flex justify-end mr-3 mt-n3 pb-1">
                    <v-btn
                      v-if="imagen.imagen"
                      size="30"
                      icon variant="flat"
                      color="#EF5350"
                      class="d-flex"
                      @click="removeImage(index)"
                    >
                      <v-avatar size="30" class="text-white">
                        <TrashIcon size="20" />
                      </v-avatar>
                      <v-tooltip
                        activator="parent"
                        location="bottom"
                      >ELIMINAR IMAGEN
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                      v-else
                      size="30"
                      icon variant="flat"
                      color="#5D87FF"
                      class="d-flex"
                      @click="openModal(imagen.nombre_imagen)"
                    >
                      <v-avatar size="30" class="text-white">
                        <BasketIcon size="20" />
                      </v-avatar>
                      <v-tooltip
                        activator="parent"
                        location="bottom"
                      >SUBIR IMAGEN
                      </v-tooltip>
                    </v-btn>
                  </div>
                  <v-card-item class="pt-0">
                    <div class="text-center">
                      <h6 class="text-h6" v-text="imagen.titulo"></h6>
                    </div>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm10">
          <v-col cols="12">
            <div class="v-messages font-weight-black py-2">
              <div class="v-messages__message text-error">
                La imagen Angular es obligatoria
              </div>
            </div>
          </v-col>
        </template>
        <v-row class="mt-5 text-center justify-center align-center">
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
.size_fijo {
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
</style>