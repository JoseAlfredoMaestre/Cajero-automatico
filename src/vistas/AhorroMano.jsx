import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarCuentaAhorro } from "../logica/useAhorroMano";

const AhorroMano = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    numeroIngresado: "",
    claveIngresada: "",
  });
  const [errorCuenta, setErrorCuenta] = useState("");

  const manejarCambioCuenta = (e) => {
    const valorIngresado = e.target.value;
    const valorLimpio = valorIngresado.replace(/[^0-9]/g, "");

    let nuevoValor = "";
    let error = "";

    for (let i = 0; i < valorLimpio.length && i < 11; i++) {
      const digito = valorLimpio[i];

      if (i === 0) {
        if (["0", "1"].includes(digito)) nuevoValor += digito;
        else {
          error = "El primer dígito debe ser 0 o 1";
          break;
        }
      } else if (i === 1) {
        if (digito === "3") nuevoValor += digito;
        else {
          error = "El segundo dígito debe ser 3";
          break;
        }
      } else {
        nuevoValor += digito;
      }
    }

    setErrorCuenta(error);
    setDatos((d) => ({ ...d, numeroIngresado: nuevoValor }));
  };

  const manejarCambioClave = (e) => {
    const valor = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setDatos((d) => ({ ...d, claveIngresada: valor }));
  };

  const esValido =
    validarCuentaAhorro(datos.numeroIngresado) &&
    datos.claveIngresada.length === 4;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff, #e0f7fa)",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%", borderRadius: "16px" }}
      >
        <h2 className="text-center mb-4 text-primary">🏦 Ahorro a la Mano</h2>

        <div className="alert alert-info text-center rounded-3 mb-4">
          <small>
            <strong>Formato requerido:</strong> 11 dígitos <br />
            (1er dígito: 0 o 1 | 2do: 3)
          </small>
        </div>

        {/* Número de cuenta */}
        <div className="mb-3">
          <label className="form-label fw-bold">Número de cuenta</label>
          <input
            type="text"
            className={`form-control ${errorCuenta ? "is-invalid" : ""}`}
            value={datos.numeroIngresado}
            onChange={manejarCambioCuenta}
            placeholder="03012345678"
            maxLength="11"
            inputMode="numeric"
          />
          {errorCuenta && <div className="invalid-feedback">{errorCuenta}</div>}
          {datos.numeroIngresado.length === 11 &&
            !validarCuentaAhorro(datos.numeroIngresado) && (
              <div className="text-danger small mt-1">
                ❌ Formato inválido. Debe iniciar con 03
              </div>
            )}
          <small className="text-muted">
            Ejemplo válido: <strong>03012345678</strong>
          </small>
        </div>

        {/* Clave */}
        <div className="mb-4">
          <label className="form-label fw-bold">Clave</label>
          <input
            type="password"
            className="form-control"
            value={datos.claveIngresada}
            onChange={manejarCambioClave}
            placeholder="4 dígitos"
            maxLength="4"
            inputMode="numeric"
          />
          {datos.claveIngresada.length > 0 &&
            datos.claveIngresada.length !== 4 && (
              <div className="text-danger small mt-1">
                ❌ La clave debe tener 4 dígitos
              </div>
            )}
        </div>

        {/* Botón continuar */}
        <button
          className="btn btn-success w-100 fw-bold mb-3"
          style={{
            borderRadius: "12px",
            background: "linear-gradient(90deg, #28a745, #34d058)",
            border: "none",
          }}
          onClick={() => {
            localStorage.setItem("datosAhorros", JSON.stringify(datos));
            navigate("/retiro-ahorro-mano");
          }}
          disabled={!esValido}
        >
          {esValido ? "✅ Continuar" : "❌ Complete correctamente"}
        </button>

        {esValido && (
          <div className="text-center mb-3">
            <small className="text-success fw-bold">
              ✓ Cuenta: {datos.numeroIngresado} <br /> ✓ Clave:{" "}
              {"•".repeat(datos.claveIngresada.length)}
            </small>
          </div>
        )}

        {/* Botón volver */}
        <button
          className="btn w-100 fw-bold"
          style={{
            borderRadius: "12px",
            background: "linear-gradient(90deg, #6c757d, #adb5bd)",
            color: "white",
            border: "none",
          }}
          onClick={() => navigate("/")}
        >
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default AhorroMano;
