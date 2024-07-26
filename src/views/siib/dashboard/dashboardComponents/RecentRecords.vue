<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CircleIcon } from 'vue-tabler-icons'
import { useStatisticsStore } from '@/stores/resources/statistics'

  const statisticsStore = useStatisticsStore()
  let infoLatest = ref(null) as any
  const getLatest = async () => {
    infoLatest.value = await statisticsStore.getLatestRecords()
  }

  onMounted(async () => {
    await getLatest()
  })
</script>
<template>
  <v-card elevation="10" >
    <v-card-item>
      <v-card-title class="text-h5">Solicitudes recientes</v-card-title>
      <div class="recent-transaction mt-10 px-3">
        <template v-if="infoLatest">
          <div v-for="item in infoLatest">
            <v-row class="d-flex mb-4">
              <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
                <h6 class="text-body-1 textSecondary text-no-wrap">{{ item.jurisdiccion }}</h6>
              </v-col>
              <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
                <CircleIcon size="13" :class="'text-warning'" />
              </v-col>
              <v-col cols="7" sm="8" class="pt-0 pb-1">
                <div class="mt-n1">
                  <h6 class="text-body-3 text-primary text-decoration-none">{{ item.nombre_bien }}</h6>
                </div>
                <div class="mt-n1">
                  <h6 class="text-body-3 font-weight-bold text-decoration-none">Registrado por: {{ item.nombre }}</h6>
                </div>
                <div class="mt-n1">
                  <h6 class="text-body-3 text-info font-weight-bold">{{ item.fecha }}</h6>
                </div>
              </v-col>
            </v-row>
          </div>   
        </template> 
      </div>
    </v-card-item>
  </v-card>
</template>
