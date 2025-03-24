import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarBtn from "./EditarBtn";
import DeletarBtn from "./DeletarBtn";
import PropTypes from "prop-types";
import EditarTimes from "./EditarTimes";

const CardTime = ({ timeId, nome, foto, jogo, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleSave = (updatedTime) => {
    // Lógica atual enquanto não tem backend
    setTimes(
      times.map((time) => (time.id === updatedTime.id ? updatedTime : time))
    );

    // Quando tiver backend, substitua por:
    // try {
    //   const response = await api.put(`/times/${updatedTime.id}`, updatedTime);
    //   setTimes(times.map(time =>
    //     time.id === updatedTime.id ? response.data : time
    //   ));
    // } catch (error) {
    //   console.error("Erro ao atualizar time:", error);
    // }
  };

  const handleDelete = (timeId) => {
    // Lógica atual
    setTimes(times.filter((time) => time.id !== timeId));

    // Quando tiver backend:
    // try {
    //   await api.delete(`/times/${timeId}`);
    //   setTimes(times.filter(time => time.id !== timeId));
    // } catch (error) {
    //   console.error("Erro ao deletar time:", error);
    // }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      navigate(`/times/${timeId}/membros`);
    }
  };

  return (
    <>
      {isEditing && (
        <EditarTimes
          timeId={timeId.toString()}
          nomeTimeInicial={nome}
          fotoTimeInicial={foto}
          jogoInicial={jogo}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      <div
        className="border-2 border-borda relative w-[300px] h-[450px] bg-fundo shadow-lg flex flex-col items-center "
        style={{
          clipPath:
            "polygon(15% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%, 0% 10%)",
        }}
      >
        {/* Área da imagem (clicável) */}
        <div
          onClick={handleCardClick}
          className="w-full h-[70%] relative overflow-hidden cursor-pointer"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%)",
          }}
        >
          <img
            src={foto}
            alt={`Imagem do time ${nome}`}
            className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-1100 ease-in-out hover:scale-125"
          />
        </div>

        {/* Área de informações (não clicável) */}
        <div className="w-full h-[30%] flex flex-col justify-between p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg text-branco font-semibold">{nome}</h1>
            <img
              src={jogo}
              alt="Logo do jogo"
              className="w-6 h-6 text-azul-claro"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <EditarBtn onClick={handleEditClick} />
            <DeletarBtn tipo="time" onDelete={handleDelete} id={timeId} />
          </div>
        </div>
      </div>
    </>
  );
};

CardTime.propTypes = {
  timeId: PropTypes.number.isRequired,
  nome: PropTypes.string.isRequired,
  foto: PropTypes.string.isRequired,
  jogo: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CardTime;
