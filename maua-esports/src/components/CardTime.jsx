import Foto from "../assets/images/valorant.jpg";
import Jogo from "../assets/images/Jogo.svg";

const CardTime = () => {
  return (
    <div
      className="group relative w-[300px] h-[450px] bg-slate-300 shadow-lg flex flex-col items-center 
            hover:scale-110 transition-transform duration-300 cursor-pointer"
      style={{
        clipPath:
          "polygon(15% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%, 0% 10%)", // Cortando as bordas do card
      }}
    >
      {/* Imagem do jogo */}
      <div className="w-full h-[80%] relative overflow-hidden">
        <img
          src={Foto}
          alt="Imagem Jogo"
          className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-1100 ease-in-out group-hover:scale-125"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%)", // corta o canto inferior direito da imagem
          }}
        />
      </div>
      {/* Container de baixo */}
      <div className="justify-center items-center">
        {/* Nome e ícone do jogo */}
        <div className="flex mt-3 space-x-2 font-blinker justify-between w-full gap-10">
          <h1 className="text-lg font-semibold ml-4 ">VALORANT Inclusivo</h1>
          <img src={Jogo} alt="Jogo" className="w-6 h-6 mr-4" />
        </div>
      </div>
    </div>
  );
};

export default CardTime;
