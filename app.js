const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");

//HTTP server
const http = require("http-server");
const server = http.createServer();
server.listen(3000, function(req, res) {
  console.log("Server has been started...");
});

//Web Socket
const WebSocket = require('ws');
const ws_server = new WebSocket.Server({port:3030});
ws_server.on('connection', ws => {
    ws.on('message', message => {
        ws_server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) client.send(message);
        });
    });
});

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

//app.use(express.cookieDecoder());
//app.use(express.session());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "ch4tter",
    password: "ins3cwetr4st",
    port: "3306"
});

//app.set("view engine", "hbs");

//переключение между страницами
app.get("/reg", urlencodedParser, function (req, res) {   
  res.sendFile(__dirname + "/sign_up.html");
});

app.get("/main", urlencodedParser, function (req, res) {   
  res.sendFile(__dirname + "/index.html");
});

app.get("/log_in", urlencodedParser, function (req, res) {   
  res.sendFile(__dirname + "/sign_in.html");
});

//регистрация пользователя, добавление данных в БД
app.post("/reg", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const login = req.body.login;
  const password = req.body.password;
  const hash = bcrypt.hashSync(password, 10);
  pool.query("INSERT INTO users (login, password) VALUES (?,?)", [login, hash], function(err) {
    if(err) return console.log(err);
    res.redirect("/main");
  });
});

//вход в аккаунт, проверка 
app.post("/log_in", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const login = req.body.login;
  const password = req.body.password;
  
  (function pass_check() {
    //достаём из бд хэш пароля, соответствующий введённому логину
    pool.query("SELECT password FROM users WHERE login = ?", [login], (err, rows) => {
      if (err) return console.log(err.message);
      //проверяем правильность введённого пароля
      bcrypt.compare(password, rows[0].password)
      .then(result => {
        if (result) {
          //если true -> на главную страницу
          res.redirect("/main");
        }
        else alert("Password is incorrect");
      });
    });
  })();
});

app.post("/main", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);

  const messages = document.getElementById('messages');
  const form = document.getElementById('form');
  const input = document.getElementById('input');

  const ws = new WebSocket('ws://localhost:3000');

  function printMessage(value) {
      const li = document.createElement('li');
      li.innerHTML = value;
      messages.appendChild(li);
  }

  form.addEventListener('submit', event => {
      console.log(event);
      event.preventDefault();
      ws.send(input.value);
      input.value = '';
  });

  ws.onmessage = response => printMessage(response.data);
});

app.listen(8080);