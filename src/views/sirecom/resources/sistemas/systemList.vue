<script setup lang="ts">
import { ref, onMounted} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useSystemStore } from '@/stores/resources/system';
import Swal from 'sweetalert2'
const sistemaStore = useSystemStore()
const page = ref({ title: 'Sistemas' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de sistemas',
    disabled: true,
    href: '#'
  }
]);

interface Man {
  id: number;
}

  //const desserts = ref([]) as any
  const desserts = ref<Man[]>([]);
  const getsistemasList = async() => {
    desserts.value = await sistemaStore.systems()
  }

  const buttonsistemaForm = (id_sistema: any) => {
    router.push({ name: 'systemForm', params: { id_sistema: id_sistema }})
  }
// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Sistemas', key: 'nombre_sistema' },
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
      const { ok, message } = await sistemaStore.deleteSys({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getsistemasList()
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
  getsistemasList()
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
            :sort-by="[{ key: 'nombre_sistema', order: 'asc' }]" 
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
                  @click="buttonsistemaForm(0)" 
                >Nuevo sistema</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }: {item: Man}">
                <v-icon color="info" size="large" class="me-2" @click="buttonsistemaForm(item.id)">
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
