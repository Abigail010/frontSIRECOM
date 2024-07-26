export function validateText(texto: string) {
  return (texto && texto != '') ? texto.replace(/['`"=]+/g, '') : ''
}

