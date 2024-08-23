<script setup lang="ts">
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue';
import { TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { format } from 'date-fns'
import { useResourceStore } from '@/stores/resource';
import { useDocumentaryReceptionStore } from '@/stores/moduleOne/documentaryReception';
import { useOrdenStore } from '@/stores/orden/orden';
import { validateText } from '@/utils/helpers/validateText'
import { editPermission } from '@/utils/helpers/editPermission' 

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import { readonly } from 'vue';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const orden = useOrdenStore()
  const tipos_combustible = ['GASOLINA', 'DIESEL', 'KEROSENE']
  const categorias_conductor = ['P', 'M', 'PROFESIONAL A', 'PROFESIONAL B', 'PROFESIONAL C', 'T', 'LICENCIA ESPECIAL']
  const submitButton = ref(false)
  const sendForm = ref(true)
  const searchLoading = ref(false)
  const isLoading = ref(false)
  const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  // BREADCRUMB
  const page = ref({ title: 'Registro de ingreso del vehículo' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '/home'
    },
    {
      text: 'Orden de mantenimiento',
      disabled: true,
      href: '#'
    }
  ]);


  const permisoEdicion = ref<any>(true)
  const currentDate = (route.params.id_caso != '0') ? '' : format(new Date(),"yyyy-MM-dd")
  const currentDate2 = format(new Date(), "yyyy-MM-dd");
  const editar = ref<any>(false)

  const state = reactive({
    formData: {
      id_orden: '',
      placa_chasis: '', 
      nombre_taller: '',
        placa:'', 
        chasis:'',
        marca:'',
        modelo:'',
        motor: '',
        anio_fabri:'', 
        color_ve:'',
        placas: '', 
        chasis_: '',
        kilometraje: '',
        nro_ocupantes: '', 
        combustible:'',
        fuerza_orden:'',
        tipo_orden: '', 
        nombre_conductor: '',
        celular_con: '',
        apellidos_condutor : '',
        prediagnostico: '', 
        mecanico_disponible:'',
        id_mecanico:'',
        id_vehiculo: '',
        nombre_completo: '', 
        nombre_accesorio: '',
        observacion_ac: '',
        fecha_formulario: currentDate2,
        id_persona: '',
        cedula_identidad: '',
        categoria_con:'',
        comparar_:'', 
        kilo_:'', 
        valido_kilo:'', 
        estado_orden:'',
    }
  });


  //const accesorios = [ 'PARRILLA', 'PORTA CARPA', 'CARPA', 'ASIENTOS DE CARROCERÍA', 'MATABURROS', 'ALÓGENOS', 'GUINCHE']
  // RECURSOS
 
  const lista_accesorios = ref([]) as any

  const getResourcesList = async () => {
    lista_accesorios.value = await resourceStore.getAccesorios()      // LISTA DE accesorios
  }

  const ordernes_id = async (id_orden: any) => {
  
    const data = await orden.orden_id(id_orden)
 //console.log(data)
   // state.formData. = data.id
    state.formData.id_orden = data.id_soli
    state.formData.chasis_= data.chasis
    state.formData.fecha_formulario = data.fecha
    state.formData.placas = data.placa
    state.formData.placa_chasis = data.placa
    state.formData.nro_ocupantes = data.nro_ocupantes
    state.formData.motor = data.motor
    state.formData.marca = data.marca
    state.formData.modelo = data.modelo
    state.formData.color_ve = data.color
    state.formData.combustible = data.combustible
    state.formData.tipo_orden = data.tipo
    state.formData.anio_fabri = data.año_registro
    state.formData.kilometraje = data.kilometraje
    editar.value = false
    state.formData.prediagnostico = data.prediagnostigo
    state.formData.nombre_conductor = data.nombre_conductor
    state.formData.apellidos_condutor = data.apellidos_conductor
    state.formData.cedula_identidad = data.carnet_conductor
    state.formData.mecanico_disponible = data.id
    state.formData.id_mecanico = data.mecanico_disponible
    state.formData.celular_con= data.celular_conductor
    state.formData.categoria_con = data.categoria
    state.formData.comparar_ = data.total
    state.formData.kilo_ = data.kilo_rem
    state.formData.estado_orden = data.estado
    let dato1  = parseInt(state.formData.comparar_)+1
      let dato2 = dato1* parseInt(state.formData.kilo_)
      state.formData.valido_kilo = dato2
 /*   const codigos = data.accesorios_orden
    state.formData.accesorios_orden = []
    for (let i = 0; i < codigos.length; i++) {
      state.formData.accesorios_orden.push(codigos[i])
      lista_accesorios.value = lista_accesorios.value.filter( (tipo: any) => tipo.nombre_accesorio != codigos[i].nombre_accesorio)
    }*/

   
   // state.formData.investigador_presente = true
  }

  const placeholderHojaRuta = () => {
    const arrayfechas = currentDate.split('-')
    const respuesta = 'MG-'+arrayfechas[0]+arrayfechas[1]+arrayfechas[2]+'-###'
    return respuesta
  }






  // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
  const buttonSearchOrden = async () => {
    state.formData.id_persona = ''
    const respuesta_info = await orden.searchInfo(state.formData)
     ///console.log(respuesta_info.length)
    if(!respuesta_info){
     // console.log('busqueda 2')
      const respuesta = await orden.searchOrden(state.formData)
      //console.log(respuesta)
                state.formData.color_ve = respuesta.color 
                state.formData.tipo_orden= respuesta.tipo_v
                state.formData.chasis_ = respuesta.chasis
            
                state.formData.placas = respuesta.placa
                state.formData.modelo = respuesta.modelo
                state.formData.marca = respuesta.marca
                state.formData.motor = respuesta.motor
                state.formData.anio_fabri = respuesta.anio_registro
                state.formData.nro_ocupantes = respuesta.nro_ocupantes
                state.formData.fuerza_orden = respuesta.nombre_fuerza
                state.formData.combustible = respuesta.combustible
                editar.value = true

      //console.log('viendo_', JSON.stringify(respuesta, null, 2))
          if(!respuesta){
            Toast.fire({
              icon: 'error',
              title: 'No se encontro información'
            })
          // DESBLOQUEAR EL INPUT
          
          }else{
            Toast.fire({
              icon: 'success',
              title: 'Resultado Obtenido Satisfactoriamente'
            })
          }

      // DESBLOQUEAR EL INPUT
      }else{
        Toast.fire({
          icon: 'success',
          title: 'Resultado Obtenido Satisfactoriamente'
        })
        //si ya se registro anteriormente

        state.formData.color_ve = respuesta_info.color 
                state.formData.tipo_orden= respuesta_info.tipo
                state.formData.chasis_ = respuesta_info.chasis
            
                state.formData.placas = respuesta_info.placa
                state.formData.modelo = respuesta_info.modelo
                state.formData.marca = respuesta_info.marca
                state.formData.motor = respuesta_info.motor
                state.formData.anio_fabri = respuesta_info.año_registro
                state.formData.nro_ocupantes = respuesta_info.nro_ocupantes
                state.formData.fuerza_orden = respuesta_info.nombre_fuerza
                state.formData.combustible = respuesta_info.combustible
                
                
                editar.value = true
                state.formData.nombre_conductor= respuesta_info.nombre_conductor
                state.formData.apellidos_condutor = respuesta_info.apellidos_conductor
                state.formData.cedula_identidad = respuesta_info.carnet_conductor
                state.formData.categoria_con = respuesta_info.categoria
                state.formData.celular_con = respuesta_info.celular_conductor
                state.formData.comparar_ = respuesta_info.total
                state.formData.kilo_ = respuesta_info.kilometraje
                state.formData.id_vehiculo = respuesta_info.id_vehiculo

      }
  //  const respuesta = await orden.searchOrden(state.formData)
  /*  if(Object.prototype.hasOwnProperty.call(respuesta, 'id')){
      // console.log('UTILIZANDO DESDE DB');
        Toast.fire({
          icon: 'success',
          title: 'Resultado Obtenido Satisfactoriamente'
        })
      }else{
        Toast.fire({
          icon: 'error',
          title: 'No se encontro información'
        })
      }*/

    /*  if (JSON.stringify(respuesta, null, 2)) {
  console.log('El objeto está vacío');
} else {
  console.log('El objeto no está vacío');
}*/
   /*  console.log('viendo_ ' + respuesta)
      if(!respuesta){
        Toast.fire({
          icon: 'error',
          title: 'No se encontro información'
        })
      // DESBLOQUEAR EL INPUT
      }else{
        Toast.fire({
          icon: 'success',
          title: 'Resultado Obtenido Satisfactoriamente'
        })
      }

      //console.log('viendo_', JSON.stringify(respuesta, null, 2));
    state.formData.color_ve = respuesta.color 
    state.formData.tipo_orden= respuesta.tipo_v
    state.formData.chasis_ = respuesta.chasis
 
    state.formData.placas = respuesta.placa
    state.formData.modelo = respuesta.modelo
    state.formData.marca = respuesta.marca
    state.formData.motor = respuesta.motor
    state.formData.anio_fabri = respuesta.anio_registro
    state.formData.nro_ocupantes = respuesta.nro_ocupantes
    state.formData.fuerza_orden = respuesta.nombre_fuerza
    state.formData.combustible = respuesta.combustible
    editar.value = true*/

  }

  const validateKilometraje = () => {
    //verificar que sea distinto de cero 

    //console.log(' ver'+ state.formData.comparar_)
     if(parseInt(state.formData.comparar_)> 0 ){
   //   console.log('existen registros')
      let dato1  = parseInt(state.formData.comparar_)+1
      let dato2 = dato1* parseInt(state.formData.kilo_)
      state.formData.valido_kilo = dato2
      //console.log( 'valor '+ state.formData.valido_kilo) 
        if(parseInt(state.formData.kilometraje)>=parseInt(state.formData.kilo_) && parseInt(state.formData.kilometraje)<=dato2  ){
        //  console.log('registro')
          Toast.fire({
          icon: 'success',
          title: 'Kilometraje valido'
        })
        }else{
          Toast.fire({
              icon: 'error',
              title: 'No corresponde el registro, verifique información'
            })
        }
     }else{

      Toast.fire({
          icon: 'success',
          title: 'Primer registro'
        })
     }
    //const dato1  = parseInt(state.formData.comparar_)* parseInt(state.formData.kilo_)
   // console.log( 'valor '+ dato1)
  }

  const buttonClearOrden = () => {

    state.formData.id_orden= ''
     state.formData.placa_chasis='' 
      state.formData.nombre_taller=''
        state.formData.placa=''
        state.formData.chasis=''
        state.formData.marca=''
        state.formData.modelo=''
        state.formData.motor= ''
        state.formData.anio_fabri='' 
        state.formData.color_ve=''
        state.formData.placas= ''
        state.formData.chasis_= ''
        state.formData.kilometraje= ''
        state.formData.nro_ocupantes= '' 
        state.formData.combustible=''
        state.formData.fuerza_orden=''
        state.formData.tipo_orden= ''
        editar.value = false

  }


  const buttonReturnList = () => {
    router.push({ name: 'ordenList' })
  }



  const buttonSendForm = async () => {
    console.log('registroooo')
    submitButton.value = true
    await validateForm()
    if(!sendForm.value) return

    isLoading.value = true
    if(route.params.id_orden == '0'){
      // ES NUEVO REGISTRO
      console.log('registroooo')

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

          const { ok, message, caso, rd } = await orden.create_orden(state.formData)
          const icono = (ok ? 'success' : 'error')
          Toast.fire({ icon: icono, title: message })
          if(caso != 0 && rd != 0){
           // await documentaryReceptionStore.minutesReport(caso, rd)
          }
        }
      })
    }else{
      // NO ES NUEVO REGISTRO
      if(permisoEdicion.value){
        // SI TIENE PERMISO DE EDICIO
        const { ok, message } = await orden.updateOrdenID(state.formData)
        const icono = (ok ? 'success' : 'error')
        Toast.fire({ icon: icono, title: message })
       /* if(caso != 0 && rd != 0){
          await documentaryReceptionStore.minutesReport(caso, rd)
        }*/
      }else{
        // NO TIENE PERMISO DE EDICION, SOLO REPORTE
       /* await documentaryReceptionStore.minutesReport(Number(state.formData.id_caso), Number(state.formData.id_recepcion_documental))*/
        router.push({ name: 'ordenList' });
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
  // VALIDACION GENERAL
  const validateForm = async () => {
    sendForm.value = true
    if(!state.formData.placa_chasis ||
      (state.formData.kilometraje>= state.formData.kilo_ ||  state.formData.kilometraje<=state.formData.valido_kilo ) &&
      !state.formData.combustible ||
      !state.formData.cedula_identidad ||
      !state.formData.nombre_conductor ||
      !state.formData.apellidos_condutor ||
      !state.formData.celular_con ||
      !state.formData.id_mecanico ){
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
  const desserts = ref([]) as any
const getMecanicos = async() => {
    desserts.value = await orden.getDisponibles() 
}
  onMounted(async () => {
    await getResourcesList()
    await getMecanicos()
    await placeholderHojaRuta()
    if(route.params.id_orden  != '0'){
      //.value = editPermission('RECEPCION DOCUMENTAL')
      //await getOrdenes_soli()
      await ordernes_id(route.params.id_orden)

      editar.value = true

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
        - <span class="text-primary">Debe ingresar para el registro del vehículo la placa o chasis</span><br>
      </v-alert>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <b> REGISTRO DEL DOCUMENTO: </b> Todos los campos son obligatorios
      </h4>
    </v-col>
  </v-row>

  <v-row>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Chasis o placa <span style="color:red">*</span></v-label>
                <v-text-field
                  variant="outlined"
                  color="primary"
                  type="text"
                  :readonly="editar"
                  v-model.trim="state.formData.placa_chasis"
                  @input="state.formData.placa_chasis = validateText(state.formData.placa_chasis.toUpperCase());"
                  :error="submitButton && !state.formData.placa_chasis"
                  hide-details
                >
                  <template v-slot:append>
                    <template v-if="route.params.id_orden=='0'">
                      <v-btn
                        color="primary"
                        @click= buttonSearchOrden()
                        :disabled="!state.formData.placa_chasis"><SearchIcon/>Buscar
                      </v-btn>
                      <v-btn
                        color="secondary"
                        @click= buttonClearOrden()
                        :disabled="!state.formData.placa_chasis"><TrashIcon/>Limpiar
                      </v-btn>
                    </template>
                    
                  </template>
                </v-text-field>
              </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
Fecha de Registro<span style="color:red">*</span>
      </v-label>
      <v-text-field 
        type="date" 
        id="date" 
        name="date"
        v-model="state.formData.fecha_formulario"
        :min="currentDate2"
        :max="currentDate2"
        :error="submitButton && !state.formData.marca"

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
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
        Tipo  <span style="color:red">*</span>
      </v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model="state.formData.tipo_orden"
        readonly
        hide-details
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
        Marca<span style="color:red">*</span>
      </v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model.trim="state.formData.marca"
        @input="state.formData.marca =  validateText(state.formData.marca.toUpperCase());"
        readonly 
        hide-details
      />
      
      <template v-if="submitButton && !state.formData.marca">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
        Color<span style="color:red">*</span>
      </v-label>
      <div v-if="state.formData.color_ve != ''">
        <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.color_ve"
        @input="state.formData.color_ve = validateText(state.formData.color_ve.toUpperCase())"
        :error="submitButton && !state.formData.color_ve"

        hide-details
         />
          <template v-if="submitButton && !state.formData.color_ve">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
      </div>
      <div v-else>
        <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.color_ve"
            @input=" state.formData.color_ve= validateText(state.formData.color_ve.toUpperCase())"
            :error="submitButton && !state.formData.color_ve"
            hide-details
          />
          <template v-if="submitButton && !state.formData.color_ve">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
      </div>

    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Año de Ingreso<span style="color:red">*</span></v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model.trim="state.formData.anio_fabri"
        @input="state.formData.anio_fabri = validateText(state.formData.anio_fabri.toUpperCase())"
        readonly
        :error="submitButton && !state.formData.anio_fabri"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Placa <span style="color:red">*</span></v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model.trim="state.formData.placas"
        @input="state.formData.placas = validateText(state.formData.placas.toUpperCase())"
        readonly
        :error="submitButton && !state.formData.placas"
        hide-details
      ></v-text-field>
      <template v-if="submitButton && !state.formData.placas">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Chasis <span style="color:red">*</span></v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.chasis_"
        @input="state.formData.chasis_ = validateText(state.formData.chasis_.toUpperCase())"
        readonly 
        hide-details
      ></v-textarea>
    </v-col><v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Motor</v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.motor"
        @input="state.formData.motor = validateText(state.formData.motor.toUpperCase())"
        readonly
        hide-details
      ></v-textarea>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Kilometraje <b>(Actual)</b> <span style="color:red">*</span></v-label>
      <v-text-field
                  variant="outlined" 
                  color="primary"
                  type="number"
                  min="1"
                 
                   @input="validateKilometraje()"
        v-model.trim="state.formData.kilometraje"
        :error="submitButton && !state.formData.kilometraje"

        hide-details
      ></v-text-field>
      <template v-if="submitButton && !state.formData.kilometraje ">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <div v-if="state.formData.nro_ocupantes != '0'  ">
      <v-label class="mb-2 font-weight-medium">N° de ocupantes </v-label>
      <v-text-field 
         variant="outlined" 
         color="primary"
        type="number"
         min="1"
        v-model.trim="state.formData.nro_ocupantes"
        @input="state.formData.nro_ocupantes "
        hide-details
        :readonly="editar"
      ></v-text-field>
      </div>
      
      <div v-else>
      <v-label class="mb-2 font-weight-medium">N° de ocupantes </v-label>
      <v-text-field 
         variant="outlined" 
         color="primary"
        type="number"
         min="1"
        v-model.trim="state.formData.nro_ocupantes"
        @input="state.formData.nro_ocupantes"
        hide-details
        
      ></v-text-field>
      </div>
    </v-col>
    <template v-if="submitButton && !state.formData.nro_ocupantes">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Tipo de combustible</v-label>
     <div v-if="state.formData.combustible === ''">
      <v-select
            v-model="state.formData.combustible"
            :items="tipos_combustible"
            item-title="nombre_region"
            item-value="nombre_region"
            :error="submitButton && !state.formData.combustible"
             

          ></v-select>
      <template v-if="submitButton && !state.formData.combustible">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
     </div>
     <div v-else>
      <v-select
            v-model="state.formData.combustible"
            :items="tipos_combustible"
            item-title="nombre_region"
            item-value="nombre_region"
            :error="submitButton && !state.formData.combustible"
            :readonly="editar"

          ></v-select>
     </div>
    </v-col>

    <v-col cols="12" lg="12">
      <h3 class="my-3 text-primary">INFORMACIÓN DEL CONDUCTOR</h3>
    </v-col>

    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Licencia  <span style="color:red">*</span></v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.cedula_identidad"
        @input="state.formData.cedula_identidad = validateText(state.formData.cedula_identidad.toUpperCase())"
        :error="submitButton && !state.formData.cedula_identidad"

        hide-details
      ></v-textarea>
      <template v-if="submitButton && !state.formData.cedula_identidad">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Categoria  <span style="color:red">*</span></v-label>
      <v-select
            v-model="state.formData.categoria_con"
            :items="categorias_conductor"
            item-title="nombre"
            item-value="nombre"
            :error="submitButton && !state.formData.categoria_con"
        

          ></v-select>
      <template v-if="submitButton && !state.formData.categoria_con">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>

    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Nombres  <span style="color:red">*</span></v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.nombre_conductor"
        @input="state.formData.nombre_conductor = validateText(state.formData.nombre_conductor.toUpperCase())"
        :error="submitButton && !state.formData.nombre_conductor"

        hide-details
      ></v-textarea>
      <template v-if="submitButton && !state.formData.nombre_conductor">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Apellidos  <span style="color:red">*</span></v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.apellidos_condutor"
        @input="state.formData.apellidos_condutor = validateText(state.formData.apellidos_condutor.toUpperCase())"
        :error="submitButton && !state.formData.apellidos_condutor"

        hide-details
      ></v-textarea>
      <template v-if="submitButton && !state.formData.apellidos_condutor">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Celular  <span style="color:red">*</span></v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.celular_con"
        @input="state.formData.celular_con = validateText(state.formData.celular_con.toUpperCase())"
        :error="submitButton && !state.formData.celular_con"

        hide-details
      ></v-textarea>
    </v-col>
    <v-col class="12" md="4">
      <v-label class="mb-2 font-weight-medium">Mecanicos disponibles</v-label>

      <v-select
            v-model="state.formData.id_mecanico"
            :items="desserts"
            item-title="mecanico_disponible"
            item-value="id"
            :error="submitButton && !state.formData.id_mecanico"
          ></v-select>
          <template v-if="submitButton && !state.formData.id_mecanico">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>

    </v-col>

    <v-col cols="12">
      <h3 class="my-3 text-primary">PRE - DIAGNOSTICO</h3>
    </v-col>
    
    <v-col class="12" md="12">
        <v-text-field 
        variant="outlined" 
        color="primary"
        type="text"
        
        v-model="state.formData.prediagnostico"
        @input="state.formData.prediagnostico = validateText(state.formData.prediagnostico.toUpperCase())"

        :error="submitButton && !state.formData.prediagnostico"
        hide-details
      />
      <template v-if="submitButton && !state.formData.prediagnostico">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
</v-col>


  

  </v-row>

  <v-row>
    <v-col cols="12" class="text-lg-left pt-5">
      <template v-if="!isLoading">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
        <v-btn v-if="route.params.id_orden == '0' "
        color="primary" @click="buttonSendForm()">
          <template v-if="route.params.id_orden == '0' ">
            Enviar    
          </template>
         
         
        </v-btn>
        <v-btn  v-if="route.params.id_orden != '0' && state.formData.estado_orden==='EN PROCESO'"
        color="primary" @click="buttonSendForm()" >
      
          
          <template v-if="(route.params.id_orden != '0' && state.formData.estado_orden==='EN PROCESO') || userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('ADMINISTRADOR') ">
            Actualizar
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
