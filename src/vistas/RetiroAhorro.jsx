import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  calcularBilletes,
  calcularRetirosRestantes,
} from "../logica/utilidades";
import { formatearCuentaCompleta } from "../logica/useCuentaAhorros";

const RetiroAhorro = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [montoSeleccionado, setMontoSeleccionado] = useState("");
  const [montoPersonalizado, setMontoPersonalizado] = useState("");
  const [billetes, setBilletes] = useState(null);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  const montosFijos = [10000, 20000, 50000, 100000];

  // Cargar datos de cuenta desde localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem("datosAhorros");
    if (datosGuardados) {
      setDatos(JSON.parse(datosGuardados));
    } else {
      navigate("/ahorros");
    }
  }, [navigate]);

  const procesarRetiro = (monto) => {
    const resultado = calcularBilletes(monto);

    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: "Monto inválido",
        text: `❌ El monto $${monto.toLocaleString()} no puede ser entregado.`,
        confirmButtonText: "Ir al inicio",
      }).then(() => {
        navigate("/");
      });
      return;
    }

    setBilletes(resultado);
    setMostrarReporte(true);

    Swal.fire({
      icon: "success",
      title: "✅ Retiro exitoso",
      text: `Se retiró correctamente $${monto.toLocaleString()} de su cuenta de ahorros`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const confirmarRetiro = (monto) => {
    Swal.fire({
      title: "💳 Confirmar Retiro de Ahorros",
      text: `¿Está seguro que desea retirar $${monto.toLocaleString()} de su cuenta de ahorros?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, retirar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) procesarRetiro(monto);
    });
  };

  const handleMontoFijo = (monto) => {
    setMontoSeleccionado(monto);
    setMontoPersonalizado("");
    confirmarRetiro(monto);
  };

  const handleMontoPersonalizado = () => {
    const monto = parseInt(montoPersonalizado);
    if (isNaN(monto) || monto <= 0 || monto % 10000 !== 0) {
      Swal.fire({
        icon: "warning",
        title: "Monto no válido",
        text: "Por favor ingrese un monto mayor a 0 y múltiplo de $10.000",
        confirmButtonText: "Ir al inicio",
      }).then(() => {
        navigate("/");
      });
      return;
    }
    setMontoSeleccionado(monto);
    confirmarRetiro(monto);
  };

  const volverAInicio = () => {
    localStorage.removeItem("datosAhorros");
    navigate("/");
  };

  const reiniciarProceso = () => {
    localStorage.removeItem("datosAhorros");
    navigate("/ahorro-mano");
  };

  if (!datos) {
    return <div className="container mt-4 text-center">Cargando...</div>;
  }

  const cuentaCompleta = formatearCuentaCompleta(datos.numeroIngresado);
  const retirosRestantes = calcularRetirosRestantes();

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
        style={{ maxWidth: "600px", width: "100%", borderRadius: "16px" }}
      >
        <h3 className="text-center mb-4 text-primary">
          💳 Retiro Ahorro a la Mano
        </h3>

        {!mostrarReporte ? (
          <>
            <div className="alert alert-light border rounded-3 mb-4">
              <strong>📋 Cuenta:</strong> {cuentaCompleta}
              <br />
              <strong>🔐 Clave:</strong>{" "}
              {"•".repeat(datos.claveIngresada?.length || 0)} (verificada)
            </div>

            <div className="mb-4">
              <h5 className="mb-3">💰 Montos</h5>
              <div className="row g-3">
                {montosFijos.map((monto) => (
                  <div key={monto} className="col-6 col-md-3">
                    <button
                      className="btn btn-outline-success w-100 fw-bold"
                      style={{ borderRadius: "12px" }}
                      onClick={() => handleMontoFijo(monto)}
                    >
                      ${monto.toLocaleString()}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="mb-3">✏️ Otro Monto</h5>
              <div className="input-group">
                <span className="input-group-text fw-bold">$</span>
                <input
                  type="number"
                  className="form-control"
                  value={montoPersonalizado}
                  onChange={(e) => setMontoPersonalizado(e.target.value)}
                  placeholder="Ingrese monto personalizado"
                  min="10000"
                  step="10000"
                  style={{ borderRadius: "8px" }}
                />
                <button
                  className="btn fw-bold"
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(90deg, #28a745, #34d058)",
                    color: "white",
                    border: "none",
                  }}
                  onClick={handleMontoPersonalizado}
                  disabled={!montoPersonalizado}
                >
                  Retirar
                </button>
              </div>
              <small className="text-muted">Solo múltiplos de $10.000</small>
            </div>

            <button
              className="btn w-100 fw-bold mt-3"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(90deg, #6c757d, #adb5bd)",
                color: "white",
                border: "none",
              }}
              onClick={() => navigate("/ahorro-mano")}
            >
              ← Volver
            </button>
          </>
        ) : (
          <div className="mt-4">
            <div className="card border-success shadow-sm p-3">
              <h4 className="text-success mb-3">
                📋 Reporte de Retiro - Ahorro a la Mano
              </h4>
              <hr />

              <div className="mb-3">
                <strong>Cuenta de ahorros: {cuentaCompleta}</strong>
                <br />
                <strong>
                  Clave: {"•".repeat(datos.claveIngresada?.length || 0)}{" "}
                  (verificada)
                </strong>
                <br />
                Monto retirado:{" "}
                <strong className="text-primary">
                  ${montoSeleccionado.toLocaleString()}
                </strong>
              </div>

              <div className="mb-3">
                <strong>💵 Billetes a Entregar:</strong>
                <div className="row mt-2">
                  {Object.entries(billetes).map(([denominacion, cantidad]) =>
                    cantidad > 0 ? (
                      <div key={denominacion} className="col-6 col-md-3 mb-2">
                        <div
                          className="p-2 text-center text-white fw-bold"
                          style={{
                            background: "#28a745",
                            borderRadius: "12px",
                          }}
                        >
                          {cantidad} x $
                          {parseInt(denominacion).toLocaleString()}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              <div className="mb-3">
                <strong>📊 Retiros Restantes: {retirosRestantes}</strong>
              </div>

              <button
                className="btn w-100 fw-bold"
                style={{
                  borderRadius: "12px",
                  background: "linear-gradient(90deg, #28a745, #34d058)",
                  color: "white",
                  border: "none",
                }}
                onClick={volverAInicio}
              >
                ✅ Finalizar y Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetiroAhorro;
