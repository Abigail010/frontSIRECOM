<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { format } from 'date-fns'
import { useResourceStore } from '@/stores/resource';
import { validateText } from '@/utils/helpers/validateText'
import { useVehicleStore } from '@/stores/resources/vehicle';
import { useSearchStore } from '@/stores/resources/busqueda';
import { usefilterStore } from '@/stores/resources/filtro';
const repuestoStore = usefilterStore()
const openpanel = ref([0]);
  const orden = useSearchStore()
  const route = useRoute()
  const resourceStore = useResourceStore()

  // BREADCRUMB  
  const page = ref({ title: 'Busqueda' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Generar Reportes',
      disabled: true,
      href: '#'
    }
  ]);

  const currentDate2 = format(new Date(), "yyyy-MM-dd");
  const vehicleStore = useVehicleStore()
  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      
      placa_chasis:'', 
      fecha_i:'', 
      fecha_f:currentDate2, 
      fuerza:'', 
      estado_v:'', 
      tipo_man:'',
      departamento:null, 
      id_taller:'', 
    }, formData2: {
      marca:'', 
      clase:'',
      tipo:'', 
      fecha_i1:'', 
      fecha_f1:currentDate2, 
    }, formData3:{
      placa_chasis2:'', 
      fecha_i2:'',
      fecha_f2:currentDate2, 
      marca:'', 
      clase:'',
      tipo:'',
    } , formData4:{
      id_mecanico:'',
      fecha_i3:'',
      fecha_f3:currentDate2, 
       
    }, 
    formData5:{
       partida:'', 
       fecha_i4:'', 
       fecha_f4:currentDate2, 
    }
  });

    // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
const buttonGenerarReport = async () => {
        const respuesta_info = await orden.minutesReport(state.formData)
        
}
 
    // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
const buttonGenerarReport2 = async () => {
      const respuesta_info = await orden.vehiculosReport(state.formData2)
      
}

        // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
const buttonGenerarReport3 = async () => {
        const respuesta_info = await orden.ReportVe(state.formData3)
       
        }

const buttonGenerarReport4 = async () => {
      const respuesta_info = await orden.ReportMan(state.formData4)
      
    }
const buttonGenerarReport5 = async () => {
      const respuesta_info = await orden.ReportRepuestos(state.formData5)
     
 }
  const buttonClear = () => {
    state.formData.id_taller=''
    state.formData.departamento=null
    state.formData.fuerza=''
    state.formData.fecha_i=''
    state.formData.fecha_f=currentDate2
}

const buttonClear2 = () => {
   state.formData2.fecha_i1=''
    state.formData2.fecha_f1=currentDate2
    state.formData2.clase =''
    state.formData2.tipo = '' 
    state.formData2.marca =''
}

const buttonClear3 = () => {
   state.formData3.fecha_i2=''
    state.formData3.fecha_f2=currentDate2
}

const buttonClear4 = () => {
   state.formData4.fecha_i3=''
    state.formData4.fecha_f3=currentDate2
    state.formData4.id_mecanico =''
}

const buttonClear5 = () => {
   state.formData5.fecha_i4=''
    state.formData5.fecha_f4=currentDate2
    state.formData5.partida =''
}


  const editar = ref<any>(false)
    const desserts1 = ref([]) as any
    const desserts2 = ref([]) as any
    const desserts3 = ref([]) as any
    const desserts4 = ref([]) as any
    const desserts5 = ref([]) as any
    const desserts6 = ref([]) as any
  const departamentos = ref([])
  const getDepartmentsList = async() => {
    departamentos.value = await resourceStore.getDepartments()
    desserts1.value= await repuestoStore.clase()
    desserts2.value= await repuestoStore.marcas()
    desserts6.value= await repuestoStore.tipo()
    desserts5.value= await vehicleStore.getFuerza()
    desserts3.value= await orden.getT()
    desserts4.value= await orden.getM()
  }

  const sendForm = ref(true)
  const miValidacion = async () => {
  sendForm.value = true
  if(!state.formData.placa_chasis && !state.formData.fecha_i && !state.formData.fecha_f && !state.formData.fuerza ){
    sendForm.value = false
  }
}
  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'ordenList' })
  }

const submitButton = ref(false)
/*
const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
        const { ok, message } = (route.params.id_sistema == '0') ? await systemStore.createSys(state.formData) : await systemStore.updateSys(state.formData)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
        icon: icono,
        title: message,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
     })
  }*/
 
  onMounted(async () => {
    await getDepartmentsList()
    
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>

    <v-col cols="12" md="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> </strong> Los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>
    </v-col>
    <v-expansion-panels v-model="openpanel">
    <!---Delivery Address--->
    <v-expansion-panel elevation="10"  >
        <v-expansion-panel-title class="text-h6">Reportes de registros de mantenimientos</v-expansion-panel-title>
        <v-expansion-panel-text class="mt-4">
          <v-row>
        <v-col cols="12" md="4">
            
          <v-label class="mb-2 font-weight-medium">Taller <span style="color:red">(*)</span></v-label>
    
          <v-select
                  v-model="state.formData.id_taller"
                  :items="desserts3"
                  item-title="nombre_taller"
                  item-value="nombre_taller"
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.id_taller"
                  hide-details
          ></v-select>
         
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Fuerza <span style="color:red">(*)</span></v-label>
    
          <v-select
                  v-model="state.formData.fuerza"
                  :items="desserts5"
                  item-title="nombre_fuerza"
                  item-value="nombre_fuerza"
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.fuerza"
                  hide-details
          ></v-select>
         
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium"> Departamento <span style="color:red">(*)</span></v-label>
    
          <v-select
                  v-model="state.formData.departamento"
                  :items="departamentos"
                  item-title="nombre_region"
                  item-value="nombre_region"
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.departamento"
                  hide-details
          ></v-select>
         
        </v-col>
        
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Fecha Inicio <span style="color:red"></span></v-label>
    
          <v-text-field
            variant="outlined" 
            color="primary"
            type="date"
            :max="currentDate2"
            v-model.trim="state.formData.fecha_i"
            @input="miValidacion(), state.formData.fecha_i= validateText(state.formData.fecha_i.toUpperCase())"
            :error="submitButton && !state.formData.fecha_i"
            hide-details
          />
          <template v-if="submitButton && !state.formData.fecha_i">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
       
        <v-col cols="12" md="8">
          <v-label class="mb-2 font-weight-medium">Fecha final<span style="color:red"></span></v-label>
          <v-text-field
         
            variant="outlined"
            color="primary"
            type="date"
           :max="currentDate2"
            v-model.trim="state.formData.fecha_f"
            @input="state.formData.fecha_f = validateText(state.formData.fecha_f)"
            @keydown.enter=buttonGenerarReport()
           
          >
            <template v-slot:append >
              <v-btn
               class="mr-3"
                color="primary"
                @click= buttonGenerarReport()
                :disabled="!state.formData.id_taller && !state.formData.fuerza && !state.formData.departamento && !state.formData.fecha_i"
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear()
                :disabled="!state.formData.id_taller && !state.formData.fuerza && !state.formData.departamento && !state.formData.fecha_i "><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
        </v-expansion-panel-text>
    </v-expansion-panel>

      <!---Payment Method--->
    <v-expansion-panel elevation="10" class=" mt-3">
        <v-expansion-panel-title class="text-h6" style="color:black;">Reporte de ingreso de vehículos</v-expansion-panel-title>
        <v-expansion-panel-text class="mt-4">
           <v-row>
            <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Tipo <span style="color:red"></span></v-label>
    
          <v-autocomplete
            variant="outlined"
            color="primary"
            :items="desserts1"
            v-model="state.formData2.clase"
            no-data-text="No existe más opciones para seleccionar"
            item-value="nombre_clase"
            item-title="nombre_clase"
            :error="submitButton && !state.formData2.clase"
          /> 
          
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Marca <span style="color:red"></span></v-label>
          <v-autocomplete
            variant="outlined"
            color="primary"
            :items="desserts2"
            v-model="state.formData2.marca"
            no-data-text="No existe más opciones para seleccionar"
            item-value="nombre_marca"
            item-title="nombre_marca"
            :error="submitButton && !state.formData2.marca"
          /> 
        
          
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Modelo <span style="color:red"></span></v-label>
          <v-autocomplete
            variant="outlined"
            color="primary"
            :items="desserts6"
            v-model="state.formData2.tipo"
            no-data-text="No existe más opciones para seleccionar"
            item-value="nombre_tipo"
            item-title="nombre_tipo"
            :error="submitButton && !state.formData2.tipo"
          /> 
        </v-col>
            <v-col cols="12" md="5">
              
                <v-label class="mb-2 font-weight-medium">Fecha Inicio <span style="color:red">(*)</span></v-label>
            
                <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    :max="currentDate2"
                    v-model.trim="state.formData2.fecha_i1"
                    @input="miValidacion(), state.formData2.fecha_i1= validateText(state.formData2.fecha_i1.toUpperCase())"
                    :error="submitButton && !state.formData2.fecha_i1"
                    hide-details
                />
                <template v-if="submitButton && !state.formData2.fecha_i1">
                    <div class="v-messages font-weight-black px-2 py-2">
                    <div class="v-messages__message text-error ">
                        El campo es requerido
                    </div>
                    </div>
                </template>
            </v-col>
            <v-col cols="12" md="7">
          <v-label class="mb-2 font-weight-medium">Fecha final <span style="color:red"></span></v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    v-model.trim="state.formData2.fecha_f1"
                    @input="miValidacion(), state.formData2.fecha_f1= validateText(state.formData2.fecha_f1.toUpperCase())"
                    :error="submitButton && !state.formData2.fecha_f1"
                    hide-details
                >
            <template v-slot:append >
              <v-btn
               class="mr-3"
                color="primary"
                @click= buttonGenerarReport2()
                :disabled=" !state.formData2.fecha_i1  && !state.formData2.clase && !state.formData2.marca && !state.formData2.tipo "
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear2()
                :disabled="!state.formData2.fecha_i1 && !state.formData2.clase && !state.formData2.marca && !state.formData2.tipo"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
           </v-row>
        </v-expansion-panel-text>
    </v-expansion-panel>
    <!---Delivery Options--->
    <v-expansion-panel elevation="10" class=" mt-3">
        <v-expansion-panel-title class="text-h6" style="color:black;">Reporte de kardex de vehículo</v-expansion-panel-title>
        <v-expansion-panel-text class="mt-4">
           <v-row>
            <v-col cols="12" md="3">
          <v-label class="mb-2 font-weight-medium">Placa o chasis <span style="color:red">(*)</span></v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="text"
                    v-model.trim="state.formData3.placa_chasis2"
                    @input="miValidacion(), state.formData3.placa_chasis2= validateText(state.formData3.placa_chasis2.toUpperCase())"
                    :error="submitButton && !state.formData3.placa_chasis2"
                    hide-details
                />
          </v-col>
          <v-col cols="12" md="3">
                <v-label class="mb-2 font-weight-medium">Fecha Inicio </v-label>
            
                <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    :max="currentDate2"
                    v-model.trim="state.formData3.fecha_i2"
                    @input="miValidacion(), state.formData3.fecha_i2= validateText(state.formData3.fecha_i2.toUpperCase())"
                    :error="submitButton && !state.formData3.fecha_i2"
                    hide-details
                />
               
            </v-col>
          <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Fecha final </v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    v-model.trim="state.formData3.fecha_f2"
                    @input="miValidacion(), state.formData3.fecha_f2= validateText(state.formData3.fecha_f2.toUpperCase())"
                    :error="submitButton && !state.formData3.fecha_f2"
                    hide-details
                >
            <template v-slot:append >
              <v-btn
               class="mr-3"
                color="primary"
                @click= buttonGenerarReport3()
                :disabled="!state.formData3.placa_chasis2  "
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear3()
                :disabled="!state.formData3.placa_chasis2"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
           </v-row>
        </v-expansion-panel-text>
    </v-expansion-panel>
    <!---Delivery Options--->
    <v-expansion-panel elevation="10" class=" mt-3">
        <v-expansion-panel-title class="text-h6" style="color:black;">Reporte de kardex de Mecánico</v-expansion-panel-title>
        <v-expansion-panel-text class="mt-4">
           <v-row>
            <v-col cols="12" md="3">
          <v-label class="mb-2 font-weight-medium">Mecánico <span style="color:red">(*)</span></v-label>
          <v-autocomplete
            variant="outlined"
            color="primary"
            :items="desserts4"
            v-model="state.formData4.id_mecanico"
            no-data-text="No existe más opciones para seleccionar"
            item-value="id"
            item-title="mecanico_disponible"
            :error="submitButton && !state.formData4.id_mecanico"
          /> 
          </v-col>
          <v-col cols="12" md="3">
                <v-label class="mb-2 font-weight-medium">Fecha Inicio </v-label>
            
                <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    :max="currentDate2"
                    v-model.trim="state.formData4.fecha_i3"
                    @input="miValidacion(), state.formData4.fecha_i3= validateText(state.formData4.fecha_i3.toUpperCase())"
                    :error="submitButton && !state.formData4.fecha_i3"
                    hide-details
                />
               
            </v-col>
          <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Fecha final </v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    v-model.trim="state.formData4.fecha_f3"
                    @input="miValidacion(), state.formData4.fecha_f3= validateText(state.formData4.fecha_f3.toUpperCase())"
                    :error="submitButton && !state.formData4.fecha_f3"
                    hide-details
                >
            <template v-slot:append >
              <v-btn
               class="mr-3"
                color="primary"
                @click= buttonGenerarReport4()
                :disabled="!state.formData4.id_mecanico && !state.formData4.fecha_i3  "
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear4()
                :disabled="!state.formData4.id_mecanico && !state.formData4.fecha_i3"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
           </v-row>
        </v-expansion-panel-text>
    </v-expansion-panel>

    <!---Delivery Options--->
    <v-expansion-panel elevation="10" class=" mt-3">
        <v-expansion-panel-title class="text-h6" style="color:black;">Reporte de Inventario</v-expansion-panel-title>
        <v-expansion-panel-text class="mt-4">
           <v-row>
            <v-col cols="12" md="3">
          <v-label class="mb-2 font-weight-medium">N° de partida <span style="color:red">(*)</span></v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="text"
                    :max="currentDate2"
                    v-model.trim="state.formData5.partida"
                    @input="miValidacion(), state.formData5.partida= validateText(state.formData5.partida.toUpperCase())"
                    :error="submitButton && !state.formData5.partida"
                    hide-details
                />
          </v-col>
          <v-col cols="12" md="3">
                <v-label class="mb-2 font-weight-medium">Fecha Inicio </v-label>
            
                <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    :max="currentDate2"
                    v-model.trim="state.formData5.fecha_i4"
                    @input="miValidacion(), state.formData5.fecha_i4= validateText(state.formData5.fecha_i4.toUpperCase())"
                    :error="submitButton && !state.formData5.fecha_i4"
                    hide-details
                />
               
            </v-col>
          <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Fecha final </v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    v-model.trim="state.formData5.fecha_f4"
                    @input="miValidacion(), state.formData5.fecha_f4= validateText(state.formData5.fecha_f4.toUpperCase())"
                    :error="submitButton && !state.formData5.fecha_f4"
                    hide-details
                >
            <template v-slot:append >
              <v-btn
               class="mr-3"
                color="primary"
                @click= buttonGenerarReport5()
                :disabled="!state.formData5.partida && !state.formData5.fecha_i4"
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear5()
                :disabled="!state.formData5.partida && !state.formData5.fecha_i4"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
           </v-row>
        </v-expansion-panel-text>
    </v-expansion-panel>
    <!----->
    
</v-expansion-panels>
    <!---<v-col cols="12" lg="12">
    
       <p class="mt-2 text-lg-left">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">volver</v-btn>
       
      </p>
    </v-col>-->
  </v-row>
</template>