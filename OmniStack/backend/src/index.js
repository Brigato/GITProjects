/*jshint esversion: 6 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');

const routes = require("./routes");
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  "mongodb+srv://omnistack:omnistack321@cluster0-jaeqr.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);
// this is needed to stop the warning:
// (node:20716) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// mongoose.set("useCreateIndex", true);

app.use(cors());  // allow all
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(routes);

// Methods HTTP: GET, POST, PUT, DELETE

// Tipos de parametros:

// Query params: req.query (filtros, ordenacao, paginacao, ...)
// Route Params: request.params (identificar u,m recurso na alteracao ou remocao)
// Body: request.body (Dados para criacao ou alteracao de um registro)

// MongoDB (Nao-relacional)  -- omnistack - r%ox15uNJjM&

server.listen(3333);
