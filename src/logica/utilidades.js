// utilidades.js (reemplaza/pega en tu archivo existente)

// ===== DEFINICIÓN DE BILLETES =====
// Orden ascendente (10k -> 100k) para implementar la lógica del acarreo
const billetes = [
  { valor: 10000 },
  { valor: 20000 },
  { valor: 50000 },
  { valor: 100000 }
];

// ===== VALIDAR NÚMERO DE TELÉFONO =====
export function validarNumeroTelefono(numero) {
  return /^\d{10}$/.test(numero); // 10 dígitos exactos
}

// ===== FUNCION: CALCULAR BILLETES (ALGORITMO DE ACARREO) =====
export function calcularBilletes(monto) {
  // monto válido: múltiplo de 10.000 y mayor que 0
  if (!Number.isInteger(monto) || monto <= 0 || monto % 10000 !== 0) return null;

  const denominaciones = billetes.map(b => b.valor);
  const counts = Array(denominaciones.length).fill(0);

  let restante = monto;
  let pos = 0;
  let iter = 0;
  const MAX_ITER = 10000; // protección contra bucle infinito

  // Reproducimos la lógica del PHP: iterar empezando en pos=0, luego pos=1, ...
  while (restante > 0 && iter < MAX_ITER) {
    let denom = denominaciones[pos];
    let i = pos;

    // Intentamos sumar billetes desde la posición actual hacia adelante
    while (i < denominaciones.length && denom <= restante && restante > 0) {
      counts[i]++;           // usamos un billete de esa denominación
      restante -= denom;     // reducimos el restante
      i++;
      denom = denominaciones[i % denominaciones.length]; // siguiente denom (si i sale del rango, se toma módulo)
    }

    // avanzamos la posición de inicio (pos) de forma cíclica
    pos = (pos + 1) % denominaciones.length;
    iter++;
  }

  if (restante !== 0) {
    // No se pudo formar el monto exacto con las denominaciones (debería pasar solo en montos inválidos)
    return null;
  }

  // Convertimos counts a un objeto { 10000: n, 20000: n, ... }
  const resultado = {};
  denominaciones.forEach((d, idx) => (resultado[d] = counts[idx]));

  return resultado;
}

// ===== (Opcional) Retiros 'ilimitados' si no manejas inventario =====
export function calcularRetirosRestantes() {
  return Infinity; // o un número grande si prefieres
}

// ===== FORMATEAR NÚMERO COMPLETO =====
export function formatearNumeroCompleto(numero) {
  return "0" + numero;
}

