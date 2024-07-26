<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useReceptionLogisticsReasonStore } from '@/stores/resources/receptionLogisticsReason'
import Swal from 'sweetalert2'

const receptionLogisticsReasonStore = useReceptionLogisticsReasonStore()

const page = ref({ title: 'Motivo' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de motivos',
    disabled: true,
    href: '#'
  }
]);

const desserts = ref([]) as any
const getReceptionLogisticsReasonsList = async() => {
    desserts.value = await receptionLogisticsReasonStore.receptionLogisticsReasons()
  }

  const buttonReceptionLogisticsReasonForm = (id_logistica_recepcion_motivo: any) => {
    router.push({ name: 'receptionLogisticsReasonForm', params: { id_logistica_recepcion_motivo: id_logistica_recepcion_motivo }})
  }

  // nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Motivo', key: 'nombre_motivo' },
])

  function deleteItem(item: any) {
    Swal.fire({
        title: "Estas seguro?",
        text: "El proceso no podra ser revertido!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!"
    }).then(async (result) => {
    if (result.isConfirmed) {
      const { ok, message } = await receptionLogisticsReasonStore.deleteReceptionLogisticsReason({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getReceptionLogisticsReasonsList()
      }
      Toast.fire({
        icon: icono,
        title: message,
      })
        }
    });
} 

const search = ref() as any

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
  onMounted(() => {
    getReceptionLogisticsReasonsList()
  });
  

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">          
          <v-data-table 
            class="border rounded-md" 
            :headers="headers" 
            :items="desserts" 
            :sort-by="[{ key: 'nombre_motivo', order: 'asc' }]" 
            :search="search"
          >
            <template v-slot:top>
              <v-toolbar class="bg-lightprimary" flat>
                <v-text-field
                  class="ml-4"
                  v-model.trim="search" 
                  append-inner-icon="mdi-magnify" 
                  label="Busqueda" 
                  hide-details 
                />
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn 
                  color="primary"  
                  variant="flat" 
                  dark   
                  @click="buttonReceptionLogisticsReasonForm(0)" 
                >Nuevo delito</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon color="info" size="large" class="me-2" @click="buttonReceptionLogisticsReasonForm(item.id)">
                    mdi-pencil
                </v-icon>
                <v-icon color="error" size="large"  @click="deleteItem(item.id)">
                    mdi-delete
                </v-icon>
            </template>                    
          </v-data-table>
        </v-col>
    </v-row>
</template>
