import React, { useState } from 'react';
import './index.css';

function Painel() {

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [categoria, setCategoria] = useState('');
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
            horario: new Date().toLocaleString(),

        };

        setMovimentacoes([...movimentacoes, novaMovimentacao]);

        setDescricao('');
        setValor('');
        setTipo('');
        setCategoria('');

    }

    const editarMovimentacao = () => {

    }

    const excluirMovimentacao = (id) => {
        const novasMovimentacoes = movimentacoes.filter(movimentacao => movimentacao.id !== id);
        setMovimentacoes(novasMovimentacoes);
    }


    const corSaldo = saldoMesal <= 0 ? '#DB3A34' : '#2b8293';

    return (

        <div className='painel-container'>

            <div className='painel'>

                <div className='card1'>

                    <div className='div-renda-mensal'>

                        <label>Renda Mensal</label>

                    </div>

                    <div className='div-valor-renda-mensal'>

                        <span>+R$ {receitaMesal.toFixed(2)}</span>

                    </div>

                </div>

                <div className='card2'>

                    <div className='div-despesa-mensal'>

                        <label>Despesa Mensal</label>

                    </div>

                    <div className='div-valor-despesa-mensal'>

                        <span>-R$ {despesaMesal.toFixed(2)}</span>

                    </div>

                </div>

                <div className='card3'>

                    <div className='div-saldo'>

                        <label>Saldo</label>

                    </div>

                    <div className='div-valor-saldo'>

                        <span style={{ color: corSaldo }}>R$ {saldoMesal.toFixed(2)}</span>

                    </div>

                </div>

            </div>

            <div className='painel-opcoes'>

                <div className='opcao-descricao'>

                    <label>Descrição</label>

                    <input type="text" placeholder='Ex: Conta de luz' value={descricao} onChange={(e) => setDescricao(e.target.value)} />

                </div>

                <div className='opcao-valor'>

                    <label>Valor</label>

                    <input type="text" placeholder='Ex: 35.00' value={valor} onChange={(e) => setValor(e.target.value)} />

                </div>

                <div className='opcao-tipo'>

                    <label>Tipo</label>

                    <div className='inpt-tipo'>

                        <input type="radio" name="tipo" value="entrada" checked={tipo === 'entrada'} onChange={(e) => setTipo(e.target.value)} />

                        <label>Entrada</label>

                        <input type="radio" name="tipo" value="saida" checked={tipo === 'saida'} onChange={(e) => setTipo(e.target.value)} />

                        <label>Saída</label>

                    </div>

                </div>

                <div className='opcao-categoria'>

                    <label>Categoria</label>

                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>

                        <option value="">Selecione</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Lazer">Lazer</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Moradia">Moradia</option>
                        <option value="Outros">Outros</option>

                    </select>

                </div>

                <div className='div-btn-adicionar'>

                    <button className='btn-adicionar' onClick={adicionarMovimentacao}>

                        Adicionar

                    </button>

                </div>

            </div>

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
                                    <td>{movimentacao.horario}</td>
                                    <td>{movimentacao.tipo}</td>
                                    <td>{movimentacao.categoria}</td>

                                    <td className='td-acoes-btn'>
                                        <button onClick={editarMovimentacao}><img src="./images/editar.svg" alt="Editar" /></button>
                                        <button onClick={() =>excluirMovimentacao(movimentacao.id)}><img src="./images/lixeira.svg" alt="Excluir" /></button>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Painel;
