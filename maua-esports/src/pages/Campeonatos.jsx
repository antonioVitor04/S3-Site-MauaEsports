import { useState, useEffect } from 'react';
import Board from '../components/campeonatos/Board';
import CardModal from '../components/campeonatos/CardModal';
import PageBanner from '../components/PageBanner';

const API_BASE_URL = "http://localhost:3000";

const Campeonatos = () => {
    const columns = ['campeonatos', 'inscricoes', 'passados'];
    const [currentColumn, setCurrentColumn] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [boardData, setBoardData] = useState({
        campeonatos: [],
        inscricoes: [],
        passados: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTournaments = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/campeonatos`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar campeonatos');
            }

            const data = await response.json();

            // Adiciona URLs completas para as imagens
            const processTournaments = (tournaments) => {
                return tournaments.map(t => ({
                    ...t,
                    imageUrl: `${API_BASE_URL}/campeonatos/${t._id}/image?${Date.now()}`,
                    gameIconUrl: `${API_BASE_URL}/campeonatos/${t._id}/gameIcon?${Date.now()}`,
                    organizerImageUrl: `${API_BASE_URL}/campeonatos/${t._id}/organizerImage?${Date.now()}`
                }));
            };

            setBoardData({
                campeonatos: processTournaments(data.campeonatos || []),
                inscricoes: processTournaments(data.inscricoes || []),
                passados: processTournaments(data.passados || [])
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    const openModal = (columnId, card = null) => {
        if (!isAdminMode) return;
        setCurrentColumn(columnId);
        setEditingCard(card);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCard(null);
    };

    const handleCardCreate = async (formData) => {
        try {
            let url = `${API_BASE_URL}/campeonatos`;
            let method = 'POST';
    
            if (editingCard && editingCard._id) {
                url = `${API_BASE_URL}/campeonatos/${editingCard._id}`;
                method = 'PUT';
            }
    
            const response = await fetch(url, {
                method: method,
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar campeonato');
            }
    
            fetchTournaments();
            closeModal();
        } catch (err) {
            console.error("Erro ao salvar campeonato:", err);
            alert(`Erro ao salvar campeonato: ${err.message}`);
        }
    };

    const handleCardDelete = async (columnId, cardIndex) => {
        if (!isAdminMode) return;
        
        const cardId = boardData[columnId][cardIndex]._id;
        if (!cardId) return;

        try {
            if (window.confirm('Tem certeza que deseja excluir este campeonato?')) {
                const response = await fetch(`${API_BASE_URL}/campeonatos/${cardId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`Erro ${response.status}`);
                }

                fetchTournaments();
            }
        } catch (err) {
            console.error("Erro ao excluir campeonato:", err);
            alert(`Erro ao excluir campeonato: ${err.message}`);
        }
    };

    const handleCardMove = async (cardData, sourceColumn, targetColumn) => {
        if (!isAdminMode) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/campeonatos/${cardData._id}/move`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: targetColumn
                })
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }

            fetchTournaments();
        } catch (err) {
            console.error("Erro ao mover campeonato:", err);
            alert(`Erro ao mover campeonato: ${err.message}`);
        }
    };

    const toggleAdminMode = () => {
        setIsAdminMode(!isAdminMode);
    };

    if (isLoading) {
        return (
            <div className="bg-[#0D1117] min-h-screen flex flex-col">
                <div className="bg-[#010409] h-[104px]"></div>
                <PageBanner pageName="Campeonatos" />
                <div className="p-5 flex justify-center items-center flex-grow">
                    <div className="text-white">Carregando campeonatos...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#0D1117] min-h-screen flex flex-col">
                <div className="bg-[#010409] h-[104px]"></div>
                <PageBanner pageName="Campeonatos" />
                <div className="p-5 flex flex-col items-center justify-center flex-grow">
                    <div className="text-red-500 mb-4">Erro ao carregar campeonatos: {error}</div>
                    <button
                        onClick={fetchTournaments}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <div className="bg-[#010409] h-[104px]"></div>
            
            <PageBanner pageName="Campeonatos" />

            <div className="p-5 flex flex-col items-center">
                {/* Botão de Admin */}
                <div className="w-full max-w-7xl mb-4 flex justify-end">
                    <button
                        onClick={toggleAdminMode}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            isAdminMode
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-azul-claro hover:bg-blue-700 text-white'
                        }`}
                    >
                        {isAdminMode ? 'Desativar Modo Admin' : 'Modo Admin'}
                    </button>
                </div>

                <Board
                    columns={columns}
                    boardData={boardData}
                    onOpenModal={openModal}
                    onCardDelete={handleCardDelete}
                    onCardMove={handleCardMove}
                    isAdminMode={isAdminMode}
                />

                {isModalOpen && (
                    <CardModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onSave={handleCardCreate}
                        editingCard={editingCard}
                    />
                )}
            </div>
        </div>
    );
};

export default Campeonatos;