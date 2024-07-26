import Libsodium from 'libsodium-wrappers';
//import _sodium from 'libsodium-wrappers';
// Función para inicializar Libsodium
async function initializeLibsodium() {
    await Libsodium.ready;
}

//Función para generar una clave aleatoria
export async function generateRandomKey() {
  await initializeLibsodium();
  return Libsodium.crypto_secretbox_keygen();
}

// Función para cifrar un mensaje
export async function encryptMessage(id: any, secretKey: any) {
    await initializeLibsodium();
    // Generar una clave de cifrado
    //const nonce = Libsodium.crypto_secretbox_keygen();
    const nonce = Libsodium.randombytes_buf(Libsodium.crypto_secretbox_NONCEBYTES);
    //console.log('Clave generada (hexadecimal):', Libsodium.to_hex(secretKey));
    // Cifrar el mensaje
    const encrypted = Libsodium.crypto_secretbox_easy(id, nonce, secretKey);
    console.log('id_juzgado: ',id)
    const encriptado = Libsodium.to_hex(encrypted)
    console.log('Mensaje cifrado (hexadecimal):',encriptado);
    
    return { encriptado, nonce };
}

// Función para descifrar un mensaje
export async function decryptMessage(encrypted: any, nonce: any, secretKey: any) {
    await initializeLibsodium();
    // Descifrar el mensaje
    const decrypted = Libsodium.crypto_secretbox_open_easy(encrypted, nonce, secretKey);
    return decrypted;
}



//otro ejemplo
// //const message = "This is a secret message";
// //const secretKey = _sodium.crypto_secretbox_keygen();

// // // Función para cifrar un mensaje
// // export async function encryptMessage(message: string, secretKey: any) {
// //   await initializeLibsodium();
// //   console.log("Hola")
// //   const nonce = _sodium.crypto_secretbox_keygen();
// //   const encrypted = _sodium.crypto_secretbox_easy(message, nonce, secretKey);
// //   return { encrypted, nonce };
// // }

// // // Función para descifrar un mensaje
// // export async function decryptMessage(encrypted: any, nonce: any, secretKey: any) {
// //     await initializeLibsodium();
// //     // Descifrar el mensaje
// //     const decrypted =  _sodium.crypto_secretbox_open_easy(encrypted, nonce, secretKey);
// //     return decrypted;
// // }




  