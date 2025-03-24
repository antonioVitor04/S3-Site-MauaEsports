import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import PropTypes from "prop-types";

const DeletarBtn = ({ onDelete, jogadorId, timeId, onClick }) => {
  const [isTrashHovered, setTrashIsHovered] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(jogadorId); // Chama a função de deletar com o id do jogador
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja deletar este jogador?"
    );
    if (confirmar) {
      onDelete(jogadorId); // Chama a função de deletar apenas se o usuário confirmar
    }
  };

  return (
    <button
      onMouseEnter={() => setTrashIsHovered(true)}
      onMouseLeave={() => setTrashIsHovered(false)}
      onClick={handleDelete}
      className="w-8 h-8 flex items-center justify-center p-1 bg-fonte-escura rounded-full text-branco cursor-pointer hover:bg-vermelho-claro hover:scale-110 transition-transform duration-300"
    >
      <FaTrash
        className="w-5 h-5"
        style={{
          animation: isTrashHovered ? "shake 0.7s ease-in-out" : "none",
        }}
      />
    </button>
  );
};

DeletarBtn.propTypes = {
  onDelete: PropTypes.func.isRequired,
  jogadorId: PropTypes.string.isRequired,
};

export default DeletarBtn;
