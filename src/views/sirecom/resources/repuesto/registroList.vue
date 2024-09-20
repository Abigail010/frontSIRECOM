<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRegisterRStore } from '@/stores/resources/register_rep';
import Swal from 'sweetalert2'

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

const desserts = ref([]) as any
const getRegisterRList = async() => {
    desserts.value = await RegisterRStore.getRegisterRs() 
}

  const buttonDepositForm = (id: any) => {
    router.push({ name: 'registerForm', params: { id: id }})
  }



  // nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'N° de partida', key: 'nro_partida' },
  { title: 'Cantidad de repuestos', key: 'cantidad' },
  { title: 'Total', key: 'total' },
  { title: 'Observacion', key: 'observacion' },

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
              >Registro de Repuestos</v-btn>
            </v-toolbar>                        
          </template>
          <template v-slot:item.actions="{ item }">
              <v-icon color="info" size="large" class="me-2" @click="buttonDepositForm(item.id)">
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

<style >
.tipo-externo{
  background-color: rgb(82, 209, 82);
  padding: 8px 5px;
  border-radius: 10px;
  color: white;
  text-align: center;
}
.tipo-externo2{
  background-color: rgb(36, 174, 192);
  padding: 8px 5px;
  border-radius: 10px; 
  variant:"flat"; 
  color: white; text-align: center;
}

.tipo-propio{
  background-color: rgb(0, 140, 255)(153, 0, 255);
  color: white;
}

</style>