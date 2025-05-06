import React, { useState, useEffect } from "react";
import axios from "axios";
import PageBanner from "../components/PageBanner";

// Importe as imagens corretamente
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

  const [modalidades, setModalidades] = useState({});
  const [times, setTimes] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [playersData, setPlayersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega os dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca as modalidades/times
        const modResponse = await axios.get('/api/modality/all', {
          headers: { "Authorization": "Bearer frontendmauaesports" }
        });
        
        const mods = modResponse.data;
        setModalidades(mods);
        
        // Cria lista de times para o dropdown
        const teamList = Object.values(mods).map(mod => mod.Name);
        setTimes(teamList);
        setSelectedTeam(teamList[0] || "");
        
        // Busca os treinos
        const trainsResponse = await axios.get('/api/trains/all', {
          headers: { "Authorization": "Bearer frontendmauaesports" }
        });
        
        // Processa os dados para calcular as horas
        processPlayerHours(trainsResponse.data, mods);
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const getCurrentSemester = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Janeiro é 0
    
    // Primeiro semestre: Janeiro a Junho (1-6)
    // Segundo semestre: Julho a Dezembro (7-12)
    return month <= 6 ? `${year}.1` : `${year}.2`;
  };

  // Atualiza os dados quando o time selecionado muda
  useEffect(() => {
    if (selectedTeam && Object.keys(modalidades).length > 0) {
      const fetchTeamData = async () => {
        try {
          // Busca os treinos apenas para o time selecionado
          const modId = Object.keys(modalidades).find(
            key => modalidades[key].Name === selectedTeam
          );
          
          if (modId) {
            const trainsResponse = await axios.get('/api/trains/all', {
              headers: { "Authorization": "Bearer frontendmauaesports" },
              params: { "ModalityId": modId }
            });
            
            processPlayerHours(trainsResponse.data, modalidades);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do time:", error);
        }
      };
      
      fetchTeamData();
    }
  }, [selectedTeam, modalidades]);

  // Processa os dados dos treinos para calcular as horas dos jogadores
  const processPlayerHours = (trainsData, modalities) => {
    const playerHours = {};
    
    trainsData.forEach(train => {
      if (train.Status !== "ENDED" || !train.AttendedPlayers) return;
      
      const modality = modalities[train.ModalityId];
      if (!modality) return;
      
      train.AttendedPlayers.forEach(player => {
        if (!player.PlayerId || !player.EntranceTimestamp || !player.ExitTimestamp) return;
        
        // Calcula a duração em horas
        const durationHours = (player.ExitTimestamp - player.EntranceTimestamp) / (1000 * 60 * 60);
        
        if (playerHours[player.PlayerId]) {
          playerHours[player.PlayerId].hours += durationHours;
        } else {
          playerHours[player.PlayerId] = {
            name: `Jogador ${player.PlayerId.slice(-4)}`, // Nome genérico com ID
            hours: durationHours,
            team: modality.Name
          };
        }
      });
    });
    
    // Converte o objeto em array e ordena por horas
    const playersArray = Object.values(playerHours)
      .filter(player => player.team === selectedTeam)
      .sort((a, b) => b.hours - a.hours);
    
    setPlayersData(playersArray);
  };

  // Função para determinar o rank atual com base nas horas
  const getCurrentRank = (hours) => {
    if (hours >= 80) return 8;    // Diamante (80h)
    if (hours >= 70) return 7;    // Vermelho (70-79h)
    if (hours >= 60) return 6;    // Roxo (60-69h)
    if (hours >= 50) return 5;    // Esmeralda (50-59h)
    if (hours >= 35) return 4;    // Azul (35-49h)
    if (hours >= 25) return 3;    // Ouro (25-34h)
    if (hours >= 15) return 2;    // Prata (15-24h)
    if (hours >= 10) return 1;    // Bronze (10-14h)
    if (hours >= 1) return 0;     // Branco (1-9h)
    return -1;                    // Vazio (0h)
  };

  // Calcula a porcentagem de preenchimento do rank atual
  const getFillPercentage = (hours) => {
    const rank = getCurrentRank(hours);

    switch (rank) {
      case 0: return (hours / 10) * 100;       // Branco (1-9h)
      case 1: return ((hours - 10) / 5) * 100; // Bronze (10-14h)
      case 2: return ((hours - 15) / 10) * 100;// Prata (15-24h)
      case 3: return ((hours - 25) / 10) * 100;// Ouro (25-34h)
      case 4: return ((hours - 35) / 15) * 100;// Azul (35-49h)
      case 5: return ((hours - 50) / 10) * 100;// Esmeralda (50-59h)
      case 6: return ((hours - 60) / 10) * 100;// Roxo (60-69h)
      case 7: return ((hours - 70) / 10) * 100;// Vermelho (70-79h)
      case 8: return 100;                      // Diamante (80h)
      default: return 0;
    }
  };

  // Retorna a cor correspondente ao rank
  const getColor = (rank) => {
    switch (rank) {
      case 0: return "bg-white";         // Branco
      case 1: return "bg-[#5D0F01]";     // Bronze
      case 2: return "bg-[#7A807D]";     // Prata
      case 3: return "bg-[#FCA610]";     // Ouro
      case 4: return "bg-[#39A0B1]";     // Azul
      case 5: return "bg-[#047C21]";     // Esmeralda
      case 6: return "bg-[#60409E]";     // Roxo
      case 7: return "bg-[#C10146]";     // Vermelho
      case 8: return "bg-[#FFC87F]";     // Diamante
      default: return "bg-gray-700";     // Vazio
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center">
        <div className="text-xl">Carregando dados...</div>
      </div>
    );
  }

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
                    {/* <span className="text-md text-center">{rank.name}</span> */}
                  </div>
                ))}
              </div>
            </div>

            {/* Lista de jogadores com barras */}
            {playersData.length > 0 ? (
              playersData.map((player, playerIndex) => {
                const currentRank = getCurrentRank(player.hours);
                const fillPercentage = getFillPercentage(player.hours);
                const roundedHours = Math.round(player.hours * 10) / 10; // Arredonda para 1 casa decimal

                return (
                  <div key={playerIndex} className="flex items-center mb-4">
                    <div className="w-24 md:w-32 font-semibold truncate">{player.name}</div>

                    {/* Barra de progresso com segmentos para cada rank */}
                    <div className="flex-1 grid grid-cols-8 gap-1">
                      {ranks.map((_, rankIndex) => {
                        const rankNumber = rankIndex + 1;
                        const isActiveRank = rankNumber === currentRank + 1;
                        const isCompletedRank = rankNumber <= currentRank;
                        const isEmpty = currentRank === -1;

                        let color;
                        if (isEmpty) {
                          color = "bg-gray-700";
                        } else if (isCompletedRank) {
                          color = getColor(currentRank);
                        } else if (isActiveRank) {
                          color = getColor(currentRank);
                        } else {
                          color = "bg-gray-700";
                        }

                        const segmentFill = isActiveRank ? fillPercentage :
                          isCompletedRank ? 100 : 0;

                        return (
                          <div key={rankIndex} className="relative h-10">
                            <div
                              className="absolute inset-0 bg-gray-700"
                              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                            >
                              <div
                                className={`absolute inset-0 ${color}`}
                                style={{ width: `${segmentFill}%` }}
                              ></div>
                            </div>

                            {rankNumber === 8 && (
                              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                                {roundedHours}h
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                Nenhum dado de jogadores encontrado para este time.
              </div>
            )}

            {/* Legenda */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { range: "1-9h", color: "bg-white", name: "Iniciante" },
                { range: "10-14h", color: "bg-[#5D0F01]", name: "Novato" },
                { range: "15-24h", color: "bg-[#7A807D]", name: "Intermediário" },
                { range: "25-34h", color: "bg-[#FCA610]", name: "Avançado" },
                { range: "35-49h", color: "bg-[#39A0B1]", name: "Experiente" },
                { range: "50-59h", color: "bg-[#047C21]", name: "Veterano" },
                { range: "60-69h", color: "bg-[#60409E]", name: "Elite" },
                { range: "70-79h", color: "bg-[#C10146]", name: "Mestre" },
                { range: "80h+", color: "bg-[#FFC87F]", name: "Lenda" },
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