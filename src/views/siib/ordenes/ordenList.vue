<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useTallerStore } from '@/stores/resources/taller';
import { useOrdenStore } from '@/stores/orden/orden';



import Swal from 'sweetalert2'
const orden = useOrdenStore()

const tallerStore = useTallerStore()
const page = ref({ title: 'Orden de Mantenimiento' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de Ordenes de Mantenimiento',
    disabled: true,
    href: '#'
  }
]);

const desserts = ref([]) as any
const getOrdenes_sol = async() => {
    desserts.value = await orden.getOrdenes_soli()
}

  const buttonDepositForm = (id_orden: any) => {
    router.push({ name: 'ordenForm', params: { id_orden: id_orden }})
  }
  const buttonRegistro = (id_orden: any) => {
    router.push({ name: 'registroForm', params: { id_orden: id_orden }})
  }
  const getestado = (estado) => {
      return estado === 'EN PROCESO' ? 'estado-1' : estado === 'ENTREGADO' ? 'estado-2' : estado === 'FINALIZADO' ? 'estado-3' :'';
    };
  // nuevo data table
// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Fecha ', key: 'fecha' },
  { title: 'Placa', key: 'placa' },
  { title: 'Chasis', key: 'chasis' },
  { title: 'Conductor', key: 'conductor' },
  { title: 'Mecanico', key: 'mecanico' },
  { title: 'Taller', key: 'nombre_taller' },
  { title: 'Ciudad', key: 'ciudad' },
 
  { title: 'Estado', key: 'estado' },

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
      const { ok, message } = await tallerStore.deleteTaller({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getOrdenes_sol()
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
  getOrdenes_sol()
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
        <template v-slot:item.estado="{ item }">
             <span :class="getestado(item.estado)">{{ item.estado }}</span>
        </template>
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
                @click="buttonDepositForm(0)" 
              > Nueva orden </v-btn>
            </v-toolbar>                        
          </template>
          
          <template v-slot:item.actions="{ item }">
              <v-icon color="info" size="large" class="me-2" @click="buttonDepositForm(item.id)">
                  mdi-pencil
              </v-icon>
              <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Descripcion de trabajo"
                  height="25"
                  width="25"
                  color="secondary"
                  text="hola"
                  @click="buttonRegistro(item.id)"
                >
                <ReportIcon style="cursor: pointer;"></ReportIcon>

              </v-btn>
              <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Solicitud de repuestos"
                  height="25"
                  width="25"
                  color="warning"
                  text="hola"
                  @click="buttonRegistro(item.id)"
                >
                <ReportIcon style="cursor: pointer;"></ReportIcon>
                
              </v-btn>
              <v-btn
                  v-if="!item.condicion"
                  class=""
                  size="x-small"
                  title="Entregar"
                  height="25"
                  width="25"
                  color="light"
                  @click="buttonApprove(item.id)"
                >
                  <FileCheckIcon style=" cursor: pointer;"></FileCheckIcon>
                </v-btn>

          </template>                    
        </v-data-table>
      </v-col>
  </v-row>
</template>
<style scoped>

.estado-1{
  background-color: rgb(79, 190, 79);
  padding: 8px 5px;
  border-radius: 10px;
  color: white;
  text-align: center;
}
.estado-2{
  background-color: rgb(36, 174, 192);
  padding: 8px 5px;
  border-radius: 10px; 
  variant:"flat"; 
  color: white; text-align: center;
}
.estado-3{
  background-color: rgb(194, 26, 35);
  padding: 8px 5px;
  border-radius: 10px; 
  variant:"flat"; 
  color: white; text-align: center;
}
</style>