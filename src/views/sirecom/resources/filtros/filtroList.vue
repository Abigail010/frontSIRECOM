<script setup lang="ts">
import { ref, onMounted} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { usefilterStore } from '@/stores/resources/filtro';
import Swal from 'sweetalert2'

const repuestoStore = usefilterStore()

const page = ref({ title: 'Filtro' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Filtros de repuestos',
    disabled: true,
    href: '#'
  }
]);


interface Man {
  id: number;
}

  //const desserts = ref([]) as any
  const desserts = ref<Man[]>([]);
  const getrepuestosList = async() => {
    desserts.value = await repuestoStore.filters()
  
  }

  const buttonrepuestoForm = (id_filtro: any) => {
    router.push({ name: 'repuestoForm', params: { id_filtro: id_filtro }})
  }

// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Tipo', key: 'clase' },
  { title: 'Marca/Modelo', key: 'tipo' },
  { title: 'Repuesto', key: 'nombre_repuesto' },
  { title: 'Pertenece', key: 'nombre_sistema' },
  { title: 'Tipo de motor', key: 'tipo_motor' },
])

function deleteItem(item: any) {
    Swal.fire({
        title: "¿Estas seguro?",
        text: "¡El proceso no podra ser revertido!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Si, eliminar!"
    }).then(async (result) => {
    if (result.isConfirmed) {
      const { ok, message } = await repuestoStore.deletefilter({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getrepuestosList()
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
  getrepuestosList()
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
            :sort-by="[{ key: 'nombre_repuesto', order: 'asc' }]" 
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
                  @click="buttonrepuestoForm(0)" 
                >Nuevo Filtro</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }: {item: Man}">
                <v-icon color="info" size="large" class="me-2" @click="buttonrepuestoForm(item.id)">
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
