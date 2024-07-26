<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPrimary, getSecondary } from '@/utils/UpdateColors';
import { CalendarTimeIcon } from 'vue-tabler-icons';
import { useStatisticsStore } from '@/stores/resources/statistics'

  const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil


  const statisticsStore = useStatisticsStore()
  let infoByYear = ref(null) as any
  const getByYear = async () => {
    infoByYear.value = await statisticsStore.getRecordsByYear()
  }

  onMounted(async () => {
    await getByYear()
  })

  const chartOptions = computed(() => {
    return {
      chart: {
        type: 'area',
        height: 300,
        fontFamily: `inherit`,
        foreColor: '#adb0bb',
        zoom: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      colors: [getPrimary.value,getSecondary.value],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: '3',
        curve: 'smooth'
      },
      xaxis: {
        type: 'month',
        categories: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ]
      },
      yaxis: {
        opposite: false,
        labels: {
          show: true
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        width: '50px'
      },
      grid: {
        show: false
      },
      tooltip: {
        theme: 'dark',
      }
    };
  });

  const areaChart = {
    series: [
      {
        name: 'Aprobadas',
        data: [31, 40, 28, 51, 42, 109, 100, 31, 40, 28, 51, 42]
      },
      {
        name: 'Observadas',
        data: [11, 32, 45, 32, 34, 52, 41, 31, 42, 25, 57, 40]
      }
    ]
  };
</script>
<template>
  <v-card elevation="10" class="mt-6" >
    <v-card-item class="">
      <div class="d-flex align-center justify-space-between">
        <v-card-title class="text-h5">Registros de la presente gestión</v-card-title>
        <v-avatar class="rounded-md bg-lightprimary text-primary">
          <img src="@/assets/images/svgs/icon-master-card-2.svg" alt="ico"/>
        </v-avatar>
      </div>
      <div class="mb-sm-16 mb-8 d-flex align-center">
        <div class="d-flex align-center">
          <v-avatar class="bg-lightsuccess text-success" size="20">
            <CalendarTimeIcon size="18" />
          </v-avatar>
        </div>
        <h4 class="ml-2 text-h4 font-weight-bold">{{ new Date().getFullYear() }}</h4>
        
      </div>
    </v-card-item>
    <div class="pt-2" v-if="infoByYear">
      <apexchart type="area" height="300" :options="chartOptions" :series="infoByYear.series"> </apexchart>
    </div>
  </v-card>
</template>
