<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { router } from '@/router';
import Camera from "simple-vue-camera";
import Compressor from "compressorjs";
// import VuePdfEmbed from 'vue-pdf-embed'
import { useInstanceStore } from '@/stores/moduleOne/instance';
import { usePropertyStore } from '@/stores/moduleOne/property';
  const instanceStore = useInstanceStore()
  const propertyStore = usePropertyStore()

  // STATE
  const formData: any = reactive(
    {
      id_bien: '',
      id_bien_registro: '',
      nombre_imagen: '',
      picture: '',
    }
  );

  // VARIABLES
  // const dialog = ref(false)
  
  const props = defineProps(['dialog', 'id_bien', 'id_bien_registro', 'nombre_imagen'])
  // console.log(props);
  const emit = defineEmits(['dialog-off']);
  const isOpenClose = ref<boolean>(false)
  const with_camera = ref<boolean>(true)
  const devicesList = ref<any>([]);
  const deviceSelected = ref<string>("")
  const camera = ref<InstanceType<typeof Camera>>();
  const cameraFrontal = ref(false);
  const capturaCamara = ref<any>(null)
  const deg = ref(0);

  // FUNCIONES
  const showModal = async (dialog: boolean) => {
    // console.log('showModal');
    isOpenClose.value = dialog;
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const res = devices.some((arrVal) => arrVal.kind === "videoinput");
      res ? (with_camera.value = true) : (with_camera.value = false);
    }
    // console.log('abre modal', formData);
  }

  const OpenCloseModal = () => {
    // console.log('OpenCloseModal');
    isOpenClose.value = false
    formData.picture = ''
    devicesList.value = []
    console.log('cierra modal', formData);
  }

  const clearData = () => {
    formData.picture = ''
    formData.id_bien = ''
    formData.id_bien_registro = ''
    formData.nombre_imagen = ''
    capturaCamara.value = null
  }

  const chooseDevice = (device: string) => {
    // console.log('chooseDevice');
    // camera.value?.changeCamera(device);
  }

  const rotation = () => {
    // console.log('rotation');
    deg.value += 90;
  }

  const uploadResolution = (val: any) => {
    // console.log('uploadResolution', val);
    document.getElementById(val)?.click();
  }

  const onFileChange = (e: any) => {
    // console.log('onFileChange');
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    new Compressor(files[0], {
      quality: 0.6,
      convertSize: 3000000,
      success(result) {
        // formData.picture = result
        createImage(result);
      },
    });
  }

  const createImage = (file:any) => {
    // console.log('ingresa a createimage');
    let img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (img.width <= 300 && img.height <= 300) {
        // console.log('es menor a 300');
        //alert(`Nice, image is the right size. It can be uploaded`);
        formData.picture = new Image();
        var reader = new FileReader();
        reader.onload = (e) => {
          // console.log('e',e);
          // IMAGEN CAPTURADA Y ALMACENADA EN VARIABLE SOLO PARA VISUALIZACION
          capturaCamara.value = e.target?.result
          // AQUI CONVERTIR ESTE VALOR A FILE
          // console.log(img.src);
          const extension = file.type.split('/').pop()
          const archivo = new File([file], new Date().getTime()+'-'+props.nombre_imagen+'.'+extension, {
            type: file.type,
          });
          formData.picture = archivo


          // formData.picture = e.target?.result;
          // console.log('form picture', formData.picture);
        };
        reader.readAsDataURL(file);
      } else {
        // console.log('mayor');
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 300; // Set the desired width
        canvas.height = 300; // Set the desired height
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        // console.log('filetipe', file.type, canvas.toDataURL(file.type));
        capturaCamara.value = canvas.toDataURL(file.type)
        // console.log(capturaCamara.value);
        
        const extension = file.type.split('/').pop()
        const archivo = new File([file], new Date().getTime()+'-'+props.nombre_imagen+'.'+extension, {
          type: file.type,
        });
        formData.picture = archivo


        return capturaCamara.value
      }
      // img.src = URL.createObjectURL(file);
    };
  };

  const openCamera = () => {
    console.log('openCamera');
    cameraFrontal.value = !cameraFrontal.value;
    setTimeout(async () => {
      devicesList.value = await camera.value?.devices(["videoinput"]);
    }, 100);
  }

  const snapshot = async () => {
    console.log('snapshot');
    const blob: any = await camera.value?.snapshot();
    const extension = blob.type.split('/').pop()
    // To show the screenshot with an image tag, create a url
    // const url = URL.createObjectURL(blob);
    // console.log(url);
    const file = new File([blob], new Date().getTime()+'-'+props.nombre_imagen+'.'+extension, {
      type: blob.type,
    });
    formData.picture = file

    const res: any = await convertBlobToBase64(blob);
    capturaCamara.value = res
    camera.value?.stop()
  }

  const convertBlobToBase64 = async (blob:any) => {
    return await blobToBase64(blob);
  };

  const blobToBase64 = (blob: any) => new Promise ((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  })

  const deletesnapshot = () => {
    // console.log('deletesnapshot');
    formData.picture = ''
    capturaCamara.value = null
  }

  const saveImage = async () => {
    // console.log('saveImage');
    formData.id_bien = props.id_bien
    formData.id_bien_registro = props.id_bien_registro
    formData.nombre_imagen = props.nombre_imagen
    // console.log(capturaCamara.value);
    // console.log(formData);
    // emit("saveImage", formData.picture);
    const result = await propertyStore.uploadPropertyImage(formData)

    capturaCamara.value = ''
    formData.picture = ''

    emit('dialog-off', { dialog : false, value : '' })
  
  }

  const rotateImage = async () => {
    console.log('rotateImage');
    const img = new Image();
    img.src = capturaCamara.value;
    // img.src = formData.picture;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const { width, height } = img;

      // Set canvas dimensions based on image dimensions
      canvas.width = height;
      canvas.height = width;

      // Rotate image 90 degrees
      ctx?.translate(canvas.width / 2, canvas.height / 2);
      ctx?.rotate((90 * Math.PI) / 180);
      ctx?.drawImage(img, -width / 2, -height / 2);

      // Convert rotated image back to base64 format
      // return (formData.picture = canvas.toDataURL());
      // console.log(canvas.toDataURL());
      setTimeout(async () => {
        capturaCamara.value = canvas.toDataURL()
      }, 100);
    //  capturaCamara.value = canvas.toDataURL().set;
    //  console.log(capturaCamara.value);
    };
  }

</script>
<template>
  <div class="text-center">
    <v-dialog
        v-model="props.dialog"
        activator="parent"
        width="auto"
      >

        <v-card>
          <v-card-title>
            <h4>{{ with_camera ? "Capturar o Cargar" : "Cargar" }} Foto 
              <v-btn icon="close" @click="emit('dialog-off', {dialog:false, value:''}), clearData()">x</v-btn>
            </h4> 
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-row class="my-3" v-if="!capturaCamara && cameraFrontal">
              <v-col cols="12">
                <v-label class="mb-2 font-weight-medium">
                  Dispositivos disponibles:
                </v-label>
                <v-select
                  v-model="deviceSelected"
                  item-title="label"
                  item-value="deviceId"
                  @update:model-value="chooseDevice(deviceSelected)"
                >
                </v-select>
                <Camera
                  :resolution="{ width: 400, height: 400 }"
                  autoplay
                  ref="camera"
                ></Camera>
              </v-col>
            </v-row>

            <v-img
              v-else-if="capturaCamara"
              :src="capturaCamara"
              :width="300"
              aspect-ratio="16/9"
              cover
              @click="rotation"
              :style="{ transform: `rotate(${deg}deg)` }"
            ></v-img>
              
            <v-img
              v-else
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              :width="300"
              aspect-ratio="16/9"
              alt="no-picture"
              cover
            ></v-img>

          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <div v-if="!formData.picture">
              <v-btn color="primary" @click="uploadResolution('picture')" v-if="!cameraFrontal">CARGAR</v-btn>
              <input
                id="picture"
                type="file"
                ref="file"
                @change="onFileChange"
                accept="image/*"
                hidden
              />
              <!-- <template v-if="with_camera">
                <v-btn color="primary" @click="openCamera()" v-if="!cameraFrontal">ABRIR</v-btn>
                <v-btn color="primary" @click="openCamera()" v-else>CERRAR</v-btn>
                <v-btn color="primary" @click="snapshot()" v-if="cameraFrontal">TOMAR FOTO</v-btn>
              </template> -->
            </div>
            <div v-else>
              <v-btn color="warning" @click="deletesnapshot()">BORRAR</v-btn>
              <!-- <v-btn color="warning" @click="rotateImage()">ROTAR</v-btn> -->
            </div>
            
            <v-btn color="primary" v-if="formData.picture" @click="saveImage()">GUARDAR</v-btn>

            <!-- <v-btn color="primary" block @click="dialog = false">CERRAR MODAL</v-btn> -->
          </v-card-actions>
        </v-card>

      </v-dialog>
  </div>
</template>