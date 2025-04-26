import PropTypes from 'prop-types';
import Card from './Card';
import AddBtn from './AddBtn';

const Column = ({ id, title, cards, onOpenModal, onCardDelete, onCardMove, isAdminMode }) => {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();

        // Se não estiver no modo admin, não permite movimentação
        if (!isAdminMode) return;

        const cardData = JSON.parse(e.dataTransfer.getData('cardData'));
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn !== id) {
            onCardMove(cardData, sourceColumn, id);
        }
    };

    // Organizar os cards em grupos de 3 para exibição em grid
    const groupedCards = [];
    for (let i = 0; i < cards.length; i += 3) {
        groupedCards.push(cards.slice(i, i + 3));
    }

    // Só mostra a coluna de criação de campeonatos se estiver no modo admin
    if (id === 'campeonatos' && !isAdminMode) {
        return null;
    }

    return (
        <div
            className="bg-[#0D1117] rounded-lg p-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            id={id}
        >
            <div className="mb-4">
                <h2 className="mb-4 font-bold text-lg text-[#F0F6FC] text-center">{title}</h2>

                {/* Botão de adicionar somente visível no modo admin */}
                {id === 'campeonatos' && isAdminMode && (
                    <AddBtn onClick={() => onOpenModal(id)} />
                )}
            </div>

            <div className="space-y-4">
                {groupedCards.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {row.map((card, cardIndex) => (
                            <Card
                                key={`${id}-${rowIndex}-${cardIndex}`}
                                data={card}
                                columnId={id}
                                index={rowIndex * 3 + cardIndex}
                                onEdit={() => onOpenModal(id, card)}
                                onDelete={() => onCardDelete(id, rowIndex * 3 + cardIndex)}
                                isAdminMode={isAdminMode}
                                isDraggable={isAdminMode}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

Column.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    onCardDelete: PropTypes.func.isRequired,
    onCardMove: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    isAdminMode: PropTypes.bool.isRequired
};

export default Column;