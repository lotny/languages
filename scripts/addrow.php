<?php header('Content-Type: text/html; charset=utf-8');
//this script updates relevant tables and columns in database
$addrow = "INSERT INTO word (TypeId,Comment) VALUES (1,'')";
$userquery = "SELECT Id FROM word ORDER BY id DESC LIMIT 1";
$servername = "localhost";

$username = "languag5_updater"; 
$password = "updater32167"; 
$database = "languag5_languages";


if(function_exists('mysql_connect')){
$conn = mysql_connect($servername,$username,$password);
mysql_select_db($database);

if ($conn->connect_error) {
  	$error = ["ERROR",mysql_errno($conn)];
	echo json_encode(array("result" => $error));
	die;
	}
mysql_query("SET CHARSET UTF8"); //ensure that we are not losing special 


$result = mysql_query($addrow);
	$date = new DateTime('NOW');
	$txt = $date->format('Y-m-d H:i:s') . " - " . $addrow;
	$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);
//mysql_close($conn);

//$conn = mysql_connect($servername,$username,$password) ;
//		mysql_select_db($database);
		mysql_query("SET CHARSET UTF8");

		$result = mysql_query($userquery);
		if(!$result){
		$error = ["ERROR",mysql_errno($conn)];
		echo json_encode(array("result" => $error));
		mysql_close($conn);
		return;
	}
	if(mysql_num_rows($result) > 0){
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
		$rows[] = $row;}
		echo json_encode(array("result" => $rows));
		mysql_free_result($result);
	}else{
		$error = ["ERROR",mysql_errno($conn)];
		echo json_encode(array("result" => $error));}
		mysql_close($conn);
}else{
	#mysqli
$username = "root"; 
$password = "password"; 
$database = "languages";

		$sqlTable = "";
		$conn = new mysqli($servername, $username, $password, $database) or die("unable to connect");
		if ($conn->connect_error) {
			$error = ["ERROR","CONNECTION FAIL"];
			echo json_encode(array("result" => $error)); 
			die;
		}
		mysqli_set_charset($conn,"utf8");
		$result = $conn->query($addrow);
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
		}

?>