const conexao = require("../servicos/conexao");
const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const palavraChave = require("../../palavraChave");
const pwd = securePassword();

/*-----------------------------------------------------------------*/

const cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Parâmetros Obrigatórios Não Informados" });
  }

  try {
    const query = "select * from usuarios where email = $1";
    const usuario = await conexao.query(query, [email]);

    if (usuario.rowCount !== 0) {
      return res.status(404).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }
  } catch (error) {
    console.log({ mensagem: error.message });
    return res.status(500).send();
  }

  try {
    /*Hash da Senha*/
    const userPassword = Buffer.from(senha);
    const hashSenha = (await pwd.hash(userPassword)).toString("hex");

    const query =
      "insert into usuarios (nome, email, senha) values ($1, $2, $3)";
    const usuario = await conexao.query(query, [nome, email, hashSenha]);

    if (usuario.rowCount === 0) {
      return res.status(400).json({ mensagem: "O usuário não foi cadastrado!" });
    }

    try {
      const query = "select id, nome, email from usuarios where email = $1";
      const usuario = await conexao.query(query, [email]);

      return res.status(200).json(usuario.rows[0]);
    } catch (error) {
      return console.log({ mensagem: error.message });
    }
  } catch (error) {
    return console.log({ mensagem: error.message });
  }
};

/*-----------------------------------------------------------------*/

const logar = async (req, res) => {
  const { usuario } = req.body;

  try {
    const token = jwt.sign(
      {
        id: usuario.id,
      },
      palavraChave,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

/*-----------------------------------------------------------------*/

const listarPerfil = async (req, res) => {

  const { usuario_id } = req.body;

  try {
    const query = 'select * from usuarios where id = $1';
    const { rows } = await conexao.query(query, [usuario_id]);
    const { senha, ...usuario } = rows[0];
    return res.status(200).json(usuario);
  } catch (error) {
    return console.log({ mensagem: error.message });
  }
};

/*-----------------------------------------------------------------*/

const editarPerfil = async (req, res) => {
  const { nome, email, senha, usuario_id } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ Mensagem: "parâmetro obrigatório não informado" });
  }

  try {
    const query = "select * from usuarios where email = $1 and id != $2";
    const usuario = await conexao.query(query, [email, usuario_id]);

    if (usuario.rowCount !== 0) {
      return res.status(400).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }
  } catch (error) {
    return console.log({ mensagem: error.message });
  }

  try {
    const userPassword = Buffer.from(senha);
    const hashSenha = (await pwd.hash(userPassword)).toString("hex");
    const queryUpdate = "update usuarios set nome=$1, email=$2, senha=$3 where id = $4";

    const detailUpdate = await conexao.query(queryUpdate, [
      nome,
      email,
      hashSenha,
      usuario_id,
    ]);

    return res.status(204).send();
  } catch (error) {
    return console.log({ mensagem: error.message });
  }
};

module.exports = {
  cadastrar,
  logar,
  listarPerfil,
  editarPerfil,
};