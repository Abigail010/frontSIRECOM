<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { CloudUploadIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import pictureCapture from './pictureCapture.vue';
import { useAircraftStore } from '@/stores/moduleOne/aircraft'
import Swal from 'sweetalert2'

  const route = useRoute()
  
  const aircraftStore = useAircraftStore()

  // BREADCRUMB  
  const page = ref({ title: 'Registro de imagenes' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Registro de imagenes de Aeronaves',
      disabled: true,
      href: '#'
    }
  ]);  

  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id_caso: '',
      frente: '',
      lateral_izquierdo: '',
      lateral_derecho: '',
      atras: '',
      angulo: '',
    }
  });

  // VARIABLES
  const dialog = ref<boolean>(false);
  const pictureModal = ref<any>(null)
  const id_bien = route.params.id_bien
  const id_bien_registro = route.params.id_bien_registro
  const nombre_imagen = ref<any>('')

  // FUNCIONES
  const imagenes = ref([]) as any
  const getImages = async () => {
    // const result = await immovablePropertyStore.immovablePropertyImages(id_bien_registro)
    // const result = await immovablePropertyStore.immovablePropertyImages(id_bien_registro)
    const result = await aircraftStore.aircraftImages(id_bien_registro)

    // PROCEDIMIENTO PARA EXTRAER LA IMAGEN DEL PANEL DEL LISTADO DE IMAGENES
    const panel = result.find( (registro:any) => registro.nombre_imagen.includes('panel') )
    if(panel){
      state.formData.frente = panel.url
    }

    // PROCEDIMIENTO PARA FILTRAR LAS IMAGENES QUE SE MOSTRARAN EN LISTADO MENOS LA DE PANEL
    imagenes.value = result.filter( (registro:any) => !registro.nombre_imagen.includes('panel') )
    // console.log('resyltado',result);
    // const registro = await propertyStore.propertyImages(id_bien_registro)
    // state.formData.frente = registro.frente
    // state.formData.lateral_izquierdo = registro.lateral_izquierdo
    // state.formData.lateral_derecho = registro.lateral_derecho
    // state.formData.atras = registro.atras
    // state.formData.angulo = registro.angulo
  }

  const openModal = async(imagen: any) =>{
    nombre_imagen.value = imagen
    dialog.value = true;
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
    getImages()
  }

  // BOTON RETORNAR
  const buttonReturnList = () => {
    router.back()
  }

  onMounted(() => {
    getImages()
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-row>
    <v-col cols="12" lg="12" sm="12" >
      <v-card elevation="10" rounded="md">
        <div class="text-center py-3">
          <img :src="state.formData.frente" alt="noImage" height="300" v-if="state.formData.frente"/>
          <img src="@/assets/images/misimagenes/noimage1.png" alt="noImage" height="250" v-else/>
        </div>
        <div class="d-flex justify-end mr-3 mt-n3">
          <v-btn size="30" icon variant="flat" class="bg-primary d-flex" @click="openModal('panel')">
          <v-avatar size="30" class="text-white">
            <BasketIcon size="20" />
          </v-avatar>
          <v-tooltip
            activator="parent"
            location="bottom"
          >SUBIR IMAGEN
          </v-tooltip>
          </v-btn>
        </div>
        <v-card-item class="pt-0">
          <div class="text-center"><h6 class="text-h6" v-text="'PANEL DE INSTRUMENTOS'"></h6></div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>


  <v-row>
    <v-col cols="12" lg="12">
      <v-row class="mb-5">
        <v-col cols="12">
          <v-btn class="bg-primary" @click="openModal('aeronave')" block>
            <CloudUploadIcon class="mx-2"></CloudUploadIcon> Subir mas imagenes
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="imagenes.length > 0">
        <v-col cols="12" lg="6" sm="6" v-for="(imagen, index) in imagenes">
          <v-card elevation="10" rounded="md">
            <div class="text-center py-3">
              <img 
                :src="imagen.url"
                alt="noImage"
                height="300"
                width="300"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>


  <v-row>
    <v-col>
      <p class="text-lg-center my-3">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
      </p>
    </v-col>
  </v-row>

  <picture-capture :id_bien="id_bien" :id_bien_registro="id_bien_registro" :dialog="dialog" :nombre_imagen="nombre_imagen" ref="pictureModal" @dialog-off="closeModal"></picture-capture>
</template>