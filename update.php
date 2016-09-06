<?php header('Content-Type: text/html; charset=utf-8');
//this script updates relevant tables and columns in database
$userquery = $_GET['updatequery'];
$servername = "localhost";
$username = "root"; 
$password = "password"; 
$database = "languages";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
  	$error = ["ERROR","CONNECTION FAIL"];
	echo json_encode(array("result" => $error)); 
	die;
	}
mysqli_set_charset($conn,"utf8");
$result = $conn->multi_query($userquery);
if(!$result){
	$error = ["ERROR","INVALID QUERY"];
	echo json_encode(array("result" => $error));
	die;
} else {
	echo json_encode(array("result" => $userquery));
	$date = new DateTime('NOW');
	$txt = $date->format('Y-m-d H:i:s') . " - " . $userquery;
	$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);
}
$conn->close();
?>