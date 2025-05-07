import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const InfoModal = ({ isOpen, onClose, textoAtual, iconAtual, onSave }) => {
    const [texto, setTexto] = useState('');
    const [iconPreview, setIconPreview] = useState('');
    const [iconFile, setIconFile] = useState(null);

    // Inicializa valores quando o modal é aberto
    useEffect(() => {
        if (isOpen) {
            setTexto(textoAtual);
            setIconPreview(iconAtual);
        }
    }, [isOpen, textoAtual, iconAtual]);

    // Função para lidar com o upload de ícone
    const handleIconChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            setIconFile(file);
            
            // Cria uma URL temporária para visualização
            const previewURL = URL.createObjectURL(file);
            setIconPreview(previewURL);
        }
    };

    // Função para salvar alterações
    const handleSave = () => {
        if (iconFile) {
            // Converter imagem para base64 para salvar no localStorage
            const reader = new FileReader();
            reader.readAsDataURL(iconFile);
            reader.onloadend = () => {
                const base64Icon = reader.result;
                onSave({
                    texto,
                    icon: base64Icon
                });
            };
        } else {
            onSave({
                texto,
                icon: iconAtual
            });
        }
        onClose();
    };

    // Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                <h2 className="text-xl font-bold mb-4 text-fonte-escura">Editar Informações</h2>
                
                {/* Seção de upload de ícone */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-fonte-escura mb-2">
                        Ícone
                    </label>
                    
                    {/* Visualização do ícone */}
                    {iconPreview && (
                        <div className="mb-2 flex justify-center">
                            <img 
                                src={iconPreview} 
                                alt="Pré-visualização do ícone" 
                                className="h-16 w-16 object-contain"
                            />
                        </div>
                    )}
                    
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0 file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Recomendamos ícones de 128px por 128px para melhor visualização.
                    </p>
                </div>
                
                {/* Campo de texto */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-fonte-escura mb-2">
                        Texto
                    </label>
                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    />
                </div>
                
                {/* Botões de ação */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

InfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    textoAtual: PropTypes.string,
    iconAtual: PropTypes.string,
    onSave: PropTypes.func.isRequired
};

export default InfoModal;