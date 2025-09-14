import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarCuentaGeneral } from "../logica/useCuentaAhorros";

const CuentaAhorros = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    numeroIngresado: "",
    claveIngresada: "",
  });

  const esValido =
    validarCuentaGeneral(datos.numeroIngresado) &&
    datos.claveIngresada.length === 4;

  const handleContinuar = () => {
    localStorage.setItem("datosCuentaAhorros", JSON.stringify(datos));
    navigate("/retiro-cuenta-ahorro");
  };

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 col-12 col-md-6 rounded-4">
        <h2 className="text-center mb-4 text-primary">Cuenta de Ahorros</h2>

        <div className="mb-3">
          <label className="form-label fw-bold">Número de cuenta:</label>
          <input
            type="text"
            className="form-control"
            value={datos.numeroIngresado}
            onChange={(e) =>
              setDatos((d) => ({
                ...d,
                numeroIngresado: e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11),
              }))
            }
            placeholder="03012345678"
            maxLength={11}
            inputMode="numeric"
          />
          <small className="text-muted">
            11 dígitos - Ejemplo: 03012345678
          </small>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Clave:</label>
          <input
            type="password"
            className="form-control"
            value={datos.claveIngresada}
            onChange={(e) =>
              setDatos((d) => ({
                ...d,
                claveIngresada: e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 4),
              }))
            }
            placeholder="4 dígitos"
            maxLength={4}
            inputMode="numeric"
          />
          {datos.claveIngresada.length > 0 &&
            datos.claveIngresada.length !== 4 && (
              <div className="text-danger small mt-1">
                La clave debe tener 4 dígitos
              </div>
            )}
        </div>

        <div className="d-flex gap-3">
          <button
            className="btn btn-danger flex-fill"
            onClick={() => navigate("/")}
          >
            Volver
          </button>
          <button
            className="btn btn-success flex-fill"
            onClick={handleContinuar}
            disabled={!esValido}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuentaAhorros;
