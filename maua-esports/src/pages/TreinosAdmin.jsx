import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdChevronRight, MdChevronLeft, MdClear, MdEdit, MdSave, MdClose } from "react-icons/md";
import Rodape from "../components/Rodape";
import PageBanner from "../components/PageBanner";
import { useNavigate } from "react-router-dom";

const Agendamento = ({ 
  inicio, 
  fim,
  diaSemana,
  time, 
  status,
  onEditar 
}) => {
  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:mx-4 my-0 min-h-[80px] border-b border-borda">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8 w-full sm:w-auto">
        <div className="flex flex-col items-center w-full sm:w-40">
          <span className="text-branco font-bold">{inicio} - {fim}</span>
          <span className="text-azul-claro text-sm">Duração: {calcularDuracao(inicio, fim)}</span>
        </div>
        
        <div className="w-32 text-center">
          <span className="text-branco">{diasDaSemana[diaSemana]}</span>
        </div>
        
        <div className="ml-3 text-sm w-full sm:w-48 text-center sm:text-left">
          <p className="font-semibold text-white font-blinker">{time}</p>
        </div>
      </div>

      <button
        onClick={onEditar}
        className="text-azul-claro hover:text-azul-escuro text-2xl cursor-pointer mt-2 sm:mt-0"
      >
        <MdEdit />
      </button>
    </div>
  );
};

function calcularDuracao(inicio, fim) {
  const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
  const [horaFim, minutoFim] = fim.split(':').map(Number);

  const totalMinutosInicio = horaInicio * 60 + minutoInicio;
  const totalMinutosFim = horaFim * 60 + minutoFim;

  const diferencaMinutos = totalMinutosFim - totalMinutosInicio;

  const horas = Math.floor(diferencaMinutos / 60);
  const minutos = diferencaMinutos % 60;

  return `${horas}h${minutos.toString().padStart(2, '0')}min`;
}

const TreinosAdmin = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [modalidades, setModalidades] = useState({});
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");
  const [agendamentosOriginais, setAgendamentosOriginais] = useState([]);
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroDataAtivo, setFiltroDataAtivo] = useState(false);
  const [editandoTreino, setEditandoTreino] = useState(null);
  const [formEdicao, setFormEdicao] = useState({
    inicio: "",
    fim: "",
    diaSemana: 0
  });

  const diasDaSemana = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda" },
    { value: 2, label: "Terça" },
    { value: 3, label: "Quarta" },
    { value: 4, label: "Quinta" },
    { value: 5, label: "Sexta" },
    { value: 6, label: "Sábado" }
  ];

  const parseCron = (cron) => {
    const parts = cron.split(' ');
    const [minuto, hora] = parts.slice(1, 3);
    const diaSemana = parts[5] || 0;

    return {
      hora: hora.padStart(2, '0'),
      minuto: minuto.padStart(2, '0'),
      diaSemana: parseInt(diaSemana)
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseModalidades = await axios.get('/api/modality/all', {
          headers: { "Authorization": "Bearer frontendmauaesports" }
        });

        const mods = responseModalidades.data;
        setModalidades(mods);

        const todosAgendamentos = [];

        for (const modId in mods) {
          const mod = mods[modId];
          if (mod.ScheduledTrainings && mod.ScheduledTrainings.length > 0) {
            mod.ScheduledTrainings.forEach(treino => {
              const inicio = parseCron(treino.Start);
              const fim = parseCron(treino.End);

              todosAgendamentos.push({
                id: `${modId}-${treino.Start}`,
                inicio: `${inicio.hora}:${inicio.minuto}`,
                fim: `${fim.hora}:${fim.minuto}`,
                diaSemana: inicio.diaSemana,
                ModalityId: modId,
                NomeModalidade: mod.Name || "Desconhecido",
                cronInicio: treino.Start,
                cronFim: treino.End
              });
            });
          }
        }

        setAgendamentosOriginais(todosAgendamentos);
        setAgendamentosFiltrados(todosAgendamentos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let treinosFiltrados = [...agendamentosOriginais];

    if (modalidadeSelecionada) {
      treinosFiltrados = treinosFiltrados.filter(treino =>
        treino.ModalityId === modalidadeSelecionada
      );
    }

    if (filtroDataAtivo) {
      treinosFiltrados = treinosFiltrados.filter(treino =>
        treino.diaSemana === dataSelecionada.getDay()
      );
    }

    setAgendamentosFiltrados(treinosFiltrados);
  }, [modalidadeSelecionada, dataSelecionada, filtroDataAtivo, agendamentosOriginais]);

  const limparFiltros = () => {
    setModalidadeSelecionada("");
    setFiltroDataAtivo(false);
    setDataSelecionada(new Date());
  };

  const iniciarEdicao = (treino) => {
    setEditandoTreino(treino);
    setFormEdicao({
      inicio: treino.inicio,
      fim: treino.fim,
      diaSemana: treino.diaSemana
    });
  };

  const cancelarEdicao = () => {
    setEditandoTreino(null);
    setFormEdicao({ inicio: "", fim: "", diaSemana: 0 });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormEdicao(prev => ({ ...prev, [name]: value }));
  };

  const gerarCron = (horaMinuto, diaSemana) => {
    const [hora, minuto] = horaMinuto.split(':');
    return `0 ${minuto} ${hora} * * ${diaSemana}`;
  };

  const salvarEdicao = async () => {
    if (!editandoTreino || !formEdicao.inicio || !formEdicao.fim) return;

    try {
      const novaCronInicio = gerarCron(formEdicao.inicio, formEdicao.diaSemana);
      const novaCronFim = gerarCron(formEdicao.fim, formEdicao.diaSemana);
      
      const modalidade = modalidades[editandoTreino.ModalityId];
      if (!modalidade) throw new Error("Modalidade não encontrada");

      const updatedTrainings = modalidade.ScheduledTrainings.map(t => 
        t.Start === editandoTreino.cronInicio ? 
        { ...t, Start: novaCronInicio, End: novaCronFim } : t
      );

      await axios.patch('/api/modality', {
        _id: editandoTreino.ModalityId,
        ScheduledTrainings: updatedTrainings
      }, {
        headers: {
          "Authorization": "Bearer frontendmauaesports",
          "Content-Type": "application/json"
        }
      });

      const updatedAgendamentos = agendamentosOriginais.map(a => 
        a.id === editandoTreino.id ? 
        { 
          ...a, 
          inicio: formEdicao.inicio,
          fim: formEdicao.fim,
          diaSemana: parseInt(formEdicao.diaSemana),
          cronInicio: novaCronInicio,
          cronFim: novaCronFim
        } : a
      );

      setAgendamentosOriginais(updatedAgendamentos);
      setEditandoTreino(null);
      setFormEdicao({ inicio: "", fim: "", diaSemana: 0 });

      alert('Treino atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
      alert('Erro ao atualizar treino');
    }
  };

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
          <h3 className="text-lg sm:text-xl font-bold text-white text-center">
            {mesAtual.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
          </h3>
          <button onClick={() => mudarMes(1)} className="text-azul-claro hover:text-azul-escuro text-2xl">
            <MdChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
            <div key={dia} className="text-center text-xs sm:text-sm text-white font-semibold py-1 sm:py-2">
              {dia}
            </div>
          ))}

          {Array.from({ length: diaInicial }).map((_, index) => (
            <div key={`empty-${index}`} className="h-6 sm:h-8" />
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
                className={`h-6 sm:h-8 text-xs sm:text-sm rounded-full flex items-center justify-center
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

  const contadores = {
    total: agendamentosFiltrados.length
  };

  if (carregando) {
    return <div className="text-white text-center py-8">Carregando dados...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-fundo flex flex-col items-center">
      {/* Container unificado para NavBar e PageBanner */}
      <div className="w-full bg-navbar mb-10">
        <div className="h-[104px]"> {/* Espaço para a NavBar */} </div>
        <PageBanner pageName="Treinos Administrativos" className="bg-navbar" />
      </div>

      {/* Resumo centralizado */}
      <div className="bg-navbar p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 w-[95%] sm:w-4/5 lg:w-3/4 text-center mx-auto">
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <h3 className="text-white font-bold text-sm sm:text-base text-center">
            {filtroDataAtivo
              ? `Treinos na ${diasDaSemana.find(d => d.value === dataSelecionada.getDay())?.label}`
              : "Todos os treinos"}
            {modalidadeSelecionada && ` - ${modalidades[modalidadeSelecionada]?.Name}`}
          </h3>
          
          <div className="text-azul-claro font-bold text-lg sm:text-xl">
            {contadores.total} {contadores.total === 1 ? 'treino' : 'treinos'}
          </div>
        </div>
      </div>

      {/* Barra de Controles centralizada */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4 w-[95%] sm:w-4/5 lg:w-3/4">
        <div className="w-full sm:flex-1">
          <label className="text-white font-bold text-sm sm:text-lg mr-2">Time:</label>
          <select
            value={modalidadeSelecionada}
            onChange={(e) => setModalidadeSelecionada(e.target.value)}
            className="p-2 rounded-md bg-preto text-white w-full sm:w-[30%]"
          >
            <option value="">Todos os times</option>
            {Object.entries(modalidades).map(([id, mod]) => (
              <option key={id} value={id}>
                {mod.Name} ({mod.Tag})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center w-full sm:w-auto">
            <label className="text-white text-sm sm:text-base mr-2">Filtrar por dia:</label>
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
              className="text-vermelho-claro hover:text-vermelho-escuro flex items-center text-sm sm:text-base"
            >
              <MdClear className="mr-1" /> Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Container principal centralizado */}
      <div className="flex flex-col lg:flex-row w-[95%] sm:w-4/5 lg:w-3/4 h-auto lg:h-[calc(100vh-180px)] gap-4 sm:gap-6 md:gap-8 mb-10">
        {/* Lista de Treinos */}
        <div className="w-full lg:w-[65%] h-auto lg:h-full bg-navbar border border-borda rounded-xl overflow-y-auto order-2 lg:order-1">
          <div className="border-b border-borda p-3 sm:p-4 sticky top-0 bg-navbar z-10">
            <div className="font-blinker text-sm sm:text-base md:text-lg lg:text-xl text-branco hidden sm:flex justify-between">
              <span className="w-1/4">Horário</span>
              <span className="w-1/4">Dia da Semana</span>
              <span className="w-2/4">Time</span>
              <span className="w-1/4 text-right">Ações</span>
            </div>
            <div className="sm:hidden font-blinker text-base text-branco text-center">
              Lista de Treinos
            </div>
          </div>

          <div className="pb-4 sm:pb-6">
            {agendamentosFiltrados.length > 0 ? (
              agendamentosFiltrados.map((agendamento) => (
                <div key={agendamento.id} className="border-b border-borda">
                  {editandoTreino?.id === agendamento.id ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
                        <div className="flex flex-col w-full sm:w-auto">
                          <label className="text-cinza-claro text-xs sm:text-sm mb-1">Início</label>
                          <input
                            type="time"
                            name="inicio"
                            value={formEdicao.inicio}
                            onChange={handleFormChange}
                            className="p-1 sm:p-2 rounded bg-fundo text-white w-full sm:w-32"
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-cinza-claro text-sm mb-1">Fim</label>
                          <input
                            type="time"
                            name="fim"
                            value={formEdicao.fim}
                            onChange={handleFormChange}
                            className="p-1 sm:p-2 rounded bg-fundo text-white w-full sm:w-32"
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-cinza-claro text-sm mb-1">Dia</label>
                          <select
                            name="diaSemana"
                            value={formEdicao.diaSemana}
                            onChange={handleFormChange}
                            className="p-1 sm:p-2 rounded bg-fundo text-white w-full sm:w-40"
                          >
                            {diasDaSemana.map(dia => (
                              <option key={dia.value} value={dia.value}>{dia.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <span className="text-white ml-4">{agendamento.NomeModalidade}</span>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={salvarEdicao}
                          className="bg-verde-claro text-white px-2 sm:px-3 py-1 rounded flex items-center text-xs sm:text-sm"
                        >
                          <MdSave className="mr-1" /> Salvar
                        </button>
                        <button
                          onClick={cancelarEdicao}
                          className="bg-vermelho-claro text-white px-2 sm:px-3 py-1 rounded flex items-center text-xs sm:text-sm"
                        >
                          <MdClose className="mr-1" /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Agendamento
                      inicio={agendamento.inicio}
                      fim={agendamento.fim}
                      diaSemana={agendamento.diaSemana}
                      status={agendamento.status}
                      time={agendamento.NomeModalidade}
                      onEditar={() => iniciarEdicao(agendamento)}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-white text-center py-6 sm:py-8 text-sm sm:text-base">
                Nenhum treino agendado encontrado com os filtros atuais
              </div>
            )}
          </div>
        </div>

        {/* Calendário */}
        <div className="w-full lg:w-[30%] h-auto sm:h-[400px] lg:h-[90%] bg-navbar border border-borda rounded-xl p-4 sm:p-6 order-1 lg:order-2">
          <Calendario />
        </div>
      </div>
    </div>
  );
};

export default TreinosAdmin;