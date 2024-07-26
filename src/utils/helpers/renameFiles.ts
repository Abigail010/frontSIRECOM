export default function renameFiles(form: any, form_array: any, table_name: string) {
    const formData = new FormData()
    formData.append('id_bien_registro', form_array.fotografias[0].id_bien_registro)
    for (let i = 0; i < form_array.fotografias.length; i++) {
        const archivo = form_array.fotografias[i]
        // console.log(archivo)
        if(archivo.imagen){
            formData.append('uploaded_image', archivo.picture)
        }
    }
    formData.append('formulario', JSON.stringify(form))

    for (let pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    
    return formData
} 