export default function renameFiles(form: any, form_array: any, table_name: string) {
    const formData = new FormData()

    // console.log(form)
    formData.append('id_bien registro',form_array.fotografias[0].id_bien_registro)
    for (let i = 0; i < form_array.fotografias.length; i++) {
         const archivo = form_array.fotografias[i]
         if (archivo.imagen) {
           formData.append('formulario',archivo.picture )
          
           console.log(archivo.picture.name)
         }
    }
    
    formData.append('formulario', JSON.stringify(form))
    return formData
} 