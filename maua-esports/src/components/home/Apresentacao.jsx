import Margin from "../padrao/Margin";

const Apresentacao = () => {
    return (
        <div className="bg-fundo text-white">
            <Margin horizontal="60px">
                <div className="flex flex-col lg:flex-row justify-center items-center gap-20">

                    {/* Conteúdo textual - lado esquerdo */}
                    <div className="space-y-6 lg:w-1/2 text-left">
                        <h1 className="text-5xl font-bold mb-6">Bem Vindo</h1>
                        <h2 className="text-3xl font-semibold mb-6">Entidade Mauá Esports</h2>
                        <p className="text-gray-300 mb-4">
                            Compre-se com sujeitos em diversos jogos e pertencimentos ocorridos aqui nos
                            estudantes ainda menos tarde em questões.
                        </p>
                        <p className="text-gray-300 mb-6">
                            MALUA trabalha bem o momento em que não é aquele que se pode ser muito importante
                            de desenvolver seu processo e profundizar algumas respostas já na medida do mesmo
                            tempo, quando seja assim a economia.
                        </p>
                        <p className="text-gray-300 mb-6">
                            Compre-se com sujeitos em diversos jogos e pertencimentos ocorridos aqui nos
                            estudantes ainda menos tarde em questões.
                        </p>
                        <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Área da imagem - lado direito */}
                    <div className="bg-gray-800 rounded-lg flex items-center justify-center h-85 lg:w-1/2">
                        <p className="text-gray-400">Espaço para imagem</p>
                    </div>

                </div>
            </Margin>
        </div>
    );
}

export default Apresentacao;