<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPrimary, getSecondary } from '@/utils/UpdateColors';
import { useStatisticsStore } from '@/stores/resources/statistics'
import type { userCard, weeklyStats,topProjects,topCards } from '@/types/components/dashboard/modernDashboard';
import card_icon6 from "@/assets/images/svgs/icon-connect.svg"


  const statisticsStore = useStatisticsStore()
  const info = ref(null) as any
  const getInfo = async () => {
    info.value = await statisticsStore.getTotalDeposits()
  }

const topCardsData: topCards[] = [
{
  img: card_icon6,
  title: "Depositos",
  number: "96",
  bgcolor: "lightprimary",
  textcolor: "primary",
},]

  onMounted(async () => {
    await getInfo()
  })

</script>
<template>
  <v-row>
        <v-col cols="12" :key="topCardsData[0].title">
            <div
                :class="'text-decoration-none d-flex align-center justify-space-between text-center rounded-md pa-6  bg-' + topCardsData[0].bgcolor"
            >
                <div :class="'bg-' + topCardsData[0].bgcolor">
                    <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-' + topCardsData[0].textcolor" v-text="topCardsData[0].title"></div>
                    <h4 :class="'text-h4 mt-1 text-' + topCardsData[0].textcolor" v-text="topCardsData[0].number"></h4>
                    <img :src="topCardsData[0].img" alt="icon" class="mt-6 mb-6"/>
                </div>
            </div>
        </v-col>
    </v-row>
</template>