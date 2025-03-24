import React, { useState } from "react";
import CardTime from "../components/CardTime";
import { timesData } from "../data/timesData";
import { Link } from "react-router-dom";

const Times = () => {
  const [times, setTimes] = useState(timesData);

  const handleDeleteTime = (timeId) => {
    setTimes(times.filter((time) => time.id !== timeId));
  };

  const handleSaveTime = (updatedTime) => {
    setTimes(
      times.map((time) => (time.id === updatedTime.id ? updatedTime : time))
    );
  };

  return (
    <div className="w-full">
      <div className="flex w-full bg-preto h-60 justify-center items-center">
        <h1 className="font-blinker text-branco font-bold text-3xl">
          Escolha seu time!
        </h1>
      </div>

      <div className="bg-fundo w-full min-h-screen flex justify-center items-center absolute overflow-auto scrollbar-hidden">
        <div className="w-full flex flex-wrap py-16 justify-center gap-8">
          {times.map((time) => (
            <Link
              to={`/times/${time.id}/membros`}
              key={time.id}
              className="...classes do card..."
            >
              <CardTime
                timeId={time.id}
                nome={time.nome}
                foto={time.foto}
                jogo={time.jogo}
                onDelete={handleDeleteTime}
                onSave={handleSaveTime}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Times;
