// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import ReactDOM from "react-dom"; // Import necessário para o Portal
import { FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { IoLogoTwitch } from "react-icons/io";
import Foto from "../assets/images/Foto.svg";
import Jogo from "../assets/images/logovalorant.svg";
import DeletarBtn from "./DeletarBtn";
import EditarBtn from "./EditarBtn";
import EditarJogador from "./EditarJogador";
import PropTypes from "prop-types";

const CardJogador = ({
  jogadorId,
  onDelete,
  onEdit,
  nomeInicial,
  tituloInicial,
  descricaoInicial,
  fotoInicial,
  instagramInicial,
  twitterInicial,
  twitchInicial,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (novosDados) => {
    onEdit(jogadorId, novosDados);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="border-2 border-borda relative w-[300px] h-[450px] bg-fundo shadow-lg flex flex-col items-center 
             hover:scale-110 transition-transform duration-300 cursor-pointer animate-fadeInUp"
        style={{
          clipPath:
            "polygon(15% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%, 0% 10%)",
          animation: "fadeInUp 0.5s ease-out",
        }}
      >
        <h1 className="text-xl font-bold font-blinker bg-azul-claro rounded-bl-2xl px-2 py-1 inline-block absolute top-0 right-0 z-10 opacity-70">
          {tituloInicial}
        </h1>

        <div className="w-full h-full relative">
          <img
            src={fotoInicial || Foto}
            alt="Icone do time"
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%)",
            }}
          />
        </div>

        <div className="justify-center items-center">
          <div className="flex mt-3 space-x-2 font-blinker justify-between w-full">
            <h1 className="text-lg font-semibold ml-5 text-fonte-clara">
              {nomeInicial}
            </h1>
            <img
              src={Jogo}
              alt="Jogo"
              className="w-6 h-6 mr-5 text-azul-claro"
            />
          </div>

          <div className="w-full border-b-2 py-2 border-borda">
            <p className="text-sm text-left mt-2 px-5 font-blinker w-full text-fonte-escura">
              {descricaoInicial}
            </p>
          </div>

          <div className="flex items-center space-x-4 my-4 px-5 text-xl w-full text-fonte-escura">
            {instagramInicial && (
              <a
                href={instagramInicial}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="cursor-pointer hover:scale-110 transition-transform duration-300" />
              </a>
            )}
            {twitterInicial && (
              <a
                href={twitterInicial}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXFill className="cursor-pointer hover:scale-110 transition-transform duration-300" />
              </a>
            )}
            {twitchInicial && (
              <a href={twitchInicial} target="_blank" rel="noopener noreferrer">
                <IoLogoTwitch className="cursor-pointer hover:scale-110 transition-transform duration-300" />
              </a>
            )}

            <div className="flex space-x-2 ml-auto mr-3 gap-2">
              <EditarBtn onClick={() => setIsModalOpen(true)} />
              <DeletarBtn jogadorId={jogadorId} onDelete={onDelete} />
            </div>
          </div>
        </div>
      </div>

      {/* Renderiza o modal como um portal */}
      {isModalOpen &&
        ReactDOM.createPortal(
          <EditarJogador
            jogadorId={jogadorId}
            nomeInicial={nomeInicial}
            tituloInicial={tituloInicial}
            descricaoInicial={descricaoInicial}
            fotoInicial={fotoInicial}
            instagramInicial={instagramInicial}
            twitterInicial={twitterInicial}
            twitchInicial={twitchInicial}
            onSave={handleEdit}
            onClose={() => setIsModalOpen(false)}
          />,
          document.body
        )}
    </>
  );
};

CardJogador.propTypes = {
  jogadorId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  nomeInicial: PropTypes.string.isRequired,
  tituloInicial: PropTypes.string.isRequired,
  descricaoInicial: PropTypes.string.isRequired,
  fotoInicial: PropTypes.string,
  instagramInicial: PropTypes.string,
  twitterInicial: PropTypes.string,
  twitchInicial: PropTypes.string,
};

export default CardJogador;
