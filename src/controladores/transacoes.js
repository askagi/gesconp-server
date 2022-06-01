const conexao = require('../servicos/conexao');

const listar = async (req, res) => {
    const { usuario_id } = req.body; // id que vem do token
    // const { filtro } = req.query;

    try {
        const query = 'select t.id, t.tipo, t.descricao, t.valor, t.data, t.categoria_id, t.usuario_id, c.descricao as categoria_nome from transacoes t join categorias c on c.id = t.categoria_id where usuario_id = $1 order by t.data desc';
        const transacoes = await conexao.query(query, [usuario_id]);
        return res.status(200).json(transacoes.rows);

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const detalhar = async (req, res) => {

    const { usuario_id } = req.body;
    const { id } = req.params;

    try {
        const query = 'select t.id, t.tipo, t.descricao, t.valor, t.data, t.categoria_id, t.usuario_id, c.descricao as categoria_nome from transacoes t join categorias c on c.id = t.categoria_id where t.usuario_id = $1 and t.id = $2';
        const transacao = await conexao.query(query, [usuario_id, id]);

        if (transacao.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Transação não encontrada.' });
        }

        return res.status(200).json(transacao.rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: error.messge });
    }
}

const cadastrar = async (req, res) => {

    const { usuario_id } = req.body; // id que vem do token

    const { tipo, descricao, valor, data, categoria_id } = req.body;

    try {
        const query = 'insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) values ($1, $2, $3, $4, $5, $6)';
        const transacao = await conexao.query(query, [tipo, descricao, valor, data, categoria_id, usuario_id]);

        if (transacao.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel regista a transação' })
        }

        try {
            const querySelect = 'select t.id, t.tipo, t.descricao, t.valor, t.data, t.categoria_id, t.usuario_id, c.descricao as categoria_nome from transacoes t join categorias c on c.id = t.categoria_id where t.usuario_id = $1 order by t.id desc limit 1';
            const ultimaTransacao = await conexao.query(querySelect, [usuario_id]);

            if (ultimaTransacao.rowCount === 0) {
                return res.status(404).json({ mensagem: 'Transação não encontrada.' });
            }

            return res.status(200).json(ultimaTransacao.rows);
        } catch (error) {
            return res.status(200).json({ mensagem: error.message });
        }

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const editar = async (req, res) => {
    const { usuario_id } = req.body;
    const { id } = req.params;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    try {
        const query = `update transacoes set
                tipo = $1,
                descricao = $2,
                valor = $3,
                data = $4,
                categoria_id = $5,
                usuario_id = $6
                where usuario_id = $6 and id = $7`;
        const transacao = await conexao.query(query, [tipo, descricao, valor, data, categoria_id, usuario_id, id]);

        if (transacao.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel editar a transação' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const deletar = async (req, res) => {
    const { usuario_id } = req.body;
    const { id } = req.params;

    try {
        const query = 'delete from transacoes where id = $1 and usuario_id = $2';
        const transacao = await conexao.query(query, [id, usuario_id]);

        if (transacao.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível deletar a transação.' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const extrato = async (req, res) => {
    const { usuario_id } = req.body;

    try {
        // const query = 'select tipo, sum(valor) as valor from transacoes where usuario_id = $1 group by tipo';
        const query = 'select tipo, valor from transacoes where usuario_id = $1';
        const resultado = await conexao.query(query, [usuario_id]);


        const extrato = {
            entrada: 0,
            saida: 0
        }

        resultado.rows.forEach(transacao => {
            if (transacao.tipo === 'entrada') {
                extrato.entrada += Number(transacao.valor);
            }
            if (transacao.tipo === 'saida') {
                extrato.saida += Number(transacao.valor);
            }

        });


        // if(resultado.rowCount)

        // if (resultado.rowCount !== 0) {
        //     extrato.entrada = resultado.rows[0].valor ? resultado.rows[0].valor : 0;
        //     extrato.saida = resultado.rows[1].valor ? resultado.rows[1].valor : 0;
        // }

        return res.status(200).json(extrato)
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}




module.exports = {
    listar,
    cadastrar,
    editar,
    deletar,
    extrato,
    detalhar
};