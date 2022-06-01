const conexao = require("../servicos/conexao");

const listarTodas = async (req, res) => {
  try {
    const query = 'select * from categorias'
    const categorias = await conexao.query(query);
    return res.status(200).json(categorias.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const filtrarCategoriaUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.body; // Id do Token
    const query = "select c.id, c.descricao from categorias c join transacoes t on c.id = t.categoria_id where t.usuario_id = $1 group by c.id";
    const categorias = await conexao.query(query, [usuario_id]);
    return res.status(200).json(categorias.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  listarTodas,
  filtrarCategoriaUsuario,
};
