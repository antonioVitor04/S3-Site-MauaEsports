import { FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { IoLogoTwitch } from "react-icons/io";
import Foto from "../assets/images/Foto.svg";
import Jogo from "../assets/images/Jogo.svg";

const CardJogador = () => {
  return (
    <div
      className="relative w-[300px] h-[450px] bg-slate-300 shadow-lg flex flex-col items-center 
               hover:scale-110 transition-transform duration-300 cursor-pointer
             animation"
      style={{
        clipPath:
          "polygon(15% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%, 0% 10%)", // Cortando as bordas do card
      }}
    >
      {/* Título do card */}
      <h1 className="text-xl font-bold font-blinker bg-sky-400 rounded-bl-2xl  px-2 py-1 inline-block absolute top-0 right-0 z-10 opacity-70">
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
          <h1 className="text-lg font-semibold ml-5">Nome do Jogador</h1>
          <img src={Jogo} alt="Jogo" className="w-6 h-6 mr-5" />
        </div>

        {/* Descrição do jogador */}
        <div className="w-full">
          <p className="text-sm text-left mt-2 px-5 font-blinker  max-w-full">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque,
            quae, voluptate id ad iste nulla ipsa odio vel, molestias voluptas
            consequuntur commodi inventore saepe reiciendis voluptatibus soluta
            amet numquam possimus!
          </p>
        </div>

        {/* Social Media */}
        <div className="flex space-x-4 my-4 px-5 text-xl justify-start w-full">
          <FaInstagram className="cursor-pointer hover:bg-gray-500/10 hover:rounded-md hover:scale-120 transition-transform duration-300" />
          <RiTwitterXFill className="cursor-pointer  hover:scale-120 transition-transform duration-300" />
          <IoLogoTwitch className="cursor-pointer  hover:scale-120 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default CardJogador;
