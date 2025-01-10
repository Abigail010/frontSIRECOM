<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { usefilterStore } from '@/stores/resources/filtro';
import { useRegisterRStore } from '@/stores/resources/register_rep';
import { useResourceStore } from '@/stores/resource';
import { validateText } from '@/utils/helpers/validateText'
import { format } from 'date-fns'
import { useUserStore } from '@/stores/resources/user';
import { useFuerzasStore } from '@/stores/resources/fuerza';
const fuerzas = useFuerzasStore()
const userStore = useUserStore()
const RegisterRStore = useRegisterRStore()
const dialog = ref(false);
  const route = useRoute()
  const repuestoStore = usefilterStore()
  const resourceStore = useResourceStore()
  const us:any = JSON.parse(localStorage.getItem('user') || '').id_perfil
  const us2:any = JSON.parse(localStorage.getItem('user') || '').id_taller
  // BREADCRUMB  
  const page = ref({ title: 'Registro de Repuesto' });
  const breadcrumbs = ref([
    {
      text: 'Dashboard',
      disabled: false,
      href: '#'
    },
    {
      text: 'Información',
      disabled: true,
      href: '#'
    }
  ]);
  const currentDate2 = format(new Date(), "yyyy-MM-dd");
  // DECLARACION DEL STATE
  const state = reactive({
    formData: {
      id: '',
      fecha:currentDate2, 
      id_taller: null,
      partida: '',
      total: '0',
      observacion: '', 
      repuestos: [] as any,
      nombre_repuesto:'', 
      id_repuesto: '', 
      cantidad: '',
      precio_u:'', 
      subtotal:'',
      unidad:'',
      idd:'',
    
    }
  });


  const taller = ref([])
  const gettaller = async() => {
  
  taller.value = await fuerzas.fuerza()
  }
  const editar = ref<any>(false)
  
  const departamentos = ref([])
  const getDepartmentsList = async() => {
    departamentos.value = await resourceStore.getDepartments()
  }
  const servicios = ref([])
  const desserts6 = ref([]) as any
  const desserts7 = ref([]) as any
  const getServicios = async() => {
    servicios.value = await resourceStore.getSerivicio_t()
    desserts7.value = await repuestoStore.repuestos()
    desserts6.value = await repuestoStore.Unidad()
  }
  // FUNCION QUE OBTIENE LA INFORMACION DEL talle
  const getRegisterRId = async (id: any) => {
    const respuesta = await RegisterRStore.RegisterR(id)
  
    state.formData.id = respuesta.id
    state.formData.fecha = respuesta.fecha
    state.formData.partida = respuesta.nro_partida 
    state.formData.id_taller = respuesta.id_taller
    state.formData.observacion = respuesta.observacion 

    const rep = respuesta.repuestos
    for (let i = 0; i < rep.length; i++) {
      state.formData.repuestos.push(rep[i])
      desserts7.value = desserts7.value.filter( (tipo: any) => tipo.id !=rep[i].id_repuesto)
      state.formData.total = String(parseFloat(state.formData.total) + parseFloat(rep[i].subtotal))
    }
  }
    // VALIDACIONES
    const sendForm = ref(true)
  const miValidacion = async () => {
    sendForm.value = true
    if(!state.formData.fecha ||  state.formData.repuestos.length ==0  ){ //
      sendForm.value = false
    }
  }

  const ButtonRepuesto = async (item: any) => {
    const data2 = await RegisterRStore.infoR(item)
    state.formData.idd = data2.idd
    state.formData.id_repuesto = data2.id_repuesto
    state.formData.nombre_repuesto = data2.nombre_repuesto
    state.formData.cantidad = data2.cantidad
    state.formData.unidad = data2.unidad
    state.formData.precio_u = data2.precio_u
    state.formData.subtotal = data2.subtotal
    dialog.value = true
  }

  const buttonClear2 = () => {
    state.formData.id_repuesto = ''
      state.formData.nombre_repuesto= ''
      state.formData.cantidad= ''
      state.formData.unidad = ''
      state.formData.precio_u = ''
}
const precio = () => {
    const cantidad = parseFloat(state.formData.cantidad) || 0;
      const precio_u = parseFloat(state.formData.precio_u) || 0;
      state.formData.subtotal = (cantidad * precio_u).toFixed(2); // Calcula y formatea el subtotal
      //state.formData.
}
const añadir_repuesto = () => {

  // Verifica si los campos requeridos están llenos
  if(state.formData.id_repuesto && state.formData.cantidad && state.formData.unidad && state.formData.precio_u){
    
    // Encuentra el objeto correspondiente al `id_repuesto` seleccionado
    let a = desserts7.value.find(
      (region: any) => region.id == state.formData.id_repuesto
    );

    // Si el objeto `a` existe, extrae el `nombre_repuesto`
    if (a) {

      state.formData.nombre_repuesto = a.nombre_repuesto;  // Almacena el nombre en formData
    } else {
 
      return; // Sal del método si no se encuentra el repuesto
    }

    // Después de obtener el nombre, puedes proceder a filtrar el array
    desserts7.value = desserts7.value.filter(
      (codigo: any) => codigo.id != state.formData.id_repuesto
    );

    // Añadir el repuesto a la lista de repuestos
    state.formData.repuestos.push({
      id_repuesto: state.formData.id_repuesto,
      nombre_repuesto: a.nombre_repuesto,
      cantidad: state.formData.cantidad,
      unidad: state.formData.unidad,
      precio_u: state.formData.precio_u,
      subtotal: state.formData.subtotal,
    //  total: parseFloat(state.formData.total)+ parseFloat(state.formData.subtotal)
      //subtotal: parseInt(state.formData.cantidad)*parseInt(state.formData.precio_u)
    });
   // Sumar el subtotal actual al total acumulado
    state.formData.total = String(parseFloat(state.formData.total) + parseFloat(state.formData.subtotal));
    // Limpiar los campos después de añadir
    state.formData.id_repuesto = '';
    state.formData.nombre_repuesto = '';
    state.formData.cantidad = '';
    state.formData.unidad = '';
    state.formData.precio_u = '';
    state.formData.subtotal = ''
  }
}


const buttonDeleteRep = (index: number) => {
  if (state.formData.repuestos.length > 0) {
    // Obtén el registro que quieres eliminar de la lista de repuestos
    const registro2: any = state.formData.repuestos[index];

    // Añade nuevamente el repuesto eliminado a la lista de repuestos disponibles (desserts7)
    desserts7.value.push({
      id: registro2.id_repuesto,
      nombre_repuesto: registro2.nombre_repuesto // Aquí debes usar el nombre correcto
    });

    // Sumar el subtotal actual al total acumulado
    state.formData.total = String(parseFloat(state.formData.total) - parseFloat(registro2.subtotal)); // Restar el subtotal del repuesto eliminado

    // Reordenar la lista de repuestos disponibles (desserts7)
    desserts7.value.sort((aa: any, bb: any) => {
      const codigo_a = aa.id;
      const codigo_b = bb.id;

      if (codigo_a < codigo_b) {
        return -1;
      }
      if (codigo_a > codigo_b) {
        return 1;
      }
      return 0;
    });

    // Eliminar el repuesto de la lista de repuestos en formData
    state.formData.repuestos.splice(index, 1);
  }
};

const setCodeName = () => {
    if(state.formData.id_repuesto && state.formData.cantidad && state.formData.unidad){
      desserts7.value = desserts7.value.filter(
        (codigo: any) =>
        codigo.id != state.formData.id_repuesto
      )
      state.formData.repuestos.push({
        id_repuesto: state.formData.id_repuesto,
        nombre_repuesto:state.formData.nombre_repuesto,
        cantidad: state.formData.cantidad,
        unidad:state.formData.unidad,
        precio_u:state.formData.precio_u
        
      })
      state.formData.id_repuesto = ''
      state.formData.nombre_repuesto= ''
      state.formData.cantidad= ''
      state.formData.unidad = ''
      state.formData.precio_u= ''
  
    }
}
const buttonClose = () => {
    dialog.value = false
  }

   // BOTON RETORNAR
   const buttonReturnList = () => {
     router.push({ name: 'registerList' })
   }

  const submitButton = ref(false)

  const buttonSendForm = async () => {
  submitButton.value = true
    await miValidacion()
    if(!sendForm.value)return 
    const { ok, message } = (route.params.id == '0') ? await RegisterRStore.createRegisterR(state.formData) : await RegisterRStore.updateRegisterR(state.formData)
        const icono = (ok ? 'success' : 'error')
        Swal.fire({
       icon: icono,
       title: message,
       timer: 1500,
       showConfirmButton: false,
      timerProgressBar: true
     })
  }

  const buttonSendForm2 = async () => {
    submitButton.value = true
  
    if(state.formData.idd != '0' ){
      // ES NUEVO REGISTRO
      dialog.value = false
      Swal.fire({
        title: 'Estás seguro?',
        text: "Verifica que la información registrada sea correcta",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#FA896B',
        confirmButtonColor: '#5D87FF',
        cancelButtonText: 'No, volver',
        confirmButtonText: 'Si, actualizar',
      }).then(async (result) => {
        if(result.isConfirmed){
          
          const { ok, message } = await RegisterRStore.updateInfo(state.formData)
          const icono = (ok ? 'success' : 'error')
//Toast.fire({ icon: icono, title: message })
            
        }
        window.location.reload()
      })
    }
   //isLoading.value = false
  }

  onMounted( async () => {
    await getDepartmentsList()
    await gettaller()
    await getServicios()
    if(route.params.id != '0'){
      await getRegisterRId(route.params.id)
      editar.value = true
    }
  })

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-dialog v-model="dialog" max-width="1000px">
                                <v-card>
                                    <v-card-title class="pa-2 bg-primary">
                                        <span class="text-h5">Información del Repuesto</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                            <v-col cols="12"  md="4">
                                                <v-text-field
                                                v-model="state.formData.nombre_repuesto"
                                                label="Repuesto"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12"  md="2">
                                        
                                        <v-autocomplete
                                            variant="outlined"
                                            color="primary"
                                             label="Unidad"
                                            hide-details
                                            :items="desserts6"
                                            v-model="state.formData.unidad"
                                            no-data-text="No existe más opciones para seleccionar"
                                            item-value="nombre_unidad"
                                            item-title="nombre_unidad"
                                            @input="state.formData.unidad = validateText(state.formData.unidad.toUpperCase())"
                                          
                                            /> 
                                    </v-col>
                                            <v-col cols="12"  md="2">
                                                <v-text-field
                                                 @input="precio(), state.formData.cantidad"
                                                v-model="state.formData.cantidad"
                                                label="Cantidad"
                                                type="number"
                                                :min =1
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12"  md="2">
                                                <v-text-field
                                                 @input="precio(), state.formData.precio_u"
                                                v-model="state.formData.precio_u"
                                                label="Precio Unitaro"
                                                type="number"
                                                :min =1
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12"  md="2">
                                                <v-text-field
                                                v-model="state.formData.subtotal"
                                                min:0
                                                label="Importe"
                                                readonly
                                                 type="number"
                                                ></v-text-field>
                                            </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" variant="flat" dark   @click="buttonClose()">
                                            Cancel
                                        </v-btn>
                                        <v-btn color="success" variant="flat" dark   @click="buttonSendForm2()">
                                            Actualizar
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

    <v-col cols="12" lg="12">
      <h4 class="mb-5 mt-2 font-weight-light">
        <strong> DATOS DEL REGISTRO:</strong> Los campos con <span style="color:red">(*)</span> son obligatorios
      </h4>

      <v-row>
        <v-col cols="12" md="4">
      <v-label class="mb-2 font-weight-medium">
            Fecha de Registro<span style="color:red">(*)</span>
      </v-label>
      <v-text-field 
        type="date" 
        id="date" 
        name="date"
        v-model="state.formData.fecha"
        :min="currentDate2"
        :max="currentDate2"
        :error="submitButton && !state.formData.fecha"

        hide-details
      />
      <template v-if="submitButton && !state.formData.fecha">
        <div class="v-messages font-weight-black px-2 py-2">
          <div class="v-messages__message text-error ">
            El campo es requerido
          </div>
        </div>
      </template>
    </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">N° de partida </v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="number"
            v-model.trim="state.formData.partida"
            @input="miValidacion(), state.formData.partida"
            :error="submitButton && !state.formData.partida"
            hide-details
          />
        
        </v-col>
        <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Taller<span style="color:red">(*)</span></v-label>
          <v-select
            :items="taller"
            item-title="nombre_fuerza"
            item-value="id_fuerza"
            v-model="state.formData.id_taller"
            :error="submitButton && !state.formData.id_taller"
          />
          <template v-if="submitButton && !state.formData.id_taller">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="12">
          <v-label class="mb-2 font-weight-medium">Observación </v-label>
          <VTextField
            variant="outlined" 
            color="primary"
            type="text"
            v-model.trim="state.formData.observacion"
            @input="miValidacion(), state.formData.observacion = validateText(state.formData.observacion.toUpperCase())"
            
            hide-details
          />
        
        </v-col>
        
       <v-col cols="12" md="12">
        <h4 class="mb-5 mt-2 primary">
        <strong > Registro de repuestos:</strong> 
      </h4>
       </v-col>
       <v-col cols="12" md="3">
          <v-label class="mb-2 font-weight-medium">Repuestos <span style="color:red">(*)</span></v-label>
    
          <v-autocomplete
            variant="outlined"
                  v-model="state.formData.id_repuesto"
                  :items="desserts7"
                  item-title="nombre_repuesto"
                  item-value="id"
                  @input="miValidacion()"
                  :error="submitButton && !state.formData.id_repuesto"
                  hide-details
          ></v-autocomplete>
          <template v-if="submitButton && !state.formData.id_repuesto">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="2">
          <v-label class="mb-2 font-weight-medium">Unidad<span style="color:red">(*)</span></v-label>
    
          <v-autocomplete
          variant="outlined"
                              color="primary"
                              hide-details
                               :items="desserts6"
                              v-model="state.formData.unidad"
                              no-data-text="No existe más opciones para seleccionar"
                              item-value="nombre_unidad"
                              item-title="nombre_unidad"
                              @input="state.formData.unidad = validateText(state.formData.unidad.toUpperCase())"
                              @update:model-value="setCodeName()"
          ></v-autocomplete>
          <template v-if="submitButton && !state.formData.unidad">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="1">
          <v-label class="mb-2 font-weight-medium">Cantidad <span style="color:red">(*)</span></v-label>
    
          <v-text-field
            variant="outlined" 
            color="primary"
            type="number"
            v-model.trim="state.formData.cantidad"
            @input="precio(), state.formData.cantidad"
            :min="1"
            :error="submitButton && !state.formData.cantidad"
            hide-details
          />
          <template v-if="submitButton && !state.formData.cantidad">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="2">
          <v-label class="mb-2 font-weight-medium">Precio Unitario <span style="color:red">(*)</span></v-label>
    
          <v-text-field
            variant="outlined" 
            color="primary"
            type="number"
            v-model.trim="state.formData.precio_u"
            @input="precio(), state.formData.precio_u"
            :min="1"
            :error="submitButton && !state.formData.precio_u"
            hide-details
          />
          <template v-if="submitButton && !state.formData.precio_u">
            <div class="v-messages font-weight-black px-2 py-2">
              <div class="v-messages__message text-error ">
                El campo es requerido
              </div>
            </div>
          </template>
        </v-col>
 <v-col cols="12" md="4">
          <v-label class="mb-2 font-weight-medium">Importe Bs.<span style="color:red"></span></v-label>
          <v-text-field
                    variant="outlined" 
                    color="primary"
                    type="number"

                    v-model.trim="state.formData.subtotal"
                    readonly
                    :error="submitButton && !state.formData.subtotal"
                    hide-details
                >
            <template v-slot:append >
              <v-btn
                color="primary"
                @click= añadir_repuesto()
                :disabled=" !state.formData.id_repuesto || !state.formData.cantidad || !state.formData.unidad || !state.formData.precio_u"
                readonly="true"
                ><SearchIcon/>Añadir
              </v-btn>
              <v-btn
                color="secondary"
                @click= buttonClear2()
                :disabled="!state.formData.id_repuesto || !state.formData.cantidad || !state.formData.unidad || !state.formData.precio_u"><TrashIcon/>Limpiar
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <template v-if="state.formData.repuestos.length>0">
      <v-col cols="12" md="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-center">N° </th>
              <th class="text-center"><b> Repuesto</b></th>
              <th class="text-center"><b> Unidad</b></th>

              <th class="text-center"><b> Cantidad</b></th>
              <th class="text-center"><b> Precio Unitario</b></th>
              <th class="text-center"><b>Importe Bs.</b></th>
              <th class="text-center" >Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in state.formData.repuestos"  :key="index"
            >
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ item.nombre_repuesto }}</td>
              <td class="text-center">{{ item.unidad }}</td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-center">{{ item.precio_u }}</td>
              <td class="text-center">{{ item.subtotal }}</td>
              <td class="text-center" v-if="(item.entregado != item.cantidad) && state.formData.id!=''">
                <v-btn v-if="item.idd !=null "
                 class="mr-1"
                  size="x-small"
                  title="Editar"
                  height="25"
                  width="25"
                  color="primary"
                  text="hola"
                 @click="ButtonRepuesto(item.idd)"
                > <PencilIcon></PencilIcon>
                </v-btn>
                <v-btn v-if="item.entregado === null || item.entregado === 0  || item.idd == null"
                    size="x-small"
                    title="Eliminar"
                    height="25"
                    width="25"
                    color="error"
                    @click="buttonDeleteRep(index)"
                  > <TrashIcon ></TrashIcon >
                </v-btn>
                
              </td>
              <td  class="text-center" v-else-if="(item.entregado = item.cantidad) && state.formData.id!=''">
                 <b> !Agotado¡</b>       
              </td>
              <td class="text-center" v-else>
                <v-btn 
                    size="x-small"
                    title="Eliminar"
                    height="25"
                    width="25"
                    color="error"
                    @click="buttonDeleteRep(index)"
                  > <TrashIcon ></TrashIcon >
                </v-btn>
              </td>
              
            </tr>
            <tr>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td class="text-center"><b>Total: </b></td>
               <td class="text-center">{{ state.formData.total }} Bs.</td>
             </tr>
          </tbody>
        </v-table>
      </v-col>
    </template>
      </v-row>

      
<br>

      <p class="text-lg-left">
        <v-btn color="error" class="mr-3" @click="buttonReturnList()">Cancelar</v-btn>
        <v-btn color="primary" @click.prevent="buttonSendForm()">Enviar</v-btn>
      </p>
    </v-col>
  </v-row>
</template>