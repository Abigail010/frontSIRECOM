<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { computed } from 'vue';
import { getPrimary } from '@/utils/UpdateColors';
import { useStatisticsStore } from '@/stores/resources/statistics'

  const statisticsStore = useStatisticsStore()
  let infoByDep = ref(null) as any
  const getInfoByDep = async () => {
    infoByDep.value = await statisticsStore.getRecordsByDepartament()
  }

  onMounted(async () => {
    await getInfoByDep()
  })

  const chartOptions = computed(() => {
    return {
      chart: {
        type: 'bar',
        height: 350,
        fontFamily: `inherit`,
        toolbar: {
          show: false,
        },
      },
      colors: [getPrimary.value],
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: 'rounded',
          columnWidth: '20%'
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },

      xaxis: {
        categories: ['BE', 'CH', 'CB', 'LP', 'OR', 'PD', 'PT', 'SC', 'TJ']
      },
      yaxis: {
        title: {
          text: 'Cantidad de Bienes',
        },
      },
      fill: {
        opacity: 1
      },
      
      tooltip: {
        theme: 'dark',
        y: {
          formatter(val:any) {
            return ` ${val} - BIENES`;
          },
        },
      },
      grid: {
        show: true,
      },
      legend: {
        show: true,
        position: 'bottom',
        width: '50px',
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            yaxis: {
              show: false
            }
          }
        }
      ]
    };
  });

  const columnChart = {
    series: [
      {
        name: 'Cantidad',
        data: [44, 30, 57, 56, 40, 58, 10, 80, 20]
      }
    ]
  };
</script>
<template>
  <v-card elevation="10" >
    <v-card-item>
      <v-card-title class="text-h5">Bienes Registrados por Departamento</v-card-title>
      <v-card-subtitle class="text-subtitle-1 textSecondary">Referencia de Bienes registrados en cada departamento</v-card-subtitle>
      <div class="d-flex align-center mt-6">
        <h6 class="text-subtitle-2 textSecondary d-flex align-center">
          <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-2" size="10" color="error"></v-icon> No se toma en cuenta los registros no aprobados
        </h6>
      </div>
      <template v-if="infoByDep">
        <apexchart type="bar" height="330" :options="chartOptions" :series="infoByDep.series"> </apexchart>
      </template>
    </v-card-item>
</v-card>
</template>


<style type="text/css">

</style>