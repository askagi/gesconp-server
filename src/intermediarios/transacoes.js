const conexao = require('../servicos/conexao');

const validarDados = async (req, res, next) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    if (!tipo && tipo !== 'saida' && tipo !== 'entrada') {
        return res.status(400).json({ mensagem: 'O campo tipo é obrigatório. Valores permitido: entrada ou saida' });
    }

    if (!descricao) {
        return res.status(400).json({ mensagem: 'O campo descrição é obrigatório' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O campo obrigatorio é obrigatório' });
    }

    if (isNaN(valor) || valor < 0) {
        return res.status(400).json({ mensagem: "Para o campo Valor, informe apenas valores númericos positivos" });
    }

    if (!data) {
        return res.status(400).json({ mensagem: 'O campo Data é obrigatório' });
    }

    if (!categoria_id) {
        return res.status(400).json({ mensagem: 'O campo Categoria é obrigatório' });
    }

    if (isNaN(categoria_id) || categoria_id < 0) {
        return res.status(400).json({ mensagem: "Para o campo Categoria_id, informe apenas valores númericos positivos" });
    }

    try {
        const queryCategoria = 'select * from categorias where id = $1';
        const categoria = await conexao.query(queryCategoria, [categoria_id]);

        if (categoria.rowCount === 0) {
            return res.status(404).json({ mensagem: 'A categoria informada não exite.' });
        }
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }

    next();
}

const verificarIdTransacao = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = 'select * from transacoes where id = $1';
        const transacao = await conexao.query(query, [id]);

        if (transacao.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

module.exports = {
    validarDados,
    verificarIdTransacao
}