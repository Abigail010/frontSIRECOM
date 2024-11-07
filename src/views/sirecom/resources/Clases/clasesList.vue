<script setup lang="ts">
import { ref, onMounted} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useClasesStore } from '@/stores/resources/clase';
import Swal from 'sweetalert2'

const Clases = useClasesStore()

const page = ref({ title: 'Tipo' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Tipo de vehículo',
    disabled: true,
    href: '#'
  }
]);


interface Man {
  id_clase: number;
}

  //const desserts = ref([]) as any
  const desserts = ref<Man[]>([]);
  const getList = async() => {
    desserts.value = await Clases.Clase()
  }

  const buttonClaseForm = (id_clase: any) => {
    router.push({ name: 'ClaseForm', params: { id_clase: id_clase }})
  }
// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Tipo', key: 'nombre_clase' },
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
      const { ok, message } = await Clases.deleteClases({"id":item})
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
            :sort-by="[{ key: 'nombre_Clase', order: 'asc' }]" 
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
                  @click="buttonClaseForm(0)" 
                >Nuevo tipo</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item } : {item: Man}">
                <v-icon color="info" size="large" class="me-2" @click="buttonClaseForm(item.id_clase)">
                    mdi-pencil
                </v-icon>
                <v-icon color="error" size="large"  @click="deleteItem(item.id_clase)">
                    mdi-delete
                </v-icon>
            </template>                    
          </v-data-table>
        </v-col>
    </v-row>
</template>
