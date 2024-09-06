<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PointIcon } from 'vue-tabler-icons';
import { useStatisticsStore } from "@/stores/resources/statistics";

const statisticsStore = useStatisticsStore()
const nombres = JSON.parse(localStorage.getItem('user') || '').nombres;
const apellido_paterno = JSON.parse(localStorage.getItem('user') || '').apellido_paterno;
const apellido_materno = JSON.parse(localStorage.getItem('user') || '').apellido_materno;
const imagen = JSON.parse(localStorage.getItem('user') || '').imagen;

const infoCases = ref({}) as any;
const infoProperty = ref([]) as any;

const getInfo = async () => {
  infoCases.value = await statisticsStore.getCaseRecords()
}
const getInfoProperty = async () => {
  infoProperty.value = await statisticsStore.getPropertyRecords()
  console.log(infoProperty.value);
}

onMounted(async () => {
  await getInfo(),
  await getInfoProperty()
})
</script>

<template>
  <v-card elevation="0" rounded="md" class="bg-lightprimary border-0">
    <v-card-item class="pt-3 pb-0">
      <v-row>
        <v-col cols="12" sm="5" class="pt-sm-10 pt-5">
          <div class="d-flex aling-center">
            <v-avatar size="40">
              <img :src="imagen" height="40" alt="icon" />
            </v-avatar>
            <h5 class="text-h5 ml-4">Bienvenid@: <br> {{ nombres }} {{ apellido_paterno }} {{ apellido_materno }}</h5>
          </div>
          <div class="mt-8">
            <div class="d-flex">
              <div>
                <div class="d-flex">
                  <div class="mt-1 ml-1">
                    <PointIcon stroke-width="1.5" size="22" class="text-success" />
                  </div>
                  <h2 class="text-h2 textPrimary">{{ infoCases }}</h2>
                </div>
                <div class="text-subtitle-1 textPrimary mt-1">Total Casos</div>
              </div>
              <v-divider vertical class="mx-5"></v-divider>
              <div>
                <div class="d-flex">
                  <div class="mt-1 ml-1">
                    <PointIcon stroke-width="1.5" size="22" class="text-success" />
                  </div>
                  <h2 class="text-h2 textPrimary">{{ infoProperty }}</h2>
                </div>
                <div class="text-subtitle-1 textPrimary mt-1">Total Bienes</div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="7" class="text-sm-right">
          <div class="mb-n2">
            <img src="@/assets/images/backgrounds/welcome-bg.svg" class="" alt="image" width="290" />
          </div>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>
