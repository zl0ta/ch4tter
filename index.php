<?php
  	session_start();
    $UID = $_SESSION['username'];
    if (!isset($UID)) header("Location: sign_up.php");
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title> Cha4tter </title>
        <meta name="viewport" content="width=device-width, initial_scale=1.0">
        <link rel="stylesheet" href="css/index.css">
        
    </head>
    <body class="background">
        <div class="header">
            <h1 class="ch4tter-logo">Ch4tter</h1>
            <span class="chat-title">&nbsp&nbsp - &nbsp *chosen chat room title*</span>
        </div>
        <div class="main-box">
            <div class="chat-list">
                <form>
                    <p>chat-list</p>
                    <input type="search" placeholder="Search">
                </form>
            </div>
            <div class="chat-window">
                <p>chat-window</p>
            </div>
        </div> 
    </body>
</html>