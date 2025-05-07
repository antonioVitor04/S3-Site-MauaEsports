import React from 'react';
import { FaTimes } from 'react-icons/fa';
import SalvarBtn from './SalvarBtn';
import CancelarBtn from './CancelarBtn';

const ModalUsuario = ({
  usuario,
  onSave,
  onClose,
  modoEdicao,
  currentUserEmail,
  podeAdicionarTipo
}) => {
  const [formData, setFormData] = React.useState({
    email: usuario?.email || '',
    discordID: usuario?.discordID || '',
    tipoUsuario: usuario?.tipoUsuario || 'Jogador'
  });

  const [erro, setErro] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    if (!formData.email.endsWith('@maua.br')) {
      setErro('O email deve ser institucional (@maua.br)');
      return false;
    }

    if (formData.discordID && !/^\d{18}$/.test(formData.discordID)) {
      setErro('O Discord ID deve ter exatamente 18 dígitos');
      return false;
    }

    // Verifica permissão para o tipo selecionado
    if (!modoEdicao && !podeAdicionarTipo(formData.tipoUsuario)) {
      setErro('Você não tem permissão para criar este tipo de usuário');
      return false;
    }

    setErro('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/80">
      <div className="bg-fundo p-6 rounded-lg shadow-sm shadow-azul-claro w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-branco">
            {modoEdicao ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="text-fonte-escura hover:text-vermelho-claro hover:cursor-pointer"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {erro && (
          <div className="mb-4 p-2 bg-vermelho-claro/20 text-vermelho-claro rounded text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-fonte-escura font-semibold mb-1">
              Email Institucional <span className="text-vermelho-claro">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={modoEdicao}
              className="w-full border border-borda rounded p-2 text-branco bg-preto focus:border-azul-claro focus:outline-none"
              placeholder="exemplo@maua.br"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-fonte-escura font-semibold mb-1">
              Discord ID
            </label>
            <input
              type="text"
              name="discordID"
              value={formData.discordID}
              onChange={handleChange}
              className="w-full border border-borda rounded p-2 text-branco bg-preto focus:border-azul-claro focus:outline-none"
              placeholder="123456789012345678"
              pattern="\d{18}|^$"
            />
            <p className="text-xs text-fonte-escura/50 mt-1">
              Deve conter exatamente 18 dígitos
            </p>
          </div>

          <div>
            <label className="block text-sm text-fonte-escura font-semibold mb-1">
              Tipo de Usuário <span className="text-vermelho-claro">*</span>
            </label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              className="w-full border border-borda rounded p-2 text-branco bg-preto focus:border-azul-claro focus:outline-none"
              disabled={modoEdicao && usuario?.tipoUsuario === 'Administrador Geral'}
              required
            >
              <option value="Jogador">Jogador</option>
              <option value="Capitão de time">Capitão de time</option>
              <option value="Administrador">Administrador</option>
              {!modoEdicao && podeAdicionarTipo('Administrador Geral') && (
                <option value="Administrador Geral">Administrador Geral</option>
              )}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <SalvarBtn type="submit" label={modoEdicao ? 'Salvar' : 'Adicionar'} />
            <CancelarBtn onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;