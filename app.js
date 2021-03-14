const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require('ws');
const http = require("http-server");

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({port: 3000});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

wsServer.on('connection', ws => {
  ws.on('message', m => {
    wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(m);
    });
  });
  wsServer.on("error", e => wsServer.send(e));
  wsServer.send('I am a WebSocket server');
});

server.listen(3030, function() {
  console.log("Server has been started...");
});
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
app.get("/reg", function (req, res) {   
  res.sendFile(__dirname + "/sign_up.html");
});

app.get("/main", function (req, res) {   
  res.sendFile(__dirname + "/index.html");
});

app.get("/log_in", function (req, res) {   
  res.sendFile(__dirname + "/sign_in.html");
});

//регистрация пользователя, добавление данных в БД
app.post("/reg", function (req, res) {
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
app.post("/log_in", function (req, res) {
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

app.post("/main/add-chat", function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const title = req.body.title;
  const description = req.body.description;
  const user_id = 3;
  pool.query("INSERT INTO chats (title, members, description) VALUES (?,?.?)", [title, user_id, description], function(err) {
    if(err) return console.log(err);
    res.redirect("/main");
  });
});

/*app.post("/main", function (req, res) {
  if(!req.body) return res.sendStatus(400);

  const messages = req.body.messages;
  const form = req.body.form;
  const input = req.body.input;

  const ws = new WebSocket('ws://localhost:3000');

  function printMessage(value) {
      const li = req.body.createElement('li');
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
});*/

app.listen(8080);