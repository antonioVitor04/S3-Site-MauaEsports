import { useState, useEffect } from 'react';
import Board from '../components/campeonatos/Board';
import CardModal from '../components/campeonatos/CardModal';
import PageBanner from '../components/PageBanner';

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

    useEffect(() => {
        loadBoardFromLocalStorage();
    }, []);

    const loadBoardFromLocalStorage = () => {
        const savedBoard = localStorage.getItem('tournamentBoard');

        if (savedBoard) {
            const loadedData = JSON.parse(savedBoard);

            // If there's data in the 'andamento' column, move it to another column or handle as needed
            if (loadedData.andamento && loadedData.andamento.length > 0) {
                // You might want to move these items to 'passados' or another appropriate column
                loadedData.passados = [...loadedData.passados, ...loadedData.andamento];
            }

            // Create new board data with only the columns we want
            const newBoardData = {
                campeonatos: loadedData.campeonatos || [],
                inscricoes: loadedData.inscricoes || [],
                passados: loadedData.passados || []
            };

            setBoardData(newBoardData);
        }
    };

    const saveToLocalStorage = (data) => {
        localStorage.setItem('tournamentBoard', JSON.stringify(data));
    };

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

    const handleCardCreate = (cardData) => {
        const newBoardData = { ...boardData };

        if (editingCard) {
            // Update existing card
            const columnCards = newBoardData[currentColumn];
            const cardIndex = columnCards.findIndex(
                card => card.name === editingCard.name &&
                    card.description === editingCard.description &&
                    card.price === editingCard.price &&
                    card.trophies === editingCard.trophies
            );

            if (cardIndex !== -1) {
                columnCards[cardIndex] = cardData;
            }
        } else {
            // Create new card
            newBoardData[currentColumn] = [...newBoardData[currentColumn], cardData];
        }

        setBoardData(newBoardData);
        saveToLocalStorage(newBoardData);
        closeModal();
    };

    const handleCardDelete = (columnId, cardIndex) => {
        if (!isAdminMode) return;
        const newBoardData = { ...boardData };
        newBoardData[columnId] = newBoardData[columnId].filter((_, index) => index !== cardIndex);

        setBoardData(newBoardData);
        saveToLocalStorage(newBoardData);
    };

    const handleCardMove = (cardData, sourceColumn, targetColumn) => {
        if (!isAdminMode) return;
        const newBoardData = { ...boardData };

        // Remove from source column
        newBoardData[sourceColumn] = newBoardData[sourceColumn].filter(
            card => !(card.name === cardData.name &&
                card.description === cardData.description &&
                card.price === cardData.price &&
                card.trophies === cardData.trophies)
        );

        // Add to target column
        newBoardData[targetColumn] = [...newBoardData[targetColumn], cardData];

        setBoardData(newBoardData);
        saveToLocalStorage(newBoardData);
    };

    const toggleAdminMode = () => {
        setIsAdminMode(!isAdminMode);
    };

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">

            <div className="bg-[#010409] h-[104px]">.</div>
            
            <PageBanner pageName="Campeonatos" />

            <div className="p-5 flex flex-col items-center">
                {/* Botão de Admin */}
                <div className="w-full max-w-7xl mb-4 flex justify-end">
                    <button
                        onClick={toggleAdminMode}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${isAdminMode
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
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