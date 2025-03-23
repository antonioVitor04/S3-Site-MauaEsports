import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CardJogador from "../components/CardJogador";
import Jogo from "../assets/images/Foto.svg"; // Importando a imagem

const Membros = () => {
  const [membros, setMembros] = useState([
    {
      id: uuidv4(),
      nome: "Aspas",
      titulo: "Jogador",
      descricao:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae commodi distinctio hic, ea repellendus modi voluptatem",
      foto: Jogo,
      instagram: "https://www.instagram.com/aspaszin/", // Link completo
      twitter: "https://x.com/aspaszin", // Adicionado para consistência
      twitch: "https://twitch.tv/aspaszin", // Adicionado para consistência
    },
    {
      id: uuidv4(),
      nome: "TenZ",
      titulo: "Jogador",
      descricao:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae commodi distinctio hic, ea repellendus modi voluptatem",
      foto: Jogo,
      instagram: null, // Adicionado para consistência
      twitter: null, // Adicionado para consistência
      twitch: null, // Adicionado para consistência
    },
    // Adicione mais membros conforme necessário
  ]);

  // Função para deletar um jogador
  const handleDelete = (jogadorId) => {
    setMembros(membros.filter((membro) => membro.id !== jogadorId));
  };

  // Função para editar um jogador
  const handleEdit = (jogadorId, novosDados) => {
    console.log("Novos dados:", novosDados); // Depuração
    setMembros(
      membros.map((membro) =>
        membro.id === jogadorId ? { ...membro, ...novosDados } : membro
      )
    );
  };

  return (
    <div className="w-full">
      {/* Seção 1: Cabeçalho */}
      <div className="flex w-full bg-preto h-60 justify-center items-center">
        <h1 className="font-blinker text-azul-claro font-bold text-3xl">
          Membros
        </h1>
      </div>

      {/* Seção 2: Lista de membros */}
      <div className="bg-fundo w-full min-h-screen flex justify-center items-center relative overflow-auto scrollbar-hidden">
        <div className="w-full flex flex-wrap py-16 justify-center gap-8">
          {membros.map((membro) => (
            <CardJogador
              key={membro.id}
              jogadorId={membro.id}
              nomeInicial={membro.nome}
              tituloInicial={membro.titulo}
              descricaoInicial={membro.descricao}
              fotoInicial={membro.foto}
              instagramInicial={membro.instagram}
              twitterInicial={membro.twitter}
              twitchInicial={membro.twitch}
              onDelete={handleDelete}
              onEdit={handleEdit} // Passando a função de edição
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Membros;
