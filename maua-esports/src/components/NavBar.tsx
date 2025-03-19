import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Para navegação
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../contexts/AuthContexts"; // Importando o hook useAuth para acessar o contexto
import LogoutBtn from "./LogoutBtn";
import LoginBtn from "./LoginBtn";

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
      <div className="mx-8">Logo</div>

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
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] hover:bg-gray-500/20 hover:rounded-md${
            isHamburgerOpen ? "border-b border-white" : ""
          }`}
        >
          <Link to="/">Sobre</Link>
        </li>
        <li
          className={`relative px-4 py-2 transition-transform duration-300 hover:translate-y-[-4px] hover:bg-gray-500/20 hover:rounded-md${
            isHamburgerOpen ? "border-b border-white" : ""
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

          {/* Dropdown com animação de fade e slide */}
          <ul
            className={`absolute bg-preto shadow-lg mt-2 py-2 rounded-lg 
            transition-all duration-300 ease-out ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 block"
                : "opacity-0 translate-y-[-20px] hidden"
            }`}
          >
            <li className="px-4 py-2 border-b-2">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Link to="/times">Membros</Link>
              </span>
            </li>
            <li className="px-4 py-2">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Link to="/staff">Staff</Link>
              </span>
            </li>
          </ul>
        </li>

        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] hover:bg-gray-500/20 hover:rounded-md${
            isHamburgerOpen ? "border-b border-white" : ""
          }`}
        >
          <Link to="/campeonatos">Campeonatos</Link>
        </li>
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] hover:bg-gray-500/20 hover:rounded-md${
            isHamburgerOpen ? "border-b border-white" : ""
          }`}
        >
          <Link to="/novidades">Novidades</Link>
        </li>
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] ${
            isLoggedIn
              ? isHamburgerOpen
                ? "block border-b border-white"
                : "block"
              : "hidden"
          }`}
        >
          <Link to="/horas-paes">Horas PAEs</Link>
        </li>
        {/* Exibindo o botão de login, que chama a função de login */}
        <li className="px-4 py-2 cursor-pointer">
          {!isLoggedIn ? (
            <LoginBtn fazerLogin={fazerLogin} />
          ) : (
            <LogoutBtn fazerLogout={fazerLogout} />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
