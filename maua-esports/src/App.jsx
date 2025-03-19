import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar"; // Importando a NavBar
import Home from "./pages/Home"; // Página inicial
import Membros from "./pages/Membros"; // Página de Membros
import NotFound from "./pages/NotFound"; // Página de erro 404
import { AuthProvider } from "./contexts/AuthContexts"; // Importando o AuthProvider

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Envolva a árvore de componentes com o AuthProvider */}
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/membros" element={<Membros />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
