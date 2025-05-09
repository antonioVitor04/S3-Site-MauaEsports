import { useState } from 'react';
import PropTypes from 'prop-types';
import EditarBtn from '../EditarBtn';
import InfoModal from './InfoModal';

const InfoCard = ({ icon, texto }) => {
    // Estado para controlar a abertura do modal
    const [modalAberto, setModalAberto] = useState(false);
    // Estados para armazenar os valores atuais
    const [cardTexto, setCardTexto] = useState(texto);
    const [cardIcon, setCardIcon] = useState(icon);

    // Função para abrir o modal
    const abrirModal = () => {
        setModalAberto(true);
    };

    // Função para fechar o modal
    const fecharModal = () => {
        setModalAberto(false);
    };

    // Função para salvar as alterações
    const salvarAlteracoes = (dados) => {
        setCardTexto(dados.texto);
        setCardIcon(dados.icon);
    };

    return (
        <div className='text-center border-1 border-borda rounded-[12px] p-5 flex flex-col h-80 w-64'>
            {/* Ícone */}
            <div className="flex justify-center mb-2">
                <img className='w-16 h-16 object-contain' src={cardIcon} alt="" />
            </div>

            {/* Linha */}
            <hr className='text-borda w-full' />

            {/* Texto - usando flex-grow para ocupar espaço disponível com scrollbar personalizada */}
            <div className='flex-grow overflow-auto my-4 scrollbar-custom pr-4 text-sm'>
                <style jsx>{`
                    .scrollbar-custom::-webkit-scrollbar {
                        width: 2px;
                    }
                    .scrollbar-custom::-webkit-scrollbar-track {
                        background: #000;
                        border-radius: 20px;
                    }
                    .scrollbar-custom::-webkit-scrollbar-thumb {
                        background: #3D444D;
                        border-radius: 10px;
                    }
                    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                        background: white;
                    }
                `}</style>
                <p className='text-fonte-escura'>{cardTexto}</p>
            </div>

            {/* Botão Editar - usando mt-auto para fixar no final */}
            <div className='flex justify-end mt-auto'>
                <EditarBtn onClick={abrirModal} />
            </div>

            {/* Modal de Edição */}
            <InfoModal
                isOpen={modalAberto}
                onClose={fecharModal}
                textoAtual={cardTexto}
                iconAtual={cardIcon}
                onSave={salvarAlteracoes}
            />
        </div>
    );
};

InfoCard.propTypes = {
    texto: PropTypes.string,
    icon: PropTypes.string
};

export default InfoCard;