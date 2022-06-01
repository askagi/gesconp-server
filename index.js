const express = require("express");
const cors = require('cors');
const rotas = require("./rotas");

const app = express();
app.use(express.json());
app.use(cors());

app.use(rotas);
const porta = 3000;

app.listen(porta, () => {
  console.log(`Servidor ligado na porta: ${porta}`);
});
