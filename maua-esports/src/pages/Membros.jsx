import React, { useState } from "react";
import CardJogador from "../components/CardJogador";
import { jogadoresData } from "../data/jogadoresData";
import { useParams } from "react-router-dom";

const Membros = () => {
  const { timeId } = useParams(); // Captura o ID do time da URL
  const [jogadores, setJogadores] = useState([]);

  // Filtra os jogadores quando o timeId muda
  React.useEffect(() => {
    const jogadoresDoTime = jogadoresData.filter(j => j.timeId === parseInt(timeId));
    setJogadores(jogadoresDoTime);
  }, [timeId]);

  const handleDeleteJogador = (jogadorId) => {
    setJogadores(jogadores.filter(j => j.id !== jogadorId));
  };

  const handleEditJogador = (jogadorId, updatedData) => {
    setJogadores(jogadores.map(j => 
      j.id === jogadorId ? { ...j, ...updatedData } : j
    ));
  };

  return (
    <div className="w-full min-h-screen bg-fundo">
      {/* Cabeçalho mantendo o mesmo estilo */}
      <div className="flex w-full bg-preto h-60 justify-center items-center">
        <h1 className="font-blinker text-branco font-bold text-3xl">
          Membros do Time
        </h1>
      </div>

      {/* Área dos cards - mantendo seu layout atual */}
      <div className="bg-fundo w-full flex justify-center items-center overflow-auto scrollbar-hidden">
        <div className="w-full flex flex-wrap py-16 justify-center gap-8">
          {jogadores.map(jogador => (
            <CardJogador
              key={jogador.id}
              jogadorId={jogador.id}
              nome={jogador.nome}
              titulo={jogador.titulo}
              descricao={jogador.descricao}
              foto={jogador.foto}
              instagram={jogador.instagram}
              twitter={jogador.twitter}
              twitch={jogador.twitch}
              onDelete={handleDeleteJogador}
              onEdit={handleEditJogador}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Membros;