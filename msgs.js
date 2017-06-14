var messages = new Object;

messages.changeHelp = function(topic){
$("#help_content").html(pickHelp(topic));
}

function pickHelp(topic){
	var helpMessage = "";
	//switch based on context
	switch(topic){
	case("languages"):
	helpMessage = "<p>The square buttons let you pick languages to be displayed in the table.</p>";
	break;
	case("filter"):
	helpMessage = "<p>The filter lets you search for words that are already in the table. To filter words in a particular column, type its name before a colon. E.g., \"noun:fox\".</p>";
	break;
	case("edit mode"):
	helpMessage = "<p>Edit mode lets you modify and add data.<br>Saving changes requires a login and a password.</p>";
	break;
	case("sql mode"):
	helpMessage = "<p>Search mode will let you find a word in all available languages.<br>This mode has not yet been implemented.</p>";
	break;
	case("compare mode"):
	helpMessage = "<p>Compare mode displays similar words present in all chosen languages.<br>In case of errors, try to pick fewer languages.</p>";
	break;
	case("table"):
	helpMessage = "<p>The table displays the result of the query. In edit mode, you can double-click cells of the table to edit them.</p>";
	break;
	case("changed"):
	helpMessage = "The selected cell is changed. It will be saved when you press the <b>save changes</b> button. Click on this cell to change its status.";
	break;
	case("cancelled"):
	helpMessage = "The selected cell is changed but is not active. It will not be saved when you press the <b>save changes</b> button. Click on this cell to change its status.";
	break;
	default:
	helpMessage = "<p>Click on UI elements to find out more about them.<br>Click <b>?</b> to hide this pane.<br>Go <a href='changelog.html' >here</a> to see the list of changes and coming features.</p>";
	break;
}
return helpMessage;
}




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
//should be changed from switch to something more reasonable
function messageCreate(messageCode){
console.log(messageCode);
switch(messageCode){
	case "CONNECTION FAIL":
	messageShow("unable to connect to the database","error");
	break;
	case "UPDATES TOO LONG":
	messageShow("Sorry, there are too many changes. Click on some changed cells to deactivate them and try again.","error");
	break;
	case "QUERY TOO LONG":
	messageShow("Sorry, the query is too long","error");
	break;
	//I think backend should handle sql error codes 
	case "QUERY EMPTY":
	messageShow("Query returned 0 rows - check conditions or pick fewer languages","error");
	break;
	case "QUERY FAILED":
	messageShow("Query failed - check syntax","error");
	break;
	case "0000":
	messageShow("Query failed - try picking fewer languages","error");
	break;
	default:
	messageShow("unhandled exception occured","error");
	}
}