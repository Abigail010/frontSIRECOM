<script setup lang="ts">

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useOrdenStore } from '@/stores/orden/orden';
import { useRegisterStore } from '@/stores/orden/registro';
import { useSoliStore } from '@/stores/orden/soli_rep';
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2'
const soli_Rep = useSoliStore()
const orden = useOrdenStore()
const registro = useRegisterStore()

const us:any = JSON.parse(localStorage.getItem('user') || '').id_perfil
const page = ref({ title: 'Mantenimientos' });
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

  const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil

  const state = reactive({
    formData: {
      total:'', 
      permiso:'',
    }, 
  });

  const ButtonReport2 = async (item: any) => {
  const data2 = await registro.minutesReport(item);
  }

  interface Man {
  id: number;
  estado:String;
}

  //const desserts = ref([]) as any
  const desserts = ref<Man[]>([]);
  const getOrdenes_sol = async() => {
  if(userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DE TALLER')  || us == 1){
    desserts.value = await orden.getOrdenes_soli()
  }else{
    if(userProfile.includes('MECANICO') || us == 4){
      desserts.value = await orden.getOrdenM()
    }
    else{
    desserts.value = await orden.getOrdenU()
  }
  }
}

  const buttonDepositForm = (id_orden: any) => {
    router.push({ name: 'ordenForm', params: { id_orden: id_orden }})
  }
  const buttonRegistro = (id_orden: any) => {
    router.push({ name: 'registroForm', params: { id_orden: id_orden }})
  }
  const buttonEstadoRep = (id_orden: any) => {
    router.push({ name: 'soliRepForm', params: { id_orden: id_orden }})
  }
  const getestado = (estado: any) => {
      return estado === 'EN PROCESO' ? 'estado-1' : estado === 'ENTREGADO' ? 'estado-2' : estado === 'FINALIZADO' ? 'estado-33' :'';
    };
  // nuevo data table
// nuevo data table
const headers = ref([
  { title: 'Acciones', key: 'actions', sortable: false },
  { title: 'Fecha ', key: 'fecha' },
  { title: 'Placa', key: 'placa' },
  { title: 'Chasis', key: 'chasis' },
  { title: 'Conductor', key: 'conductor' },
  { title: 'Mecánico', key: 'mecanico' },
  { title: 'Taller', key: 'nombre_taller' },
  { title: 'Ciudad', key: 'ciudad' },
  { title: 'Estado', key: 'estado' },

])

const buttonApprove = async (item: any) => {
    await registro_id(item);  // Wait for the state update
 
    if (state.formData.permiso === 'Entrega exitosa') {
    
        Swal.fire({
      title: '¿Estas seguro de realizar la entrega?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, aprobar'
    }).then(async (result) => {
      if (result.isConfirmed) {
     const { ok, message }  = await orden.updateentrega({"id":item})
      const icono = (ok ? 'success' : 'error')
        Swal.fire({
          icon: icono,
          title: message,
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        })
        getOrdenes_sol()
      }
    })
            
    }
   else {
        Toast.fire({
              icon: 'error',
              title: 'Aun quedan repuestos pendientes de entrega'
     })
    }
  }

const registro_id = async (id_orden: any) => {
    const res2 = await soli_Rep.getTotal(id_orden);
    state.formData.total = res2.total;

    if (state.formData.total === '0') {
       state.formData.permiso = 'Entrega exitosa';
    } else {
      state.formData.permiso = 'No se puede realizar';
    }
};

  const buttonApprove2 = (item: any) => {

    Swal.fire({
      title: '¿Estas seguro de aceptar la entrega?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, aprobar'
    }).then(async (result) => {
      if (result.isConfirmed) {
     const { ok, message }  = await orden.updatefinalizado({"id":item})
      const icono = (ok ? 'success' : 'error')
        Swal.fire({
          icon: icono,
          title: message,
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        })
        getOrdenes_sol()
      }
    })
  }

  const buttonDelete = (item: any) => {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, cancelar mantenimiento'
    }).then(async (result) => {
      if (result.isConfirmed) {
     const { ok, message }  = await orden.deleteEntrega({"id":item})
      const icono = (ok ? 'success' : 'error')
        Swal.fire({
          icon: icono,
          title: message,
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        })
        getOrdenes_sol()
      }
    })
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
          :search="search" >
        <template v-slot:item.estado="{item}:{ item:Man}">
             <span :class="getestado(item.estado)">{{item.estado}}</span>
        </template>
          <template v-slot:top>
            <v-toolbar class="bg-lightprimary" flat>
              <v-text-field
                class="ml-2"
                v-model.trim="search" 
                append-inner-icon="mdi-magnify" 
                label="Busqueda" 
                hide-details  />
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn v-if="(userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DEL TALLER') || userProfile == 'SUPERVISOR DE MANTENIMIENTO') || ( us == 1 || us==2 || us== 3)"
                color="primary"  
                variant="flat" 
                dark   
                @click="buttonDepositForm(0)"  > Nuevo ingreso</v-btn>
            </v-toolbar>                        
          </template>
          <template v-slot:item.actions="{ item } : {item:Man}">
              <v-icon v-if="userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DEL TALLER') ||   userProfile.includes('SUPERVISOR DE MANTENIMIENTO') || (us==1 || us == 2 || us == 3) "
                  color="info" size="large" class="me-2" @click="buttonDepositForm(item.id)">
                  mdi-pencil
              </v-icon>
              <v-btn v-if="userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DEL TALLER') ||   userProfile.includes('SUPERVISOR DE MANTENIMIENTO') ||  userProfile.includes('MECANICO')  || (us==1 || us==2 || us==3 || us== 4)"
                  class="mr-1"
                  size="x-small"
                  title="Orden de Mantenimiento"
                  height="25"
                  width="25"
                  color="secondary"
                  text="hola"
                  @click="buttonRegistro(item.id)">
                <ReportIcon style="cursor: pointer;"></ReportIcon>
              </v-btn>
              <v-btn v-if="userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DE TRANSPORTE') || userProfile.includes('PERSONAL DE ENTREGA') || (us==1 || us == 6 || us == 5) "
                  class="mr-1"
                  size="x-small"
                  title="Entrega de repuestos"
                  height="25"
                  width="25"
                  color="warning"
                  text="hola"
                  @click="buttonEstadoRep(item.id)" >
                <ReportIcon style="cursor: pointer;"></ReportIcon>    
              </v-btn>
              <v-btn  v-if="item.estado == 'EN PROCESO' && (userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DEL TALLER') || userProfile.includes('MECANICO') || (us==1 || us == 2 || us == 4) )   "
                  class="mr-1"
                  size="x-small"
                  title="Entregar"
                  height="25"
                  width="25"
                  color="error"
                  @click="buttonApprove(item.id)">
                  <FileCheckIcon style=" cursor: pointer;"></FileCheckIcon>
                </v-btn>
                <v-btn v-if="item.estado == 'ENTREGADO' && (userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DEL TALLER') || userProfile.includes('SUPERVISOR DE MANTENIMIENTO')  || (us==1 || us == 2 || us == 3)) "
                  class="mr-1 estado-3"
                  size="x-small"
                  title="Rechazar entrega de mantenimiento"
                  height="25"
                  width="25"
                  @click="buttonDelete(item.id)" >
                  <FileIcon style=" cursor: pointer;"></FileIcon>
                </v-btn>
                <v-btn  v-if="item.estado == 'ENTREGADO' && (userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DEL TALLER') || userProfile.includes('SUPERVISOR DE MANTENIMIENTO') || (us==1 || us == 2 || us == 3) ) "
                  class=""
                  size="x-small"
                  title="Entrega de vehiculo"
                  height="25"
                  width="25"
                  color="success"
                  @click="buttonApprove2(item.id)" >
                  <FileCheckIcon style=" cursor: pointer;"></FileCheckIcon>
                </v-btn>
                <v-btn  v-if="item.estado == 'FINALIZADO' && (userProfile.includes('SUPER ADMINISTRADOR') || userProfile.includes('RESPONSABLE DE TRANSPORTE') || userProfile.includes('RESPONSABLE DEL TALLER') || userProfile.includes('SUPERVISOR DE MANTENIMIENTO') || (us==1 || us == 2 || us == 3)) "
                  class=""
                  size="x-small"
                  title="Reporte de Mantenimiento"
                  height="25"
                  width="25"
                  color="primary"
                  @click="ButtonReport2(item.id)" >
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
.estado-33{
  background-color: #051d49;
  padding: 8px 5px;
  border-radius: 10px; 
  variant:"flat"; 
  color: white; text-align: center;
}
.estado-3{
  background-color: rgb(194, 26, 35);

  color: white; text-align: center;
}
</style>