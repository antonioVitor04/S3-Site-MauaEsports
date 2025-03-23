// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { RiImageEditFill } from "react-icons/ri"; // Ícone de edição de imagem
import Foto from "../assets/images/valorant.jpg"; // Imagem padrão
import Jogo from "../assets/images/Jogo.svg"; // Ícone do jogo
import EditarBtn from "./EditarBtn"; // Componente de botão de edição
import SalvarBtn from "./SalvarBtn"; // Componente de botão de salvar
import CancelarBtn from "./CancelarBtn"; // Componente de botão de cancelar
import DeletarBtn from "./DeletarBtn"; // Componente de botão de deletar
import PropTypes from "prop-types";

const CardTime = ({ onDelete }) => {
  // Estados para controlar o modo de edição, título e imagem
  const [isEditing, setIsEditing] = useState(false);
  const [titulo, setTitulo] = useState("VALORANT Inclusivo"); // Título inicial
  const [foto, setFoto] = useState(Foto); // Imagem inicial

  // Função para lidar com a alteração da imagem
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verifica se o arquivo é uma imagem válida (JPG, PNG ou JPEG)
      const tiposValidos = ["image/jpeg", "image/png", "image/jpg"];
      if (!tiposValidos.includes(file.type)) {
        alert(
          "Tipo de arquivo inválido. Por favor, selecione uma imagem no formato JPG, PNG ou JPEG."
        );
        return; // Interrompe a execução se o tipo for inválido
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // Atualiza a imagem do card
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para alternar o modo de edição
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Função para salvar as alterações
  const handleSalvar = () => {
    setIsEditing(false);
    // Aqui você pode adicionar a lógica para salvar as alterações no backend, se necessário
  };

  // Função para cancelar a edição
  const handleCancelar = () => {
    setIsEditing(false);
    setTitulo("VALORANT Inclusivo"); // Reverte para o título inicial
    setFoto(Foto); // Reverte para a imagem inicial
  };

  return (
    <div
      className="group relative w-[300px] h-[450px] bg-slate-300 shadow-lg flex flex-col items-center 
            hover:scale-110 transition-transform duration-300 cursor-pointer"
      style={{
        clipPath:
          "polygon(15% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%, 0% 10%)", // Cortando as bordas do card
      }}
    >
      {/* Imagem do jogo */}
      <div className="w-full h-[80%] relative overflow-hidden">
        <img
          src={foto}
          alt="Imagem Jogo"
          className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-1100 ease-in-out group-hover:scale-125"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%)", // corta o canto inferior direito da imagem
          }}
        />

        {/* Exibe o ícone de edição somente no modo de edição */}
        {isEditing && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-azul-claro bg-opacity-50 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300">
            <label
              htmlFor="file-input-card-time" // ID único para o input de arquivo
              className="cursor-pointer"
            >
              <RiImageEditFill className="text-hover text-2xl" />{" "}
              {/* Ícone de edição */}
            </label>
            <input
              id="file-input-card-time" // ID único para o input de arquivo
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
              className="hidden" // Esconde o input de arquivo
            />
          </div>
        )}
      </div>

      {/* Container de baixo */}
      <div className="justify-center items-center">
        {/* Nome e ícone do jogo */}
        <div className="flex mt-3 space-x-2 font-blinker justify-between w-full gap-10">
          {isEditing ? (
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="text-lg font-semibold ml-4 bg-transparent border-b-2 border-borda focus:outline-none"
            />
          ) : (
            <h1 className="text-lg font-semibold ml-4">{titulo}</h1>
          )}
          <img src={Jogo} alt="Jogo" className="w-6 h-6 mr-4" />
        </div>

        {/* Botões de edição, salvar, cancelar e deletar */}
        <div className="flex justify-center mt-4 space-x-4">
          {isEditing ? (
            <>
              <SalvarBtn onClick={handleSalvar} /> {/* Botão de salvar */}
              <CancelarBtn onClick={handleCancelar} /> {/* Botão de cancelar */}
            </>
          ) : (
            <>
              <EditarBtn onClick={handleEditToggle} isEditing={isEditing} />{" "}
              {/* Botão de editar */}
              <DeletarBtn onDelete={onDelete} /> {/* Botão de deletar */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
CardTime.propTypes = {
  onDelete: PropTypes.func.isRequired,
};
export default CardTime;
