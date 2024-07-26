<script setup lang="ts">
import { ref, reactive, computed, onMounted, readonly } from 'vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { validateText } from '@/utils/helpers/validateText'
import { useResourceStore } from '@/stores/resource';
import { useExternalRegistrationStore } from '@/stores/moduleInteroperability/externalRegistration';
import Logo from '@/layouts/full/logo/Logo.vue';
import moment from 'moment';
const route = useRoute()
const resourceStore = useResourceStore()
const externalRegistrationStore = useExternalRegistrationStore()


// DECLARACION DEL STATE
const state = reactive({
    formData: {
        // tabla usuario
        id_usuario: 0,
        id_persona: 0,
        id_persona_empresa: 0,
        id_solicitud: 0,
        tipo_usuario: '',
        nombre_usuario: '',
        correo_electronico: '',
        celular: '',
        nit: '',
        razon_social: '',
        nombre_empresa: '',
        codigo_ministerio_trabajo: '',
        numero_contacto: '',

        // tabla persona
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        cedula_identidad: '',
        complemento: '',
        genero: '',
        fecha_nacimiento: '',
        pais: '',
        departamento: '',
        provincia: '',
        localidad: '',
        domicilio: '',
        imagen: '',

        // tabla persona_empresa
        cargo: '',
        celular_persona_empresa: '',

        //codigo de confirmacion
        codigo_enviado: '',
        codigo_confirmacion: '',

        //observaciones
        observaciones: '',
        estado_solicitud: '',

        //documentos adjuntos
        formulario: {
            fotografias: ['','','']
        }, 
        documento_1: [] as any,
        documento_2: [] as any,
        documento_3: [] as any,
    } 
});
const editar = ref<any>(false)
const submitButton = ref(false)
const sendForm = ref(true)
const testEmail = ref(true)
const isLoading = ref(false)
const usuarioValidado = ref(false)
const codeSent = ref(false)
const usuarioSistema = ref(false)
const declineApplication = ref(false)


onMounted( async () => {
    state.formData.tipo_usuario = 'PERSONA NATURAL'
    if(route.params.id != '0'){
        getExternalRegistrationById(route.params.id)
        editar.value = true
    }
    if (localStorage.getItem('user') !== null) {
        usuarioSistema.value = true
    } 
})

// FUNCION QUE OBTIENE LA INFORMACION DE LA ENTIDAD EXTERNA
const getExternalRegistrationById = async (id: any) => {
    const respuesta = await externalRegistrationStore.externalRegistration(id)
    const archivo_1 = respuesta.archivos_direccion[0] as any
    const archivo_2 = respuesta.archivos_direccion[1] as any
    const archivo_3 = respuesta.archivos_direccion[2] as any
    console.log(respuesta)
    const date = moment(respuesta.fecha_nacimiento).utc().format('YYYY-MM-DD')

    state.formData.id_usuario = respuesta.id,
    state.formData.id_persona = respuesta.id_persona,
    state.formData.id_persona_empresa = respuesta.id_persona_empresa,
    state.formData.id_solicitud = respuesta.id_solicitud,
    state.formData.tipo_usuario = respuesta.tipo_usuario,
    state.formData.nombre_usuario = respuesta.nombre_usuario,
    state.formData.correo_electronico = respuesta.correo_electronico,
    state.formData.celular = respuesta.celular,
    state.formData.nit = respuesta.nit,
    state.formData.razon_social = respuesta.razon_social,
    state.formData.nombre_empresa = respuesta.nombre_empresa,
    state.formData.codigo_ministerio_trabajo = respuesta.codigo_ministerio_trabajo,
    state.formData.numero_contacto = respuesta.numero_contacto,

    // tabla persona
    state.formData.nombres = respuesta.nombres,
    state.formData.apellido_paterno = respuesta.apellido_paterno,
    state.formData.apellido_materno = respuesta.apellido_materno,
    state.formData.cedula_identidad = respuesta.cedula_identidad,
    state.formData.complemento = respuesta.complemento,
    state.formData.genero = respuesta.genero,
    state.formData.fecha_nacimiento = date,
    state.formData.pais = respuesta.pais,
    state.formData.departamento = respuesta.departamento,
    state.formData.provincia = respuesta.provincia,
    state.formData.localidad = respuesta.localidad,
    state.formData.domicilio = respuesta.domicilio,
    state.formData.imagen = respuesta.imagen,

    // tabla persona_empresa
    state.formData.cargo = respuesta.cargo,
    state.formData.celular_persona_empresa = respuesta.celular_empresa
    //archivos
    if(respuesta.archivos_direccion.length>0){
        state.formData.documento_1[0] = respuesta.archivos_direccion[0].id
        state.formData.documento_2[0] = respuesta.archivos_direccion[1].id
        state.formData.documento_3[0] = respuesta.archivos_direccion[2].id
        // state.formData.formulario.fotografias[0] = 'http://localhost:3009/externalRegistration/get_file/1'
        // console.log(state.formData.formulario)
        
    }
    //estado_solicitud
    state.formData.estado_solicitud = respuesta.estado_solicitud
    
  }

const lista_tipo_persona = ref([
    {value: 'PERSONA NATURAL', title: 'PERSONA NATURAL'},
    {value: 'PERSONA JURIDICA', title: 'PERSONA JURÍDICA'}
])

// BUSQUEDA DE PERSONA MEDIANTE NUMERO DE DOCUMENTO
const buttonSearchPerson = async () => {
    usuarioValidado.value = false
    // API SEGIP
    const { data } = await resourceStore.dataSegip(state.formData)
    if(data.respuesta){
        Toast.fire({
        icon: 'error',
        title: data.respuesta
        })
        usuarioValidado.value = false
    } else {
        console.log(data)
        // console.log('Resultado Obtenido Satisfactoriamente SEGIP')
        if(data.PrimerApellido != '--' && data.SegundoApellido != '--'){
            if(state.formData.nombres == data.Nombres && state.formData.apellido_paterno == data.PrimerApellido && state.formData.apellido_materno == data.SegundoApellido
                && state.formData.fecha_nacimiento == birthDate(data.FechaNacimiento)){
                usuarioValidado.value = true
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Los datos no coinciden con Segip'
                })
                usuarioValidado.value = false
            }
        } else {
            if(data.PrimerApellido == '--'){
                if(state.formData.nombres == data.Nombres && state.formData.apellido_materno == data.SegundoApellido
                    && state.formData.fecha_nacimiento == birthDate(data.FechaNacimiento)){
                    usuarioValidado.value = true
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Los datos no coinciden con Segip'
                    })
                    usuarioValidado.value = false
                }
            } else {
                if(state.formData.nombres == data.Nombres && state.formData.apellido_paterno == data.PrimerApellido
                    && state.formData.fecha_nacimiento == birthDate(data.FechaNacimiento)){
                    usuarioValidado.value = true
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Los datos no coinciden con Segip'
                    })
                    usuarioValidado.value = false
                }
            }
        }
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

const reinicio = async () => {
    codeSent.value = false
}

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
// MIS VALIDACIONES
const miValidacion = async () => {
    sendForm.value = true
    testEmail.value = true
    if(state.formData.tipo_usuario === 'PERSONA NATURAL')
    {   
        // datos persona natural
        if(!state.formData.tipo_usuario || !state.formData.cedula_identidad || !state.formData.nombres || !state.formData.fecha_nacimiento || !state.formData.domicilio || !state.formData.correo_electronico || !state.formData.celular){
            sendForm.value = false
        }
        //correo electronico
        const validarEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        if(state.formData.correo_electronico && !validarEmail.test(state.formData.correo_electronico)){
            testEmail.value = false
            sendForm.value = false
        }
    } else {
        // datos empresa
        if(!state.formData.nit || !state.formData.razon_social || !state.formData.nombre_empresa || !state.formData.codigo_ministerio_trabajo || !state.formData.correo_electronico){
            sendForm.value = false
        }
        //correo electronico
        const validarEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        if(state.formData.correo_electronico && !validarEmail.test(state.formData.correo_electronico)){
            testEmail.value = false
            sendForm.value = false
        }

        // datos persona juridica
        if(!state.formData.cedula_identidad || !state.formData.nombres || !state.formData.fecha_nacimiento || !state.formData.domicilio || !state.formData.cargo || !state.formData.celular_persona_empresa){
            sendForm.value = false
        }

        // datos adjunto 1
        if(state.formData.documento_1.length == 0){
            sendForm.value = false
        }

        // datos adjunto 2
        if(state.formData.documento_2.length == 0){
            sendForm.value = false
        }

        // datos adjunto 3
        if(state.formData.documento_3.length == 0){
            sendForm.value = false
        }
        
    }
}

//para enviar codigo a su correo
const buttonSendCode = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value) return
    await buttonSearchPerson()
    if(!usuarioValidado.value)return 

    state.formData.codigo_enviado = generateRandomPassword()
    const registro = await externalRegistrationStore.sendCode(state.formData)
    if(registro.ok){
        Toast.fire({
        icon: 'success',
        title: 'Se envio el código de confirmación a su correo electrónico'
        })
        codeSent.value = true
    } else {
        Toast.fire({
        icon: 'error',
        title: registro.message
        })
    }
}

// GENERACIÓN DE CONTRASENA ALEATORIA
const generateRandomPassword = () => {
  const characters ='A1B2C3D4E5F6G7H89JKLMNPQRSTUVWXYZ'
  let passwordGenerated = ''
  for (let index = 0; index < 6; index++) {
    passwordGenerated += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return passwordGenerated
}

const buttonSendForm = async () => {
    submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
    if(!testEmail.value)return 
    if(state.formData.codigo_enviado != state.formData.codigo_confirmacion){
        Toast.fire({
        icon: 'error',
        title: 'Código incorrecto'
        })
        return
    }
    const { ok, message } = (route.params.id == '0') ? await externalRegistrationStore.createExternalRegistration(state.formData) : await externalRegistrationStore.updateExternalRegistration(state.formData)
        const icono = (ok ? 'success' : 'error')
    Swal.fire({
        icon: icono,
        title: message,
        confirmButtonText: 'Ok'
    }).then(() => {
        isLoading.value = false
        // router.push({ name: '/', params: { id:route.params.id_caso } });
    })
}

const buttonSendApplication = async () => {
    Swal.fire({
            title: "¿Esta seguro de aprobar la solicitud?",
            text: "¡No podra revertir esta decisión!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, aprobar la solicitud!",
            cancelButtonText: "Cancelar!"
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "Correcto!",
            text: "Se aprobo la solicitud.",
            icon: "success"
            });
        }
    })
}

const buttonDeclineApplication = async () => {
    declineApplication.value = true
}

const buttonSendDeclineApplication = async () => {
    if(!state.formData.observaciones){
        Swal.fire({
            icon: 'error',
            title: 'Debe llenar el campo de observaciones',
            confirmButtonText: 'Ok'
        })
    } else {
        const result = await Swal.fire({
            title: "¿Esta seguro de rechazar la solicitud?",
            // text: "¡No podra revertir esta decisión!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, rechazar la solicitud!",
            cancelButtonText: "Cancelar!"
        });
        
        if (result.isConfirmed) {
            state.formData.estado_solicitud = 'RECHAZADO'
            const response = await externalRegistrationStore.declineExternalRegistration(state.formData);
            const iconoo = (response ? 'success' : 'error');
            await Swal.fire({
                icon: iconoo,
                title: response.message,
                confirmButtonText: 'Ok'
            });
            let tipo_usu
            if(state.formData.tipo_usuario == 'PERSONA NATURAL'){
                tipo_usu = 'natural'
            } else {
                tipo_usu = 'juridica'
            }
            // router.push({ name: '/externalRegistrationList/', params: { estado: 'pendiente', tipo: tipo_usu } });
            router.push({ name: 'externalRegistrationList', params: { estado: 'pendiente', tipo: tipo_usu } });

        }
    }
}

const buttonReviewReportPersoneriaJuridica = async (id: any) => {
    await externalRegistrationStore.externalRegistrationDocument(id)
}

const buttonReviewReportCertificadoInscripcion = async (id: any) => {
    await externalRegistrationStore.externalRegistrationDocument(id)
}

const buttonReviewReportRepresentanteLegal = async (id: any) => {
    await externalRegistrationStore.externalRegistrationDocument(id)
}

const adjuntarArchivo = async ( numero: String ) => {
    switch (numero) {
        case '0':
            state.formData.formulario.fotografias[0] = state.formData.documento_1
            break;
        case '1':
            state.formData.formulario.fotografias[1] = state.formData.documento_2
            break;
        case '2':
            state.formData.formulario.fotografias[2] = state.formData.documento_3
            break;
        default:
            break;
    }
}
</script>
<template>
    <div class="registro">
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-center align-center">
                <v-col cols="12" class="d-flex align-center">
                    <v-card rounded="md" elevation="11" class="px-sm-1 px-0  mx-auto" max-width="1500">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4 mb-8"><Logo /></div>
                            <div class="d-flex align-center text-center mb-6">
                                <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
                                    <span class="bg-surface px-5 py-3 position-relative">Registro de Entidades Externas</span>
                                </div> 
                            </div>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-label class="font-weight-medium mb-2">TIPO DE PERSONA</v-label>
                                    <v-select
                                    v-model="state.formData.tipo_usuario"
                                    :items="lista_tipo_persona"
                                    item-title="title"
                                    item-value="value"
                                    @input="miValidacion()"
                                    @update:model-value="reinicio()"
                                    :error="submitButton && state.formData.tipo_usuario === ''"
                                    :readonly="usuarioSistema"
                                    hide-details
                                    ></v-select>
                                    <template v-if="submitButton && state.formData.tipo_usuario === ''">
                                    <div class="v-messages font-weight-black px-2 py-2">
                                        <div class="v-messages__message text-error ">
                                        El campo es requerido
                                        </div>
                                    </div>
                                    </template>
                                </v-col>
                                <v-col cols="12" md="6"></v-col>
                                <!-- PERSONA NATURAL -->
                                <template v-if="state.formData.tipo_usuario === 'PERSONA NATURAL'">
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">
                                            Número de Documento<span style="color:red">*</span>
                                        </v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.cedula_identidad"
                                            @input="miValidacion(), state.formData.cedula_identidad= validateText(state.formData.cedula_identidad)"
                                            :error="submitButton && !state.formData.cedula_identidad"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.cedula_identidad">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Complemento</v-label>
                                        <v-text-field
                                            variant="outlined"
                                            color="primary"
                                            v-model.trim="state.formData.complemento"
                                            @input="state.formData.complemento = validateText(state.formData.complemento)"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Nombres<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.nombres"
                                            @input="miValidacion(), state.formData.nombres= validateText(state.formData.nombres.toUpperCase())"
                                            :error="submitButton && !state.formData.nombres"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.nombres">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Apellido Paterno</v-label>
                                        <v-text-field
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model="state.formData.apellido_paterno"
                                            @input="state.formData.apellido_paterno= validateText(state.formData.apellido_paterno.toUpperCase())"
                                            :readonly="usuarioSistema"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Apellido Materno</v-label>
                                        <v-text-field
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model="state.formData.apellido_materno"
                                            @input="state.formData.apellido_materno= validateText(state.formData.apellido_materno.toUpperCase())"
                                            :readonly="usuarioSistema"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Fecha nacimiento<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="date"
                                            v-model.trim="state.formData.fecha_nacimiento"
                                            @input="miValidacion(), state.formData.fecha_nacimiento= validateText(state.formData.fecha_nacimiento.toUpperCase())"
                                            :error="submitButton && !state.formData.fecha_nacimiento"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.fecha_nacimiento">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">dirección<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.domicilio"
                                            @input="miValidacion(), state.formData.domicilio= validateText(state.formData.domicilio.toUpperCase())"
                                            :error="submitButton && !state.formData.domicilio"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.domicilio">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Correo electronico<span style="color:red">*</span></v-label>
                                        <v-text-field
                                            variant="outlined" 
                                            color="primary"
                                            type="email"
                                            v-model.trim="state.formData.correo_electronico" 
                                            @input="miValidacion(), state.formData.correo_electronico= validateText(state.formData.correo_electronico)"
                                            :error="submitButton && !state.formData.correo_electronico"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && state.formData.correo_electronico && !testEmail">
                                                <div class="v-messages font-weight-black px-2 py-2">
                                                    <div class="v-messages__message text-error ">
                                                    Debe ser un correo válido
                                                    </div>
                                                </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Celular<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="number"
                                            v-model.trim="state.formData.celular"
                                            @input="miValidacion(), state.formData.celular= validateText(state.formData.celular.toUpperCase())"
                                            :error="submitButton && !state.formData.celular"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.celular">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                </template>
                                <!-- PERSONA JURIDICA -->
                                <template v-else>
                                    <v-col cols="12" md="12">
                                        <h5>DATOS DE LA ENTIDAD</h5>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">
                                            NIT<span style="color:red">*</span>
                                        </v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.nit"
                                            @input="miValidacion(), state.formData.nit= validateText(state.formData.nit.toUpperCase())"
                                            :error="submitButton && !state.formData.nit"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.nit">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">
                                            Razón Social<span style="color:red">*</span>
                                        </v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.razon_social"
                                            @input="miValidacion(), state.formData.razon_social= validateText(state.formData.razon_social.toUpperCase())"
                                            :error="submitButton && !state.formData.razon_social"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.razon_social">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-label class="mb-2 font-weight-medium">
                                            Nombre de la Empresa<span style="color:red">*</span>
                                        </v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.nombre_empresa"
                                            @input="miValidacion(), state.formData.nombre_empresa= validateText(state.formData.nombre_empresa.toUpperCase())"
                                            :error="submitButton && !state.formData.nombre_empresa"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.nombre_empresa">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">
                                            Código Ministerio de Trabajo<span style="color:red">*</span>
                                        </v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.codigo_ministerio_trabajo"
                                            @input="miValidacion(), state.formData.codigo_ministerio_trabajo= validateText(state.formData.codigo_ministerio_trabajo)"
                                            :error="submitButton && !state.formData.codigo_ministerio_trabajo"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.codigo_ministerio_trabajo">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Correo Institucional<span style="color:red">*</span></v-label>
                                        <v-text-field
                                            variant="outlined" 
                                            color="primary"
                                            type="email"
                                            v-model.trim="state.formData.correo_electronico" 
                                            @input="miValidacion(), state.formData.correo_electronico= validateText(state.formData.correo_electronico)"
                                            :error="submitButton && !state.formData.correo_electronico"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && state.formData.correo_electronico && !testEmail">
                                                <div class="v-messages font-weight-black px-2 py-2">
                                                    <div class="v-messages__message text-error ">
                                                    Debe ser un correo válido
                                                    </div>
                                                </div>
                                        </template>
                                    </v-col>
                                    <template v-if="!usuarioSistema">
                                        <v-col cols="12">
                                            <v-label class="mb-2 font-weight-medium">Certificado de Personeria Jurídica (Documento)<span style="color:red">*</span></v-label>
                                            <v-file-input
                                                v-model="state.formData.documento_1"
                                                accept="application/pdf"
                                                placeholder="Cargue el documento aqui"
                                                prepend-icon="mdi-paperclip"
                                                color="deep-purple-accent-4"
                                                counter
                                                variant="outlined"
                                                :show-size=true
                                                hide-details
                                                :error="submitButton && state.formData.documento_1.length == 0"
                                                @change="adjuntarArchivo('0'), miValidacion()"
                                            >
                                                <template v-slot:selection="{ fileNames }">
                                                    <template v-for="(fileName, index) in fileNames" :key="fileName">
                                                        <v-chip
                                                        v-if="index < 5"
                                                        color="deep-purple-accent-4"
                                                        label
                                                        size="small"
                                                        class="me-2"
                                                        >
                                                        {{ fileName }}
                                                        </v-chip>
                                                    </template>
                                                </template>
                                            </v-file-input>
                                            <template v-if="submitButton && state.formData.documento_1.length == 0">
                                                <div class="v-messages font-weight-black ml-3 mt-2">
                                                    <div class="v-messages__message text-error">
                                                        El campo es requerido
                                                    </div>
                                                </div>
                                            </template>
                                        </v-col>
                                            <v-col cols="12">
                                            <v-label class="mb-2 font-weight-medium">Certificado de Inscripción (Documento)<span style="color:red">*</span></v-label>
                                            <v-file-input
                                                v-model="state.formData.documento_2"
                                                accept="application/pdf"
                                                placeholder="Cargue el documento aqui"
                                                prepend-icon="mdi-paperclip"
                                                color="deep-purple-accent-4"
                                                counter
                                                variant="outlined"
                                                :show-size=true
                                                hide-details
                                                :error="submitButton && state.formData.documento_2.length == 0"
                                                @change="adjuntarArchivo('1'), miValidacion()"
                                            >
                                                <template v-slot:selection="{ fileNames }">
                                                <template v-for="(fileName, index) in fileNames" :key="fileName">
                                                    <v-chip
                                                    v-if="index < 5"
                                                    color="deep-purple-accent-4"
                                                    label
                                                    size="small"
                                                    class="me-2"
                                                    >
                                                    {{ fileName }}
                                                    </v-chip>
                                                </template>
                                                </template>
                                            </v-file-input>
                                            <template v-if="submitButton && state.formData.documento_2.length == 0">
                                                <div class="v-messages font-weight-black ml-3 mt-2">
                                                <div class="v-messages__message text-error">
                                                    El campo es requerido
                                                </div>
                                                </div>
                                            </template>
                                        </v-col>
                                    </template>
                                    <template v-else>
                                        <v-col cols="12" md="6">
                                            Archivo: &nbsp;
                                            <v-btn rounded="xl" color="#F6F7F2" @click="buttonReviewReportPersoneriaJuridica(state.formData.documento_1[0])"
                                                append-icon="mdi-file-pdf-box"
                                                >
                                                Certificado de Personeria Jurídica
                                                <template v-slot:append>
                                                    <v-icon color="error"></v-icon>
                                                </template>
                                            </v-btn>
                                            <!-- <a href="javascript:void(0)" @click="buttonReviewReportPersoneriaJuridica(state.formData.id_usuario)">
                                                Certificado de Personeria Jurídica
                                                <ReportIcon style=" cursor: pointer;"></ReportIcon>
                                            </a> -->
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            Archivo: &nbsp;
                                            <v-btn rounded="xl" color="#F6F7F2" @click="buttonReviewReportCertificadoInscripcion(state.formData.documento_2[0])"
                                                append-icon="mdi-file-pdf-box"
                                                >
                                                Certificado de Inscripción
                                                <template v-slot:append>
                                                    <v-icon color="error"></v-icon>
                                                </template>
                                            </v-btn>
                                            <!-- <a href="javascript:void(0)" @click="buttonReviewReportCertificadoInscripcion(state.formData.id_usuario)">
                                                Certificado de Inscripción
                                                <ReportIcon style=" cursor: pointer;"></ReportIcon>
                                            </a> -->
                                        </v-col>
                                    </template>
                                    <v-col cols="12" md="12">
                                        <h5>DATOS REPRESENTANTE LEGAL</h5>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">
                                            Número de Documento<span style="color:red">*</span>
                                        </v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.cedula_identidad"
                                            @input="miValidacion(), state.formData.cedula_identidad= validateText(state.formData.cedula_identidad)"
                                            :error="submitButton && !state.formData.cedula_identidad"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.cedula_identidad">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Complemento</v-label>
                                        <v-text-field
                                            variant="outlined"
                                            color="primary"
                                            v-model.trim="state.formData.complemento"
                                            @input="state.formData.complemento = validateText(state.formData.complemento)"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Nombres<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.nombres"
                                            @input="miValidacion(), state.formData.nombres= validateText(state.formData.nombres.toUpperCase())"
                                            :error="submitButton && !state.formData.nombres"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.nombres">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Apellido Paterno</v-label>
                                        <v-text-field
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model="state.formData.apellido_paterno"
                                            @input="state.formData.apellido_paterno= validateText(state.formData.apellido_paterno.toUpperCase())"
                                            :readonly="usuarioSistema"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Apellido Materno</v-label>
                                        <v-text-field
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model="state.formData.apellido_materno"
                                            @input="state.formData.apellido_materno= validateText(state.formData.apellido_materno.toUpperCase())"
                                            :readonly="usuarioSistema"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Fecha nacimiento<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="date"
                                            v-model.trim="state.formData.fecha_nacimiento"
                                            @input="miValidacion(), state.formData.fecha_nacimiento= validateText(state.formData.fecha_nacimiento.toUpperCase())"
                                            :error="submitButton && !state.formData.fecha_nacimiento"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.fecha_nacimiento">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Dirección<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.domicilio"
                                            @input="miValidacion(), state.formData.domicilio= validateText(state.formData.domicilio.toUpperCase())"
                                            :error="submitButton && !state.formData.domicilio"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.domicilio">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Cargo<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="text"
                                            v-model.trim="state.formData.cargo"
                                            @input="miValidacion(), state.formData.cargo= validateText(state.formData.cargo.toUpperCase())"
                                            :error="submitButton && !state.formData.cargo"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.cargo">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                            <div class="v-messages__message text-error ">
                                                El campo es requerido
                                            </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-label class="mb-2 font-weight-medium">Celular<span style="color:red">*</span></v-label>
                                        <VTextField
                                            variant="outlined" 
                                            color="primary"
                                            type="number"
                                            v-model.trim="state.formData.celular_persona_empresa"
                                            @input="miValidacion(), state.formData.celular_persona_empresa= validateText(state.formData.celular_persona_empresa.toUpperCase())"
                                            :error="submitButton && !state.formData.celular_persona_empresa"
                                            :readonly="usuarioSistema"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.celular_persona_empresa">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                                <div class="v-messages__message text-error ">
                                                    El campo es requerido
                                                </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <v-col cols="12" md="6"></v-col>
                                    <template v-if="!usuarioSistema">
                                        <v-col cols="12">
                                            <v-label class="mb-2 font-weight-medium">Documento de Acreditación del Representante Legal<span style="color:red">*</span></v-label>
                                            <v-file-input
                                                v-model="state.formData.documento_3"
                                                accept="application/pdf"
                                                placeholder="Cargue el documento aqui"
                                                prepend-icon="mdi-paperclip"
                                                color="deep-purple-accent-4"
                                                counter
                                                variant="outlined"
                                                :show-size=true
                                                hide-details
                                                :error="submitButton && state.formData.documento_3.length == 0"
                                                @change="adjuntarArchivo('2'), miValidacion()"
                                            >
                                                <template v-slot:selection="{ fileNames }">
                                                    <template v-for="(fileName, index) in fileNames" :key="fileName">
                                                        <v-chip
                                                        v-if="index < 5"
                                                        color="deep-purple-accent-4"
                                                        label
                                                        size="small"
                                                        class="me-2"
                                                        >
                                                        {{ fileName }}
                                                        </v-chip>
                                                    </template>
                                                </template>
                                            </v-file-input>
                                            <template v-if="submitButton && state.formData.documento_3.length == 0">
                                                <div class="v-messages font-weight-black ml-3 mt-2">
                                                <div class="v-messages__message text-error">
                                                    El campo es requerido
                                                </div>
                                                </div>
                                            </template>
                                        </v-col>
                                    </template>
                                    <template v-else>
                                        <v-col cols="12" md="6">
                                            Archivo: &nbsp;
                                            <v-btn rounded="xl" color="#F6F7F2" @click="buttonReviewReportRepresentanteLegal(state.formData.documento_3[0])"
                                                append-icon="mdi-file-pdf-box"
                                                >
                                                Documento de Acreditación del Representante Legal
                                                <template v-slot:append>
                                                    <v-icon color="error"></v-icon>
                                                </template>
                                            </v-btn>
                                            <!-- <a href="javascript:void(0)" @click="buttonReviewReportRepresentanteLegal(state.formData.id_usuario)">
                                                Documento de Acreditación del Representante Legal
                                                <ReportIcon style=" cursor: pointer;"></ReportIcon>
                                            </a> -->
                                        </v-col>
                                    </template>
                                    
                                </template>
                                <template v-if="codeSent">
                                    <v-col cols="12" md="6">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Código de confirmación</v-label>
                                        <VTextField
                                            v-model.trim="state.formData.codigo_confirmacion"
                                            variant="outlined"
                                            type="text"
                                            color="primary"
                                            hide-details
                                            @input="state.formData.codigo_confirmacion = validateText(state.formData.codigo_confirmacion.toUpperCase())"
                                            :error="submitButton && !state.formData.codigo_confirmacion"
                                        ></VTextField>
                                        <template v-if="submitButton && !state.formData.codigo_confirmacion">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                                <div class="v-messages__message text-error ">
                                                    El campo es requerido
                                                </div>
                                            </div>
                                        </template>
                                    </v-col>
                                </template>
                            </v-row>
                            <br>
                            <template v-if="!usuarioSistema">
                                <p class="text-lg-center">
                                    <template v-if="!codeSent">
                                        <v-btn color="error" class="mr-3 size_fijo">Volver</v-btn>
                                        <v-btn color="primary" class="size_fijo" @click.prevent="buttonSendCode()">Registrarse</v-btn>
                                    </template>
                                    <template v-else-if="!isLoading">
                                        <!-- <v-btn color="error" class="mr-3 size_fijo">Volver</v-btn> -->
                                        <v-btn color="primary" class="size_fijo" @click.prevent="buttonSendForm()">Enviar código de validacion</v-btn>
                                    </template>
                                    <template v-else>
                                        <v-btn color="primary" class="mr-3 size_fijo" disabled>
                                            <v-progress-circular
                                            indeterminate
                                            color="white"
                                            class="mr-2"
                                            ></v-progress-circular>
                                            Enviando....
                                        </v-btn>
                                    </template>
                                </p>
                            </template>
                            <template v-else>
                                <br>
                                <p class="text-lg-center">
                                    <v-btn color="primary mr-4" class="size_fijo" @click.prevent="buttonSendApplication()">Aprobar Solicitud</v-btn>
                                    <v-btn color="error" class="mr-3 size_fijo" @click.prevent="buttonDeclineApplication()">Observaciones</v-btn>
                                </p>
                                <template v-if="declineApplication">
                                    <v-col cols="12" md="12">
                                        <v-label class="mb-2 font-weight-medium">Observaciones<span style="color:red">*</span></v-label>
                                        <v-textarea
                                            variant="outlined" 
                                            color="primary"
                                            type="string"
                                            rows="3"
                                            v-model.trim="state.formData.observaciones"
                                            @input="miValidacion(), state.formData.observaciones= validateText(state.formData.observaciones.toUpperCase())"
                                            :error="submitButton && !state.formData.observaciones"
                                            hide-details
                                        />
                                        <template v-if="submitButton && !state.formData.observaciones">
                                            <div class="v-messages font-weight-black px-2 py-2">
                                                <div class="v-messages__message text-error ">
                                                    El campo es requerido
                                                </div>
                                            </div>
                                        </template>
                                    </v-col>
                                    <p class="text-lg-center">
                                        <v-btn color="error" class="mr-3 size_fijo" @click.prevent="buttonSendDeclineApplication()">Enviar Observaciones</v-btn>
                                    </p>
                                </template>
                            </template>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
    .registro{
        &::before{
            content: "";
            position: absolute;
            /* height: 200%; */
            width: 100%;
            opacity: 0.3;
            left: 0;
            top: 0;
            bottom: 0;
            /* background: radial-gradient(rgb(210, 241, 223), rgb(211, 215, 250), rgb(186, 216, 244)) 0% 0% / 400% 400%; */
        }
        .auth-header{
            position: absolute;
            top: 0;
            left: 0;    
        }   
        @media screen and (max-width:1280px){
            .auth-header{
                position: unset;
            } 
        }
    }
</style>