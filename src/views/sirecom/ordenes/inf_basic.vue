<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useOrdenStore } from '@/stores/orden/orden';
import { router } from '@/router';
import { useRoute } from 'vue-router'

const route = useRoute()
const orden = useOrdenStore()
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
      fecha_entrega :''
    }, 
  });
  const checkbox = ref(false);
  const checkbox2 = ref(false);
const checkbox3 = ref(false);
const checkbox4 = ref(false);
const registro_id = async (id_orden: any) => {
    const res2 = await orden.basic(id_orden)
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
    if(res2[0].id!==0){
        checkbox.value =true
    }
    if(res2[0].tipo !== ''){
        checkbox2.value =true
    }
    if(res2[0].total === '0'){
        checkbox3.value =true
    }
    
};
onMounted(async () => {
  
    
    if(route.params.id  != '0'){
     await  registro_id(route.params.id)

    }
  })
</script>

<template>

    <v-row  class="ml-12 mt-5">
        <v-col cols="12">
            <v-row>
                  <v-col cols="12" md="10" sm="12">
                
                    <v-card elevation="10" style="border: 1px solid #666666; border-radius: 10px;">
                        <v-card-item class="text-center">
                            <h4 class="text-h5 mt-3"> <img src="@/assets/images/misimagenes/logos.png" style="width: 60%; height: auto;" class="position-relative d-none d-lg-flex" alt="login-home" /></h4>
                            <h3 class="text-h5 mt-3">Registro de Mantenimiento</h3>
                           
                                <img src="@/assets/images/misimagenes/75704.png" style="width: 20%;"   />
                           
                            <h4 class="text-h5 mt-3">{{ state.formData.placa }}</h4>
                            <v-row>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Perteneciente a: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.fuerza }}
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Fecha Ingreso: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.fecha_ingreso }}
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Taller: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.taller }}
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Departamento: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.departamento }}
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Tipo: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.tipo_ve }}
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Mantenimiento: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.mantenimiento }}
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Fecha de Salida: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.fecha_salida }}                  </v-col>
                                <v-col cols="12" md="3" style="text-align: right;">
<b>Estado: </b>
                                </v-col>
                                <v-col cols="12" md="3" style="text-align: left;">
{{ state.formData.estado }}
                                </v-col>
                            </v-row>
                        </v-card-item>
                    </v-card>
                    <v-divider />
                    <v-sheet elevation="10" style="border: 1px solid #666666; border-radius: 10px;">
                        <div class="d-flex gap-3 justify-center  align-center flex-column flex-sm-row">
        <v-checkbox-btn color="secondary" label="INGRESO DE VEHÍCULO"  :readonly="true" v-model="checkbox"></v-checkbox-btn>
        <v-checkbox-btn color="secondary" label="ORDEN DE MANTENIMIENTO"  :readonly="true"   v-model="checkbox2" ></v-checkbox-btn>
        <v-checkbox-btn color="secondary" label="ENTREGA DE REPUESTOS"  :readonly="true"  v-model="checkbox3"></v-checkbox-btn>
        <v-checkbox-btn color="secondary" label="VERIFICACIÓN DE FUNCIONAMIENTO"  :readonly="true" v-model="checkbox4" ></v-checkbox-btn>
    </div>
                    </v-sheet>
                       
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
