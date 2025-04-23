import React, { useState, useEffect } from "react";
import axios from "axios";
import Agendamento from "../components/Agendamento";
import { MdChevronRight, MdChevronLeft, MdClear } from "react-icons/md";

const TreinosAdmin = () => {
  // Estados principais
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [modalidades, setModalidades] = useState({});
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");
  const [todosTreinos, setTodosTreinos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroDataAtivo, setFiltroDataAtivo] = useState(false);
  const [novoTreino, setNovoTreino] = useState({
    horario: '',
    modalidade: ''
  });

  // Buscar modalidades
  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const response = await axios.get('/api/modality/all', {
          headers: { "Authorization": "Bearer frontendmauaesports" }
        });
        setModalidades(response.data);
      } catch (error) {
        console.error("Erro ao buscar modalidades:", error);
      }
    };
    fetchModalidades();
  }, []);

  // Buscar e formatar treinos
  useEffect(() => {
    const fetchTreinos = async () => {
      if (Object.keys(modalidades).length === 0) return;

      try {
        const response = await axios.get('/api/trains/all', {
          headers: { "Authorization": "Bearer frontendmauaesports" }
        });

        const treinosFormatados = response.data.map(treino => {
          const modalidade = modalidades[treino.ModalityId];
          return {
            id: treino._id,
            horario: treino.StartTimestamp
              ? new Date(treino.StartTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '--:--',
            data: new Date(treino.StartTimestamp),
            status: treino.Status === "ENDED" ? "realizado" : "agendado",
            ModalityId: treino.ModalityId,
            NomeModalidade: modalidade?.Name || "Desconhecido"
          };
        });

        setTodosTreinos(treinosFormatados);
        setAgendamentos(treinosFormatados);
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchTreinos();
  }, [modalidades]);

  // Aplicar filtros
  useEffect(() => {
    let treinosFiltrados = [...todosTreinos];

    // Filtro por modalidade
    if (modalidadeSelecionada) {
      treinosFiltrados = treinosFiltrados.filter(treino => 
        treino.ModalityId === modalidadeSelecionada
      );
    }

    // Filtro por data
    if (filtroDataAtivo) {
      treinosFiltrados = treinosFiltrados.filter(treino => {
        const dataTreino = treino.data;
        return (
          dataTreino.getDate() === dataSelecionada.getDate() &&
          dataTreino.getMonth() === dataSelecionada.getMonth() &&
          dataTreino.getFullYear() === dataSelecionada.getFullYear()
        );
      });
    }

    setAgendamentos(treinosFiltrados);
  }, [modalidadeSelecionada, todosTreinos, dataSelecionada, filtroDataAtivo]);

  // Limpar filtros
  const limparFiltros = () => {
    setModalidadeSelecionada("");
    setFiltroDataAtivo(false);
    setDataSelecionada(new Date());
  };

  // Adicionar novo treino
  const adicionarTreino = async (dataSelecionada, horario, modalidadeId) => {
    try {
      const [hora, minuto] = horario.split(':').map(Number);
      const dataTreino = new Date(dataSelecionada);
      dataTreino.setHours(hora, minuto, 0, 0);
      
      const cronExpression = `0 ${minuto} ${hora} ${dataTreino.getDate()} ${dataTreino.getMonth() + 1} ${dataTreino.getDay()}`;
      
      const novoAgendamento = {
        _id: modalidadeId,
        ScheduledTrainings: [{
          Start: cronExpression,
          End: `0 ${minuto + 1} ${hora} ${dataTreino.getDate()} ${dataTreino.getMonth() + 1} ${dataTreino.getDay()}`
        }]
      };

      await axios.patch('/api/modality', novoAgendamento, {
        headers: {
          "Authorization": "Bearer frontendmauaesports",
          "Content-Type": "application/json"
        }
      });

      // Atualizar estado local
      const novoTreino = {
        id: Date.now().toString(),
        horario: horario,
        data: dataTreino,
        status: "agendado",
        ModalityId: modalidadeId,
        NomeModalidade: modalidades[modalidadeId]?.Name || "Novo Treino"
      };
      
      setTodosTreinos([...todosTreinos, novoTreino]);
      setAgendamentos(prev => [...prev, novoTreino]);
      
      return true;
    } catch (error) {
      console.error("Erro ao adicionar treino:", error);
      return false;
    }
  };

  const handleAdicionarTreino = async () => {
    if (!novoTreino.horario || !novoTreino.modalidade) {
      alert('Preencha todos os campos!');
      return;
    }
    
    const sucesso = await adicionarTreino(
      dataSelecionada,
      novoTreino.horario,
      novoTreino.modalidade
    );
    
    if (sucesso) {
      alert('Treino adicionado com sucesso!');
      setNovoTreino({ horario: '', modalidade: '' });
    } else {
      alert('Erro ao adicionar treino');
    }
  };

  // Componente Calendario
  const Calendario = () => {
    const [mesAtual, setMesAtual] = useState(new Date());

    const obterDiasNoMes = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const primeiroDia = new Date(year, month, 1);
      const ultimoDia = new Date(year, month + 1, 0);

      return {
        diasNoMes: ultimoDia.getDate(),
        diaInicial: primeiroDia.getDay(),
      };
    };

    const mudarMes = (incremento) => {
      setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + incremento, 1));
    };

    const { diasNoMes, diaInicial } = obterDiasNoMes(mesAtual);

    return (
      <div className="w-full h-full">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => mudarMes(-1)} className="text-azul-claro hover:text-azul-escuro text-2xl">
            <MdChevronLeft />
          </button>
          <h3 className="text-xl font-bold text-white">
            {mesAtual.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
          </h3>
          <button onClick={() => mudarMes(1)} className="text-azul-claro hover:text-azul-escuro text-2xl">
            <MdChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
            <div key={dia} className="text-center text-white font-semibold py-2">
              {dia}
            </div>
          ))}

          {Array.from({ length: diaInicial }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {Array.from({ length: diasNoMes }, (_, i) => i + 1).map((dia) => {
            const diaAtual = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);
            const isSelecionado = filtroDataAtivo && dataSelecionada.toDateString() === diaAtual.toDateString();
            const isHoje = new Date().toDateString() === diaAtual.toDateString();

            return (
              <button
                key={dia}
                onClick={() => {
                  setDataSelecionada(diaAtual);
                  setFiltroDataAtivo(true);
                }}
                className={`h-10 rounded-full flex items-center justify-center
                  ${isSelecionado
                    ? "bg-azul-claro text-white"
                    : isHoje
                    ? "border-2 border-azul-claro text-white"
                    : "hover:bg-fundo/70 text-white"
                  }`}
              >
                {dia}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Contadores
  const contadores = {
    agendados: agendamentos.filter(a => a.status === "agendado").length,
    realizados: agendamentos.filter(a => a.status === "realizado").length,
    total: agendamentos.length
  };

  if (carregando) {
    return <div className="text-white text-center py-8">Carregando dados...</div>;
  }

  return (
    <div className="min-h-screen w-screen bg-fundo pt-[90px] px-10 overflow-hidden">
      <div className="w-full h-[80px] justify-center text-center flex mb-8">
        <h1 className="text-azul-claro text-center font-blinker text-5xl">Treinos</h1>
      </div>

      {/* Barra de Controles */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Seletor de Modalidade */}
        <div className="flex-1 min-w-[250px]">
          <label className="text-white font-bold text-lg mr-2">Time:</label>
          <select
            value={modalidadeSelecionada}
            onChange={(e) => setModalidadeSelecionada(e.target.value)}
            className="p-2 rounded-md bg-fundo text-white flex-1 min-w-[200px]"
          >
            <option value="">Todos os times</option>
            {Object.entries(modalidades).map(([id, mod]) => (
              <option key={id} value={id}>
                {mod.Name} ({mod.Tag})
              </option>
            ))}
          </select>
        </div>

        {/* Controles de Filtro */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <label className="text-white mr-2">Filtrar por data:</label>
            <button
              onClick={() => setFiltroDataAtivo(!filtroDataAtivo)}
              className={`px-3 py-1 rounded ${
                filtroDataAtivo 
                  ? "bg-azul-claro text-white" 
                  : "bg-fundo text-white border border-borda"
              }`}
            >
              {filtroDataAtivo ? "Ativo" : "Inativo"}
            </button>
          </div>

          {(modalidadeSelecionada || filtroDataAtivo) && (
            <button
              onClick={limparFiltros}
              className="text-vermelho-claro hover:text-vermelho-escuro flex items-center"
            >
              <MdClear className="mr-1" /> Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-navbar p-4 rounded-lg mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-white font-bold">
              {filtroDataAtivo
                ? `Treinos em ${dataSelecionada.toLocaleDateString('pt-BR')}`
                : "Todos os treinos"}
              {modalidadeSelecionada && ` - ${modalidades[modalidadeSelecionada]?.Name}`}
            </h3>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-branco">Total</div>
              <div className="text-azul-claro font-bold text-xl">{contadores.total}</div>
            </div>
            <div className="text-center">
              <div className="text-branco">Agendados</div>
              <div className="text-fonte-escura font-bold text-xl">{contadores.agendados}</div>
            </div>
            <div className="text-center">
              <div className="text-branco">Realizados</div>
              <div className="text-verde-claro font-bold text-xl">{contadores.realizados}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Adicionar Novo Treino */}
      <div className="mb-6 p-4 bg-navbar rounded-lg">
        <h3 className="text-white font-bold mb-3">Adicionar Novo Treino</h3>
        
        <div className="flex gap-4 mb-3 flex-wrap">
          <input
            type="time"
            value={novoTreino.horario}
            onChange={(e) => setNovoTreino({...novoTreino, horario: e.target.value})}
            className="p-2 rounded bg-fundo text-white"
            placeholder="Horário"
          />
          
          <select
            value={novoTreino.modalidade}
            onChange={(e) => setNovoTreino({...novoTreino, modalidade: e.target.value})}
            className="p-2 rounded bg-fundo text-white flex-1 min-w-[200px]"
          >
            <option value="">Selecione a modalidade</option>
            {Object.entries(modalidades).map(([id, mod]) => (
              <option key={id} value={id}>{mod.Name}</option>
            ))}
          </select>

          <button
            onClick={handleAdicionarTreino}
            className="bg-azul-claro text-white px-4 py-2 rounded hover:bg-azul-escuro whitespace-nowrap"
          >
            Adicionar Treino
          </button>
        </div>
      </div>

      <div className="flex w-full h-[calc(100vh-180px)] gap-8">
        {/* Lista de Treinos */}
        <div className="w-[65%] h-full bg-navbar border border-borda rounded-xl overflow-y-auto">
          <div className="border-b border-borda p-4 sticky top-0 bg-navbar z-10">
            <div className="font-blinker text-xl text-branco flex justify-between">
              <span className="w-1/4">Horário</span>
              <span className="w-2/4">Compromisso</span>
              <span className="w-1/4 text-right">Ações</span>
            </div>
          </div>

          <div className="pb-6">
            {agendamentos.length > 0 ? (
              agendamentos.map((agendamento) => (
                <div key={agendamento.id} className="border-b border-borda">
                  <Agendamento
                    horario={agendamento.horario}
                    status={agendamento.status}
                    compromisso={agendamento.NomeModalidade}
                  />
                </div>
              ))
            ) : (
              <div className="text-white text-center py-8">
                Nenhum treino encontrado com os filtros atuais
              </div>
            )}
          </div>
        </div>

        {/* Calendário */}
        <div className="w-[30%] h-[90%] bg-navbar border border-borda rounded-xl p-6">
          <Calendario />
        </div>
      </div>
    </div>
  );
};

export default TreinosAdmin;