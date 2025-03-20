import CardTime from "../components/CardTime";
import { Link } from "react-router-dom";
const Times = () => {
  return (
    <div className="w-full">
      {/* Seção 1 */}
      <div className="flex w-full bg-preto h-60 justify-center items-center">
        <h1 className="font-blinker text-branco font-bold text-3xl">
          Escolha seu time!
        </h1>
      </div>

      {/* Seção 2 */}
      <div className="bg-slate-400 w-full min-h-screen flex justify-center items-center absolute overflow-auto scrollbar-hidden">
        <div className="w-full flex flex-wrap py-16 justify-center gap-8">
          <Link to="/times/membros">
            <CardTime />
          </Link>

          <Link to="/times/membros">
            <CardTime />
          </Link>
          <Link to="/times/membros">
            <CardTime />
          </Link>
          <Link to="/times/membros">
            <CardTime />
          </Link>
          <Link to="/times/membros">
            <CardTime />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Times;
