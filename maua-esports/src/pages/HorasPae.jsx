import React, { useState } from "react";
import PageBanner from "../components/PageBanner";

// Importe as imagens corretamente (ajuste os caminhos conforme sua estrutura de pastas)
import rank1 from "../assets/images/rank1.png";
import rank2 from "../assets/images/rank2.png";
import rank3 from "../assets/images/rank3.png";
import rank4 from "../assets/images/rank4.png";
import rank5 from "../assets/images/rank5.png";
import rank6 from "../assets/images/rank6.png";
import rank7 from "../assets/images/rank7.png";
import rank8 from "../assets/images/rank8.png";

function HorasPaePage() {
  // Dados dos ranks com imagens importadas
  const ranks = [
    { id: 1, name: "Rank 1", image: rank1 },
    { id: 2, name: "Rank 2", image: rank2 },
    { id: 3, name: "Rank 3", image: rank3 },
    { id: 4, name: "Rank 4", image: rank4 },
    { id: 5, name: "Rank 5", image: rank5 },
    { id: 6, name: "Rank 6", image: rank6 },
    { id: 7, name: "Rank 7", image: rank7 },
    { id: 8, name: "Rank 8", image: rank8 }
  ];

  const players = [
    { name: "Player 1", hours: 45 },
    { name: "Player 2", hours: 9 },
    { name: "Player 3", hours: 25 },
    { name: "Player 4", hours: 35 },
    { name: "Player 5", hours: 61 },
    { name: "Coach", hours: 75 },
  ];

  const times = [
    "Valorant Blue",
    "Valorant Purple",
    "Valorant White",
    "Counter Strike 2",
    "Rainbow Six Siege",
  ];

  const [selectedTeam, setSelectedTeam] = useState("Valorant Blue");
  const [playersData, setPlayers] = useState(players);

  // Cores baseadas nas horas totais
  const getColor = (hours) => {
    if (hours >= 71) return "bg-[#FFC87F]"; // Bege
    if (hours >= 61) return "bg-[#C10146]";   // Rosa
    if (hours >= 51) return "bg-[#60409E]"; // Roxo
    if (hours >= 41) return "bg-[#047C21]";// verde
    if (hours >= 31) return "bg-[#39A0B1]";  // Azul bebê
    if (hours >= 21) return "bg-[#FCA610]";// Amarelo dourado
    if (hours >= 11) return "bg-[#7A807D]";  // Prata
    if (hours >= 1) return "bg-[#5D0F01]";  // Marrom/Bronze
    return "bg-gray-700";                  // Cinza escuro
  };

  // Calcular quantas barras devem ser preenchidas (de 0 a 8)
  const getFilledBars = (hours) => {
    if (hours >= 71) return 8;
    if (hours >= 61) return 7;
    if (hours >= 51) return 6;
    if (hours >= 41) return 5;
    if (hours >= 31) return 4;
    if (hours >= 21) return 3;
    if (hours >= 11) return 2;
    if (hours >= 1) return 0;
    return 0;
  };

  return (

    <div className="min-h-screen bg-[#0D1117] text-white ">

      <div className="bg-[#010409] h-[104px]"></div>
      <PageBanner pageName={`Horas PAEs - ${selectedTeam}`} />

      <div className="flex flex-col md:flex-row gap-6 md:px-14 md:py-15">

        {/* Sidebar - Times */}
        <aside className="w-full md:w-72 bg-gray-800 border-2 border-gray-700 rounded-[30px] p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6 text-white">Times</h2>
          <ul className="space-y-4">
            {times.map((time, idx) => (
              <li
                key={idx}
                className={`p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ${selectedTeam === time
                    ? "bg-gray-700 border-l-4 border-gray-800 font-bold"
                    : "bg-gray-800"
                  }`}
                onClick={() => setSelectedTeam(time)}
              >
                {time}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1">

          {/* Container das barras */}
          <div className="bg-gray-800 border-2 border-gray-700 rounded-[30px] shadow-lg p-6">
            {/* Cabeçalho com imagens dos ranks */}
            <div className="flex mb-4">
              <div className="w-24 md:w-32"></div> {/* Espaço para os nomes dos jogadores */}
              <div className="flex-1 grid grid-cols-8 gap-1">
                {ranks.map((rank, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={rank.image}
                      alt={rank.name}
                      className="w-20 h-20 object-contain mb-1"
                    />
                    <span className="text-md text-center">{rank.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista de jogadores com barras */}
            {playersData.map((player, playerIndex) => {
              const filledBars = getFilledBars(player.hours);
              const barColor = getColor(player.hours);

              return (
                <div key={playerIndex} className="flex items-center mb-4">
                  <div className="w-24 md:w-32 font-semibold">{player.name}</div>

                  {/* Barra de progresso com segmentos para cada rank */}
                  <div className="flex-1 grid grid-cols-8 gap-1">
                    {ranks.map((_, rankIndex) => {
                      const isFilled = rankIndex < filledBars;
                      const color = isFilled ? barColor : "bg-gray-700";

                      return (
                        <div key={rankIndex} className="relative h-10">
                          {/* Fundo do segmento */}
                          <div
                            className="absolute inset-0"
                            style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 10% 100%)" }}
                          >
                            <div className={`absolute inset-0 ${color}`}></div>
                          </div>

                          {/* Valor das horas totais na última barra */}
                          {rankIndex === ranks.length - 1 && (
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                              {player.hours}h
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Legenda */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { range: "1-10h", color: "bg-amber-800", name: "Marrom/Bronze" },
                { range: "11-20h", color: "bg-gray-300", name: "Prata" },
                { range: "21-30h", color: "bg-yellow-400", name: "Amarelo Dourado" },
                { range: "31-40h", color: "bg-blue-200", name: "Azul Bebê" },
                { range: "41-50h", color: "bg-purple-500", name: "Roxo" },
                { range: "51-60h", color: "bg-green-500", name: "Verde" },
                { range: "61-70h", color: "bg-red-500", name: "Vermelho" },
                { range: "71h+", color: "bg-amber-200", name: "Bege" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-5 h-5 mr-2 ${item.color}`}
                    style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 10% 100%)" }}
                  ></div>
                  <span className="text-sm">
                    {item.range} - {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HorasPaePage;