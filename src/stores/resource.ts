import { defineStore } from 'pinia';
import { router } from '@/router';

import siibApi from "@/api/siibApi"
import segipApi from "@/api/segipApi"

export const useResourceStore = defineStore({
  id: 'resource',
  actions: {
    // OBTIENE INFORMACION DE UNA PERSONA DE LA API SEGIP
    async dataSegip(data: { cedula_identidad: string; complemento: string }) {
      const { cedula_identidad, complemento } = data
      const ced = cedula_identidad;
      const com = complemento;
      const nom = '';
      const pat = '';
      const mat = '';
      try {
        const { data } = await segipApi.post("/segipwsexterno", { ced, com, nom, pat, mat })
        return { data }
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA INFORMACION DE UNA PERSONA QUE SE ENCUENTRE EN BASE DE DATOS
    async getPerson(info: { cedula_identidad: string; complemento: string }){
      const { cedula_identidad, complemento } = info
      try {
        const { data } = await siibApi.post("/resource/person", { cedula_identidad, complemento })
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LOS PERMISOS DEL USUARIO EN SESION
    async checkPermission (module: string) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('resource/checkPermission', { userLogged, module })
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA INFORMACION DEL USUARIO EN SESION
    async getUserSession () {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.post('resource/userSession', { userLogged })
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS TIPOS DE CODIGO
   /* async getCodesType() {
      try {
        const { data } = await siibApi.get('/resource/codesType')
        const codesType = data
        return codesType
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },*/

    // OBTIENE LA LISTA DE LAS DEPENDENCIAS
    async getDependencies() {
      try {
        // console.log('llego a resource')
        const { data } = await siibApi.get('/resource/dependencies')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
         // OBTIENE LA LISTA DE LAS OFICINAS
         async getTalleres() {
          try {
            const { data } = await siibApi.get('/resource/taller')
            return data
          } catch (error: any) {
            const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
            return { ok: false, message: message }
          }
        },

         // OBTIENE LA LISTA DE LAS OFICINAS
         async getAccesorios() {
          try {
            const { data } = await siibApi.get('/resource/accesorios')
            return data
          } catch (error: any) {
            const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
            return { ok: false, message: message }
          }
        },
    
    

    

    // OBTIENE LA LISTA DE LOS TIPOS DE IMPLICADO
    async getImplicatedTypes() {
      try {
        const { data } = await siibApi.get('/resource/implicatedTypes')
        const implicatedTypes = data
        return implicatedTypes
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS CRIMENES
    async getCrimes() {
      try {
        // console.log('llego a resource')
        const { data } = await siibApi.get('/resource/crimes')
        const crimes = data
        return crimes
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

 
    // OBTIENE LA LISTA DE LOS DEPOSITOS
    async getDeposits() {
      try {
        const { data } = await siibApi.get('/resource/deposits')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LAS INDUSTIRAS - VEHICULOS
    async getIndustries() {
      try {
        // console.log('llego a resource')
        const { data } = await siibApi.get('/resource/industries')
        const industries = data
        return industries
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS KILOMETRAJES - VEHICULOS
    async getMileages() {
      try {
        // console.log('llego a resource')
        const { data } = await siibApi.get('/resource/mileages')
        const mileages = data
        return mileages
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS KILOMETRAJES POR INDUSTRIA - VEHICULO
    async getIndustriesMileages() {
      try {
        // console.log('llego a resource')
        const { data } = await siibApi.get('/resource/industriesMileages')
        const industriesMileages = data
        return industriesMileages
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS TIPOS DE INMUEBLES - BIEN INMUEBLE
    async getImmovableProperties() {
      try {
        const { data } = await siibApi.get('/resource/immovableProperties')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE DEPARTAMENTOS
    async getDepartments() {
      try {
        const { data } = await siibApi.get('/resource/departments')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER LISTA DE PROVINCIAS POR DEPARTAMENTO
    async getProvinces (department: any) {
      try {
        const { data } = await siibApi.get('resource/provinces/' + department)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTENER LISTA DE MUNICIPIOS POR PROVINCIA
    async getMunicipalities (province: any) {
      try {
        const { data } = await siibApi.get('resource/municipalities/' + province)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE DEPARTAMENTOS
    async getPlaces() {
      try {
        const { data } = await siibApi.get('/resource/places')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE ACABADOS DE INMUEBLES - BIEN INMUEBLE
    async getWallFinishes() {
      try {
        const { data } = await siibApi.get('/resource/wallFinishes')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA AMBIENTES - BIEN INMUEBLE
    async getEnvironments() {
      try {
        const { data } = await siibApi.get('/resource/environments')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA AMBIENTES - BIEN INMUEBLE
    async getBuildingEquipment() {
      try {
        const { data } = await siibApi.get('/resource/buildingEquipment')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE AVALUOS POR DEPARTAMENTO Y ZONA - BIEN INMUEBLE
    async getAppraisalsByDepartmentZone(department: string, zone: string) {
      try {
        const { data } = await siibApi.get('/resource/appraisalsByDepartmentZone/' + department + '/' + zone)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE JUZGADOS POR DEPARTAMENTO
    async getCourtsByDepartment(department: any) {
      try {
        const { data } = await siibApi.get('/resource/courtsByDepartment/' + department)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    
    // OBTIENE LA LISTA DE LOS CRIMENES
    async getProfiles() {
      try {
        const { data } = await siibApi.get('/resource/profiles')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    
    // OBTIENE LA LISTA DE LOS TIPOS DE SUSTANCIAS CONTROLADAS - SUSTANCIAS CONTROLADAS
    async getSubstances() {
      try {
        const { data } = await siibApi.get('/resource/substances')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS CONTENEDORES - SUSTANCIAS CONTROLADAS
    async getControlledSubstanceContainers() {
      try {
        const { data } = await siibApi.get('/resource/controlledSubstanceContainers')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS SEMOVIENTES - SEMOVIENTES
    async getSelfMoving() {
      try {
        const { data } = await siibApi.get('/resource/selfMoving')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS TIPOS DE JOYA - JOYAS
    async getJewels() {
      try {
        const { data } = await siibApi.get('/resource/jewels')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },
    
    // OBTIENE LA LISTA DE LOS MATERIALES METALICOS DE LAS JOYAS - JOYAS
    async getMetalJewelryMaterials() {
      try {
        const { data } = await siibApi.get('/resource/metalJewelryMaterials')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LAS PIEDRAS DE LAS JOYAS - JOYAS
    async getStoneJewelryMaterials() {
      try {
        const { data } = await siibApi.get('/resource/stoneJewelryMaterials')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS PRECIOS DE LOS METALES DE LAS JOYAS - JOYAS
    async getMetalJewelryPrices(id_joya_material_metal: number) {
      try {
        const { data } = await siibApi.get('/resource/metalJewelryPrices/' + id_joya_material_metal)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS PRECIOS DE LAS PIEDRAS DE LAS JOYAS - JOYAS
    async getStoneJewelryPrices(id_joya_material_piedra: number) {
      try {
        const { data } = await siibApi.get('/resource/stoneJewelryPrices/' + id_joya_material_piedra)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS TIPOS DE OBRAS DE ARTE Y PIEZAS ARQUEOLOGICAS - OBRAS DE ARTE O PIEZAS ARQUEOLOGICAS
    async getArtworkArchaeologicalPieces() {
      try {
        const { data } = await siibApi.get('/resource/artworkArchaeologicalPieces')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS CONTENEDORES - CONSUMIBLES
    async getConsumableContainers() {
      try {
        const { data } = await siibApi.get('/resource/consumableContainers')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE OBSERVACIONES PARA REVISION DOCUMENTAL
    async getDocumentaryReviewObservations() {
      try {
        const { data } = await siibApi.get('/resource/documentaryReviewObservations')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE TIPOS DE EMBARCACIONES - EMBARCACIONES
    async getBoatTypes() {
      try {
        const { data } = await siibApi.get('/resource/boatTypes')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE CATEGORIAS DE EMBARCACIONES - EMBARCACIONES
    async getBoatCategories() {
      try {
        const { data } = await siibApi.get('/resource/boatCategories')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE EQUIPAMIENTO DE EMBARCACIONES - EMBARCACIONES
    async getBoatEquipment() {
      try {
        const { data } = await siibApi.get('/resource/boatEquipment')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE MARCAS DE CELULARES - EQUIPOS ELECTRONICOS
    async getCellPhones() {
      try {
        const { data } = await siibApi.get('/resource/cellPhones')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE PRECIOS BASE DE MARCAS DE CELULARES - EQUIPOS ELECTRONICOS
    async getCellPhoneBasePrice() {
      try {
        const { data } = await siibApi.get('/resource/cellPhoneBasePrice')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE SISTEMAS OPERATIVOS DE COMPUTADORAS - EQUIPOS ELECTRONICOS
    async getOperatingSystems() {
      try {
        const { data } = await siibApi.get('/resource/operatingSystems')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE PRECIOS BASE DE SISTEMAS OPERATIVOS DE COMPUTADORAS - EQUIPOS ELECTRONICOS
    async getOperatingSystemBasePrice() {
      try {
        const { data } = await siibApi.get('/resource/operatingSystemBasePrice')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE SISTEMAS OPERATIVOS DE COMPUTADORAS - EQUIPOS ELECTRONICOS
    async getComputerComponent() {
      try {
        const { data } = await siibApi.get('/resource/computerComponent')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE SISTEMAS OPERATIVOS DE COMPUTADORAS - EQUIPOS ELECTRONICOS
    async getElectronicEquipmentBasePrice() {
      try {
        const { data } = await siibApi.get('/resource/electronicEquipmentBasePrice')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE PIEZAS DEL VEHICULO - VEHICULOS
    async getVehicleParts() {
      try {
        const { data } = await siibApi.get('/resource/vehicleParts')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE MENU
    async getMenu() {
      try {
        const { data } = await siibApi.get('/resource/menu')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE MENU SEGUN CADA PERFIL
    async getProfileMenu() {
      try {
        const { data } = await siibApi.get('/resource/profileMenu')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE EL NOMBRE DEL TIPO DE BIEN
    async getPropertyType(id_bien: any) {
      try {
        const { data } = await siibApi.get('/resource/propertyType/' + id_bien)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE EL NOMBRE DEL TIPO DE BIEN
    async getPropertyCharacteristic(id_bien_registro: any) {
      try {
        const { data } = await siibApi.get('/resource/propertyCharacteristic/' + id_bien_registro)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LISTA DE DOCUMENTACION REQUERIDA POR TIPO DE BIEN
    async getDocumentationByPropertyId(id_bien: any) {
      try {
        const { data } = await siibApi.get('/resource/documentationByPropertyId/' + id_bien)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE ACREDITACIONES ESTADO JURIDICO - REVISION DOCUMENTAL
    async getAccreditations() {
      try {
        const { data } = await siibApi.get('/resource/accreditations')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LISTA DE RECEPCIONES DOCUMENTALES PARA REVISION DOCUMENTAL, OMITIENDO LOS REGISTROS YA REVISADOS
    async getReceptionsForReview(id_caso: any, id_bien_registro: any) {
      try {
        const userLogged = JSON.parse(localStorage.getItem('user') || '').cedula_identidad
        const { data } = await siibApi.get('/resource/receptionsForReview/' + id_caso + '/' + id_bien_registro + '/' + userLogged)
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // OBTIENE LA LISTA DE LOS MOTIVOS PARA LOGISTICA DE RECEPCION
    async getReceptionLogisticsReasons() {
      try {
        const { data } = await siibApi.get('/resource/receptionLogisticsReasons')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // GASTOS ADMINISTRATIVOS - COMPROBANTES
    async getVouchers() {
      try {
        const { data } = await siibApi.get('/resource/vouchers')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // GASTOS ADMINISTRATIVOS - DOCUMENTOS DE GASTO
    async getExpenseDocuments() {
      try {
        const { data } = await siibApi.get('/resource/expenseDocuments')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // GASTOS ADMINISTRATIVOS - SEVICIOS
    async getServices() {
      try {
        const { data } = await siibApi.get('/resource/services')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // GASTOS ADMINISTRATIVOS - VIAS DE GASTO
    async getSpendingAvenues() {
      try {
        const { data } = await siibApi.get('/resource/spendingAvenues')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    // GASTOS ADMINISTRATIVOS - BIENES CON INVENTARIO FINALIZADO
    async getPropertyEntered() {
      try {
        const { data } = await siibApi.get('/resource/propertyEntered')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async getInstances() {
      try {
        const { data } = await siibApi.get('/resource/instances')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

    async getSerivicio_t() {
      try {
        const { data } = await siibApi.get('/resource/servicio')
        return data
      } catch (error: any) {
        const message = (error.response.data ? error.response.data.message : 'error: sin conexion')
        return { ok: false, message: message }
      }
    },

  }
});
