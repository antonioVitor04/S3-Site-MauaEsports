import { IoMdAddCircleOutline } from "react-icons/io";
import { useState } from "react";
import ModalAdicionarMembro from "./ModalAdicionarMembro";
import PropTypes from "prop-types";

const AdicionarMembro = ({ onAdicionarMembro, timeId }) => {
  const [modalAberto, setModalAberto] = useState(false);

  const handleAdicionarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalAberto(true);
  };

  const handleSalvar = (novoMembro) => {
    onAdicionarMembro(novoMembro);
    setModalAberto(false);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  return (
    <>
      <div
        onClick={handleAdicionarClick}
        className="border-2 border-dotted rounded-tl-2xl rounded-br-2xl border-borda relative w-[300px] h-[450px] bg-fundo shadow-lg flex flex-col items-center 
          hover:scale-110 transition-transform duration-300 cursor-pointer animate-fadeInUp text-center justify-center"
      >
        <IoMdAddCircleOutline className="w-50 h-40 text-fonte-escura" />
        <h1 className="text-fonte-escura text-2xl">Adicionar Membro</h1>
      </div>

      {modalAberto && (
        <ModalAdicionarMembro
          onClose={handleFecharModal}
          onSave={handleSalvar}
          timeId={timeId}
        />
      )}
    </>
  );
};

AdicionarMembro.propTypes = {
  onAdicionarMembro: PropTypes.func.isRequired,
  timeId: PropTypes.string.isRequired,
};

export default AdicionarMembro;
