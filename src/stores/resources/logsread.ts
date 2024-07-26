import { defineStore } from 'pinia';import { ref } from 'vue'; 
import { useLogsruterStore } from '@/stores/resources/logsrute';


export const usereadRuteStore = defineStore({
    id: 'readRute',
    actions: { 
      
  
      // Leer la ruta
      async readLogrutes(ruta: any) {

          
  
            const editedItem = ref({
             ruta: '',
             id: 0,
             latitud: 0.0,
             longitud: 0.0,   
             });
          
             //console.log(ruta)
              navigator.geolocation.getCurrentPosition(position => {
              
              const  latitud = position.coords.latitude
              const  longitud = position.coords.longitude
              editedItem.value.latitud = latitud
              editedItem.value.longitud = longitud
              // console.log(latitud);
              // console.log(longitud);

                const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad;
                editedItem.value.id =parseInt(userLogged) 
                editedItem.value.ruta = ruta
                // console.log(editedItem.value)

                const logsruteStore = useLogsruterStore();   
                logsruteStore.createLogrutes(editedItem.value)
              
              });
             
            
             
            // const logsruteStore = useLogsruterStore();   
            // await logsruteStore.createLogrutes(editedItem.value)         
       
      }, 
   
  
    }
  
  });