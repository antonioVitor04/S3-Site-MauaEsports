import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CardModal = ({ isOpen, onClose, onSave, editingCard }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [gameIconFile, setGameIconFile] = useState(null);
  const [gameIconUrl, setGameIconUrl] = useState('');
  const [gameName, setGameName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [firstPrize, setFirstPrize] = useState('');
  const [secondPrize, setSecondPrize] = useState('');
  const [thirdPrize, setThirdPrize] = useState('');
  const [organizerImageFile, setOrganizerImageFile] = useState(null);
  const [organizerImageUrl, setOrganizerImageUrl] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [teamPosition, setTeamPosition] = useState('');
  const [performanceDescription, setPerformanceDescription] = useState('');

  useEffect(() => {
    if (editingCard) {
      setName(editingCard.name || '');
      setDescription(editingCard.description || '');
      setPrice(editingCard.price || '');
      setGameIconUrl(editingCard.gameIconUrl || '');
      setGameName(editingCard.gameName || '');
      setImageUrl(editingCard.imageUrl || '');
      setStartDate(editingCard.startDate || '');
      setFirstPrize(editingCard.firstPrize || '');
      setSecondPrize(editingCard.secondPrize || '');
      setThirdPrize(editingCard.thirdPrize || '');
      setOrganizerImageUrl(editingCard.organizerImageUrl || '');
      setRegistrationLink(editingCard.registrationLink || '');
      setTeamPosition(editingCard.teamPosition || '');
      setPerformanceDescription(editingCard.performanceDescription || '');
    } else {
      resetForm();
    }
  }, [editingCard]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setGameIconFile(null);
    setGameIconUrl('');
    setGameName('');
    setImageFile(null);
    setImageUrl('');
    setStartDate('');
    setFirstPrize('');
    setSecondPrize('');
    setThirdPrize('');
    setOrganizerImageFile(null);
    setOrganizerImageUrl('');
    setRegistrationLink('');
    setTeamPosition('');
    setPerformanceDescription('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleGameIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGameIconFile(file);
      setGameIconUrl(URL.createObjectURL(file));
    }
  };

  const handleOrganizerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOrganizerImageFile(file);
      setOrganizerImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      alert('Por favor, insira um nome para o campeonato');
      return;
    }

    // Aqui você implementaria o upload das imagens para seu servidor
    // e obteria as URLs permanentes antes de salvar o card

    onSave({
      name,
      description,
      price,
      gameIconUrl,
      gameName,
      imageUrl,
      startDate,
      firstPrize,
      secondPrize,
      thirdPrize,
      organizerImageUrl,
      registrationLink,
      teamPosition,
      performanceDescription
    });

    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{editingCard ? 'Editar Campeonato' : 'Criar Campeonato'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagem do campeonato */}
          <div>
            <label className="block text-sm font-medium mb-1">Imagem do campeonato (Recomendado: 800x300px)</label>
            <div className="flex flex-col gap-2">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm border border-gray-600 bg-gray-700 rounded p-2"
              />
            </div>
          </div>

          {/* Informações do jogo - Reordenado conforme solicitado */}
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Ícone do jogo (Recomendado: 64x64px)</label>
              <div className="flex flex-col gap-2">
                {gameIconUrl && (
                  <img
                    src={gameIconUrl}
                    alt="Game Icon Preview"
                    className="w-16 h-16 object-contain rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGameIconChange}
                  className="w-full text-sm border border-gray-600 bg-gray-700 rounded p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nome do jogo</label>
              <input
                type="text"
                placeholder="Ex: CS:GO"
                className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </div>
          </div>

          {/* Informações básicas */}
          <div>
            <label className="block text-sm font-medium mb-1">Nome do campeonato*</label>
            <input
              type="text"
              placeholder="Nome do Campeonato"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de início</label>
            <input
              type="date"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preço de inscrição</label>
            <input
              type="text"
              placeholder="Ex: R$ 10,00"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              placeholder="Descrição do campeonato"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Premiações */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">1º Lugar</label>
              <input
                type="text"
                placeholder="Ex: R$ 500"
                className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
                value={firstPrize}
                onChange={(e) => setFirstPrize(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">2º Lugar</label>
              <input
                type="text"
                placeholder="Ex: R$ 300"
                className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
                value={secondPrize}
                onChange={(e) => setSecondPrize(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">3º Lugar</label>
              <input
                type="text"
                placeholder="Ex: R$ 200"
                className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
                value={thirdPrize}
                onChange={(e) => setThirdPrize(e.target.value)}
              />
            </div>
          </div>

          {/* Desempenho do time - NOVO */}
          <div>
            <label className="block text-sm font-medium mb-1">Posição do time</label>
            <input
              type="text"
              placeholder="Ex: 4º Lugar"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
              value={teamPosition}
              onChange={(e) => setTeamPosition(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Descrição do desempenho</label>
            <textarea
              placeholder="Descreva como foi a participação do time no campeonato"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded h-24"
              value={performanceDescription}
              onChange={(e) => setPerformanceDescription(e.target.value)}
            />
          </div>

          {/* Imagem do organizador */}
          <div>
            <label className="block text-sm font-medium mb-1">Logo do organizador (Recomendado: 100x100px)</label>
            <div className="flex flex-col gap-2">
              {organizerImageUrl && (
                <img
                  src={organizerImageUrl}
                  alt="Organizer Logo Preview"
                  className="max-w-[100px] max-h-[100px] object-contain rounded mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleOrganizerImageChange}
                className="w-full text-sm border border-gray-600 bg-gray-700 rounded p-2"
              />
            </div>
          </div>

          {/* Link de inscrição */}
          <div>
            <label className="block text-sm font-medium mb-1">Link de inscrição</label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-between pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingCard ? 'Atualizar Campeonato' : 'Criar Campeonato'}
            </button>

            <button
              type="button"
              className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-700"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editingCard: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    gameIconUrl: PropTypes.string,
    gameName: PropTypes.string,
    imageUrl: PropTypes.string,
    startDate: PropTypes.string,
    firstPrize: PropTypes.string,
    secondPrize: PropTypes.string,
    thirdPrize: PropTypes.string,
    organizerImageUrl: PropTypes.string,
    registrationLink: PropTypes.string,
    teamPosition: PropTypes.string,
    performanceDescription: PropTypes.string
  })
};

export default CardModal;