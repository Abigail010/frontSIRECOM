<script setup lang="ts">
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue';
import { TrashIcon, SearchIcon, PlusIcon, PencilIcon, CheckIcon, SquareCheckIcon, FallIcon, ElevatorIcon } from 'vue-tabler-icons';
import { useRegisterStore } from '@/stores/orden/registro';
import { validateText } from '@/utils/helpers/validateText'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import { readonly } from 'vue';
import { useSoliStore } from '@/stores/orden/soli_rep';

const dialog = ref(false);
const us:any = JSON.parse(localStorage.getItem('user') || '').id_perfil
const us2:any = JSON.parse(localStorage.getItem('user') || '').id_taller
const openpanel = ref([0]);
  const route = useRoute()
  const registro = useRegisterStore()
  const soli_Rep = useSoliStore()
  const submitButton = ref(false)

  const sendForm = ref(true)
  const isLoading = ref(false)

  // BREADCRUMB
  const page = ref({ title: 'Solicitud de Repuestos' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '/home'
    },
    {
      text: 'Repuestos',
      disabled: true,
      href: '#'
    }
  ]);
 
  // DECLARACION DE VARIABLES Y STATE
  const permisoEdicion = ref<any>(true)
  const editar = ref<any>(false)
  const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil

  const state = reactive({
    formData: {
      id_orden: '',
      id_registro:'', 
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
       
        prueba:'', 
        repuestos: [] as any,
       
        id_sis: '',
        id_filtro:'', 
        cantidad_r:'',
        unidad_r:'',
        observacion_r:'', 
        id_Rep:[] as any, 
        id_Rep2:[] as any, 
    

        id_accesorios_: []as any, 
        
      cedula_identidad: '',
        total_c:'', 
        total:'', 
      
    }, formData2:{
        nombre_repuesto:'',
        id_registro:'', 
        id_repuesto: '', 
        id_solicitud:'', 
        cantidad:'', 
        unidad:'', 
        costo:'', 
        observacion:'', 
        precio:'',
        id_det:'', 
        estado:'',
        disponible:'',
    }
  });

  const lista_unidad = ref([]) as any
  const lista_diagnosticos = ref([]) as any
  const tipo_mantenimiento2 = ref([]) as any
  const getResourcesList = async () => {
    lista_diagnosticos.value = await registro.gettipo_trabajo() 
    tipo_mantenimiento2.value = await registro.gettipo_mantenimiento()     // LISTA DE accesorios
    lista_unidad.value=await registro.getUnidad()
  }
  
   // BUSQUEDA o despliegue de repuestos
   const basico_id = async (id_orden: any) => {
    const data = await registro.getbasico(id_orden)
   // console.log(data)
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
   } 
  

   const verificar_id = async (id_orden: any) => {
    const data = await registro.verificar_reg(id_orden)
    const size = Object.keys(data).length;
   if(size>0){
    state.formData.id_registro = data.id_registro
   }else{
    //state.formData.id_registro = size;
   }
   }

  const registro_id = async (id_orden: any) => {
   state.formData.id_Rep = await soli_Rep.getsolicitudes(id_orden) 
   //console.log(state.formData.id_Rep)
   state.formData.id_Rep2 = await soli_Rep.getEntregas(id_orden) 
   const res= await soli_Rep.getEntregas(id_orden) 
 
   let s = 0
   for(let i =0; i< res.length; i++ ){
    s = s + parseInt(res[i].costo)
   }
   state.formData.total_c = String(s) 
    const res2= await soli_Rep.getTotal(id_orden) 
    state.formData.total = res2.total
  }

  const opciones = ref([]) as any
  const ButtonRepuesto = async (item: any) => {
    const data2 = await soli_Rep.getID(item);
    //console.log(data2)
    state.formData2.id_registro = data2.id
    state.formData2.id_repuesto = data2.id_tipo_repuesto
    state.formData2.id_solicitud = data2.id_solicitud
    state.formData2.nombre_repuesto = data2.nombre_repuesto
    state.formData2.cantidad = data2.cantidad
    state.formData2.unidad = data2.unidad
    state.formData2.precio = data2.precio
    state.formData2.id_det = data2.id_det
    state.formData2.estado = data2.entregado
    state.formData2.disponible = data2.can_rep

    if(parseInt(data2.costo)>0){
      state.formData2.costo=data2.costo  
    }
    
    if(parseInt(state.formData2.disponible)>0){
      opciones.values = await soli_Rep.getPrecio( state.formData2.id_repuesto);
      console.log(opciones.values)
    }
    dialog.value = true
  }

  const precio = () => {
    const cantidad = parseFloat(state.formData2.cantidad) || 0;
      const precio_u = parseFloat(state.formData2.precio) || 0;
      state.formData2.costo = (cantidad * precio_u).toFixed(2) ; // Calcula y formatea el subtotal
    /*  const size = Object.keys(opciones).length;
console.log(`El tamaño del objeto es: ${size}`);
   console.log(' :disponible ' + (Object.keys(opciones).length))
      for(let i=0; i<(Object.keys(opciones).length); i++){
                console.log(i)
      }*/
}

  const buttonReturnList = () => {
    router.push({ name: 'ordenList' })
  }
 
  const ButtonReport2 = async (item: any) => {
  const data2 = await soli_Rep.minutesReport(item);
 // console.log(data2)
  }
  const buttonSendForm = async () => {
    submitButton.value = true
    await validateForm()
    if(!sendForm.value) return

    isLoading.value = true
    if(state.formData.id_orden != '0' ){
      // ES NUEVO REGISTRO
      dialog.value = false
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Verifica que la información registrada sea correcta",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#FA896B',
        confirmButtonColor: '#5D87FF',
        cancelButtonText: 'No, volver',
        confirmButtonText: 'Si, actualizar',
      }).then(async (result) => {
        if(result.isConfirmed){
          
          const { ok, message } = await soli_Rep.updateRepID(state.formData2)
          const icono = (ok ? 'success' : 'error')
          Toast.fire({ icon: icono, title: message })
            
        }
       window.location.reload()
      })
    }
    isLoading.value = false
  }
  const buttonSendForm2 = async () => {
    submitButton.value = true
    await validateForm()
    if(!sendForm.value) return

    isLoading.value = true
    if(state.formData.id_orden != '0' ){
      // ES NUEVO REGISTRO
      dialog.value = false
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Verifica que la información registrada sea correcta",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#FA896B',
        confirmButtonColor: '#5D87FF',
        cancelButtonText: 'No, volver',
        confirmButtonText: 'Si, actualizar',
      }).then(async (result) => {
        if(result.isConfirmed){
          
          const { ok, message } = await soli_Rep.updateRepID(state.formData2)
          const icono = (ok ? 'success' : 'error')
          Toast.fire({ icon: icono, title: message })
            
        }
       window.location.reload()
      })
    }
    isLoading.value = false
  }
  // VALIDACION GENERAL
  const validateForm = async () => {
    sendForm.value = true
    if( !state.formData2.cantidad || !state.formData2.unidad)
     {
      sendForm.value = false
    }
  }
  const buttonClose = () => {
    dialog.value = false
  }
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  function entregar(item: any) {
  Swal.fire({
     
      text: "¡El proceso no podra ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Si, entregar!"
  }).then(async (result) => {
  if (result.isConfirmed) {
    const { ok, message } = await soli_Rep.updateEstado1({"id":item})
    const icono = (ok ? 'success' : 'error')

    if(ok){
      //await getUsersList()
    }
    Toast.fire({
      icon: icono,
      title: message,
    })
    window.location.reload()
      }
  });
} 
function recibido(item: any) {
  Swal.fire({
     
      text: "¡Recibio el repuesto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Si!"
  }).then(async (result) => {
  if (result.isConfirmed) {
    const { ok, message } = await soli_Rep.updateEstado2({"id":item})
    const icono = (ok ? 'success' : 'error')
   
    if(ok){
      //await getUsersList()
    }
    Toast.fire({
      icon: icono,
      title: message,
    })
      }
      window.location.reload()
  });
} 

  function deleteItem(item: any) {
  Swal.fire({
      title: "¿Estas seguro?",
      text: "¡El proceso no podra ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡eliminar!"
  }).then(async (result) => {
  if (result.isConfirmed) {
    const { ok, message } = await soli_Rep.updateEstado1({"id":item})
    const icono = (ok ? 'success' : 'error')
    if(ok){
      //await getUsersList()
    }
    Toast.fire({
      icon: icono,
      title: message,
    })
      }
  });
} 

  onMounted(async () => {
    await getResourcesList()
   
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
  <div><b>CEL :</b> <span class="text-primary">{{state.formData.dato3}}</span></div>
  <div><b>PRE - DIAGNOSTICO :</b> <span class="text-primary">{{state.formData.dato4}}</span></div>
</div>

      </v-alert>
    </v-col>
  </v-row>

<v-rom>
    
    <v-dialog v-model="dialog" max-width="1000px">
                                <v-card>
                                    <v-card-title class="pa-2 bg-success">
                                        <span class="text-h5">Información del Repuesto</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                            <v-col cols="12"  md="4">
                                                <v-text-field
                                                v-model="state.formData2.nombre_repuesto"
                                                label="Repuesto"
                                                readonly
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12"  md="3">
                                                <v-text-field
                                                @input="precio(), state.formData2.cantidad"
                                                v-model="state.formData2.cantidad"
                                                label="Cantidad"
                                                type="number"
                                                 :min = 1
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12"  md="3">
                                        
                                                <v-autocomplete
                                                    variant="outlined"
                                                     label="Unidad"
                                                    color="primary"
                                                    hide-details
                                                    :items="lista_unidad"
                                                    v-model="state.formData2.unidad"
                                                    no-data-text="No existe más opciones para seleccionar"
                                                    item-value="nombre_unidad"
                                                    item-title="nombre_unidad"
                                                    @input="state.formData2.unidad = validateText(state.formData2.unidad.toUpperCase())"
                                                  
                                                    /> 
                                            </v-col>
                                            <v-col cols="12"  md="2">
                                               <template v-if="us==1 || us==2">
                                                <v-text-field
                                                v-model="state.formData2.costo"
                                                min:0
                                                label="Precio Unitario"
                                                 type="number"
                                                
                                                ></v-text-field>
                                               </template>
                                               <template v-else>
                                                <v-text-field
                                                v-model="state.formData2.costo"
                                                min:0
                                                label="Costo"
                                                 type="number"
                                               readonly
                                                ></v-text-field>
                                               </template>
                                            </v-col>
                                            <v-col cols="12"  md="12">
                                                <v-text-field
                                                v-model="state.formData2.observacion"
                                                label="Observación"
                                                 type="text"
                                                 @input="state.formData2.observacion = validateText(state.formData2.observacion.toUpperCase())"
                                                ></v-text-field>
                                            </v-col>
                                          </v-row>

                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" variant="flat" dark   @click="buttonClose()">
                                            Cancel
                                        </v-btn>
                                        <v-btn v-if="state.formData2.estado == 'RECIBIDO' && ( us==1 || us==2 )"
                                         color="success" variant="flat" dark   @click="buttonSendForm()">
                                            Guardar
                                        </v-btn>
                                        <v-btn v-else
                                         color="primary" variant="flat" dark   @click="buttonSendForm()">
                                            Guardar
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
    <v-expansion-panels v-model="openpanel">
       
        <!---Delivery Options--->
        <v-expansion-panel elevation="10" class=" mt-3">
            <v-expansion-panel-title class="text-h6">Solicitud de Repuestos</v-expansion-panel-title>
            <v-expansion-panel-text class="mt-4">
              
               <v-row>
        

                <template v-if="state.formData.id_Rep.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° </th>
              <th class="text-center"><b> Repuesto</b></th>
              <th class="text-center"><b> Cantidad</b></th>
              <th class="text-center"><b> Unidad</b></th>
              <th class="text-center"><b> Costo</b></th>
              <th class="text-center"><b> Observación</b></th>
              <th class="text-center"><b> Entregado</b></th>
              <th class="text-center"><b> Recibido</b></th>
              <th class="text-center" v-if="permisoEdicion"><b>Acción</b></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.id_Rep"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_repuesto }}</td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-center">{{ item.unidad }}</td>
              <td class="text-center">{{ item.costo }}</td>
              <td class="text-center">{{ item.observacion }}</td>
              <td class="text-center" v-if="item.entregado === 'PENDIENTE'" ><v-btn
                  class="mr-1"
                  size="x-small"
                  title="Entregar repuesto"
                  height="25"
                  width="25"
                  color="success"
                  text="hola"
                 @click="entregar(item.id)"
                > <SquareCheckIcon style="cursor: pointer;"></SquareCheckIcon>
                </v-btn>
            </td>
             <td class="text-center" v-else>ENTREGADO </td>
              <td class="text-center" v-if="item.recibido === 'PENDIENTE'">
 
                <v-btn
                  
                  size="small"
                  title="Recibir repuesto"
                  height="25"
                  width="25"
                  color="warning"
                  text="hola"
                 @click="recibido(item.id)"
                > <SquareCheckIcon style="cursor: pointer;"></SquareCheckIcon>
                </v-btn>

              </td>
              <td class="text-center" v-else>ENTREGADO </td>
              <td class="text-center" v-if="item.entregado === 'PENDIENTE' && (us==1 || us==2 ||  us==5) " >
                <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Editar"
                  height="25"
                  width="25"
                  color="primary"
                  text="hola"
                 @click="ButtonRepuesto(item.id)"
                > <PencilIcon style="cursor: pointer;"></PencilIcon>
                </v-btn>
                </td>
                <td class="text-center" v-else-if="item.entregado === 'RECIBIDO' &&  (us==1 ||  us==2) ">
                    <v-btn 
                  class="mr-1"
                  size="x-small"
                  title="Editar"
                  height="25"
                  width="25"
                  color="success"
                  text="hola"
                 @click="ButtonRepuesto(item.id)"
                > <PencilIcon></PencilIcon>
                </v-btn>
                </td>
                <td class="text-center" v-else>
                    <v-btn 
                  class="mr-1"
                  size="x-small"
                  title="Editar"
                  height="25"
                  width="25"
                  color=""
                  text="hola"
               
                > <PencilIcon></PencilIcon>
                </v-btn>
                </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
               </v-row>
               
            </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel elevation="10" class=" mt-3">
            <v-expansion-panel-title class="text-h6">Repuestos entregados</v-expansion-panel-title>
            <v-expansion-panel-text class="mt-4">
              
               <v-row>
        

                <template v-if="state.formData.id_Rep2.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° </th>
              <th class="text-center"><b> Repuesto</b></th>
              <th class="text-center"><b> Cantidad</b></th>
              <th class="text-center"><b> Unidad</b></th>
              <th class="text-center"><b> Costo</b></th>
             
              <th class="text-center"><b> Observación</b></th>
              
            
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.id_Rep2"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_repuesto}}</td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-center">{{ item.unidad }}</td>
              <td class="text-center">{{ item.costo }}</td>
              <td class="text-center">{{ item.observacion }}</td>
           
            </tr>
             <tr>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td class="text-center"><b>Total: </b></td>
               <td class="text-center">{{ state.formData.total_c }} Bs.</td>
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
        <v-btn v-if="state.formData.total == '0'"
         color="success"  class="mr-10" @click="ButtonReport2( route.params.id_orden)">
          <template v-if="state.formData.id_registro != '0' && permisoEdicion">
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