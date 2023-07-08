<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
// header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

include_once("conexion.php");

// echo 'holaa';
// Obtener los valores del enum
$result = $conn->query("SHOW COLUMNS FROM pozo WHERE Field = 'Estado'");
$result2 = $conn->query("SELECT * FROM pozo");

$row = $result->fetch_array(MYSQLI_ASSOC);
while($row2 = $result2->fetch_assoc()) {
    $rows[] = $row2;
}

$enumList = explode(",", str_replace("'", "", substr($row['Type'], 5, (strlen($row['Type'])-6))));

$json_response = array(
    "pozos" => $rows,
    "estados" => $enumList,
);

$json_response = json_encode($json_response);

echo $json_response;

// echo 'holaaaa';


?>