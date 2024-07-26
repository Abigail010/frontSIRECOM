export default function renameFiles(form: any, form_array: any) {
    const array_nombre_archivos = []
    const formData = new FormData()
    for (let i = 0; i < form_array.fotografias.length; i++) {
        if(form_array.fotografias[i]!= ''){
            const archivo = form_array.fotografias[i]
            const tipo = archivo[0].type.split('/')
            const nombre_archivo = Date.now()+'-'+i+'.'+tipo[1]
            array_nombre_archivos.push(nombre_archivo)
            formData.append("miArchivo", archivo[0], nombre_archivo)
        }
    }
    form.nombre_archivos_imagenes = array_nombre_archivos
    formData.append('formulario', JSON.stringify(form))
    return formData
}   