<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useInstanceStore } from '@/stores/moduleOne/instance';
import type tipoCodigoType  from '@/types/myTypes/tipoCodigoType'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const instanceStore = useInstanceStore()

  // BREADCRUMB
  const page = ref({ title: 'Datos del caso' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Datos del caso',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id_caso: '',
      numero_caso_felcn_felcc: '',
      jurisdiccion_caso: '',
      nombre_clave_caso: '',
      codigos: [] as any,
      delitos: [] as any,
      observaciones: ''
    }
  });

  // LISTA DE TIPOS DE CODIGO
  const tipoCodigo = ref<tipoCodigoType[]>([])
  const getCodesTypeList = async () => {
    const codesType = await resourceStore.getCodesType()
    tipoCodigo.value = codesType
  }

  // LISTA DE DELITOS
  const delitos = ref([]);
  const getCrimesList = async () => {
    const crimes = await resourceStore.getCrimes()
    delitos.value = crimes
  }

  // LISTA DE JURISDICCIONES
  const jurisdicciones = ref([]);
  const getJurisdictionsList = async() => {
    const jurisdictions = await resourceStore.getOffices()
    if(perfilUsuario != 'SUPERADMIN' && oficinaUsuario != 'DEPARTAMENTAL NACIONAL'){
      jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.nombre_oficina == oficinaUsuario )
    }else{
      jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.departamento != 'NACIONAL' )
    }
  }

  // FUNCION QUE OBTIENE LA INFORMACION DEL CASO
  const getInstanceById = async (id: any) => {
    const caso = await instanceStore.instance(id)
    state.formData.id_caso = caso.id
    state.formData.numero_caso_felcn_felcc = caso.numero_caso_felcn_felcc
    state.formData.nombre_clave_caso = caso.nombre_clave_caso
    state.formData.jurisdiccion_caso = caso.jurisdiccion_caso
    state.formData.observaciones = caso.observaciones
    // PENDIENTE LLENAR TABLA DE DELITOS Y TIPOS DE CODIGO
    for (let i = 0; i < caso.codigos.length; i++) {
      state.formData.codigos.push(caso.codigos[i])
      tipoCodigo.value = tipoCodigo.value.filter(tipo => tipo.id != caso.codigos[i].id_tipo_codigo)
    }
    for (let i = 0; i < caso.delitos.length; i++) {
      state.formData.delitos.push(caso.delitos[i])
    }
  }

  const codigoSeleccionado = ref();
  const numeroCodigoSeleccionado = ref("");
  const perfilUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  const oficinaUsuario = JSON.parse(localStorage.getItem('user') || '').nombre_oficina
  const isLoading = ref(false)
  // const currentDate = format(new Date(),"yyyy-MM-dd");
  

  const buttonAddCode = () => {
    if(codigoSeleccionado.value == '') return

    const registro = tipoCodigo.value.find(tipo => tipo.id == codigoSeleccionado.value)

    state.formData.codigos.push(
      {
        id_tipo_codigo: registro?.id,
        nombre_tipo_codigo: registro?.nombre_tipo_codigo,
        numero_codigo: numeroCodigoSeleccionado.value
      }
    )

    tipoCodigo.value = tipoCodigo.value.filter(tipo => tipo.id != codigoSeleccionado.value)

    codigoSeleccionado.value='',
    numeroCodigoSeleccionado.value=''
  }

  const buttonDeleteCode = (id:number) =>{
    const registro =  state.formData.codigos.find((tipo:any) => tipo.id == id)
    tipoCodigo.value.push(
      {
        id: registro.id_tipo_codigo,
        nombre_tipo_codigo: registro.nombre_tipo_codigo
      }
    )

    // REORDENAMIENTO DE LISTA
    tipoCodigo.value.sort(function(a, b) {
      const codigo_a = a.nombre_tipo_codigo
      const codigo_b = b.nombre_tipo_codigo
      if(codigo_a < codigo_b){
        return -1
      }
      if(codigo_a > codigo_b){
        return 1
      }
      return 0
    })
    state.formData.codigos = state.formData.codigos.filter((tipo:any) => tipo.id != id)
  }

  // VALIDACIONES
  const rules = computed(() => {
    return {
      formData: {
        // codigos: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        jurisdiccion_caso: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        nombre_clave_caso: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        delitos: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.push({ name: 'documentaryReviewList' })
  }

  // BOTON ENVIAR FORMULARIO
  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return
    isLoading.value = true
    // console.log(state.formData);
    const { ok, message } = await instanceStore.updateInstance(state.formData)
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
    getCodesTypeList()
    getCrimesList()
    getJurisdictionsList()
    if(route.params.id != '0'){
      getInstanceById(route.params.id)
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
        - <span class="text-primary">En el campo <span class="text-secondary font-weight-medium">Tipos de Delítos</span> puede agregar uno o mas delítos, es necesario que se registre al menos uno para guardar la información registrada en el caso.</span><br>
        - <span class="text-primary">En el campo <span class="text-secondary font-weight-medium">Tipos de Delítos</span> si no encuentra la opción requerida, debe comunicarse con el Área de Registro y Sistemas mediante el correo institucional, solicitar el agregado de la opción.</span><br>
      </v-alert>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL CASO:</strong> Los campos con <span style="color:red">*</span> son obligatorios
      </h4>
      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium" required>Número Caso FELCN/FELCC<span style="color:red">*</span></v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            v-model="state.formData.numero_caso_felcn_felcc"
            @input="state.formData.numero_caso_felcn_felcc = validateText(state.formData.numero_caso_felcn_felcc.toUpperCase())"
            disabled
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Tipo Código</v-label>
          <v-select
            :items="tipoCodigo"
            item-title="nombre_tipo_codigo"
            item-value="id"
            no-data-text="No existe más opciones para seleccionar"
            v-model="codigoSeleccionado"
          >
        </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium" required>Número Código</v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            v-model="numeroCodigoSeleccionado"
            @input="numeroCodigoSeleccionado = validateText(numeroCodigoSeleccionado.toUpperCase())"
            @keydown.enter=buttonAddCode()
          >
            <template v-slot:append>
              <v-btn 
                color="primary"
                @click= buttonAddCode()
                :disabled="!codigoSeleccionado || !numeroCodigoSeleccionado">
                <PlusIcon/> Agregar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-row>
          <v-col  v-if="state.formData.codigos.length>0" cols="12" md="12">
            <v-table density="compact">
              <thead>
              <tr>
                  <th class="text-center">Nombre Código</th>
                  <th class="text-center">Número de Código</th>
                  <th class="text-center">Acción</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(item, index) in state.formData.codigos"
                  :key="item.id"
              >
                  <td class="text-center">{{ item.nombre_tipo_codigo }}</td>
                  <td class="text-center">{{ item.numero_codigo }}</td>
                  <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(item.id)"/></td>
              </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombre Clave del Caso<span style="color:red">*</span></v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            v-model="state.formData.nombre_clave_caso"
            @input="state.formData.nombre_clave_caso = validateText(state.formData.nombre_clave_caso.toUpperCase())"
            :error="v$.formData.nombre_clave_caso.$error"
            :error-messages="errors.nombre_clave_caso"
          >
          </v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Jurisdicción del Caso<span style="color:red">*</span></v-label>
          <v-select
            :items="jurisdicciones"
            item-title="departamento"
            item-value="departamento"
            no-data-text="No existe más opciones para seleccionar"
            v-model="state.formData.jurisdiccion_caso"
            :error="v$.formData.jurisdiccion_caso.$error"
            :error-messages="errors.jurisdiccion_caso"
          />
        </v-col>

        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Tipos de Delítos<span style="color:red">*</span></v-label>
          <v-select
            :items="delitos"
            item-title="nombre_delito"
            item-value="id"
            no-data-text="No existe más opciones para seleccionar"
            multiple
            chips
            v-model="state.formData.delitos"
            :error="v$.formData.delitos.$error"
            :error-messages="errors.delitos"
          />
        </v-col>
          <!-- obs start -->
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
          <v-textarea
            rows="1"
            auto-grow
            v-model="state.formData.observaciones"
            @input="state.formData.observaciones = validateText(state.formData.observaciones.toUpperCase())"
          ></v-textarea>
        </v-col>
          <!-- obs end -->
      </v-row>     

      <v-row>
        <v-col cols="12" class="text-lg-right pt5">
          <template v-if="!isLoading">
            <v-btn color="error" class="mr-3" @click="buttonReturnList()">Volver</v-btn>
            <v-btn color="primary" class="mr-3" @click="buttonSendForm()">Enviar</v-btn>    
          </template>
          <template v-else>
            <v-btn color="primary" class="mr-3" disabled>
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

      <!-- <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p> -->
    </v-col>
  </v-row>
</template>
