import { useState, useRef, useEffect } from 'react';
import AddBtn from "./AddBtn";
import EditarBtn from "../EditarBtn";
import DeletarBtn from "../DeletarBtn";
import Margin from '../padrao/Margin';

const Parcerias = () => {
  // Estado para armazenar as parcerias
  const [partnerships, setPartnerships] = useState([]);

  // Carregar parcerias do localStorage ao iniciar
  useEffect(() => {
    const savedPartnerships = localStorage.getItem('partnerships');
    if (savedPartnerships) {
      setPartnerships(JSON.parse(savedPartnerships));
    } else {
      // Estado inicial se não houver dados no localStorage
      const initialPartnerships = [
        { id: 1, image: null },
        { id: 2, image: null },
        { id: 3, image: null },
      ];
      setPartnerships(initialPartnerships);
      localStorage.setItem('partnerships', JSON.stringify(initialPartnerships));
    }
  }, []);

  // Salvar parcerias no localStorage sempre que houver mudanças
  useEffect(() => {
    if (partnerships.length > 0) {
      localStorage.setItem('partnerships', JSON.stringify(partnerships));
    }
  }, [partnerships]);

  // Referência para o input de arquivo
  const fileInputRef = useRef(null);

  // Estado para controlar qual parceria está sendo editada
  const [editingId, setEditingId] = useState(null);

  // Função para redimensionar imagem
  const resizeImage = (base64Image, maxWidth = 400, maxHeight = 300) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Calcular novas dimensões mantendo proporção
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Criar canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Retornar como base64 com qualidade reduzida
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  // Função para lidar com o carregamento de imagem
  const handleImageUpload = async (event, id) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar tamanho do arquivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande. Por favor, use uma imagem de até 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Redimensionar imagem antes de salvar
          const resizedImage = await resizeImage(e.target.result);
          
          setPartnerships(partnerships.map(partner =>
            partner.id === id ? { ...partner, image: resizedImage } : partner
          ));
          setEditingId(null);
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          alert('Ocorreu um erro ao processar a imagem. Por favor, tente novamente.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para abrir o seletor de arquivos com confirmação
  const handleEditClick = (id) => {
    const partner = partnerships.find(p => p.id === id);

    if (partner.image) {
      const confirmEdit = window.confirm('Deseja substituir a imagem atual?');
      if (!confirmEdit) return;
    }

    setEditingId(id);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  // Função para excluir uma parceria com confirmação
  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta parceria?');
    if (confirmDelete) {
      // Encontrar o índice da parceria a ser excluída
      const indexToDelete = partnerships.findIndex(partner => partner.id === id);
      if (indexToDelete !== -1) {
        // Criar uma cópia do array para modificar
        const updatedPartnerships = [...partnerships];
        // Remover a parceria
        updatedPartnerships.splice(indexToDelete, 1);
        // Atualizar o estado com o novo array
        setPartnerships(updatedPartnerships);
      }
    }
  };

  // Função para adicionar uma nova parceria
  const handleAddPartnership = () => {
    const newId = partnerships.length > 0 ? Math.max(...partnerships.map(p => p.id)) + 1 : 1;
    setPartnerships([...partnerships, { id: newId, image: null }]);
  };

  return (
    <Margin horizontal="60px">
      <div className="bg-fundo min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerships.map((partner) => (
            <div key={partner.id} className="bg-fundo rounded-lg flex flex-col">
              <div className="flex-grow mb-4">
                <div className="h-40 bg-fundo rounded-md flex items-center justify-center overflow-hidden">
                  {partner.image ? (
                    <img
                      src={partner.image}
                      alt={`Parceria ${partner.id}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-2">
                      <p>Sem imagem</p>
                      <p className="text-xs mt-2">Tamanho recomendado: 400x300px</p>
                      <p className="text-xs mt-1">Máximo: 2MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-5 mt-2">
                <EditarBtn onClick={() => handleEditClick(partner.id)} />
                <DeletarBtn onClick={() => handleDeleteClick(partner.id)} />
              </div>
            </div>
          ))}

          {/* Botão para adicionar nova parceria */}
          <AddBtn onClick={handleAddPartnership} />
        </div>

        {/* Input de arquivo invisível */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleImageUpload(e, editingId)}
          accept="image/*"
          className="hidden"
        />
      </div>
    </Margin>
  );
};

export default Parcerias;