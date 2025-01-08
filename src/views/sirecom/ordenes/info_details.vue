<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { HeartIcon, UsersIcon, TrashIcon } from 'vue-tabler-icons';

import ProfileBanner from '@/components/apps/user-profile/ProfileBanner.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useOrdenStore } from '@/stores/orden/orden';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import { useFrinedsStore } from '@/stores/apps/userprofile/friends';
const route = useRoute()
import ColorCheckboxes from '@/components/forms/form-elements/checkbox/ColorCheckboxes.vue';
import CheckBox from '@/components/forms/form-validation/CheckBox.vue';
const orden = useOrdenStore()
const store = useFrinedsStore();
const checksColor = ref(['primary', 'secondary', 'success', 'error', 'warning']);
onMounted(() => {
    store.fetchFrineds();
});
const colorChecked = ref(true);
const getfriends: any = computed(() => {
    return store.friends;
});
const searchValue = ref('');
// dropdown data
const actionDD = ref([
    { title: 'Favorite', icon: HeartIcon },
    { title: 'Edit Friend List', icon: UsersIcon },
    { title: 'Remove', icon: TrashIcon }
]);
const page = ref({ title: 'Social Profile' });

const filteredCards = computed(() => {
    return getfriends.value.filter((card: any) => {
        return card.name.toLowerCase().includes(searchValue.value.toLowerCase());
    });
});

console.log('id '+ route.params.id)

const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/'
    },
    {
        text: 'Social Profile',
        disabled: true,
        href: '#'
    }
]);
const state = reactive({
    formData: {
      id_orden: '',
      total:'', 
      permiso:'',
      fecha_ingreso:'', 
      fuerza:'', 
      placa:'',
      taller:'',
      color:'', 
      tipo_ve:'', 
      departamento:'',
      mantenimiento:'', 
      fecha_salida:'',
      estado : '', 
      fecha_entrega :'',
      id_Rep:[] as any, 
    }, 
  });
  const checkbox = ref(false);
  const checkbox2 = ref(false);
const checkbox3 = ref(false);
const checkbox4 = ref(false);
const registro_id = async (id_orden: any) => {
    const res2 = await orden.basic(id_orden)
    state.formData.id_Rep = await orden.basic(id_orden)
  console.log(res2)
  state.formData.fecha_ingreso= res2[0].fecha_ingreso
   state.formData.fuerza = res2[0].fuerza
state.formData.tipo_ve = res2[0].tipo_v
state.formData.departamento= res2[0].ciudad
state.formData.taller = res2[0].nombre_taller
state.formData.fecha_salida = res2[0].entregado
state.formData.estado = res2[0].estado
state.formData.fecha_entrega = res2[0].fecha_entrega
state.formData.mantenimiento = res2[0].tipo
   if(res2[0].placa !='S/P' ){
    state.formData.placa = res2[0].placa
   }else{
    state.formData.placa = res2[0].chasis
   }
if(res2[0].entregado === null ){
    state.formData.fecha_salida = 'PENDIENTE DE ENTREGA'
    
}else{
    checkbox4.value =true
}
    if(res2[0].id!=0){
        checkbox.value =true
    }
    if(res2[0].tipo !== ''){
        checkbox2.value =true
    }
    if(res2[0].total === '0'){
          state.formData.fecha_salida = 'ENTREGA FINALIZADA'
    }else{
          state.formData.fecha_salida = 'PENDIENTE DE ENTREGA'
    }
    
};
onMounted(async () => {
  
    
    if(route.params.id  != '0'){
     await  registro_id(route.params.id)

    }
  })
</script>

<template>

    <v-row class="justify-content-end mt-1">
        <v-col cols="12">
            <!----<div class="d-sm-flex align-center mb-5">
                <h3 class="text-h3">
                    DIPREVCON
                    <v-chip size="small" class="ml-2 elevation-0" variant="elevated" color="secondary">{{ filteredCards.length }}</v-chip>
                </h3>
             
            </div>--->

            <v-row>
                  <v-col cols="12" md="12" sm="12">
                
                    <v-card elevation="10" class="card-hover">
                        <v-card-item class="text-center">
                            <h4 class="text-h5 mt-3"> <img src="@/assets/images/misimagenes/logos.png" style="width: 60%; height: auto;" class="position-relative d-none d-lg-flex" alt="login-home" /></h4>
                            <h3 class="text-h5 mt-3">Registro de Pedidos</h3>
                           
                           
                            <h4 class="text-h5 mt-3">{{ state.formData.placa }}</h4>
                            <v-row>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Taller: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.taller }}
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Solicita a: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.fuerza }}
                                </v-col>
                               
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Departamento: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.departamento }}
                                </v-col>
                               
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Estado: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.fecha_salida }}
                                </v-col>
 <v-col cols="12" md="12">
    Se solicito en fecha <b>{{ state.formData.fecha_ingreso }} </b> los siguientes repuestos:
 </v-col>

 <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° </th>
              <th class="text-center"><b> Repuesto</b></th>
              <th class="text-center"><b> Cantidad</b></th>
             
              <th class="text-center"><b> Entregado</b></th>
              <th class="text-center"><b> Devolución de repuestos en mal estado</b></th>
             
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.id_Rep"  :key="index"
            >
            <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_repuesto }}</td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-center">{{ item.entregados }}</td>
              <td class="text-center">{{ item.recibido}}</td>
        </tr>
            </tbody>
            </v-table>
            </v-col>


                            </v-row>
                        </v-card-item>
                    </v-card>
                    <v-divider />
                
                       
                  </v-col>
            
            </v-row>
          
        </v-col>
    </v-row>
</template>

<style lang="scss" scoped>
.text-facebook {
    color: rgb(24, 119, 242) !important;
}
.text-instagram {
    color: rgb(215, 51, 109) !important;
}
.text-github {
    color: rgb(0, 96, 151) !important;
}
.text-twitter {
    color: rgb(28, 156, 234) !important;
}
</style>
