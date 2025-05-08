
import React from 'react';
import { Link } from 'react-router-dom';

const NaoAutorizado: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-fundo text-white">
      <h1 className="text-4xl font-bold mb-4">403 - Acesso Negado</h1>
      <p className="text-xl mb-8">Você não tem permissão para acessar esta página.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-azul-claro rounded-lg hover:bg-azul-escuro transition-colors"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NaoAutorizado;