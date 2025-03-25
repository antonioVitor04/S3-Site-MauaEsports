import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../contexts/AuthContexts";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { RiTeamFill } from "react-icons/ri";
import { FaUserTie, FaRegClock } from "react-icons/fa";
import { HiUserCircle } from "react-icons/hi2";
import logo from "../assets/images/Logo.svg";
import AtualizacaoPerfil from "../pages/AtualizacaoPerfil";

const NavBar = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isClockHovered, setClockIsHovered] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { isLoggedIn, fazerLogin, fazerLogout } = useAuth();

  // Efeito para recuperar a imagem cortada do localStorage ao carregar a NavBar
  useEffect(() => {
    const savedImage = localStorage.getItem("croppedImage");
    if (savedImage) {
      setCroppedImage(savedImage); // Define a imagem cortada no estado
    }
  }, []);

  // const [croppedImage, setCroppedImage] = useState(() => {
  //   // Recupera a imagem salva no localStorage ao inicializar o componente
  //   return localStorage.getItem("croppedImage") || null;
  // });

  // Monitora mudanças no localStorage para atualizar a imagem automaticamente
  useEffect(() => {
    const handleStorageChange = () => {
      const savedImage = localStorage.getItem("croppedImage");
      setCroppedImage(savedImage);
    };

    // Adiciona um listener para o evento 'storage'
    window.addEventListener("storage", handleStorageChange);

    // Remove o listener ao desmontar o componente
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Efeito para detectar scroll da página
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleHamburgerMenu = () => setIsHamburgerOpen(!isHamburgerOpen);

  return (
    <nav
      className={`z-50 py-5 fixed w-full flex justify-between items-center text-lg text-white font-blinker transition-all duration-300 ease-in-out
    ${
      isScrolled
        ? "bg-navbar lg:bg-navbar/60"
        : "bg-transparent lg:bg-transparent"
    } // Fundo condicional baseado no scroll
    md:bg-navbar 
  `}
    >
      {/* Borda animada que aparece ao rolar a página */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
        <div
          className={`absolute left-0 h-full bg-borda transition-all duration-500 ${
            isScrolled ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Logo da aplicação */}
      <div className="mx-14">
        <img className="w-16 h-16" src={logo} alt="Logo" />
      </div>

      {/* Botão do menu hambúrguer (visível apenas em telas pequenas) */}
      <button
        className={`lg:hidden text-white fixed right-5 cursor-pointer transform transition-all duration-300 ${
          isHamburgerOpen ? "rotate-90" : "rotate-0"
        }`}
        onClick={toggleHamburgerMenu}
      >
        {isHamburgerOpen ? (
          <IoMdClose className="text-2xl" />
        ) : (
          <GiHamburgerMenu className="text-2xl" />
        )}
      </button>

      {/* Menu de navegação */}
      <ul
        className={`gap-6 items-center lg:flex ${
          isHamburgerOpen
            ? "mx-0 bg-navbar flex flex-col w-full absolute top-full left-0 justify-center items-center"
            : "lg:block hidden mx-14"
        }`}
      >
        {/* Item "Sobre" */}
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] border-b-3 ${
            isHamburgerOpen
              ? "border-borda"
              : "border-b-transparent hover:border-borda rounded-md"
          }`}
        >
          <Link to="/">Sobre</Link>
        </li>

        {/* Item "Times" com dropdown */}
        <li
          className={`relative px-4 py-2 transition-transform duration-300 hover:translate-y-[-4px] border-b-3 ${
            isHamburgerOpen
              ? "border-borda"
              : "border-b-transparent hover:border-borda rounded-md"
          }`}
        >
          <button
            onClick={toggleDropdown}
            className="focus:outline-none flex items-center gap-1 cursor-pointer"
          >
            Times{" "}
            <IoMdArrowDropdown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Dropdown de times */}
          <ul
            className={`absolute bg-fundo border-2 border-borda shadow-lg rounded-lg transition-all duration-300 ease-out text-center ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 translate-y-[-20px] invisible"
            } ${
              isHamburgerOpen && isDropdownOpen
                ? "w-full border-t-2 rounded-none mt-4 relative right-0"
                : "mt-12 right-[-60px]"
            }`}
          >
            <li className="px-4 py-2 border-b-2 border-borda relative">
              <Link
                to="/times"
                className="px-4 bg-transparent border-transparent inline-flex items-center gap-2 transform hover:scale-110 transition-transform duration-300 cursor-pointer hover:bg-hover hover:border-2 hover:border-borda hover:rounded-md"
              >
                <RiTeamFill />
                Membros
              </Link>
            </li>

            <li className="px-4 py-2">
              <Link
                to="/times"
                className="px-4 bg-transparent border-transparent inline-flex items-center gap-2 transform hover:scale-110 transition-transform duration-300 hover:bg-hover hover:border-2 hover:border-borda hover:rounded-md cursor-pointer"
              >
                <FaUserTie />
                Administradores
              </Link>
            </li>
          </ul>
        </li>

        {/* Item "Campeonatos" */}
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] border-b-3 ${
            isHamburgerOpen
              ? "border-borda"
              : "border-b-transparent hover:border-borda rounded-md"
          }`}
        >
          <Link to="/campeonatos">Campeonatos</Link>
        </li>

        {/* Item "Novidades" */}
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] border-b-3 ${
            isHamburgerOpen
              ? "border-borda"
              : "border-b-transparent hover:border-borda rounded-md"
          }`}
        >
          <Link to="/novidades">Novidades</Link>
        </li>

        {/* Ícone do usuário e dropdown do perfil */}
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] ${
            !isLoggedIn ? "hidden" : "block"
          } relative`}
        >
          <button
            onClick={toggleProfileDropdown}
            className="flex justify-center items-center border-2 rounded-full border-borda w-10 h-10 cursor-pointer"
          >
            {croppedImage ? ( // Exibe a imagem cortada se existir
              <img
                src={croppedImage}
                alt="Foto de Perfil"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <HiUserCircle className="w-full h-full" /> // Exibe o ícone padrão se não houver imagem cortada
            )}
          </button>

          {/* Dropdown do perfil */}
          <ul
            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out text-center ${
              isProfileDropdownOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 translate-y-[-20px] invisible"
            } ${
              isHamburgerOpen && isProfileDropdownOpen
                ? "w-full border-t-2 rounded-none mt-24"
                : "mt-12"
            }`}
          >
            <div className="bg-fundo w-70 h-90 border-2 border-borda shadow-azul-claro shadow-sm rounded-lg flex flex-col">
              {/* Cabeçalho com ícone, nome e email */}
              <div className="w-full h-20 flex border-b-2 border-borda items-center p-4 gap-3">
                <AtualizacaoPerfil />
                <div className="flex flex-col flex-grow items-start overflow-hidden">
                  <h1 className="font-bold">Usuário</h1>
                  <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    24.01402-8@maua.br
                  </p>
                </div>
              </div>

              {/* Opções do menu */}
              <div className="flex-grow">
                <div
                  className="w-full p-2 cursor-pointer flex items-center gap-3 hover:bg-hover group"
                  onMouseEnter={() => setClockIsHovered(true)}
                  onMouseLeave={() => setClockIsHovered(false)}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <FaRegClock
                      className="text-2xl text-azul-claro"
                      style={{
                        animation: isClockHovered
                          ? "rodar 0.7s ease-in-out "
                          : "none", // Aplica a animação apenas no hover
                      }}
                    />
                    {/* Ícone de relógio */}
                  </div>
                  <div className="flex flex-col flex-grow items-start overflow-hidden">
                    <h1 className="font-bold">Horas PAEs</h1>
                    <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      Consulte suas horas PAEs
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Sair da conta */}
              <button
                className="w-full border-t-2 border-borda p-2 mt-auto text-vermelho-claro flex items-center gap-2 cursor-pointer hover:bg-hover"
                onClick={fazerLogout}
              >
                <CgLogOut className="text-2xl" />
                <span>Sair da conta</span>
              </button>
            </div>
          </ul>
        </li>

        {/* Botão de Login (exibido apenas se o usuário não estiver logado) */}
        <li className="px-4 py-2 cursor-pointer">
          {!isLoggedIn && (
            <button
              onClick={fazerLogin}
              className="relative flex items-center justify-center px-4 py-2 gap-2 border-2 border-borda text-white rounded-md overflow-hidden transition-all duration-300 cursor-pointer before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-azul-claro before:transition-all before:duration-500 hover:before:w-full"
            >
              <span className="relative z-10 flex items-center gap-2">
                Login <CgLogIn />
              </span>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
