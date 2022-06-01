const express = require("express");
const rotas = express();

const ctrl_categorias = require("./src/controladores/categorias");
const ctrl_usuarios = require("./src/controladores/usuarios");
const ctrl_transacoes = require("./src/controladores/transacoes");

const midd_transacoes = require("./src/intermediarios/transacoes");
const { midd_login } = require("./src/intermediarios/midd_login");
const verificarToken = require("./src/intermediarios/verificarToken");


rotas.post("/usuario", ctrl_usuarios.cadastrar); // OK
rotas.post("/login", midd_login, ctrl_usuarios.logar); //OK
rotas.get("/usuario", verificarToken, ctrl_usuarios.listarPerfil); //OK
rotas.put("/usuario", verificarToken, ctrl_usuarios.editarPerfil); // OK

rotas.get("/categorias", verificarToken, ctrl_categorias.listarTodas); // OK

rotas.get("/transacao", verificarToken, ctrl_transacoes.listar); //OK
rotas.post("/transacao", verificarToken, midd_transacoes.validarDados, ctrl_transacoes.cadastrar); // Ok
rotas.get("/transacao/:id", verificarToken, ctrl_transacoes.detalhar); // Ok
rotas.put("/transacao/:id", verificarToken, midd_transacoes.verificarIdTransacao, midd_transacoes.validarDados, ctrl_transacoes.editar); //OK
rotas.delete("/transacao/:id", verificarToken, midd_transacoes.verificarIdTransacao, ctrl_transacoes.deletar); //OK
rotas.get("/transacoes/extrato", verificarToken, ctrl_transacoes.extrato); // Ok

module.exports = rotas;