import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdChevronRight, MdChevronLeft, MdClear, MdEdit, MdSave, MdClose } from "react-icons/md";

// Componente Agendamento atualizado
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
    <div className="flex items-center justify-between mx-10 my-0 h-[80px] border-b border-borda text-center">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center w-40">
          <span className="text-branco font-bold">{inicio} - {fim}</span>
          <span className="text-cinza-claro text-sm">Duração: {calcularDuracao(inicio, fim)}</span>
        </div>
        
        <div className="w-32 text-center">
          <span className="text-branco">{diasDaSemana[diaSemana]}</span>
        </div>
        
        <div className="ml-3 text-sm w-48 text-left">
          <p className="font-semibold text-white font-blinker">{time}</p>
          <p className={`font-blinker ${
            status === 'agendado' ? 'text-azul-claro' : 'text-verde-claro'
          }`}>
            {status === 'agendado' ? 'Agendado' : 'Realizado'}
          </p>
        </div>
      </div>
      
      <button
        onClick={onEditar}
        className="text-azul-claro hover:text-azul-escuro text-2xl cursor-pointer"
      >
        <MdEdit />
      </button>
    </div>
  );
};

// Função auxiliar para calcular duração
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
  // Estados principais
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

  // Dias da semana para o select
  const diasDaSemana = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda" },
    { value: 2, label: "Terça" },
    { value: 3, label: "Quarta" },
    { value: 4, label: "Quinta" },
    { value: 5, label: "Sexta" },
    { value: 6, label: "Sábado" }
  ];

  // Converter CRON para horário legível e dia da semana
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

  // Buscar modalidades e seus treinos agendados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar modalidades
        const responseModalidades = await axios.get('/api/modality/all', {
          headers: { "Authorization": "Bearer frontendmauaesports" }
        });
        
        const mods = responseModalidades.data;
        setModalidades(mods);

        // Processar treinos agendados de cada modalidade
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
                status: "agendado",
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

  // Aplicar filtros
  useEffect(() => {
    let treinosFiltrados = [...agendamentosOriginais];

    // Filtro por modalidade
    if (modalidadeSelecionada) {
      treinosFiltrados = treinosFiltrados.filter(treino => 
        treino.ModalityId === modalidadeSelecionada
      );
    }

    // Filtro por data (dia da semana)
    if (filtroDataAtivo) {
      treinosFiltrados = treinosFiltrados.filter(treino => 
        treino.diaSemana === dataSelecionada.getDay()
      );
    }

    setAgendamentosFiltrados(treinosFiltrados);
  }, [modalidadeSelecionada, dataSelecionada, filtroDataAtivo, agendamentosOriginais]);

  // Limpar filtros
  const limparFiltros = () => {
    setModalidadeSelecionada("");
    setFiltroDataAtivo(false);
    setDataSelecionada(new Date());
  };

  // Iniciar edição de treino
  const iniciarEdicao = (treino) => {
    setEditandoTreino(treino);
    setFormEdicao({
      inicio: treino.inicio,
      fim: treino.fim,
      diaSemana: treino.diaSemana
    });
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoTreino(null);
    setFormEdicao({ inicio: "", fim: "", diaSemana: 0 });
  };

  // Atualizar formulário de edição
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormEdicao(prev => ({ ...prev, [name]: value }));
  };

  // Gerar expressão CRON a partir dos dados do formulário
  const gerarCron = (horaMinuto, diaSemana) => {
    const [hora, minuto] = horaMinuto.split(':');
    return `0 ${minuto} ${hora} * * ${diaSemana}`;
  };

  // Salvar edição do treino
  const salvarEdicao = async () => {
    if (!editandoTreino || !formEdicao.inicio || !formEdicao.fim) return;

    try {
      const novaCronInicio = gerarCron(formEdicao.inicio, formEdicao.diaSemana);
      const novaCronFim = gerarCron(formEdicao.fim, formEdicao.diaSemana);
      
      // Buscar a modalidade atual
      const modalidade = modalidades[editandoTreino.ModalityId];
      if (!modalidade) throw new Error("Modalidade não encontrada");

      // Atualizar o treino específico
      const updatedTrainings = modalidade.ScheduledTrainings.map(t => 
        t.Start === editandoTreino.cronInicio ? 
        { ...t, Start: novaCronInicio, End: novaCronFim } : t
      );

      // Enviar atualização para o servidor
      await axios.patch('/api/modality', {
        _id: editandoTreino.ModalityId,
        ScheduledTrainings: updatedTrainings
      }, {
        headers: {
          "Authorization": "Bearer frontendmauaesports",
          "Content-Type": "application/json"
        }
      });

      // Atualizar estado local
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
    agendados: agendamentosFiltrados.filter(a => a.status === "agendado").length,
    realizados: agendamentosFiltrados.filter(a => a.status === "realizado").length,
    total: agendamentosFiltrados.length
  };

  if (carregando) {
    return <div className="text-white text-center py-8">Carregando dados...</div>;
  }

  return (
    <div className="min-h-screen w-screen bg-fundo pt-[90px] px-10 overflow-hidden">
      <div className="w-full h-[80px] justify-center px-0 text-center flex mb-8 bg-preto">
        <h1 className="font-blinker text-branco font-bold text-3xl text-center">Treinos Agendados</h1>
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
            <label className="text-white mr-2">Filtrar por dia:</label>
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
                ? `Treinos na ${diasDaSemana.find(d => d.value === dataSelecionada.getDay())?.label}`
                : "Todos os treinos agendados"}
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
          </div>
        </div>
      </div>

      <div className="flex w-full h-[calc(100vh-180px)] gap-8">
        {/* Lista de Treinos */}
        <div className="w-[65%] h-full bg-navbar border border-borda rounded-xl overflow-y-auto">
          <div className="border-b border-borda p-4 sticky top-0 bg-navbar z-10">
            <div className="ml-15 font-blinker text-xl text-branco flex justify-between">
              <span className="w-1/4">Horário</span>
              <span className="w-1/4">Dia da Semana</span>
              <span className="w-2/4">Time</span>
              <span className="w-1/4 text-right">Ações</span>
            </div>
          </div>

          <div className="pb-6">
            {agendamentosFiltrados.length > 0 ? (
              agendamentosFiltrados.map((agendamento) => (
                <div key={agendamento.id} className="border-b border-borda">
                  {editandoTreino?.id === agendamento.id ? (
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex flex-col">
                          <label className="text-cinza-claro text-sm mb-1">Início</label>
                          <input
                            type="time"
                            name="inicio"
                            value={formEdicao.inicio}
                            onChange={handleFormChange}
                            className="p-2 rounded bg-fundo text-white w-32"
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-cinza-claro text-sm mb-1">Fim</label>
                          <input
                            type="time"
                            name="fim"
                            value={formEdicao.fim}
                            onChange={handleFormChange}
                            className="p-2 rounded bg-fundo text-white w-32"
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-cinza-claro text-sm mb-1">Dia</label>
                          <select
                            name="diaSemana"
                            value={formEdicao.diaSemana}
                            onChange={handleFormChange}
                            className="p-2 rounded bg-fundo text-white w-40"
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
                          className="bg-verde-claro text-white px-3 py-1 rounded flex items-center"
                        >
                          <MdSave className="mr-1" /> Salvar
                        </button>
                        <button
                          onClick={cancelarEdicao}
                          className="bg-vermelho-claro text-white px-3 py-1 rounded flex items-center"
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
              <div className="text-white text-center py-8">
                Nenhum treino agendado encontrado com os filtros atuais
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