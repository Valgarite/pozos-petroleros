<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

header('Location: ../../index.html');

include_once('conexion.php');
$results = array();
$json_array = [];

if(isset($_POST['Nombre']) && isset($_POST['Estado'])){

    if(!empty($_POST['Nombre']) && !empty($_POST['Estado'])){

        $nombre = $_POST['Nombre'];
        $estado = $_POST['Estado'];

        $query = "INSERT INTO Pozo(nombre, estado) VALUES ('$nombre', '$estado')";
        $rs    = mysqli_query($conn, $query) or die(mysqli_error($conn));
        
        if($rs == true){
            $json_array = array(
                "resp" => "success",
                "message" => "Pozo registrado"
            );
            array_push($results, $json_array);
        }else{
            $json_array = array(
                "resp" => "error",
                "message" => "Pozo NO registrado"
            );
            array_push($results, $json_array);
        }

    }else{
        $json_array = array(
            "resp" => "error",
            "message" => "Datos de Pozo vacíos"
        );
        array_push($results, $json_array);
    }

}else{
    $json_array = array(
        "resp" => "error",
        "message" => "No existe un envío de los datos del Pozo"
    );
    array_push($results, $json_array);
}

$json_response=json_encode($results);
echo $json_response;
mysqli_close($conn);
?>