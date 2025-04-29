import { FaPen } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line no-unused-vars
const EditarBtn = ({ onClick, isEditing }) => {
  const [isPenHovered, setPenIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setPenIsHovered(true)}
      onMouseLeave={() => setPenIsHovered(false)}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center p-1 bg-fonte-escura rounded-full text-branco cursor-pointer hover:bg-azul-escuro hover:scale-110 transition-transform duration-300"
    >
      <FaPen
        className="w-4 h-4"
        style={{
          animation: isPenHovered ? "shake 0.7s ease-in-out" : "none",
        }}
      />
    </button>
  );
};
EditarBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};
export default EditarBtn;
