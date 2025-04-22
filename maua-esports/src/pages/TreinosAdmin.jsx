import React, { useState, useEffect } from "react";
import axios from "axios";
import Agendamento from "../components/Agendamento";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

const TreinosAdmin = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [modalidades, setModalidades] = useState([]); // Estado para armazenar as modalidades
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState(""); // Estado para armazenar a modalidade selecionada

  const agendadosCount = agendamentos.filter(
    (a) => a.status === "agendado"
  ).length;
  const realizadosCount = agendamentos.filter(
    (a) => a.status === "realizado"
  ).length;

  // Buscar modalidades
  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const response = await axios.get(
          "https://API-Esports.lcstuber.net/modality/all",
          {
            headers: {
              Authorization: "Bearer frontendmauaesports",
            },
          }
        );
        setModalidades(Object.values(response.data)); // Salva as modalidades no estado
      } catch (error) {
        console.error("Erro ao buscar modalidades:", error);
      }
    };

    fetchModalidades();
  }, []);

  // Buscar treinos
  // Buscar treinos filtrados por modalidade
  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        let url = "https://API-Esports.lcstuber.net/trains/all";
        if (modalidadeSelecionada) {
          url += `?modalidade=${modalidadeSelecionada}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer frontendmauaesports",
          },
          withCredentials: true,
        });

        const treinosAPI = response.data.map((treino) => ({
          id: treino.id,
          horario: treino.time, // depende de como vem no seu backend
          status: treino.status || "agendado",
          compromisso: treino.title || treino.description,
        }));
        setAgendamentos(treinosAPI);
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      }
    };

    fetchTreinos();
  }, [modalidadeSelecionada]);

  const handleAgendar = async (id) => {
    try {
      const treino = agendamentos.find((a) => a.id === id);
      const atualizado = {
        ...treino,
        status: "agendado",
        title: "Novo treino",
      };

      await axios.put("http://localhost:3001/trains", atualizado, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setAgendamentos(
        agendamentos.map((ag) =>
          ag.id === id
            ? { ...ag, status: "agendado", compromisso: "Novo treino" }
            : ag
        )
      );
    } catch (err) {
      console.error("Erro ao agendar treino:", err);
    }
  };

  const handleEditar = (id) => {
    console.log("Editar agendamento:", id);
  };

  // Componente Calendario interno
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
      setMesAtual(
        new Date(mesAtual.getFullYear(), mesAtual.getMonth() + incremento, 1)
      );
    };

    const { diasNoMes, diaInicial } = obterDiasNoMes(mesAtual);
    const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

    return (
      <div className="w-full h-full">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => mudarMes(-1)}
            className="text-azul-claro hover:text-azul-escuro text-2xl"
          >
            <MdChevronLeft />
          </button>
          <h3 className="text-xl font-bold text-white">
            {mesAtual.toLocaleString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            onClick={() => mudarMes(1)}
            className="text-azul-claro hover:text-azul-escuro text-2xl"
          >
            <MdChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
            <div
              key={dia}
              className="text-center text-white font-semibold py-2"
            >
              {dia}
            </div>
          ))}

          {Array.from({ length: diaInicial }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {dias.map((dia) => {
            const diaAtual = new Date(
              mesAtual.getFullYear(),
              mesAtual.getMonth(),
              dia
            );
            const hoje = new Date();
            const isHoje = diaAtual.toDateString() === hoje.toDateString();
            const isSelecionado =
              dataSelecionada.toDateString() === diaAtual.toDateString();

            return (
              <button
                key={dia}
                onClick={() => setDataSelecionada(diaAtual)}
                className={`h-10 rounded-full flex items-center justify-center
                  ${
                    isSelecionado
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

  return (
    <div className="min-h-screen w-screen bg-fundo pt-[90px] px-10 overflow-hidden">
      <div className="w-full h-[80px] justify-center text-center flex mb-8">
        <h1 className="text-azul-claro text-center font-blinker text-5xl">
          Treinos
        </h1>
      </div>

      {/* Seção para selecionar o time */}
      <div className="mb-8">
        <label className="text-white font-bold text-lg" htmlFor="modalidade">
          Selecione o time:
        </label>
        <select
          id="modalidade"
          value={modalidadeSelecionada}
          onChange={(e) => setModalidadeSelecionada(e.target.value)}
          className="ml-4 p-2 rounded-md bg-fundo text-white"
        >
          <option value="">Selecione</option>
          {modalidades.map((modalidade) => (
            <option key={modalidade.id} value={modalidade.id}>
              {modalidade.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full h-[calc(100vh-180px)] gap-8">
        <div className="w-[65%] h-full bg-navbar border border-borda rounded-xl overflow-y-auto">
          <div className="justify-start text-branco font-blinker font-bold text-2xl ml-10 my-5">
            <h1>
              {dataSelecionada.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h1>
          </div>

          <div className="flex gap-6 mx-10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-fonte-escura rounded-sm"></div>
              <span className="text-branco">Agendados ({agendadosCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-verde-claro rounded-sm"></div>
              <span className="text-branco">
                Realizados ({realizadosCount})
              </span>
            </div>
          </div>

          <div className="border border-x-0 border-borda my-6 py-4">
            <div className="font-blinker text-xl mx-25 text-branco flex justify-between">
              <span className="w-1/4">Horário</span>
              <span className="w-2/4">Compromisso</span>
              <span className="w-1/4 text-right">Ações</span>
            </div>
          </div>

          <div className="pb-6">
            {agendamentos
              .filter((agendamento) => {
                if (!modalidadeSelecionada) return true; // Exibe todos se nenhuma modalidade for selecionada
                return agendamento.modalityId === modalidadeSelecionada;
              })
              .map((agendamento) => (
                <Agendamento
                  key={agendamento.id}
                  horario={agendamento.horario}
                  status={agendamento.status}
                  compromisso={agendamento.compromisso}
                  onAgendar={() => handleAgendar(agendamento.id)}
                  onEditar={() => handleEditar(agendamento.id)}
                />
              ))}
          </div>
        </div>

        <div className="w-[30%] h-[90%] bg-navbar border border-borda rounded-xl p-6">
          <Calendario />
        </div>
      </div>
    </div>
  );
};

export default TreinosAdmin;
