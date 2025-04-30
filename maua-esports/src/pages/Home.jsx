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

// Cores exatas conforme solicitado
const colors = {
  fundo: 'oklch(17.63% 0.014 258.36)',
  navbar: 'oklch(10.39% 0.0194 248.34)',
  hover: 'oklch(29.16% 0.0202 260.62)',
  borda: 'oklch(38.37% 0.0179 254.74)',
  texto: 'oklch(90% 0.01 258.36)',
  titulo: 'oklch(95% 0.01 258.36)'
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
    <div className="min-h-screen" style={{ backgroundColor: colors.fundo }}>
      {/* Adiciona os keyframes globalmente */}
      <style>{styles.cascadeKeyframes}</style>
      
      {/* Degradê em cascata com a animação personalizada */}
      <div className="fixed inset-0 overflow-hidden z-[-1]">
        <div 
          className="absolute inset-0"
          style={{
            ...styles.cascadeAnimation,
            background: `linear-gradient(to bottom right, ${colors.fundo}, ${colors.hover})`
          }}
        ></div>
        <div 
          className="absolute inset-0"
          style={{
            ...styles.cascadeAnimation,
            animationDelay: '3000ms',
            background: `linear-gradient(to top left, ${colors.navbar}, ${colors.borda})`
          }}
        ></div>
      </div>

      {/* Hero Section Atualizada com espaço para imagem */}
      <section className="py-20" style={{ background: `linear-gradient(to right, ${colors.navbar}, ${colors.hover})` }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Texto da imagem - lado esquerdo */}
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.titulo }}>Bem Vindo</h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-8" style={{ color: colors.titulo }}>Entidade Mauá Esports</h2>
              
              <div className="text-left space-y-6 mb-8">
                <p className="text-lg" style={{ color: colors.texto }}>
                  MALUA OU DEUS A HOULEGONTE E UMA PEDIDA E SEGUNDA LONGAS DÚVIDAS. MALUÁ SE TOLERARIA QUALQUER PROBLEMA E ADMINISTRARIA OS AUTORES DA EXPERIÊNCIA DE MALUA EM MANTENIR.
                </p>
                
                <p className="text-lg" style={{ color: colors.texto }}>
                  MALUA trabalha bem o momento em que não é aquele que se pode ser muito importante de desenvolver seu processo e profundizar algumas respostas já na medida do mesmo tempo, quando seja assim a economia.
                </p>
                
                <p className="text-lg" style={{ color: colors.texto }}>
                  Compre-se com sujeitos em diversos jogos e pertencimentos ocorridos aqui nos estudantes ainda menos tarde em questões.
                </p>
              </div>
              
              <div className="text-sm mt-8" style={{ 
                borderTop: `1px solid ${colors.borda}`, 
                paddingTop: '1rem',
                color: colors.texto 
              }}>
                <p><strong>Fonte:</strong></p>
                <p>• São disponíveis?</p>
              </div>
            </div>

            {/* Espaço reservado para imagem - lado direito */}
            <div className="md:w-1/3 flex justify-center">
              <div 
                className="w-full h-64 md:h-96 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.navbar }}
              >
                <span style={{ color: colors.texto }}>Espaço para imagem</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção do Twitch - Movida para depois da seção Hero */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.titulo }}>Nosso Canal na Twitch</h2>
        {isLive ? (
          <div className="aspect-w-16 aspect-h-9 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={`https://player.twitch.tv/?channel=${channelName}&parent=localhost`}
              className="w-full h-[480px]"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div 
            className="text-center py-20 rounded-lg max-w-4xl mx-auto"
            style={{ backgroundColor: colors.navbar }}
          >
            <p className="text-xl" style={{ color: colors.texto }}>O canal não está ao vivo no momento.</p>
            <div className="mt-4">
              <a 
                href={`https://twitch.tv/${channelName}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition"
                style={{ 
                  backgroundColor: colors.hover,
                  color: colors.titulo
                }}
              >
                <FaTwitch /> Visitar canal
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Games Carousel */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: colors.titulo }}>Nossos Jogos</h2>
        
        <div className="relative max-w-5xl mx-auto">
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full ml-2"
            style={{ 
              backgroundColor: colors.navbar,
              color: colors.texto
            }}
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
                    <div 
                      className="aspect-video rounded-lg overflow-hidden flex items-center justify-center text-center p-4 transition"
                      style={{ 
                        background: `linear-gradient(to bottom right, ${colors.navbar}, ${colors.borda})`,
                        border: `1px solid ${colors.borda}`
                      }}
                    >
                      <h3 className="text-lg font-medium transition" style={{ color: colors.titulo }}>{game.name}</h3>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full mr-2"
            style={{ 
              backgroundColor: colors.navbar,
              color: colors.texto
            }}
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;