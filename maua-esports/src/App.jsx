import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar"; // Importando a NavBar
import Rodape from "./components/Rodape"; // Importando a Rodape
import Home from "./pages/Home"; // Página inicial
import Membros from "./pages/Membros"; // Página de Membros
import NotFound from "./pages/NotFound"; // Página de erro 404
import Times from "./pages/Times";
import Admins from "./pages/Admins";
import HorasPaePage from "./pages/HorasPae";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./authConfig";
import TreinosAdmin from "./pages/TreinosAdmin";
import Politicas from "./pages/Politicas";
import Campeonatos from "./pages/Campeonatos";

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/horas-pae" element={<HorasPaePage />} />
          <Route path="/treinos-admin" element={<TreinosAdmin />} />
          <Route path="/times" element={<Times />} />
          <Route path="/times/:timeId/membros" element={<Membros />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/politicas" element={<Politicas />} />
          <Route path="/campeonatos" element={<Campeonatos />} />
        </Routes>
        <Rodape />
      </Router>
    </MsalProvider>
  );
}

export default App;
