import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PantallaPrincipal from "./vistas/PantallaPrincipal";
import AhorroMano from "./vistas/AhorroMano";
import CuentaAhorros from "./vistas/CuentaAhorros";
import Nequi from "./vistas/Nequi";
import Retiro from "./vistas/Retiro";
import RetiroAhorro from "./vistas/RetiroAhorro";
import RetiroCuentaAhorro from "./vistas/RetiroCuentaAhorro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PantallaPrincipal />} />
        <Route path="/ahorro-mano" element={<AhorroMano />} />
        <Route path="/cuenta-ahorros" element={<CuentaAhorros />} />
        <Route path="/nequi" element={<Nequi />} />
        <Route path="/retiro" element={<Retiro />} />
        <Route path="/retiro-ahorro-mano" element={<RetiroAhorro />} />
        <Route path="/retiro-cuenta-ahorro" element={<RetiroCuentaAhorro />} />
      </Routes>
    </Router>
  );
}

export default App;
