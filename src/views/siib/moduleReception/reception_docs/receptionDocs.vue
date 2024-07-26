<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon, SatelliteIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { format, parseISO } from 'date-fns'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useDocumentaryReceptionStore } from '@/stores/moduleOne/documentaryReception';
import type tipoCodigoType  from '@/types/myTypes/tipoCodigoType'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { FORM_INVALID_EMAIL, FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const documentaryReception = useDocumentaryReceptionStore()

  // BREADCRUMB
  const page = ref({ title: 'Recepción documental' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '/home'
    },
    {
      text: 'Recepción documental',
      disabled: true,
      href: '#'
    }
  ]);

  // DECLARACION DE VARIABLES Y STATE
  const codigoSeleccionado=ref();
  const numeroCodigoSeleccionado=ref("");
  const currentDate = format(new Date(),"yyyy-MM-dd");
  const state = reactive({
    formData: {
      id_persona: '',
      cedula_identidad: '',
      complemento: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      genero: '',
      fecha_nacimiento: '',
      pais: '',
      departamento: '',
      provincia: '',
      localidad: '',
      domicilio: '',
      imagen: '',

      numero_caso_felcn_felcc: '',
      // numero_caso_felcn_felcc: "LP-X-123/23",

      id_dependencia: '',
      jurisdiccion: '',
      cargo: '',
      telefono: '',
      celular: '',
      correo_electronico: '',
      numero_fojas: 0,

      observaciones: '',
      fecha_formulario: currentDate,
      // citeActa: "MG/DIRCABI/SIIB/D--/---/2023",
      citeActa: '',
      
      codigos: [] as any,
    }
  });

  // LISTA DE TIPOS DE CODIGO
  const tipoCodigo = ref<tipoCodigoType[]>([])
  const getCodesTypeList = async () => {
    const codesType = await resourceStore.getCodesType()
    tipoCodigo.value = codesType
  }
  
  // LISTA DE DEPENDENCIAS
  const dependencias = ref([]);
  const getDependenciesList = async() => {
    const dependencies = await resourceStore.getDependencies()
    dependencias.value = dependencies
  }
  
  // LISTA DE JURISDICCIONES
  const jurisdicciones = ref([]);
  const getJurisdictionsList = async() => {
    const jurisdictions = await resourceStore.getOffices()
    jurisdicciones.value = jurisdictions.filter( (jurisdiccion: any) => jurisdiccion.departamento != 'NACIONAL' )
  }
  
  // AGREGA TIPO DE CODIGO A LA TABLA DE CODIGOS
  const buttonAddCode = () => {
    if(codigoSeleccionado.value == '') return
    const registro: any = tipoCodigo.value.find(tipo => tipo.id == codigoSeleccionado.value)
    state.formData.codigos.push(
      {
        id_tipo_codigo: registro.id,
        nombre_tipo_codigo: registro.nombre_tipo_codigo,
        numero_codigo: numeroCodigoSeleccionado.value
      }
    )
    tipoCodigo.value = tipoCodigo.value.filter(tipo => tipo.id != codigoSeleccionado.value)    
    codigoSeleccionado.value='',
    numeroCodigoSeleccionado.value=''
  }

  // ELIMINA TIPO DE CODIGO DE LA TABLA DE CODIGOS
  const buttonDeleteCode = (id: number) =>{
    const registro =  state.formData.codigos.find((tipo:any) => tipo.id_tipo_codigo == id)
    tipoCodigo.value.push(
      {
        id: registro.id_tipo_codigo,
        nombre_tipo_codigo: registro.nombre_tipo_codigo
      }
    )
    // REORDENAMIENTO DE LISTA
    tipoCodigo.value.sort(function(a: any, b: any) {
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
    state.formData.codigos = state.formData.codigos.filter((tipo:any) => tipo.id_tipo_codigo != id)
  }

  // BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
  const buttonSearchPerson = async () => {
    state.formData.id_persona = ''
    const respuesta = await resourceStore.getPerson(state.formData)
    // console.log('de DB', respuesta);
    if(Object.prototype.hasOwnProperty.call(respuesta, 'id')){
      // console.log('UTILIZANDO DESDE DB');
      Toast.fire({
        icon: 'success',
        title: 'Resultado Obtenido Satisfactoriamente'
      })
      state.formData.id_persona = respuesta.id
      state.formData.nombres = respuesta.nombres
      state.formData.apellido_paterno = respuesta.apellido_paterno
      state.formData.apellido_materno = respuesta.apellido_materno
      // BLOQUEAR EL INPUT
    }else{
      // console.log('UTILIZANDO DESDE API SEGIP');
      const { data } = await resourceStore.dataSegip(state.formData)
      if(data.respuesta){
        Toast.fire({
          icon: 'error',
          title: data.respuesta
        })
      // DESBLOQUEAR EL INPUT
      }else{
        Toast.fire({
          icon: 'success',
          title: 'Resultado Obtenido Satisfactoriamente'
        })
        state.formData.nombres = data.Nombres
        state.formData.apellido_paterno = data.PrimerApellido
        state.formData.apellido_materno = data.SegundoApellido
        state.formData.genero = data.Genero
        state.formData.fecha_nacimiento = birthDate(data.FechaNacimiento)
        state.formData.pais = data.LugarNacimientoPais
        state.formData.departamento = data.LugarNacimientoDepartamento
        state.formData.provincia = data.LugarNacimientoProvincia
        state.formData.localidad = data.LugarNacimientoLocalidad
        state.formData.domicilio = data.Domicilio
        state.formData.imagen = 
          data.Fotografia !== undefined
          ? 'data:image/jpeg;base64,' + data.Fotografia
          : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'
        // BLOQUEAR EL INPUT
      }
    }
    // if(state.formData.cedula_identidad.includes('-') || state.formData.cedula_identidad.includes('e')){
    //     alert("NO!!!!!")
    // }
  }

  const buttonClearPerson = () => {
    state.formData.id_persona = ''
    state.formData.cedula_identidad = ''
    state.formData.complemento = ''
    state.formData.nombres = ''
    state.formData.apellido_paterno = ''
    state.formData.apellido_materno = ''
    state.formData.genero = ''
    state.formData.fecha_nacimiento = ''
    state.formData.pais = ''
    state.formData.departamento = ''
    state.formData.provincia = ''
    state.formData.localidad = ''
    state.formData.domicilio = ''
    state.formData.imagen = ''
  }

  // VALIDACIONES INICIO
  const rules = computed(() => {
    return {
      formData: {
        numero_caso_felcn_felcc: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        numero_fojas: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        
        cedula_identidad: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        cargo: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        id_dependencia: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        jurisdiccion: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        celular: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) },
        correo_electronico: {
          required: helpers.withMessage(FORM_REQUIRED_FIELD, required),
          email: helpers.withMessage(FORM_INVALID_EMAIL, email)
        },
        codigos: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  const buttonReturnList = () => {
    router.push({ name: 'home' })
  }

  // ENVIO DE FORMULARIO
  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return
    // console.log(state.formData);
    const { ok, message, id } = await documentaryReception.createDocumentaryReception(state.formData)
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })
    if(id!=0){
      await documentaryReception.minutesReport(id)
    }
  }

  const birthDate = (date: string) => {
    if(date !== undefined){
      let format = date.split("/")
      let lastFormat = format[2] + "-" + format[1] + "-" + format[0];
      return lastFormat;
    }
    return  ''
  }

  const lastName = computed(() => {
    return state.formData.apellido_paterno +' '+ state.formData.apellido_materno
  })

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  onMounted(() => {
    getCodesTypeList()
    getDependenciesList()
    getJurisdictionsList()
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
    <!-- alert messages start -->
      <v-col cols="12" md="12">
        <v-alert
          variant="outlined"
          type="warning"
          closable
          border="top"
          icon="$warning"
          title="ATENCIÓN"
          text="La documentación debe estar correctamente foliada por parte de la FELCN/FELCC"
        />
      </v-col>
      <v-col cols="12" md="12">
        <v-alert
          variant="outlined"
          type="warning"
          closable
          border="top"
          icon="$warning"
          title="ATENCIÓN"
          text="Se deberá generar un acta por cada caso presentado"
        />
      </v-col>
    <!-- end messages alert -->

      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> REGISTRO DEL DOCUMENTO: </strong>Los campos con <span style="color:red">*</span> son obligatorios
      </h4>

      <v-row>
        <!-- form date start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium" required>
            Fecha Formulario<span style="color:red">*</span>
          </v-label>
          <v-text-field 
            type="date" 
            id="date-form" 
            name="date-form"
            v-model="state.formData.fecha_formulario"
            :max="currentDate"
            disabled
          />
        </v-col>
        <!-- form date end -->
        <!-- form cite start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium" required>
            Cite Acta<span style="color:red">*</span>
          </v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            v-model="state.formData.citeActa"
            disabled
          />
        </v-col>
        <!-- form cite end -->
        <!-- form felcn/felcc start -->
        <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium" required>
              Número Caso FELCN/FELCC<span style="color:red">*</span>
            </v-label>
            <v-text-field 
              variant="outlined" 
              color="primary"
              v-model.trim="state.formData.numero_caso_felcn_felcc"
              @input="state.formData.numero_caso_felcn_felcc = validateText(state.formData.numero_caso_felcn_felcc.toUpperCase())"
              :error="v$.formData.numero_caso_felcn_felcc.$error"
              :error-messages="errors.numero_caso_felcn_felcc"
            />
        </v-col>
        <!-- form felcn/felcc end -->
        <!-- form numero_fojas start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium" required>
            Número de numero_fojas<span style="color:red">*</span>
          </v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            type="number"
            min="0"
            v-model="state.formData.numero_fojas"
            oninput="if(this.value < 0) this.value = ''"
            :error="v$.formData.numero_fojas.$error"
            :error-messages="errors.numero_fojas"
          />
        </v-col>
        <!-- form numero_fojas end -->
      </v-row>
      
      <!-- code type, number and list start -->
      <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Tipo Código<span style="color:red">*</span>
          </v-label>
          <v-select
            :items="tipoCodigo"
            item-title="nombre_tipo_codigo"
            item-value="id"
            no-data-text="No existe más opciones para seleccionar"
            v-model="codigoSeleccionado"
            :error="v$.formData.codigos.$error"
            :error-messages="errors.codigos"
          >
        </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium" required>
            Número Código<span style="color:red">*</span>
          </v-label>
          <v-text-field 
            variant="outlined"
            color="primary"
            v-model.trim="numeroCodigoSeleccionado"
            @input="numeroCodigoSeleccionado = validateText(numeroCodigoSeleccionado.toUpperCase())"
            :error="v$.formData.codigos.$error"
            :error-messages="errors.codigos"
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
                  :key="item.id_tipo_codigo"
                >
                  <td class="text-center">{{ item.nombre_tipo_codigo }}</td>
                  <td class="text-center">{{ item.numero_codigo }}</td>
                  <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteCode(item.id_tipo_codigo)"/></td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-row>
      <!-- code type, number and list end -->

      <h4 class="mb-5 mt-5 font-weight-light">
          DATOS PERSONAL FELCN/FELCC:
      </h4>

      <v-row>
        <!-- id number start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Número de Documento<span style="color:red">*</span>
          </v-label>
          <v-text-field
            :error="v$.formData.cedula_identidad.$error"
            :error-messages="errors.cedula_identidad"
            variant="outlined" 
            color="primary"
            type="number"
            min="0"
            v-model="state.formData.cedula_identidad"
            oninput="if(this.value < 0) this.value = '';"
            @keydown.enter=buttonSearchPerson()
            
          >
          </v-text-field>
        </v-col>
        <!-- id number end -->
        <!-- complement start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Complemento</v-label>
          <v-text-field
            variant="outlined"
            color="primary"
            v-model.trim="state.formData.complemento"
            @input="state.formData.complemento = validateText(state.formData.complemento)"
            @keydown.enter=buttonSearchPerson()
          >
            <template v-slot:append>
              <v-btn
                color="primary"
                @click= buttonSearchPerson()
                :disabled="!state.formData.cedula_identidad"><SearchIcon/>Buscar
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClearPerson()
                :disabled="!state.formData.cedula_identidad"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <!-- complement end -->
        <!-- names start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombres<span style="color:red">*</span></v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            v-model.trim="state.formData.nombres"
            disabled
          ></v-text-field>
        </v-col>
        <!-- names end -->
        <!-- last name start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Apellidos<span style="color:red">*</span></v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            v-model.trim="lastName"
            disabled
          ></v-text-field>
        </v-col>
        <!-- last name end -->
        <!-- position start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Cargo<span style="color:red">*</span></v-label>
          <v-text-field 
            variant="outlined" 
            color="primary"
            v-model.trim="state.formData.cargo"
            @input="state.formData.cargo = validateText(state.formData.cargo.toUpperCase())"
            :error="v$.formData.cargo.$error"
            :error-messages="errors.cargo"
          ></v-text-field>
        </v-col>
        <!-- position end-->
        <!-- dependence start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Dependencia<span style="color:red">*</span></v-label>
          <v-select
            :items="dependencias"
            item-title="nombre_dependencia"
            item-value="id"
            no-data-text="No existe más opciones para seleccionar"
            v-model="state.formData.id_dependencia" 
            :error="v$.formData.id_dependencia.$error"
            :error-messages="errors.id_dependencia"
          />
        </v-col>
        <!-- dependence end -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Jurisdicción<span style="color:red">*</span></v-label>
          <v-select
            :items="jurisdicciones"
            item-title="departamento"
            item-value="departamento"
            v-model="state.formData.jurisdiccion" 
            :error="v$.formData.jurisdiccion.$error"
            :error-messages="errors.jurisdiccion"
          />
        </v-col>
        <!-- phone number start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Teléfono</v-label>
          <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            v-model="state.formData.telefono"
          ></v-text-field>
        </v-col>
        <!-- phone number end -->
        <!-- celphone number start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Celular<span style="color:red">*</span></v-label>
          <v-text-field 
            type="number"
            variant="outlined"
            color="primary"
            v-model.trim="state.formData.celular"
            :error="v$.formData.celular.$error"
            :error-messages="errors.celular"
          ></v-text-field>
        </v-col>
        <!-- celphone number end -->
        <!-- correo_electronico start -->
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Correo Electrónico<span style="color:red">*</span></v-label>
          <v-text-field 
            variant="outlined"
            color="primary"
            v-model.trim="state.formData.correo_electronico"
            @input="state.formData.correo_electronico = validateText(state.formData.correo_electronico)"
            :error="v$.formData.correo_electronico.$error"
            :error-messages="errors.correo_electronico"
          ></v-text-field>
        </v-col>
        <!-- correo_electronico end -->
        <!-- obs start -->
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
          <v-textarea
            rows="1"
            auto-grow
            v-model.trim="state.formData.observaciones"
            @input="state.formData.observaciones = validateText(state.formData.observaciones.toUpperCase())"
          ></v-textarea>
        </v-col>
        <!-- obs end -->
      </v-row>   

      <p class="text-lg-right">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Generar Acta</v-btn>
      </p>
    </v-col>
  </v-row>
</template>
