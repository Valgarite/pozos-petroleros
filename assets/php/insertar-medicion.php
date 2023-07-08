<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

header('Location: ../../');

include_once('conexion.php');
$results = array();
$json_array = [];

if(isset($_POST['nombre_pozo2']) && isset($_POST['hora_medida']) && isset($_POST['psi'])){

    if(!empty($_POST['nombre_pozo2']) && !empty($_POST['hora_medida']) && !empty($_POST['psi'])){

        $id_pozo = $_POST['nombre_pozo2'];
        $timestamp = $_POST['hora_medida'];
        $psi = $_POST['psi'];

        $query = "INSERT INTO medicion(Pozo_idPozo, timestamp, PSI) VALUES ('$id_pozo', '$timestamp', '$psi')";
        $rs    = mysqli_query($conn, $query) or die(mysqli_error($conn));
        
        if($rs == true){
            $json_array = array(
                "resp" => "success",
                "message" => "medición registrada"
            );
            array_push($results, $json_array);
        }else{
            $json_array = array(
                "resp" => "error",
                "message" => "medición NO registrada"
            );
            array_push($results, $json_array);
        }

    }else{
        $json_array = array(
            "resp" => "error",
            "message" => "Datos de medición vacíos"
        );
        array_push($results, $json_array);
    }

}else{
    $json_array = array(
        "resp" => "error",
        "message" => "No existe un envío de los datos de la medición"
    );
    array_push($results, $json_array);
}

$json_response=json_encode($results);
echo $json_response;
mysqli_close($conn);
?>