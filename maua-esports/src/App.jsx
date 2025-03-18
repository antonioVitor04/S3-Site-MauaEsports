import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="w-screen h-screen bg-slate-400">
      <NavBar />
      <div className="h-[2000px]">
        {" "}
        {/* Aqui está a altura extra para garantir que há rolagem */}
      </div>
    </div>
  );
}

export default App;
