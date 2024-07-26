<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {TrashIcon, SearchIcon, PlusIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useResourceStore } from '@/stores/resource';

import { productsCard } from '@/_mockApis/components/widget/card';
import pictureCapture from './pictureCapture.vue';
import { usePropertyStore } from '@/stores/moduleOne/property';

  const route = useRoute()
  const resourceStore = useResourceStore()
  const propertyStore = usePropertyStore()

  // BREADCRUMB  
  const page = ref({ title: 'Registro de imagenes' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Registro de imagenes',
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
  const id_file = ref<any>('')
  const id_bien = route.params.id_bien
  const id_bien_registro = route.params.id_bien_registro
  const nombre_imagen = ref<any>('')

  // FUNCIONES
  const getImages = async () => {
    const registro = await propertyStore.propertyImages(id_bien_registro)
    state.formData.frente = registro.frente
    state.formData.lateral_izquierdo = registro.lateral_izquierdo
    state.formData.lateral_derecho = registro.lateral_derecho
    state.formData.atras = registro.atras
    state.formData.angulo = registro.angulo
  }

  const openModal = async(imagen: any) =>{
    // id_file.value = id;
    nombre_imagen.value = imagen
    dialog.value = true;
    // console.log(pictureModal.value);
    // await pictureModal.value.showModal(dialog.value);
  }

  const closeModal = (value : any) =>{
    dialog.value = value.dialog
    getImages()
    // id_file.value =value.value
  }

  // BOTON RETORNAR
  const buttonReturnList = () => {
    // router.push({ name: 'documentaryReviewList' })
    router.back()
  }

  onMounted(() => {
    getImages()
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <p>Registre las imagenes segun la instruccion de cada ventana</p>
      </h4>

      <v-row>
        <v-col cols="12" lg="6" sm="6" >
          <v-card elevation="10" rounded="md">
            <div class="text-center py-3">
              <img :src="state.formData.frente" alt="noImage" height="250" v-if="state.formData.frente"/>
              <img src="@/assets/images/misimagenes/noimage1.png" alt="noImage" height="250" v-else/>
            </div>
            <!-- <v-img src="@/assets/images/misimagenes/noimage4.png" height="100%" class="rounded-t-md"></v-img> -->
            <!-- <v-img :src="require('item.avatar')" aspect-ratio="1" height="100%" class="rounded-t-md"></v-img> -->
            <div class="d-flex justify-end mr-3 mt-n3">
              <v-btn size="30" icon variant="flat" class="bg-primary d-flex" @click="openModal('frente')">
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
              <div class="text-center"><h6 class="text-h6" v-text="'IMAGEN FRONTAL'"></h6></div>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" lg="6" sm="6" >
          <v-card elevation="10" rounded="md">
            <div class="text-center py-3">
              <img :src="state.formData.lateral_izquierdo" alt="noImage" height="250" v-if="state.formData.lateral_izquierdo"/>
              <img src="@/assets/images/misimagenes/noimage1.png" alt="noImage" height="250" v-else/>
            </div>
            <div class="d-flex justify-end mr-3 mt-n3">
              <v-btn size="30" icon variant="flat" class="bg-primary d-flex" @click="openModal('lateral_izquierdo')">
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
              <div class="text-center"><h6 class="text-h6" v-text="'LATERAL IZQUIERDO'"></h6></div>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" lg="6" sm="6" >
          <v-card elevation="10" rounded="md">
            <div class="text-center py-3">
              <img :src="state.formData.lateral_derecho" alt="noImage" height="250" v-if="state.formData.lateral_derecho"/>
              <img src="@/assets/images/misimagenes/noimage1.png" alt="noImage" height="250" v-else/>
            </div>
            <!-- <v-img src="@/assets/images/misimagenes/noimage4.png" height="100%" class="rounded-t-md"></v-img> -->
            <!-- <v-img :src="require('item.avatar')" aspect-ratio="1" height="100%" class="rounded-t-md"></v-img> -->
            <div class="d-flex justify-end mr-3 mt-n3">
              <v-btn size="30" icon variant="flat" class="bg-primary d-flex" @click="openModal('lateral_derecho')">
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
              <div class="text-center"><h6 class="text-h6" v-text="'LATERAL DERECHO'"></h6></div>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" lg="6" sm="6" >
          <v-card elevation="10" rounded="md">
            <div class="text-center py-3">
              <img :src="state.formData.atras" alt="noImage" height="250" v-if="state.formData.atras"/>
              <img src="@/assets/images/misimagenes/noimage1.png" alt="noImage" height="250" v-else/>
            </div>
            <!-- <v-img src="@/assets/images/misimagenes/noimage4.png" height="100%" class="rounded-t-md"></v-img> -->
            <!-- <v-img :src="require('item.avatar')" aspect-ratio="1" height="100%" class="rounded-t-md"></v-img> -->
            <div class="d-flex justify-end mr-3 mt-n3">
              <v-btn size="30" icon variant="flat" class="bg-primary d-flex" @click="openModal('atras')">
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
              <div class="text-center"><h6 class="text-h6" v-text="'IMAGEN TRASERA'"></h6></div>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" lg="6" sm="6" >
          <v-card elevation="10" rounded="md">
            <div class="text-center py-3">
              <img :src="state.formData.angulo" alt="noImage" height="250" v-if="state.formData.angulo"/>
              <img src="@/assets/images/misimagenes/noimage1.png" alt="noImage" height="250" v-else/>
            </div>
            <!-- <v-img src="@/assets/images/misimagenes/noimage4.png" height="100%" class="rounded-t-md"></v-img> -->
            <!-- <v-img :src="require('item.avatar')" aspect-ratio="1" height="100%" class="rounded-t-md"></v-img> -->
            <div class="d-flex justify-end mr-3 mt-n3">
              <v-btn size="30" icon variant="flat" class="bg-primary d-flex" @click="openModal('angulo')">
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
              <div class="text-center"><h6 class="text-h6" v-text="'IMAGEN ANGULAR'"></h6></div>
            </v-card-item>
          </v-card>
        </v-col>

      </v-row>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <p class="text-lg-center my-3">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <!-- <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn> -->
      </p>
    </v-col>
  </v-row>

  <!-- <v-row class="my-5">
    <v-btn class="size_fijo" size="small" color="primary" @click="openModal">
      <EyeCheckIcon style=" cursor: pointer;"></EyeCheckIcon> Subir imagen
    </v-btn>
  </v-row> -->

  <picture-capture :id_bien="id_bien" :id_bien_registro="id_bien_registro" :dialog="dialog" :nombre_imagen="nombre_imagen" ref="pictureModal" @dialog-off="closeModal"></picture-capture>
  <!-- <picture-capture></picture-capture> -->
  <!-- <picture-capture :dialog="dialog" ref="pictureModal" @dialog-off="closeModal"></picture-capture> -->
</template>
