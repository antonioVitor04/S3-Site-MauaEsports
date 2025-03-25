import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import PropTypes from "prop-types";

const DeletarBtn = ({ onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onDelete}
      className="w-8 h-8 flex items-center justify-center p-1 bg-fonte-escura rounded-full text-branco cursor-pointer hover:bg-vermelho-claro hover:scale-110 transition-transform duration-300"
    >
      <FaTrash
        className="w-4 h-4"
        style={{
          animation: isHovered ? "shake 0.7s ease-in-out" : "none",
        }}
      />
    </button>
  );
};

DeletarBtn.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default DeletarBtn;
