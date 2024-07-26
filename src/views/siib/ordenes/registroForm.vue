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
       
        id_trabajo:'', 
        id_tipo_trabajo:'',
        nombre_trabajo:'',
        id_diagnostico: '', 
        nombre_diagnostico:'', 
        id_motor: [] as any, 
        id_a:'',
        nombre_a:'',
        idalimentacion: [] as any, 
        id_r:'',
        nombre_r:'',
        idrefreigeracion: [] as any, 
        id_d:'',
        nombre_d:'',
        iddireccion: [] as any, 
        id_t:'',
        nombre_t:'',
        idtransmision: [] as any, 
        id_s:'',
        nombre_s:'',
        idsuspencion: [] as any, 
        idelectricidad: [] as any, 
        id_e:'',
        nombre_e:'',
        idchaperia: [] as any, 
        id_c:'',
        nombre_c:'',
        idtorneria: [] as any, 
        id_tt:'',
        nombre_tt:'',
        idfrenos: [] as any,
        id_f:'',
        nombre_f:'', 
   
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
  const tipo_mantenimiento = ref([]) as any
  const tipo_mantenimiento2 = ref([]) as any
  const tipo_mantenimiento3 = ref([]) as any
  const tipo_mantenimiento4 = ref([]) as any
  const tipo_mantenimiento5 = ref([]) as any
  const tipo_mantenimiento6 = ref([]) as any
  const tipo_mantenimiento7 = ref([]) as any
  const tipo_mantenimiento8 = ref([]) as any
  const tipo_mantenimiento9 = ref([]) as any
  const tipo_mantenimiento10 = ref([]) as any
//  const tipo_mantenimiento7 = ref([]) as any
  //const tipo_mantenimiento =['MANTENIMIENTO PREVENTIVO', 'MANTENIMIENTO CORRECTIVO', 'REVISIÓN', 'REVISIÓN DE NIVELES']
  const getResourcesList = async () => {
    lista_diagnosticos.value = await registro.gettipo_trabajo() 
    tipo_mantenimiento2.value = await registro.gettipo_mantenimiento()     // LISTA DE accesorios
    tipo_mantenimiento.value = await registro.gettipo_mantenimiento()   
    tipo_mantenimiento3.value = await registro.gettipo_mantenimiento()   
    tipo_mantenimiento4.value = await registro.gettipo_mantenimiento()   
    tipo_mantenimiento5.value = await registro.gettipo_mantenimiento()   
    tipo_mantenimiento6.value = await registro.gettipo_mantenimiento()  
    tipo_mantenimiento7.value = await registro.gettipo_mantenimiento()   
    tipo_mantenimiento8.value = await registro.gettipo_mantenimiento()   
    tipo_mantenimiento9.value = await registro.gettipo_mantenimiento()   
    tipo_mantenimiento10.value = await registro.gettipo_mantenimiento()    
  //  console.log(tipo_mantenimiento.value)
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
   // console.log(data)
    //console.log(data)
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
      id_motor.id == state.formData.id_diagnostico
  
    )
    state.formData.nombre_diagnostico = registro.nombre_diagnostico

    //al
    const registro2: any = tipo_mantenimiento2.find(
      (idalimentacion: any) => 
      idalimentacion.id == state.formData.id_a
  
    )
    state.formData.nombre_a = registro2.nombre_a

    //refri
    const registro3: any = tipo_mantenimiento3.find(
      (idrefreigeracion: any) => 
      idrefreigeracion.id == state.formData.id_r
  
    )
    state.formData.nombre_r = registro3.nombre_r

    //direccion
    const registro4: any = tipo_mantenimiento4.find(
      (iddireccion: any) => 
      iddireccion.id == state.formData.id_d
  
    )
    state.formData.nombre_d = registro4.nombre_d

    //trans 
    const registro5: any = tipo_mantenimiento5.find(
      (idtransmision: any) => 
      idtransmision.id == state.formData.id_t
  
    )
    state.formData.nombre_d = registro5.nombre_d

    const registro6: any = tipo_mantenimiento6.find(
      (idsuspencion: any) => 
      idsuspencion.id == state.formData.id_s
  
    )
    state.formData.nombre_s = registro6.nombre_s

    const registro7: any = tipo_mantenimiento7.find(
      (idelectricidad: any) => 
      idelectricidad.id == state.formData.id_e
  
    )
    state.formData.nombre_e = registro7.nombre_e

    const registro8: any = tipo_mantenimiento8.find(
      (idchaperia: any) => 
      idchaperia.id == state.formData.id_c
  
    )
    state.formData.nombre_c = registro8.nombre_c
    const registro9: any = tipo_mantenimiento9.find(
      (idtorneria: any) => 
      idtorneria.id == state.formData.id_tt
  
    )
    state.formData.nombre_tt = registro9.nombre_tt

    state.formData.nombre_c = registro8.nombre_c
    const registro10: any = tipo_mantenimiento10.find(
      (idfrenos: any) => 
      idfrenos.id == state.formData.id_f
  
    )
    state.formData.nombre_f = registro10.nombre_f
  }
  //trans

  
  



  // AGREGA TIPO DE CODIGO A LA TABLA DE CODIGOS
  const buttonAddCode = () => {
    console.log('clic')

    if(state.formData.id_diagnostico){
      tipo_mantenimiento.value = tipo_mantenimiento.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_diagnostico
      )
      state.formData.id_motor.push({
        id_diagnostico: state.formData.id_diagnostico,
      
      })

      state.formData.id_diagnostico = ''
    
    }
    


    if(state.formData.id_a){
      tipo_mantenimiento2.value = tipo_mantenimiento2.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_a
      )
      state.formData.idalimentacion.push({
        id_a: state.formData.id_a,
        
      })

      state.formData.id_a = ''
  
    }

    if(state.formData.id_r){
      tipo_mantenimiento3.value = tipo_mantenimiento3.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_r
      )
      state.formData.idrefreigeracion.push({
        id_r: state.formData.id_r,
        
      })

      state.formData.id_r = ''
  
    }
    console.log(state.formData.id_d)
    if(state.formData.id_d){
      tipo_mantenimiento4.value = tipo_mantenimiento4.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_d
      )
      state.formData.iddireccion.push({
        id_d: state.formData.id_d,
        
      })

      state.formData.id_d = ''
  
    }
   
    console.log(state.formData.id_t)
    if(state.formData.id_t){
      tipo_mantenimiento5.value = tipo_mantenimiento5.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_t
      )
      state.formData.idtransmision.push({
        id_t: state.formData.id_t,
        
      })

      state.formData.id_t = ''
  
    }


    console.log(state.formData.id_s)
    if(state.formData.id_s){
      tipo_mantenimiento6.value = tipo_mantenimiento6.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_s
      )
      state.formData.idsuspencion.push({
        id_s: state.formData.id_s,
        
      })

      state.formData.id_s = ''
    }

    console.log(state.formData.id_e)
    if(state.formData.id_e){
      tipo_mantenimiento7.value = tipo_mantenimiento7.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_e
      )
      state.formData.idelectricidad.push({
        id_e: state.formData.id_e,
        
      })

      state.formData.id_e = ''
  
    }

    console.log(state.formData.id_c)
    if(state.formData.id_c){
      tipo_mantenimiento8.value = tipo_mantenimiento8.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_c
      )
      state.formData.idchaperia.push({
        id_c: state.formData.id_c,
        
      })

      state.formData.id_c = ''
  
    }

    console.log(state.formData.id_tt)
    if(state.formData.id_tt){
      tipo_mantenimiento9.value = tipo_mantenimiento9.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_tt
      )
      state.formData.idtorneria.push({
        id_tt: state.formData.id_tt,
        
      })

      state.formData.id_tt = ''
  
    }

    if(state.formData.id_f){
      tipo_mantenimiento10.value = tipo_mantenimiento10.value.filter(
        (codigo: any) =>
        codigo.nombre_diagnostico != state.formData.id_f
      )
      state.formData.idfrenos.push({
        id_f: state.formData.id_f,
        
      })

      state.formData.id_f = ''
  
    }
  }

  // ELIMINA TIPO DE CODIGO DE LA TABLA DE CODIGOS
  const buttonDeleteCode = (index: number) => {

      if(state.formData.id_motor.length>0){

          const registro: any = state.formData.id_motor[index]
          tipo_mantenimiento.value.push({
            id: registro.id_diagnostico,
            nombre_diagnostico: registro.id_diagnostico
      
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento.value.sort(function(a: any, b: any) {
            const codigo_a = a.nombre_diagnostico
            const codigo_b = b.nombre_diagnostico
        
              if(codigo_a < codigo_b){
                return -1
              }
              if(codigo_a > codigo_b){
                return 1
              }
              return 0
          })
          state.formData.id_motor.splice(index,1)
          //alimentacuo
      }
  

      if(state.formData.idalimentacion.length>0){
        const registro2: any = state.formData.idalimentacion[index]

          tipo_mantenimiento2.value.push({
            id: registro2.id_a,
            nombre_diagnostico: registro2.id_a
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento2.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idalimentacion.splice(index,1)
      }

      if(state.formData.idrefreigeracion.length>0){

        const registro3: any = state.formData.idrefreigeracion[index]

          tipo_mantenimiento3.value.push({
            id: registro3.id_recepcion_documental,
            nombre_diagnostico: registro3.id_r
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento3.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idrefreigeracion.splice(index,1)
      }


      if(state.formData.iddireccion.length>0){
        const registro2: any = state.formData.iddireccion[index]

          tipo_mantenimiento4.value.push({
            id: registro2.id_recepcion_documental,
            nombre_diagnostico: registro2.id_d
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento4.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.iddireccion.splice(index,1)
      }
          if(state.formData.idtransmision.length>0){
        const registro2: any = state.formData.idtransmision[index]

          tipo_mantenimiento5.value.push({
            id: registro2.id_recepcion_documental,
            nombre_diagnostico: registro2.id_t
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento5.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idtransmision.splice(index,1)
      }
  
      if(state.formData.idsuspencion.length>0){
        const registro2: any = state.formData.idsuspencion[index]

          tipo_mantenimiento6.value.push({
            id: registro2.id_recepcion_documental,
            nombre_diagnostico: registro2.id_s
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento6.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idsuspencion.splice(index,1)
      }
  

      if(state.formData.idelectricidad.length>0){
        const registro2: any = state.formData.idelectricidad[index]

          tipo_mantenimiento7.value.push({
            id: registro2.id_recepcion_documental,
            nombre_diagnostico: registro2.id_s
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento7.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idelectricidad.splice(index,1)
      }
  
      if(state.formData.idchaperia.length>0){
        const registro2: any = state.formData.idchaperia[index]

          tipo_mantenimiento8.value.push({
            id: registro2.id_recepcion_documental,
            nombre_diagnostico: registro2.id_c
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento8.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idchaperia.splice(index,1)
      }
  

      if(state.formData.idtorneria.length>0){
        const registro2: any = state.formData.idtorneria[index]

          tipo_mantenimiento9.value.push({
            id: registro2.id_recepcion_documental,
            nombre_diagnostico: registro2.id_tt
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento9.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idtorneria.splice(index,1)
      }

      
      if(state.formData.idfrenos.length>0){
        const registro2: any = state.formData.idfrenos[index]

          tipo_mantenimiento10.value.push({
            id: registro2.id_recepcion_documental,
            nombre_diagnostico: registro2.id_f
          })
          // REORDENAMIENTO DE LISTA
          tipo_mantenimiento10.value.sort(function(aa: any, bb: any) {
            const codigo_a = aa.nombre_diagnostico
            const codigo_b = bb.nombre_diagnostico
          
            if(codigo_a < codigo_b){
              return -1
            }
            if(codigo_a > codigo_b){
              return 1
            }
            return 0
          })
          state.formData.idfrenos.splice(index,1)
      }

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
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
          Motor
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento"
          v-model="state.formData.id_diagnostico"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_diagnostico">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.id_motor.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.id_motor"
              :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_diagnostico }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>


    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
          Alimentación
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento2"
          v-model="state.formData.id_a"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_a">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idalimentacion.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idalimentacion"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_a }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
          Refrigeración
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento3"
          v-model="state.formData.id_r"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_r">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idrefreigeracion.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idrefreigeracion"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_r }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
          Dirección
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento4"
          v-model="state.formData.id_d"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_d">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.iddireccion.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.iddireccion"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_d }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
        <b>Transmisión</b>
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento5"
          v-model="state.formData.id_t"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_t">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idtransmision.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idtransmision"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_t }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
        <b>Suspensión</b>
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento6"
          v-model="state.formData.id_s"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_s">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idsuspencion.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idsuspencion"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_s }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
        <b> Electricidad</b>
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento7"
          v-model="state.formData.id_e"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_e">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idelectricidad.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idelectricidad"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_e }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
        <b>Chaperia</b>
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento8"
          v-model="state.formData.id_c"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_c">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idchaperia.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idchaperia"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_c }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
        <b> Tornería</b>
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento9"
          v-model="state.formData.id_tt"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_tt">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idtorneria.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idtorneria"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_tt }}</td>
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">
        <b> Frenos</b>
        </v-label>
        <v-autocomplete
        :items="tipo_mantenimiento10"
          v-model="state.formData.id_f"
          no-data-text="No existe más opciones para seleccionar"
          item-value="nombre_diagnostico"
          item-title="nombre_diagnostico"
          @update:model-value="setCodeName()"
          
        > <template v-slot:append>
          <v-btn 
            color="primary"
            @click= buttonAddCode()
            :disabled="!state.formData.id_f">
            <PlusIcon/> Agregar
          </v-btn>
        </template>
      
      </v-autocomplete>
       
      </v-col>
     
    </template>

    <template v-if="state.formData.idfrenos.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center"><b> Descripción de trabajo</b></th>
              
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.idfrenos"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.id_f }}</td>
            
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
