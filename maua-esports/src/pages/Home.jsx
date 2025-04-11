import { useEffect, useState } from "react";

const Home = () => {
  const [isLive, setIsLive] = useState(false);
  const channelName = "apolityyyy"; // substituir pelo da maua esports

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:3002/twitch/live/${channelName}`
        );
        const data = await res.json();
        setIsLive(data.live);
      } catch (err) {
        console.error("Erro ao verificar se está ao vivo:", err);
      }
    };

    checkLiveStatus();
  }, []);

  return (
    <div className="w-screen h-screen bg-fundo">
      <div className="h-[2000px] bg-fundo flex flex-col items-center justify-start p-4">
        {isLive ? (
          <div className="aspect-w-16 aspect-h-9 w-full max-w-[800px]">
            <iframe
              src={`https://player.twitch.tv/?channel=${channelName}&parent=localhost`}
              frameBorder="0"
              allowFullScreen={true}
              scrolling="no"
              height="480"
              width="800"
            ></iframe>
          </div>
        ) : (
          <p className="text-white text-xl mt-10">
            O canal não está ao vivo no momento.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
