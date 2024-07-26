<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {ClipboardListIcon, UsersIcon, FileDollarIcon, PrinterIcon, EditCircleIcon, AssetIcon } from 'vue-tabler-icons';
import { router } from '@/router';
import { format, formatDistance } from 'date-fns'
import { es } from 'date-fns/locale'
import { useDocumentaryReceptionStore } from '@/stores/moduleOne/documentaryReception';


  const documentaryReception = useDocumentaryReceptionStore()

  const page = ref({ title: 'Recepción Documental' });
  const breadcrumbs = ref([
      {
          text: 'Dashboard',
          disabled: false,
          href: '#'
      },
      {
          text: 'Recepción Documental',
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
  // PARA CONTROL DESDE EL MOMENTO QUE SE CREO EL ACTA
  const timeAgo = (value: any) => {
    return formatDistance(new Date(currentDate), new Date(value), {locale:es})
  }

  // LISTA DE RECEPCIONES DOCUMENTALES POR CASO
  const recepcionesDocumentales = ref([]) as any
  const listadoTotal = ref([]) as any
  const getDocumentaryReceptions = async () => {
    recepcionesDocumentales.value = await documentaryReception.documentaryReceptions()
    listadoTotal.value = recepcionesDocumentales.value
    // SE HACE LA DIVISION DE LOS ELEMENTOS TOTALES ENTRE LOS ELEMENTOS POR PAGINA QUE SE DESEA
    // Math.ceil redondea el numero si estuviera en decimal a su entero mayor ej Math.ceil(4.01) = 5
    totalPaginas.value = Math.ceil(recepcionesDocumentales.value.length / elementosPorPagina.value)
  }

  const datosPaginados = ref([]) as any
  const getDocumentaryReceptionsPage = async (numeroPagina: number) => {
    datosPaginados.value = []
    let inicio = (numeroPagina * elementosPorPagina.value) - elementosPorPagina.value
    let fin = (numeroPagina * elementosPorPagina.value)

    // FORMA 1
    // for (let i = inicio; i < fin; i++) {
    //   datosPaginados.value.push(recepcionesDocumentales.value[i])
    // }

    //FORMA 2 CON JAVASCRIPT
    datosPaginados.value =  recepcionesDocumentales.value.slice(inicio, fin)
  }

  const newDocumentaryReception = () => {
    router.push({ name: 'documentaryReceptionForm', params: { id_caso: '0' }})
  }

  const checkReception = (id: number) =>{
    router.push({ name: 'documentaryReceptionForm', params: { id_caso: id }})
  }

  const searchReception = async (keyword: any) =>{
    keyword = keyword.toUpperCase()
    recepcionesDocumentales.value = listadoTotal.value
    if(keyword.length > 0){
      const listado = recepcionesDocumentales.value.filter((card: any) => {
        return (card.numero_caso_felcn_felcc.includes(keyword) || card.cite.includes(keyword))
      })
      recepcionesDocumentales.value = listado
    }
    numeroPagina.value = 1
    totalPaginas.value = Math.ceil(recepcionesDocumentales.value.length / elementosPorPagina.value)
    await getDocumentaryReceptionsPage(1)
  }

  const generateReport = async (id_caso: number, id_recepcion_documental: number) =>{
    await documentaryReception.minutesReport(id_caso, id_recepcion_documental)
  }

  onMounted(async () => {
    await getDocumentaryReceptions()
    await getDocumentaryReceptionsPage(1)
  })

</script>
<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
 
  <v-row class="py-2">
    <v-col cols="12">
      <v-btn class="size_fijo" size="small" color="info" @click="newDocumentaryReception()">
        <CirclePlusIcon style="cursor: pointer;" class="mr-1"></CirclePlusIcon>Nuevo registro
      </v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" offset-md="6" md="6" sm="12">
      <v-text-field
        v-model="state.formData.palabra_clave"
        class="mayuscula"
        color="primary"
        variant="outlined"
        type="text"
        placeholder="Filtrar por CASO o CITE"
        @input="searchReception(state.formData.palabra_clave)"
        hide-details>
      </v-text-field>
    </v-col>
  </v-row>

  <v-row class="pt-3">
    <!-- <v-col cols="12" md="6" v-for="recepcionDocumental in recepcionesDocumentales" :key="recepcionDocumental.id"> -->
    <v-col cols="12" md="6" v-for="recepcionDocumental in datosPaginados" :key="recepcionDocumental.id">
      <v-card elevation="10"  rounded="md" class="card-hover text-justify" >
        <v-badge :content="(recepcionDocumental.fecha_formulario != currentDate) ? timeAgo(recepcionDocumental.fecha_formulario) : 'Hoy'" color="error" class="text-right"></v-badge>
        <v-card-item>
          <v-container>
            <p><strong>CITE: </strong> {{ recepcionDocumental.cite }}</p>
            <p><strong>Caso FELCN/FELCC: </strong> {{ recepcionDocumental.numero_caso_felcn_felcc }}</p>
            <p><strong>Número de Fojas: </strong> {{ recepcionDocumental.numero_fojas }}</p>
            <p><strong>Fecha de Solicitud : </strong> {{ recepcionDocumental.fecha_formulario }}</p>
            <br>
            <p class="font-weight-bold text-primary">INVESTIGADOR</p>
            <p><strong>Nombre : </strong> {{ recepcionDocumental.nombre_investigador }}</p>
            <p><strong>Cargo : </strong> {{ recepcionDocumental.cargo }}</p>
            <p><strong>Dependencia : </strong> {{ recepcionDocumental.nombre_dependencia }}</p>
            <p><strong>Teléfono : </strong> {{ recepcionDocumental.telefono ? recepcionDocumental.telefono : 'NO' }}</p>
            <p><strong>Celular : </strong> {{ recepcionDocumental.celular }}</p>
            <p><strong>Correo electronico : </strong> {{ recepcionDocumental.correo_electronico }}</p>
          </v-container>
        </v-card-item>
        <v-divider class="mt-0"></v-divider>
        <div class="d-flex justify-center align-center flex-column flex-sm-row fill-height pa-1 py-3">
          <v-btn class="size_fijo" size="small" color="primary" @click="checkReception(recepcionDocumental.id_caso)">
            <EyeCheckIcon style="cursor: pointer;" class="mr-1"></EyeCheckIcon>Revisar
          </v-btn>
          <v-btn class="size_fijo" size="small" color="warning" @click="generateReport(recepcionDocumental.id_caso, recepcionDocumental.id)">
            <PrinterIcon style="cursor: pointer;" class="mr-1"></PrinterIcon>Reporte
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
      @click="getDocumentaryReceptionsPage(numeroPagina)"
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