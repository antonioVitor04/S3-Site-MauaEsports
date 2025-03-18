import React, { useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(<IoMdArrowDropdown />);

  const options = ['Membros', 'Staff'];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="bg-transparent">
      <nav className="py-5 mx-50 flex justify-between text-lg text-white">
        <div>Logo</div>
        <ul className="flex gap-5">
          <li>Sobre</li>
          <li className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              Times {selectedOption}
            </button>
            {isOpen && (
              <ul className="absolute bg-white shadow-lg mt-2 py-2">
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li>Campeonatos</li>
          <li>Novidades</li>
          <li>Horas PAEs</li>
          <li>Login</li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
