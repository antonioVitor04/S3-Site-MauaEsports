import FotoJogador from "../assets/images/Foto.svg"
export const jogadoresData = [
    {
      id: "1",
      nome: "Jogador 1",
      titulo: "Iniciante",
      descricao: "Jogador dedicado com foco em melhorar",
      foto: FotoJogador,
      instagram: "https://instagram.com/jogador1",
      twitter: "https://twitter.com/jogador1",
      twitch: "https://twitch.tv/jogador1",
      timeId: 1 // Relaciona com o time
    },
    {
      id: "2",
      nome: "Jogadora 2",
      titulo: "Profissional",
      descricao: "Campeã de vários torneios",
      foto: "/assets/images/jogador2.jpg",
      instagram: "https://instagram.com/jogador2",
      twitter: null, // Pode ser null se não tiver
      twitch: "https://twitch.tv/jogador2",
      timeId: 2
    },
    // Adicione mais jogadores conforme necessário
  ];