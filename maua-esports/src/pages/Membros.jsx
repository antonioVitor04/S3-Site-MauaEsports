import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardJogador from "../components/CardJogador";
import AdicionarMembro from "../components/AdicionarMembro";

const API_BASE_URL = "http://localhost:3000";

const Membros = () => {
  const { timeId } = useParams();
  const [jogadores, setJogadores] = useState([]);
  const [time, setTime] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);

        // Carrega dados do time específico
        const responseTime = await fetch(`${API_BASE_URL}/times/${timeId}`);
        const timeData = await responseTime.json();
        setTime(timeData);

        // Carrega jogadores do time específico
        const responseJogadores = await fetch(
          `${API_BASE_URL}/times/${timeId}/jogadores`
        );
        const jogadoresData = await responseJogadores.json();

        setJogadores(
          jogadoresData.map((j) => ({
            ...j,
            fotoUrl: `${API_BASE_URL}/jogadores/${j._id}/imagem?${Date.now()}`,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [timeId]);

  const handleDeleteJogador = async (jogadorId) => {
    try {
      await fetch(`${API_BASE_URL}/jogadores/${jogadorId}`, {
        method: "DELETE",
      });
      setJogadores(jogadores.filter((j) => j._id !== jogadorId));
    } catch (error) {
      console.error("Erro ao deletar jogador:", error);
    }
  };

  const handleEditJogador = async (jogadorId, updatedData) => {
    try {
      const formData = new FormData();
      formData.append("nome", updatedData.nome);
      formData.append("titulo", updatedData.titulo);
      formData.append("descricao", updatedData.descricao);
      formData.append("insta", updatedData.instagram || "");
      formData.append("twitter", updatedData.twitter || "");
      formData.append("twitch", updatedData.twitch || "");

      // Se a foto foi alterada (é um data URL ou File object)
      if (updatedData.foto) {
        if (
          typeof updatedData.foto === "string" &&
          updatedData.foto.startsWith("data:")
        ) {
          // Converte data URL para Blob
          const response = await fetch(updatedData.foto);
          const blob = await response.blob();
          formData.append("foto", blob, "jogador-foto.jpg");
        } else if (updatedData.foto instanceof File) {
          // Se já é um File object
          formData.append("foto", updatedData.foto);
        }
      }

      const response = await fetch(`${API_BASE_URL}/jogadores/${jogadorId}`, {
        method: "PUT",
        body: formData,
        // Não definir Content-Type - o navegador fará isso automaticamente
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar jogador");
      }

      const data = await response.json();

      // Atualiza a lista de jogadores
      setJogadores((prev) =>
        prev.map((j) =>
          j._id === jogadorId
            ? {
                ...data.data, // Acessa os dados dentro da propriedade data
                fotoUrl: `${API_BASE_URL}/jogadores/${
                  data.data._id
                }/imagem?${Date.now()}`,
              }
            : j
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
      // Mostra feedback para o usuário
      alert(`Erro: ${error.message}`);
    }
  };

  const handleAdicionarMembro = (novoMembro) => {
    setJogadores([
      ...jogadores,
      {
        _id: Date.now().toString(),
        ...novoMembro,
        time: timeId,
      },
    ]);
  };

  if (carregando) {
    return (
      <div className="w-full min-h-screen bg-fundo flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-azul-claro"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-fundo">
      <div className="flex w-full bg-preto h-60 justify-center items-center">
        <h1 className="font-blinker text-branco font-bold text-3xl">
          {time?.nome ? `Membros do ${time.nome}` : "Membros do Time"}
        </h1>
      </div>

      <div className="bg-fundo w-full flex justify-center items-center overflow-auto scrollbar-hidden">
        <div className="w-full flex flex-wrap py-16 justify-center gap-8">
          {jogadores.map((jogador) => (
            <CardJogador
              key={jogador._id}
              jogadorId={jogador._id}
              nome={jogador.nome}
              titulo={jogador.titulo}
              descricao={jogador.descricao}
              foto={jogador.fotoUrl}
              instagram={jogador.insta}
              twitter={jogador.twitter}
              twitch={jogador.twitch}
              onDelete={handleDeleteJogador}
              onEdit={handleEditJogador}
            />
          ))}
          <AdicionarMembro onAdicionarMembro={handleAdicionarMembro} />
        </div>
      </div>
    </div>
  );
};

export default Membros;
