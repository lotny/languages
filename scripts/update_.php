<?php header('Content-Type: text/html; charset=utf-8');
//this script updates relevant tables and columns in database
$userquery = $_GET['updatequery'];
$servername = "localhost";
$username = "languag5_updater"; 
$password = "updater32167"; 
$database = "languag5_languages";
//change string to an array and execute each query one by one:
$userqueries = explode(";",$userquery);

//connect to the server:
$conn = mysql_connect($servername,$username,$password) or
    die(mysql_error());
mysql_select_db($database);

if ($conn->connect_error) {
  	$error = ["ERROR","CONNECTION FAIL"];
	echo json_encode(array("result" => $error));
	die;
	}
mysql_query("SET CHARSET UTF8"); //ensure that we are not losing special characters
foreach ($userqueries as &$update){
	if ($update != ""){
$result = mysql_query($update);
if(!$result){ //log query with failure
	$date = new DateTime('NOW');
	$txt = $date->format('Y-m-d H:i:s') . " - " . $update . " (failure)";
	$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);
	$update = "failure";
} else { //log query with success
	$date = new DateTime('NOW');
	$txt = $date->format('Y-m-d H:i:s') . " - " . $update . " (success)";
	$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);
	$update = "success";
}
}
}
echo json_encode(array("result" => $userqueries));
unset($update);//clear memory?
mysql_close($conn);//close the connection
?>