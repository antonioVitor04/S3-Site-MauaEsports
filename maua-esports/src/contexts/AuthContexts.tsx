import React, { createContext, useState, useContext } from "react";

// Criando o contexto
const AuthContext = createContext({
  isLoggedIn: false,
  fazerLogin: () => {},
  fazerLogout: () => {},
});

// Componente Provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fazerLogin = () => setIsLoggedIn(true);
  const fazerLogout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, fazerLogin, fazerLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
