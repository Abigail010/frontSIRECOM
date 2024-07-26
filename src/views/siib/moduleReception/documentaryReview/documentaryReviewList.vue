<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {ClipboardListIcon, UsersIcon, FileDollarIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { format, formatDistance } from 'date-fns'
import { es } from 'date-fns/locale'
import { useInstanceStore } from '@/stores/moduleOne/instance';

  const instanceStore = useInstanceStore()

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

  const numeroPagina = ref(1)
  const elementosPorPagina = ref(6)
  const totalPaginas = ref(1)

  const state:any = reactive({
		formData: {
			palabra_clave: '',
		} as any,
  })

  const currentDate = format(new Date(), 'yyyy-MM-dd')
  const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  // console.log('perfil', userProfile);

  const timeAgo = (value: any) => {
    return formatDistance(new Date(currentDate), new Date(value), {locale:es})
  }

  // LISTA DE CASOS
  const casos = ref([]) as any;
  const listadoTotal = ref([]) as any
  const getInstances = async () => {
    const instances = await instanceStore.instances()
    /*
    for (let i = 0; i < instances.length; i++) {
      const properties = await instanceStore.instanceProperties(instances[i].id)
      const logistics = await instanceStore.receptionLogisticsRecords(instances[i].id)
      if(properties.bienes.length>0){
        const valor = properties.bienes.find( (registro:any) => registro.aprobado === null )
        instances[i].botonLogistica = (!valor) ? true : false
      }
      instances[i].botonBien = (logistics.length != 0) ? true : false
    }
    */
    casos.value = instances
    listadoTotal.value = casos.value
    totalPaginas.value = Math.ceil(casos.value.length / elementosPorPagina.value)
  }

  const datosPaginados = ref([]) as any
  const getInstancesPage = async (numeroPagina: number) => {
    datosPaginados.value = []
    const inicio = (numeroPagina * elementosPorPagina.value) - elementosPorPagina.value
    const fin = (numeroPagina * elementosPorPagina.value)
    datosPaginados.value = casos.value.slice(inicio, fin)
  }

  const searchReview = async (keyword: any) => {
    keyword = keyword.toUpperCase()
    casos.value = listadoTotal.value
    if(keyword.length > 0){
      const listado = casos.value.filter((card:any) => {
        return (card.numero_caso_felcn_felcc.includes(keyword) || card.jurisdiccion_caso.includes(keyword) || card.nombre_clave_caso.includes(keyword))
      })
      casos.value = listado
    }
    numeroPagina.value = 1
    totalPaginas.value = Math.ceil(casos.value.length / elementosPorPagina.value)
    await getInstancesPage(1)
  }

  // ACTUALIZAR CASO
  const updateCase = (id:number) =>{
    router.push({ name: 'caseFile', params: { id: id }})
  }

  // REGISTRAR/ACTUALIZAR IMPLICADOS
  const registerImplicate = (id:number) =>{
    router.push({ name: 'implicatedFile', params: { id: id }})
  }

  // REGISTRAR/ACTUALIZAR BIENES DEL CASO
  const caseProperties = (id:number) =>{
    router.push({ name: 'bienFile', params: { id: id }})
  }

  // REGISTRAR LOGISTICA DE RECEPCION DE BIENES DEL CASO
  // const receptionLogistics = (id:number) =>{
  //   router.push({ name: 'receptionLogistics', params: { id: id }})
  // }

  const downloadKardex = async (id:number) =>{
    await instanceStore.generalKardexReport(id)
  }

  onMounted(async () => {
    await getInstances()
    await getInstancesPage(1)
  })

</script>
<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-row>
    <v-col cols="12" offset-md="6" md="6" sm="12">
      <v-text-field
        v-model="state.formData.palabra_clave"
        class="mayuscula"
        color="primary"
        variant="outlined"
        type="text"
        placeholder="Filtrar por CASO / JURISDICCION / NOMBRE CLAVE"
        @input="searchReview(state.formData.palabra_clave)"
        hide-details>
      </v-text-field>
    </v-col>
  </v-row>

  <v-row class="pt-3">
    <!-- <v-col cols="12" md="6" v-for="caso in casos" :key="caso.id"> -->
    <v-col cols="12" md="6" v-for="caso in datosPaginados" :key="caso.id">
      <v-card elevation="10"  rounded="md" class="card-hover text-justify" >
        <v-badge :content="(caso.fecha_formulario != currentDate) ? timeAgo(caso.fecha_formulario) : 'Hoy'" color="error" class="text-right"></v-badge>
        <v-card-item>
          <v-container>
            <p class="mt-3 font-weight-bold">CASO</p>
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
            <v-btn
              v-if="userProfile == 'SUPERADMIN' || userProfile.includes('JURIDICO') || userProfile == 'MULTIPLE'"
              class="size_fijo"
              size="small"
              color="primary"
              @click="updateCase(caso.id)"
            >
              <ClipboardListIcon style=" cursor: pointer;"></ClipboardListIcon>Caso
            </v-btn>
            <v-btn
            v-if="userProfile == 'SUPERADMIN' || userProfile.includes('JURIDICO') || userProfile == 'MULTIPLE'"
              class="size_fijo"
              size="small"
              color="secondary"
              @click="registerImplicate(caso.id)"
            >
              <UsersIcon style=" cursor: pointer;"></UsersIcon>Implicados
            </v-btn>
          </div>
          <div class="d-flex justify-center align-center flex-column flex-sm-row fill-height pa-1"> 
            <v-btn
              class="size_fijo"
              size="small"
              color="success"
              @click="caseProperties(caso.id)"
            >
              <FileDollarIcon style=" cursor: pointer;"></FileDollarIcon>Bienes
            </v-btn>
            <v-btn
              v-if="userProfile == 'SUPERADMIN'"
              target="_blank"
              class="size_fijo"
              size="small"
              color="warning"
              @click="downloadKardex(caso.id)"
            >
              <FileExportIcon style=" cursor: pointer;"></FileExportIcon>Kardex
            </v-btn>
          </div>
        
      </v-card>
    </v-col>
  </v-row>

  <div class="text-center mt-5">
    <v-pagination
      v-model="numeroPagina"
      :length="totalPaginas"
      :total-visible="5"
      @click="getInstancesPage(numeroPagina)"
    ></v-pagination>
  </div>

</template>

<style>
.size_fijo{
  min-width: 150px;
  text-align:center;
  margin: 1px;
}
.mayuscula input {
  text-transform: uppercase;
}
</style>