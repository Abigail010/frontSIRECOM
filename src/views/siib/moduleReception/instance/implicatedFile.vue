<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { format, parseISO } from 'date-fns'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';
import { useInstanceStore } from '@/stores/moduleOne/instance';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { FORM_INVALID_EMAIL, FORM_REQUIRED_FIELD } from '@/utils/helpers/messages'
import { validateText } from '@/utils/helpers/validateText'
import { useValidationErrors } from '@/stores/useValidationErrors';

  const resourceStore = useResourceStore()
  const instanceStore = useInstanceStore()
  const route = useRoute()

  const page = ref({ title: 'Registro de Implicado' });
  const breadcrumbs = ref([
      {
          text: 'Dashboard',
          disabled: false,
          href: '#'
      },
      {
          text: 'Registro de Implicado',
          disabled: true,
          href: '#'
      }
  ]);

  // DECLARACION DE STATE
  const state = reactive({
    formData: {
      id_caso: '',
      implicados:[] as any,
    }
  })

   const person = reactive({
    personData: {
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
      id_tipo_implicado: '',
      observaciones:''
    }
  })

  // CONSTANTE PARA CAMBIAR LOS INPUT DEL FORMULARIO  
  const noDataSegip = ref<boolean>(false)
  const currentDate = format(new Date(),"yyyy-MM-dd");
  let implicadoPrincipal: any = ''
  const isLoading = ref(false)

  // FUNCION QUE LLAMA LA INFORMACION DEL CASO
  const getInstanceImplicatedById = async (id: any) => {
    const caso = await instanceStore.instanceImplicated(id)
    // console.log('info de back', caso)
    state.formData.id_caso = caso.id_caso
    for (let i = 0; i < caso.implicados.length; i++) {
      state.formData.implicados.push(caso.implicados[i])
    }
  }

  // LISTA DE TIPOS DE IMPLICADO
  const tipoImplicaciones = ref([])
  const getImplicatedTypesList = async () => {
    const implicatedTypes = await resourceStore.getImplicatedTypes()
    tipoImplicaciones.value = implicatedTypes
    implicadoPrincipal = implicatedTypes.find( (implicado: any) => implicado.nombre_tipo_implicado == 'IMPLICADO PRINCIPAL' )
  }

  // LISTA DE GENEROS PARA SELECT
  const genero = ref([
    {valor:'MASCULINO', genero:'MASCULINO'},
    {valor:'FEMENINO', genero:'FEMENINO'}
  ])
  
  const buttonSearchPerson = async () => {
    const { data } = await resourceStore.dataSegip(person.personData)
    if(data.respuesta){
      Toast.fire({
        icon: 'error',
        title: `${data.respuesta}`
      })
      noDataSegip.value = true;
      buttonClearPerson();
    }else{
      // console.log(data)
      // VERIFICAR QUE EL DATO DE LA PERSONA NO SE ENCUENTRE ACTUALMENTE EN LA TABLA DE IMPLICADOS
      const registro = state.formData.implicados.find( (implicado:any) => implicado.cedula_identidad == data.NumeroDocumento )
      if(registro){
        Toast.fire({
          icon: 'info',
          title: 'Registro existente en lista de implicados'
        })
        buttonClearPerson()
      }else{
        Toast.fire({
          icon: 'success',
          title: 'Resultado Obtenido Satisfactoriamente'
        })
        noDataSegip.value = false;
        
        person.personData.nombres = data.Nombres
        person.personData.apellido_paterno = data.PrimerApellido
        person.personData.apellido_materno = data.SegundoApellido
        person.personData.genero = data.Genero
        person.personData.fecha_nacimiento = birthDate(data.FechaNacimiento)
        person.personData.pais = data.LugarNacimientoPais
        person.personData.departamento = data.LugarNacimientoDepartamento
        person.personData.provincia = data.LugarNacimientoProvincia
        person.personData.localidad = data.LugarNacimientoLocalidad
        person.personData.domicilio = data.Domicilio
        person.personData.imagen = 
          data.Fotografia !== undefined
          ? 'data:image/jpeg;base64,' + data.Fotografia
          : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'
        
        // FOCUS AL SIGUIENTE INPUT
        const myDiv = <HTMLElement>document.getElementById("tipo_implicacion")
        myDiv.scrollIntoView()
        myDiv.focus()
      }
    }
  }

  const buttonClearPerson = () => {
    person.personData.cedula_identidad = ''
    person.personData.complemento = ''
    person.personData.nombres = ''
    person.personData.apellido_paterno = ''
    person.personData.apellido_materno = ''
    person.personData.genero = ''
    person.personData.fecha_nacimiento = ''
    person.personData.pais = ''
    person.personData.departamento = ''
    person.personData.provincia = ''
    person.personData.localidad = ''
    person.personData.domicilio = ''
    person.personData.imagen = ''
    person.personData.id_tipo_implicado = ''
    person.personData.observaciones=''
  }

  const buttonAddPerson = () => {
    state.formData.implicados.push({...person.personData})
    buttonClearPerson()
  }

  const buttonDeleteImplicated = (index:number) => {
    state.formData.implicados.splice(index, 1)
  }

  // VALIDACIONES INICIO
  const rules = computed(() => {
    return {
      formData: {
        implicados: { required: helpers.withMessage(FORM_REQUIRED_FIELD, required) }
      }
    }
  })
  const v$ = useVuelidate(rules, state)
  const errors:any = computed(
    () => useValidationErrors(v$.value.$errors)
  )

  const buttonReturnList = () => {
    router.push({ name: 'documentaryReviewList' })
  }

  const buttonSendForm = async () => {
    const result = await v$.value.$validate()
    if(!result) return
    const validacion = state.formData.implicados.find( (implicado:any) => implicado.id_tipo_implicado == implicadoPrincipal.id )
    if(!validacion){
      Toast.fire({
        icon: 'error',
        title: 'IMPLICADO PRINCIPAL necesario en lista'
      })
      return
    }
    isLoading.value = true
    const { ok, message } = await instanceStore.updateInstanceImplicated(state.formData)
    const icono = (ok ? 'success' : 'error')
    Swal.fire({
      icon: icono,
      title: message,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }

  const getDescriptionImplicated = (id:number) => {
    const response: any = tipoImplicaciones.value.find( val => val['id'] === id )
    return response?.nombre_tipo_implicado
  }

  const birthDate = (date: string) => {
    if(date !== undefined){
      let format = date.split("/")
      let lastFormat = format[2] + "-" + format[1] + "-" + format[0];
      return lastFormat;
    }
    return  ''
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  onMounted(() => {
    getImplicatedTypesList()
    if(route.params.id != '0'){
      getInstanceImplicatedById(route.params.id)
    }
      // con el ID cargar la data

    // console.log(route.params.id)
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
          - <span class="text-primary">Siempre que el implicado cuente con Cedula de Identidad Boliviana y para que los campos <span class="text-secondary font-weight-medium">Nombres, Primer Apellido, Segundo Apellido, Género, Fecha de Nacimiento, País y Departamento/Ciudad/Estado/Provincia</span> se autocompleten, debe registrar el Número de Documento de Identidad del Implicado y seleccionar el botón <span class="text-warning font-weight-medium">Buscar</span>.</span><br>
          - <span class="text-primary">Si tiene un implicado que no cuenta con documentos, verifique que el campo <span class="text-secondary font-weight-medium">Número Documento de Identidad</span> este vacio y seleccione el botón <span class="text-warning font-weight-medium">Buscar</span>, se habilitara el formulario para que se pueda registrar de forma manual, es suficiente con llenar el campo Nombres y el Tipo de Implicación (si cuenta con mas información debe registrarla).</span><br>
          - <span class="text-primary">Los implicados seran registrados en el sistema siempre y cuando en el listado de los mismos, se encuentre al menos un implicado con el Tipo de Implicación <span class="text-warning font-weight-medium">IMPLICADO PRINCIPAL</span>.</span><br>
          - <span class="text-primary">En el campo <span class="text-secondary font-weight-medium">Tipos de Implicación</span> si no encuentra la opción requerida, debe comunicarse con el Área de Registro y Sistemas mediante el correo institucional, solicitar el agregado de la opción.</span><br>
        </v-alert>
      </v-col>
    </v-row>

     <!-- end messages alert -->
     <h4 class="mb-5 mt-2 font-weight-light">
            <strong> REGISTRO DE IMPLICADOS:</strong> Los campos con <span style="color:red">*</span> son obligatorios
          </h4>
     <v-row>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">
            Número Documento de Identidad<span style="color:red">*</span>
          </v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            type="number"
            min="0"
            v-model="person.personData.cedula_identidad"
            oninput="if(this.value < 0) this.value = '';"
            @keydown.enter=buttonSearchPerson()
            @keydown.delete="buttonClearPerson()"
            :error="v$.formData.implicados.$error"
            :error-messages="errors.implicados"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Complemento</v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            v-model="person.personData.complemento"
            @keydown.enter=buttonSearchPerson();
          >
            <template v-slot:append>
              <v-btn
                color="primary"
                @click= buttonSearchPerson()
                ><SearchIcon/>Buscar
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClearPerson()
                ><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <!-- id number end -->
        <!-- complement start -->   
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Nombres<span style="color:red">*</span>
          </v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            v-model="person.personData.nombres"
            @input="person.personData.nombres = person.personData.nombres.toUpperCase()"
            :disabled="!noDataSegip"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Primer Apellido<span style="color:red">*</span>
          </v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            v-model="person.personData.apellido_paterno"
            @input="person.personData.apellido_paterno = person.personData.apellido_paterno.toUpperCase()"
            :disabled="!noDataSegip"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Segundo Apellido<span style="color:red">*</span>
          </v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            v-model="person.personData.apellido_materno"
            @input="person.personData.apellido_materno = person.personData.apellido_materno.toUpperCase()"
            :disabled="!noDataSegip"
          />
        </v-col>   
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Género<span style="color:red">*</span>
          </v-label>
          <v-select
            :items="genero"
            item-title="genero"
            item-value="valor"
            no-data-text="No existe más opciones para seleccionar"
            v-model="person.personData.genero"
            @input="person.personData.genero = person.personData.genero.toUpperCase()"
            :disabled="!noDataSegip"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Fecha de nacimiento<span style="color:red">*</span>
          </v-label>
          <v-text-field 
            type="date" 
            id="date-form" 
            name="date-form"
            v-model="person.personData.fecha_nacimiento"
            :max="currentDate"
            :disabled="!noDataSegip"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">País<span style="color:red">*</span>
          </v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            v-model="person.personData.pais"
            @input="person.personData.pais = person.personData.pais.toUpperCase()"
            :disabled="!noDataSegip"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Departamento/Ciudad/Estado/Provincia<span style="color:red">*</span>
          </v-label>
          <v-text-field
            variant="outlined" 
            color="primary"
            v-model="person.personData.departamento"
            @input="person.personData.departamento = person.personData.departamento.toUpperCase()"
            :disabled="!noDataSegip"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-label class="mb-2 font-weight-medium">Tipo de Implicación<span style="color:red">*</span>
          </v-label>
          <v-select
            id="tipo_implicacion"
            :items="tipoImplicaciones"
            item-title="nombre_tipo_implicado"
            item-value="id"
            no-data-text="No existe más opciones para seleccionar"
            v-model="person.personData.id_tipo_implicado"
            :error="v$.formData.implicados.$error"
            :error-messages="errors.implicados"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Observaciones</v-label>
          <v-textarea
            class="mx-2"
            rows="1"
            auto-grow
            v-model="person.personData.observaciones"
            @input="person.personData.observaciones = person.personData.observaciones.toUpperCase()"
          >
          <template v-slot:append>
            <v-btn color="secondary" class="mr-3" :disabled="!person.personData.nombres || !person.personData.id_tipo_implicado" @click="buttonAddPerson()"><PlusIcon/>Agregar implicado</v-btn>
          </template>
        </v-textarea>
        </v-col>
    </v-row>
    <v-row>
      <v-col  v-if="state.formData.implicados.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nombre Implicado</th>
              <th class="text-center">País</th>
              <th class="text-center">Tipo de Implicación</th>
              <th class="text-center">Observaciones</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.implicados"
              :key="index"
            >
              <td class="text-center">{{ item.nombres }} {{ item.apellido_paterno }} {{ item.apellido_materno }}</td>
              <td class="text-center">{{ item.pais }}</td>
              <td class="text-center">{{ getDescriptionImplicated(item.id_tipo_implicado) }} </td>
              <td class="text-center">{{ item.observaciones }}</td>
              <td class="text-center"><TrashIcon style="color: red; cursor: pointer;" @click="buttonDeleteImplicated(index)"/></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-lg-right pt-5">
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
</template>