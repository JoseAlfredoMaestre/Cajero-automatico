
const billetes = [
  { valor: 10000 },
  { valor: 20000 },
  { valor: 50000 },
  { valor: 100000 }
];

// ALGORITMO DE ACARREO
export function calcularBilletes(monto) {
  if (!Number.isInteger(monto) || monto <= 0 || monto % 10000 !== 0) return null;
  const denominaciones = billetes.map(b => b.valor);
  const counts = Array(denominaciones.length).fill(0);
  let restante = monto;
  let pos = 0;
  let iter = 0;
  const MAX_ITER = 10000; 
  while (restante > 0 && iter < MAX_ITER) {
    let denom = denominaciones[pos];
    let i = pos;

    while (i < denominaciones.length && denom <= restante && restante > 0) {
      counts[i]++;           
      restante -= denom;     
      i++;
      denom = denominaciones[i % denominaciones.length]; 
    }
    pos = (pos + 1) % denominaciones.length;
    iter++;
  }

  if (restante !== 0) {
    return null;
  }

  const resultado = {};
  denominaciones.forEach((d, idx) => (resultado[d] = counts[idx]));
  return resultado;
}



export function calcularRetirosRestantes() {
  return Infinity; 
}
export function formatearNumeroCompleto(numero) {
  return "0" + numero;
}
export function validarNumeroTelefono(numero) {
  return /^\d{10}$/.test(numero); // 
}
