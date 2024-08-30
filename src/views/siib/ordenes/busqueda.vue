<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { format } from 'date-fns'
import { useSystemStore } from '@/stores/resources/system';
import { validateText } from '@/utils/helpers/validateText'
//import { useVuelidate } from '@vuelidate/core'
//import { required, helpers } from '@vuelidate/validators'
//import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
//import { useValidationErrors } from '@/stores/useValidationErrors';
import { useSearchStore } from '@/stores/resources/busqueda';

  const orden = useSearchStore()
  const route = useRoute()
  const systemStore = useSystemStore()

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
  const estado_ve = ['EN PROCESO', 'ENTREGADO', 'FINALIZADO']
  const fuerzas = [{SIGLA:'UELICN', NOMBRE:'UELICN' }, {SIGLA:'DAZULES',NOMBRE:'DIABLOS AZULES' }, {SIGLA:'DNEGROS', NOMBRE:'DIABLOS NEGROS'}, {SIGLA:'DROJOS', NOMBRE:'DIABLOS ROJOS'}, {SIGLA:'DVERDES', NOMBRE:'DIABLOS VERDES'}, {SIGLA: 'C.E.O.', NOMBRE:'C.E.O.'}, {SIGLA:'FELCN', NOMBRE:'FELCN'} ]
  const currentDate2 = format(new Date(), "yyyy-MM-dd");
  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      
      placa_chasis:'', 
      fecha_i:'', 
      fecha_f:currentDate2, 
      fuerza:'', 
      estado_v:'', 
      placa_chasis2:'', 
      fecha_i1:'', 
      fecha_f1:currentDate2, 
    }
  });

    // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
    const buttonGenerarReport = async () => {

        const respuesta_info = await orden.minutesReport(state.formData)
        console.log(respuesta_info)
  }
 
    // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
    const buttonGenerarReport2 = async () => {

        const respuesta_info = await orden.vehiculosReport(state.formData)
        console.log(respuesta_info)
    }

        // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
        const buttonGenerarReport3 = async () => {

        const respuesta_info = await orden.ReportVe(state.formData)
        console.log(respuesta_info)
        }

  const buttonClear = () => {

    state.formData.placa_chasis=''
    state.formData.fuerza=''
    state.formData.fecha_i=''
    state.formData.fecha_f=currentDate2
    state.formData.estado_v = ''

}

  const editar = ref<any>(false)

  // FUNCION QUE OBTIENE LA INFORMACION DE LA DEPENDENCIA
  const getsystemById = async (id: any) => {
    const respuesta = await systemStore.systemID(id)
  
    //state.formData.id = respuesta.id
  //  state.formData.nombre_sistema = respuesta.nombre_sistema
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
  }
 
  onMounted(() => {
    if(route.params.id_sistema != '0'){
      getsystemById(route.params.id_sistema)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h3 class="my-3 text-primary">GENERAR REPORTE DE REGISTROS DE MANTENIMIENTOS</h3>
    </v-col>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> </strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="6">
            
          <v-label class="mb-2 font-weight-medium">Placa o Chasis <span style="color:red">*</span></v-label>
    
          <v-text-field
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.placa_chasis"
            @input="miValidacion(), state.formData.placa_chasis= validateText(state.formData.placa_chasis.toUpperCase())"
            :error="submitButton && !state.formData.placa_chasis"
            hide-details
          />
          <template v-if="submitButton && !state.formData.placa_chasis">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Fuerza <span style="color:red">*</span></v-label>
    
          <v-select
                  v-model="state.formData.fuerza"
                  :items="fuerzas"
                  item-title="NOMBRE"
                  item-value="NOMBRE"
                
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.fuerza"
                  hide-details
          ></v-select>
          <template v-if="submitButton && !state.formData.fuerza">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-label class="mb-2 font-weight-medium">Fecha Inicio <span style="color:red">*</span></v-label>
    
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
        <v-col cols="12" md="3">
          <v-label class="mb-2 font-weight-medium">Fecha final <span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined"
            color="primary"
            type="date"
           :max="currentDate2"
            v-model.trim="state.formData.fecha_f"
            @input="state.formData.fecha_f = validateText(state.formData.fecha_f)"
            @keydown.enter=buttonGenerarReport()
           
          />
          </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Estado <span style="color:red">*</span></v-label>
          <v-select
                  v-model="state.formData.estado_v"
                  :items="estado_ve"
                  item-title="NOMBRE"
                  item-value="SIGLA"
                
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.estado_v"
                  hide-details
          >
            <template v-slot:append >
              <v-btn
                color="primary"
                @click= buttonGenerarReport()
                :disabled="!state.formData.placa_chasis && !state.formData.fuerza && !state.formData.fecha_i && !state.formData.estado_v"
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear()
                :disabled="!state.formData.placa_chasis && !state.formData.fuerza && !state.formData.fecha_i && !state.formData.estado_v"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-select>
        </v-col>
      </v-row>
        <v-col cols="12" lg="12">
            <h3 class="my-3 text-primary">GENERAR REPORTE DE INGRESO DE VEHÍCULOS</h3>
        </v-col>
        <v-row>
            <v-col cols="12" md="5">
                <v-label class="mb-2 font-weight-medium">Fecha Inicio <span style="color:red">*</span></v-label>
            
                <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    :max="currentDate2"
                    v-model.trim="state.formData.fecha_i1"
                    @input="miValidacion(), state.formData.fecha_i1= validateText(state.formData.fecha_i1.toUpperCase())"
                    :error="submitButton && !state.formData.fecha_i1"
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
            <v-col cols="12" md="7">
          <v-label class="mb-2 font-weight-medium">Fecha final <span style="color:red">*</span></v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="date"
                    v-model.trim="state.formData.fecha_f1"
                    @input="miValidacion(), state.formData.fecha_f1= validateText(state.formData.fecha_f1.toUpperCase())"
                    :error="submitButton && !state.formData.fecha_f1"
                    hide-details
                >
            <template v-slot:append >
              <v-btn
                color="primary"
                @click= buttonGenerarReport2()
                :disabled=" !state.formData.fecha_i1 "
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear()
                :disabled="!state.formData.fecha_i1 "><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        </v-row>

        <v-col cols="12" lg="12">
            <h3 class="my-3 text-primary">GENERAR REPORTE DE UN VEHÍCULO</h3>
        </v-col>
        <v-row>
            <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Placa o chasis <span style="color:red">*</span></v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="text"
                    v-model.trim="state.formData.placa_chasis2"
                    @input="miValidacion(), state.formData.placa_chasis2= validateText(state.formData.placa_chasis2.toUpperCase())"
                    :error="submitButton && !state.formData.placa_chasis2"
                    hide-details
                >
            <template v-slot:append >
              <v-btn
                color="primary"
                @click= buttonGenerarReport3()
                :disabled="!state.formData.placa_chasis2"
                readonly="true"
                ><SearchIcon/>Generar Reporte
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear()
                :disabled="!state.formData.placa_chasis2"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        </v-row>
         <p class="mt-2 text-lg-left">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">volver</v-btn>
       
      </p>
    </v-col>
  </v-row>
</template>