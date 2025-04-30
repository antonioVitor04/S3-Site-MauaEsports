import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaMedal, FaChevronLeft, FaChevronRight, FaInstagram, FaDiscord, FaTwitch, FaYoutube } from 'react-icons/fa';
import { CiLogin } from "react-icons/ci";
import { IoGameController } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";

// Estilos CSS-in-JS para o efeito cascade
const styles = {
  cascadeAnimation: {
    animation: 'cascade 15s ease-in-out infinite',
  },
  cascadeKeyframes: `
    @keyframes cascade {
      0%, 100% { transform: scale(1.2) rotate(3deg); }
      50% { transform: scale(1.5) rotate(-3deg); }
    }
  `
};

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const channelName = "apolityyyy";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const games = [
    { name: "Counter Strike 2", url: "https://www.counter-strike.net/" },
    { name: "Rainbow Six Siege", url: "https://www.ubisoft.com/en-us/game/rainbow-six/siege" },
    { name: "Rocket League", url: "https://www.rocketleague.com/" },
    { name: "EA FC 25", url: "https://www.ea.com/games/ea-sports-fc/fc-25" },
    { name: "League of Legends", url: "https://www.leagueoflegends.com/" },
    { name: "Valorant", url: "https://playvalorant.com/" },
    { name: "Team Fight Tactics", url: "https://teamfighttactics.leagueoflegends.com/" }
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === games.length - 3 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? games.length - 3 : prev - 1));
  };

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const res = await fetch(`http://localhost:3002/twitch/live/${channelName}`);
        const data = await res.json();
        setIsLive(data.live);
      } catch (err) {
        console.error("Erro ao verificar se está ao vivo:", err);
      }
    };

    checkLiveStatus();
    
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Adiciona os keyframes globalmente */}
      <style>{styles.cascadeKeyframes}</style>
      
      {/* Degradê em cascata com a animação personalizada */}
      <div className="fixed inset-0 overflow-hidden z-[-1]">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-800/70 to-teal-700/60"
          style={styles.cascadeAnimation}
        ></div>
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-pink-900/60 via-indigo-800/50 to-cyan-700/40"
          style={{...styles.cascadeAnimation, animationDelay: '3000ms'}}
        ></div>
      </div>

      {/* Seção do Twitch */}
      <section className="py-12 container mx-auto px-4">
        {isLive ? (
          <div className="aspect-w-16 aspect-h-9 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={`https://player.twitch.tv/?channel=${channelName}&parent=localhost`}
              className="w-full h-[480px]"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800/50 rounded-lg max-w-4xl mx-auto">
            <p className="text-xl">O canal não está ao vivo no momento.</p>
          </div>
        )}
      </section>

      {/* Hero Section Atualizada com espaço para imagem */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/40 to-purple-900/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Texto da imagem - lado esquerdo */}
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Bem Vindo</h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-8">Entidade Mauá Esports</h2>
              
              <div className="text-left space-y-6 mb-8">
                <p className="text-lg">
                  MALUA OU DEUS A HOULEGONTE E UMA PEDIDA E SEGUNDA LONGAS DÚVIDAS. MALUÁ SE TOLERARIA QUALQUER PROBLEMA E ADMINISTRARIA OS AUTORES DA EXPERIÊNCIA DE MALUA EM MANTENIR.
                </p>
                
                <p className="text-lg">
                  MALUA trabalha bem o momento em que não é aquele que se pode ser muito importante de desenvolver seu processo e profundizar algumas respostas já na medida do mesmo tempo, quando seja assim a economia.
                </p>
                
                <p className="text-lg">
                  Compre-se com sujeitos em diversos jogos e pertencimentos ocorridos aqui nos estudantes ainda menos tarde em questões.
                </p>
              </div>
              
              <div className="text-sm text-gray-300 mt-8 border-t border-gray-700 pt-4">
                <p><strong>Fonte:</strong></p>
                <p>• São disponíveis?</p>
              </div>
            </div>

            {/* Espaço reservado para imagem - lado direito */}
            <div className="md:w-1/3 flex justify-center">
              <div className="w-full h-64 md:h-96 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Espaço para imagem</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Carousel */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Jogos</h2>
        
        <div className="relative max-w-5xl mx-auto">
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/80 p-3 rounded-full ml-2"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
            >
              {games.map((game, index) => (
                <div key={index} className="flex-shrink-0 w-1/3 px-2">
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-lg overflow-hidden flex items-center justify-center text-center p-4 hover:from-indigo-800/60 hover:to-purple-800/60 transition">
                      <h3 className="text-lg font-medium group-hover:text-indigo-300 transition">{game.name}</h3>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/80 p-3 rounded-full mr-2"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;