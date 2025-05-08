// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { instance } = useMsal();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkAuthAndRole = async () => {
      const account = instance.getActiveAccount();
      if (!account) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/usuarios/por-email?email=${encodeURIComponent(account.username)}`);
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.usuario?.tipoUsuario || null);
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRole();
  }, [instance]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-azul-claro"></div>
  </div>;
  }

  const account = instance.getActiveAccount();
  if (!account) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/nao-autorizado" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;