import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useNequi, validarNumeroTelefono } from "../logica/useNequi";
import { ArrowLeft, CheckCircle } from "lucide-react"; // íconos

const Nequi = () => {
  const navigate = useNavigate();
  const { claveNequi, tiempoRestante, generarClaveNequi } = useNequi();
  const [datos, setDatos] = useState({
    numeroIngresado: "",
    claveIngresada: "",
  });

  useEffect(() => {
    generarClaveNequi();
    // eslint-disable-next-line
  }, []);

  const continuarARetiro = (claveCorrecta) => {
    if (datos.claveIngresada === claveCorrecta) {
      localStorage.setItem(
        "datosNequi",
        JSON.stringify({
          numeroIngresado: datos.numeroIngresado,
          claveValidada: true,
        })
      );
      navigate("/retiro");
    } else {
      Swal.fire({
        icon: "error",
        title: "Clave incorrecta",
        text: "❌ Intente nuevamente.",
        confirmButtonText: "Reintentar",
      });
      setDatos((prev) => ({ ...prev, claveIngresada: "" }));
    }
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

        <div className="alert alert-info text-center rounded-3">
          <p className="mb-1 fw-bold">Clave temporal Nequi:</p>
          <h3 className="fw-bold text-primary">{claveNequi}</h3>
          <small className="text-muted">
            ⏰ Expira en: <strong>{tiempoRestante}</strong>s
          </small>
        </div>

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
          <button
            className="btn btn-danger flex-fill d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} /> Volver
          </button>
          <button
            className="btn btn-success flex-fill d-flex align-items-center justify-content-center gap-2"
            onClick={() => continuarARetiro(claveNequi)}
            disabled={
              !validarNumeroTelefono(datos.numeroIngresado) ||
              datos.claveIngresada.length !== 6
            }
          >
            <CheckCircle size={18} /> Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nequi;

