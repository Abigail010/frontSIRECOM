<script setup lang="ts">
import { getPrimary, getLightPrimary, getSecondary } from '@/utils/UpdateColors';
import { ref, computed, onMounted } from 'vue';
import { useStatisticsStore } from '@/stores/resources/statistics'

const statisticsStore = useStatisticsStore()
let info = ref(null) as any
const getInfo = async () => {
  info.value = await statisticsStore.getTotalJudicialStatus()
}

/* Chart */
const chartOptions = computed(() => {
  return {
    series: [60, 60, 60],
    labels: ["Secuestrado", "Incautado", "Confiscado"],
    chart: {
      height: 120,
      type: "donut",
      foreColor: "#adb0bb",
      fontFamily: "inherit",
    },
    colors: [getPrimary.value, getSecondary.value, "#FFAE1F"],
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      show: false,
      borderColor: "transparent",
      padding: { top: 0, right: 0 },
    },
    stroke: { colors: ["transparent"] },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          background: "transparent",
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: "18px",
              color: undefined,
              offsetY: -10,
            },
            value: { show: false, color: "#98aab4" },
            total: { show: false, label: "Our Visitors", color: "#98aab4" },
          },
        },
      },
    },
    tooltip: { theme: "dark", fillSeriesColor: false },
    responsive: [{ breakpoint: 1025, options: { chart: { height: 185 } } }],
  }
});
const Chart = [10, 20, 30]

onMounted(async () => {
  await getInfo()
})
</script>
<template>
  <v-card elevation="10">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title class="text-h5">Estado judicial</v-card-title>
      </div>
      <v-row>
        <v-col cols="7" sm="7">
          <template v-if="info">
            <div class="mt-6">
              <h3 class="text-h5" style="color: #FFAD37;">Secuestrados: {{ info[0] }}</h3>
              <h3 class="text-h5" style="color: #4BBEFC;">Incautados: {{ info[1] }}</h3>
              <h3 class="text-h5" style="color: #6188FB;">Confiscados: {{ info[2] }}</h3>
            </div>
          </template>
        </v-col>
        <v-col cols="5" sm="5">
          <template v-if="info">
            <div class="d-flex align-center flex-shrink-0">
              <apexchart class="pt-6" type="donut" height="130" :options="chartOptions" :series="info"> </apexchart>
            </div>
          </template>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>