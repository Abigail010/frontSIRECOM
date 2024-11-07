<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import profileBg from '@/assets/images/backgrounds/profilebg.jpg';
import back2 from '@/assets/images/misimagenes/min.png';

const page = ref({ title: 'Perfil' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: true,
    href: '/'
  },
  {
    text: 'Información de usuario',
    disabled: true,
    href: '#'
  }
]);

const nombres = JSON.parse(localStorage.getItem('user') || '').nombres
const apellido_paterno = JSON.parse(localStorage.getItem('user') || '').apellido_paterno
const apellido_materno = JSON.parse(localStorage.getItem('user') || '').apellido_materno
const nombre_perfil = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const nombre_usuario = JSON.parse(localStorage.getItem('user') || '').nombre_usuario
const cedula_identidad = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
const correo_electronico = JSON.parse(localStorage.getItem('user') || '').correo_electronico
const imagen = JSON.parse(localStorage.getItem('user') || '').imagen

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  
  <v-card elevation="10" class="overflow-hidden">
    <!-- <img :src="profileBg" alt="profile" class="w-100"/> -->
    <img :src="back2" alt="profile" class="w-100" height="150"/>
    <div>
      <v-row class="mt-1">
        <v-col cols="12" lg="12" class="d-flex justify-center order-sml-first mb-5">
          <div class="text-center top-spacer">
            <div class="avatar-border">
              <v-avatar size="120" class="userImage">
                <img :src="imagen" width="140" alt="ImagenUsuario" />
              </v-avatar>
            </div>
            <h5 class="text-h5 mt-3">{{ nombres }} {{ apellido_paterno }} {{ apellido_materno }}</h5>
            <span class="text-h6 font-weight-regular">{{ nombre_perfil }}</span>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>

  <v-row class="mt-4">
    <v-col cols="12" md="12">
      <v-card variant="outlined">
        <v-card-item>
          <h5 class="text-h5">Información Personal</h5>
          <div class="mt-5">
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Nombres</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="nombres"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Apellido Paterno</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="apellido_paterno"
                    hide-details
                    disabled
                  ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">        
                <v-label class="mb-2 font-weight-medium">Apellido Materno</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="email"
                  v-model="apellido_materno"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">        
                <v-label class="mb-2 font-weight-medium">Correo Electronico</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="correo_electronico"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Cedula de Identidad</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="cedula_identidad"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Nombre de Usuario</v-label>
                <v-text-field
                  color="primary"
                  variant="outlined"
                  type="text"
                  v-model="nombre_usuario"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.avatar-border {
    background-image: linear-gradient(rgb(80, 178, 252), rgb(244, 76, 102));
    border-radius: 50%;
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    .userImage {
        border: 4px solid rgb(255, 255, 255);
    }
}

.top-spacer {
    margin-top: -95px;
}

.profiletab .v-slide-group__content {
    justify-content: end;
    .v-btn--variant-text .v-btn__overlay {
        background: transparent;
    }
}

@media (max-width: 1023px) {
    .order-sm-second {
        order: 2;
    }
    .order-sml-first {
        order: 1;
    }
    .order-sm-third {
        order: 3;
    }
    .order-sm-last {
        order: 4;
    }
}

.btn-brand-facebook {
    background-color: rgb(24, 119, 242) !important;
}

.btn-brand-twitter {
    background-color: rgb(29, 161, 242) !important;
}
.btn-brand-dribbble {
    background-color: rgb(234, 76, 137) !important;
}
.btn-brand-youtube {
    background-color: rgb(205, 32, 31) !important;
}
</style>
