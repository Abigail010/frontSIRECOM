<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useDocumentaryReviewObservationStore } from '@/stores/resources/documentaryReviewObservation';
import Swal from 'sweetalert2'

const documentaryReviewObservationStore = useDocumentaryReviewObservationStore()

const page = ref({ title: 'Revision Documental - Observaciones' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de Observaciones',
    disabled: true,
    href: '#'
  }
]);

const desserts = ref([]) as any
const getDocumentaryReviewObservationsList = async() => {
  desserts.value = await documentaryReviewObservationStore.documentaryReviewObservations()
}

  const buttonDocumentaryReviewObservationForm = (id_revision_documental_observacion: any) => {
    router.push({ name: 'documentaryReviewObservationForm', params: { id_revision_documental_observacion: id_revision_documental_observacion }})
  }

  // nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Observacion', key: 'nombre_observacion' },
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
    const { ok, message } = await documentaryReviewObservationStore.deleteDocumentaryReviewObservation({"id":item})
    const icono = (ok ? 'success' : 'error')
    if(ok){
      await getDocumentaryReviewObservationsList()
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
    getDocumentaryReviewObservationsList()
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
            :sort-by="[{ key: 'nombre_delito', order: 'asc' }]" 
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
                  @click="buttonDocumentaryReviewObservationForm(0)" 
                >Nuevo observacion</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon color="info" size="large" class="me-2" @click="buttonDocumentaryReviewObservationForm(item.id)">
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
