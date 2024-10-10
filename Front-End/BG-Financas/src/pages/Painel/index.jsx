import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

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

  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([
    "Alimentação",
    "Transporte",
    "Lazer",
    "Saúde",
    "Moradia",
    "Bonificação",
    "Educação",
  ]);

  const [categoriaModal, setCategoriaModal] = useState("");
  const [tipoModal, setTipoModal] = useState("");
  const [valorModal, setValorModal] = useState("");
  const [dataModal, setDataModal] = useState("");
  const [descricaoModal, setDescricaoModal] = useState("");

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

  const adicionarNovaCategoria = () => {
    if (!categorias.includes(categoria)) {
      setCategorias([...categorias, categoria]);
    }
    setCategoria("");
  };

  const adicionarNovaCategoriaModal = () => {
    if (!categorias.includes(categoriaModal)) {
      setCategorias([...categorias, categoriaModal]);
    }
    setCategoriaModal("");
  };

  // Filtra categorias que correspondem ao que está sendo digitado
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.toLowerCase().includes(categoria.toLowerCase())
  );

  const categoriasFiltradasModal = categorias.filter((cat) =>
    cat.toLowerCase().includes(categoriaModal.toLowerCase())
  );

  const adicionarMovimentacao = () => {
    if (
      descricao == "" ||
      valor == "" ||
      tipo == "" ||
      categoria == "" ||
      data == ""
    ) {
      setModalAlertCamposVazios(true);
    } else {
      const novaMovimentacao = {
        id: new Date().getTime(),
        descricao,
        valor: parseFloat(valor),
        tipo,
        categoria,
        data,
      };

      setMovimentacoes([...movimentacoes, novaMovimentacao]);
      resetarCampos();
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
    setCategoriaModal(movimentacao.categoria);
    setDataModal(movimentacao.data);
    setMovimentacaoEditando(movimentacao.id);
    setModalIsOpenEdit(true);
  };

  const excluirMovimentacao = (id) => {
    const novasMovimentacoes = movimentacoes.filter(
      (movimentacao) => movimentacao.id !== id
    );
    setMovimentacoes(novasMovimentacoes);
  };

  const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}-${mes}-${ano}`;
  };

  const corSaldo = saldoMesal <= 0 ? "#DB3A34" : "#2b8293";

  const salvarMovimentacao = () => {
    const novasMovimentacoes = movimentacoes.map((movimentacao) => {
      if (movimentacao.id === movimentacaoEditando) {
        return {
          ...movimentacao,
          descricao: descricaoModal,
          valor: parseFloat(valorModal),
          tipo: tipoModal,
          categoria: categoriaModal,
          data: dataModal,
        };
      }
      return movimentacao;
    });

    setMovimentacoes(novasMovimentacoes);
    setModalIsOpenEdit(false);
    resetarCampos();
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
                  <td>{movimentacao.categoria}</td>

                  <td className="td-acoes-btn">
                    <button onClick={() => editarMovimentacao(movimentacao)}>
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
            <button onClick={salvarMovimentacao}>Salvar</button>
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
    </div>
  );
}

export default Painel;
