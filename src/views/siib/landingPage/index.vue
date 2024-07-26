<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import Logo from '@/layouts/full/logo/Logo.vue';
import RtlLogo from '@/layouts/full/logo/RtlLogo.vue';
/*import tabler icons*/
import { Menu2Icon } from 'vue-tabler-icons';
const appsdrawer = ref(false);
const customizer = useCustomizerStore();
import google from '@/assets/images/svgs/google-icon.svg';
import facebook from '@/assets/images/svgs/facebook-icon.svg';
import 'aos/dist/aos.css';

</script>

<template>
   <div class="lp-wraper">
      <div>
        <div >
          <v-app-bar height="80" class="lp-header fondoDir" flat>
            <v-container class=" py-sm-4 py-0 " >
                <v-toolbar class="d-flex align-center rounded">
                    <div v-if="customizer.setRTLLayout" rtl>
                        <RtlLogo />
                    </div>
                    <div v-else>
                        <Logo />
                    </div>
                    <div class="navigation ml-auto d-lg-flex d-none">
                        <v-btn variant="text" color="primary" class="custom-hover-primary nav-links" href="https://dircabi.mingobierno.gob.bo/" target="_blank">DIRCABI</v-btn>
                        <v-btn class="custom-hover-primary bg-primary ml-2 mr-4 text-white" flat href="/siib/" target="_blank"
                            ><span class="text-white">Ingresar</span> </v-btn> 
                    </div>
                    <v-btn variant="text" class="hidden-lg-and-up ml-auto" icon @click.stop="appsdrawer = !appsdrawer">
                        <Menu2Icon size="22" stroke-width="1.5" /> 
                    </v-btn>
                </v-toolbar>
            </v-container>
          </v-app-bar>
       </div>
         <v-navigation-drawer class="lp-drawer" v-model="appsdrawer" location="left" temporary>
          <div class="pt-6 lp-mobile-sidebar">
            <div class="ml-6 mb-3">
                  <div v-if="customizer.setRTLLayout" rtl>
                      <RtlLogo />
                  </div>
                  <div v-else>
                      <Logo />
                  </div>
            </div>
            <v-list class="py-0 px-2">
              <v-list-item rounded="md">
                  <v-btn variant="text" class="custom-hover-primary px-0 text-left" flat
                      href="https://dircabi.mingobierno.gob.bo/drupal/" target="_blank">
                      <h5 class="text-subtitle-1">DIRCABI</h5>
                  </v-btn>
              </v-list-item>
              <v-list-item class="mt-2" rounded="md">
                  <v-btn class="custom-hover-primary bg-primary" block flat href="/siib/" target="_blank">Ingresar</v-btn>
              </v-list-item>
            </v-list>
          </div>
      </v-navigation-drawer>
    </div>
  </div>
<!--Area de Registro-->
<div class="mt-10 platforms bg-hoverColor py-lg-16 py-5">
    <v-container>
      <div>
        <v-row class="justify-center">
          <img
            style="width:15%; height:15%;"
            src="@/assets/images/misimagenes/mesaTrabajo9.png"
            />
        </v-row>
        <h1 class="mt-14 text-h1 text-md-center font-weight-bold">
          SISTEMA INFORMÁTICO INTEGRADO DE BIENES
        </h1>
        <p class="pt-2 pb-6 text-h5  text-md-center font-weight-regular" >
          Registrate 
        </p>
      <div class="mt-6 d-sm-flex gap-3 justify-center"  >
        <v-btn target="_blank" 
            href="/" 
            color="primary" 
            size="large" 
            class="m-btn-full btn-custom-lg" 
            flat
            >Ingresar</v-btn>
        <v-btn target="blank" 
            href="externalRegistrationForm/0"                                 
            color="primary"
            variant="outlined"
            class="mt-sm-0 mt-4 lp-btn-shadow m-btn-full btn-custom-lg"
            size="large"
            flat
        >Registrate!</v-btn>
        </div>
      </div>
    </v-container>
  </div>
  <!--Como registrarse-->

  <div class=" fondo">
  <v-row class="mt-5 justify-center" >
    <v-col cols="12" sm="6">
      <h2 class="sectionTitle text-center font-weight-bold-medium">¿Cómo Registrarse?</h2>
        <p class="mt-2 text-body-1 text-center font-weight-medium">Para poder registrarse en el sistema SIIB debe seguir los siguientes pasos,
          una vez registrado podra acceder a diferentes beneficiós
        </p>
    </v-col>
  </v-row>
  <v-row class="mt-10 justify-center">
      <v-timeline>
        <v-timeline-item
          icon="mdi-account"                    
          dot-color="#0083DD"
          fill-dot
        >
      <v-card width="500px">
        <v-card-title class="bg-ligthBlue">
          <h2 class="font-weight-light">
            Datos Personales
          </h2>
        </v-card-title>
        <v-card-text class="mt-5 text-h6 ">
          <p class="font-weight-black">Persona Natural</p><br>
              <li class="text-justify">Debe ingresar sus datos personales y adjuntar una copia de su CI.</li><br>
          <p class="font-weight-black">Persona Jurídica</p><br>
              <li class="text-justify">Debe ingresar datos de la entidad y adjuntar el Certificado de personeria 
              juridica y Certificado de inscripción, de igual modo debe ingresar los datos del representante legal  
              y adjuntar un documento que lo acrédite. 
              </li>
        </v-card-text>
      </v-card>
      </v-timeline-item>

        <v-timeline-item
            icon=" mdi-thumb-up" 
            icon-color="#FFFFFF"
            dot-color="#0083DD"
            fill-dot
        >
        <v-card width="500px">
          <v-card-title class="bg-ligthBlue">
            <h2 class="font-weight-light">
              Validación de datos para Pre-Registro
            </h2>
          </v-card-title>
          <v-card-text class="mt-5 text-h6">
            <p class="text-justify">Una vez ingresados los datos se le enviara un correo electrónico con un código
            que deberá ingresar en el registro para proceder con el envio del mismo para su futura validación.</p>
          </v-card-text>
        </v-card>
      </v-timeline-item>

        <v-timeline-item
          icon="mdi-check"                    
          dot-color="#0083DD"
          fill-dot
        >
          <v-card width="500px">
            <v-card-title class="bg-ligthBlue">
              <h2 class="font-weight-light">
              Cuenta Verificada
              </h2>
            </v-card-title>
            <v-card-text class="mt-5 text-h6 ">
              <p class="font-weight-black text-justify">
                Una vez verificada su cuenta le llegara un correo electrónico con sus credenciales para ingresar al sistema.</p>
            </v-card-text>
          </v-card>
        </v-timeline-item>
        </v-timeline>                          
      </v-row>


</div>

<!--IMAGENES-->
<div class="platforms bg-hoverColor py-lg-16 py-5  " >
        <v-container class="">
            <v-row class="justify-center">
                <v-col cols="12" sm="8" >
                    <h2 class="sectionTitle text-center pt-sm-8 pt-8 font-weight-bold">
                        Subasta Pública y Venta Directa
                    </h2>
                </v-col>
            </v-row>
        </v-container>
        <div class="pb-16">
            <div class="d-flex flex-row mt-sm-8 mt-5 overflow-hidden">
                <div class="slider-group">
                    <img src="@/assets/images/landingpage/background/slider-group1.png"/>
                </div>
                <div class="slider-group">
                    <img src="@/assets/images/landingpage/background/slider-group1.png"/>
                </div>
            </div>
        </div>
    </div>

<div>
  <v-container>
    <h2 class="sectionTitle text-center pt-sm-8 pt-8 font-weight-bold">
    REQUISITOS PARA ADJUDICACIÓNES
    </h2>
  <v-row class="justify-center">
    <v-col>
        <h2 class="sectionTitle text-center pt-sm-8 pt-8 font-weight-bold">
          VENTA DE BIENES
        </h2>
    </v-col>
    <v-col>
        <h2 class="sectionTitle text-center pt-sm-8 pt-8 font-weight-bold">
          CONTRATOS
        </h2>
    </v-col>
  </v-row>
  <v-row class="justify-center">
    <v-col>
        <v-stepper :items="['SUBASTA PÚBLICA ', 'VENTA DIRECTA']">
        <template v-slot:item.1>
          <v-card  title="REQUISITOS EMPRESAS JURIDICAS">
            <p class="text-justify ">Requisitos:<br>
              1. Fotocopia de carnet<br>
              2. Empoce del 10% el día de la subasta (en bolivianos o dólares)<br>
              TOMAR EN CUENTA:<br>
              No se pueden participar en el proces:<br>
              a) El procesado.<br>
              b) Servidores públicos dependientes del Ministerio de Gobierno.<br>
              c) Familiares de servidores públicos dependientes del Ministerio de gobierno hasta segundo grado de consanguinidad o segundo grado de afinidad.<br>
              El postor ganador tendrá 3 días para depositar a la cuenta de DIRCABI el saldo restante. <br>
              En caso de no ser el postor ganador, se le devolverá en el mismo día el 10% del empoce.
            </p>
          </v-card>

        </template>

        <template v-slot:item.2>
          <v-card title="EMPRESA SIN FINES DE LUCRO" flat>          
            <p class="text-justify ">Requisitos:<br>
              1. Fotocopia de carnet.<br>
              2. Propuesta del monto a ofertar del participante.<br>
              TOMAR EN CUENTA:<br>
              No se pueden participar en el proces:<br>
              a) El procesado.<br>
              b) Servidores públicos dependientes del Ministerio de Gobierno.<br>
              c) Familiares de servidores públicos dependientes del Ministerio de gobierno hasta segundo grado de consanguinidad o segundo grado de afinidad.<br>
  
            </p>
          </v-card>
        </template>
      </v-stepper>
    </v-col>
    <v-col>
        <v-stepper :items="['EMPRESA JÚRIDICA', 'EMPRESA SIN FINES DE LUCRO']">
        <template v-slot:item.1>
          <v-card  title="REQUISITOS EMPRESAS JURIDICAS">
            <p class="text-justify">Requisitos:<br>
            1. Nota de solicitud fundamentada y suscrita por la MAE, señalando un medio de comunicación digital, teléfono y/o numero de celular de una persona designada para la coordinación.<br>
            2. Designación de la Máxima Autoridad Ejecutiva (Copia Legalizado).<br>
            3. Credencial de la Maxima Autoridad Ejecutiva (Copia simple).<br>
            4. Numero de Registro Tributario (Copia simple).<br>
            5. Certificación del área correspondiente de la entidad solicitante donde asuma la responsabilidad para el mantenimiento y seguros para el bien solicitado (solo para comodatos).<br>
            6. Proyecto para la utilización del bien bajo alguna de las políticas del Estado señalados en el Art. 130 (I) del Decreto Supremo 3434 (máximo 5 hojas - solo para comodatos).</p>
          </v-card>

        </template>

        <template v-slot:item.2>
          <v-card title="EMPRESA SIN FINES DE LUCRO" flat>          
            <p class="text-justify" >Requisitos:<br>
            1. Personería jurídica reconocida mediante Resolución por autoridad competente con una data igual o mayor a 10 años (copia legalizada).<br>
            2. Representación legal que prevé la suscripción de contratos con el Estado (copia legalizada).<br>
            3. Reconocimientos premios u otros que acrediten la actividad publica de la institución (copias simples).<br>
            4. Declaración jurada notarial por su representante, que establezca que la entidad cuente con los recursos suficientes para el mantenimiento y seguros para el bien solicitado, acompañado de los documentos contables de respaldo.<br>
            5. Proyecto para la utilización del bien bajo alguna de la políticas sociales señalados en el articulo 130 (II.b) del Decreto Supremo 3434 (Máximo 5 hojas)</p>
          </v-card>
        </template>
      </v-stepper>
    </v-col>
  </v-row>
</v-container>
</div>  



<!--DIRECCIONES-->
  <div class="mt-5 fondoDir">
      <v-container  height="400">
            <v-row class="justify-space-between">
                <v-col class="text-white">
                    <h2 >Oficina Nacional</h2>
                    <h3 class="mt-1">Dirección:"Calle Cuba esq. Pasoskanqui #1617 Zona Miraflores "</h3>
                    <h3 class="mt-1">Telefono: 2-114813</h3>
                    <h3 class="mt-1">Correo: registroysistemas@mingobierno.gob.bo</h3>
                    <!-- <v-btn class="mt-10 bg-surface rounded-circle mx-auto" style="height: 64px; width: 64px" href="https://dircabi.mingobierno.gob.bo/" >
                      <img :src="google" width="15" height="15" alt="google" />
                    </v-btn>
                    <v-btn class="mt-10 bg-surface rounded-circle mx-auto" style="height: 64px; width: 64px" href="https://www.facebook.com/dircabi.bo/" >
                      <img :src="facebook" width="40" height="40" class="mr-1" alt="facebook" />
                  </v-btn> -->
                  </v-col>
                
                <v-col cols="12" md="5" class="pb-0">
                    <div class="d-flex justify-md-end justify-center mb-n1">
                      <div  style="width: 80%">
                        <iframe width="100%" height="250" rounded="xl" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=es&amp;q=DIRCABI%20LA%20PAZ,%20C.%20Rep.%20de%20Cuba%20esq+(DIRCABI)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/"></a>
                        </iframe>
                      </div>
                    </div>
                </v-col>
            </v-row>
           <v-row class="mt-10 justify-center">

            </v-row> 
        </v-container>
    </div>

<!--FOOTER-->
    <v-container>
        <v-row class="justify-center">
            <v-col cols="12" md="4" sm="5"  class="text-center" >
                <div class="mt-8 mb-4">
                    <p class="text-subtitle-1 mt-2 text-13">
                        Copyright © 2024  <a href="https://www.mingobierno.gob.bo/" class="a_link"  target="_blank">Ministerio de Gobierno.</a><br>
                        Desarrollado por Tecnología y Sistemas Todos los derechos reservados.<br>
                        Contacto: soporte@mingobierno.gob.bo
                    </p>
                </div>
            </v-col>
        </v-row>
    </v-container>  
</template>



<style lang="scss" scoped>
.v-container {
    max-width: 1200px !important;
    
}
.fondoDir {
background: url("@/assets/images/misimagenes/banner.gif");

}
.fondo {
background: url("@/assets/images/misimagenes/whiteBg.jpg");
height: 1000px;
}
</style>
