<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useUserStore } from '@/stores/resource/user';
import Swal from 'sweetalert2'
import {
  DxDataGrid,
  DxFilterRow,
  DxColumn,
  DxSearchPanel,
  DxPaging,
  DxPager,
} from "devextreme-vue/data-grid";
import "devextreme/dist/css/dx.light.css";
const userStore = useUserStore()

const page = ref({ title: 'Búsqueda' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Caso',
    disabled: true,
    href: '#'
  }
]);

  const usuarios = ref([])
  const getUsersList = async() => {
    usuarios.value = await userStore.users() 
  }

  const buttonUserForm = (id_usuario: any) => {
    router.push({ name: 'userForm', params: { id_usuario: id_usuario }})
  }

  const buttonDismissUser = (id_usuario: any) => {
    Swal.fire({
      title: 'Estas seguro?',
      text: "No se podra revertir el cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await userStore.deleteUser({id: id_usuario})
        Swal.fire(
          'Eliminado!',
          'Usuario eliminado correctamente.',
          'success'
        )
        await getUsersList()
      }
    })
  }

  onMounted(() => {
    getUsersList()
  });

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">

      <v-row>
        <v-col cols="12">
          <v-btn color="primary" class="ml-auto" @click="buttonUserForm(0)">
            <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Nuevo Usuario
          </v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <DxDataGrid
            id="gridContainer"
            ref="dataGridRef"
            :data-source="usuarios"
            key-expr="id"
            :allow-column-reordering="false"
            :row-alternation-enabled="true"
            :show-borders="true"
            :column-auto-width="true"
          >
            <!-- Inicio de Complementos para el datatable -->
            <DxFilterRow :visible="true" />
            <DxSearchPanel :visible="true" />
            <DxPaging :page-size="10" />
            <DxPager
              :visible="true"
              :show-page-size-selector="true"
            />
            <!-- <DxGroupPanel :visible="true" /> -->
            <!-- <DxGrouping :auto-expand-all="false" /> -->
            <!-- <DxSelection mode="multiple" /> -->
          <!-- Fin de Complementos para el datatable -->
            <DxColumn
              :min-width="100"
              :allow-sorting="false"
              caption="Acciones"
              cell-template="cellTemplate"
            />
            <template #cellTemplate="{ data }">
              <div class="text-center">
                <v-btn
                  class="mr-1"
                  size="x-small"
                  title="Editar usuario"
                  height="25"
                  width="25"
                  color="primary"
                  text="hola"
                  @click="buttonUserForm(data.data.id)"
                >
                  <EditIcon style=" cursor: pointer;"></EditIcon>
                </v-btn>
                <v-btn
                  class=""
                  size="x-small"
                  title="Eliminar usuario"
                  height="25"
                  width="25"
                  color="error"
                  @click="buttonDismissUser(data.data.id)"
                >
                  <TrashIcon style=" cursor: pointer;"></TrashIcon>
                </v-btn>
              </div>
            </template>
            <DxColumn
              :min-width="150"
              :allow-sorting="true"
              caption="Nombres"
              data-field="nombres"
            />
            <DxColumn
              :min-width="150"
              :allow-sorting="true"
              caption="Apellido Paterno"
              data-field="apellido_paterno"
            />
            <DxColumn
              :min-width="150"
              :allow-sorting="true"
              caption="Apellido Materno"
              data-field="apellido_materno"
            />
            <DxColumn
              :min-width="100"
              :allow-sorting="true"
              caption="Cedula de Identidad"
              data-field="cedula_identidad"
            />
            <DxColumn
              :min-width="150"
              :allow-sorting="true"
              caption="Perfil"
              data-field="nombre_perfil"
            />
            <DxColumn
              :min-width="100"
              :allow-sorting="true"
              caption="Oficina"
              data-field="nombre_oficina"
            />
            <DxColumn
              :min-width="100"
              :allow-sorting="true"
              caption="Nombre de Usuario"
              data-field="nombre_usuario"
            />
            <DxColumn
              :min-width="100"
              :allow-sorting="true"
              caption="Correo Electronico"
              data-field="correo_electronico"
            />
            <DxColumn
              :min-width="100"
              :allow-sorting="true"
              caption="Celular"
              data-field="celular"
            />
          </DxDataGrid>
        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>
