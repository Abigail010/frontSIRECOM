<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useUserStore } from '@/stores/resources/solicitudDab';
import Swal from 'sweetalert2'

const userStore = useUserStore()

const page = ref({ title: 'Listado de Solicitudes D.A.B' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de formularios',
    disabled: true,
    href: '#'
  }
]);

const desserts = ref([]) as any
const getdabs = async() => {
  desserts.value = await userStore.dabs()
}

  const buttonUserForm = (id_usuario: any) => {
    router.push({ name: 'dabForm', params: { id_usuario: id_usuario }})
  }

// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Fecha Solicitud', key: 'fecha_s' },
  { title: 'Codigo D.A.B', key: 'codigo_dab' },
  { title: 'Solicitante', key: 'solicitante' },
  { title: 'Caracteristicas del bien', key: 'nombre_bien' },
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
    const { ok, message } = await userStore.deleteUser({"id":item})
    const icono = (ok ? 'success' : 'error')
    if(ok){
      await getdabs()
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
  getdabs()
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
                >Nuevo Registro</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon color="info" size="large" class="me-2" @click="buttonUserForm(item.id)">
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
