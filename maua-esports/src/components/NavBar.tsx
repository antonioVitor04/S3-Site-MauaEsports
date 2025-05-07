import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { RiTeamFill } from "react-icons/ri";
import { FaUserTie, FaRegClock, FaUserCog } from "react-icons/fa";
import { HiUserCircle } from "react-icons/hi2";
import logo from "../assets/images/Logo.svg";
import { GiSwordsEmblem } from "react-icons/gi";
import AtualizacaoPerfil from "./AtualizacaoPerfil";
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import AlertaOk from './AlertaOk';  // Importe os componentes de alerta
import AlertaErro from './AlertaErro';

const NavBar = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isClockHovered, setClockIsHovered] = useState(false);
  const [isSwordHovered, setSwordHovered] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");  // Estado para sucesso
  const [errorMessage, setErrorMessage] = useState("");  // Estado para erro


  useEffect(() => {
    const savedImage = localStorage.getItem("croppedImage");
    if (savedImage) {
      setCroppedImage(savedImage);
    }
  }, []);

  useEffect(() => {
    const account = instance.getActiveAccount();
    setIsAuthenticated(!!account);
  }, [instance]);

  useEffect(() => {
    try {
      const accounts = instance.getAllAccounts();
      if (accounts && accounts.length > 0) {
        instance.setActiveAccount(accounts[0]);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("MSAL ainda não está inicializado:", e);
      setIsAuthenticated(false);
    }
  }, [instance]);

  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === "msal:loginSuccess") {
        const account = event.payload.account;
        instance.setActiveAccount(account);
        setIsAuthenticated(true);
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);
  

  const handleLogin = async () => {
    try {
      // 1. Realiza o login com Azure AD
      const authResult = await instance.loginPopup(loginRequest);
      const account = authResult.account;
      instance.setActiveAccount(account);
  
      // 2. Verifica se o email existe no seu sistema
      const response = await fetch(`http://localhost:3000/usuarios/verificar-email?email=${encodeURIComponent(account.username)}`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar email');
      }
  
      const data = await response.json();
  
      // 3. Trata os possíveis cenários de resposta
      if (!data.success) {
        if (data.message === 'Usuário não encontrado') {
          await instance.logoutPopup();
          alert('Seu email não está cadastrado no sistema. Contate um administrador.');
        } else {
          alert(`Erro: ${data.message}`);
        }
        setIsAuthenticated(false); // Garante que o botão de login volte
        return;
      }
  
      // 4. Se tudo estiver ok, autentica o usuário
      setIsAuthenticated(true);
      setSuccessMessage(`Bem vindo à Mauá Esports!`);
      
    } catch (error) {
      console.error("Erro no login:", error);
      // Garante que o usuário seja deslogado em caso de erro
      await instance.logoutPopup().catch(e => console.error("Erro ao deslogar:", e));
      setIsAuthenticated(false); // Garante que o botão de login volte
      setErrorMessage('Ocorreu um erro durante o login. Por favor, tente novamente.');
    }
  };

  const handleLogout = () => {
    instance.logoutRedirect().catch(e => {
      console.error("Erro no logout:", e);
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const savedImage = localStorage.getItem("croppedImage");
      setCroppedImage(savedImage);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleHamburgerMenu = () => setIsHamburgerOpen(!isHamburgerOpen);

  const isActive = (path) => location.pathname === path;

  const activeAccount = instance.getActiveAccount();

  return (
    <nav
      className={`z-50 py-5 fixed w-full flex justify-between items-center text-lg text-white font-blinker transition-all duration-300 ease-in-out border-b-1 border-borda
        ${
          isScrolled
            ? "bg-navbar lg:bg-navbar/97"
            : "bg-transparent lg:bg-transparent"
        }
        md:bg-navbar 
      `}
    >
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-transparent">
        <div
          className={`absolute left-0 h-full bg-borda transition-all duration-500 ${
            isScrolled ? "w-full" : "w-0"
          }`}
        />
      </div>

      <div className="mx-14">
        <img className="w-16 h-16" src={logo} alt="Logo" />
      </div>
      {successMessage && <AlertaOk mensagem={successMessage} />}
      {errorMessage && <AlertaErro mensagem={errorMessage} />}
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

      <ul
        className={`gap-6 items-center lg:flex ${
          isHamburgerOpen
            ? "mx-0 bg-navbar flex flex-col w-full absolute top-full left-0 justify-center items-center"
            : "lg:block hidden mx-14"
        }`}
      >
        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] border-b-3 ${
            isHamburgerOpen
              ? `border-borda ${isActive("/") ? "text-azul-claro font-bold" : ""}`
              : `border-b-transparent hover:text-azul-claro hover:font-bold ${
                  isActive("/") ? "text-azul-claro font-bold" : ""
                }`
          }`}
        >
          <Link to="/">Home</Link>
        </li>

        <li className="relative px-4 py-2 transition-transform duration-300 hover:translate-y-[-4px] border-b-3 border-b-transparent">
          <button
            onClick={toggleDropdown}
            className="focus:outline-none flex items-center gap-1 cursor-pointer hover:text-azul-claro hover:font-bold"
          >
            Times{" "}
            <IoMdArrowDropdown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

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
                className={`px-4 border-transparent inline-flex items-center gap-2 transform hover:scale-110 transition-transform duration-300 cursor-pointer ${
                  isActive("/times") ? "text-azul-claro font-bold" : "hover:text-azul-claro hover:font-bold"
                }`}
              >
                <RiTeamFill />
                Membros
              </Link>
            </li>

            <li className="px-4 py-2">
              <Link
                to="/admins"
                className={`px-4 border-transparent inline-flex items-center gap-2 transform hover:scale-110 transition-transform duration-300 cursor-pointer ${
                  isActive("/admins") ? "text-azul-claro font-bold" : "hover:text-azul-claro hover:font-bold"
                }`}
              >
                <FaUserTie />
                Administradores
              </Link>
            </li>
          </ul>
        </li>

        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] border-b-3 ${
            isHamburgerOpen
              ? `border-borda ${isActive("/campeonatos") ? "text-azul-claro font-bold" : ""}`
              : `border-b-transparent hover:text-azul-claro hover:font-bold ${
                  isActive("/campeonatos") ? "text-azul-claro" : ""
                }`
          }`}
        >
          <Link to="/campeonatos">Campeonatos</Link>
        </li>

        <li
          className={`px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] border-b-3 ${
            isHamburgerOpen
              ? `border-borda ${isActive("/novidades") ? "text-azul-claro font-bold" : ""}`
              : `border-b-transparent hover:text-azul-claro hover:font-bold ${
                  isActive("/novidades") ? "text-azul-claro" : ""
                }`
          }`}
        >
          <Link to="/novidades">Novidades</Link>
        </li>

        {isAuthenticated && (
          <li className="px-4 py-2 cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex justify-center items-center border-2 rounded-full border-borda w-10 h-10 cursor-pointer"
            >
              {croppedImage ? (
                <img
                  src={croppedImage}
                  alt="Foto de Perfil"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <HiUserCircle className="w-full h-full" />
              )}
            </button>

            <ul
              className={`transition-all duration-300 ease-out text-center ${
                isProfileDropdownOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 translate-y-[-20px] invisible"
              } ${
                isHamburgerOpen
                  ? "fixed left-1/2 transform -translate-x-1/2 w-[90%] max-w-[300px] mt-4"
                  : "absolute left-1/2 transform -translate-x-1/2 mt-12"
              }`}
            >
              <div className="bg-fundo w-full border-2 border-borda shadow-azul-escuro shadow-sm rounded-lg flex flex-col">
                <div className="w-full h-20 flex border-b-2 border-borda items-center p-4 gap-3">
                  <AtualizacaoPerfil />
                  <div className="flex flex-col flex-grow items-start overflow-hidden">
                    <h1 className="font-bold">{activeAccount?.name || 'Usuário'}</h1>
                    <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {activeAccount?.username || 'Email não disponível'}
                    </p>
                  </div>
                </div>

                <div className="flex-grow pb-10 items-left">
                  <Link to="/treinos-admin" className="w-full">
                    <div
                      className="w-full p-2 cursor-pointer flex items-center gap-3 hover:bg-hover group pr-10"
                      onMouseEnter={() => setSwordHovered(true)}
                      onMouseLeave={() => setSwordHovered(false)}
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        <GiSwordsEmblem
                          className="text-2xl text-azul-claro"
                          style={{
                            animation: isSwordHovered
                              ? "shake 0.7s ease-in-out "
                              : "none",
                          }}
                        />
                      </div>
                      <div className="flex flex-col flex-grow items-start overflow-hidden">
                        <h1 className="font-bold">Treinos</h1>
                        <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                          Consulte seus treinos
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link to="/horas-pae" className="w-full">
                    <div
                      className="w-full p-2 cursor-pointer flex items-center gap-3 hover:bg-hover group pr-10"
                      onMouseEnter={() => setClockIsHovered(true)}
                      onMouseLeave={() => setClockIsHovered(false)}
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        <FaRegClock
                          className="text-2xl text-azul-claro"
                          style={{
                            animation: isClockHovered
                              ? "rodar 0.7s ease-in-out "
                              : "none",
                          }}
                        />
                      </div>
                      <div className="flex flex-col flex-grow items-start overflow-hidden">
                        <h1 className="font-bold">Horas PAEs</h1>
                        <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                          Consulte suas horas PAEs
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link to="/admin-usuarios" className="w-full">
                    <div className="w-full p-2 cursor-pointer flex items-center gap-3 hover:bg-hover group pr-10">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <FaUserCog className="text-2xl text-azul-claro" />
                      </div>
                      <div className="flex flex-col flex-grow items-start overflow-hidden">
                        <h1 className="font-bold">Área Administrativa</h1>
                        <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                          Gerenciar usuários
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col">
                  <button
                    className="w-full border-t-2 border-borda p-2 mt-auto text-vermelho-claro flex items-center gap-2 cursor-pointer hover:bg-hover pl-4"
                    onClick={handleLogout}
                  >
                    <CgLogOut className="text-2xl" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              </div>
            </ul>
          </li>
        )}

        <li className="px-4 py-2 cursor-pointer">
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="relative flex items-center justify-center px-4 py-2 gap-2 border-2 border-borda text-white rounded-md overflow-hidden transition-all duration-300 cursor-pointer before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-azul-claro before:transition-all before:duration-500 hover:before:w-full"
            >
              <span className="relative z-10 flex items-center gap-2">
                Login <CgLogIn />
              </span>
            </button>
          ) : null}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;