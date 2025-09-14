// ===== VALIDACIONES PARA CUENTA DE AHORROS =====

export function validarCuentaAhorros(cuenta) {
  // Validar longitud
  if (cuenta.length !== 11) return false;
  
  // Validar que solo contenga números
  if (!/^\d{11}$/.test(cuenta)) return false;
  
  // Validar primer dígito (solo 0 o 1)
  const primerDigito = cuenta[0];
  if (!['0', '1'].includes(primerDigito)) return false;
  
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
  return validarCuentaAhorros(numeroIngresado) && validarClaveRetiro(claveIngresada);
}

// ===== FORMATEAR CUENTA PARA MOSTRAR =====
export function formatearCuentaCompleta(numero) {
  // Ya tiene 11 dígitos, solo lo retornamos tal como está
  return numero;
}

// ===== FUNCIÓN DE COMPATIBILIDAD (para mantener el nombre anterior) =====
export function validarCuentaGeneral(cuenta) {
  // Solo valida que sean 11 dígitos numéricos
  return /^\d{11}$/.test(cuenta);
}