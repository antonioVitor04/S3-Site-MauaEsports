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

        const responseTime = await fetch(`${API_BASE_URL}/times/${timeId}`);
        const timeData = await responseTime.json();
        setTime(timeData);

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
      const response = await fetch(`${API_BASE_URL}/jogadores/${jogadorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao deletar jogador");
      }

      setJogadores((prev) => prev.filter((j) => j._id !== jogadorId));
      alert("Jogador deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar jogador:", error);
      alert(`Erro ao deletar jogador: ${error.message}`);
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

      if (updatedData.foto) {
        if (
          typeof updatedData.foto === "string" &&
          updatedData.foto.startsWith("data:")
        ) {
          const response = await fetch(updatedData.foto);
          const blob = await response.blob();
          formData.append("foto", blob, "jogador-foto.jpg");
        } else if (updatedData.foto instanceof File) {
          formData.append("foto", updatedData.foto);
        }
      }

      const response = await fetch(`${API_BASE_URL}/jogadores/${jogadorId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar jogador");
      }

      const data = await response.json();

      setJogadores((prev) =>
        prev.map((j) =>
          j._id === jogadorId
            ? {
                ...data.data,
                fotoUrl: `${API_BASE_URL}/jogadores/${
                  data.data._id
                }/imagem?${Date.now()}`,
              }
            : j
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  const handleAdicionarMembro = async (novoMembro) => {
    try {
      const formData = new FormData();
      formData.append("nome", novoMembro.nome);
      formData.append("titulo", novoMembro.titulo);
      formData.append("descricao", novoMembro.descricao);
      formData.append("time", timeId);

      if (novoMembro.instagram) formData.append("insta", novoMembro.instagram);
      if (novoMembro.twitter) formData.append("twitter", novoMembro.twitter);
      if (novoMembro.twitch) formData.append("twitch", novoMembro.twitch);

      if (novoMembro.foto && novoMembro.foto.startsWith("data:")) {
        const response = await fetch(novoMembro.foto);
        const blob = await response.blob();
        formData.append("foto", blob, "foto-jogador.jpg");
      }

      const response = await fetch(`${API_BASE_URL}/jogadores`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar membro");
      }

      const data = await response.json();

      setJogadores((prev) => [
        ...prev,
        {
          ...data,
          fotoUrl: `${API_BASE_URL}/jogadores/${data._id}/imagem?${Date.now()}`,
        },
      ]);
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      alert(`Erro: ${error.message}`);
    }
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
              logoTime={time?.logoUrl}
            />
          ))}
          <AdicionarMembro
            onAdicionarMembro={handleAdicionarMembro}
            timeId={timeId}
          />
        </div>
      </div>
    </div>
  );
};

export default Membros;
