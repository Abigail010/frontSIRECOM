<script setup lang="ts">
import { ref, onMounted} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRepuestoStore } from '@/stores/resources/repuesto';
import Swal from 'sweetalert2'

const repuesto = useRepuestoStore()
const page = ref({ title: 'Repuestos' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Lista',
    disabled: true,
    href: '#'
  }
]);

  const desserts = ref([]) as any
  const getrepuestosList = async() => {
    desserts.value = await repuesto.getRepuestos()
    
  }

  const buttonrepuestoForm = (id: any) => {
    router.push({ name: 'formulario', params: { id: id }})
  }

// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Nombre', key: 'nombre_repuesto' },
  { title: 'Cantidad', key: 'cantidad' },
 
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
      const { ok, message } = await repuesto.deleteRepuesto({"id":item})
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
                >Nuevo Repuesto</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
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
