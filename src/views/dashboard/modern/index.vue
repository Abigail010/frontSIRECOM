<script setup lang="ts">
/*Call Components*/
import Topcards from "../dashboardComponents/modern/TopCards.vue";
import RevenueUpdates from "../dashboardComponents/modern/RevenueUpdates.vue";
import YearlyBreakup from "../dashboardComponents/modern/YearlyBreakup.vue";
import MonthlyEarnings from "../dashboardComponents/modern/MonthlyEarnings.vue";
import EmployeeSalary from "../dashboardComponents/modern/EmployeeSalary.vue";
import Customers from "../dashboardComponents/modern/Customers.vue";
import Projects from "../dashboardComponents/modern/Projects.vue";
import UserCard from "../dashboardComponents/modern/UserCard.vue";
import BestSellingProducts from "../dashboardComponents/modern/BestSellingProducts.vue";
import WeeklyStats from "../dashboardComponents/modern/WeeklyStats.vue";
import TopProjects from "../dashboardComponents/modern/TopProjects.vue";
import { useSearchStore } from '@/stores/resources/busqueda';
import card_icon1 from "@/assets/images/svgs/icon-user-male.svg"
import { ref, reactive, onMounted } from 'vue';
import { getPrimary, getSecondary } from '@/utils/UpdateColors';
import { computed } from 'vue';
const orden = useSearchStore()
const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
 //onsole.log('perfil', userLogged);
  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      nro_usuarios: '',
      title1:'',
      dato1:'', 
      title2:'',
      dato2:'', 
      title3:'',
      dato3:'',
      title4:'',
      dato4:'', 
      title5:'',
      dato5:'', 
      title6:'',
      dato6:'',  
      estado: '',
    }
  });


const buttonReport = async () => {

    
///console.log(respuesta_info.length)



}

const fuerzas = []
const pendientes = [] 
const finalizados = []
const prueba = ref([]) as any
const getGen = async () => {
    const info = await orden.getInfoB();
   // console.log(info.id_taller)
    const users = await orden.getUsers();
    const vehiculo = await orden.getVehiculos();
    const man1 = await orden.getFinalizado();
    const man2 = await orden.getPendiente();
    const rep1 = await orden.getPedidos_en();
    const rep2 = await orden.getPedidos_pen();
    prueba.value = await orden.getPrueba2();
    console.log(prueba.value)
    for(let i=0; i< prueba.value.length; i++){
        pendientes[i] = parseInt(prueba.value[i].pendientes)
        finalizados[i] = prueba.value[i].finalizado
        fuerzas[i] = prueba.value[i].placa
       // console.log(prueba.value[i].pendientes )
      // console.log(pendientes[i] )
    }
    state.formData.title1 ="Usuarios Registrados"
    state.formData.title2 ="Vehículos Registrados"
    state.formData.title3 ="Mantenimientos Finalizado"
    state.formData.title4 ="Mantenimientos Pendientes"
    state.formData.title5 ="Repuestos Entregados"
    state.formData.title6 ="Repuestos Pendientes"

    if(userProfile.includes('SUPER ADMINISTRADOR')){
       
        let tot = 0 
        for(let i=0;i < users.length; i++){
            tot = tot+ parseInt(users[i].total)
        }
        
        state.formData.dato1 =  String(tot)
         
        let tot1 = 0 
        for(let i=0;i < vehiculo.length; i++){
            tot1 = tot1+ parseInt(vehiculo[i].total)
        }
      
        state.formData.dato2 =  String(tot1)

           
        let tot2 = 0 
        for(let i=0;i < man1.length; i++){
            tot2 = tot2+ parseInt(man1[i].total)
        }
       
        state.formData.dato3 =  String(tot2)
        
        let tot3 = 0 
        for(let i=0;i < man2.length; i++){
            tot3 = tot3+ parseInt(man2[i].total)
        }
       
        state.formData.dato4 =  String(tot3)

        let tot4 = 0 
        for(let i=0;i < rep1.length; i++){
            tot4 = tot4+ parseInt(rep1[i].cantidad)
        }
       
        state.formData.dato5 =  String(tot4)

        
        let tot5 = 0 
        for(let i=0;i < rep2.length; i++){
            tot5 = tot5+ parseInt(rep2[i].cantidad)
        }
        
        state.formData.dato6 =  String(tot5)
    }else{
        let tot = 0 
        for(let i=0;i < users.length; i++){
           if(users[i].id_taller == info.id_taller){
            tot = users[i].total
            break;
           }
        }
        
        state.formData.dato1 = String(tot)

        let tot1 = 0 
        for(let i=0;i < vehiculo.length; i++){
           if(vehiculo[i].id_taller == info.id_taller){
            tot1 =vehiculo[i].total
            break;
           }
        }
       
        state.formData.dato2 = String(tot1)
       

        let tot2 = 0 
        for(let i=0;i < man1.length; i++){
           if(man1[i].id_taller == info.id_taller){
            tot2 = man1[i].total
            break;
           }
        }
     
        state.formData.dato3 = String(tot2)

        let tot3 = 0 
        for(let i=0;i < man2.length; i++){
           if(man2[i].id_taller == info.id_taller){
            tot3 = man2[i].total
            break;
           }
        }
       
        state.formData.dato4 = String(tot3)

        let tot4 = 0 
        for(let i=0;i < rep1.length; i++){
           if(rep1[i].id_taller == info.id_taller){
            tot4 = rep1[i].cantidad
            break;
           }
        }
        
        state.formData.dato5 = String(tot4)

        let tot5 = 0 
        for(let i=0;i < rep2.length; i++){
           if(rep2[i].id_taller == info.id_taller){
            tot5 = rep2[i].cantidad
            break;
           }
        }
      
        state.formData.dato6 = String(tot5)
    } 

   // console.log(users)
  }
  const select = ref('March 2023');
const items = ref(['March 2023', 'April 2023', 'May 2023']);

/* Chart */


const chartOptions = computed(() => {
    return {
        chart: {
            height: 400,
            type: 'bar',
            fontFamily: `inherit`,
            foreColor: '#051d49',
            stacked: true
        },
        colors: [getPrimary.value, getSecondary.value], // Puedes reemplazar este color con el que prefieras
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '50%',
                columnWidth: '10%',
                borderRadius: [3],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all'
            }
        },
        stroke: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        grid: {
            borderColor: 'rgba(0,0,1,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        yaxis: {
            min: Math.min(...prueba.value.map(item => item.total)),
            max: Math.max(...prueba.value.map(item => item.total)), // Establecer el valor máximo de las barras
            tickAmount: Math.max(...prueba.value.map(item => item.total))
        },
        xaxis: {
            categories: prueba.value.map(item => item.fuerza), 
            axisBorder: {
                show: false
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd/MM/yy HH:mm'
            }
        },
        responsive: [
            {
                breakpoint: 991,
                options: {
                    xaxis: {
                        labels: {
                            rotate: -45
                        },
                        categories: prueba.value.map(item => item.fuerza)
                    }
                }
            }
        ]
    };
});


const lineChart = {
    series: [
        {
            name: 'Mantenimientos Pendientes',
            data: pendientes
        },
        {
            name: 'Mantenimientos Entregados',
            data: finalizados
        }
    ]
};
  onMounted(async () => {
   await getGen()
    await buttonReport()
  })
</script>
<template>

    Modificar vista 
    <v-row>
        <!-- Top cards -->

        <v-col cols="12" lg="2" md="4" sm="4" >
            <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-lightprimary'"
            >
                <div :class="'bg-lightprimary'">
                    <img :src="card_icon1" alt="icon" />
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-primary'"  v-text="state.formData.title1"></div>
                    <h4 :class="'text-h4 mt-1 text-primary' " v-text="state.formData.dato1"></h4>
                </div>
            </div>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4" >
            <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-lightwarning'"
            >
                <div :class="'bg-lightwarning'">
                    <img :src="card_icon1" alt="icon" />
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-warning'"  v-text="state.formData.title2"></div>
                    <h4 :class="'text-h4 mt-1 text-warning' " v-text="state.formData.dato2"></h4>
                </div>
            </div>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4" >
            <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-lightsecondary'"
            >
                <div :class="'bg-lightsecondary'">
                    <img :src="card_icon1" alt="icon" />
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-secondary'"  v-text="state.formData.title3"></div>
                    <h4 :class="'text-h4 mt-1 text-secondary' " v-text="state.formData.dato3"></h4>
                </div>
            </div>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4" >
            <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-lighterror'"
            >
                <div :class="'bg-lighterror'">
                    <img :src="card_icon1" alt="icon" />
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-error'"  v-text="state.formData.title4"></div>
                    <h4 :class="'text-h4 mt-1 text-error' " v-text="state.formData.dato4"></h4>
                </div>
            </div>
        </v-col>
        <v-col cols="12" lg="2" md="4" sm="4" >
           <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-lightsuccess'"
            >
                <div :class="'bg-lightsuccess'">
                    <img :src="card_icon1" alt="icon" />
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-success'"  v-text="state.formData.title5"></div>
                    <h4 :class="'text-h4 mt-1 text-success' " v-text="state.formData.dato5"></h4>
                </div>
            </div>
        </v-col> 
        <v-col cols="12" lg="2" md="4" sm="4" >
           <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-lightprimary'"
            >
                <div :class="'bg-lightprimary'">
                    <img :src="card_icon1" alt="icon" />
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-primary'"  v-text="state.formData.title6"></div>
                    <h4 :class="'text-h4 mt-1 text-primary' " v-text="state.formData.dato6"></h4>
                </div>
            </div>
        </v-col> 
         
       
         <v-col cols="12">
           <v-row>
                <!-- Revenue Updates -->
                <v-col cols="12" lg="12" md="12">
                    <v-card elevation="10" >
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between">
                <div>
                    <v-card-title class="text-h5">Cuadro de registros</v-card-title>
                    <v-card-subtitle class="text-subtitle-1 textSecondary">Fuerzas</v-card-subtitle>
                </div>
                <div class="my-sm-0 my-2">
                    <v-select v-model="select" :items="items" variant="outlined" density="compact" hide-details></v-select>
                </div>
            </div>

            <v-row>
                <v-col cols="12" sm="12" class="pt-7">
                    <apexchart type="bar" height="375" :options="chartOptions" :series="lineChart.series"> </apexchart>
                </v-col>
                <v-col cols="12" sm="4" class="pt-7">
                    <div class="d-flex align-center mt-md-6 mt-3">
                        <v-avatar class="rounded-md bg-lightprimary text-primary">
                            <GridDotsIcon size="22" />
                        </v-avatar>
                        <div class="pl-4">
                            <h3 class="text-h3">$63,489.50</h3>
                            <h6 class="text-subtitle-1 textSecondary">Total Earnings</h6>
                        </div>
                    </div>
                    <div class="mt-sm-10 mb-sm-10 mt-10 mb-0">
                        <div class="d-flex align-baseline">
                            <v-icon icon="mdi mdi-checkbox-blank-circle" size="10" color="primary"></v-icon>
                            <div class="pl-4">
                                <h6 class="text-subtitle-1 textSecondary">Earnings this month</h6>
                                <h5 class="text-h5 mt-1">$48,820</h5>
                            </div>
                        </div>
                        <div class="d-flex mt-8 align-baseline">
                            <v-icon icon="mdi mdi-checkbox-blank-circle" size="10" color="secondary"></v-icon>
                            <div class="pl-4">
                                <h6 class="text-subtitle-1 textSecondary">Expense this month</h6>
                                <h5 class="text-h5 mt-1">$26,498</h5>
                            </div>
                        </div>
                        <v-btn color="primary" class="mt-10" variant="flat" block>View Full Report</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
                </v-col>
            
              
           </v-row>
        </v-col>    
    </v-row>
</template>