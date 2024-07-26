<script setup lang="ts">
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue';
import { TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { format } from 'date-fns'
import { useResourceStore } from '@/stores/resource';
import { useDocumentaryReceptionStore } from '@/stores/moduleOne/documentaryReception';
import { useOrdenStore } from '@/stores/orden/orden';
import { useRegisterStore } from '@/stores/orden/registro';

import { validateText } from '@/utils/helpers/validateText'
import { editPermission } from '@/utils/helpers/editPermission' 

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import { readonly } from 'vue';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const documentaryReceptionStore = useDocumentaryReceptionStore()
  const orden = useOrdenStore()
  const registro = useRegisterStore()
  const tipos_combustible = ['GASOLINA', 'DIESEL', 'KEROSENE']
  const submitButton = ref(false)
  const addButton = ref(false)
  const sendForm = ref(true)
  const sendPerson = ref(true)
  const testEmail = ref(true)
  const searchLoading = ref(false)
  const isLoading = ref(false)

  // BREADCRUMB
  const page = ref({ title: 'Orden de trabajo y servicios' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '/home'
    },
    {
      text: 'Talleres de mecanica',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DE VARIABLES Y STATE
  const perfilUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  const oficinaUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_oficina
  const permisoFecha = JSON.parse(localStorage.getItem('user') || '').estado
  const permisoEdicion = ref<any>(true)
  const panel = ref<any>(false)
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
        id_mecanico:'',
        id_vehiculo: '',
        nombre_completo: '', 
        nombre_accesorio: '',
        observacion_ac: '',
        id_accesorio: '', 
        accesorios_orden: [] as any,
        dato1:'',
        dato2:'',
        dato3:'',
        dato4:'', 
        nombre_dignostico:'',
        id_diagnostico: '', 

        id_tipo_trabajo:'',
        nombre_trabajo:'',
        id_motor: [] as any, 
        id_motor_:'',
        nombre_man:'', 
        idalimentacion: [] as any, 
        idrefreigeracion: [] as any, 
        iddireccion: [] as any, 
        idtransmision: [] as any, 
        idsuspencion: [] as any, 
        idelectricidad: [] as any, 
        idchaperia: [] as any, 
        idtorneria: [] as any, 
        idfrenos: [] as any, 
   
      cedula_identidad: '',
   
      implicados: [] as any,
      investigador_presente: false,
    }
  });

  const lista_tipo = ref([
    { title: 'INVESTIGADOR' },
    { title: 'ENLACE' }
  ]);

  //const accesorios = [ 'PARRILLA', 'PORTA CARPA', 'CARPA', 'ASIENTOS DE CARROCERÍA', 'MATABURROS', 'ALÓGENOS', 'GUINCHE']
  // RECURSOS
  const lista_tipo_codigo = ref([]) as any
  const lista_diagnosticos = ref([]) as any

  const lista_dependencia = ref([]) as any
  const jurisdicciones = ref([]) as any
  const lista_casos = ref([]) as any
  const tipo_mantenimiento =['MANTENIMIENTO PREVENTIVO', 'MANTENIMIENTO CORRECTIVO', 'REVISIÓN', 'REVISIÓN DE NIVELES']
  const getResourcesList = async () => {
    lista_diagnosticos.value = await registro.gettipo_trabajo()      // LISTA DE accesorios
    //console.log(lista_accesorios.value)
    /*lista_dependencia.value = await resourceStore.getDependencies()   // LISTA DE DEPENDENCIAS
    const jurisdictions = await resourceStore.getTalleres()            // LISTA DE JURISDICCIONES
    if(perfilUsuario != 'SUPERADMIN'){
      jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.nombre_oficina == oficinaUsuario )
    }else{
      jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.departamento != 'NACIONAL' )
    }
    lista_casos.value = await resourceStore.getInstances()*/
  }

  const recepciones = ref([]) as any

   

   const basico_id = async (id_orden: any) => {
   
   
   // const data = await registro.getbasico(id_orden)// console.log(data)
    const data = await registro.getbasico(id_orden)
    console.log(data)
    console.log(data)
    state.formData.id_orden = data.id
// state.formData. = data.id
    state.formData.id_orden =data.id
    state.formData.dato1= data.placa
    state.formData.dato2 = data.chasis
    state.formData.nombre_completo = data.nombre_conductor
    state.formData.dato3 = data.fecha
    state.formData.dato4 = data.prediagnostigo
    state.formData.marca = data.marca
    state.formData.kilometraje = data.kilometraje
    state.formData.tipo_orden = data.tipo 
    state.formData.color_ve = data.color


    
// recepciones.value =info
   } 
  const ordernes_id = async (id_orden: any) => {
  
    //const data = await registro.orden_id(id_orden)
/*
   // state.formData. = data.id
    state.formData.id_orden = data.id
    state.formData.chasis_= data.chasis
    state.formData.fecha_formulario = data.fecha
    state.formData.placas = data.placa
    state.formData.placa_chasis = data.placa
    state.formData.nro_ocupantes = data.nro_ocupantes
    state.formData.motor = data.motor
    state.formData.nombre_conductor = data.nombre_conductor
state.formData.apellidos_condutor = data.apellidos_conductor
state.formData.cedula_identidad = data.carnet_conductor
state.formData.id_mecanico = data.id_mecanico
state.formData.celular_con= data.celular_conductor
state.formData.marca = data.marca
state.formData.modelo = data.modelo
state.formData.color_ve = data.color
state.formData.combustible = data.combustible
state.formData.tipo_orden = data.tipo
state.formData.anio_fabri = data.año_registro
state.formData.kilometraje = data.kilometraje
state.formData.prediagnostico = data.prediagnostigo
editar.value = false

    const codigos = data.accesorios_orden
    state.formData.accesorios_orden = []
    for (let i = 0; i < codigos.length; i++) {
      state.formData.accesorios_orden.push(codigos[i])
      lista_accesorios.value = lista_accesorios.value.filter( (tipo: any) => tipo.nombre_accesorio != codigos[i].nombre_accesorio)
    }

   */
   // state.formData.investigador_presente = true
  }

  const placeholderHojaRuta = () => {
    const arrayfechas = currentDate.split('-')
    const respuesta = 'MG-'+arrayfechas[0]+arrayfechas[1]+arrayfechas[2]+'-###'
    return respuesta
  }

  const setCodeName = () => {
    const registro: any = tipo_mantenimiento.find(
      (id_motor: any) => 
      id_motor.id_motor_ == state.formData.id_motor_
    )
    state.formData.nombre_man = registro.nombre_man
  }

  // AGREGA TIPO DE CODIGO A LA TABLA DE CODIGOS
  const buttonAddCode = () => {
    console.log('clic')

   // console.log("recibiendo: " +state.formData.nombre_accesorio+ " id " +state.formData.id_accesorio)
    if(state.formData.id_motor_ && state.formData.nombre_man){
      tipo_mantenimiento = tipo_mantenimiento.filter(
        (codigo: any) =>
        codigo.id != state.formData.id_motor_
      )
      state.formData.id_motor.push({
        id_motor: state.formData.id_motor_,
        nombre_ma: state.formData.nombre_man,
       
      })

      state.formData.id_motor_= ''
      state.formData.nombre_man= ''
      state.formData.observacion_ac = ''
    }
    console.log(state.formData.accesorios_orden.length)

  }

  // ELIMINA TIPO DE CODIGO DE LA TABLA DE CODIGOS
  const buttonDeleteCode = (index: number) => {
    const registro: any = state.formData.accesorios_orden[index]
   lista_diagnosticos.value.push({
      id: registro.id_accesorio,
      nombre_accesorio: registro.nombre_accesorio
    })
    // REORDENAMIENTO DE LISTA
    lista_diagnosticos.value.sort(function(a: any, b: any) {
      const codigo_a = a.nombre_accesorio
      const codigo_b = b.nombre_accesorio
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    state.formData.accesorios_orden.splice(index,1)
  }

  // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
  const buttonSearchOrden = async () => {
  
    const respuesta = await orden.searchOrden(state.formData)
    state.formData.color_ve = respuesta.color 
    state.formData.tipo_orden= respuesta.tipo
    state.formData.chasis_ = respuesta.chasis
    state.formData.placas = respuesta.placa
    state.formData.modelo = respuesta.modelo
    state.formData.marca = respuesta.nombre_marca
    state.formData.motor = respuesta.motor
 
    state.formData.nro_ocupantes = respuesta.nro_ocupantes
    state.formData.fuerza_orden = respuesta.nombre_fuerza
    state.formData.combustible = respuesta.combustible
    editar.value = true

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
   
        state.formData.color_ve=''
        state.formData.placas= ''
        state.formData.chasis_= ''
        state.formData.kilometraje= ''
        state.formData.nro_ocupantes= '' 
        state.formData.combustible=''
        state.formData.fuerza_orden=''
        state.formData.tipo_orden= ''
        editar.value = true

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

  // VALIDACION PARA INGRESAR UN PERSONAL ASIGNADO A ENTREGA


  // VALIDACION GENERAL
  const validateForm = async () => {
    sendForm.value = true
    if(!state.formData.placa_chasis ||
      !state.formData.kilometraje ||
      !state.formData.combustible ||
      !state.formData.cedula_identidad ||
      !state.formData.nombre_conductor ||
      !state.formData.apellidos_condutor ||
      !state.formData.celular_con ||
      !state.formData.id_mecanico ||  state.formData.accesorios_orden.length == 0){
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
      await basico_id(route.params.id_orden)

      editar.value = true

    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-row >
    <v-col cols="12" lg="12">
      <v-alert
        variant="outlined"
        type="warning"
        border="top"
        icon="$warning"
        title="INFORMACIÓN DEL VEHÍCULO"
        closable
      >
        - <B>PLACA : </B><span class="text-primary" style='padding-right: 150px'> {{state.formData.dato1}} </span> 
          <B>CHASIS : </B><span class="text-primary" style='padding-right: 150px'>{{ state.formData.dato2 }} </span>
          <B>TIPO : </B><span class="text-primary" style='padding-right: 150px'>{{ state.formData.tipo_orden }} </span> <br>
        - <B>MARCA: </B><span class="text-primary" style='padding-right: 165px'>{{ state.formData.marca }} </span>
          <B>COLOR  : </B><span class="text-primary" style='padding-right: 270px'>{{ state.formData.color_ve }} </span>
          <B>FECHA DE INGRESO: </B><span class="text-primary" style='padding-right: 50px'>{{  state.formData.dato3 }}</span><br>
        - <B>CONDUCTOR : </B><span class="text-primary" style='padding-right: 60px'>{{  state.formData.nombre_completo }}</span> 
          <B>CEL : </B><span class="text-primary" style='padding-right: 200px'>{{  state.formData.dato3 }}</span>
        <B>PRE - DIAGNOSTICO : </B><span class="text-primary" style='padding-right: 150px'> {{ state.formData.dato4 }}</span>
        <br>

      </v-alert>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="12">
      <h3 class="my-3 text-primary">DESCRIPCIÓN DE TRABAJO</h3>
    </v-col>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <b> REGISTRO DEL DOCUMENTO: </b> Todos los campos son obligatorios
      </h4>
    </v-col>
  </v-row>

  <v-row>
    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Motor
        </v-label>
        <v-select
          :items="tipo_mantenimiento"
          v-model="state.formData.id_motor_"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id"
          item-title="nombre_man"
          @update:model-value="setCodeName()"
          
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Observación
        </v-label>
        <v-text-field 
          variant="outlined"
          color="primary"
          v-model.trim="state.formData.observacion_ac"
          @input="state.formData.observacion_ac = validateText(state.formData.observacion_ac.toUpperCase())"
        
        >
        <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_accesorio">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
        </v-text-field>
      </v-col>
    </template>

    <template v-if="state.formData.accesorios_orden.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Nombre accesorio</th>
              <th class="text-center">Observación</th>
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.accesorios_orden"
              :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_accesorio }}</td>
              <td class="text-center">{{ item.observacion_ac }}</td>
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>




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

<v-col class="cols 12" md="6">
  <v-autocomplete
  label="Motor"
  v-model="state.formData.id_motor_"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id"
          item-title="nombre_man"
            color="primary"
  :items="tipo_mantenimiento"
></v-autocomplete>
</v-col>
    

  


    <v-col cols="12" lg="12">
      <h3 class="my-3 text-primary">REGISTRO DE ACCESORIOS</h3>
    </v-col>
 

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Accesorios 
        </v-label>
        <v-select
          :items="lista_diagnosticos"
          v-model="state.formData.id_accesorio"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id"
          item-title="nombre_diagnostico"
          

          @update:model-value="setCodeName()"
          
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Observación
        </v-label>
        <v-text-field 
          variant="outlined"
          color="primary"
          v-model.trim="state.formData.observacion_ac"
          @input="state.formData.observacion_ac = validateText(state.formData.observacion_ac.toUpperCase())"
        
        >
        <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_accesorio">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
        </v-text-field>
      </v-col>
    </template>

    <template v-if="state.formData.accesorios_orden.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Nombre accesorio</th>
              <th class="text-center">Observación</th>
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.accesorios_orden"
              :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_accesorio }}</td>
              <td class="text-center">{{ item.observacion_ac }}</td>
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

  

  </v-row>

  <v-row>
    <v-col cols="12" class="text-lg-right pt-5">
      <template v-if="!isLoading">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
        <v-btn color="primary" @click="buttonSendForm()">
          <template v-if="route.params.id_orden == '0'">
            Enviar    
          </template>
          <template v-if="route.params.id_orden != '0' && permisoEdicion">
            Actualizar
          </template>
          <template v-if="route.params.id_orden != '0' && !permisoEdicion">
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
