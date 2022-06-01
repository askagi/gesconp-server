const conexao = require("../servicos/conexao");
const securePassword = require("secure-password");
const pwd = securePassword();

const midd_login = async (req, res, next) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Campo(s) Obrigatório(s) Não Preenchido(s)" });
  }

  const checkUser = "select * from usuarios where email = $1";
  const { rows, rowCount } = await conexao.query(checkUser, [email]);

  if (rowCount == 0) {
    return res.status(400).json({ mensagem: "Dados Incorretos" });
  }

  const usuario = rows[0];

  const verificarSenha = await pwd.verify(
    Buffer.from(senha),
    Buffer.from(usuario.senha, "hex")
  );

  switch (verificarSenha) {
    case securePassword.INVALID_UNRECOGNIZED_HASH:
    case securePassword.INVALID:
      return res.status(400).json("Dados Incorretos");
    case securePassword.VALID:
      break;
    case securePassword.VALID_NEEDS_REHASH:
      try {
        const improvedHash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = "update usuarios set senha = $1 where email = $2";
        await conexao.query(query, [improvedHash, email]);
      } catch { }
      break;
  }

  req.body.usuario = usuario;

  next();
};

module.exports = {
  midd_login,
};