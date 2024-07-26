<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
  import { router } from '@/router';
  import { useRoute } from 'vue-router'
  import Swal from 'sweetalert2'
  import { useResourceStore } from '@/stores/resource';
  import { useElectronicStore } from '@/stores/moduleOne/electronic';
  import { validateText } from '@/utils/helpers/validateText'
  import pictureCapture from './pictureCapture.vue';  // IMAGENES
  import { el } from 'date-fns/locale';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const electronicStore = useElectronicStore()

  const addEquipamentButton = ref(false) 
  const sendEquipament = ref(true)

  

  // BREADCRUMB
  const page = ref({ title: 'Información del bien' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Equipo electrónico',
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
  const isValidSize = ref(true)
  const sendForm1 = ref(true)
  const sendForm2 = ref(true)

  // DECLARACION DEL STATE
  const state:any = reactive({
    formData: {
      id_caso: route.params.id_caso,
      tipo_equipo_electronico: '',
      id_bien_registro: route.params.id_bien_registro
    } as any,
    formulario_1: {
      id_ee_celular_marca: '',
      modelo: '',
      numero_imei_esn: '',
      color: '',
      estado_celular: '',
      funcionamiento: '',
      observaciones: '',
      precio_base: '',
      valor_funcionalidad: '',
      devaluo_anual: '',
      avaluo_provisional: '',
    } as any,
    formulario_2: {
      id_ee_computadora_sistema_operativo: '',
      modelo: '',
      numero_serie: '',
      color: '',
      estado_computadora: '',
      funcionamiento: '',
      observaciones: '',
      precio_base: '',
      valor_funcionalidad: '',
      devaluo_anual: '',
      avaluo_provisional: '',
      id_ee_computadora_componente: '',
      nombre_componente: '',
      descripcion: '',
      inventario_pc: [],
    },
    formulario_3: {
      id_ee_equipamiento: '',
      nombre_equipamiento: '',
      cantidad: '',
      numero_serie: '',
      observaciones: '',
      precio_base: '',
      valor_funcionalidad: '',
      avaluo_provisional: '',
      inventario_equipamiento: [],
    },
    formulario_4: {
      fotografias: []
    },
    id_imagenes_eliminadas:[]
  });

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
  }

  const getImageRecord = async (value: any) => {
    state.formulario_4.fotografias.push({
      id_ee_imagen: '',
      id_bien: id_bien,
      id_bien_registro: id_bien_registro,
      nombre_imagen: 'electronico-general',
      imagen: value.respuesta.imagenBase64,
      picture: value.respuesta.picture,
    })
  }

  const lista_funcionalidad = ref([
    {valor_funcionalidad:'0', escala_cualitativa: '0 - MALO'},
    {valor_funcionalidad:'0.1', escala_cualitativa: '1 - MALO'},
    {valor_funcionalidad:'0.2', escala_cualitativa: '2 - MALO'},
    {valor_funcionalidad:'0.3', escala_cualitativa: '3 - MALO'},
    {valor_funcionalidad:'0.4', escala_cualitativa: '4 - REGULAR'},
    {valor_funcionalidad:'0.5', escala_cualitativa: '5 - REGULAR'},
    {valor_funcionalidad:'0.6', escala_cualitativa: '6 - REGULAR'},
    {valor_funcionalidad:'0.7', escala_cualitativa: '7 - REGULAR'},
    {valor_funcionalidad:'0.8', escala_cualitativa: '8 - BUENO'},
    {valor_funcionalidad:'0.9', escala_cualitativa: '9 - BUENO'},
    {valor_funcionalidad:'1', escala_cualitativa: '10 - BUENO'},
  ]);

	const lista_devaluo = ref([
    {devaluo_anual:'0.50', descripcion: '1ER AÑO - (0.50)'},
    {devaluo_anual:'0.30', descripcion: '2DO AÑO - (0.30)'},
    {devaluo_anual:'0.20', descripcion: '3ER AÑO - (0.20)'},
		{devaluo_anual:'0.05', descripcion: '4TO AÑO O MÁS - (0.05)'},
  ]);

	const lista_modelos = ref([
		{ valor: 'ACTUAL' },
		{ valor: 'MEDIO' },
		{ valor: 'ANTIGUO' }
	])

  const lista_equipos_electronicos = ref([
		{ valor: 'CELULAR' },
		{ valor: 'COMPUTADORAS' },
		{ valor: 'EQUIPAMIENTO-ACCESORIOS DE VIVIENDA O NEGOCIO' }
	])


	const lista_marcas = ref([])
	const getCellPhonesList = async() => {
		lista_marcas.value = await resourceStore.getCellPhones()
	}

	const lista_celular_precio = ref([])
	const getCellPhoneBasePriceList = async() => {
		lista_celular_precio.value = await resourceStore.getCellPhoneBasePrice()
	}

	const lista_so = ref([])
	const getOperatingSystemsList = async() => {
		lista_so.value = await resourceStore.getOperatingSystems()
	}

	const lista_so_precio = ref([])
	const getOperatingSystemBasePriceList = async() => {
		lista_so_precio.value = await resourceStore.getOperatingSystemBasePrice()
	}

	const lista_componentes = ref([])
	const getComputerComponentList = async() => {
		lista_componentes.value = await resourceStore.getComputerComponent()
	}

	const lista_equipamiento_precio = ref([])
	const getElectronicEquipmentBasePriceList = async() => {
		lista_equipamiento_precio.value = await resourceStore.getElectronicEquipmentBasePrice()
	}

  const resetForm = () => {
    state.formulario_1.id_ee_celular_marca = ''
    state.formulario_1.modelo = ''
    state.formulario_1.numero_imei_esn = ''
    state.formulario_1.color = ''
    state.formulario_1.estado_celular = ''
    state.formulario_1.funcionamiento = ''
    state.formulario_1.observaciones = ''
    state.formulario_1.precio_base = ''
    state.formulario_1.valor_funcionalidad = ''
    state.formulario_1.devaluo_anual = ''
    state.formulario_1.avaluo_provisional = ''

    state.formulario_2.id_ee_computadora_sistema_operativo = ''
    state.formulario_2.modelo = ''
    state.formulario_2.numero_serie = ''
    state.formulario_2.color = ''
    state.formulario_2.estado_computadora = ''
    state.formulario_2.funcionamiento = ''
    state.formulario_2.observaciones = ''
    state.formulario_2.precio_base = ''
    state.formulario_2.valor_funcionalidad = ''
    state.formulario_2.devaluo_anual = ''
    state.formulario_2.avaluo_provisional = ''
    state.formulario_2.id_ee_computadora_componente = ''
    state.formulario_2.nombre_componente = ''
    state.formulario_2.descripcion = ''
    state.formulario_2.inventario_pc = []

    state.formulario_3.id_ee_equipamiento = ''
    state.formulario_3.nombre_equipamiento = ''
    state.formulario_3.cantidad = ''
    state.formulario_3.numero_serie = ''
    state.formulario_3.observaciones = ''
    state.formulario_3.precio_base = ''
    state.formulario_3.valor_funcionalidad = ''
    state.formulario_3.avaluo_provisional = ''
    state.formulario_3.inventario_equipamiento = []
  }

	const setCellPhoneBasePrice = () => {
		if(state.formulario_1.id_ee_celular_marca && state.formulario_1.modelo){
			const registro: any = lista_celular_precio.value.find(
				(celular: any) =>
				celular.id_ee_celular_marca == state.formulario_1.id_ee_celular_marca &&
				celular.modelo == state.formulario_1.modelo
			)
			state.formulario_1.precio_base = registro.precio_base
		}
  }

	const setCellPhoneProvisionalAppraisal = () => {
    miValidacion()
    if(state.formulario_1.precio_base && state.formulario_1.valor_funcionalidad && state.formulario_1.devaluo_anual){
      state.formulario_1.avaluo_provisional = state.formulario_1.precio_base*state.formulario_1.valor_funcionalidad*state.formulario_1.devaluo_anual
      state.formulario_1.avaluo_provisional = Number(state.formulario_1.avaluo_provisional).toFixed(2)
    }else{
      state.formulario_1.avaluo_provisional = ''
    }
  }

	const setComputerBasePrice = () => {
		if(state.formulario_2.id_ee_computadora_sistema_operativo && state.formulario_2.modelo){
			const registro: any = lista_so_precio.value.find(
				(pc: any) =>
				pc.id_ee_computadora_sistema_operativo == state.formulario_2.id_ee_computadora_sistema_operativo &&
				pc.modelo == state.formulario_2.modelo
			)
			state.formulario_2.precio_base = registro.precio_base
		}
  }

	const setComputerProvisionalAppraisal = () => {
    //miValidacion()
    if(state.formulario_2.precio_base && state.formulario_2.valor_funcionalidad && state.formulario_2.devaluo_anual){
      state.formulario_2.avaluo_provisional = state.formulario_2.precio_base*state.formulario_2.valor_funcionalidad*state.formulario_2.devaluo_anual
      state.formulario_2.avaluo_provisional = Number(state.formulario_2.avaluo_provisional).toFixed(2)
    }else{
      state.formulario_2.avaluo_provisional = ''
    }
  }

	const setComponentName = () => {
    const registro: any = lista_componentes.value.find(
			(componente: any) =>
			componente.id == state.formulario_2.id_ee_computadora_componente 
		)
    state.formulario_2.nombre_componente = registro.nombre_componente
  }

	const setEquipmentName = () => {
    const registro: any = lista_equipamiento_precio.value.find(
			(equipamiento: any) =>
			equipamiento.id == state.formulario_3.id_ee_equipamiento 
		)
    state.formulario_3.nombre_equipamiento = registro.nombre_equipamiento
  }

	const setEquipmentBasePrice = () => {
		if(state.formulario_3.id_ee_equipamiento){
			const registro: any = lista_equipamiento_precio.value.find(
				(equipamiento: any) =>
				equipamiento.id == state.formulario_3.id_ee_equipamiento
			)
			state.formulario_3.precio_base = registro.precio_base
		}
  }

	const setEquipmentProvisionalAppraisal = () => {
    if(state.formulario_3.cantidad && state.formulario_3.precio_base && state.formulario_3.valor_funcionalidad){
      state.formulario_3.avaluo_provisional = state.formulario_3.cantidad*state.formulario_3.precio_base*state.formulario_3.valor_funcionalidad
      state.formulario_3.avaluo_provisional = Number(state.formulario_3.avaluo_provisional).toFixed(2)
    }else{
      state.formulario_3.avaluo_provisional = ''
    }
  }

  const getElectronicById = async(id_bien_registro: any) => {
    const resultado = await electronicStore.electronic(id_bien_registro)
    if(!resultado.nuevo){
      nuevo.value = false
      state.formData.tipo_equipo_electronico = resultado.tipo_equipo_electronico

      const formulario_1 = resultado.formulario_1
      if(formulario_1.avaluo_provisional){
        state.formulario_1.id_ee_celular_marca = formulario_1.id_ee_celular_marca
        state.formulario_1.modelo = formulario_1.modelo
        state.formulario_1.numero_imei_esn = formulario_1.numero_imei_esn
        state.formulario_1.color = formulario_1.color
        state.formulario_1.estado_celular = formulario_1.estado_celular
        state.formulario_1.funcionamiento = formulario_1.funcionamiento
        state.formulario_1.observaciones = formulario_1.observaciones
        state.formulario_1.precio_base = formulario_1.precio_base
        state.formulario_1.valor_funcionalidad = formulario_1.valor_funcionalidad
        state.formulario_1.devaluo_anual = formulario_1.devaluo_anual
        state.formulario_1.avaluo_provisional = formulario_1.avaluo_provisional
      }

      const formulario_2 = resultado.formulario_2
      if(formulario_2.avaluo_provisional){
        state.formulario_2.id_ee_computadora_sistema_operativo = formulario_2.id_ee_computadora_sistema_operativo
        state.formulario_2.modelo = formulario_2.modelo
        state.formulario_2.numero_serie = formulario_2.numero_serie
        state.formulario_2.color = formulario_2.color
        state.formulario_2.estado_computadora = formulario_2.estado_computadora
        state.formulario_2.funcionamiento = formulario_2.funcionamiento
        state.formulario_2.observaciones = formulario_2.observaciones
        state.formulario_2.precio_base = formulario_2.precio_base
        state.formulario_2.valor_funcionalidad = formulario_2.valor_funcionalidad
        state.formulario_2.devaluo_anual = formulario_2.devaluo_anual
        state.formulario_2.avaluo_provisional = formulario_2.avaluo_provisional

        const inventario_pc = formulario_2.inventario_pc
        for (let i = 0; i < inventario_pc.length; i++) {
          state.formulario_2.inventario_pc.push(inventario_pc[i])
        }
      }

      const formulario_3 = resultado.formulario_3
      if(formulario_3.inventario_equipamiento){
        const inventario_equipamiento = formulario_3.inventario_equipamiento
        for (let i = 0; i < inventario_equipamiento.length; i++) {
          state.formulario_3.inventario_equipamiento.push(inventario_equipamiento[i])
        }
      }

      const fotografias = resultado.formulario_4.fotografias
      for (let i = 0; i < fotografias.length; i++) {
        state.formulario_4.fotografias.push(fotografias[i]) 
      }
    }
  }

  const buttonAddComponent = async () => {
      state.formulario_2.inventario_pc.push({
      id_ee_computadora_componente: state.formulario_2.id_ee_computadora_componente,
      nombre_componente: state.formulario_2.nombre_componente,
      descripcion: state.formulario_2.descripcion
    })
    state.formulario_2.id_ee_computadora_componente = ''
    state.formulario_2.nombre_componente = ''
    state.formulario_2.descripcion = ''
  }

  const buttonDeleteComponent = (index: number) => {
    state.formulario_2.inventario_pc.splice(index,1)
  }

  const buttonAddEquipment = async () => {
    addEquipamentButton.value = true
    await addEquipamentValidacion()
    if(!sendEquipament.value) return

    state.formulario_3.inventario_equipamiento.push({
      id_ee_equipamiento: state.formulario_3.id_ee_equipamiento,
      nombre_equipamiento: state.formulario_3.nombre_equipamiento,
			cantidad: state.formulario_3.cantidad,
			numero_serie: state.formulario_3.numero_serie,
			observaciones: state.formulario_3.observaciones,
			precio_base: state.formulario_3.precio_base,
			valor_funcionalidad: state.formulario_3.valor_funcionalidad,
      avaluo_provisional: state.formulario_3.avaluo_provisional
    })
    state.formulario_3.id_ee_equipamiento = ''
    state.formulario_3.nombre_equipamiento = ''
    state.formulario_3.cantidad = ''
		state.formulario_3.numero_serie = ''
		state.formulario_3.observaciones = ''
		state.formulario_3.precio_base = ''
		state.formulario_3.valor_funcionalidad = ''
		state.formulario_3.avaluo_provisional = ''
    addEquipamentButton.value = false
  }

  const addEquipamentValidacion = async () =>{
    sendEquipament.value = true
    sendForm1.value = true
    sendForm.value = true
    if (!state.formulario_3.id_ee_equipamiento || 
    !state.formulario_3.cantidad || 
    !state.formulario_3.numero_serie ||
    !state.formulario_3.precio_base || 
    !state.formulario_3.valor_funcionalidad) {
      sendEquipament.value = false
      sendForm1.value = false
      sendForm.value = false

    }
  }

  const buttonDeleteEquipment = (index: number) => {
    state.formulario_3.inventario_equipamiento.splice(index,1)
  }

  const buttonDeletePicture = (index: number, id_ee_imagen:number) => {
    state.id_imagenes_eliminadas.push(id_ee_imagen)
    state.formulario_4.fotografias.splice(index,1)
  }  

  //validacion para todo el formulario
  const miValidacion = async () => {
    sendForm.value = true
    sendForm1.value = true
    sendForm2.value = true
    //sendForm1.value = true
    //sendForm4.value = true
    isValidSize.value = true
    //const maxSizeImage = 5 * 1024 * 1024
    //SI NO EXISTE EL TIPO EQUIPO ELECTRONICO 
    if(!state.formData.tipo_equipo_electronico){
      sendForm.value = false
      sendForm1.value = false
    }
    if(state.formData.tipo_equipo_electronico=="CELULAR"){
      if(!state.formulario_1.id_ee_celular_marca || 
      !state.formulario_1.modelo || 
      !state.formulario_1.numero_imei_esn || 
      !state.formulario_1.color || 
      !state.formulario_1.valor_funcionalidad || 
      !state.formulario_1.devaluo_anual){
        sendForm.value = false
        sendForm1.value = false
      }
    }
    if(state.formData.tipo_equipo_electronico=="COMPUTADORAS"){
      if(!state.formulario_2.id_ee_computadora_sistema_operativo || 
      !state.formulario_2.modelo || 
      !state.formulario_2.color ||
      !state.formulario_2.numero_serie ||
      !state.formulario_2.valor_funcionalidad || 
      !state.formulario_2.devaluo_anual){
        sendForm.value = false
        sendForm1.value = false
      }
    }
    if(state.formData.tipo_equipo_electronico=="EQUIPAMIENTO-ACCESORIOS DE VIVIENDA O NEGOCIO" && 
    state.formulario_3.inventario_equipamiento.length == 0){        
        sendForm.value = false
        sendForm1.value = false
    }
    if(state.formulario_4.fotografias.length == 0){
      sendForm.value = false
      //sendForm2.value = false
    } 
  }

  const buttonReturnList = () => {
    router.back()
  }

  const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return
    state.formData.celular = state.formulario_1
    state.formData.computadora = state.formulario_2
    state.formData.equipamiento = state.formulario_3
    state.formData.imagenes = state.formulario_4.fotografias
    state.formData.id_imagenes_eliminadas = state.id_imagenes_eliminadas
    isLoading.value = true

    // SE GUARDA DEL FORMULARIO 
    const { ok, message, id } = nuevo.value ? await electronicStore.createElectronic(state.formData) : await electronicStore.updateElectronic(state.formData)    
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
      electronicStore.electronicReport(id)
    }
  }

  onMounted( async () => {
		await getCellPhonesList()
		await getCellPhoneBasePriceList()
		await getOperatingSystemsList()
		await getOperatingSystemBasePriceList()
		await getComputerComponentList()
		await getElectronicEquipmentBasePriceList()
    await getElectronicById(route.params.id_bien_registro)
  })
  
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h5 mb-6 mt-3">Inventario para recepción de Equipos electronicos</h5>
      <v-expansion-panels v-model="openpanel">

        <v-expansion-panel elevation="10">
          <v-expansion-panel-title class="text-h6">1. CARACTERISTICAS</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row>

              <v-col cols="12">
                <v-label class="mb-2 font-weight-medium">TIPO DE EQUIPO ELECTRONICO
                </v-label>
                <v-select
                  :items="lista_equipos_electronicos"
                  item-title="valor"
                  item-value="valor"
                  no-data-text="No existe más opciones para seleccionar"
                  v-model="state.formData.tipo_equipo_electronico"
                  @update:model-value="resetForm()"
                  :disabled="!nuevo"
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.tipo_equipo_electronico"
                  hide-details
                  clearable
                />
                <template v-if="submitButton && !state.formData.tipo_equipo_electronico">
                  <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                      El campo es requerido
                    </div>
                  </div>
                </template>
              </v-col>
            </v-row>
            
            <template v-if="state.formData.tipo_equipo_electronico == 'CELULAR'">
              <h3 class="my-3 text-primary">INVENTARIO EN CASO DE CELULARES</h3>
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">MARCA</v-label>
                  <v-select
                    v-model="state.formulario_1.id_ee_celular_marca"
                    :items="lista_marcas"
                    item-title="nombre_marca"
                    item-value="id"
                    @update:model-value="setCellPhoneBasePrice(); setCellPhoneProvisionalAppraisal()"
                    @input="miValidacion()"
                    :error="submitButton && !state.formulario_1.id_ee_celular_marca"
                    hide-details
                  ></v-select>
                  <template v-if="submitButton && !state.formulario_1.id_ee_celular_marca">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">MODELO</v-label>
                  <v-select
                    v-model="state.formulario_1.modelo"
                    :items="lista_modelos"
                    item-title="valor"
                    item-value="valor"
                    @update:model-value="setCellPhoneBasePrice(); setCellPhoneProvisionalAppraisal()"
                    @input="miValidacion()"
                    :error="submitButton && !state.formulario_1.modelo"
                    hide-details
                  ></v-select>
                  <template v-if="submitButton && !state.formulario_1.modelo">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">NUMERO IMEI/ESN</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_1.numero_imei_esn"
                    @input="miValidacion(), state.formulario_1.numero_imei_esn = validateText(state.formulario_1.numero_imei_esn.toUpperCase())"
                    :error="submitButton && !state.formulario_1.numero_imei_esn"
                    hide-details
                  />
                  <template v-if="submitButton && !state.formulario_1.numero_imei_esn">
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
                  <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_1.estado_celular"
                    @input="state.formulario_1.estado_celular = validateText(state.formulario_1.estado_celular.toUpperCase())"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">FUNCIONAMIENTO</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_1.funcionamiento"
                    @input="state.formulario_1.funcionamiento = validateText(state.formulario_1.funcionamiento.toUpperCase())"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_1.observaciones"
                    @input="state.formulario_1.observaciones = validateText(state.formulario_1.observaciones.toUpperCase())"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="number"
                    v-model="state.formulario_1.precio_base"
                    @input="setCellPhoneProvisionalAppraisal()"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">VALOR FUNCIONALIDAD</v-label>
                  <v-select
                    v-model="state.formulario_1.valor_funcionalidad"
                    :items="lista_funcionalidad"
                    item-title="escala_cualitativa"
                    item-value="valor_funcionalidad"
                    @update:model-value="setCellPhoneProvisionalAppraisal()"
                    @input="miValidacion()"
                    :error="submitButton && !state.formulario_1.valor_funcionalidad"
                    hide-details
                  ></v-select>
                  <template v-if="submitButton && !state.formulario_1.valor_funcionalidad">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">DEVALUO ANUAL</v-label>
                  <v-select
                    v-model="state.formulario_1.devaluo_anual"
                    :items="lista_devaluo"
                    item-title="descripcion"
                    item-value="devaluo_anual"
                    @update:model-value="setCellPhoneProvisionalAppraisal()"
                    @input="miValidacion()"
                    :error="submitButton && !state.formulario_1.devaluo_anual"
                    hide-details
                  ></v-select>
                  <template v-if="submitButton && !state.formulario_1.devaluo_anual">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">AVALUO PROVISIONAL</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="number"
                    v-model="state.formulario_1.avaluo_provisional"
                    readonly
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </template>

            <template v-if="state.formData.tipo_equipo_electronico == 'COMPUTADORAS'">
              <h3 class="my-3 text-primary">INVENTARIO EN CASO DE COMPUTADORAS</h3>    
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">MARCA</v-label>
                  <v-select
                    v-model="state.formulario_2.id_ee_computadora_sistema_operativo"
                    :items="lista_so"
                    item-title="nombre_sistema_operativo"
                    item-value="id"
                    @update:model-value="setComputerBasePrice(); setComputerProvisionalAppraisal(); miValidacion()"
                    :error="submitButton && !state.formulario_2.id_ee_computadora_sistema_operativo"
                    hide-details
                  ></v-select>
                  <template v-if="submitButton && !state.formulario_2.id_ee_computadora_sistema_operativo">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">MODELO</v-label>
                  <v-select
                    v-model="state.formulario_2.modelo"
                    :items="lista_modelos"
                    item-title="valor"
                    item-value="valor"
                    @update:model-value="setComputerBasePrice(); setComputerProvisionalAppraisal(); miValidacion()"
                    :error="submitButton && !state.formulario_2.modelo"
                    hide-details
                  ></v-select>
                  <template v-if="submitButton && !state.formulario_2.modelo">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">NUMERO IMEI/ESN</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_2.numero_serie"
                    @input="miValidacion(), state.formulario_2.numero_serie = validateText(state.formulario_2.numero_serie.toUpperCase())"
                    :error="submitButton && !state.formulario_2.numero_serie"
                    hide-details
                  />                  
                  <template v-if="submitButton && !state.formulario_2.numero_serie">
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
                    v-model.trim="state.formulario_2.color"
                    @input="miValidacion(), state.formulario_2.color = validateText(state.formulario_2.color.toUpperCase())"
                    :error="submitButton && !state.formulario_2.color"
                    hide-details
                  >
                  </v-text-field>
                  <template v-if="submitButton && !state.formulario_2.color">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">ESTADO</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_2.estado_computadora"
                    @input="state.formulario_2.estado_computadora = validateText(state.formulario_2.estado_computadora.toUpperCase())"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">FUNCIONAMIENTO</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_2.funcionamiento"
                    @input="state.formulario_2.funcionamiento = validateText(state.formulario_2.funcionamiento.toUpperCase())"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_2.observaciones"
                    @input="state.formulario_2.observaciones = validateText(state.formulario_2.observaciones.toUpperCase())"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="number"
                    v-model="state.formulario_2.precio_base"
                    @input="setComputerProvisionalAppraisal();"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">VALOR FUNCIONALIDAD</v-label>
                  <v-select
                    v-model="state.formulario_2.valor_funcionalidad"
                    :items="lista_funcionalidad"
                    item-title="escala_cualitativa"
                    item-value="valor_funcionalidad"
                    @update:model-value="setComputerProvisionalAppraisal(); miValidacion()"
                    :error="submitButton && !state.formulario_2.valor_funcionalidad"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">DEVALUO ANUAL</v-label>
                  <v-select
                    v-model="state.formulario_2.devaluo_anual"
                    :items="lista_devaluo"
                    item-title="descripcion"
                    item-value="devaluo_anual"
                    @update:model-value="setComputerProvisionalAppraisal(); miValidacion()"
                    :error="submitButton && !state.formulario_2.devaluo_anual"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">AVALUO PROVISIONAL</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="number"
                    v-model="state.formulario_2.avaluo_provisional"
                    readonly
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <h3 class="mb-3 text-primary">Componentes</h3>

              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">COMPONENTE</v-label>
                  <v-select
                    v-model="state.formulario_2.id_ee_computadora_componente"
                    :items="lista_componentes"
                    item-title="nombre_componente"
                    item-value="id"
                    @update:model-value="setComponentName();"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="font-weight-medium mb-2">DESCRIPCIÓN</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_2.descripcion"
                    @input="state.formulario_2.descripcion = validateText(state.formulario_2.descripcion.toUpperCase())"
                  >
                  <template v-slot:append>
                    <v-btn 
                      color="primary"
                      @click= buttonAddComponent()
                    >
                      <PlusIcon/> Agregar
                    </v-btn>
                  </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mb-3">
                <v-col v-if="state.formulario_2.inventario_pc.length > 0" cols="12" md="12">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Componente</th>
                        <th class="text-center">Descripción</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in state.formulario_2.inventario_pc"
                        :key="index"
                      >
                        <td class="text-center">{{ index+1 }}</td>
                        <td class="text-center">{{ item.nombre_componente }}</td>
                        <td class="text-center">{{ item.descripcion }}</td>
                        <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteComponent(index)"/></td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </template>

            <template v-if="state.formData.tipo_equipo_electronico == 'EQUIPAMIENTO-ACCESORIOS DE VIVIENDA O NEGOCIO'">
              <h3 class="my-3 text-primary">INVENTARIO EN CASO DE EQUIPAMIENTO/ACCESORIOS DE VIVIENDA O NEGOCIO</h3>    
              <v-row>

                <v-col cols="12" md="4">
                  <v-label class="font-weight-medium mb-2">EQUIPAMIENTO</v-label>
                  <v-select
                    v-model="state.formulario_3.id_ee_equipamiento"
                    :items="lista_equipamiento_precio"
                    item-title="nombre_equipamiento"
                    item-value="id"
                    @update:model-value="setEquipmentName(); setEquipmentBasePrice(); addEquipamentValidacion()"
                    :error="addEquipamentButton && !state.formulario_3.id_ee_equipamiento"
                    hide-details
                  ></v-select>
                  <template v-if="addEquipamentButton && !state.formulario_3.id_ee_equipamiento">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="4">
                  <v-label class="font-weight-medium mb-2">CANTIDAD</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="number"
                    min="0"
                    v-model="state.formulario_3.cantidad"
                    @input="addEquipamentValidacion(), setEquipmentProvisionalAppraisal()"
                    :error="addEquipamentButton && !state.formulario_3.cantidad"
                    hide-details
                  >
                  </v-text-field>
                  <template v-if="addEquipamentButton && !state.formulario_3.cantidad">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="4">
                  <v-label class="font-weight-medium mb-2">NUMERO DE SERIE</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    v-model.trim="state.formulario_3.numero_serie"
                    @input="addEquipamentValidacion(), state.formulario_3.numero_serie = validateText(state.formulario_3.numero_serie.toUpperCase())"
                    :error="addEquipamentButton && !state.formulario_3.numero_serie"
                    hide-details
                  >
                  </v-text-field>
                  <template v-if="addEquipamentButton && !state.formulario_3.numero_serie">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="4">
                  <v-label class="font-weight-medium mb-2">PRECIO BASE</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="number"
                    min="0"
                    v-model="state.formulario_3.precio_base"
                    @input="addEquipamentValidacion(), setEquipmentProvisionalAppraisal()"
                    :error="addEquipamentButton && !state.formulario_3.precio_base"
                    hide-details
                  >
                  </v-text-field>
                  <template v-if="addEquipamentButton && !state.formulario_3.precio_base">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="4">
                  <v-label class="font-weight-medium mb-2">VALOR FUNCIONALIDAD</v-label>
                  <v-select
                    v-model="state.formulario_3.valor_funcionalidad"
                    :items="lista_funcionalidad"
                    item-title="escala_cualitativa"
                    item-value="valor_funcionalidad"
                    @update:model-value="setEquipmentProvisionalAppraisal(); addEquipamentValidacion()"
                    :error="addEquipamentButton && !state.formulario_3.valor_funcionalidad"
                    hide-details
                  ></v-select>
                  <template v-if="addEquipamentButton && !state.formulario_3.valor_funcionalidad">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>
                </v-col>
                <v-col cols="12" md="4">
                  <v-label class="font-weight-medium mb-2">AVALUO PROVISIONAL</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="number"
                    v-model="state.formulario_3.avaluo_provisional"
                    readonly                    
                  >
                  </v-text-field>                  
                </v-col>
                <v-col cols="12" md="12">
                  <v-label class="font-weight-medium mb-2">OBSERVACIONES</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model.trim="state.formulario_3.observaciones"
                    @input="state.formulario_3.observaciones = validateText(state.formulario_3.observaciones.toUpperCase())"
                  >
                  <template v-slot:append>
                    <v-btn 
                      color="primary"
                      @click= buttonAddEquipment()
                    >
                      <PlusIcon/> Agregar
                    </v-btn>
                  </template>
                  </v-text-field>
                </v-col>

              </v-row>

              <v-row class="mb-3">
                <v-col v-if="state.formulario_3.inventario_equipamiento.length > 0" cols="12" md="12">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Equipamiento</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-center">Número de serie</th>
                        <th class="text-center">Precio base</th>
                        <th class="text-center">Valor funcionalidad</th>
                        <th class="text-center">Avaluo provisional</th>
                        <th class="text-center">Observaciones</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in state.formulario_3.inventario_equipamiento"
                        :key="index"
                      >
                        <td class="text-center">{{ index+1 }}</td>
                        <td class="text-center">{{ item.nombre_equipamiento }}</td>
                        <td class="text-center">{{ item.cantidad }}</td>
                        <td class="text-center">{{ item.numero_serie }}</td>
                        <td class="text-center">{{ item.precio_base }}</td>
                        <td class="text-center">{{ item.valor_funcionalidad }}</td>
                        <td class="text-center">{{ item.avaluo_provisional }}</td>
                        <td class="text-center">{{ item.observaciones }}</td>
                        <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteEquipment(index)"/></td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </template>
                       
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && !sendForm1">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error">
              Debe subir informacion 
            </div>
          </div>
        </template>
        <!-- <template v-if="submitButton && !sendForm1">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Campos de formulario incompletos
            </div>
          </div>
        </template> -->

        <v-expansion-panel elevation="10" class="mt-3">
          <v-expansion-panel-title class="text-h6">2. FOTOGRAFIA</v-expansion-panel-title>
          <v-expansion-panel-text class="mt-4">
            <v-row class="mb-5 justify-center">
              <v-col cols="5">
                <v-btn class="bg-primary" @click="openModal('electronico-general')" block>
                  <CloudUploadIcon class="mx-2"></CloudUploadIcon> Subir Imagen
                </v-btn>

                
              </v-col>
            </v-row>
            
            <v-row v-if="state.formulario_4.fotografias.length > 0">
              <v-col cols="12" md="6" v-for="(imagen, index) in state.formulario_4.fotografias">
                <v-card elevation="10" rounded="md">
                  <div class="text-center py-3">
                    <img :src="imagen.imagen" alt="noImage" height="250"/>
                  </div>
                  <div class="d-flex justify-end mr-3 mt-n3 pb-1">
                    <v-btn size="30" icon variant="flat" color="#EF5350" class="d-flex" @click="buttonDeletePicture(index, imagen.id_ee_imagen)">
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
            </v-row>

          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="submitButton && state.formulario_4.fotografias.length == 0">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error">
              Debe subir al menos una imagen
            </div>
          </div>
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
.size_fijo {
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
</style>