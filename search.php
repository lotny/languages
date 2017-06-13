<?php header('Content-Type: text/html; charset=utf-8');


$servername = "localhost";
include_once('../config.inc.php');
$searchterm= $_GET['userquery'];



//build query
$userquery = "SELECT word.id, english.text as 'English', german.text as 'german', french.text as 'french', polish.text as 'polish',  croatian.text as 'croatian'
  
  FROM word

  left join english on english.id = word.Id
  left join german on word.id = german.id
  left join french on word.id = french.id
  left join polish on word.id = polish.id
  left join croatian on word.id = croatian.id
  

 WHERE word.id IN  

 (select id from english where english.text like '". $searchterm ."%'
  union ALL
select id from german where german.text like '". $searchterm ."%'
union ALL
select id from french where french.text like '". $searchterm ."%'
union ALL
select id from polish where polish.text like '". $searchterm ."%'
union ALL
select id from croatian where croatian.text like '". $searchterm ."%')";



if(function_exists('mysql_connect'))
		{

		$conn = mysql_connect($servername,$readername,$readerpass) ;
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
		
		
		
		
		}
?>





