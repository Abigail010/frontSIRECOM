<script lang="ts" setup>
import { ref, onMounted } from "vue";
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {profileCards, socialiconCard} from '@/_mockApis/components/widget/card';
import {ClipboardListIcon, UsersIcon, FileDollarIcon, PrinterIcon, EditCircleIcon, AssetIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { format, formatDistance } from 'date-fns'
import { es } from 'date-fns/locale'
import { useInstanceStore } from '@/stores/moduleOne/instance';

const instance = useInstanceStore()

const page = ref({ title: 'Revisión Documental' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Revisión Documental',
        disabled: true,
        href: '#'
    }
]);

const currentDate = format(new Date(), 'yyyy-MM-dd')
const timeAgo = (value: any) => {
  return formatDistance(new Date(currentDate), new Date(value), {locale:es})
}

// LISTA DE CASOS
const casos = ref([]) as any;
const getInstances = async () => {
  const instances = await instance.instances()
  casos.value = instances
}

const updateCase = (id:number) =>{
  router.push({ name: 'caseFile', params: { id: id }})
}

const registerImplicate = (id:number) =>{
  router.push({ name: 'implicatedFile', params: { id: id }})
}

const caseProperties = (id:number) =>{
  router.push({ name: 'bienFile', params: { id: id }})
}

const receptionLogistics = (id:number) =>{
  router.push({ name: 'receptionLogistics', params: { id: id }})
}

onMounted(() => {
  getInstances()
})

</script>
<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row class="pt-3">
    <v-col cols="12" md="6" v-for="caso in casos" :key="caso.id">
      <v-card elevation="10"  rounded="md" class="card-hover text-justify" >
        <v-badge :content="(caso.fecha_creacion != currentDate) ? timeAgo(caso.fecha_creacion) : 'Hoy'" color="error" class="text-right"></v-badge>
        <v-card-item>
          <v-container>
            <p class="mt-3">
              <strong>CASO</strong>
            </p>
            <p>
              <strong>File : </strong> {{ caso.file }}
            </p>
            <p>
              <strong>Caso FELCN/FELCC : </strong> {{ caso.numero_caso_felcn_felcc }}
            </p>
            <p>
              <strong>Nombre clave del caso : </strong> {{ caso.nombre_clave_caso }}
            </p>
            <p>
              <strong>Jurisdicción del caso : </strong> {{ caso.jurisdiccion_caso }}
            </p>
            <p>
              <strong>Observaciones : </strong> {{ caso.observaciones }}
            </p>
          </v-container>
        </v-card-item>
        <v-divider class="mt-2"></v-divider>
        <div class="d-flex justify-center align-center flex-column flex-sm-row fill-height pa-1">
          <v-btn class="size_fijo" size="small" color="primary" @click="updateCase(caso.id)">
            <ClipboardListIcon style=" cursor: pointer;"></ClipboardListIcon>Caso
          </v-btn>
          <v-btn class="size_fijo" size="small" color="secondary" @click="registerImplicate(caso.id)">
            <UsersIcon style=" cursor: pointer;"></UsersIcon>Implicados
          </v-btn>
        </div>
        <div class="d-flex justify-center align-center flex-column flex-sm-row fill-height pa-1"> 
          <v-btn class="size_fijo" size="small" color="error" @click="receptionLogistics(caso.id)">
            <AssetIcon style=" cursor: pointer;"></AssetIcon>Logistica
          </v-btn>
          <v-btn class="size_fijo" size="small" color="success" @click="caseProperties(caso.id)">
            <FileDollarIcon style=" cursor: pointer;"></FileDollarIcon>Bienes
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style>
.size_fijo{
min-width: 150px;
text-align:center;
margin: 1px;

}</style>