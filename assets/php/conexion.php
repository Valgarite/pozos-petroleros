<?php

$host = "localhost";
$user = "root";
$pass = "";
$db   = "progweb";

$conn = mysqli_connect($host, $user, $pass, $db);

if(!$conn){
    die(mysqli_error($conn));
}else{
    //echo "Conectado", "<br>";
}
// printf("Conjunto de caracteres inicial: %s\n", $conn->character_set_name());

?>