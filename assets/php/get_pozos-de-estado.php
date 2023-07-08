<?php
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
// header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

include_once('conexion.php');

$results = array();

$query1 = "SELECT * from medicion INNER JOIN pozo ON pozo.idPozo = medicion.Pozo_idPozo";
$query2 = "SELECT nombre, estado from pozo";

$result = mysqli_query($conn, $query1) or die(mysqli_error($conn));
$result2 = mysqli_query($conn, $query2) or die(mysqli_error($conn));

// var_dump($result);
while($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

while($row2 = $result2->fetch_assoc()) {
    $rows2[] = $row2;
}

array_push($results, $rows, $rows2);
// var_dump($rows);
$json_response = json_encode($results);

echo $json_response;


?>