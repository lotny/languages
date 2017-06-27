<?php header('Content-Type: text/html; charset=utf-8');
//error_reporting(E_ERROR); //stops displaying warnings/errors, I can create my own errors and pass them with json
include_once('../config.inc.php');

//query body
//  {"mode":"compare-strict",
//   "languages":["en","kr","en"],
//   "search":""
//  }
$request = $_GET['userquery'];

$languages = $request['languages'];
$mode = $request['mode'];
$searchterm = $request['search'];

//$JSON = json_decode($userquery);
//$userquery = strtolower($userquery);

//$Context = array();
Class ColumnContext
{
    public $tableId = "";
    public $columnId = "";
    public $columnHeader = "";
    public $languageId = "";
}

function matchLanguage($lng){
    $cnt = new ColumnContext();
    $cnt -> columnId = "text";
    if ($lng == "en"){
        $cnt -> tableId = "english";
        $cnt -> columnHeader = "English";
        $cnt -> languageId = $lng;
    }
    if ($lng == "fr"){
        $cnt -> tableId = "french";
        $cnt -> columnHeader = "French";
        $cnt -> languageId = $lng;
    }
    if ($lng == "de"){
        $cnt -> tableId = "german";
        $cnt -> columnHeader = "German";
        $cnt -> languageId = $lng;
    }
    if ($lng == "pl"){
        $cnt -> tableId = "polish";
        $cnt -> columnHeader = "Polish";
        $cnt -> languageId = $lng;
    }
    if ($lng == "hr"){
        $cnt -> tableId = "croatian";
        $cnt -> columnHeader = "Croatian";
        $cnt -> languageId = $lng;
    }
    if ($lng == "ru"){
        $cnt -> tableId = "russian";
        $cnt -> columnHeader = "Russian";
        $cnt -> languageId = $lng;
    }
    if ($lng == "kr"){
        $cnt -> tableId = "korean";
        $cnt -> columnHeader = "Korean";
        $cnt -> languageId = $lng;
    }
    return $cnt;
}

$languages = array_map("matchLanguage", $languages);

//$Context[0] = new ColumnContext();

//$context = new Context();

$response = new stdClass();
$response -> error = null;
$response -> context = $languages;
$response -> table = null;


//$response -> context = $languages;

//refactor - better way of building queries
function buildQuery(){
global $mode, 
       $languages,
       $searchterm;

$query = "";


if ($mode == "search"){
$searchterm = "'%".$searchterm."%'";
$query = "SELECT word.id ";

foreach ($languages as $lng){
    $query = $query . " , " . $lng -> tableId . "." . $lng -> columnId . " as '" . $lng -> columnHeader . "' ";
}
$query = $query . ' FROM word ';

foreach ($languages as $lng){
    $query = $query . " left join " . $lng -> tableId . " on word.id = " . $lng -> tableId . ".id";
}

$query = $query . " where word.id IN (";
foreach ($languages as $lng){

    $query = $query . "select id from " . $lng -> tableId . " where " . $lng -> tableId . "." . $lng -> columnId . " like " .  $searchterm;
    $query = $query . " union ALL ";
}
$query = substr($query, 0, -11) ;//remove last union ALL
$query = $query . ")";

return $query;

}
//GET DETAILS
if ($mode == "details"){
$table = $languages[0] -> tableId;
$query = "SELECT type.name as 'Type', " . $table . ".details as 'Details', " . $table . ".alt from word left join " . $table . " ON " . $table . ".id = word.id INNER JOIN type ON word.typeid = type.id WHERE word.id = " . $searchterm;
return $query;
}

//COMPARE MODE STRICT
if ($mode == "compare"){

$query = "SELECT word.id " ;
foreach ($languages as $lng) {
$query = $query . " , " . $lng -> tableId . "." . $lng -> columnId . " as '" . $lng -> columnHeader . "' ";
}

$query = $query . " from word ";

foreach ($languages as $lng) {

$query = $query . " right join " . $lng -> tableId . " on word.id = " . $lng -> tableId . ".id";
}
$query = $query . " where ";
foreach ($languages as $lng) {
$query = $query . $lng -> tableId . ".text not like 'n/a%' AND ";
}
$query = substr($query, 0, -4) ;//remove last AND


return $query;
}



}



$userquery = buildQuery();

if(function_exists('mysql_connect'))
    {
    $conn = mysql_connect($servername,$readername,$readerpass) ;
    mysql_select_db($database);
    mysql_query("SET CHARSET UTF8");
    $result = mysql_query($userquery);

    if(!$result){
        $response -> error = "CONNECTION FAIL";
        echo json_encode($response); 
        die;
    }

    if(mysql_num_rows($result) > 0){
        while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $rows[] = $row;}
        
        $response -> table = $rows;
        echo json_encode($response);
        mysql_free_result($result);
    }else{
        $response -> error = "EMPTY RESULT";
        echo json_encode($response); 
        mysql_close($conn);
    }
}else{
        #mysqli
		$conn = new mysqli($servername, $readername, $readerpass, $database) or die("unable to connect");
		if ($conn->connect_error) {
			$response -> error = "CONNECTION FAIL";
			echo json_encode($response); 
			die;
			}
		mysqli_set_charset($conn,"utf8");
		$result = $conn->query($userquery);
		if(!$result){
			$response -> error = "INVALID QUERY " . $userquery; //sensitive data
            echo json_encode($response);
            die;
		}
		if($result->num_rows >0){
		while ($row = mysqli_fetch_assoc($result)) {
               $rows[] = $row; //this is encoded as an object
               }
        $response -> table = $rows;
        echo json_encode($response);

        }else{
        $response -> error = "INVALID SYNTAX " . $userquery; //sensitive data
        echo json_encode($response);
        $conn->close();
        }

}
        
?>