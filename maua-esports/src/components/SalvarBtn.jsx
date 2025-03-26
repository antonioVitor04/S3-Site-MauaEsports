// SalvarBtn.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdDone } from "react-icons/md";

const SalvarBtn = ({ onClick = () => {}, type = "button" }) => {
  const [isSaveHovered, setIsSaveHovered] = useState(false);

  return (
    <button
      type={type}
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
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default SalvarBtn;
