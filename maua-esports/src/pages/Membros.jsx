import React, { useState, useEffect } from "react";
import CardJogador from "../components/CardJogador";
import { useParams } from "react-router-dom";
import EditarJogador from "../components/EditarJogador";

const Membros = () => {
  const { timeId } = useParams();
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [jogadorEditando, setJogadorEditando] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carrega todos os times
        const responseTimes = await fetch('/times');
        const timesData = await responseTimes.json();
        setTimes(timesData);

        // Carrega jogadores do time específico
        const responseJogadores = await fetch(`/times/${timeId}/jogadores`);
        let jogadoresData = await responseJogadores.json();

        // Para cada jogador, busca os dados completos do time
        jogadoresData = await Promise.all(
          jogadoresData.map(async (jogador) => {
            const timeResponse = await fetch(`/times/${jogador.time}`);
            const timeData = await timeResponse.json();
            return {
              ...jogador,
              time: timeData
            };
          })
        );

        setJogadores(jogadoresData);
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setCarregando(false);
      }
    };

    carregando && carregarDados();
  }, [timeId, carregando]);

  const handleDeleteJogador = async (jogadorId) => {
    try {
      await fetch(`/jogadores/${jogadorId}`, { method: 'DELETE' });
      setJogadores(jogadores.filter(j => j._id !== jogadorId));
    } catch (error) {
      console.error('Erro ao deletar jogador:', error);
    }
  };

  const handleEditJogador = async (jogadorId, updatedData) => {
    try {
      const formData = new FormData();
      
      // Adiciona campos textuais
      Object.entries({
        nome: updatedData.nome,
        titulo: updatedData.titulo,
        descricao: updatedData.descricao,
        insta: updatedData.instagram,
        twitter: updatedData.twitter,
        twitch: updatedData.twitch,
        time: updatedData.time
      }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Adiciona a foto se for um arquivo novo
      if (updatedData.foto && typeof updatedData.foto !== 'string') {
        const blob = await fetch(updatedData.foto).then(r => r.blob());
        formData.append('foto', blob);
      }

      const response = await fetch(`/jogadores/${jogadorId}`, {
        method: 'PUT',
        body: formData
      });

      const jogadorAtualizado = await response.json();
      
      // Atualiza o time completo no estado
      const timeResponse = await fetch(`/times/${jogadorAtualizado.time}`);
      const timeData = await timeResponse.json();
      
      setJogadores(jogadores.map(j => 
        j._id === jogadorId ? { ...jogadorAtualizado, time: timeData } : j
      ));
      
      setJogadorEditando(null);
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
    }
  };

  if (carregando) {
    return (
      <div className="w-full min-h-screen bg-fundo flex items-center justify-center">
        <p className="text-branco">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-fundo">
      <div className="flex w-full bg-preto h-60 justify-center items-center">
        <h1 className="font-blinker text-branco font-bold text-3xl">
          Membros do Time
        </h1>
      </div>

      <div className="bg-fundo w-full flex justify-center items-center overflow-auto scrollbar-hidden">
        <div className="w-full flex flex-wrap py-16 justify-center gap-8">
          {jogadores.map(jogador => (
            <CardJogador
              key={jogador._id}
              jogadorId={jogador._id}
              nome={jogador.nome}
              titulo={jogador.titulo}
              descricao={jogador.descricao}
              foto={`/jogadores/${jogador._id}/imagem`}
              instagram={jogador.insta}
              twitter={jogador.twitter}
              twitch={jogador.twitch}
              time={jogador.time?.nome}
              onDelete={handleDeleteJogador}
              onEdit={() => setJogadorEditando(jogador)}
            />
          ))}
        </div>
      </div>

      {jogadorEditando && (
        <EditarJogador
          jogadorId={jogadorEditando._id}
          nomeInicial={jogadorEditando.nome}
          tituloInicial={jogadorEditando.titulo}
          descricaoInicial={jogadorEditando.descricao}
          fotoInicial={`/jogadores/${jogadorEditando._id}/imagem`}
          instagramInicial={jogadorEditando.insta}
          twitterInicial={jogadorEditando.twitter}
          twitchInicial={jogadorEditando.twitch}
          timeInicial={jogadorEditando.time?._id}
          timesDisponiveis={times}
          onSave={(data) => handleEditJogador(jogadorEditando._id, data)}
          onClose={() => setJogadorEditando(null)}
        />
      )}
    </div>
  );
};

export default Membros;