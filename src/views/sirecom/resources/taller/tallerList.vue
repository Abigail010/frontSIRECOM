<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useTallerStore } from '@/stores/resources/taller';
import Swal from 'sweetalert2'
const usertaller:any = JSON.parse(localStorage.getItem('user') || '').id_perfil
const usert:any = JSON.parse(localStorage.getItem('user') || '').id_taller

const tallerStore = useTallerStore()

const page = ref({ title: 'Taller' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de talleres',
    disabled: true,
    href: '#'
  }
]);

interface Man {
  id_taller: number;
  tipo: string;
}

  //const desserts = ref([]) as any
  const desserts = ref<Man[]>([]);
const getTallerList = async() => {
   // desserts.value = await tallerStore.tallers() 
   if( (usert==1  ||  usertaller ==1 )){
  desserts.value = await tallerStore.tallers() 
  
  }else{
    desserts.value = await tallerStore.tallersD() 
  }
   
}
  const buttonDepositForm = (id_taller: any) => {
    router.push({ name: 'tallerForm', params: { id_taller: id_taller }})
  }

  const getTipoClass = (tipo: any) => {
      return tipo === 'PROPIO' ? 'tipo-externo2' : tipo === 'EXTERNO' ? 'tipo-externo' : '';
    };

  // nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Taller', key: 'nombre_taller' },
  { title: 'Fuerza', key: 'fuerza' },
  { title: 'Departamento', key: 'ciudad' },
  { title: 'Direccion', key: 'direccion' },
  { title: 'Servicio', key: 'servicio' },
    { title: 'Tipo', key: 'tipo' },

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
      const { ok, message } = await tallerStore.deleteTaller({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getTallerList()
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
  getTallerList()
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
        <template v-slot:item.tipo="{ item }:{item : Man}">
             <span :class="getTipoClass(item.tipo)">{{ item.tipo }}</span>
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
              <v-btn v-if="usertaller==1 || usert==1"
                color="primary"  
                variant="flat" 
                dark   
                @click="buttonDepositForm(0)" 
              >Nuevo taller</v-btn>
            </v-toolbar>                        
          </template>
          <template v-slot:item.actions="{ item }:{item:Man}">
              <v-icon color="info" size="large" class="me-2" @click="buttonDepositForm(item.id_taller)">
                  mdi-pencil
              </v-icon>
              <v-icon v-if="item.id_taller != 1" color="error" size="large"  @click="deleteItem(item.id_taller)">
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