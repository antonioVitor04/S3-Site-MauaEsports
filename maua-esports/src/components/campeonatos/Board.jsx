import PropTypes from 'prop-types';
import Column from './Column';

const Board = ({ columns, boardData, onOpenModal, onCardDelete, onCardMove, isAdminMode }) => {
    return (
        <div className="flex flex-col gap-5 w-full max-w-7xl">
            {columns.map((columnId) => (
                <Column
                    key={columnId}
                    id={columnId}
                    title={getColumnTitle(columnId)}
                    cards={boardData[columnId]}
                    onOpenModal={onOpenModal}
                    onCardDelete={onCardDelete}
                    onCardMove={onCardMove}
                    columns={columns}
                    isAdminMode={isAdminMode}
                />
            ))}
        </div>
    );
};

const getColumnTitle = (columnId) => {
    const titles = {
        campeonatos: 'Criar Campeonatos',
        inscricoes: 'Inscrições',
        passados: 'Passados'
    };
    return titles[columnId] || columnId;
};

Board.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    boardData: PropTypes.object.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    onCardDelete: PropTypes.func.isRequired,
    onCardMove: PropTypes.func.isRequired,
    isAdminMode: PropTypes.bool.isRequired
};

export default Board;