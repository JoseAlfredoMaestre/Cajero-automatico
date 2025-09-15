import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  calcularBilletes,
  formatearNumeroCompleto,
} from "../logica/utilidades";

const Retiro = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [montoSeleccionado, setMontoSeleccionado] = useState("");
  const [montoPersonalizado, setMontoPersonalizado] = useState("");
  const [billetes, setBilletes] = useState(null);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  
  // Estados para el código temporal
  const [codigoTemporal, setCodigoTemporal] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [montoARetirar, setMontoARetirar] = useState(0);

  const montosFijos = [10000, 20000, 50000, 100000];

  useEffect(() => {
    const datosGuardados = localStorage.getItem("datosNequi");
    if (datosGuardados) {
      setDatos(JSON.parse(datosGuardados));
    } else {
      navigate("/nequi");
    }
  }, [navigate]);

  // Generar código de 6 dígitos
  const generarCodigo = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoTemporal(codigo);
    setTiempoRestante(60);
  };

  // Efecto para el contador regresivo
  useEffect(() => {
    let interval;
    if (tiempoRestante > 0 && mostrarCodigo) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            // Genera nuevo código automáticamente al llegar a 0
            generarCodigo();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tiempoRestante, mostrarCodigo]);

  const procesarRetiro = (monto) => {
    const resultado = calcularBilletes(monto);

    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: "Monto inválido",
        text: `❌ El monto $${monto.toLocaleString()} no puede ser entregado. Solo se permiten múltiplos de $10.000 (10K, 20K, 50K, 100K).`,
        confirmButtonText: "Ir al inicio",
      }).then(() => {
        navigate("/");
      });
      return;
    }

    setBilletes(resultado);
    setMostrarReporte(true);
    setMostrarCodigo(false);

    Swal.fire({
      icon: "success",
      title: "✅ Retiro exitoso",
      text: `Se retiró correctamente $${monto.toLocaleString()}`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const confirmarRetiro = (monto) => {
    Swal.fire({
      title: "Confirmar Retiro",
      text: `¿Está seguro que desea retirar ${monto.toLocaleString()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, retirar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setMontoARetirar(monto);
        generarCodigo();
        setMostrarCodigo(true);
        setCodigoIngresado("");
      }
    });
  };

  const validarCodigo = () => {
    if (codigoIngresado === codigoTemporal) {
      procesarRetiro(montoARetirar);
    } else {
      Swal.fire({
        icon: "error",
        title: "Código incorrecto",
        text: "El código ingresado no coincide con el código temporal actual.",
        confirmButtonText: "Intentar de nuevo",
      });
      setCodigoIngresado("");
    }
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
    localStorage.removeItem("datosNequi");
    navigate("/");
  };

  const reiniciarProceso = () => {
    localStorage.removeItem("datosNequi");
    navigate("/nequi");
  };

  const cancelarCodigo = () => {
    setMostrarCodigo(false);
    setCodigoIngresado("");
    setTiempoRestante(0);
  };

  if (!datos) {
    return <div className="container mt-4 text-center">Cargando...</div>;
  }

  const numeroCompleto = formatearNumeroCompleto(datos.numeroIngresado);

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
        style={{ maxWidth: "600px", width: "100%", borderRadius: "20px" }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">
          💵 Retiro de Dinero
        </h3>

        {/* Pantalla de código temporal */}
        {mostrarCodigo && (
          <div className="text-center mb-4">
            <div className="alert alert-info border-primary rounded-4 shadow-sm p-4">
              <h4 className="text-primary fw-bold mb-3">🔐 Código Temporal</h4>
              <div 
                className="display-4 fw-bold text-success mb-3 p-3 rounded-3"
                style={{ backgroundColor: "#f8f9fa", letterSpacing: "0.2em" }}
              >
                {codigoTemporal}
              </div>
              <div className="mb-3">
                <span className="badge bg-warning text-dark fs-5 p-2">
                  ⏱️ {tiempoRestante}s
                </span>
              </div>
              <p className="text-muted mb-3">
                Ingrese este código para completar el retiro de ${montoARetirar.toLocaleString()}
              </p>
              
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control text-center fs-5"
                  value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="Ingrese el código"
                  maxLength="6"
                  style={{ letterSpacing: "0.2em" }}
                />
              </div>
              
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success flex-fill fw-bold"
                  onClick={validarCodigo}
                  disabled={codigoIngresado.length !== 6}
                >
                  Validar Código
                </button>
                <button
                  className="btn btn-secondary flex-fill"
                  onClick={cancelarCodigo}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {!mostrarReporte && !mostrarCodigo && (
          <>
            {/* Montos fijos */}
            <div className="mb-4">
              <h5 className="mb-3 fw-bold text-success">Montos disponibles</h5>
              <div className="row g-3">
                {montosFijos.map((monto) => (
                  <div key={monto} className="col-6 col-md-3">
                    <button
                      className="btn w-100 fw-bold text-white"
                      style={{
                        borderRadius: "12px",
                        background: "linear-gradient(90deg, #28a745, #34d058)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                      onClick={() => handleMontoFijo(monto)}
                    >
                      ${monto.toLocaleString()}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Monto personalizado */}
            <div className="mb-4">
              <h5 className="mb-3 fw-bold text-success">Otro monto</h5>
              <div
                className="input-group shadow-sm"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <span className="input-group-text fw-bold bg-success text-white">
                  $
                </span>
                <input
                  type="number"
                  className="form-control"
                  value={montoPersonalizado}
                  onChange={(e) => setMontoPersonalizado(e.target.value)}
                  placeholder="Ingrese monto personalizado"
                  min="10000"
                  step="10000"
                />
                <button
                  className="btn fw-bold text-white"
                  style={{
                    background: "linear-gradient(90deg, #28a745, #34d058)",
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
          </>
        )}

        {/* Reporte */}
        {mostrarReporte && billetes && (
          <div className="mt-4">
            <div className="alert alert-light border border-success rounded-4 shadow-sm p-4">
              <h4 className="text-success fw-bold">📋 Reporte de Retiro</h4>
              <hr />

              <div className="mb-3">
                <strong>Cuenta / Número:</strong> {numeroCompleto}
                <br />
                <strong>Monto retirado:</strong>{" "}
                <span className="text-primary fw-bold">
                  ${montoSeleccionado.toLocaleString()}
                </span>
              </div>

              <div className="mb-3">
                <strong>Billetes entregados:</strong>
                <div className="row mt-3">
                  {Object.entries(billetes).map(([denominacion, cantidad]) =>
                    cantidad > 0 ? (
                      <div key={denominacion} className="col-6 col-md-3 mb-3">
                        <div
                          className="p-2 text-center text-white fw-bold"
                          style={{
                            background:
                              "linear-gradient(90deg, #28a745, #34d058)",
                            borderRadius: "12px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          }}
                        >
                          {cantidad}x ${parseInt(denominacion).toLocaleString()}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              <button
                className="btn w-100 fw-bold text-white mt-3"
                style={{
                  borderRadius: "12px",
                  background: "linear-gradient(90deg, #007bff, #00aaff)",
                  border: "none",
                }}
                onClick={volverAInicio}
              >
                Finalizar y Volver al Inicio
              </button>
            </div>
          </div>
        )}

        {/* Botón volver */}
        {!mostrarReporte && !mostrarCodigo && (
          <button
            className="btn w-100 fw-bold mt-3 text-white"
            style={{
              borderRadius: "12px",
              background: "linear-gradient(90deg, #6c757d, #adb5bd)",
              border: "none",
            }}
            onClick={() => navigate("/nequi")}
          >
            Volver
          </button>
        )}
      </div>
    </div>
  );
};

export default Retiro;