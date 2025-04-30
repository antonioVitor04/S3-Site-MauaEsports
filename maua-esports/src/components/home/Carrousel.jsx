import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  // Imagens de exemplo (usando placeholders)
  const images = [
    { id: 1, src: "/api/placeholder/800/400", alt: "Imagem 1" },
    { id: 2, src: "/api/placeholder/800/400", alt: "Imagem 2" },
    { id: 3, src: "/api/placeholder/800/400", alt: "Imagem 3" },
    { id: 4, src: "/api/placeholder/800/400", alt: "Imagem 4" },
    { id: 5, src: "/api/placeholder/800/400", alt: "Imagem 5" },
    { id: 6, src: "/api/placeholder/800/400", alt: "Imagem 6" },
    { id: 7, src: "/api/placeholder/800/400", alt: "Imagem 7" },
    { id: 8, src: "/api/placeholder/800/400", alt: "Imagem 8" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para navegar para a próxima imagem
  const next = () => {
    const maxIndex = Math.max(0, images.length - 4);
    setCurrentIndex(prevIndex => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  // Função para navegar para a imagem anterior
  const prev = () => {
    const maxIndex = Math.max(0, images.length - 4);
    setCurrentIndex(prevIndex => 
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  // Exibir apenas 4 imagens de cada vez
  const visibleImages = images.slice(currentIndex, currentIndex + 4);

  return (
    <div className="relative w-full max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Parcerias</h2>
      
      <div className="relative overflow-hidden">
        {/* Botão para voltar */}
        <button 
          onClick={prev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {/* Container das imagens */}
        <div className="flex gap-4 transition-transform duration-300 px-10">
          {visibleImages.map(image => (
            <div 
              key={image.id} 
              className="w-1/4 flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover" 
              />
              <div className="p-2 bg-gray-100">
                <p className="text-center font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botão para avançar */}
        <button 
          onClick={next}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full z-10 hover:bg-opacity-75 transition-all"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Indicador de páginas */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: Math.ceil(images.length / 4) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * 4)}
            className={`w-3 h-3 rounded-full ${
              Math.floor(currentIndex / 4) === index ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label={`Ir para grupo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;