<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRegisterRStore } from '@/stores/resources/register_rep';
import Swal from 'sweetalert2'
const usertaller:any = JSON.parse(localStorage.getItem('user') || '').id_perfil

const usert:any = JSON.parse(localStorage.getItem('user') || '').id_taller
const RegisterRStore = useRegisterRStore()

const page = ref({ title: 'Registro de repuestos' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de Registros',
    disabled: true,
    href: '#'
  }
]);

interface Man {
  id: number;
  cantidad: number;
  entregado: number;
}

  //const desserts = ref([]) as any
  const desserts = ref<Man[]>([]);
const getRegisterRList = async() => {
    desserts.value = await RegisterRStore.getRegisterRs() 
}

  const buttonDepositForm = (id: any) => {
    router.push({ name: 'registerForm', params: { id: id }})
  }

  const getTipoClass = (cantidad: any) => {
  
  // Verifica si la cantidad es numérica antes de comparar
  return cantidad <=0 ? 'tipo-ex' : 'tipo-ex2';

  // Si cantidad es una cadena específica
  //return cantidad === 'EXTERNO' ? 'tipo-externo' : '';
};


  // nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'N° de partida', key: 'nro_partida' },
  
  { title: 'Cantidad de repuestos', key: 'cantidad' },
  { title: 'Total', key: 'total' },
  { title: 'Observación', key: 'observacion' },

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
      const { ok, message } = await RegisterRStore.deleteRegisterR({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getRegisterRList()
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
  getRegisterRList()
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
        <template v-slot:item.cantidad="{ item }:{item:Man}">
             <span :class="getTipoClass(item.cantidad)">{{ item.cantidad }}</span>
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
              <v-btn  v-if="usertaller == 1 || usert == 1"
                color="primary"  
                variant="flat" 
                dark   
                @click="buttonDepositForm(0)" 
              >Registro de Repuestos</v-btn>
            </v-toolbar>                        
          </template>
          <template  v-if="usertaller == 1 || usert == 1" v-slot:item.actions="{ item } : { item : Man }">
              <v-icon color="info" size="large" class="me-2" @click="buttonDepositForm(item.id)">
                  mdi-pencil
              </v-icon>
              <v-icon v-if="item.entregado == 0"

              color="error" size="large"  @click="deleteItem(item.id)">
                  mdi-delete
              </v-icon>
          </template>                    
        </v-data-table>
      </v-col>
  </v-row>
</template>

<style >
.tipo-ex{
 
  padding: 8px 5px;
  border-radius: 10px;
  color: rgb(185, 11, 11);
  text-align: center;
  font-weight: bold;
}
.tipo-ex2{
  
  padding: 8px 5px;
  border-radius: 10px; 
  variant:"flat"; 
  color: black; text-align: center;
}

.tipo-propio{
  background-color: rgb(0, 140, 255)(153, 0, 255);
  color: white;
}

</style>