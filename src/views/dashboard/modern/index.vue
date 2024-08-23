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
const orden = useSearchStore()
const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
 console.log('perfil', userLogged);
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

const getGen = async () => {
    const info = await orden.getInfoB();
   // console.log(info.id_taller)
    const users = await orden.getUsers();
    const vehiculo = await orden.getVehiculos();
    const man1 = await orden.getFinalizado();
    const man2 = await orden.getPendiente();
    const rep1 = await orden.getPedidos_en();
    const rep2 = await orden.getPedidos_pen();
    console.log(rep2)
    state.formData.title1 ="Usuarios Registrados"
    state.formData.title2 ="Vehículos Registrados"
    state.formData.title3 ="Mantenimientos Finalizado"
    state.formData.title4 ="Mantenimientos Pendientes"
    state.formData.title5 ="Repuestos Entregados"
    state.formData.title6 ="Repuestos Pendientes"

    if(userProfile.includes('SUPER ADMINISTRADOR')){
        console.log('admin')
        let tot = 0 
        for(let i=0;i < users.length; i++){
            tot = tot+ parseInt(users[i].total)
        }
        console.log('total ' +tot)
        state.formData.dato1 =  String(tot)
         
        let tot1 = 0 
        for(let i=0;i < vehiculo.length; i++){
            tot1 = tot1+ parseInt(vehiculo[i].total)
        }
        console.log('total ' +tot)
        state.formData.dato2 =  String(tot1)

           
        let tot2 = 0 
        for(let i=0;i < man1.length; i++){
            tot2 = tot2+ parseInt(man1[i].total)
        }
        console.log('total ' +tot)
        state.formData.dato3 =  String(tot2)
        
        let tot3 = 0 
        for(let i=0;i < man2.length; i++){
            tot3 = tot3+ parseInt(man2[i].total)
        }
        console.log('total ' +tot)
        state.formData.dato4 =  String(tot3)

        let tot4 = 0 
        for(let i=0;i < rep1.length; i++){
            tot4 = tot4+ parseInt(rep1[i].cantidad)
        }
        console.log('total ' +tot)
        state.formData.dato5 =  String(tot4)

        
        let tot5 = 0 
        for(let i=0;i < rep2.length; i++){
            tot5 = tot5+ parseInt(rep2[i].cantidad)
        }
        console.log('total ' +tot)
        state.formData.dato6 =  String(tot5)
    }else{
        let tot = 0 
        for(let i=0;i < users.length; i++){
           if(users[i].id_taller == info.id_taller){
            tot = users[i].total
            break;
           }
        }
        console.log('total ' +tot)
        state.formData.dato1 = String(tot)

        let tot1 = 0 
        for(let i=0;i < vehiculo.length; i++){
           if(vehiculo[i].id_taller == info.id_taller){
            tot1 =vehiculo[i].total
            break;
           }
        }
        console.log('total ' +tot)
        state.formData.dato2 = String(tot1)
       

        let tot2 = 0 
        for(let i=0;i < man1.length; i++){
           if(man1[i].id_taller == info.id_taller){
            tot2 = man1[i].total
            break;
           }
        }
        console.log('total ' +tot)
        state.formData.dato3 = String(tot2)

        let tot3 = 0 
        for(let i=0;i < man2.length; i++){
           if(man2[i].id_taller == info.id_taller){
            tot3 = man2[i].total
            break;
           }
        }
        console.log('total ' +tot)
        state.formData.dato4 = String(tot3)

        let tot4 = 0 
        for(let i=0;i < rep1.length; i++){
           if(rep1[i].id_taller == info.id_taller){
            tot4 = rep1[i].cantidad
            break;
           }
        }
        console.log('total ' +tot)
        state.formData.dato5 = String(tot4)

        let tot5 = 0 
        for(let i=0;i < rep2.length; i++){
           if(rep2[i].id_taller == info.id_taller){
            tot5 = rep2[i].cantidad
            break;
           }
        }
        console.log('total ' +tot)
        state.formData.dato6 = String(tot5)
    } 

   // console.log(users)
  }

  onMounted(async () => {
   await getGen()
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
                    <RevenueUpdates/>
                </v-col>
            
              
           </v-row>
        </v-col>    
    </v-row>
</template>