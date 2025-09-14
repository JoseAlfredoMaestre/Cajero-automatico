// ===== VALIDACIONES PARA CUENTA DE AHORRO A LA MANO =====

export function validarCuentaAhorro(cuenta) {
  // Validar longitud exacta de 11 dígitos
  if (cuenta.length !== 11) return false;
  
  // Validar que solo contenga números
  if (!/^\d{11}$/.test(cuenta)) return false;
  
  // Validar primer dígito (solo 0 o 1)
  const primerDigito = cuenta[0];
  if (primerDigito !== '0' && primerDigito !== '1') return false;
  
  // Validar segundo dígito (debe ser 3)
  const segundoDigito = cuenta[1];
  if (segundoDigito !== '3') return false;
  
  return true;
}

export function validarClaveRetiro(clave) {
  // Validar longitud exacta de 4 dígitos
  if (clave.length !== 4) return false;
  
  // Validar que solo contenga números
  return /^\d{4}$/.test(clave);
}

export function validarDatosCompletos(numeroIngresado, claveIngresada) {
  return validarCuentaAhorro(numeroIngresado) && validarClaveRetiro(claveIngresada);
}

// ===== FUNCIÓN DE COMPATIBILIDAD (si necesitas mantener nombres anteriores) =====
export function validarCuentaGeneral(cuenta) {
  return validarCuentaAhorro(cuenta);
}