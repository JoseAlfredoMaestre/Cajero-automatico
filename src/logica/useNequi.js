import { useState, useEffect } from 'react';

export function useNequi() {
  const [claveNequi, setClaveNequi] = useState('');
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
        setTiempoRestante(prev => {
          if (prev <= 1) {
            generarClaveNequi();
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