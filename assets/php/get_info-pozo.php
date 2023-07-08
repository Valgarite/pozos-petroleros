<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: text/html; charset=utf-8');

include_once('conexion.php');

$pozo = $_GET['pozo'];

$result = $conn->query("SELECT * from medicion WHERE Pozo_idPozo = '$pozo' ORDER BY timestamp");
while($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

$i=0;
while ((@$rows[$i])){
    echo '<tr>';
    echo '<td>', $i+1,'</td>';
    echo '<td>', $rows[$i]['PSI'], '</td>';
    echo '<td>', $rows[$i]['timestamp'], '</td>';
    echo '</tr>';
    $i++;
}

?>