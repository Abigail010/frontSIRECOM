<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useUserStore } from '@/stores/resources/user';
import Swal from 'sweetalert2'
const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const userStore = useUserStore()

const page = ref({ title: 'Usuario' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de usuarios',
    disabled: true,
    href: '#'
  }
]);

const desserts = ref([]) as any
const getUsersList = async() => {
  if(userProfile.includes('SUPER ADMINISTRADOR')){
  desserts.value = await userStore.users()
 /// console.log(desserts.value)
  }else{
    desserts.value = await userStore.usersM()
  }
}

  const buttonUserForm = (id_usuario: any) => {
    ///console.log(id_usuario)
    router.push({ name: 'userForm', params: { id_usuario: id_usuario }})
  }

// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
 
  { title: 'Nombres', key: 'nombres' },
  { title: 'Apellido Paterno', key: 'apellido_paterno' },
  { title: 'Apellido Materno', key: 'apellido_materno' },
  { title: 'Cedula', key: 'cedula_identidad' },
  { title: 'Perfil', key: 'nombre_perfil' },
  { title: 'Taller', key: 'nombre_taller' },
  { title: 'Usuario', key: 'nombre_usuario' },
  { title: 'Departamento', key: 'departamento' },
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
    const { ok, message } = await userStore.deleteUser({"id":item})
    const icono = (ok ? 'success' : 'error')
    if(ok){
      await getUsersList()
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
  getUsersList()
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
            :sort-by="[{ key: 'nombres', order: 'asc' }]" 
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
                  @click="buttonUserForm(0)" 
                >Nuevo Usuario</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon color="info" size="large" class="me-2" @click="buttonUserForm(item.id_user)">
                    mdi-pencil
                </v-icon>
                <v-icon color="error" size="large"  @click="deleteItem(item.id_user)">
                    mdi-delete
                </v-icon>
            </template>                    
          </v-data-table>
        </v-col>
    </v-row>
</template>
