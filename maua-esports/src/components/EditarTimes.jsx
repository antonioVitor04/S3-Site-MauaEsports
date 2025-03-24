import { useState } from "react";
import PropTypes from "prop-types";
import { RiImageEditFill } from "react-icons/ri";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";

const EditarTimes = ({
  timeId,
  nomeTimeInicial,
  fotoTimeInicial,
  jogoInicial,
  onSave,
  onClose,
}) => {
  const [nomeTime, setNomeTime] = useState(nomeTimeInicial);
  const [fotoTime, setFotoTime] = useState(fotoTimeInicial);
  const [jogo, setJogo] = useState(jogoInicial);

  // Função para validar o tipo de imagem
  const validarImagem = (arquivo) => {
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    return tiposPermitidos.includes(arquivo.type);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!validarImagem(file)) {
        alert("Formato de imagem inválido. Use apenas JPG, JPEG ou PNG.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoTime(reader.result); // Salva a imagem para envio
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      nomeTime,
      fotoTime,
      jogo,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/50"
      style={{ animation: "fadeInUp 0.5s ease-out" }}
    >
      <div className="bg-fundo border-2 border-borda p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl text-branco font-bold mb-4">Editar Time</h2>

        <label className="block text-sm text-fonte-escura font-semibold">
          Foto:
        </label>
        <div className="relative w-24 h-24 mb-3">
          <img
            src={fotoTime}
            alt="Foto do time"
            className="w-full h-full rounded-full object-cover"
          />
          <label
            htmlFor={`file-input-${timeId}`}
            className="absolute inset-0 flex items-center justify-center bg-azul-claro bg-opacity-50 rounded-full cursor-pointer"
          >
            <RiImageEditFill className="text-white text-xl" />
          </label>
          <input
            id={`file-input-${timeId}`}
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <label className="block text-sm text-fonte-escura font-semibold">
          Nome:
        </label>
        <input
          type="text"
          value={nomeTime}
          onChange={(e) => setNomeTime(e.target.value)}
          className="w-full border border-borda text-fonte-escura p-2 rounded mb-2"
        />

        <div className="flex justify-end space-x-2">
          <SalvarBtn onClick={handleSave} />
          <CancelarBtn onClick={onClose} />
        </div>
        {/*adicionar depois a logica de selecionar o jogo, se o jogo selecionado for valorant, logo = valorant */}
      </div>
    </div>
  );
};

EditarTimes.propTypes = {
  timeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nomeTimeInicial: PropTypes.string.isRequired,
  fotoTimeInicial: PropTypes.string,
  jogoInicial: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditarTimes;
