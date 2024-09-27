<script setup lang="ts">
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue';
import { TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { format } from 'date-fns'
import { useResourceStore } from '@/stores/resource';
import { useVehicleStore } from '@/stores/resources/vehicle';
import { useOrdenStore } from '@/stores/orden/orden';
import { validateText } from '@/utils/helpers/validateText'
import { editPermission } from '@/utils/helpers/editPermission' 
import { usefilterStore } from '@/stores/resources/filtro';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Swal from 'sweetalert2'
import { readonly } from 'vue';
import { startCase } from 'lodash';
const openpanel = ref([0]);
const repuestoStore = usefilterStore()
const vehicleStore = useVehicleStore()
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
  const page = ref({ title: 'Registro del vehículo' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '/home'
    },
    {
      text: 'Vehículos',
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
    
        id_vehiculo: '',
        clase:'',
        modelo_año:'',
       
       
        departamento: '',
      provincia: '', 
      municipio: '', 
    fuerza:'', 
    procedencia:'', 
    grupo:'', 
    anio_baja:'', 
    componente:'', 
        comparar_:'', 
        kilo_:'', 
        valido_kilo:'', 
        estado_orden:'',
    }
  });

    // LISTA DE REGIONES COMPLETA
    const lista_regiones = ref([]) as any
  const lista_departamentos = ref([]) as any
  const lista_municipios = ref([]) as any
  const lista_provincias = ref([]) as any

  const getRegionList = async () => {
    lista_regiones.value = await resourceStore.getPlaces()
    lista_departamentos.value = lista_regiones.value.filter(
      (region:any) => region.tipo == 'DEPARTAMENTO'
    )
  }
  const getEncargado = async (id: any) => {
    let padre = lista_departamentos.value.find(
      (region:any) => region.nombre_region == id
    )
    lista_provincias.value = lista_regiones.value.filter(
          (region:any) => region.tipo == 'PROVINCIA' && region.padre == padre.id
        )
  }
  const getMunicipio = async (id: any) => {
    let padre = lista_provincias.value.find(
      (region:any) => region.nombre_region == id
    )
    lista_municipios.value = lista_regiones.value.filter(
          (region:any) => region.tipo == 'MUNICIPIO' && region.padre == padre.id
        )
  }

 
  const desserts2 = ref([]) as any
  const desserts3 = ref([]) as any
  const desserts4 = ref([]) as any
  const desserts5 = ref([]) as any
  const desserts6 = ref([]) as any
  const desserts7 = ref([]) as any
  const getrepuestosList = async() => {

    desserts2.value = await repuestoStore.clase()
    desserts3.value = await repuestoStore.tipo()
    desserts4.value = await repuestoStore.marcas()
   desserts5.value= await vehicleStore.getFuerza()
   desserts6.value = await vehicleStore.getProce()
   
  }
  const departamentos = ref([])
  const getDepartmentsList = async() => {
    departamentos.value = await resourceStore.getDepartments()
    //console.log(departamentos.value)
  }
  const lista_accesorios = ref([]) as any

 

  const ordernes_id = async (id_v: any) => {
  
    const data = await vehicleStore.getIDv(id_v)
    //console.log(data)

    state.formData.id_vehiculo = data.id_v
    state.formData.chasis_= data.chasis
   
    state.formData.placas = data.placa
   
    state.formData.nro_ocupantes = data.nro_ocupantes
    state.formData.motor = data.motor
    state.formData.marca = data.id_marca
    state.formData.modelo = data.tipo1
    state.formData.color_ve = data.color
    state.formData.combustible = data.combustible
    state.formData.tipo_orden = data.id_clase
    state.formData.anio_fabri = data.anio_registro
   state.formData.anio_baja = data.anio_baja
   state.formData.departamento = data.departamento
   state.formData.municipio = data.municipio
   state.formData.provincia = data.provincia
   state.formData.fuerza = data.id_fuerza 
   state.formData.grupo = data.grupo 
   state.formData.procedencia = data.id_procedencia
   state.formData.componente = data.componente
   //state.formData.
    editar.value = false
  
  
    state.formData.comparar_ = data.total
    state.formData.kilo_ = data.kilo_rem
    state.formData.estado_orden = data.estado
    let dato1  = parseInt(state.formData.comparar_)+1
      let dato2 = dato1* parseInt(state.formData.kilo_)
      state.formData.valido_kilo = String(dato2)

  }



//console.log(route.params.id_v)
  const buttonReturnList = () => {
    router.push({ name: 'VehiculoList' })
  }

  const buttonSendForm = async () => {
   // console.log('registroooo')
    submitButton.value = true
    await validateForm()
    if(!sendForm.value) return

    isLoading.value = true
    if(route.params.id_v == '0'){
      // ES NUEVO REGISTRO
     // console.log('registroooo2')

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

          const { ok, message} = await vehicleStore.createVehicle(state.formData)
          const icono = (ok ? 'success' : 'error')
          Toast.fire({ icon: icono, title: message })
         
        }
      
      })
    }else{
      // NO ES NUEVO REGISTRO
      if(permisoEdicion.value){
//console.log('actualizar ')
        const { ok, message } = await vehicleStore.updateVehicle(state.formData)
        const icono = (ok ? 'success' : 'error')
        Toast.fire({ icon: icono, title: message })
      
      }else{
        
        router.push({ name: 'vehiculoList' });
      }
    }
    isLoading.value = false
  }

  
  // VALIDACION GENERAL
  const validateForm = async () => {
    sendForm.value = true
    if(!state.formData.placas || !state.formData.chasis_ || !state.formData.color_ve 
    || !state.formData.combustible || !state.formData.tipo_orden || !state.formData.fuerza || !state.formData.marca || !state.formData.nro_ocupantes
    || !state.formData.motor || !state.formData.combustible || !state.formData.procedencia  || !state.formData.tipo_orden || !state.formData.modelo
      
    ){
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

  onMounted(async () => {
    await getDepartmentsList()
    await getRegionList()
    await getrepuestosList()
    if(route.params.id_v  != '0'){
     await ordernes_id(route.params.id_v)
      editar.value = true

    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <b> REGISTRO DEL VEHÍCULO: </b> Todos los campos con <span style="color:red">(*)</span>son obligatorios
      </h4>
    </v-col>
  </v-row>

 
  <v-rom>

<v-expansion-panels v-model="openpanel">
    <!---Delivery Address--->
    <v-expansion-panel elevation="10"  >
        <v-expansion-panel-title class="text-h6">Caracteristicas del vehículo</v-expansion-panel-title>
        <v-expansion-panel-text class="mt-4">
         <v-row>
          <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Placa <span style="color:red">(*)</span></v-label>
      <v-text-field 
        variant="outlined" 
        color="primary"
        v-model.trim="state.formData.placas"
        @input="state.formData.placas = validateText(state.formData.placas.toUpperCase())"
        
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
        <v-label class="mb-2 font-weight-medium">Chasis <span style="color:red">(*)</span></v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.chasis_"
        @input="state.formData.chasis_ = validateText(state.formData.chasis_.toUpperCase())"
        :error="submitButton && !state.formData.chasis_"
        hide-details
      ></v-textarea>
      <template v-if="submitButton && !state.formData.placas">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>        
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
        Tipo  <span style="color:red"> (*)</span>
      </v-label>
      <v-autocomplete
        variant="outlined"
        color="primary"
        :items="desserts2"
          v-model="state.formData.tipo_orden"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id_clase"
          item-title="nombre_clase"
          :error="submitButton && !state.formData.tipo_orden"
       /> 
       <template v-if="submitButton && !state.formData.tipo_orden">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
        Marca<span style="color:red">(*)</span>
      </v-label>
      <v-autocomplete
        variant="outlined"
        color="primary"
        :items="desserts4"
          v-model="state.formData.marca"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id_marca"
          item-title="nombre_marca"
          :error="submitButton && !state.formData.marca"
          
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
        Modelo<span style="color:red">(*)</span>
      </v-label>
        <v-autocomplete
          variant="outlined"
          color="primary"
          :items="desserts3"
            v-model="state.formData.modelo"
            no-data-text="No existe más opciones para seleccionar"
            item-value="nombre_tipo"
            item-title="nombre_tipo"
              :error="submitButton && !state.formData.modelo"
        /> 
      
      <template v-if="submitButton && !state.formData.modelo">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
        Color<span style="color:red">(*)</span>
      </v-label>
     
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
      
    </v-col>
   
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Motor <span style="color:red">(*)</span></v-label>
      <v-textarea
        rows="1"
        auto-grow
        v-model.trim="state.formData.motor"
        @input="state.formData.motor = validateText(state.formData.motor.toUpperCase())"
        :error="submitButton && !state.formData.motor"
        hide-details
      ></v-textarea>
      <template v-if="submitButton && !state.formData.motor">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
    
    <v-col cols="12" md="4">
     
      <v-label class="mb-2 font-weight-medium">N° de ocupantes <span style="color:red">(*)</span></v-label>
      <v-text-field 
         variant="outlined" 
         color="primary"
        type="number"
         min="1"
        v-model.trim="state.formData.nro_ocupantes"
        @input="state.formData.nro_ocupantes "
        hide-details
        :error="submitButton && !state.formData.nro_ocupantes"
      ></v-text-field>
      <template v-if="submitButton && !state.formData.nro_ocupantes">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
  
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Tipo de combustible<span style="color:red">(*)</span></v-label>
     <div >
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
   
    </v-col>
         </v-row>
        </v-expansion-panel-text>
    </v-expansion-panel>

      <!---Payment Method--->
      <v-expansion-panel elevation="10" class=" mt-3">
        <v-expansion-panel-title class="text-h6" style="color:black;">Información del vehículo</v-expansion-panel-title>
        <v-expansion-panel-text class="mt-4">
           
            <v-row>
              <v-col cols="12" md="4">
                <v-label class="mb-2 font-weight-medium">Grupo</v-label>
                  <v-text-field 
                    variant="outlined" 
                    color="primary"
                    v-model.trim="state.formData.grupo"
                    @input="state.formData.grupo = validateText(state.formData.grupo.toUpperCase())"
                  
                  
                    hide-details
                  ></v-text-field>
                </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Fuerza<span style="color:red">(*)</span></v-label>
      <v-autocomplete
        variant="outlined"
        color="primary"
        :items="desserts5"
          v-model="state.formData.fuerza"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id_fuerza"
          item-title="nombre_fuerza"
          :error="submitButton && !state.formData.fuerza"
         />
         <template v-if="submitButton && !state.formData.fuerza">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
    </v-col>
    <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">Procedencia<span style="color:red">(*)</span></v-label>
      <v-autocomplete
        variant="outlined"
        color="primary"
        :items="desserts6"
          v-model="state.formData.procedencia"
          no-data-text="No existe más opciones para seleccionar"
          item-value="id_procedencia"
          item-title="nombre_procedencia"
          :error="submitButton && !state.formData.procedencia"
         />
         <template v-if="submitButton && !state.formData.procedencia">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
    </v-col>
    <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Departamento <span style="color:red">*</span>
              </v-label>
              <v-autocomplete
                  variant="outlined"
                  color="primary"
                  :items="lista_departamentos"
                    v-model="state.formData.departamento"
                    no-data-text="No existe más opciones para seleccionar"
                    item-value="nombre_region"
                    item-title="nombre_region"
                    @update:model-value="getEncargado(state.formData.departamento);"
                    :error="submitButton && !state.formData.departamento"
               /> 
              <template v-if="submitButton && !state.formData.departamento">
                <div class="v-messages font-weight-black ml-3 mt-2">
                  <div class="v-messages__message text-error">
                    El campo es requerido
                  </div>
                </div>
              </template>
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Provincia
              </v-label>
              <v-autocomplete
                variant="outlined"
                color="primary"
                :items="lista_provincias"
                  v-model="state.formData.provincia"
                  no-data-text="No existe más opciones para seleccionar"
                  item-value="nombre_region"
                  item-title="nombre_region"
                  @update:model-value="getMunicipio(state.formData.provincia);"       
                /> 
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">
                Municipio
              </v-label>
              <v-autocomplete
                variant="outlined"
                color="primary"
                :items="lista_municipios"
                  v-model="state.formData.municipio"
                  no-data-text="No existe más opciones para seleccionar"
                  item-value="nombre_region"
                  item-title="nombre_region"
                /> 
             </v-col>

            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">Año de Ingreso</v-label>
              <v-text-field 
                variant="outlined" 
                color="primary"
                v-model.trim="state.formData.anio_fabri"
                @input="state.formData.anio_fabri = validateText(state.formData.anio_fabri.toUpperCase())"
               min="1980"
                type="number"
               
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">Año de Baja</v-label>
              <v-text-field 
                variant="outlined" 
                color="primary"
                v-model.trim="state.formData.anio_baja"
                @input="state.formData.anio_baja = validateText(state.formData.anio_baja.toUpperCase())"
                min="1980"
                type="number"
                
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-label class="mb-2 font-weight-medium">Componente </v-label>
              <v-text-field 
                variant="outlined" 
                color="primary"
                v-model.trim="state.formData.componente"
                @input="state.formData.componente = validateText(state.formData.componente.toUpperCase())"
              
                
                hide-details
              ></v-text-field>
            </v-col>
            </v-row>

        </v-expansion-panel-text>
    </v-expansion-panel>
    <!---Delivery Options--->
    
</v-expansion-panels>
</v-rom>

  <v-row>
    <v-col cols="12" class="text-lg-left pt-5">
      <template v-if="!isLoading">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
        <v-btn v-if="route.params.id_v == '0' "
        color="primary" @click="buttonSendForm()">
          <template v-if="route.params.id_v == '0' ">
            Enviar    
          </template>
         
         
        </v-btn>
        <v-btn  v-if="route.params.id_v != '0'"
        color="primary" @click="buttonSendForm()" >
      
          
          <template v-if="(route.params.id_v != '0') || userProfile.includes('SUPER ADMINISTRADOR')  ">
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
