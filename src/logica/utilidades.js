// ===== DEFINICIÓN DE BILLETES DISPONIBLES =====
let billetes = [
  { valor: 100000, disponibles: 25 },
  { valor: 50000, disponibles: 40 },
  { valor: 20000, disponibles: 60 },
  { valor: 10000, disponibles: 80 }
];

export function validarNumeroTelefono(numero) {
  if (numero.length !== 10) return false;
  return /^\d{10}$/.test(numero);
}

// ===== ALGORITMO DE ACARREO COMPLETO CON REINICIO =====
export function generarMatrizAcarreo(cantidad) {
  let matriz = [];
  let suma = 0;
  let totalRows = 0;
  let alcanzado = false;
  let iteraciones = 0;
  const maxIteraciones = 2000;

  while (!alcanzado && iteraciones < maxIteraciones) {
    let fila = new Array(billetes.length).fill(0);
    let sePudoSumar = false;
    let sumaTemporal = suma;

    for (let j = totalRows; j < billetes.length; j++) {
      if (sumaTemporal + billetes[j].valor <= cantidad) {
        fila[j] = 1;
        sumaTemporal += billetes[j].valor;
        sePudoSumar = true;

        if (sumaTemporal === cantidad) {
          alcanzado = true;
          suma = sumaTemporal;
          break;
        }
      }
    }

    suma = sumaTemporal;
    matriz.push(fila);

    if (!sePudoSumar) {
      if (totalRows >= billetes.length - 1) {
        totalRows = 0;
        suma = 0;
        matriz = [];
      } else {
        totalRows++;
      }
    } else {
      totalRows++;
    }

    if (totalRows >= billetes.length) {
      totalRows = 0;
    }

    iteraciones++;
  }

  return { matriz, alcanzado, suma };
}

// ===== CALCULAR BILLETES DESDE LA MATRIZ =====
export function calcularBilletesDesdeMatriz(matriz) {
  let contadorBilletes = { 100000: 0, 50000: 0, 20000: 0, 10000: 0 };

  matriz.forEach((fila) => {
    fila.forEach((valor, columnaIndex) => {
      if (valor === 1 && columnaIndex < billetes.length) {
        const billete = billetes[columnaIndex];
        contadorBilletes[billete.valor]++;
      }
    });
  });

  return contadorBilletes;
}

// ===== FUNCIÓN PRINCIPAL =====
export function calcularBilletes(monto) {
  if (monto % 10000 !== 0 || monto <= 0) {
    return null;
  }

  const resultadoAcarreo = generarMatrizAcarreo(monto);

  if (resultadoAcarreo.alcanzado && resultadoAcarreo.suma === monto) {
    const contadorBilletes = calcularBilletesDesdeMatriz(resultadoAcarreo.matriz);

    if (verificarDisponibilidad(contadorBilletes)) {
      actualizarDisponibilidad(contadorBilletes);
      return contadorBilletes;
    }
  }

  return null;
}

// ===== VERIFICAR DISPONIBILIDAD =====
export function verificarDisponibilidad(billetesRequeridos) {
  for (let [valor, cantidad] of Object.entries(billetesRequeridos)) {
    const billete = billetes.find(b => b.valor === parseInt(valor));
    if (billete && cantidad > billete.disponibles) {
      return false;
    }
  }
  return true;
}

// ===== ACTUALIZAR DISPONIBILIDAD =====
export function actualizarDisponibilidad(billetesRetirados) {
  Object.entries(billetesRetirados).forEach(([denominacion, cantidad]) => {
    const billete = billetes.find(b => b.valor === parseInt(denominacion));
    if (billete && cantidad > 0) {
      billete.disponibles = Math.max(0, billete.disponibles - cantidad);
    }
  });
}

// ===== CALCULAR RETIROS RESTANTES =====
export function calcularRetirosRestantes() {
  const disponibilidadActual = billetes.map(b => b.disponibles);
  const minimoDisponible = Math.min(...disponibilidadActual);
  return Math.max(0, Math.floor(minimoDisponible * 0.8));
}

// ===== FORMATEAR NÚMERO COMPLETO =====
export function formatearNumeroCompleto(numero) {
  return '0' + numero;
}
