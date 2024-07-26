<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { TrashIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { useResourceStore } from '@/stores/resource';
import { useInstanceStore } from '@/stores/moduleOne/instance';
import Swal from 'sweetalert2'
import { lista } from "../instance/region.json";
import viewPdf from '../../resources/viewPdf.vue';
import { productsCard } from '@/_mockApis/components/widget/card';
// import type Camera from "simple-vue-camera";
import pictureCapture from './pictureCapture.vue';
// import Compressor from "compressorjs";

const resourceStore = useResourceStore()
const instanceStore = useInstanceStore()
const route = useRoute()
const page = ref({ title: 'Imagenes Vehículo' });
const id_caso = ref();
const id_bien = ref();
const id_bien_registro = ref();
const docAcreditacionSituacionJuridica = ref(false);
const docInventario = ref(false);
const docCopiaSimple = ref(false);
const docActaEntrega = ref(false);
const docBoletaDepositoOriginal = ref(false);
const docInformeMueblesInoperables = ref(false);
const listaAcreditaciones = ref([]) as any;
const listaInventarios = ref([]) as any;
const listaCopiasSimples = ref([]) as any;
const listaActasEntega = ref([]) as any;
const listaMueblesInoperables = ref([]) as any;
const listaBoletaDeposito = ref([]) as any;
const id_file = ref<any>('');
const dialog = ref<boolean>(false);
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Revisión Documental',
        disabled: true,
        href: '#'
    }
]);
const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    });
const tipoBien = ref('')
const getPropertiesList = async (id:number) => {
    const properties = await resourceStore.getProperties()
    const bien:any = properties.find((val:any) => val.id ===id)
    tipoBien.value = bien.nombre_bien
}
const getDocumentationTypeRequiredList =async (id:number) => {
  const {respuesta} = await instanceStore.getDocumentationTypeRequired(id)
  respuesta.forEach((element:any) => {
    switch (element.nombre_tipo_documentacion) {
    case 'ACREDITACION DE LA SITUACION JURIDICA DEL BIEN SUJETO DE ENTREGA':
      acreditacionSituacionJuridica.acreditacionData.id_tipo_documento = element.id_tipo_documentacion
    break;
    case 'INVENTARIO':
      inventario.inventarioData.id_tipo_documento = element.id_tipo_documentacion
    break;
    case 'COPIA SIMPLE DE MEMORANDUM Y/O CREDENCIAL DEL RESPONSABLE DE LA ENTREGA':
      copiaSimple.copiaSimpleData.id_tipo_documento = element.id_tipo_documentacion
    break;
    case 'ACTA DE ENTREGA':
      actaEntrega.actaEntregaData.id_tipo_documento = element.id_tipo_documentacion
    break; 
    case 'INFORME DE MUEBLES INOPERABLES O DE DIFICIL TRASLADO':
      muebleInoperable.muebleInoperableData.id_tipo_documento = element.id_tipo_documentacion
    break;
    case 'BOLETA DE DEPOSITO ORIGINAL':
      boletaDeposito.boletaDepositoData.id_tipo_documento = element.id_tipo_documentacion
    break; 
    default:
      break;
  }
  });
}
const acreditacionLista = ref([
{
      id: "1",
      nombre_acreditacion: "ACTA DE SECUESTRO",
      nombre_estado_juridico: "SECUESTRADO",
      ejecutoriado: false
},
{
      id: "2",
      nombre_acreditacion: "RESOLUCIÓN DE INCAUTACIÓN",
      nombre_estado_juridico: "INCAUTADO",
      ejecutoriado: false
},
{
      id: "3",
      nombre_acreditacion: "RESOLUCIÓN DE CONFISCACIÓN",
      nombre_estado_juridico: "CONFISCADO",
      ejecutoriado: true
},
{
      id: "4",
      nombre_acreditacion: "RESOLUCIÓN DE PERDIDA DE DOMINIO",
      nombre_estado_juridico: "CONFISCADO",
      ejecutoriado: true
}
]);
// const currentDate = format(new Date(),"yyyy-MM-dd");
const acreditacionSituacionJuridica = reactive({
    acreditacionData: {
      acreditacionValor: [] as any,
      fechaDocumento:'',
      juzgado:'',
      idDepartamento:'',
      idProvincia:'',
      idMunicipio:'',
      fileAcreditacion:[],
      observacionAcreditacion:'',
      id_tipo_documento:''
    },
  });
  const limpiarAcreditacion = () => {
  acreditacionSituacionJuridica.acreditacionData.acreditacionValor = [],
  acreditacionSituacionJuridica.acreditacionData.fechaDocumento='',
  acreditacionSituacionJuridica.acreditacionData.juzgado='',
  acreditacionSituacionJuridica.acreditacionData.idDepartamento='',
  acreditacionSituacionJuridica.acreditacionData.idMunicipio='',
  acreditacionSituacionJuridica.acreditacionData.idProvincia='',
  acreditacionSituacionJuridica.acreditacionData.fileAcreditacion = [],
  acreditacionSituacionJuridica.acreditacionData.observacionAcreditacion=''
  docAcreditacionSituacionJuridica.value=false
}
  const inventario = reactive({
    inventarioData: {
      file_inventario:[],
      observacion_inventario:'',
      id_tipo_documento:''
    },
  });
  const limpiarInventario = () => {
  inventario.inventarioData.file_inventario = [],
  inventario.inventarioData.observacion_inventario = ''
  docInventario.value= false
  }
  const copiaSimple = reactive({
    copiaSimpleData: {
      file_copia_simple:[],
      observacion_copia_simple:'',
      id_tipo_documento:''
    },
  });
  const limpiarCopiaSimple = () => {
  copiaSimple.copiaSimpleData.file_copia_simple = [],
  copiaSimple.copiaSimpleData.observacion_copia_simple = ''
  docCopiaSimple.value= false
  }
  const actaEntrega = reactive({
    actaEntregaData: {
      file_acta_entrega:[],
      observacion_acta_entrega:'',
      id_tipo_documento:''
    },
  });
  const limpiarActaEntrega = () => {
  actaEntrega.actaEntregaData.file_acta_entrega = [],
  actaEntrega.actaEntregaData.observacion_acta_entrega = ''
  docActaEntrega.value= false
  }
  const muebleInoperable = reactive({
    muebleInoperableData: {
      file_mueble_inoperable:[],
      observacion_mueble_inoperable:'',
      id_tipo_documento:''
    },
  });
  const limpiarMuebleInoperable = () => {
  muebleInoperable.muebleInoperableData.file_mueble_inoperable = [],
  muebleInoperable.muebleInoperableData.observacion_mueble_inoperable = ''
  docActaEntrega.value= false
  }
  const boletaDeposito = reactive({
    boletaDepositoData: {
      file_boleta_deposito:[],
      observacion_boleta_deposito:'',
      id_tipo_documento:''
    },
  });
  const limpiarBoletaDeposito = () => {
    boletaDeposito.boletaDepositoData.file_boleta_deposito = [],
    boletaDeposito.boletaDepositoData.observacion_boleta_deposito = ''
   docBoletaDepositoOriginal.value= false
  }

  
  const pictureModal = ref<any>(null)
    const openModal = async() =>{
    // id_file.value = id;
    dialog.value = true;
    await pictureModal.value.showModal(dialog.value);
  }
  

  const observado = async(bien_registro:any, id_caso:any) => {
    console.log('hola desde observado');
  }

 const listaAcreditacion = async (id:number) =>{
  const {data} = await instanceStore.getListAcreditation(id)
  const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion ==="ACREDITACION DE LA SITUACION JURIDICA DEL BIEN SUJETO DE ENTREGA")
  listaAcreditaciones.value=id_nombre
 }
 const listaInventario = async (id:number) =>{
  const {data} = await instanceStore.getListAcreditation(id)
  const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion ==="INVENTARIO")
  listaInventarios.value=id_nombre
 }
 const listaCopiaSimple = async (id:number) =>{
  const {data} = await instanceStore.getListAcreditation(id)
  const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion ==="COPIA SIMPLE DE MEMORANDUM Y/O CREDENCIAL DEL RESPONSABLE DE LA ENTREGA")
  listaCopiasSimples.value=id_nombre
 }
 const listaActaEntrega = async (id:number) =>{
  const {data} = await instanceStore.getListAcreditation(id)
  const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion ==="ACTA DE ENTREGA")
  listaActasEntega.value=id_nombre
 }
 const listaMuebleInoperable = async (id:number) =>{
  const {data} = await instanceStore.getListAcreditation(id)
  const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion ==="INFORME DE MUEBLES INOPERABLES O DE DIFICIL TRASLADO")
  listaMueblesInoperables.value=id_nombre
 }
 const listaBoletoDeposito = async (id:number) =>{
  const {data} = await instanceStore.getListAcreditation(id)
  const id_nombre:any = data.respuesta.filter((val:any) => val.nombre_tipo_documentacion ==="BOLETA DE DEPOSITO ORIGINAL")
  listaBoletaDeposito.value=id_nombre
 }



  const agregarInventario = async() => {
    const response = await instanceStore.uploadInventory({val:inventario.inventarioData, id_caso:id_caso, id_bien_registro:id_bien_registro} )
    Toast.fire({
          icon: 'success',
          title: `${response?.message}`
        })
    await listaInventario(id_bien_registro.value)
    limpiarInventario()
  }
  
  const listaDepartamentos = computed(() => {
    const response  =  lista.filter(tipo => tipo.tipo === 'DEPARTAMENTO' );
    return response
  })
  const listaProvincias = computed(() => {
    const response  =  lista.filter(tipo => tipo.padre === acreditacionSituacionJuridica.acreditacionData.idDepartamento );
    return response
  })
  const listaMunicipios = computed(() => {
    const response  =  lista.filter(tipo => tipo.padre === acreditacionSituacionJuridica.acreditacionData.idProvincia );
    return response
  })
  const focoSiguiente = () =>{
    const date = <HTMLElement>document.getElementById("date-form")
              date.focus()
  }
  const modalViewPdf = ref<any>(null);
  
  
  const closeModal = (value : any) =>{
    dialog.value = value.dialog
    id_file.value =value.value
  }

watch(docAcreditacionSituacionJuridica, (newUsername) => {
   if(!docAcreditacionSituacionJuridica.value){
    limpiarAcreditacion();
   }else{
    //state.formData.observacionAcreditacion=''
   }
});
watch(docInventario, (newUsername) => {
   if(!docInventario.value){
    limpiarInventario()
   }else{
    //state.formData.observacionInventario = ''
   }
});
watch(docCopiaSimple, (newUsername) => {
   if(!docCopiaSimple.value){
    limpiarCopiaSimple()
   }else{
    //state.formData.observacionCopiaSimple=''
   }
});
watch(docActaEntrega, (newUsername) => {
   if(!docActaEntrega.value){
    limpiarActaEntrega()
   }else{
    //state.formData.observacionCopiaSimple=''
   }
});
watch(docInformeMueblesInoperables, (newUsername) => {
   if(!docInformeMueblesInoperables.value){
    limpiarMuebleInoperable()
   }else{
    //state.formData.observacionCopiaSimple=''
   }
});
watch(docBoletaDepositoOriginal, (newUsername) => {
   if(!docBoletaDepositoOriginal.value){
    limpiarBoletaDeposito()
   }else{
    //state.formData.observacionCopiaSimple=''
   }
});

  

  const buttonReturnList = () => {
    router.push({ name: 'documentaryReviewList' })
  }

onMounted(() => {
    // con el ID cargar la data
    getPropertiesList(Number(route.params.id_bien))
    getDocumentationTypeRequiredList(Number(route.params.id_bien))
    listaAcreditacion(Number(route.params.id_bien_registro))
    listaInventario(Number(route.params.id_bien_registro))
    listaCopiaSimple(Number(route.params.id_bien_registro))
    listaActaEntrega(Number(route.params.id_bien_registro))
    listaMuebleInoperable(Number(route.params.id_bien_registro))
    listaBoletoDeposito(Number(route.params.id_bien_registro))
    id_bien.value = route.params.id_bien
    id_bien_registro.value = route.params.id_bien_registro
    id_caso.value = route.params.id_instance
})
</script>

<template>
     <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
     <h4 class="mb-5 mt-2 font-weight-light">
       Los campos con <span style="color:red">*</span> son obligatorios
     </h4>
     

   <!-- INVENTARIO -->
   <div>
    
      <v-row>

        <v-btn class="size_fijo" size="small" color="primary" @click="openModal">
            <EyeCheckIcon style=" cursor: pointer;"></EyeCheckIcon> Subir imagen
          </v-btn>

        <v-col cols="12" md="12">

          

          <v-label class="mb-2 font-weight-medium">Imagen del vehiculo <span style="color:red">*</span></v-label>

          

          <v-file-input
                v-model="inventario.inventarioData.file_inventario"
                color="deep-purple-accent-4"
                counter
                accept="application/pdf"
                placeholder="Select your files"
                prepend-icon="mdi-paperclip"
                variant="outlined"
                :show-size="1000"
                >
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 2"
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
        </v-col>

        <camera
          :resolution="{ width: 400, height: 400 }"
          autoplay
          ref="camera"
        ></camera>

        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Descripcion corta imagen</v-label>
          <v-textarea
            rows="1"
            auto-grow
            v-model="inventario.inventarioData.observacion_inventario"
            @input="inventario.inventarioData.observacion_inventario = inventario.inventarioData.observacion_inventario.toUpperCase()"
          >
          </v-textarea>
        </v-col>
      </v-row>
    <div class="d-flex justify-end mt-5 mb-5">
      <v-btn color="secondary" @click="agregarInventario()"><PlusIcon/>Agregar {{docInventario?'Documento Inventario':'Observación Inventario'}}</v-btn>
    </div>

    <!-- <v-row class="pt-3">
      <v-col cols="12" md="6">
        <v-card elevation="10"  rounded="md" class="card-hover text-justify" >
          <v-card-item>
            <v-container>
              <p class="mt-3">
                <strong>CASO</strong>
              </p>
              <p>
                <strong>File : </strong> a
              </p>
              <p>
                <strong>Caso FELCN/FELCC : </strong> b
              </p>
              <p>
                <strong>Nombre clave del caso : </strong> c
              </p>
              <p>
                <strong>Jurisdicción del caso : </strong> d
              </p>
              <p>
                <strong>Observaciones : </strong> e
              </p>
            </v-container>
          </v-card-item>
          <v-divider class="mt-2"></v-divider>
          <div class="d-flex justify-center align-center flex-column flex-sm-row fill-height pa-1">
            <v-btn class="size_fijo" size="small" color="primary">
              <ClipboardListIcon style=" cursor: pointer;"></ClipboardListIcon>Ver
            </v-btn>
            <v-btn class="size_fijo" size="small" color="secondary">
              <UsersIcon style=" cursor: pointer;"></UsersIcon>Borrar
            </v-btn>
            <v-btn class="size_fijo" size="small" color="success">
              <FileDollarIcon style=" cursor: pointer;"></FileDollarIcon>Portada
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row> -->

    <v-row>
      <v-col cols="12" lg="3" sm="6" v-for="card in productsCard" :key="card.title">
          <v-card elevation="10"  rounded="md">
              <RouterLink :to="card.link">
                  <v-img :src="card.photo" height="100%" class="rounded-t-md"></v-img>
              </RouterLink>
              <div class="d-flex justify-end mr-3 mt-n3">
                  <v-btn size="30" icon variant="flat" class="bg-primary d-flex">
                      <v-avatar size="30" class="text-white">
                          <BasketIcon size="17" />
                      </v-avatar>
                      <v-tooltip
                          activator="parent"
                          location="bottom"
                      >Add To Cart
                      </v-tooltip>
                  </v-btn>
              </div>
              <v-card-item class="pt-0">
                  <h6 class="text-h6" v-text="card.title"></h6>
                  <div class="d-flex align-center justify-space-between mt-1">
                      <div>
                          <span class="text-h6" v-text="'$'+ card.price"></span>
                          <span class="text-body-1 ml-2 text-medium-emphasis text-decoration-line-through" v-text="'$'+ card.salesPrice"></span>
                      </div>
                      <v-rating density="compact" color="warning" size="small" v-model="card.rating" readonly></v-rating>
                  </div>
              </v-card-item>
          </v-card>
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col  v-if="listaInventarios.length>0" cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">Nro</th>
               <th class="text-center">Observaciones</th>
               <th class="text-center">Archivo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in listaInventarios"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.observaciones?item.observaciones:'SIN OBSERVACIONES' }} </td>
              <td class="text-center"><v-btn density="compact" icon="mdi-eye" @click="openModal(item.id)"><v-icon color="success"></v-icon></v-btn></td>
              
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row> -->
   </div> 

   <picture-capture :dialog="dialog" ref="pictureModal" @dialog-off="closeModal"></picture-capture>

  <p class="text-lg-right pt-3">
    <v-btn color="error" class="mr-3 size_fijo" @click="buttonReturnList()">Volver</v-btn>
  </p>

  

</template>

<style>
.size_fijo{
min-width: 150px;
text-align:center;
margin: 1px;

}</style>