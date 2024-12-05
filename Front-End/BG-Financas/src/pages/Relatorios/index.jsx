import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import "./index.css";

function Relatorios() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [movimentacoesFiltradas, setMovimentacoesFiltradas] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [activeTab, setActiveTab] = useState("movimentacao");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);

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

  const comfirmaFiltro = () => {
    const filtradas = movimentacoes.filter((movimentacao) =>
      movimentacao.categoria.nomeCategoria
        .toLowerCase()
        .includes(categoria.toLowerCase())
    );
    setMovimentacoesFiltradas(filtradas);
    setCategoriasFiltradas('')
    setCategoria('')


    
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
                  <input type="date" className="inputDatePeriodo" />
                  <button className="close-button">Cancelar</button>
                </div>
                <div className="meioModalPeriodo">
                  <label>Até</label>
                </div>
                <div className="inputsDateDireita">
                  <label>Data final</label>
                  <input type="date" className="inputDatePeriodo" />
                  <button
                    onClick={() => setShowModal(false)}
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
            {/* <div className="escolhas">
                          <label className='ttlSelecao'>Gráfico:</label>
                          <select name="slcGrafico" id="slcGrafico" className="slcPrincipais" onChange={handleGraficoChange}>
                              <option value=""></option>
                              <option value="pizza">Pizza</option>
                              <option value="colunas">Colunas</option>
                          </select>
                      </div> */}
            <div className="escolhas">
              <label className="ttlSelecao">Periodo:</label>
              <select
                name="slcDias"
                id="slcDias"
                className="slcPrincipais"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
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
                className="inpt-categoria"
                type="text"
                value={categoria}
                onChange={categoriaEscolhida}
                placeholder="Digite"
                maxLength={30}
              />

              {categoriasFiltradas.length > 0 && (
                <ul className="sugestoes-categorias">
                  {categoriasFiltradas.map((cat, index) => (
                    <li key={index} onClick={() => setCategoria(cat)}>
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
              <div
                className={`mostrar-seletor-grafico ${
                  activeTab === "grafico" ? "mostrar" : ""
                }`}
              >
                <label className="ttlSelecao">Gráfico:</label>
                <select
                  name="slcGraficoRelatorios"
                  id="slcGraficoRelatorios"
                  className="slcPrincipais"
                >
                  <option value=""></option>
                  <option value="coluna">Coluna</option>
                  <option value="pizza">Pizza</option>
                </select>
              </div>
            </div>
            <div className="baixo-left">
              <button className="btnConfirm" onClick={comfirmaFiltro}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
        <div className="body-right">
          <div className="body-header">
            <button
              className={`btnEscolhaReal ${
                activeTab === "movimentacao" ? "active" : ""
              }`}
              onClick={() => setActiveTab("movimentacao")}
            >
              Movimentação
            </button>
            <button
              className={`btnEscolhaReal ${
                activeTab === "grafico" ? "active" : ""
              }`}
              onClick={() => setActiveTab("grafico")}
            >
              Gráfico
            </button>
          </div>

          {activeTab === "movimentacao" && (
            <div className="main-movimentacao">
              <div className="painel-movimentacoes">
                <div className="div-label-movimentacoes">
                  <label>Últimas Movimentações</label>
                </div>
                <div className="div-table-movimentacoes">
                  <table>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
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
              <div className="div-label-movimentacoes">
                <label>Dados no Gráfico</label>
              </div>
              {exibirGrafico && renderGrafico()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
