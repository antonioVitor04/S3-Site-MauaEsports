import { FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { IoLogoTwitch } from "react-icons/io";
import Foto from "../assets/images/Foto.svg";
import Jogo from "../assets/images/logovalorant.svg";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const CardJogador = () => {
  return (
    <div
      className="border-2 border-borda relative w-[300px] h-[450px] bg-fundo shadow-lg flex flex-col items-center 
               hover:scale-110 transition-transform duration-300 cursor-pointer
             animation"
      style={{
        clipPath:
          "polygon(15% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%, 0% 10%)", // Cortando as bordas do card
      }}
    >
      {/* Título do card */}
      <h1 className="text-xl font-bold font-blinker bg-azul-claro rounded-bl-2xl  px-2 py-1 inline-block absolute top-0 right-0 z-10 opacity-70">
        Título
      </h1>

      {/* Imagem do jogador */}
      <div className="w-full h-full relative">
        <img
          src={Foto}
          alt="Icone do time"
          className="w-full h-full object-cover absolute top-0 left-0"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%)", // corta o canto inferior direito da imagem
          }}
        />
      </div>
      {/*container de baixo */}
      <div className="justify-center items-center">
        {/* Nome e ícone do jogo */}
        <div className="flex mt-3 space-x-2 font-blinker justify-between w-full">
          <h1 className="text-lg font-semibold ml-5 text-fonte-clara">
            Nome do Jogador
          </h1>
          <img src={Jogo} alt="Jogo" className="w-6 h-6 mr-5 text-azul-claro" />
        </div>

        {/* Descrição do jogador */}
        <div className="w-full border-b-2 py-2 border-borda">
          <p className="text-sm text-left mt-2 px-5 font-blinker  max-w-full text-fonte-escura">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque,
            quae, voluptate id t amet consectetur adipisicing elit. Atque,
          </p>
        </div>

        {/* Social Media e botoes de manipulacao */}
        <div className="flex items-center space-x-4 my-4 px-5 text-xl w-full text-fonte-escura">
          <FaInstagram className="cursor-pointer  hover:scale-110 transition-transform duration-300" />
          <RiTwitterXFill className="cursor-pointer hover:scale-110 transition-transform duration-300" />
          <IoLogoTwitch className="cursor-pointer hover:scale-110 transition-transform duration-300" />

          {/* Botões alinhados à direita */}
          <div className="flex space-x-2 ml-auto mr-3 gap-2">
            <button className="w-8 h-8 flex items-center justify-center p-1 bg-fonte-escura rounded-full text-branco cursor-pointer hover:bg-azul-claro hover:scale-110 transition-transform duration-300">
              <MdEdit className="w-6 h-6" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center p-1 bg-fonte-escura rounded-full text-branco cursor-pointer hover:bg-vermelho-claro hover:scale-110 transition-transform duration-300">
              <MdDelete className="w-6 h-6" />
            </button>
            {/* Placeholder para o segundo botão */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardJogador;
