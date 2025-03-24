import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarBtn from "./EditarBtn";
import DeletarBtn from "./DeletarBtn";
import PropTypes from "prop-types";

const CardTime = ({ timeId, nome, foto, jogo, onDelete, onEditClick }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [jogoError, setJogoError] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(timeId); // Removida a confirmação daqui
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEditClick(timeId);
  };

  const handleCardClick = () => {
    navigate(`/times/${timeId}/membros`);
  };

  return (
    <div className="relative group">
      <div
        onClick={handleCardClick}
        className="block hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        <div
          className="border-2 border-borda relative w-[300px] h-[450px] bg-fundo shadow-lg flex flex-col items-center"
          style={{
            clipPath:
              "polygon(15% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%, 0% 10%)",
          }}
        >
          {/* Área da imagem */}
          <div
            className="w-full h-[70%] relative overflow-hidden"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%)",
            }}
          >
            {imgError ? (
              <div className="w-full h-full bg-cinza-escuro flex items-center justify-center">
                <span className="text-branco">Imagem não disponível</span>
              </div>
            ) : (
              <img
                src={foto}
                alt={`Imagem do time ${nome}`}
                className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-1100 ease-in-out hover:scale-125"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Área de informações */}
          <div className="w-full h-[30%] flex flex-col justify-between p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-lg text-branco font-semibold">{nome}</h1>
              {jogoError ? (
                <div className="w-6 h-6 bg-cinza-escuro"></div>
              ) : (
                <img 
                  src={jogo} 
                  alt="Logo do jogo" 
                  className="w-6 h-6"
                  onError={() => setJogoError(true)}
                />
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <EditarBtn onClick={handleEditClick} />
              <DeletarBtn onClick={handleDeleteClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CardTime.propTypes = {
  timeId: PropTypes.number.isRequired,
  nome: PropTypes.string.isRequired,
  foto: PropTypes.string.isRequired,
  jogo: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default CardTime;