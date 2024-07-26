<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { useDocumentaryReceptionStore } from '@/stores/documentaryReception';
import { useInstanceStore } from '@/stores/instance';
import { useResourceStore } from '@/stores/resource';

  const route = useRoute()
  const documentaryReceptionStore = useDocumentaryReceptionStore()
  const instanceStore = useInstanceStore()
  const resourceStore = useResourceStore()
// DEFINIREMOS LA VARIABLES LAS CUALES BRINDARAN LA INFORMACION DEL CASO
  const cite = ref('-')
  const fecha_formulario = ref('-')
  const estado = ref('EN PROCESO DE REVISIÓN')
  const numero_fojas = ref('-')
  const logistica = ref(false)
  const bienes:any = ref([])
  
  const nombresBienes: any = ref([])
  const listabienes = async () => {
    nombresBienes.value = await resourceStore.getProperties()
  }

  const getTracing = async () => {
    const result = await documentaryReceptionStore.tracingByIds(route.params.id_caso, route.params.id_recepcion_documental)
    if(result.cite){
      cite.value = result.cite
      fecha_formulario.value = result.fecha_formulario
      numero_fojas.value = result.numero_fojas
      // CONSULTAS PARA PARTE 2 Y 3 RESPECTIVAMENTE
      const revisiones = await instanceStore.tracingDocumentaryReview(Number(route.params.id_caso), Number(route.params.id_recepcion_documental))
      // bienes.value = revisiones
      const recepciones = await instanceStore.tracingLogisticReception(Number(route.params.id_caso), Number(route.params.id_recepcion_documental))
      if(revisiones.length > 0){
        estado.value = 'REVISADO'
        // AQUI INGRESA LA PARTE 3
        for (let i = 0; i < revisiones.length; i++) {
          if(revisiones[i].estado == 'APROBADO'){
            const valor = recepciones.find( (registro: any) => registro.id_bien_registro == revisiones[i].id_bien_registro )
            if(valor){
              logistica.value = true
              revisiones[i].fecha_recepcion = valor.fecha_recepcion
              revisiones[i].url_encuentro = valor.url_encuentro
              revisiones[i].url_recepcion = valor.url_recepcion
            } 
          }
        }
        bienes.value = revisiones
      }
    }
  }

  onMounted(() => {
    listabienes()
    if(route.params.id != '0'){
      getTracing()
    }
  })

</script>

<template>
    <div class="pa-5">
        <v-row class="h-100vh mh-100 auth">
          <v-col cols="1"></v-col>
          <v-col cols="10" >
            <v-card elevation="15" rounded="xl" class="card-hover text-justify" variant="outlined" color="#1C1D3B">
              <v-container>
                <v-row>
                  <v-col cols="12" class="d-flex align-center justify-center">
                    <div class="mw-100">
                      <div class="text-center">
                        <img
                          style="width: 80%; height: auto;"
                          alt="siibLogo"
                          src="@/assets/images/iconos/mesaTrabajo7.png"
                        />
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-container>
                <v-row>
                  <v-col cols="12" class="d-flex align-center justify-center">
                    <div class="mt-xl-0 mt-5 mb-5 mw-100">
                      <h6 class="text-h6 font-weight-bold text-center">
                        DIRECCIÓN GENERAL DE REGISTRO, <br>
                        CONTROL Y ADMINISTRACIÓN DE BIENES INCAUTADOS
                      </h6>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-container class="mt-3 mb-3">
                <v-row>
                  <v-col cols="12" class="d-flex align-center justify-center">
                    <div class="mw-100">
                      <p>
                        <strong>Cite del Documento: {{ cite }}</strong>
                      </p>
                      <p>
                        <strong>Fecha de Solicitud : {{ fecha_formulario }}</strong>
                      </p>
                      <p>
                        <strong>Estado : {{ estado }}</strong>
                      </p>
                      <p>
                        <strong>Fojas Presentadas : {{ numero_fojas }}</strong>
                      </p>
                    </div>
                  </v-col>
                </v-row>
                
                <v-row v-if="estado == 'REVISADO'">
                  <v-col cols="12" class="d-flex align-center justify-center">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th class="text-center">TIPO DE BIEN</th>
                          <th class="text-center">ESTADO</th>
                          <th class="text-center">CARACTERÍSTICAS</th>
                          <template v-if="logistica">
                            <th  class="text-center">FECHA Y HORA RECEPCIÓN</th>
                            <th class="text-center">LUGAR ENCUENTRO</th>
                            <th class="text-center">LUGAR RECEPCIÓN</th>
                          </template>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in bienes"
                          :key="index"
                        >
                          <td class="text-center">{{ item.nombre_bien }}</td>
                          <td class="text-center">{{ item.caracteristicas }}</td>
                          <td class="text-center font-weight-bold" :class="(item.estado=='APROBADO') ? 'text-primary' : 'text-error'">{{ item.estado }}</td>
                          <template v-if="logistica">
                            <td class="text-center">{{ item.fecha_recepcion }}</td>
                            <td class="text-center">
                              <a target="_blank" :href="item.url_encuentro">
                                <v-btn color="primary" class="mr-3" size="x-small" v-if="item.url_encuentro">Ubicación</v-btn>
                              </a>
                            </td>
                            <td class="text-center">
                              <a target="_blank" :href="item.url_recepcion">
                                <v-btn color="primary" class="mr-3" size="x-small" v-if="item.url_recepcion">Ubicación</v-btn>
                              </a>
                            </td>
                          </template>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
    </div>
</template>
