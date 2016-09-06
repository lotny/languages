//FUNCTION FOR DISPLAYING MESSAGES
//function for cycling through the messages and deleting them:
//I need to find a better way of handling this...
window.setInterval(function(){
$('#messages p[value="0"').remove();
$('#messages p[value="2"').hide(500);
$('#messages p[value="1"').attr("value","0");
$('#messages p[value="2"').attr("value","1");
$('#messages p[value="3"').attr("value","2");
$('#messages p[value="4"').attr("value","3");
$('#messages p[value="5"').attr("value","4");
},2000);
var m = 0;
function messageShow(text,type,number){ //info/error/warning/tip?
var n = (number == null ? "" : number);
m +=1;
var message = "<p id='" + m + "' style='display:none' value=5>" + text + n + "</p>";
$('#messages').append(message);
$('#'+m).attr("class",type);
$('#'+m).fadeIn(500);
}
//this deletes the message
$(document).on('click', '#messages p', function(){
$(this).remove();
});
//this function should store all the messages, this would make it easier to translate messages
//or just to keep track of them
function messageCreate(messageCode){
console.log(messageCode);
switch(messageCode){
	case "CONNECTION FAIL":
	messageShow("unable to connect - check if SQL server is running","error");
	break;
	case "INVALID QUERY":
	messageShow("SQL query returned 0 rows - check conditions or pick fewer languages","error");
	break;
	case "INVALID SYNTAX":
	messageShow("SQL query failed - check table names and syntax","error");
	break;
	default:
	messageShow("unhandled exception occured","error");
	}
}