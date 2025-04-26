import PropTypes from 'prop-types';
import EditarBtn from '../EditarBtn';
import DeletarBtn from '../DeletarBtn';

const Card = ({ data, columnId, onEdit, onDelete, isAdminMode, isDraggable }) => {
    const {
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
    } = data;

    const handleDragStart = (e) => {
        if (!isDraggable) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('cardData', JSON.stringify(data));
        e.dataTransfer.setData('sourceColumn', columnId);
        e.target.classList.add('opacity-50');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-50');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Verificar se deve mostrar a seção de desempenho da equipe
    const shouldShowPerformance = columnId !== 'inscricoes' && (teamPosition || performanceDescription);

    // Verificar se deve mostrar o botão de inscrição
    const shouldShowRegistrationButton = columnId !== 'passados' && registrationLink;

    return (
        <div
            className={`bg-[#0D1117] text-white overflow-hidden h-full flex flex-col border border-gray-600 rounded-md ${isDraggable ? 'cursor-move' : 'cursor-default'}`}
            style={{ borderRadius: '5px' }}
            draggable={isDraggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Header com imagem do campeonato */}
            <div className="relative border-b border-gray-600">
                <img
                    src={imageUrl || "/api/placeholder/400/150"}
                    alt={name}
                    className="w-full h-40 object-cover"
                />
            </div>

            {/* Body */}
            <div className="p-4 flex-grow border-b border-gray-600">
                <h3 className="font-bold text-xl mb-2">{name}</h3>

                {/* Game info logo e nome abaixo do título */}
                {gameIconUrl && (
                    <div className="flex items-center mb-3">
                        <img
                            src={gameIconUrl}
                            alt="Game Icon"
                            className="w-8 h-8 object-contain mr-2 rounded-md"
                            style={{ borderRadius: '5px' }}
                        />
                        {gameName && <span className="font-medium">{gameName}</span>}
                    </div>
                )}

                <div className="space-y-2 text-gray-300">
                    {/* Data do campeonato - condicional */}
                    {startDate && (
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                            </svg>
                            <span>Início em {formatDate(startDate)}</span>
                        </div>
                    )}

                    {/* Preço do campeonato - condicional */}
                    {price && (
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"></path>
                            </svg>
                            <span>{price}</span>
                        </div>
                    )}

                    {/* Descrição do campeonato - condicional */}
                    {description && (
                        <div className="flex items-start">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                            </svg>
                            <span className="flex-grow">{description}</span>
                        </div>
                    )}

                    {/* Premiações - condicionais */}
                    {(firstPrize || secondPrize || thirdPrize) && (
                        <div className="mt-3 space-y-1">
                            {firstPrize && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.668 2.117a1 1 0 011.664 0l2.51 4.124 5.005 1.065a1 1 0 01.538 1.653l-3.54 3.674.649 5.124a1 1 0 01-1.414 1.025L10 16.596l-4.58 2.186a1 1 0 01-1.415-1.025l.648-5.124-3.54-3.674a1 1 0 01.537-1.653l5.005-1.065 2.51-4.124z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>1º lugar: {firstPrize}</span>
                                </div>
                            )}

                            {secondPrize && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.668 2.117a1 1 0 011.664 0l2.51 4.124 5.005 1.065a1 1 0 01.538 1.653l-3.54 3.674.649 5.124a1 1 0 01-1.414 1.025L10 16.596l-4.58 2.186a1 1 0 01-1.415-1.025l.648-5.124-3.54-3.674a1 1 0 01.537-1.653l5.005-1.065 2.51-4.124z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>2º lugar: {secondPrize}</span>
                                </div>
                            )}

                            {thirdPrize && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.668 2.117a1 1 0 011.664 0l2.51 4.124 5.005 1.065a1 1 0 01.538 1.653l-3.54 3.674.649 5.124a1 1 0 01-1.414 1.025L10 16.596l-4.58 2.186a1 1 0 01-1.415-1.025l.648-5.124-3.54-3.674a1 1 0 01.537-1.653l5.005-1.065 2.51-4.124z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>3º lugar: {thirdPrize}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Desempenho do Time - CONDICIONAL: não mostrar na coluna inscrições */}
                    {shouldShowPerformance && (
                        <div className="mt-4 pt-3 border-t border-gray-700">
                            <h4 className="font-semibold mb-2 text-white">Desempenho da Equipe</h4>

                            {teamPosition && (
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" />
                                        <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                                    </svg>
                                    <span className="font-medium">{teamPosition}</span>
                                </div>
                            )}

                            {performanceDescription && (
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="flex-grow">{performanceDescription}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#0D1117] flex items-center justify-between">
                {/* Organizador */}
                {organizerImageUrl && (
                    <div className="flex items-center">
                        <img
                            src={organizerImageUrl}
                            alt="Organizador"
                            className="max-w-[100px] max-h-[100px] rounded-full mr-2 object-cover"
                        />
                    </div>
                )}

                {/* Botões */}
                <div className="flex gap-2">
                    {/* Botões de edição só aparecem no modo admin */}
                    {isAdminMode && (
                        <>
                            <EditarBtn onClick={onEdit} />
                            <DeletarBtn onDelete={onDelete} />
                        </>
                    )}

                    {/* Mostrar botão de inscrição apenas quando não estiver na coluna "passados" */}
                    {shouldShowRegistrationButton && (
                        <a
                            href={registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                        >
                            Inscrever-se
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
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
    }).isRequired,
    columnId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isAdminMode: PropTypes.bool.isRequired,
    isDraggable: PropTypes.bool.isRequired
};

export default Card;