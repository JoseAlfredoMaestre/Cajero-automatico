import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nequi from "./Nequi";
import AhorroMano from "./AhorroMano";
import CuentaAhorros from "./CuentaAhorros";
import { calcularBilletes, calcularRetirosRestantes } from "../logica/utilidades";
import { Smartphone, PiggyBank, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const PantallaPrincipal = () => {
  const navigate = useNavigate();
  const [pantalla, setPantalla] = useState("menu");
  const [tipoRetiro, setTipoRetiro] = useState("");
  const [datos, setDatos] = useState({ numeroIngresado: "", claveIngresada: "" });
  const [montoSeleccionado, setMontoSeleccionado] = useState(0);
  const [montoPersonalizado, setMontoPersonalizado] = useState("");
  const [resultadoTransaccion, setResultadoTransaccion] = useState(null);
  const [errores, setErrores] = useState([]);
  const [cantidadRetiros, setCantidadRetiros] = useState(0);
  const [claveNequi, setClaveNequi] = useState("");

  const reiniciar = () => {
    setPantalla("menu");
    setTipoRetiro("");
    setDatos({ numeroIngresado: "", claveIngresada: "" });
    setMontoSeleccionado(0);
    setMontoPersonalizado("");
    setResultadoTransaccion(null);
    setErrores([]);
    setClaveNequi("");
  };

  const procesarRetiro = () => {
    const erroresValidacion = [];
    let numeroMostrar = datos.numeroIngresado;

    if (tipoRetiro === "nequi") {
      if (datos.claveIngresada !== claveNequi) {
        erroresValidacion.push("La clave Nequi no coincide");
      }
      numeroMostrar = "0" + datos.numeroIngresado;
    }

    if (!montoSeleccionado && !montoPersonalizado) {
      erroresValidacion.push("Debe seleccionar un monto válido");
    }

    const monto = montoSeleccionado || parseInt(montoPersonalizado);
    const billetes = calcularBilletes(monto);
    if (!billetes) {
      erroresValidacion.push(
        "No se puede dispensar esta cantidad. Solo se permiten múltiplos de $10.000"
      );
    }

    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setResultadoTransaccion({
      numero: numeroMostrar,
      monto,
      billetes,
      tipo: tipoRetiro,
    });
    setCantidadRetiros((prev) => prev + 1);
    setPantalla("resultado");
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
      {/* Card general */}
      <div className="card shadow-lg rounded-4 p-4 w-100" style={{ maxWidth: "600px" }}>
        <div className="container">
          {/* Menú principal */}
          {pantalla === "menu" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="mb-3 fw-bold text-primary">💳 Cajero Automático</h1>
              <h5 className="mb-4 text-muted">Seleccione el tipo de retiro</h5>

              <div className="d-grid gap-3 col-12 col-md-8 mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn w-100 text-white fw-bold"
                  style={{
                    background: "linear-gradient(90deg, #007bff, #00aaff)",
                    borderRadius: "12px",
                  }}
                  onClick={() => navigate("/nequi")}
                >
                  <Smartphone size={20} className="me-2" /> Nequi
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn w-100 text-white fw-bold"
                  style={{
                    background: "linear-gradient(90deg, #28a745, #34d058)",
                    borderRadius: "12px",
                  }}
                  onClick={() => navigate("/ahorro-mano")}
                >
                  <PiggyBank size={20} className="me-2" /> Ahorro a la Mano
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn w-100 text-white fw-bold"
                  style={{
                    background: "linear-gradient(90deg, #17a2b8, #20c997)",
                    borderRadius: "12px",
                  }}
                  onClick={() => navigate("/cuenta-ahorros")}
                >
                  <CreditCard size={20} className="me-2" /> Cuenta de Ahorros
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Pantalla de selección de monto */}
          {pantalla === "monto" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h3 className="mb-3 fw-bold text-success">
                Seleccione el monto a retirar
              </h3>

              <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                {[50000, 100000, 200000, 300000, 500000, 1000000].map((monto) => (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    key={monto}
                    className={`btn ${
                      montoSeleccionado === monto
                        ? "btn-success"
                        : "btn-outline-primary"
                    } rounded-3 fw-bold`}
                    onClick={() => {
                      setMontoSeleccionado(monto);
                      setMontoPersonalizado("");
                    }}
                  >
                    ${monto.toLocaleString()}
                  </motion.button>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Otro monto:</label>
                <input
                  type="number"
                  className="form-control shadow-sm rounded-3"
                  value={montoPersonalizado}
                  onChange={(e) => {
                    setMontoPersonalizado(e.target.value);
                    setMontoSeleccionado(0);
                  }}
                  min="10000"
                  step="10000"
                  placeholder="Ingrese monto (múltiplo de $10.000)"
                />
              </div>

              {errores.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="alert alert-danger rounded-3"
                >
                  {errores.map((error, idx) => (
                    <p key={idx} className="mb-0">
                      {error}
                    </p>
                  ))}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn w-100 fw-bold rounded-3 text-white"
                style={{
                  background: "linear-gradient(90deg, #28a745, #34d058)",
                  border: "none",
                }}
                onClick={procesarRetiro}
                disabled={!montoSeleccionado && !montoPersonalizado}
              >
                Confirmar Retiro
              </motion.button>
            </motion.div>
          )}

          {/* Pantalla de resultado */}
          {pantalla === "resultado" && resultadoTransaccion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-success mb-3 fw-bold">
                ¡Transacción Exitosa!
              </h2>
              <div className="mb-3">
                <p>
                  <strong>Cuenta/Número:</strong> {resultadoTransaccion.numero}
                </p>
                <p>
                  <strong>Monto retirado:</strong> $
                  {resultadoTransaccion.monto.toLocaleString()}
                </p>
              </div>
              <div className="mb-3">
                <h5 className="fw-bold">Billetes dispensados:</h5>
                {Object.entries(resultadoTransaccion.billetes).map(
                  ([denominacion, cantidad]) =>
                    cantidad > 0 && (
                      <p key={denominacion}>
                        ${parseInt(denominacion).toLocaleString()} →{" "}
                        <strong>{cantidad}</strong>
                      </p>
                    )
                )}
              </div>
              <div className="alert alert-info rounded-3">
                <h6 className="fw-bold">Predicción del sistema:</h6>
                <p>
                  Retiros restantes estimados en el cajero:{" "}
                  {calcularRetirosRestantes()}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn w-100 fw-bold rounded-3 text-white"
                style={{
                  background: "linear-gradient(90deg, #007bff, #00aaff)",
                  border: "none",
                }}
                onClick={reiniciar}
              >
                Realizar Nuevo Retiro
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PantallaPrincipal;



