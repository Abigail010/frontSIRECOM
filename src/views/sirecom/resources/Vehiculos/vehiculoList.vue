<script setup lang="ts">
import { ref, onMounted} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useVehicleStore } from '@/stores/resources/vehicle';
import Swal from 'sweetalert2'

const sistemaStore = useVehicleStore()

const page = ref({ title: 'Vehículos' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de vehículos',
    disabled: true,
    href: '#'
  }
]);
interface Vehiculo {
  id_v: number;
  nombre_fuerza: string;
  placa: string;
  chasis: string;
  tipo_v: string;
  color: string;
}

  //const desserts = ref([]) as any
  const desserts = ref<Vehiculo[]>([]);
  const getsistemasList = async() => {
    desserts.value = await sistemaStore.getvehicle()
  }

  const buttonsistemaForm = (id_v: any) => {
    router.push({ name: 'vehiculoForm', params: { id_v: id_v }})
  }

const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Fuerza', key: 'nombre_fuerza' },
  { title: 'Placa', key: 'placa' },
  { title: 'Chasis', key: 'chasis' },
  { title: 'Tipo', key: 'tipo_v' },
  { title: 'Color', key: 'color' },
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
      const { ok, message } = await sistemaStore.deleteVehiculo({"id":item})
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
                >Nuevo vehículo</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }: { item: Vehiculo }">
                <v-icon color="info" size="large" class="me-2" @click="buttonsistemaForm(item.id_v)">
                    mdi-pencil
                </v-icon>
                <v-icon color="error" size="large"  @click="deleteItem(item.id_v)">
                    mdi-delete
                </v-icon>
            </template>                    
          </v-data-table>
        </v-col>
    </v-row>
</template>
