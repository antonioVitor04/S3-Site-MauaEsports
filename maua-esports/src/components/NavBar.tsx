import React, { useState, useEffect } from "react";
import { IoLogoSteam, IoMdArrowDropdown } from "react-icons/io";
import LoginBtn from "./LoginBtn";
import { GiHamburgerMenu } from "react-icons/gi";
import LogoutBtn from "./LogoutBtn";
import { IoMdClose } from "react-icons/io";

const NavBar = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false); // Controla o estado do menu hambúrguer
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controla o estado do dropdown
  const [isScrolled, setIsScrolled] = useState(false); // Verifica se a página foi rolada
  const [isLoggedIn, setIsLoggedIn] = useState(false); // monitora o estado pra ver se usuario esta logado

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Controla o dropdown
  const toggleHamburgerMenu = () => setIsHamburgerOpen(!isHamburgerOpen); // Controla o menu hambúrguer
  const fazerLogin = () => {
    setIsLoggedIn(true); // Altera o estado de login
  };
  const fazerLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <nav
      className={`py-5 fixed w-full flex justify-between items-center text-lg text-white font-blinker transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-azul-escuro bg-opacity-70"
          : "bg-azul-escuro lg:bg-transparent"
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
            ? "mx-0 bg-azul-escuro flex flex-col w-full absolute top-full left-0 justify-center items-center"
            : "lg:block hidden mx-25"
        }`}
      >
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] ${
            isHamburgerOpen ? "border-b border-white" : ""
          }`}
        >
          Sobre
        </li>
        <li
          className={`relative px-4 py-2 transition-transform duration-300 hover:translate-y-[-4px] ${
            isHamburgerOpen ? "border-b border-white" : ""
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

          {/* Dropdown com animação de fade e slide */}
          <ul
            className={`absolute bg-azul-claro shadow-lg mt-2 py-2 rounded-lg 
      transition-all duration-300 ease-out 
      ${
        isDropdownOpen
          ? "opacity-100 translate-y-0 block" // se dropdown estiver aberto ele mostra e define display
          : "opacity-0 translate-y-[-20px] hidden" // se estiver fechado display none
      }
    `}
          >
            <li className="px-4 py-2 border-b-2">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                Membros
              </span>
            </li>
            <li className="px-4 py-2">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                Staff
              </span>
            </li>
          </ul>
        </li>

        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] ${
            isHamburgerOpen ? "border-b border-white" : ""
          }`}
        >
          Campeonatos
        </li>
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] ${
            isHamburgerOpen ? "border-b border-white" : ""
          }`}
        >
          Novidades
        </li>
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] ${
            isLoggedIn
              ? isHamburgerOpen
                ? "block border-b border-white" // Se o menu hambúrguer estiver aberto e usuario logado, aplica a borda
                : "block" // Se o usuário estiver logado, mas o menu hambúrguer não está aberto ele aparece sem a borda (dispositivos maiores)
              : "hidden" // Se o usuário não estiver logado, o item fica escondido
          }`}
        >
          Horas PAEs
        </li>
        {/* Exibindo o botão de login, que agora pode chamar a função de login */}
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
