// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
const CancelarBtn = ({ onClick }) => {
  const [isCancelHovered, setCancelIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setCancelIsHovered(true)}
      onMouseLeave={() => setCancelIsHovered(false)}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center p-1 bg-vermelho-claro rounded-full text-branco cursor-pointer hover:bg-red-500 hover:scale-110 transition-transform duration-300"
    >
      <MdCancel
        className="w-4 h-4"
        style={{
          animation: isCancelHovered ? "shake 0.7s ease-in-out" : "none",
        }}
      />
    </button>
  );
};

CancelarBtn.propTypes = {
  onClick: PropTypes.func.isRequired, // Função chamada ao clicar no botão
};

export default CancelarBtn;
