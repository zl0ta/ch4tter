<?php
  if (isset($_SESSION)) {
    session_destroy(); // restart
  }
  session_start();
  $link = mysqli_connect("localhost", "root", "root", "");

  //перевірка під'єднання до БД
  if (!$link) {
    echo "Помилка: неможливо встановити з'єднання з MySQL." . PHP_EOL;
    echo "Код помилки errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Текст помилки error: " . mysqli_connect_error() . PHP_EOL;
    exit;
  }

  //відправляємо запит до БД
  $link->query("SET NAMES 'utf8'");

  //алгоритм реєстрації нового користувача з перевіркою 1) на наявність введеного логіна в базі, 2) заповнеість всіх полів
  $stmt = mysqli_stmt_init($link);
  if (mysqli_stmt_prepare($stmt, 'INSERT INTO `users` (`login`, `password`) VALUES (?, ?)')) {
    mysqli_stmt_bind_param($stmt, "sss", $login, $password);

    $login = $_POST['login'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    if (empty($_POST['password']) || empty ($name) || empty($login)) {
       die("Fill in all the fields first!");
    }

    if (mysqli_stmt_execute($stmt)) {
        echo "You have registered successfully!";
        $_SESSION['username'] = $login;
        $UID = $_SESSION['username'];
        echo "<script>window.location.href=\"/index.php\";</script>";
    }
    mysqli_stmt_close($stmt);
  }

  $link->close();
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title> Registration </title>
        <meta name="viewport" content="width=device-width, initial_scale=1.0">
        <link rel="stylesheet" href="css/sign_up_in.css">
        <link rel="stylesheet" href="css/index.css">
    </head>
    <body class="background">
        <div class="container">
            <h1>Registration</h1>
            <div>
                <form>
                    <input type="text" name="login" placeholder="Login">
                    <input type="password | text" name="password" placeholder="Password">
                    <!---<input type="password | text" placeholder="Confirm password">--->
                    <input type="submit" value="Sign up">
                </form>
            </div>
        </div> 
    </body>
</html>