<?php header('Content-Type: text/html; charset=utf-8');
//this script will handle mysql or mysqli depending on whether the server supports it
//error_reporting(E_ERROR); //stops displaying warnings/errors, I can create my own errors and pass them with json
$userquery = $_GET['userquery'];
$servername = "localhost";

//need to handle JSON here!

$JSON = json_decode($userquery);
//var_dump($JSON);
echo $JSON;


//$userquery = strtolower($userquery);

if(function_exists('mysql_connect'))
		{
		$username = "languag6_reader";
		$password = "Reader32167"; 
		$database = "languag6_languages";
		
		$conn = mysql_connect($servername,$username,$password) ;
		mysql_select_db($database);
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
		$servername = "localhost";
		
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
		}
?>