import React, { useState } from "react";
import PropTypes from "prop-types";
import { RiImageEditFill } from "react-icons/ri";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";

const EditarTime = ({ time, onSave, onClose }) => {
  const [nome, setNome] = useState(time.nome);
  const [rota, setRota] = useState(time.rota);
  const [foto, setFoto] = useState(`/times/${time.id}/imagem/foto?${Date.now()}`);
  const [jogo, setJogo] = useState(`/times/${time.id}/imagem/jogo?${Date.now()}`);
  const [erro, setErro] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [jogoFile, setJogoFile] = useState(null);

  const validarImagem = (file) => {
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
    const tamanhoMaximoMB = 5;
    
    if (!file) return false;
    if (!tiposPermitidos.includes(file.type)) {
      setErro("Formato de imagem inválido. Use JPG, PNG ou SVG.");
      return false;
    }
    if (file.size > tamanhoMaximoMB * 1024 * 1024) {
      setErro(`A imagem deve ter no máximo ${tamanhoMaximoMB}MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (tipo, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validarImagem(file)) return;

    setErro("");
    const reader = new FileReader();
    reader.onloadend = () => {
      if (tipo === 'foto') {
        setFoto(reader.result);
        setFotoFile(file);
      } else {
        setJogo(reader.result);
        setJogoFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      id: time.id, // Mantém o ID original
      nome,
      rota,
      foto: foto.startsWith('blob:') ? foto : null,
      jogo: jogo.startsWith('blob:') ? jogo : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-fundo border-2 border-borda p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl text-branco font-bold mb-4">Editar Time</h2>
        
        {erro && <div className="text-vermelho-claro mb-4">{erro}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-fonte-escura font-semibold mb-1">
              Nome <span className="text-vermelho-claro">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-borda p-2 rounded bg-fundo text-branco"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-fonte-escura font-semibold mb-1">
              Rota <span className="text-vermelho-claro">*</span>
            </label>
            <input
              type="text"
              value={rota}
              onChange={(e) => setRota(e.target.value)}
              className="w-full border border-borda p-2 rounded bg-fundo text-branco"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-fonte-escura font-semibold mb-2">
                Foto do Time
              </label>
              <div className="relative w-full aspect-square">
                <img
                  src={foto}
                  alt="Foto do time"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-team.png';
                  }}
                />
                <label className="absolute inset-0 flex items-center justify-center bg-azul-claro bg-opacity-50 rounded cursor-pointer hover:bg-opacity-70 transition">
                  <RiImageEditFill className="text-white text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('foto', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm text-fonte-escura font-semibold mb-2">
                Logo do Jogo
              </label>
              <div className="relative w-full aspect-square">
                <img
                  src={jogo}
                  alt="Logo do jogo"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-game.png';
                  }}
                />
                <label className="absolute inset-0 flex items-center justify-center bg-azul-claro bg-opacity-50 rounded cursor-pointer hover:bg-opacity-70 transition">
                  <RiImageEditFill className="text-white text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('jogo', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <CancelarBtn onClick={onClose} />
          <SalvarBtn onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

EditarTime.propTypes = {
  time: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nome: PropTypes.string.isRequired,
    rota: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditarTime;