<?php header('Content-Type: text/html; charset=utf-8');
//this script updates relevant tables and columns in database
$addrow = "INSERT INTO WORDS (TYPEID,COMMENT) VALUES (0,'')";
$userquery = "SELECT Id FROM WORDS ORDER BY ID DESC LIMIT 1";
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
$result = $conn->query($addrow);

	$date = new DateTime('NOW');
	$txt = $date->format('Y-m-d H:i:s') . " - " . $addrow;
	$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);
$conn->close();
$conn = new mysqli($servername, $username, $password, $database);

$result = $conn->query($userquery);
	
	
	while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row; //this is encoded as an object
	}
	echo json_encode(array("result" => $rows));



?>