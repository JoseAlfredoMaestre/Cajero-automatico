import { useState, useEffect } from "react";

// Validar número de teléfono Nequi con indicativos permitidos
export function validarNumeroTelefono(numero) {
  if (numero.length !== 10) return false;
  const indicativos = [
    "300", "301", "302", "304", "305", "313", "314", "315", "316", "317", "318", "319",
    "320", "321", "322", "323", "324", "350", "351", "312", "310"
  ];
  const prefijo = numero.substring(0, 3);
  return indicativos.includes(prefijo) && /^\d{10}$/.test(numero);
}

export function useNequi() {
  const [claveNequi, setClaveNequi] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const generarClaveNequi = () => {
    const clave = Math.floor(100000 + Math.random() * 900000).toString();
    setClaveNequi(clave);
    setTiempoRestante(60);
  };

  useEffect(() => {
    let interval;
    if (tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            // Genera nueva clave automáticamente
            const nuevaClave = Math.floor(100000 + Math.random() * 900000).toString();
            setClaveNequi(nuevaClave);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tiempoRestante]);

  return { claveNequi, tiempoRestante, generarClaveNequi };
}
