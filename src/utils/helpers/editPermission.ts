import siibApi from "@/api/siibApi"
import { useResourceStore } from '@/stores/resource';

export function editPermission(modulo_actual: string) {
  let permiso
  const perfil = JSON.parse(localStorage.getItem('user') || '').nombre_perfil
  if(perfil == 'SUPERADMIN'){
    permiso = true
  }else{
    // OBTENEMOS LOS MODULOS QUE TIENE HABILITADOS EN SUS PERMISOS
    const modulos_disponibles:any = localStorage.getItem('permissions')?.split(',')
    // VERIFICAMOS SI TIENE ACCESO AL MODULO EN EL QUE SE ENCUENTRA
    const seEncuentra = modulos_disponibles.find( (elemento:any) => elemento == modulo_actual )
    if(seEncuentra){
      // EXISTE EL PERMISO, VERIFICAR SI EDICION ESTA EN TRUE
      const resourceStore = useResourceStore()
      const existe = async () => {
        const resultado = await resourceStore.checkPermission(modulo_actual)
        permiso = resultado
      }
      existe()
    }else{
      // NO EXISTE EL PERMISO DEVOLVER FALSO
      permiso = false
    }
  }
  return permiso
}

