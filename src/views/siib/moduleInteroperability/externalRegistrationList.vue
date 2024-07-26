<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { router } from '@/router';
import { useExternalRegistrationStore } from '@/stores/moduleInteroperability/externalRegistration';
import Logo from '@/layouts/full/logo/Logo.vue';
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router'

const route = useRoute()
const externalRegistrationStore = useExternalRegistrationStore()

const page = ref({ title: 'Delito' });

const desserts = ref([]) as any
const estado1 = ref(route.params.estado) as any
const tipo1 = ref(route.params.tipo) as any


const getExternalRegistrationsList = async() => {
    desserts.value = await externalRegistrationStore.externalRegistrations(estado1.value, tipo1.value)
}

const buttonCrimeForm = (id_delito: any) => {
    router.push({ name: 'crimeForm', params: { id_delito: id_delito }})
}

const buttonVerForm = (id: any) => {
    router.push({ name: 'externalRegistrationFormReview', params: { id: id }})
}
let estado_tipo = ''
// Computed para cambiar los headers según la variable headerType
const computedHeaders = computed(() =>  {
        estado_tipo = route.params.estado + '_' + route.params.tipo
        
        estado1.value = route.params.estado
        tipo1.value = route.params.tipo
        getExternalRegistrationsList()
        switch (estado_tipo) {
            case 'pendiente_natural':
                return [
                    { title: 'Acciones', key: 'actions', sortable: false },
                    { title: 'Estado', key: 'estado_solicitud' },
                    { title: 'Cedula de Identidad', key: 'cedula_identidad' },
                    { title: 'Nombres', key: 'nombres' },
                    { title: 'Ap. Paterno', key: 'apellido_paterno' },
                    { title: 'Ap. Materno', key: 'apellido_materno' }
                ];
            case 'pendiente_juridica':
                return [
                    { title: 'Acciones', key: 'actions', sortable: false },
                    { title: 'Estado', key: 'estado_solicitud' },
                    { title: 'NIT', key: 'nit' },
                    { title: 'Razon Social', key: 'razon_social' },
                    { title: 'Nombre Empresa', key: 'nombre_empresa' },
                ];
            case 'aprobado_natural':
                return [
                    { title: 'Acciones', key: 'actions', sortable: false },
                    { title: 'Estado', key: 'estado_solicitud' },
                    { title: 'Cedula de Identidad', key: 'cedula_identidad' },
                    { title: 'Nombres', key: 'nombres' },
                    { title: 'Ap. Paterno', key: 'apellido_paterno' },
                    { title: 'Ap. Materno', key: 'apellido_materno' }
                ];
            case 'aprobado_juridica':
                return [
                    { title: 'Acciones', key: 'actions', sortable: false },
                    { title: 'Estado', key: 'estado_solicitud', sortable: false  },
                    { title: 'NIT', key: 'nit' },
                    { title: 'Razon Social', key: 'razon_social' },
                    { title: 'Nombre Empresa', key: 'nombre_empresa' },
                ];
            default:
        return [];
      }
    });


// nuevo data table
// const headers = ref([
//   { title: 'Acciones', key: 'actions', sortable: false },
//   { title: 'Cedula de Identidad', key: 'nombre_delito'},
//   { title: 'Nombres', key: 'id' },
// //   { title: 'Ap. Paterno', key: 'nombre_delito' },
// //   { title: 'Ap. Materno', key: 'nombre_delito' },
// //   { title: 'Estado', key: 'nombre_delito' },
// ])

// function deleteItem(item: any) {
//     Swal.fire({
//         title: "Estas seguro?",
//         text: "El proceso no podra ser revertido!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Si, eliminar!"
//     }).then(async (result) => {
//     if (result.isConfirmed) {
//       const { ok, message } = await crimeStore.deleteCrime({"id":item})
//       const icono = (ok ? 'success' : 'error')
//       if(ok){
//         await getCrimesList()
//       }
//       Toast.fire({
//         icon: icono,
//         title: message,
//       })
//         }
//     });
// } 

const search = ref() as any

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

onMounted(() => {
    getExternalRegistrationsList()
});
</script>

<template>
    <div class="d-flex justify-center py-4 mb-8"><Logo /></div>
    <div class="d-flex align-center text-center mb-6">
        <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
            <span class="bg-surface px-5 py-3 position-relative">LISTA DE ENTIDADES EXTERNAS ({{ route.params.estado.toUpperCase() }} - {{ route.params.tipo.toUpperCase() }})</span>
        </div> 
    </div>
    <v-row>
        <v-col cols="12">          
          <v-data-table 
            class="border rounded-md" 
            :headers="computedHeaders" 
            :items="desserts" 
            :sort-by="[
                // { key: 'nombre_delito', order: 'asc' },
                // { key: 'id', order: 'asc' },
                // { key: 'nombre_delito', order: 'asc' },
                // { key: 'id', order: 'asc' },
                // { key: 'nombre_delito', order: 'asc' }
                ]" 
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
                <v-spacer></v-spacer>
                <v-divider class="mx-4" inset vertical></v-divider>
              </v-toolbar>                        
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn class="size_fijo mr-2" size="small" color="primary"  @click="buttonVerForm(item.id)">
                    <EyeCheckIcon style="cursor: pointer;" class="mr-1"></EyeCheckIcon>Revisar
                </v-btn>
                <v-btn class="size_fijo" size="small" color="error" @click="buttonVerForm(item.id)">
                    <EyeCheckIcon style="cursor: pointer;" class="mr-1"></EyeCheckIcon>Rechazar Solicitud
                </v-btn>
                <!-- <v-icon color="info" size="large" class="me-2" @click="buttonCrimeForm(item.id)">
                    mdi-pencil
                </v-icon> -->
                <!-- <v-icon color="error" size="large"  @click="deleteItem(item.id)">
                    mdi-delete
                </v-icon> -->
            </template>       
            <template v-slot:item.estado_solicitud="{ item }">
                <v-chip color="primary" v-if="item.estado_solicitud == 'PENDIENTE'">
                    {{ item.estado_solicitud }}
                </v-chip>
                <v-chip color="error" v-else>
                    {{ item.estado_solicitud }}
                </v-chip>
            </template> 
          </v-data-table>
        </v-col>
    </v-row>
</template>
<!-- <style>
    .activo {
        color: green;
        font-weight: bold;
    }

    .inactivo {
        color: red;
        font-weight: bold;
    }
</style> -->