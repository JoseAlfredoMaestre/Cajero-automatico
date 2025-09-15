import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { calcularBilletes, calcularRetirosRestantes } from "../logica/utilidades";
import { formatearCuentaCompleta } from "../logica/useCuentaAhorros";

const RetiroCuentaAhorro = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [montoSeleccionado, setMontoSeleccionado] = useState(0);
  const [montoPersonalizado, setMontoPersonalizado] = useState("");
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const datosGuardados = localStorage.getItem("datosCuentaAhorros");
    if (datosGuardados) {
      setDatos(JSON.parse(datosGuardados));
    } else {
      navigate("/cuenta-ahorros");
    }
  }, [navigate]);

  const procesarRetiro = () => {
    const monto = montoSeleccionado || parseInt(montoPersonalizado);
    if (!monto || monto <= 0 || monto % 10000 !== 0) {
      Swal.fire({
        icon: "error",
        title: "Monto inválido",
        text: "Debe ingresar un monto válido y múltiplo de $10.000",
        confirmButtonText: "Ir al inicio",
      }).then(() => {
        navigate("/");
      });
      return;
    }

    const billetes = calcularBilletes(monto);
    if (!billetes) {
      Swal.fire({
        icon: "error",
        title: "No se puede dispensar esta cantidad",
        text: "Solo se permiten múltiplos de $10.000 (10K, 20K, 50K, 100K).",
        confirmButtonText: "Ir al inicio",
      }).then(() => {
        navigate("/");
      });
      return;
    }

    setResultado({
      cuenta: formatearCuentaCompleta(datos.numeroIngresado),
      monto,
      billetes,
    });

    Swal.fire({
      icon: "success",
      title: "✅ Retiro exitoso",
      text: `Se retiró correctamente $${monto.toLocaleString()} de su cuenta de ahorros`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (!datos) return null;

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      {!resultado ? (
        <div className="card shadow-lg p-4 col-12 col-md-6 rounded-4">
          <h3 className="mb-4 text-center text-primary">
            Retiro - Cuenta de Ahorros
          </h3>

          <div className="mb-3">
            <h6 className="fw-bold">Montos Rápidos:</h6>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {[10000, 20000, 50000, 100000].map((monto) => (
                <button
                  key={monto}
                  className={`btn ${
                    montoSeleccionado === monto
                      ? "btn-success"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setMontoSeleccionado(monto);
                    setMontoPersonalizado("");
                  }}
                >
                  ${monto.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <h6 className="fw-bold">Otro Monto:</h6>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
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
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-danger flex-fill"
              onClick={() => navigate("/cuenta-ahorros")}
            >
              Volver
            </button>
            <button
              className="btn btn-success flex-fill"
              onClick={procesarRetiro}
              disabled={!montoSeleccionado && !montoPersonalizado}
            >
              Confirmar Retiro
            </button>
          </div>
        </div>
      ) : (
        <div className="card shadow-lg p-4 col-12 col-md-6 rounded-4 text-center">
          <h2 className="text-success mb-3">¡Transacción Exitosa!</h2>

          <div className="mb-3">
            <p>
              <strong>Cuenta:</strong> {resultado.cuenta}
            </p>
            <p>
              <strong>Monto retirado:</strong>{" "}
              ${resultado.monto.toLocaleString()}
            </p>
          </div>

          <div className="mb-3">
            <h5 className="fw-bold">Billetes entregados:</h5>
            <div className="row mt-2">
              {Object.entries(resultado.billetes).map(
                ([denominacion, cantidad]) =>
                  cantidad > 0 && (
                    <div key={denominacion} className="col-6 col-md-3 mb-2">
                      <div className="badge bg-primary p-2 w-100">
                        <div>{cantidad} x</div>
                        <div>${parseInt(denominacion).toLocaleString()}</div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>

          <div className="alert alert-info">
            <h6 className="fw-bold">Predicción del sistema:</h6>
            <p>Retiros restantes en el cajero: {calcularRetirosRestantes()}</p>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={() => navigate("/")}
          >
            Finalizar y Volver al Inicio
          </button>
        </div>
      )}
    </div>
  );
};

export default RetiroCuentaAhorro;

