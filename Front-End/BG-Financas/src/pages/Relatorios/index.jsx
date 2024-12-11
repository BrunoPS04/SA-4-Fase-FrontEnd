import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from "chart.js";
import axios from "axios";
import "./index.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Relatorios() {

  const [movimentacoes, setMovimentacoes] = useState([]);
  const [movimentacoesFiltradas, setMovimentacoesFiltradas] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [activeTab, setActiveTab] = useState("movimentacao");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [movimentacaoEditando, setMovimentacaoEditando] = useState(null);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  const [modalAlertDeleteMovimentacao, setModalAlertDeleteMovimentacao] = useState(false);
  const [idMovimentacaoExcluir, setIdMovimentacaoExcluir] = useState(null);

  const [categoriaModal, setCategoriaModal] = useState("");
  const [tipoModal, setTipoModal] = useState("");
  const [valorModal, setValorModal] = useState("");
  const [dataModal, setDataModal] = useState("");
  const [descricaoModal, setDescricaoModal] = useState("");

  const userId = Number(localStorage.getItem("userId"));
  console.log("Usuário: " + userId);

  // Mover a função para fora do useEffect
  const atualizarMovimentacoes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/movimentacoes/user/${userId}`
      );
      setMovimentacoes(response.data);
      setMovimentacoesFiltradas(response.data); // Inicialmente, exibe todas as movimentações
    } catch (error) {
      console.error("Erro ao atualizar movimentações:", error);
    }
  };

  useEffect(() => {
    atualizarMovimentacoes();
  }, [userId]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:8080/categorias");
        setCategorias(response.data); // response.data agora será uma lista de strings.
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  const categoriaEscolhida = (e) => {
    const valor = e.target.value;
    setCategoria(valor);
    const filtradas = categorias.filter((cat) =>
      cat.toLowerCase().includes(valor.toLowerCase())
    );
    setCategoriasFiltradas(filtradas);
  };


  // Função ajustada para garantir dados válidos no gráfico
  const calcularValoresPorCategoria = (movimentacoes) => {
    return categorias.map((cat) =>
      movimentacoes
        .filter((mov) => mov.categoria && mov.categoria.nomeCategoria === cat)
        .reduce((acc, mov) => acc + mov.valor, 0)
    );
  };

  // Dados do Gráfico de Colunas
  const barData = {
    labels: categorias, // Agora 'categorias' deve conter apenas strings simples
    datasets: [
      {
        label: "Movimentações",
        data: calcularValoresPorCategoria(movimentacoesFiltradas),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // // Configuração do Pie Chart
  // const pieData = {
  //   labels: categorias,
  //   datasets: [
  //     {
  //       data: calcularValoresPorCategoria(movimentacoesFiltradas),
  //       backgroundColor: [
  //         "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
  //       ],
  //       hoverBackgroundColor: [
  //         "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
  //       ],
  //     },
  //   ],
  // };

  // const [recebeTipoGrafico, setRecebeTipoGrafico] = useState("coluna");

  // const alteraEntreGraficos = (e) => {
  //   setRecebeTipoGrafico(e.target.value);
  // }

  const aplicarFiltros = () => {
    let filtradas = [...movimentacoes];

    // Filtrar por categoria
    if (categoria) {
      filtradas = filtradas.filter((movimentacao) =>
        movimentacao.categoria.nomeCategoria
          .toLowerCase()
          .includes(categoria.toLowerCase())
      );
    }

    // Filtrar por intervalo de datas
    if (dataInicial && dataFinal) {
      const inicio = new Date(dataInicial);
      const fim = new Date(dataFinal);

      fim.setHours(23, 59, 59, 999);

      filtradas = filtradas.filter((movimentacao) => {
        const dataMovimentacao = new Date(movimentacao.data);

        const dataMovimentacaoFormated = dataMovimentacao.toISOString().split('T')[0]
        const inicioFormated = inicio.toISOString().split('T')[0]
        const finalFormated = fim.toISOString().split('T')[0]

        return dataMovimentacaoFormated >= inicioFormated && dataMovimentacaoFormated <= finalFormated
      });
    }

    setMovimentacoesFiltradas(filtradas);
    setSelectedValue("");
    setCategoria("");
    setCategoriasFiltradas([]);
  };


  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);

    setShowModal(false);

    if (value === "123") {
      setShowModal(true);
    }

    const hoje = new Date();
    let dataInicio, dataFim;

    switch (value) {
      case "1":
        dataInicio = hoje;
        dataFim = hoje;
        break;

      case "7":
        const diaDaSemana = hoje.getDay();

        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - (diaDaSemana === 0 ? 6 : diaDaSemana - 1));

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);

        dataInicio = inicioSemana;
        dataFim = fimSemana;
        break;

      case "15":
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        break;

      case "30":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 30);
        dataFim = hoje;
        break;

      case "12":
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 12, 1);
        dataFim = hoje;
        break;

      case "365":
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        dataFim = new Date(hoje.getFullYear(), 11, 31);
        break;

      case "0":

        dataInicio = new Date(1900, 0, 1);
        dataFim = hoje;
        break;

      case "123":

        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        dataFim = new Date(hoje.getFullYear(), 11, 31);

        break;

      default:
        console.error("Valor inválido");
        return;
    }

    const dataFormatInicio = dataInicio.toISOString().split('T')[0]
    const dataFormatFinal = dataFim.toISOString().split('T')[0]
    setDataInicial(dataFormatInicio); // YYYY-MM-DD
    setDataFinal(dataFormatFinal);

  };

  const cancelarPeriodoPersonalizado = () => {
    setShowModal(false);
    setDataInicial("");
    setDataFinal("");
    setSelectedValue("");
  };

  const categoriasFiltradasModal = categorias.filter((cat) =>
    cat.toLowerCase().includes(categoria.toLowerCase())
  );

  const categoriaEscolhidaModal = (e) => {
    setCategoriaModal(e.target.value);
  };

  const editarMovimentacao = (movimentacao) => {
    setDescricaoModal(movimentacao.descricao);
    setValorModal(movimentacao.valor);
    setTipoModal(movimentacao.tipo);
    setCategoriaModal(movimentacao.categoria.nomeCategoria);
    setDataModal(movimentacao.data);
    setMovimentacaoEditando(movimentacao.id);
    setModalIsOpenEdit(true);
  };

  const excluirMovimentacao = (id) => {
    setIdMovimentacaoExcluir(id);
    setModalAlertDeleteMovimentacao(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/movimentacoes/${idMovimentacaoExcluir}`);

      // Atualiza a lista após excluir
      await atualizarMovimentacoes();
      setModalAlertDeleteMovimentacao(false);
    } catch (error) {
      console.error("Erro ao excluir movimentação:", error);
    }
  };

  const salvarEdicaoMovimentacao = async () => {
    try {
      const movimentacaoAtualizada = {
        descricao: descricaoModal,
        valor: parseFloat(valorModal),
        tipo: tipoModal,
        categoria: categoriaModal,
        data: dataModal,
        user_id: userId,
      };

      await axios.put(`http://localhost:8080/movimentacoes/${movimentacaoEditando}`, movimentacaoAtualizada);

      // Atualiza a lista após editar
      await atualizarMovimentacoes();
      setModalIsOpenEdit(false);
      resetarCampos();
    } catch (error) {
      console.error("Erro ao salvar edição da movimentação:", error);
    }
  };

  const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}-${mes}-${ano}`;
  };

  return (
    <div className="container-relatorios">
      <div className="body-relatorios">
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="headerModalTtl">
                <div className="voltaTitulo">
                  <label className="escritoBar">Período</label>
                </div>
              </div>
              <div className="mainModalPeriodo">
                <div className="inputsDateEsquerda">
                  <label className="EscritoLabelPreto">Data Inicial</label>
                  <input
                    type="date"
                    className="inputDatePeriodo"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)} />
                  <button
                    className="close-button"
                    onClick={cancelarPeriodoPersonalizado}>Cancelar</button>
                </div>
                <div className="meioModalPeriodo">
                  <label>Até</label>
                </div>
                <div className="inputsDateDireita">
                  <label>Data final</label>
                  <input
                    type="date"
                    className="inputDatePeriodo"
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)} />
                  <button
                    onClick={() => {
                      setShowModal(false);
                      aplicarFiltros();
                    }}
                    className="close-button"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="filtros">
          <div className="header-filtros">
            <h2 className="h2Filtros">
              <u>Filtros</u>
            </h2>
          </div>
          <div className="body-filtros">
            <div className="escolhas">
              <label className="ttlSelecao">Periodo:</label>
              <select
                name="slcDias"
                id="slcDias"
                className="slcPrincipais"
                value={selectedValue}
                onChange={handleSelectChange}
              >
                <option value=""></option>
                <option value="1">Hoje</option>
                <option value="7">Esta semana</option>
                <option value="15">Este mês</option>
                <option value="365">Este ano</option>
                <option value="30">Últimos 30 dias</option>
                <option value="12">Últimos 12 meses</option>
                <option value="0">Todo o período</option>
                <option value="123">Período personalizado</option>
              </select>
            </div>
            <div className="opcao-categoria-relatorios">
              <label>Categoria</label>
              <input
                className="inpt-categoria-relatorios"
                type="text"
                value={categoria}
                onChange={categoriaEscolhida}
                placeholder="Digite"
                maxLength={30}
              />
              {categoria && categoriasFiltradas.length > 0 && (
                <ul className="sugestoes-categorias">
                  {categoriasFiltradas.map((cat, index) => (
                    <li key={index} onClick={() => setCategoria(cat)}>
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* <div
              className={`mostrar-seletor-grafico ${activeTab === "grafico" ? "mostrar" : ""
                }`}
            >
              <label className="ttlSelecao">Gráfico:</label>
              <select
                name="slcGraficoRelatorios"
                id="slcGraficoRelatorios"
                className="slcPrincipais"
                value={recebeTipoGrafico}
                onChange={alteraEntreGraficos}
              >
                <option value="coluna">Coluna</option>
                <option value="pizza">Pizza</option>
              </select>
            </div> */}
            <div className="baixo-left">
              <button className="btnConfirm" onClick={aplicarFiltros}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
        <div className="body-right">
          <div className="body-header">
            <button
              className={`btnEscolhaReal ${activeTab === "movimentacao" ? "active" : ""
                }`}
              onClick={() => setActiveTab("movimentacao")}
            >
              Movimentação
            </button>
            <button
              className={`btnEscolhaReal ${activeTab === "grafico" ? "active" : ""
                }`}
              onClick={() => setActiveTab("grafico")}
            >
              Gráfico
            </button>
          </div>

          {activeTab === "movimentacao" && (
            <div className="main-movimentacao">
              <div className="painel-movimentacoes-relatorios">
                <div className="div-label-movimentacoes-relatorios">
                  <label>Todas Movimentações</label>
                </div>
                <div className="div-table-movimentacoes-relatorios">
                  <table>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data de Pagamento</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimentacoesFiltradas.map((movimentacao) => (
                        <tr key={movimentacao.id}>
                          <td>{movimentacao.descricao}</td>
                          <td>R$ {movimentacao.valor.toFixed(2)}</td>
                          <td>{formatarData(movimentacao.data)}</td>
                          <td>{movimentacao.tipo}</td>
                          <td>{movimentacao.categoria.nomeCategoria}</td>

                          <td className="td-acoes-btn">
                            <button
                              onClick={() => {
                                console.log(movimentacao);
                                editarMovimentacao(movimentacao);
                              }}
                            >
                              <FontAwesomeIcon
                                className="icon-file"
                                icon={faFilePen}
                              />
                            </button>

                            <button
                              onClick={() =>
                                excluirMovimentacao(movimentacao.id)
                              }
                            >
                              <FontAwesomeIcon
                                className="icon-trash"
                                icon={faTrashCan}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === "grafico" && (
            <div className="main-grafico">
              <div className="div-label-grafico">
                <label>Dados em Gráfico</label>
              </div>
              <div className="div-mostra-grafico">
                {/*Aqui será exibido os gráficos de colunas ou de pizza*/}
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpenEdit}
        onRequestClose={() => setModalIsOpenEdit(false)}
        contentLabel="Editar Movimentação"
        className="custom-modal"
      >
        <h2 className="title-modal">Editar Movimentação</h2>

        <div className="modal-container">
          <div className="modal-container-inputs">
            <div className="card-modal-descricao">
              <label>Descrição</label>
              <input
                type="text"
                value={descricaoModal}
                onChange={(e) => setDescricaoModal(e.target.value)}
              />
            </div>

            <div className="card-modal-valor">
              <label>Valor</label>
              <input
                type="text"
                value={valorModal}
                onChange={(e) => setValorModal(e.target.value)}
              />
            </div>

            <div className="card-modal-data">
              <label>Data</label>
              <input
                type="date"
                value={dataModal}
                onChange={(e) => setDataModal(e.target.value)}
              />
            </div>

            <div className="card-modal-opcao-categoria">
              <label>Categoria</label>
              <input
                className="inpt-categoria"
                type="text"
                value={categoriaModal}
                onChange={categoriaEscolhidaModal}
                placeholder="Digite"
                maxLength={30}
              />

              {categoriaModal && (
                <ul className="modal-sugestoes-categorias">
                  {categoriasFiltradasModal.length > 0 ? (
                    categoriasFiltradasModal.map((cat, index) => (
                      <li key={index} onClick={() => setCategoriaModal(cat)}>
                        {cat}
                      </li>
                    ))
                  ) : (
                    <div
                      className="modal-nova-categoria"
                      onClick={adicionarNovaCategoriaModal}
                    >
                      <button className="modal-btn-nova-categoria">
                        Criar categoria: "{categoriaModal}"
                      </button>
                    </div>
                  )}
                </ul>
              )}
            </div>

            <div className="card-modal-tipo">
              <label>Tipo</label>

              <div className="card-modal-tipo-input">
                <input
                  type="radio"
                  name="tipo"
                  value="entrada"
                  checked={tipoModal === "entrada"}
                  onChange={(e) => setTipoModal(e.target.value)}
                />
                <label>Entrada</label>
                <input
                  type="radio"
                  name="tipo"
                  value="saida"
                  checked={tipoModal === "saida"}
                  onChange={(e) => setTipoModal(e.target.value)}
                />
                <label>Saída</label>
              </div>
            </div>
          </div>
          <div className="modal-btns">
            <button onClick={salvarEdicaoMovimentacao}>Salvar</button>
            <button onClick={() => setModalIsOpenEdit(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalAlertDeleteMovimentacao}
        onRequestClose={() => setModalAlertDeleteMovimentacao(false)}
        contentLabel="contentDeletarMovimentacao"
        className="custom-modal-deletar-movimentacao"
      >
        <div className="modal-content-deletar-movimentacao">
          <div className="modal-div-deletar-movimentacao">
            <h2>Deletar movimentação</h2>
            <p>Você tem certeza que deseja deletar essa movimentação?</p>
          </div>
          <div className="modal-btns-deletar-movimentacao">
            <button
              className="btn-deletar-movimentacao"
              onClick={confirmarExclusao}
            >
              Deletar
            </button>
            <button
              className="btn-cancelar-deletar-movimentacao"
              onClick={() => setModalAlertDeleteMovimentacao(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Relatorios;
