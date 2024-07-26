<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useImmovablePropertyBrickworkStore } from '@/stores/resources/immovablePropertyBrickwork';
import Swal from 'sweetalert2'

const immovablePropertyBrickworkStore = useImmovablePropertyBrickworkStore()

const page = ref({ title: 'Acabado de Albañileria' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Listado de Acabados de Albañileria',
    disabled: true,
    href: '#'
  }
]);

const desserts = ref([]) as any
const getImmovablePropertyBrickworkList = async() => {
    desserts.value = await immovablePropertyBrickworkStore.immovablePropertyBrickworks()
  }

const buttonImmovablePropertyBrickworkForm = (id_acabado: any) => {
  router.push({ name: 'immovablePropertyBrickworkForm', params: { id_acabado: id_acabado }})
}

// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Acabado', key: 'nombre_acabado_albanileria' },
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
      const { ok, message } = await immovablePropertyBrickworkStore.deleteImmovablePropertyBrickwork({"id":item})
      const icono = (ok ? 'success' : 'error')
      if(ok){
        await getImmovablePropertyBrickworkList()
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
  getImmovablePropertyBrickworkList()
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
            :sort-by="[{ key: 'nombre_acabado_albanileria', order: 'asc' }]" 
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
                  @click="buttonImmovablePropertyBrickworkForm(0)" 
                >Nuevo tipo acabado</v-btn>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon color="info" size="large" class="me-2" @click="buttonImmovablePropertyBrickworkForm(item.id)">
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
