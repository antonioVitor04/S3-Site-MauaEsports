import Margin from "../padrao/Margin";
import Logo from "../../assets/images/Logo.svg";



const Apresentacao = () => {
    return (
        <div className="bg-fundo text-white">
            <Margin horizontal="60px">
                <div className="flex flex-col lg:flex-row justify-center items-center gap-20">

                    {/* Conteúdo textual - lado esquerdo */}
                    <div className="space-y-6 lg:w-1/2 text-left">
                        <h2 className="text-4xl font-bold mb-5">Bem Vindo</h2>
                        <h4 className="text-3xl md:text-4xl font-bold mt-2">
                            <span className="text-white">Entidade</span>{' '}
                            <span className="text-[#2b4586]">Mauá Esports</span>
                        </h4>

                        <p className="text-gray-300 mb-4">
                            Fundada em 2018, a Mauá Esports é uma entidade universitária oficial do Instituto Mauá de Tecnologia dedicada a fomentar a cultura gamer e os esportes eletrônicos dentro do ambiente acadêmico.
                        </p>
                        <p className="text-gray-300 mb-6">
                            Nossa missão é unir estudantes através dos jogos eletrônicos, proporcionando desenvolvimento pessoal e profissional, além de representar a instituição em competições regionais e nacionais.
                        </p>
                        <p className="text-gray-300 mb-6">
                            Contamos com equipes em diversos jogos e promovemos eventos regulares abertos a toda comunidade acadêmica.
                        </p>
                        <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Área da imagem - lado direito */}
                    <div className=" rounded-lg flex items-center justify-center h-85 lg:w-1/2 ">
                        <img src={Logo} alt="Logo Mauá Esports" className="max-w-full h-100" />
                    </div>


                </div>
            </Margin>
        </div>
    );
}

export default Apresentacao;