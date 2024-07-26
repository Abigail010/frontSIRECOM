<script setup lang="ts">
import { ref, reactive } from 'vue';
import Camera from "simple-vue-camera";
import Compressor from "compressorjs";

  // STATE
  const formData: any = reactive(
    {
      id_bien: '',
      id_bien_registro: '',
      nombre_imagen: '',
      picture: '',
    }
  );

  const props = defineProps(['dialog', 'id_bien', 'id_bien_registro', 'nombre_imagen'])
  // console.log(props);
  const emit = defineEmits(['dialog-off', 'return-image']);
  const with_camera = ref<boolean>(true)
  const devicesList = ref<any>([]);
  const deviceSelected = ref<string>("")
  const camera = ref<InstanceType<typeof Camera>>();
  const cameraFrontal = ref(false);
  const capturaCamara = ref<any>(null)
  const deg = ref(0);

  // FUNCIONES

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
    // console.log('ingresa a createimage', file);
    let img = new Image();
    // console.log('img',img);
    img.src = window.URL.createObjectURL(file);
    // console.log('imgSrc', img.src);
    img.onload = () => {
      if (img.width <= 300 && img.height <= 300) {
        // console.log('resolucion menor o igual a 300');
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
          // console.log('extension',extension);
          const archivo = new File([file], new Date().getTime()+'-'+props.nombre_imagen+'.'+extension, {
            type: file.type,
          });
          // console.log('filetype:', file.type);
          formData.picture = archivo
          // console.log('archivo:',archivo);
          // formData.picture = e.target?.result;
          // console.log('form picture', formData.picture);
        };
        reader.readAsDataURL(file);
      } else {
        // console.log('resolucion mayor a 300', img.width, img.height);
        img.width = 300
        img.height = 300
        // console.log('ahora', img.width, img.height);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 300; // Set the desired width
        canvas.height = 300; // Set the desired height

        // console.log(canvas);

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        // console.log('filetipe', file.type, canvas.toDataURL(file.type));
        capturaCamara.value = canvas.toDataURL(file.type)
        // console.log('canvas_',capturaCamara.value);
        // console.log('formdata_',formData.picture);

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
    formData.picture = ''
    capturaCamara.value = null
  }

  const saveImage = async () => {
    // console.log('saveImage');
    formData.id_bien = props.id_bien
    formData.id_bien_registro = props.id_bien_registro
    formData.nombre_imagen = props.nombre_imagen
    formData.imagenBase64 = capturaCamara.value
    // const result = await controlledSubstanceStore.uploadControlledSubstanceImage(formData)
    emit('return-image', { respuesta: formData })
    capturaCamara.value = ''
    formData.picture = ''
    emit('dialog-off', { dialog : false, value : '' })
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
              <v-btn icon="close" @click="emit('dialog-off', { dialog: false, value: '' }), clearData()">x</v-btn>
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
              src="../../../src/assets/images/iconos/cloud.png"
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
            </div>
            <div v-else>
              <v-btn color="warning" @click="deletesnapshot()">BORRAR</v-btn>
            </div>
            <v-btn color="primary" v-if="formData.picture" @click="saveImage()">AGREGAR</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
  </div>
</template>