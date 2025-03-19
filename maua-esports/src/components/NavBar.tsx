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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  const fazerLogout = () =>{
    setIsLoggedIn(false);
  }
  return (
    <nav
      className={`py-5 fixed w-full flex justify-between items-center text-lg text-white font-blinker transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-azul-escuro bg-opacity-70 " : "lg:bg-transparent md:bg-azul-escuro"
      }`}
    >
      {/* Logo */}
      <div className="mx-8">Logo</div>

      {/* Botão do menu hambúrguer (visível em telas pequenas) */}
      <button
  className={`lg:hidden text-white fixed right-5 cursor-pointer transform transition-all duration-300 ${isHamburgerOpen ? 'rotate-90' : 'rotate-0'}`}
  onClick={toggleHamburgerMenu}
>
  {isHamburgerOpen ? (
    <IoMdClose  className="text-2xl" />
  ) : (
    <GiHamburgerMenu className="text-2xl" />
  )}
</button>

      {/* Menu de navegação */}
      <ul
        className={`gap-6 items-center lg:flex  ${
          isHamburgerOpen
            ? "mx-0 bg-azul-escuro flex flex-col w-full absolute top-full left-0 justify-center items-center"
            : "lg:block hidden mx-25"
        }`}
      >
        <li className="px-4 py-2 cursor-pointer">Sobre</li>
        <li className="relative px-4 py-2">
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
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-[-20px]"
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

        <li className="px-4 py-2 cursor-pointer">Campeonatos</li>
        <li className="px-4 py-2 cursor-pointer">Novidades</li>
        <li className="px-4 py-2 cursor-pointer">Horas PAEs</li>
        {/* Exibindo o botão de login, que agora pode chamar a função de login */}
        <li className="px-4 py-2 cursor-pointer" >
          {!isLoggedIn ? (
            <LoginBtn fazerLogin={fazerLogin} />
          ) : (
            <LogoutBtn fazerLogout={fazerLogout} /> // Mostra o botão de logout quando o usuário está logado
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
