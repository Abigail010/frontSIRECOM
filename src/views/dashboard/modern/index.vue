<script setup lang="ts">
/*Call Components*/

import { useSearchStore } from '@/stores/resources/busqueda';
import UiChildCard from '@/components/shared/UiChildCard.vue';
import card_icon1  from "@/assets/images/svgs/icon-user-male.svg"
import card_icon12  from "@/assets/images/svgs/icon-zip-folder.svg"
import { ref, reactive, onMounted } from 'vue';
import { getPrimary, getSecondary } from '@/utils/UpdateColors';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { nextTick } from 'vue';
const orden = useSearchStore()
const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
const us:any = JSON.parse(localStorage.getItem('user') || '').id_perfil
const us2:any = JSON.parse(localStorage.getItem('user') || '').id_taller

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
      extra:'', 
    }
  });
// Crear un nuevo objeto de fecha
const fechaActual = new Date();

// Array con los nombres de los meses
const nombresMeses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Obtener el mes actual (sin necesidad de sumar 1)
const mesActualNombre = nombresMeses[fechaActual.getMonth()];

// Obtener el año actual
const añoActual = fechaActual.getFullYear();
// Imprimir el mes y año actual

const select = ref('');
 select.value = mesActualNombre;
 const select2 = ref('');
 select2.value = mesActualNombre;

const fuerzas = []
const pendientes = [] as any
const finalizados = [] as any
const prueba = ref([]) as any
const datos = ref([]) as any//const departamento = [] as any
const probar: { value?: number[] } = {};
const pieChart = reactive({
  series: [] as number[], // Inicializamos vacío
});
const getEncargado = async (id: any) => {
    
    if(id!=''){
       
        prueba.value = await orden.getPrueba2(id);
        for(let i=0; i< prueba.value.length; i++){
        pendientes[i] = parseInt(prueba.value[i].pendientes)
        finalizados[i] = parseInt(prueba.value[i].finalizado)
        fuerzas[i] = prueba.value[i].placa
    }
        
    }else{
        
        prueba.value = await orden.getPrueba2(mesActualNombre);
        for(let i=0; i< prueba.value.length; i++){
        pendientes[i] = parseInt(prueba.value[i].pendientes)
        finalizados[i] = parseInt(prueba.value[i].finalizado)
        fuerzas[i] = prueba.value[i].placa
    }
    }
     
  }
 
// Inicialización de variables
let departamento: number[] = [];
// Función asincrónica para obtener departamentos
const getDepartamentos = async (id: any) => {
    

    // Obtener datos según el valor de `id`
    if (id !== '') {
        datos.value = await orden.getCiudades(id);
    } else {
        datos.value = await orden.getCiudades(mesActualNombre);
    }

    // Asignar valores a `departamento`
    departamento = [
        parseInt(datos.value[0].beni || "0"),
        parseInt(datos.value[0].cochabamba || "0"),
        parseInt(datos.value[0].la_paz || "0"),
        parseInt(datos.value[0].oruro || "0"),
        parseInt(datos.value[0].pando || "0"),
        parseInt(datos.value[0].potosi || "0"),
        parseInt(datos.value[0].chuquisaca || "0"),
        parseInt(datos.value[0].santa_cruz || "0"),
        parseInt(datos.value[0].tarija || "0")
    ];
    pieChart.series = [...departamento]; // Reactivo, actualiza el gráfico
 
};

   
const getGen = async () => {
    const info = await orden.getInfoB();
   
    const users = await orden.getUsers();
    const vehiculo = await orden.getVehiculos();
    const man1 = await orden.getFinalizado();
    const man2 = await orden.getPendiente();
    const rep1 = await orden.getPedidos_en();
    const rep2 = await orden.getPedidos_pen();
    prueba.value = await orden.getPrueba2(mesActualNombre);
    
    for(let i=0; i< prueba.value.length; i++){
        pendientes[i] = parseInt(prueba.value[i].pendientes)
        finalizados[i] = prueba.value[i].finalizado
        fuerzas[i] = prueba.value[i].placa
       
    }

    datos.value = await orden.getCiudades(mesActualNombre);
    departamento = [parseInt(datos.value[0].beni || 0), parseInt(datos.value[0].cochabamba || 0), parseInt(datos.value[0].la_paz || 0),parseInt(datos.value[0].oruro || 0), parseInt(datos.value[0].pando || 0), parseInt(datos.value[0].potosi || 0), parseInt(datos.value[0].chuquisaca || 0), parseInt(datos.value[0].santa_cruz || 0),parseInt(datos.value[0].tarija || 0)]
    pieChart.series = [...departamento]; // Reactivo, actualiza el gráfico

    state.formData.title1 ="Usuarios Registrados"
    state.formData.title2 ="Vehículos en Mantenimiento"
    state.formData.title3 ="Mantenimientos Finalizado"
    state.formData.title4 ="Mantenimientos Pendientes"
    state.formData.title5 ="Repuestos Entregados"
    state.formData.title6 ="Repuestos Pendientes"

    if(userProfile.includes('SUPER ADMINISTRADOR') || (us==1) ){
       
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

  
  }
 

 const generatePDF = () =>{
    const ciudad = ['BENI', 'COCHABAMBA', 'LA PAZ', 'ORURO', 'PANDO', 'POTOSI', 'CHUQUISACA',  'SANTA CRUZ',  'TARIJA']
    nextTick(() => {
    const card = document.getElementById('mantenimientoCard');
    if (card) {
      html2canvas(card).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        // Agregar el título al PDF
        pdf.setFontSize(20); // Tamaño de la fuente
       
        pdf.text('Registro de Mantenimientos por Departamento', pdf.internal.pageSize.getWidth() / 2, 20, {
          align: 'center',
        });

        // Reducir el tamaño del cuadro capturado en el PDF
        const imgWidth = 150; // Ajustar ancho de la imagen
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener la proporción
        pdf.addImage(imgData, 'PNG', 35, 30, imgWidth, imgHeight);

        // Agregar las cantidades por departamento
        pdf.setFontSize(12);
        let yOffset = 30 + imgHeight + 10; // Ajustar posición debajo de la imagen
        pdf.text('Resumen de Cantidades por Departamento:', 10, yOffset);

        departamento.forEach((item, index) => {
          yOffset += 8; // Ajustar espacio entre líneas
          pdf.text(`${index + 1}. ${ciudad[index]}: ${pieChart.series[index]}`, 10, yOffset);
        });

        // Guardar el PDF
        pdf.save('mantenimiento.pdf');
      });
    } else {
      //console.error("El elemento con id 'mantenimientoCard' no se encuentra.");
    }
  });
    }
const  generatePNG =  () => {
    
    nextTick(() => { // Usa nextTick aquí
    const card = document.getElementById('mantenimientoCard');
    if (card) {
      html2canvas(card).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'mantenimiento.png';
        link.click();
      });
    } else {
      //onsole.error("El elemento con id 'mantenimientoCard' no se encuentra.");
    }
  });
    }
   
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
        /*
        yaxis: {
            min: Math.min(...prueba.value.map((item: any) => item.total)),
            max: Math.max(...prueba.value.map((item: any) => item.total)), // Establecer el valor máximo de las barras
            tickAmount: Math.max(...prueba.value.map((item: any) => item.total))
        },*/
        yaxis: {
    min: Math.min(...(Array.isArray(prueba.value) ? prueba.value.map((item: any) => item.total ? Number(item.total) : 0) : [0])),
    max: Math.max(...(Array.isArray(prueba.value) ? prueba.value.map((item: any) => item.total ? Number(item.total) : 0) : [0])),
    tickAmount: Math.max(...(Array.isArray(prueba.value) ? prueba.value.map((item: any) => item.total ? Number(item.total) : 0) : [0]))
},


        xaxis: {
            /*categories: prueba.value.map((item: any) => item.fuerza), */
            categories: (Array.isArray(prueba.value) ? prueba.value : [])
    .map((item: any) => item.fuerza && item.fuerza.trim() ? item.fuerza : 'Sin registros'),

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
                        /*categories: prueba.value.map((item:any) => item.fuerza)*/
                        categories: (Array.isArray(prueba.value) ? prueba.value : [])
    .map((item: any) => item.fuerza && item.fuerza.trim() ? item.fuerza : 'Sin registros'),

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

const theme = useTheme();
const success = theme.current.value.colors.success;
const accent = theme.current.value.colors.accent;
const warning = theme.current.value.colors.warning;

const donutchartOptions = computed(() => {
    return {
        chart: {
            type: 'donut',
            height: 300,
            fontFamily: `inherit`,
            foreColor: '#adb0bb'
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70px'
                }
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            width: '50px'
        },
        colors: ['#6ac3fd', '#0b70fb', '#f64e60', '#26c6da', '#ffa800'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };
});

const donutChart = {
    series: [44, 55, 41, 17, 15]
};

const piechartOptions = computed(() => {
    return {
        chart: {
            type: 'pie',
            height: 300,
            fontFamily: `inherit`,
            foreColor: '#adb0bb',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70px'
                }
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            width: '50px'
        },
        colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#FFC107', '#8BC34A', '#00BCD4', '#3F51B5'],
        tooltip: {
            fillSeriesColor: false
        },
        labels: ['BENI', 'COCHABAMBA', 'LA PAZ', 'ORURO', 'PANDO', 'POTOSI', 'CHUQUISACA',  'SANTA CRUZ',  'TARIJA'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };
});



 

  onMounted(async () => {
   await getGen()
   // await buttonReport()
  })
</script>
<template>

    <v-row>
        <!-- Top cards -->

        <v-col cols="12" lg="2" md="4" sm="4" >
            <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-lightprimary'"
            >
                <div :class="'bg-lightprimary'">
                    <img   src="@/assets/images/misimagenes/9424639.png" class="imagen"/>
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
                    <img src="@/assets/images/misimagenes/75704.png" class="imagen"/>
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
                    <img src="@/assets/images/misimagenes/prueba2.png" class="imagen" />
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
                    <img  src="@/assets/images/misimagenes/prueba2.png" class="imagen" />
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
                    <img  src="@/assets/images/misimagenes/prueba4.png" class="imagen" />
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
                    <img  src="@/assets/images/misimagenes/prueba4.png" class="imagen" />
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-primary'"  v-text="state.formData.title6"></div>
                    <h4 :class="'text-h4 mt-1 text-primary' " v-text="state.formData.dato6"></h4>
                </div>
            </div>
        </v-col> 
         
       
         <v-col cols="12">
           <v-row v-if="(us==1 || us2==1) && us!==5">
                <!-- Revenue Updates -->
            <v-col cols="12" lg="12" md="12">
              <v-card elevation="10" >
                <v-card-item>
                    <div class="d-sm-flex align-center justify-space-between">
                        <div >
                            <v-card-title class="text-h5">Cuadro de Mantenimiento por mes</v-card-title>
                            <v-card-subtitle class="text-subtitle-1 textSecondary">Fuerzas</v-card-subtitle>
                        </div>
                        <div class="my-sm-0 my-2">
                            <v-select v-if="(us==1 || us2==1)"
                            v-model="select"
                            item-text="text"
                            :items="nombresMeses" 
                            variant="outlined" 
                            density="compact" 
                            @update:model-value="getEncargado(select);"
                            
                            hide-details></v-select>
                        </div>
                    </div>

                    <v-row>
                        <v-col v-if="(us==1 || us2==1)" cols="12" sm="12" class="pt-7">
                            <apexchart type="bar" height="375" :options="chartOptions" :series="lineChart.series"> </apexchart>
                        </v-col>
                    </v-row>
           
                </v-card-item>
              </v-card>
            </v-col>
           </v-row>
           <v-row  v-if="(us==1 || us2==1) && us!==5">
    <v-col cols="12" lg="12" md="12">
      <v-card  variant="outlined">
        <v-card-item class="py-4 px-6">
          <v-row>
            <v-col cols="12" md="6"><b>Registros de mantenimiento</b></v-col>
            <v-col cols="12" md="2">
              <v-select
                v-if="(us==1 || us2==1)"
                v-model="select2"
                item-text="text"
                :items="nombresMeses"
                variant="outlined"
                density="compact"
           
                @update:model-value="getDepartamentos(select2);"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn 
       elevation="2" 
       block
              @click="generatePDF">Generar PDF</v-btn>
            
            </v-col>
            <v-col 
             cols="12" md="2"
        
           >
              
              <v-btn  
            
       elevation="2" 
       block
     
       
               @click="generatePNG">Generar PNG</v-btn>
            </v-col>
          </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text id="mantenimientoCard">
          <apexchart type="pie" height="300" :options="piechartOptions" :series="pieChart.series"> </apexchart>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

        </v-col>    
    </v-row>
    
</template>

<style>
  .imagen{
    width: 50%;
    height: 50%;
   
  }
</style>