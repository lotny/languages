<?php header('Content-Type: text/html; charset=utf-8');
error_reporting(E_ERROR); //stops displaying warnings/errors, I can create my own errors and pass them with json
$userquery = $_GET['userquery'];
$servername = "localhost";
$username = "guest"; //root
$password = "guest"; //password
$database = "languages";
$sqlTable = "";

$conn = new mysqli($servername, $username, $password, $database) or die("unable to connect");
if ($conn->connect_error) {
  	$error = ["ERROR","CONNECTION FAIL"];
	echo json_encode(array("result" => $error)); 
	die;
	}
mysqli_set_charset($conn,"utf8");
$result = $conn->query($userquery);
if(!$result){
	$error = ["ERROR","INVALID QUERY"];//if I don't have [] the error will be displayed one by one.
	echo json_encode(array("result" => $error));
	die;
}
if($result->num_rows >0){
while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row; //this is encoded as an object
    }
echo json_encode(array("result" => $rows));
}else{
$error = ["ERROR","INVALID SYNTAX"];
echo json_encode(array("result" => $error));}
$conn->close();
?>