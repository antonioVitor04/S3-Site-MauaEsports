import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const NovidadeModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    imagem: "",
    titulo: "",
    subtitulo: "",
    descricao: "",
    nomeBotao: "",
    urlBotao: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // Carregar dados do localStorage quando disponível
    if (isOpen) {
      const savedData = localStorage.getItem("novidadeData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setImagePreview(parsedData.imagem);
      } else if (initialData) {
        setFormData(initialData);
        setImagePreview(initialData.imagem);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para lidar com o upload de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setImageFile(file);
      
      // Cria uma URL temporária para visualização
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (imageFile) {
      // Converter imagem para base64 para salvar no localStorage
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = () => {
        const base64Image = reader.result;
        const updatedData = {
          ...formData,
          imagem: base64Image
        };
        
        // Salvar no localStorage
        localStorage.setItem("novidadeData", JSON.stringify(updatedData));
        
        // Callback para o componente pai
        if (onSave) {
          onSave(updatedData);
        }
        
        onClose();
      };
    } else {
      // Salvar no localStorage sem alterar a imagem
      localStorage.setItem("novidadeData", JSON.stringify(formData));
      
      // Callback para o componente pai
      if (onSave) {
        onSave(formData);
      }
      
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md p-5 text-fonte-escura max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-fonte-escura">Editar Novidade</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            {/* Seção de upload de imagem */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-fonte-escura mb-1">
                Imagem
              </label>
              
              {/* Visualização da imagem */}
              {imagePreview && (
                <div className="mb-2 flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Pré-visualização da imagem" 
                    className="h-20 object-contain"
                  />
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Selecione uma nova imagem do seu computador.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fonte-escura mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título da novidade"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fonte-escura mb-1">Subtítulo</label>
              <input
                type="text"
                name="subtitulo"
                value={formData.subtitulo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subtítulo da novidade"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fonte-escura mb-1">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição detalhada da novidade"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fonte-escura mb-1">Nome do Botão</label>
              <input
                type="text"
                name="nomeBotao"
                value={formData.nomeBotao}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: VER NOTÍCIA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fonte-escura mb-1">URL do Botão</label>
              <input
                type="text"
                name="urlBotao"
                value={formData.urlBotao}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://exemplo.com/pagina"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

NovidadeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default NovidadeModal;