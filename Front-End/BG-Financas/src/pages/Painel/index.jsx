import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";

import "./index.css";

function Painel() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [movimentacaoEditando, setMovimentacaoEditando] = useState(null);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);

  const [modalAlertCamposVazios, setModalAlertCamposVazios] = useState(false);
  const [modalAlertDeleteMovimentacao, setModalAlertDeleteMovimentacao] =
    useState(false);
  const [idMovimentacaoExcluir, setIdMovimentacaoExcluir] = useState(null);

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

  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);

  const [categoriaModal, setCategoriaModal] = useState("");
  const [tipoModal, setTipoModal] = useState("");
  const [valorModal, setValorModal] = useState("");
  const [dataModal, setDataModal] = useState("");
  const [descricaoModal, setDescricaoModal] = useState("");

  const userId = Number(localStorage.getItem("userId"));
  console.log('Usuário: ' + userId);

  const atualizarMovimentacoes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/movimentacoes/user/${userId}`);
      setMovimentacoes(response.data);
    } catch (error) {
      console.error("Erro ao atualizar movimentações:", error);
    }
  };

  useEffect(() => {
    atualizarMovimentacoes();
  }, [userId]);  

  const calcularValores = () => {
    const receitaMesal = movimentacoes
      .filter((movimentacao) => movimentacao.tipo === "entrada")
      .reduce((total, movimentacao) => total + movimentacao.valor, 0);
    const despesaMesal = movimentacoes
      .filter((movimentacao) => movimentacao.tipo === "saida")
      .reduce((total, movimentacao) => total + movimentacao.valor, 0);
    const saldoMesal = receitaMesal - despesaMesal;

    return { receitaMesal, despesaMesal, saldoMesal };
  };

  const { receitaMesal, despesaMesal, saldoMesal } = calcularValores();

  const categoriaEscolhida = (e) => {
    setCategoria(e.target.value);
  };

  const categoriaEscolhidaModal = (e) => {
    setCategoriaModal(e.target.value);
  };

  const adicionarNovaCategoria = async () => {
    if (!categorias.includes(categoria)) {
      try {
        // Envia a nova categoria para o backend
        const response = await axios.post("http://localhost:8080/categorias", {
          nomeCategoria: categoria,
        });
        // Adiciona a categoria salva no banco na lista de categorias
        setCategorias([...categorias, response.data.nomeCategoria]);
        setCategoria(""); // Limpa o campo após salvar
      } catch (error) {
        console.error("Erro ao criar nova categoria:", error);
      }
    }
  };

  const adicionarNovaCategoriaModal = async () => {
    if (!categorias.includes(categoriaModal)) {
      try {
        const response = await axios.post("http://localhost:8080/categorias", {
          nomeCategoria: categoriaModal,
        });
        setCategorias([...categorias, response.data.nomeCategoria]);
        setCategoriaModal("");
      } catch (error) {
        console.error("Erro ao criar nova categoria:", error);
      }
    }
  };

  // Filtra categorias que correspondem ao que está sendo digitado
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.toLowerCase().includes(categoria.toLowerCase())
  );

  const categoriasFiltradasModal = categorias.filter((cat) =>
    cat.toLowerCase().includes(categoria.toLowerCase())
  );

  const adicionarMovimentacao = async () => {
    if (descricao === "" || valor === "" || tipo === "" || categoria === "" || data === "") {
      setModalAlertCamposVazios(true);
    } else {
      try {
        const novaMovimentacao = {
          descricao,
          valor: parseFloat(valor),
          tipo,
          categoria,
          data,
          user_id: userId,
        };
  
        await axios.post("http://localhost:8080/movimentacoes", novaMovimentacao);
  
        // Atualiza a lista após adicionar
        await atualizarMovimentacoes();
        resetarCampos();
      } catch (error) {
        console.error("Erro ao adicionar movimentação:", error);
      }
    }
  };
  

  const resetarCampos = () => {
    setDescricao("");
    setValor("");
    setTipo("");
    setCategoria("");
    setData("");

    setDescricaoModal("");
    setValorModal("");
    setDataModal("");
    setTipoModal("");
    setCategoriaModal("");
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
  

  const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}-${mes}-${ano}`;
  };

  const corSaldo = saldoMesal <= 0 ? "#DB3A34" : "#2b8293";

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
  
  return (
    <div className="painel-container">
      <div className="painel">
        <div className="card1">
          <div className="div-renda-mensal">
            <label>Renda Mensal</label>
          </div>

          <div className="div-valor-renda-mensal">
            <span>+R$ {receitaMesal.toFixed(2)}</span>
          </div>
        </div>

        <div className="card2">
          <div className="div-despesa-mensal">
            <label>Despesa Mensal</label>
          </div>

          <div className="div-valor-despesa-mensal">
            <span>-R$ {despesaMesal.toFixed(2)}</span>
          </div>
        </div>

        <div className="card3">
          <div className="div-saldo">
            <label>Saldo</label>
          </div>

          <div className="div-valor-saldo">
            <span style={{ color: corSaldo }}>R$ {saldoMesal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="painel-opcoes">
        <div className="opcao-descricao">
          <label>Descrição</label>

          <input
            className="inpt-descricao"
            type="text"
            placeholder="Ex: Conta de luz"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="opcao-valor">
          <label>Valor</label>

          <input
            className="inpt-valor"
            type="text"
            placeholder="Ex: 35.00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div className="opcao-tipo">
          <label>Tipo</label>

          <div className="inpt-tipo">
            <input
              type="radio"
              name="tipo"
              value="entrada"
              checked={tipo === "entrada"}
              onChange={(e) => setTipo(e.target.value)}
            />

            <label>Entrada</label>

            <input
              type="radio"
              name="tipo"
              value="saida"
              checked={tipo === "saida"}
              onChange={(e) => setTipo(e.target.value)}
            />

            <label>Saída</label>
          </div>
        </div>

        <div className="opcao-data">
          <label>Data de laçamento</label>

          <input
            className="inpt-data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="opcao-categoria">
          <label>Categoria</label>
          <input
            className="inpt-categoria"
            type="text"
            value={categoria}
            onChange={categoriaEscolhida}
            placeholder="Digite"
            maxLength={30}
          />

          {categoria && (
            <ul className="sugestoes-categorias">
              {categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((cat, index) => (
                  <li key={index} onClick={() => setCategoria(cat)}>
                    {cat}
                  </li>
                ))
              ) : (
                <div
                  className="nova-categoria"
                  onClick={adicionarNovaCategoria}
                >
                  <button className="btn-nova-categoria">
                    Criar categoria: "{categoria}"
                  </button>
                </div>
              )}
            </ul>
          )}
        </div>

        <div className="div-btn-adicionar">
          <button className="btn-adicionar" onClick={adicionarMovimentacao}>
            Adicionar
          </button>
        </div>
      </div>

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
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {movimentacoes.slice(-10).map((movimentacao) => (
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
                      <FontAwesomeIcon className="icon-file" icon={faFilePen} />
                    </button>

                    <button
                      onClick={() => excluirMovimentacao(movimentacao.id)}
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
        isOpen={modalAlertCamposVazios}
        onRequestClose={() => setModalAlertCamposVazios(false)}
        contentLabel="contentCampoVazio"
        className="custom-modal-campo-vazio"
      >
        <div className="modal-content-campo-vazio">
          <div className="modal-div-campo-vazio">
            <h2>Campos vazios</h2>
            <p>Por favor, preencha todos os campos.</p>
          </div>
          <div className="modal-btn-campo-vazio">
            <button onClick={() => setModalAlertCamposVazios(false)}>OK</button>
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

export default Painel;
