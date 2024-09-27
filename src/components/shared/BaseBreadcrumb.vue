<script setup >

const props = defineProps({
    title: String,
    breadcrumbs: Array ,
    icon: String,
    text: String
});


</script>

<template>
    <v-card class="bg-lightprimary elevation-0 rounded-md mb-8">
        <div class="px-8 py-8 py-lg-0">
            <div class="d-flex justify-space-between">
                <div class="d-flex py-0 align-center">
                    <div>
                        <h3 class="text-h3 mb-2">{{ title }}</h3>
                        <v-breadcrumbs :items="breadcrumbs" class="text-h6 font-weight-medium pa-0 ml-n1">
                                <template v-slot:divider>
                                    <div class="d-flex align-center text-h3 mt-n4">.</div>
                                </template>
                                <template v-slot:title="{ item }">
                                    <h6 class=" text-subtitle-1">{{ item.text }}</h6>
                                </template>
                            </v-breadcrumbs>
                       
                    </div>
                </div>
                <div class="d-none py-0 d-lg-block overflow-hidden">
                    <div class="mb-n16 mt-3 image-container">
                        <img src="@/assets/images/breadcrumb/probar.png" class="breadcrumb-image"  />

                      <!----- <img src="@/assets/images/misimagenes/emailSv.png" style="width: 30%; height: 100%;"  alt="breadcrumb" />-->
                    </div>
                </div>
            </div>
        </div>
    </v-card>
</template>

<style lang="scss">
.page-breadcrumb {
    .v-toolbar {
        background: transparent;
    }
}


.image-container {
  display: flex;
  justify-content: center; /* Centrar la imagen horizontalmente */
  align-items: center;     /* Centrar la imagen verticalmente */
  width: 100%;             /* Asegurar que ocupe todo el ancho disponible */
  height: 100%;            /* Asegurar que ocupe todo el alto disponible */
  overflow: hidden;        /* Evitar que la imagen se desborde */
}

.breadcrumb-image {
  max-width: 30%;         /* Asegurar que la imagen no se haga más grande que su contenedor */
  max-height: 1000%;        /* Limitar la altura para que no se desborde */
  width: auto;             /* Ajusta el ancho automáticamente */
  height: auto;            /* Ajusta la altura automáticamente */
  object-fit: contain;     /* Mantiene la imagen completa dentro del contenedor */
}



</style>
