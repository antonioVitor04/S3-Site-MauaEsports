import ImagemValorant from "../assets/images/valorant.jpg"; // Importando a imagem
import ImagemCS2 from "../assets/images/cs2.jpg";
import logoValorant from "../assets/images/logoValorant.svg";
import logoCS2 from "../assets/images/logoCS2.svg";

export const timesData = [
  {
    id: 1,
    nome: "VALORANT Blue",
    foto: ImagemValorant,
    jogo: logoValorant,
    rota: "/times/valorant-masculino",
  },
  {
    id: 2,
    nome: "VALORANT Purple",
    foto: ImagemValorant,
    jogo: logoValorant,
    rota: "/times/valorant-inclusivo",
  },
  {
    id: 3,
    nome: "VALORANT White",
    foto: ImagemValorant,
    jogo: logoValorant,
    rota: "/times/valorant-feminino",
  },
  {
    id: 4,
    nome: "Counter Strike 2",
    foto: ImagemCS2,
    jogo: logoCS2,
    rota: "/times/cs2",
  },
];
