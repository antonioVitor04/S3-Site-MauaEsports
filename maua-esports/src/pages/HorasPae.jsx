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
    { name: "Player 4", hours: 32 },
    { name: "Player 5", hours: 58 },
    { name: "Coach", hours: 74 },
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
    if (hours >= 75) return "bg-[#FFC87F]"; // Bege
    if (hours >= 60) return "bg-[#C10146]"; // Vermelho
    if (hours >= 50) return "bg-[#60409E]"; // Roxo
    if (hours >= 40) return "bg-[#047C21]"; // Verde
    if (hours >= 30) return "bg-[#39A0B1]"; // Azul bebê
    if (hours >= 20) return "bg-[#FCA610]"; // Amarelo dourado
    if (hours >= 10) return "bg-[#7A807D]"; // Prata
    if (hours >= 1) return "bg-[#5D0F01]"; // Marrom/Bronze
    return "bg-gray-700"; // Cinza escuro (vazio)
  };

  // Determina o rank atual baseado nas horas
  const getCurrentRank = (hours) => {
    if (hours >= 75) return 8;
    if (hours >= 60) return 7;
    if (hours >= 50) return 6;
    if (hours >= 40) return 5;
    if (hours >= 30) return 4;
    if (hours >= 20) return 3;
    if (hours >= 10) return 2;
    if (hours >= 1) return 1;
    return 0;
  };

  // Calcula a porcentagem de preenchimento dentro do rank atual
  const getFillPercentage = (hours) => {
    const rank = getCurrentRank(hours);
    
    switch(rank) {
      case 1: return Math.min(hours / 10 * 100, 100);
      case 2: return Math.min((hours - 10) / 10 * 100, 100);
      case 3: return Math.min((hours - 20) / 10 * 100, 100);
      case 4: return Math.min((hours - 30) / 10 * 100, 100);
      case 5: return Math.min((hours - 40) / 10 * 100, 100);
      case 6: return Math.min((hours - 50) / 10 * 100, 100);
      case 7: return Math.min((hours - 60) / 15 * 100, 100);
      case 8: return 100;
      default: return 0;
    }
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
                className={`p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ${
                  selectedTeam === time
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
              const currentRank = getCurrentRank(player.hours);
              const fillPercentage = getFillPercentage(player.hours);
              const barColor = getColor(player.hours);
              const emptyColor = "bg-gray-700";

              return (
                <div key={playerIndex} className="flex items-center mb-4">
                  <div className="w-24 md:w-32 font-semibold">{player.name}</div>

                  {/* Barra de progresso com segmentos para cada rank */}
                  <div className="flex-1 grid grid-cols-8 gap-1">
                    {ranks.map((_, rankIndex) => {
                      const rankNumber = rankIndex + 1;
                      const isActiveRank = rankNumber === currentRank;
                      const isCompletedRank = rankNumber < currentRank;
                      const color = isCompletedRank ? barColor : 
                                   (isActiveRank ? barColor : emptyColor);

                      return (
                        <div key={rankIndex} className="relative h-10">
                          {/* Fundo do segmento (invertido) */}
                          <div
                            className="absolute inset-0 bg-gray-700"
                            style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                          >
                            {/* Parte preenchida */}
                            <div 
                              className={`absolute inset-0 ${color}`}
                              style={{
                                width: isActiveRank ? `${fillPercentage}%` : '100%'
                              }}
                            ></div>
                          </div>

                          {/* Valor das horas totais na última barra */}
                          {rankNumber === ranks.length && (
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

            {/* Legenda atualizada */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { range: "1-9h", color: "bg-[#5D0F01]", name: "Bronze (Rank 1)" },
                { range: "10-19h", color: "bg-[#7A807D]", name: "Prata (Rank 2)" },
                { range: "20-29h", color: "bg-[#FCA610]", name: "Ouro (Rank 3)" },
                { range: "30-39h", color: "bg-[#39A0B1]", name: "Azul (Rank 4)" },
                { range: "40-49h", color: "bg-[#047C21]", name: "Verde (Rank 5)" },
                { range: "50-59h", color: "bg-[#60409E]", name: "Roxo (Rank 6)" },
                { range: "60-74h", color: "bg-[#C10146]", name: "Vermelho (Rank 7)" },
                { range: "75h+", color: "bg-[#FFC87F]", name: "Diamante (Rank 8)" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-5 h-5 mr-2 ${item.color}`}
                    style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
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