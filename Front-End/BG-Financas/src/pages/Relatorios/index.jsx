import React, { useState } from 'react';
import './index.css'

function Relatorios() {
    const [activeTab, setActiveTab] = useState('movimentacao');

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState('');
    const [movimentacoes, setMovimentacoes] = useState([]);

    const calcularValores = () => {

        const receitaMesal = movimentacoes.filter(movimentacao => movimentacao.tipo === 'entrada').reduce((total, movimentacao) => total + movimentacao.valor, 0);
        const despesaMesal = movimentacoes.filter(movimentacao => movimentacao.tipo === 'saida').reduce((total, movimentacao) => total + movimentacao.valor, 0);
        const saldoMesal = receitaMesal - despesaMesal;

        return { receitaMesal, despesaMesal, saldoMesal };

    }

    const { receitaMesal, despesaMesal, saldoMesal } = calcularValores();

    const adicionarMovimentacao = () => {

        const novaMovimentacao = {

            id: new Date().getTime(),
            descricao,
            valor: parseFloat(valor),
            tipo,
            categoria,
            data,

        };

        setMovimentacoes([...movimentacoes, novaMovimentacao]);

        setDescricao('');
        setValor('');
        setTipo('');
        setCategoria('');
        setData('');

    }

    const editarMovimentacao = () => {

    }

    const excluirMovimentacao = (id) => {
        const novasMovimentacoes = movimentacoes.filter(movimentacao => movimentacao.id !== id);
        setMovimentacoes(novasMovimentacoes);
    }

    const formatarData = (dataISO) => {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}-${mes}-${ano}`;
    };

    return (
        <div className="container-relatorios">
            <div className="body-relatorios">
                <div className="filtros">
                    <div className="header-filtros">
                        <h2 className='h2Filtros'><u>Filtros</u></h2>
                    </div>
                    <div className="body-filtros">
                        {/* <div className="escolhas">
                            <label className='ttlSelecao'>Gráfico:</label>
                            <select name="slcGrafico" id="slcGrafico" className="slcPrincipais" onChange={handleGraficoChange}>
                                <option value=""></option>
                                <option value="pizza">Pizza</option>
                                <option value="barras">Barras</option>
                                <option value="colunas">Colunas</option>
                            </select>
                        </div> */}
                        <div className="escolhas">
                            <label className='ttlSelecao'>Mês:</label>
                            <select name="slcDias" id="slcDias" className="slcPrincipais" >
                                <option value="Janeiro">Janeiro</option>
                                <option value="Fevereiro">Fevereiro</option>
                                <option value="Março">Março</option>
                                <option value="Abril">Abril</option>
                                <option value="Maio">Maio</option>
                                <option value="Junho">Junho</option>
                                <option value="Julho">Julho</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Setembro">Setembro</option>
                                <option value="Outubro">Outubro</option>
                                <option value="Novembro">Novembro</option>
                                <option value="Dezembro">Dezembro</option>
                            </select>
                        </div>
                        <div className="divCategorias">
                            <label className='ttlSelecao'>Categorias: </label>
                            <div className="escolhas-categorias">
                                <input type="checkbox" value="Alimentação" />
                                <label className='ttlSelecao'>Alimentação</label>
                            </div>
                            <div className="escolhas-categorias">
                                <input type="checkbox" value="Transporte" />
                                <label className='ttlSelecao'>Transporte</label>
                            </div>
                            <div className="escolhas-categorias">
                                <input type="checkbox" value="Lazer" />
                                <label className='ttlSelecao'>Lazer</label>
                            </div>
                            <div className="escolhas-categorias">
                                <input type="checkbox" value="Saúde" />
                                <label className='ttlSelecao'>Saúde</label>
                            </div>
                            <div className="escolhas-categorias">
                                <input type="checkbox" value="Moradia" />
                                <label className='ttlSelecao'>Moradia</label>
                            </div>
                            <div className="escolhas-categorias">
                                <input type="checkbox" value="Outros" />
                                <label className='ttlSelecao'>Outros</label>
                            </div>
                        </div>
                        <div className="baixo-left">
                            <button className='btnConfirm'>Confirmar</button>
                        </div>
                    </div>
                </div>
                <div className="body-right">
                    <div className="body-header">
                        <button
                            className={`btnEscolhaReal ${activeTab === 'movimentacao' ? 'active' : ''}`}
                            onClick={() => setActiveTab('movimentacao')}
                        >
                            Movimentação
                        </button>
                    </div>

                    {activeTab === 'movimentacao' && (
                        <div className="main-movimentacao">
                            <div className='painel-movimentacoes'>
                                <div className='div-label-movimentacoes'>
                                    <label>Últimas Movimentações</label>
                                </div>
                                <div className='div-table-movimentacoes'>
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
                                            {movimentacoes.slice().map(movimentacao => (
                                                <tr key={movimentacao.id}>
                                                    <td>{movimentacao.descricao}</td>
                                                    <td>R$ {movimentacao.valor.toFixed(2)}</td>
                                                    <td>{formatarData(movimentacao.data)}</td>
                                                    <td>{movimentacao.tipo}</td>
                                                    <td>{movimentacao.categoria}</td>
                                                    <td className='td-acoes-btn'>
                                                        <button onClick={editarMovimentacao}><img src="./images/editar.svg" alt="Editar" /></button>
                                                        <button onClick={() => excluirMovimentacao(movimentacao.id)}><img src="./images/lixeira.svg" alt="Excluir" /></button>
                                                    </td>

                                                </tr>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}

export default Relatorios;
