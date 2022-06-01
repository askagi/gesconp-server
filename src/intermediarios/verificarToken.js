const jwt = require("jsonwebtoken");
const palavraChave = require("../../palavraChave");

const verificarToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }
    const token = authorization.replace('Bearer ', '').trim();
    try {
        const { id } = await jwt.verify(token, palavraChave);
        req.body.usuario_id = id;
        next();
    } catch (error) {
        res.status(400).json({ mensagem: 'O token fornecido é inválido' });
    }
}

module.exports = verificarToken;