// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { MdDone } from "react-icons/md";
import { useState } from "react";
const SalvarBtn = ({ onClick }) => {
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setIsSaveHovered(true)}
      onMouseLeave={() => setIsSaveHovered(false)}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center p-1 bg-emerald-300 rounded-full text-branco cursor-pointer hover:bg-green-600 hover:scale-110 transition-transform duration-300"
    >
      <MdDone
        className="w-4 h-4"
        style={{
          animation: isSaveHovered ? "shake 0.7s ease-in-out" : "none",
        }}
      />
    </button>
  );
};

SalvarBtn.propTypes = {
  onClick: PropTypes.func.isRequired, // Função chamada ao clicar no botão
};

export default SalvarBtn;
