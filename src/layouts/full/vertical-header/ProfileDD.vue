<script setup lang="ts">
import { MailIcon } from 'vue-tabler-icons';
import { profileDD } from '@/_mockApis/headerData';
import proUser2 from '@/assets/images/svgs/icon-inbox.svg';
import { useAuthStore } from '@/stores/auth';
import { useSearchStore } from '@/stores/resources/busqueda';
import card_icon1 from "@/assets/images/svgs/icon-user-male.svg"
import { ref, reactive, onMounted } from 'vue';
const orden = useSearchStore()
const userProfile:any = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
const authStore = useAuthStore();

const state = reactive({
    formData: {
      id: '',
      nro_usuarios: '',
      nombre:'',
      correo:'', 
      title2:'',
      dato2:'', 
      title3:'',
      dato3:'',
      title4:'',
      dato4:'', 
      title5:'',
      dato5:'', 
      title6:'',
      dato6:'',  
      estado: '',
    }
  });

  const getGen = async () => {
    const info = await orden.getInfoB();
    state.formData.nombre = info.nombres+ ' '+ info.apellido_paterno+' ' +info.apellido_materno
    state.formData.correo = info.correo_electronico
   
}

onMounted(async () => {
 await getGen()
  //await buttonReport()
})
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
        
        
           
        
        <template v-slot:activator="{ props }">
            <v-btn v-if="userProfile === 'SUPER ADMINISTRADOR'"
                class="custom-" 
                variant="text" 
                icon 
                href="https://1drv.ms/b/s!AnQTBJ2Uzpo4k49AyGjYjeuTmAb99g?e=gxjWQn" 
                target="_blank"
                >
                <v-avatar size="35">
                    <img src="@/assets/images/misimagenes/manual.png" width="35" alt="Manual" />
                </v-avatar>
                </v-btn>
                <v-btn v-else-if="userProfile === 'RESPONSABLE DEL TALLER'"
                class="custom-" 
                variant="text" 
                icon 
                href="https://1drv.ms/b/c/642cdce85c43fd48/EdDzRrP3zSRChL56pik7q0MBoRi6GyXHyqiarNncmHP6AA?e=0RHNrf" 
                target="_blank"
                >
                <v-avatar size="35">
                    <img src="@/assets/images/misimagenes/manual.png" width="35" alt="Manual" />
                </v-avatar>
                </v-btn>
                <v-btn v-else-if="userProfile === 'SUPERVISOR DE MANTENIMIENTO'"
                class="custom-" 
                variant="text" 
                icon 
                href="https://1drv.ms/b/s!AnQTBJ2Uzpo4k487PDVpHur3lwceMg?e=q2nS9C" 
                target="_blank"
                >
                <v-avatar size="35">
                    <img src="@/assets/images/misimagenes/manual.png" width="35" alt="Manual" />
                </v-avatar>
                </v-btn>
                <v-btn v-else-if="userProfile === 'PERSONAL DE ENTREGA'"
                class="custom-" 
                variant="text" 
                icon 
                href="https://1drv.ms/b/s!AnQTBJ2Uzpo4k485yzGKrWvvyJTVzQ?e=jrGuvb" 
                target="_blank"
                >
                <v-avatar size="35">
                    <img src="@/assets/images/misimagenes/manual.png" width="35" alt="Manual" />
                </v-avatar>
                </v-btn>
                <v-btn v-else-if="userProfile === 'MECANICO'"
                class="custom-" 
                variant="text" 
                icon 
                href="https://1drv.ms/b/s!AnQTBJ2Uzpo4k486vUgl5AzLYN_G2A?e=ZkvBQ3" 
                target="_blank"
                >
                <v-avatar size="35">
                    <img src="@/assets/images/misimagenes/manual.png" width="35" alt="Manual" />
                </v-avatar>
                </v-btn><v-btn v-else-if="userProfile === 'RESPONSABLE DE TRANSPORTE'"
                class="custom-" 
                variant="text" 
                icon 
                href="https://1drv.ms/b/s!AnQTBJ2Uzpo4k48_NmmbtczhhTKABQ?e=QITLdn" 
                target="_blank"
                >
                <v-avatar size="35">
                    <img src="@/assets/images/misimagenes/manual.png" width="35" alt="Manual" />
                </v-avatar>
                </v-btn>
            <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <img  src="@/assets/images/misimagenes/logo.png" width="35" alt="Julia" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pt-6">
                <h6 class="text-h5 font-weight-medium"><b> Usuario:</b> </h6>
                <div class="d-flex align-center mt-4 pb-6">
                    <v-avatar size="80">
                        <img  src="@/assets/images/misimagenes/logo.png" width="80" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-h6 mb-n1">{{ state.formData.nombre }}</h6>
                        <span class="text-subtitle-1 font-weight-regular textSecondary">{{ userProfile }}</span>
                        <div class="d-flex align-center mt-1">
                            <MailIcon size="18" stroke-width="1.5" />
                            <span class="text-subtitle-1 font-weight-regular textSecondary ml-2">{{ state.formData.correo }}</span>
                        </div>
                    </div>
                </div>
                <v-divider></v-divider>
            </div>
            <perfect-scrollbar style="height: calc(100vh - 140px); max-height: 60px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in profileDD" :key="item.title" class="py-4 px-8 custom-text-primary" :to="item.href">
                        <template v-slot:prepend>
                            <v-avatar size="48" color="lightprimary" class="mr-3" rounded="md">
                                <v-img :src="item.avatar" width="24" height="24" :alt="item.avatar" />
                            </v-avatar>
                        </template>
                        <div>
                            <h6 class="text-subtitle-1 font-weight-bold mb-2 custom-title">{{ item.title }}</h6>
                        </div>
                        <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.subtitle }}</p>
                    </v-list-item>
                    <br>
                </v-list>
            </perfect-scrollbar>
     
        <!----   <div class="px-8 py-3">
                <div class="bg-lightprimary rounded-md pa-5 overflow-hidden position-relative">
                    <h5 class="text-h6">
                        Unlimited<br />
                        Access
                    </h5>
                    <v-btn variant="flat" color="primary" class="mt-3">Upgrade</v-btn>
                    <img src="@/assets/images/backgrounds/unlimited-bg.png" alt="bg-img" class="right-pos-img" />
                </div>
            </div>-->
            <div class="pt-4 pb-6 px-8 text-center">
                <v-btn color="primary" variant="outlined" block @click="authStore.logout()">Salir</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
