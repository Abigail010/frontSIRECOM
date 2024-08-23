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

</script>
<template>

    Modificar vista 
    <v-row>
        <!-- Top cards -->
        <v-col cols="12">
            <Topcards/>
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