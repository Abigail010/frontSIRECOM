<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { PointIcon } from 'vue-tabler-icons';
import { useStatisticsStore } from "@/stores/resources/statistics";
import { getPrimary, getSecondary } from '@/utils/UpdateColors';
import type { topCards } from '@/types/components/dashboard/modernDashboard';
import { CalendarTimeIcon } from 'vue-tabler-icons';
import card_icon6 from "@/assets/images/svgs/icon-connect.svg"

const nombres = JSON.parse(localStorage.getItem('user') || '').nombres;
const apellido_paterno = JSON.parse(localStorage.getItem('user') || '').apellido_paterno;
const apellido_materno = JSON.parse(localStorage.getItem('user') || '').apellido_materno;
const imagen = JSON.parse(localStorage.getItem('user') || '').imagen;
const oficina = JSON.parse(localStorage.getItem('user') || '').nombre_oficina;

const statisticsStore = useStatisticsStore()

/*WELCOME*/
const infoCases = ref({}) as any;
const infoProperty = ref([]) as any;
const getInfo = async () => {
  infoCases.value = await statisticsStore.getCaseRecords()
  console.log(infoCases.value);
}
const getInfoProperty = async () => {
  infoProperty.value = await statisticsStore.getPropertyRecords()
  console.log(infoProperty.value);
}
/*ESTADO JUDICIAL*/
let infoJudicial = ref(null) as any
const getInfoJudicial = async () => {
  infoJudicial.value = await statisticsStore.getTotalJudicialStatus()
  console.log(infoJudicial.value);
}

/*chartJudicial*/
const chartJudicialOptions = computed(() => {
  return {
    labels: ['Secuestrado', 'Incautado', 'Confiscado'],
    chart: {
      type: 'donut',
      height: 130,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      toolbar: {
        show: false
      }
    },
    colors: [getPrimary.value, getSecondary.value, '#FFAE1F'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent'
        },
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
      }
    },
    stroke: {
      colors: ["transparent"]
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            height: 140
          }
        }
      },
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 130
          }
        }
      }
    ]
  };
});
const judicialChart = [38, 40, 25];
/*chartDepositos*/
const topCardsData: topCards[] = [
  {
    img: card_icon6,
    title: "Depositos",
    number: "96",
    bgcolor: "lightprimary",
    textcolor: "primary",
  },]

/*chartRegistroAnual*/
const chartAnualOptions = computed(() => {
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

  const areaAnualChart = {
    series: [
      {
        name: 'Aprobadas',
        data: [31, 40, 28, 51, 42, 109, 100, 31, 40, 28, 51, 42]
      }
    ]
  };

/*chartRegistrosRecientes*/
const recentTransaction  : recentTrans[] = [
    {
        title:'20/03/2024',
        subtitle:'AUTOMOVIL',
        textcolor:'',
        subtitle2:'SANTA CRUZ',
        boldtext:false,
        line:true,
        link:'EDGAR ALPIRE',
        url:''
      },
      {
        title:'16/04/2024',
        subtitle:'BOTE',
        subtitle2:'SANTA CRUZ',
        textcolor:'secondary',
        boldtext:true,
        line:true,
        link:'EDGAR ALPIRE',
        url:''
      },
      {
        title:'15/04/2024',
        subtitle:'ARROZ',
        subtitle2:'ORURO',
        textcolor:'success',
        boldtext:false,
        line:true,
        link:'JOSE LUIS HUARACHI',
        url:''
      },
      {
        title:'22/05/2024',
        subtitle:'CAMION',
        subtitle2:'LA PAZ',
        textcolor:'warning',
        boldtext:true,
        line:true,
        link:'JOSE LUIS VILA',
        url:''
      },
      {
        title:'23/05/2024',
        subtitle:'GANADO',
        subtitle2:'BENI',
        textcolor:'error',
        boldtext:true,
        line:true,
        link:'MARIA NELLY VELARDE',
        url:''
      },
      {
        title:'01/06/2024',
        subtitle:'AUTOMOVIL',
        subtitle2:'TARIJA',
        textcolor:'success',
        boldtext:false,
        line:false,
        link:'MIRIAM',
        url:''
      },
]

/* ChartPorDepartamento */
const chartDepOptions = computed(() => {
    return {
        chart: {
            height: 275,
            type: 'bar',
            fontFamily: `inherit`,
            toolbar: {
                show: false
            }
        },
        colors: [getPrimary.value],
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '45%',
                distributed: true,
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        grid: {
            yaxis: {
                lines: {
                    show: false
                }
            }
        },
        xaxis: {
            categories: [['LPZ'], ['CBA'], ['SCZ'], ['SCR'], ['BEN'], ['ORU'], ['TAR'], ['PAN'], ['POT']],
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd/MM/yy HH:mm'
            }
        }
    };
});
const depChart = {
    series: [
        {
            name: '',
            data: [20, 15, 80, 25, 10, 15, 30, 40, 60]
        }
    ]
};

onMounted(async () => {
  await getInfo(),
  await getInfoProperty(),
  await getInfoJudicial()
})

</script>
<template>
  <v-row>
    <!-- WELCOME -->
    <v-col cols="12" lg="6" sm="12">
      <v-card elevation="0" rounded="md" class="bg-lightprimary border-0">
        <v-card-item class="pt-3 pb-0">
          <v-row>
            <v-col cols="12" sm="5" class="pt-sm-10 pt-5">
              <div class="d-flex aling-center">
                <v-avatar size="40">
                  <img :src="imagen" height="40" alt="icon" />
                </v-avatar>
                <h5 class="text-h5 ml-4">
                  Bienvenid@: <br>
                  {{ nombres }}
                  {{ apellido_paterno }}
                  {{ apellido_materno }}
                </h5><br>
                <h6 class="text-subtitle-3 textSecondary ml-4">
                  {{ oficina }}
                </h6>
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
    </v-col>
    <!-- ESTADO JUDICIAL -->
    <v-col cols="12" lg="4" sm="12">
      <v-card elevation="10">
        <v-card-item>
          <div class="d-sm-flex align-center justify-space-between">
            <v-card-title class="text-h5">Estado judicial de los Bienes</v-card-title>
          </div>
          <v-row>
            <v-col cols="7" sm="7">
              <div class="mt-6">
                <h4 class="text-h4" style="color: #FFAD37;">Secuestrado: {{ judicialChart[0] }}</h4>
                <h4 class="text-h4" style="color: #4BBEFC;">Incautado: {{ judicialChart[1] }}</h4>
                <h4 class="text-h4" style="color: #6188FB;">Confiscado: {{ judicialChart[2] }}</h4>
              </div>
            </v-col>
            <v-col cols="5" sm="5">
              <div class="d-flex align-center flex-shrink-0">
                <apexchart class="pt-6" type="donut" height="130" :options="chartJudicialOptions"
                  :series="judicialChart"> </apexchart>
              </div>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
    </v-col>
    <!-- TOTAL DEPOSITOS -->
    <v-col cols="12" lg="2"  sm="12">
      <v-row>
        <v-col cols="12" :key="topCardsData[0].title">
          <div
            :class="'text-decoration-none d-flex align-center justify-space-between text-center rounded-md pa-6  bg-' + topCardsData[0].bgcolor">
            <div :class="'bg-' + topCardsData[0].bgcolor">
              <h5 class="text-h5 ml-4">
                <div :class="'text-h4 text-capitalize font-weight-bold mt-3 text-' + topCardsData[0].textcolor"
                  v-text="topCardsData[0].title"></div>
              </h5>
              <h4 :class="'text-h2 mt-1 text-' + topCardsData[0].textcolor" v-text="topCardsData[0].number"></h4>
              <img :src="topCardsData[0].img" alt="icon" class="mt-6 " />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <!-- REGISTRO POR GESTION -->
    <v-col cols="12" lg="12" sm="12">
      <v-card elevation="10" class="mt-4" >
        <v-card-item class="">
          <div class="d-flex align-center justify-space-between">
            <v-card-title class="text-h5">Registros de la presente gestión</v-card-title>
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
        <div v-if="areaAnualChart">
          <apexchart type="area" height="250" :options="chartAnualOptions" :series="areaAnualChart.series"> </apexchart>
        </div>
      </v-card>
    </v-col>
    <!-- ULTIMOS REGISTROS -->
    <v-col cols="12" lg="5" sm="12">
      <v-card elevation="10" >
        <v-card-item>
            <v-card-title class="text-h5">Registros recientes</v-card-title>
            <div class="recent-transaction mt-10 px-3">
                <div v-for="list in recentTransaction" :key="list.title">
                    <v-row class="d-flex mb-4">
                        <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
                            <h6 class="text-body-1 textSecondary text-no-wrap">{{ list.title }}</h6>
                        </v-col>
                        <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
                            <CircleIcon size="13" :class="'text-' + list.textcolor" />
                            <div v-if="list.line" class="line mx-auto bg-grey100"></div>
                        </v-col>
                        <v-col cols="7" sm="8" class="pt-0 pb-1">
                            <h6 class="text-body-1 textSecondary">{{ list.subtitle }}</h6>
                            <h6 class="text-body-3 font-weight-bold">{{ list.subtitle2 }}</h6>
                            <div class="mt-n1">
                                <RouterLink :to="list.url" class="text-body-2 text-primary text-decoration-none" v-if="list.link">{{
                                    list.link
                                }}</RouterLink>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card-item>
    </v-card>
    </v-col>
    <!-- REGISTROS POR DEPARTAMENTO -->
    <v-col cols="12" lg="7" sm="12">
      <v-card elevation="10" >
        <v-card-item>
            <v-card-title class="text-h5">Registro de bienes por Departamento</v-card-title>
            <v-card-subtitle class="text-subtitle-1 textSecondary">Total</v-card-subtitle>
            <apexchart type="bar" height="400" :options="chartDepOptions" :series="depChart.series"> </apexchart>
        </v-card-item>
    </v-card>
    </v-col>
  </v-row>
</template>
