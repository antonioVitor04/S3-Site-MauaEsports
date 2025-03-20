import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Para navegação
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../contexts/AuthContexts"; // Importando o hook useAuth para acessar o contexto
import LogoutBtn from "./LogoutBtn";
import { CgLogIn } from "react-icons/cg";
import logo from "../assets/images/Logo.svg"; // Importa o arquivo SVG

const NavBar = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false); // Controla o estado do menu hambúrguer
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controla o estado do dropdown
  const [isScrolled, setIsScrolled] = useState(false); // Verifica se a página foi rolada

  // Consumindo o estado de login e as funções do contexto de autenticação
  const { isLoggedIn, fazerLogin, fazerLogout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Controla o dropdown
  const toggleHamburgerMenu = () => setIsHamburgerOpen(!isHamburgerOpen); // Controla o menu hambúrguer

  return (
    <nav
      className={`py-5 fixed w-full flex justify-between items-center text-lg text-white font-blinker transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-preto bg-opacity-70" : "bg-preto lg:bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="mx-8">
        <img className="w-16 h-16" src={logo} alt="Logo" />
      </div>

      {/* Botão do menu hambúrguer (visível em telas pequenas) */}
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
            ? "mx-0 bg-preto flex flex-col w-full absolute top-full left-0 justify-center items-center"
            : "lg:block hidden mx-25"
        }`}
      >
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] 
  border-b-2 ${
    isHamburgerOpen
      ? "border-white"
      : "border-b-transparent hover:border-gray-300"
  }`}
        >
          <Link to="/">Sobre</Link>
        </li>

        <li
          className={`relative px-4 py-2 transition-transform duration-300 hover:translate-y-[-4px] 
  border-b-2 ${
    isHamburgerOpen
      ? "border-white"
      : "border-b-transparent hover:border-gray-300"
  }`}
        >
          <button
            onClick={toggleDropdown}
            className="focus:outline-none flex items-center gap-1 cursor-pointer "
          >
            Times{" "}
            <IoMdArrowDropdown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Dropdown */}
          <ul
            className={`absolute bg-preto shadow-lg py-2 rounded-lg 
    transition-all duration-300 ease-out text-center
    ${
      // Verifica se o dropdown está aberto
      isDropdownOpen
        ? "opacity-100 translate-y-0 visible"
        : "opacity-0 translate-y-[-20px] invisible"
    }  
    ${
      // Verifica se o hambúrguer está aberto, para ocupar 100% de largura
      isHamburgerOpen && isDropdownOpen
        ? "w-full border-t-2 rounded-none mt-4 relative"
        : "mt-12"
    }`}
          >
            <li className="px-4 py-2 border-b-2 relative">
              {/* Esconde a seta quando hambúrguer está aberto */}
              {!isHamburgerOpen && (
                <span className="absolute left-1/2 transform -translate-x-1/2 text-4xl rotate-180 top-[-30px] text-black">
                  <IoMdArrowDropdown />
                </span>
              )}
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Link to="/times">Membros</Link>
              </span>
            </li>
            <li className="px-4 py-2">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 cursor-pointer ">
                <Link to="/staff">Staff</Link>
              </span>
            </li>
          </ul>
        </li>

        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] 
            border-b-2 ${
              isHamburgerOpen
                ? "border-white"
                : "border-b-transparent hover:border-gray-300"
            }`}
        >
          <Link to="/campeonatos">Campeonatos</Link>
        </li>
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] 
    border-b-2 ${
      isHamburgerOpen
        ? "border-white"
        : "border-b-transparent hover:border-gray-300"
    }`}
        >
          <Link to="/novidades">Novidades</Link>
        </li>
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] 
  border-b-2 ${
    isLoggedIn
      ? isHamburgerOpen
        ? "border-white"
        : "border-b-transparent hover:border-gray-300"
      : "hidden"
  }`}
        >
          <Link to="/horas-paes">Horas PAEs</Link>
        </li>
        {/* Exibindo o botão de login, que chama a função de login */}
        <li className="px-4 py-2 cursor-pointer">
          {!isLoggedIn ? (
            <button
              onClick={fazerLogin}
              className="relative flex items-center justify-center px-4 py-2 gap-2 border border-white text-white rounded-md overflow-hidden transition-all duration-300 cursor-pointer 
                       before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-azul-claro
                       before:transition-all before:duration-500 hover:before:w-full"
            >
              <span className="relative z-10 flex items-center gap-2">
                Login <CgLogIn />
              </span>
            </button>
          ) : (
            <LogoutBtn fazerLogout={fazerLogout} />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
