<script setup lang="ts">
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue';
import { TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { format } from 'date-fns'
import { useResourceStore } from '@/stores/resource';

import { useOrdenStore } from '@/stores/orden/orden';
import { useRegisterStore } from '@/stores/orden/registro';
import { useSystemStore } from '@/stores/resources/system';
import { validateText } from '@/utils/helpers/validateText'
import { editPermission } from '@/utils/helpers/editPermission' 
import type { Header } from "vue3-easy-data-table";
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import { readonly } from 'vue';
const select = ref('');
const location = ref(['Alaska', 'Arizona', 'Hawaii']);
const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil

const radioColumn = ref('1');
const radioInline = ref('1');
const paymentradio = ref('1');
const checkedNames = ref([])
const openpanel = ref([0]);
  const route = useRoute()
  const resourceStore = useResourceStore()
  
  const orden = useOrdenStore()
  const registro = useRegisterStore()
  const getSystem = useSystemStore()
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
      text: 'Registro de Mantenimiento',
      disabled: true,
      href: '#'
    }
  ]);
 
  const sendForm1 = ref(true)
  const sendForm8 = ref(true)
  const sendForm9 = ref(true)
  const sendForm10 = ref(true)
  // DECLARACION DE VARIABLES Y STATE
  const perfilUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  const oficinaUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_oficina
  const permisoFecha = JSON.parse(localStorage.getItem('user') || '').estado
  const permisoEdicion = ref<any>(true)
  const panel = ref<any>(false)
  const currentDate = (route.params.id_orden != '0') ? '' : format(new Date(),"yyyy-MM-dd")
  const currentDate2 = format(new Date(), "yyyy-MM-dd");
  const editar = ref<any>(false)

  const state = reactive({
    formData: {
      id_orden: '',
      id_registro:'', 
        marca:'',
        color_ve:'',
        kilometraje: '',
        nro_ocupantes: '', 
        observaciones:'',
        requerimientos:'',
        tipo_orden: '', 
        nombre_conductor: '',
        celular_con: '',
        tipo_man:'',
        prediagnostico: '', 
        id_mecanico:'',
        id_vehiculo: '',
        nombre_completo: '', 
      
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
        id_sistema:'',
        sistema_select:'', 
        prueba:'', 
        repuestos: [] as any,
        nombre_repuesto:'',
        id_sis: '',
        id_filtro:'', 
        cantidad_r:'',
        unidad_r:'',
        observacion_r:'', 
        id_Rep:[] as any, 
        id_repuestos: '', 
        uno:'',
        dos:'',
        sinfonia:'', 
        estado_llantas:'', 
        gasolina:'', 
        tanque_aux:'', 
        id_accesorios_: []as any, 
        estado_orden:'', 
        
   
   
      
    }
  });

  // RECURSOS
  const lista_unidad = ref([]) as any
  const lista_diagnosticos = ref([]) as any
  const lista_accesorios = ref([]) as any
  const lista_sistemas = ref([]) as any
  const tipo_filtro= ref([]) as any
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
 
    lista_accesorios.value = await resourceStore.getAccesorios()      // LISTA DE accesorios
    // // LISTA DE sistemas
    lista_sistemas.value = await getSystem.systems()
    //console.log(lista_sistemas.value)
    tipo_filtro.value=await registro.getFiltros()
    //lista unidades
    lista_unidad.value=await registro.getUnidad()
  }
  
  const itemsSelected: any = ref([])
  const headers: Header[] = [
   
   { text: "DESCRIPCIÓN DEL REPUESTO", value: "nombre_repuesto" },
 ];
   // BUSQUEDA o despliegue de repuestos
   const desser = ref([]) as any
 const buttonSearchSistema = async () => {
  state.formData.id_sistema= ''
   state.formData.repuestos= await registro.searchOrden(state.formData)
}

   const basico_id = async (id_orden: any) => {
    const data = await registro.getbasico(id_orden)

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
    state.formData.prueba= data.prueba
    state.formData.uno= data.uno 
    state.formData.dos = data.dos
    state.formData.celular_con = data.celular_conductor
    state.formData.estado_orden = data.estado
   } 

   const verificar_id = async (id_orden: any) => {
    const data = await registro.verificar_reg(id_orden)
    const size = Object.keys(data).length;
  
   if(size>0){
    state.formData.id_registro = data.id_registro
   }else{
    state.formData.id_registro = String(size);
   }
   }

  const registro_id = async (id_registro: any) => {
    const data = await registro.registro_id(id_registro)
    state.formData.id_registro = data.id
    state.formData.tipo_man= data.tipo_man
    state.formData.observaciones = data.observacion
    state.formData.requerimientos = data.requerimiento
    state.formData.gasolina = data.gasolina_
    state.formData.tanque_aux = data.tanque_auxiliar
    state.formData.estado_llantas = data.estado_llantas
    state.formData.sinfonia = data.sintonia_
   const motores = data.id_motor
    state.formData.id_motor= []
    for (let i = 0; i < motores.length; i++) {
      state.formData.id_motor.push(motores[i])
      tipo_mantenimiento.value = tipo_mantenimiento.value.filter( (tipo: any) => tipo.nombre_diagnostico != motores[i].id_diagnostico)
    }
    
    const as = data.idalimentacion
    state.formData.idalimentacion = []
    for (let i = 0; i < as.length; i++) {
      state.formData.idalimentacion.push(as[i])
      tipo_mantenimiento2.value = tipo_mantenimiento2.value.filter( (tipo: any) => tipo.nombre_diagnostico != as[i].id_a)
    }
   
    const ref = data.idrefreigeracion
    state.formData.idrefreigeracion = []
    for (let i = 0; i < ref.length; i++) {
      state.formData.idrefreigeracion.push(ref[i])
      tipo_mantenimiento3.value = tipo_mantenimiento3.value.filter( (tipo: any) => tipo.nombre_diagnostico != ref[i].id_r)
    }

    const dir = data.iddireccion
    state.formData.iddireccion= []
    for (let i = 0; i < dir.length; i++) {
      state.formData.iddireccion.push(dir[i])
      tipo_mantenimiento4.value = tipo_mantenimiento4.value.filter( (tipo: any) => tipo.nombre_diagnostico != dir[i].id_d)
    }
    const trans = data.idtransmision
    state.formData.idtransmision= []
    for (let i = 0; i < trans.length; i++) {
      state.formData.idtransmision.push(trans[i])
      tipo_mantenimiento5.value = tipo_mantenimiento5.value.filter( (tipo: any) => tipo.nombre_diagnostico != trans[i].id_t)
    }
    
    const sus = data.idsuspencion
    state.formData.idsuspencion= []
    for (let i = 0; i < sus.length; i++) {
      state.formData.idsuspencion.push(sus[i])
      tipo_mantenimiento6.value = tipo_mantenimiento6.value.filter( (tipo: any) => tipo.nombre_diagnostico != sus[i].id_s)
    }
    const ele = data.idelectricidad
    state.formData.idelectricidad= []
    for (let i = 0; i < ele.length; i++) {
      state.formData.idelectricidad.push(ele[i])
      tipo_mantenimiento7.value = tipo_mantenimiento7.value.filter( (tipo: any) => tipo.nombre_diagnostico != ele[i].id_e)
    }
    const cha = data.idchaperia
    state.formData.idchaperia= []
    for (let i = 0; i < cha.length; i++) {
      state.formData.idchaperia.push(cha[i])
      tipo_mantenimiento8.value = tipo_mantenimiento8.value.filter( (tipo: any) => tipo.nombre_diagnostico != cha[i].id_c)
    }
    
    const ttt = data.idtorneria
    state.formData.idtorneria= []
    for (let i = 0; i < ttt.length; i++) {
      state.formData.idtorneria.push(ttt[i])
      tipo_mantenimiento9.value = tipo_mantenimiento9.value.filter( (tipo: any) => tipo.nombre_diagnostico != ttt[i].id_tt)
    }
    
    const fre = data.idfrenos
    state.formData.idfrenos= []
    for (let i = 0; i < fre.length; i++) {
      state.formData.idfrenos.push(fre[i])
      tipo_mantenimiento10.value = tipo_mantenimiento10.value.filter( (tipo: any) => tipo.nombre_diagnostico != fre[i].id_f)
    }
      
    const acce = data.id_accesorios_
    const n= data.id_accesorios_.map(item => item.id);
 
   state.formData.id_accesorios_= []
    for (let i = 0; i < acce.length; i++) {
      state.formData.id_accesorios_.push(n[i])
      lista_accesorios.value = lista_accesorios.value.filter( (tipo: any) => tipo != n[i])
    }

    const rep = data.id_Rep
    for (let i = 0; i < rep.length; i++) {
      state.formData.id_Rep.push(rep[i])
      tipo_filtro.value = tipo_filtro.value.filter( (tipo: any) => tipo.id !=rep[i].id_filtro)
    }

  }

  const placeholderHojaRuta = () => {
    const arrayfechas = currentDate.split('-')
    const respuesta = 'MG-'+arrayfechas[0]+arrayfechas[1]+arrayfechas[2]+'-###'
    return respuesta
  }

  const mifuncion = async () => {
   if(itemsSelected.value.length>0){
      const indice = itemsSelected.value.length-1
      state.formData.id_filtro= itemsSelected.value[indice].id
      state.formData.nombre_repuesto= itemsSelected.value[indice].nombre_repuesto
      state.formData.id_sis = itemsSelected.value[indice].id_sistema
    }

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

    if(state.formData.id_filtro && state.formData.cantidad_r && state.formData.unidad_r){
      tipo_filtro.value = tipo_filtro.value.filter(
        (codigo: any) =>
        codigo.id != state.formData.id_filtro
      )
      state.formData.id_Rep.push({
        id_filtro: state.formData.id_filtro,
        nombre_repuesto:state.formData.nombre_repuesto,
        cantidad_r: state.formData.cantidad_r,
        unidad_r:state.formData.unidad_r,
        observacion_r:state.formData.observacion_r
        
      })
      state.formData.id_filtro = ''
      state.formData.nombre_repuesto= ''
      state.formData.cantidad_r= ''
      state.formData.unidad_r = ''
      state.formData.observacion_r = ''
  
    }
  }

  const ButtonReport2 = async (item: any) => {
  const data2 = await registro.inventarioReport(item);
  console.log(data2)
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


  }

  const buttonDeleteA = (index: number) => {

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
  }

  const buttonDeleteR = (index: number) => {
    if(state.formData.idrefreigeracion.length>0){

const registro3: any = state.formData.idrefreigeracion[index]

  tipo_mantenimiento3.value.push({
    id: registro3.id_r,
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
  }

  const buttonDeleteD = (index: number) => {
    if(state.formData.iddireccion.length>0){
        const registro2: any = state.formData.iddireccion[index]

          tipo_mantenimiento4.value.push({
            id: registro2.id_d,
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
  }

  const buttonDeleteT = (index: number) => {
    if(state.formData.idtransmision.length>0){
        const registro2: any = state.formData.idtransmision[index]

          tipo_mantenimiento5.value.push({
            id: registro2.id_t,
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
  }

  const buttonDeleteS = (index: number) => {
    if(state.formData.idsuspencion.length>0){
        const registro2: any = state.formData.idsuspencion[index]

          tipo_mantenimiento6.value.push({
            id: registro2.id_s,
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
  
  }
  const buttonDeleteE = (index: number) => {
    if(state.formData.idelectricidad.length>0){
        const registro2: any = state.formData.idelectricidad[index]

          tipo_mantenimiento7.value.push({
            id: registro2.id_s,
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
  }
  const buttonDeleteC = (index: number) => {
    if(state.formData.idchaperia.length>0){
        const registro2: any = state.formData.idchaperia[index]

          tipo_mantenimiento8.value.push({
            id: registro2.id_c,
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
  
}
const buttonDeleteTT = (index: number) => {
  if(state.formData.idtorneria.length>0){
        const registro2: any = state.formData.idtorneria[index]

          tipo_mantenimiento9.value.push({
            id: registro2.id_tt,
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
}
const buttonDeleteF = (index: number) => {

  if(state.formData.idfrenos.length>0){
        const registro2: any = state.formData.idfrenos[index]

          tipo_mantenimiento10.value.push({
            id: registro2.id_f,
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

const buttonDeleteRep = (index: number) => {

if(state.formData.id_Rep.length>0){
      const registro2: any = state.formData.id_Rep[index]

        tipo_filtro.value.push({
          id: registro2.id_filtro,
          nombre_repuesto: registro2.id_f
        })
        // REORDENAMIENTO DE LISTA
        tipo_mantenimiento10.value.sort(function(aa: any, bb: any) {
          const codigo_a = aa.nombre_repuesto
          const codigo_b = bb.nombre_repuesto
        
          if(codigo_a < codigo_b){
            return -1
          }
          if(codigo_a > codigo_b){
            return 1
          }
          return 0
        })
        state.formData.id_Rep.splice(index,1)
    }

}
 

  const buttonClearSistema = () => {

    state.formData.sistema_select= ''
    itemsSelected.value.length=0
    state.formData.nombre_repuesto= ''
    state.formData.id_filtro=''     
    state.formData.repuestos.length = 0;
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
    if(state.formData.id_registro == '0' ){
      // ES NUEVO REGISTRO
      console.log('registroooo1010101')

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

          const { ok, message, caso, rd } = await registro.create_mantenimiento(state.formData)
          const icono = (ok ? 'success' : 'error')
          Toast.fire({ icon: icono, title: message })
          
        }
      })
    }else{
     
      if(state.formData.id_registro != '0'){
        console.log(state.formData.id_registro)
            if(permisoEdicion.value){
              // SI TIENE PERMISO DE EDICIO
              const { ok, message } = await registro.update_mantenimiento(state.formData)
              const icono = (ok ? 'success' : 'error')
              Toast.fire({ icon: icono, title: message })
          
            }else{
    
              router.push({ name: 'ordenList' });
            }

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
    if( !state.formData.tipo_man || 
       (state.formData.id_motor.length ==0 && state.formData.idsuspencion.length==0 
        && state.formData.idalimentacion.length == 0 && state.formData.idrefreigeracion.length==0 
        && state.formData.idelectricidad.length ==0 && state.formData.iddireccion.length ==0 
        && state.formData.idchaperia.length ==0 && state.formData.idtransmision.length ==0   
        && state.formData.idtorneria.length ==0 && state.formData.idfrenos.length ==0)|| 
       !state.formData.gasolina || !state.formData.tanque_aux || 
       !state.formData.sinfonia || !state.formData.estado_llantas || state.formData.id_Rep.length ==0 ){
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
      
      await verificar_id(route.params.id_orden)
  
      if(parseInt(state.formData.id_registro)>0){
        await registro_id(route.params.id_orden)
      }else{
        console.log('0')
      }
    
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
      <div style="display: flex; justify-content: space-between;">
  <div><b>PLACA :</b> <span class="text-primary">{{state.formData.dato1}}</span></div>
  <div><b>CHASIS :</b> <span class="text-primary">{{state.formData.dato2}}</span></div>
  <div><b>TIPO :</b> <span class="text-primary">{{state.formData.tipo_orden}}</span></div>
</div>

<div style="display: flex; justify-content: space-between;">
  <div><b>MARCA :</b> <span class="text-primary">{{state.formData.marca}}</span></div>
  <div><b>COLOR :</b> <span class="text-primary">{{state.formData.color_ve}}</span></div>
  <div><b>FECHA DE INGRESO :</b> <span class="text-primary">{{state.formData.dato3}}</span></div>
</div>

<div style="display: flex; justify-content: space-between;">
  <div><b>CONDUCTOR :</b> <span class="text-primary">{{state.formData.nombre_completo}}</span></div>
  <div><b>CEL :</b> <span class="text-primary">{{state.formData.celular_con}}</span></div>
  <div><b>PRE - DIAGNOSTICO :</b> <span class="text-primary">{{state.formData.dato4}}</span></div>
</div>
     

      </v-alert>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="12">
      <h3 class="my-3 text-primary">DESCRIPCIÓN DE TRABAJO</h3>
    </v-col>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <b> REGISTRO DEL DOCUMENTO: </b> Todos los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>
    </v-col>
  </v-row>

<v-rom>

    <v-expansion-panels v-model="openpanel">
        <!---Delivery Address--->
        <v-expansion-panel elevation="10"  >
            <v-expansion-panel-title class="text-h6">Descripción de Trabajo</v-expansion-panel-title>
            <v-expansion-panel-text class="mt-4">
             <v-row>
              <v-col cols="12" md="12">
        <v-label class="mb-2 font-weight-medium">Tipo de mantenimiento <span style="color:red">(*)</span></v-label>
        <v-radio-group 
          v-model="state.formData.tipo_man"
        
          class="ml-n3"
          inline
          :error="submitButton && !state.formData.tipo_man"
          hide-details
        >
          <v-radio label="CORRECTIVO" color="primary" value="CORRECTIVO"></v-radio>
          <v-radio label="PREVENTIVO" color="secondary" value="PREVENTIVO"></v-radio>
          <v-radio label="PREVENTIVO/CORRECTIVO" color="primary" value="PREVENTIVO/CORRECTIVO"></v-radio>
        </v-radio-group>
        <template v-if="submitButton && !state.formData.tipo_man">
          <div class="v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              El campo es requerido
            </div>
          </div>
        </template>

      </v-col>
              <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Motor
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
       
     
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Motor</th>
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
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Alimentación
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Alimentación</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteA(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Refrigeración
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Refrigeración</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteR(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
          Dirección
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Dirección</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteD(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
        <b>Transmisión</b>
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Transmisión</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteT(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
        <b>Suspensión</b>
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Suspensión</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteS(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
        <b> Electricidad</b>
        </v-label>
        <v-autocomplete

        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Electricidad</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteE(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
        <b>Chaperia</b>
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Chaperia</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteC(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
        <b> Tornería</b>
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Torneria</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteTT(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>

    <template v-if="permisoEdicion">
      <v-col cols="12" md="6">
        <v-label class="mb-2 font-weight-medium">
        <b> Frenos</b>
        </v-label>
        <v-autocomplete
        variant="outlined"
        color="primary"
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
      <v-col cols="12" md="6">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° Frenos</th>
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
            
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteF(index)"/></td>
              
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
             </v-row>
            </v-expansion-panel-text>
        </v-expansion-panel>

          <!---Payment Method--->
          <v-expansion-panel elevation="10" class=" mt-3">
            <v-expansion-panel-title class="text-h6" style="color:black;">Inventario del vehículo</v-expansion-panel-title>
            <v-expansion-panel-text class="mt-4">
               
                <v-row>
                  <v-col cols="12" md="3">
                  <v-label class="mb-2 font-weight-medium">Sinfonía de Radio<span style="color:red">(*)</span></v-label>
                  <v-radio-group 
                    v-model="state.formData.sinfonia"
                  
                    class="ml-n3"
                    inline
                    :error="submitButton && !state.formData.sinfonia"
                    hide-details
                  >
                    <v-radio label="AM" color="primary" value="AM"></v-radio>
                    <v-radio label="FM" color="secondary" value="FM"></v-radio>
                    <v-radio label="AM/FM" color="primary" value="AM/FM"></v-radio>
                  </v-radio-group>
                  <template v-if="submitButton && !state.formData.sinfonia">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>

                </v-col>
                <v-col cols="12" md="3">
                  <v-label class="mb-2 font-weight-medium">Estado de llantas<span style="color:red">(*)</span></v-label>
                  <v-radio-group 
                    v-model="state.formData.estado_llantas"
                  
                    class="ml-n3"
                    inline
                    :error="submitButton && !state.formData.estado_llantas"
                    hide-details
                  >
                    <v-radio label="B" color="primary" value="B"></v-radio>
                    <v-radio label="M" color="secondary" value="M"></v-radio>
                    <v-radio label="R" color="primary" value="R"></v-radio>
                  </v-radio-group>
                  <template v-if="submitButton && !state.formData.estado_llantas">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>

                </v-col>
                <v-col cols="12" md="3">
                  <v-label class="mb-2 font-weight-medium">Gasolina<span style="color:red">(*)</span></v-label>
                  <v-radio-group 
                    v-model="state.formData.gasolina"
                  
                    class="ml-n3"
                    inline
                    :error="submitButton && !state.formData.gasolina"
                    hide-details
                  >
                    <v-radio label="1/4" color="primary" value="1/4"></v-radio>
                    <v-radio label="1/2" color="secondary" value="1/2"></v-radio>
                    <v-radio label="3/4" color="primary" value="3/4"></v-radio>
                  </v-radio-group>
                  <template v-if="submitButton && !state.formData.gasolina">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>

                </v-col>
                <v-col cols="12" md="3">
                  <v-label class="mb-2 font-weight-medium">Tanque Auxiliar<span style="color:red">(*)</span></v-label>
                  <v-radio-group 
                    v-model="state.formData.tanque_aux"
                  
                    class="ml-n3"
                    inline
                    :error="submitButton && !state.formData.tanque_aux"
                    hide-details
                  >
                    <v-radio label="1/4" color="primary" value="1/4"></v-radio>
                    <v-radio label="1/2" color="secondary" value="1/2"></v-radio>
                    <v-radio label="3/4" color="primary" value="3/4"></v-radio>
                  </v-radio-group>
                  <template v-if="submitButton && !state.formData.tanque_aux">
                    <div class="v-messages font-weight-black px-2 py-2">
                      <div class="v-messages__message text-error ">
                        El campo es requerido
                      </div>
                    </div>
                  </template>

                </v-col>

                  <div class="checkbox-container">
                        <div v-for="item in lista_accesorios" :key="item" class="checkbox-item">
                        <label style=" font-size: small;">
                          <input type="checkbox" :value="item.id" v-model="state.formData.id_accesorios_" class="styled-checkbox"/>
                          {{ item.nombre_accesorio }}

                      </label>
                      </div>
                  </div>
                  
                  <v-col cols="12" lg="12">
                      <h3 class="my-3 text-primary">Observaciones</h3>
                  </v-col>
                  <v-col class="12" md="12">
                      <v-text-field 
                      variant="outlined" 
                      color="primary"
                      type="text"
                      
                      v-model="state.formData.observaciones"
                      @input="state.formData.observaciones = validateText(state.formData.observaciones.toUpperCase())"

                    
                      hide-details
                    />
                    </v-col>
              
                </v-row>

            </v-expansion-panel-text>
        </v-expansion-panel>
        <!---Delivery Options--->
        <v-expansion-panel elevation="10" class=" mt-3">
            <v-expansion-panel-title class="text-h6">Solicitud de Repuestos</v-expansion-panel-title>
            <v-expansion-panel-text class="mt-4">
               <v-row>
                <v-col cols="12" md="12">
         
         <v-select
             v-model.trim="state.formData.sistema_select"
             :items="lista_sistemas"
             item-title="nombre_sistema"
             item-value="id"
             no-data-text="No existe más opciones para seleccionar"
             :error="submitButton && !state.formData.sistema_select"
             clearable
          >
         <template v-slot:append v-if="route.params.id_orden != '0'">
             <v-btn
               color="primary"
               @click= buttonSearchSistema()
               :disabled="!state.formData.sistema_select"
               readonly="true"
               ><SearchIcon/>Buscar
             </v-btn>
             <v-btn
               color="secondary"
               @click= buttonClearSistema()
               :disabled="!state.formData.sistema_select"
               readonly="true"
             ><TrashIcon/>Limpiar
             </v-btn>
           </template>
         </v-select>
         <template v-if="submitButton && !state.formData.sistema_select">
           <div class="v-messages font-weight-black px-2 py-2">
             <div class="v-messages__message text-error ">
               El campo es requerido
             </div>
           </div>
         </template>
       </v-col>
               </v-row>
               <v-row>
                <template v-if=" state.formData.repuestos.length > 0">

                  <v-col cols="12" md="8">
        <v-card variant="flat" color="primary" :style="submitButton && !state.formData.sistema_select ? 'border: 1px solid #FA896B;' : ''">
          <v-card-title class="text-white">Repuestos disponibles para realizar el Mantenimiento</v-card-title>

          <EasyDataTable
            v-model:items-selected="itemsSelected"
            :headers="headers"
            :items="state.formData.repuestos"
            header-text-direction="left"
            body-text-direction="left"
            @update-page-items="mifuncion()"
            select-strategy="single" 
          >
        
          </EasyDataTable>
        
        </v-card>
        <template v-if="submitButton && !state.formData.sistema_select">
          <div class="text-center v-messages font-weight-black px-2 py-2">
            <div class="v-messages__message text-error ">
              Debe seleccionar al menos un repuesto
            </div>
          </div>
        </template>
      </v-col>

                </template>
                <template v-if="itemsSelected.length===1">
                  
                  <v-col cols="12" md="4">
                    <v-card variant="flat" color="primary" :style="submitButton && !state.formData.sistema_select ? 'border: 1px solid #FA896B;' : ''">
                      <v-card-title class="text-white">Registro de repuesto</v-card-title>
                    </v-card>
                    <div v-for="item in itemsSelected" :key="item" style=" font-size: xx-small;">
                        <v-col cols="12" md="12">
                    
                          <v-text-field 
                            variant="outlined" 
                            color="primary"
                            aria-valuetext=item.nombre_repuesto
                            v-model="state.formData.nombre_repuesto"
                            readonly
                            hide-details
                          />
                        </v-col>
                       <div id="div_hor">
                        <v-col cols="12" md="6">
                          <v-label class="mb-2 font-weight-medium">
                            Cantidad <span style="color:red">(*)</span>
                          </v-label>
                          <v-text-field 
                            variant="outlined" 
                            color="primary"
                            v-model="state.formData.cantidad_r"
                            type="number"
                            min="1"
                            hide-details
                            :error="submitButton && !state.formData.cantidad_r"
                          />
                          <template v-if="submitButton && !state.formData.cantidad_r">
                            <div class="v-messages font-weight-black px-2 py-2">
                              <div class="v-messages__message text-error ">
                                El campo es requerido
                              </div>
                            </div>
                          </template>
                        </v-col>
                        <v-col cols="12" md="6">
                       
                          <v-label class="mb-2 font-weight-medium">
                            Unidad <span style="color:red">(*)</span>
                          </v-label>
                          <v-autocomplete
                              variant="outlined"
                              color="primary"
                              hide-details
                               :items="lista_unidad"
                              v-model="state.formData.unidad_r"
                              no-data-text="No existe más opciones para seleccionar"
                              item-value="nombre_unidad"
                              item-title="nombre_unidad"
                              @input="state.formData.unidad_r = validateText(state.formData.unidad_r.toUpperCase())"
                              @update:model-value="setCodeName()"
                              
                            /> 
                          <template v-if="submitButton && !state.formData.cantidad_r">
                            <div class="v-messages font-weight-black px-2 py-2">
                              <div class="v-messages__message text-error ">
                                El campo es requerido
                              </div>
                            </div>
                          </template>
                        </v-col>
                       </div>
                        

                        <v-col cols="12" md="12">
                          <v-label class="mb-2 font-weight-medium">
                            Observacion
                          </v-label>
                        
                          <v-text-field 
                              variant="outlined"
                              color="primary"
                              v-model.trim="state.formData.observacion_r"
                              @input="state.formData.observacion_r = validateText(state.formData.observacion_r.toUpperCase())"
                            
                            >
                          
                          <template v-slot:append>
                            <v-btn 
                              color="success"
                              @click= buttonAddCode()
                              :disabled="!state.formData.id_filtro">
                              <PlusIcon/>Adicionar
                            </v-btn>
                          </template>
                        </v-text-field>
                        </v-col>
                      </div>
                    
                  </v-col>
               
                </template>

                <template v-if="state.formData.id_Rep.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° </th>
              <th class="text-center"><b> Repuesto</b></th>
              <th class="text-center"><b> Cantidad</b></th>
              <th class="text-center"><b> Unidad</b></th>
              <th class="text-center"><b> Observación</b></th>
              <th class="text-center" v-if="permisoEdicion">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.id_Rep"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_repuesto }}</td>
              <td class="text-center">{{ item.cantidad_r }}</td>
              <td class="text-center">{{ item.unidad_r }}</td>
              <td class="text-center">{{ item.observacion_r }}</td>
              <td class="text-center" v-if="permisoEdicion"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteRep(index)"/></td>
              
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
               </v-row>
               
            </v-expansion-panel-text>
        </v-expansion-panel>
       
    </v-expansion-panels>
</v-rom>
    

  <v-row>
    <v-col cols="12" class="text-lg-left pt-5">
      <template v-if="!isLoading">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
        <v-btn  v-if="route.params.id_orden != '0' && state.formData.id_registro == '0' " color="primary" @click="buttonSendForm()">
          <template v-if="route.params.id_orden != '0' && state.formData.id_registro == '0' ">
            Enviar    
          </template>
        </v-btn>
        <v-btn  class="mr-3" v-if="state.formData.id_registro != '0' && state.formData.estado_orden == 'EN PROCESO' " color="primary" @click="buttonSendForm() "
        
        >  
          <template v-if="state.formData.id_registro != '0' && state.formData.estado_orden == 'EN PROCESO'   ">
            Actualizar
          </template>
          
        </v-btn>
        <v-btn  class="mr-3" v-if=" state.formData.estado_orden == 'FINALIZADO' && (userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('ADMINISTRADOR')) " color="primary" @click="buttonSendForm()  "
        
        >  
          <template v-if=" state.formData.estado_orden == 'FINALIZADO' && (userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('ADMINISTRADOR'))  ">
            Actualizar
          </template>
          
        </v-btn>
            
        <v-btn v-if="state.formData.estado_orden === 'EN PROCESO'"   color="success"  class="mr-10" @click="ButtonReport2( route.params.id_orden)">
          <template v-if="state.formData.estado_orden === 'EN PROCESO'" >
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

<style scoped>

#div_hor{
  display: inline-block;
  display: flex;
justify-content: center;
align-items: center;
  
}
.checkbox-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.checkbox-item {
  margin:10px;
}

.styled-checkbox {
  position: relative;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #2f21b3;
  border-radius: 3px;
  cursor: pointer;
}

.styled-checkbox:checked::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: #1d64e7;
}

.styled-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 10px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.white-background .v-input__control,
.white-background .v-select__selections,
.white-background .v-input__slot {
  background-color: rgb(194, 33, 33) !important;
}
</style>