<script setup lang="ts">
import { ref, onMounted} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useServiceStore } from '@/stores/resources/servicios';
import Swal from 'sweetalert2'

const servicios = useServiceStore()

const page = ref({ title: 'Servicios para talleres externos' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de servicios',
    disabled: true,
    href: '#'
  }
]);


interface Man {
  id: number;
}

  //const desserts = ref([]) as any
  const desserts = ref<Man[]>([]);
  const getList = async() => {
    desserts.value = await servicios.servicios()
  }

  const buttonServicioForm = (id_servicio: any) => {
    router.push({ name: 'serviciosForm', params: { id_servicio: id_servicio }})
  }


// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Servicios', key: 'nombre_servicio' },
])

function deleteItem(item: any) {
    Swal.fire({
        title: "¿Estas seguro?",
        text: "¡El proceso no podra ser revertido!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, ¡eliminar!"
    }).then(async (result) => {
    if (result.isConfirmed) {
      const { ok, message } = await servicios.deleteService({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getList()
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
  getList()
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
            :sort-by="[{ key: 'nombre_servicio', order: 'asc' }]" 
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
                  @click="buttonServicioForm(0)" 
                >Nuevo Servicio</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }:{item:Man}">
                <v-icon color="info" size="large" class="me-2" @click="buttonServicioForm(item.id)">
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
