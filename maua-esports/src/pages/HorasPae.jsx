import React, { useState } from "react";

function HorasPaePage() {
  // Dados dos ranks com imagens (substitua pelos seus caminhos de imagem reais)
  const ranks = [
    { id: 1, name: "Rank 1", image: "/images/rank1.png" },
    { id: 2, name: "Rank 2", image: "/images/rank2.png" },
    { id: 3, name: "Rank 3", image: "/images/rank3.png" },
    { id: 4, name: "Rank 4", image: "/images/rank4.png" },
    { id: 5, name: "Rank 5", image: "/images/rank5.png" },
    { id: 6, name: "Rank 6", image: "/images/rank6.png" },
    { id: 7, name: "Rank 7", image: "/images/rank7.png" },
    { id: 8, name: "Rank 8", image: "/images/rank8.png" }
  ];

  const players = [
    { name: "Player 1", hours: 45 },
    { name: "Player 2", hours: 9 },
    { name: "Player 3", hours: 25 },
    { name: "Player 4", hours: 35 },
    { name: "Player 5", hours: 55 },
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
    if (hours >= 71) return "bg-amber-200"; // Bege
    if (hours >= 61) return "bg-red-500";   // Vermelho
    if (hours >= 51) return "bg-green-500"; // Verde
    if (hours >= 41) return "bg-purple-500";// Roxo
    if (hours >= 31) return "bg-blue-200";  // Azul bebê
    if (hours >= 21) return "bg-yellow-400";// Amarelo dourado
    if (hours >= 11) return "bg-gray-300";  // Prata
    if (hours >= 0) return "bg-amber-800";  // Marrom/Bronze
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
    if (hours >= 1) return 1;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-10 px-4 md:px-14">

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - Times */}
        <aside className="w-full md:w-72 bg-gray-800 border-2 border-gray-700 rounded-[30px] p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Times</h2>
          <ul className="space-y-4">
            {times.map((time, idx) => (
              <li
                key={idx}
                className={`p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ${
                  selectedTeam === time 
                    ? "bg-gray-700 border-l-4 border-yellow-400 font-bold" 
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
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
            Horas PAEs - {selectedTeam}
          </h1>

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
                      className="w-10 h-10 object-contain mb-1"
                    />
                    <span className="text-xs text-center">{rank.name}</span>
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
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
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
                { range: "0-10h", color: "bg-amber-800", name: "Marrom/Bronze" },
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