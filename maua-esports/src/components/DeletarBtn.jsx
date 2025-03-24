import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import PropTypes from "prop-types";

const DeletarBtn = ({ tipo, onDelete, id }) => {
  const [isTrashHovered, setTrashIsHovered] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const mensagem =
      tipo === "time"
        ? "Tem certeza que deseja deletar este time?"
        : "Tem certeza que deseja deletar este jogador?";

    const confirmado = window.confirm(mensagem);
    if (confirmado) {
      onDelete(id); // Chama a função passada pelo componente pai
    }
  };

  return (
    <button
      onMouseEnter={() => setTrashIsHovered(true)}
      onMouseLeave={() => setTrashIsHovered(false)}
      onClick={handleClick}
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
  tipo: PropTypes.oneOf(["time", "jogador"]).isRequired,
  onDelete: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DeletarBtn;
