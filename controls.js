//another idea - SQL mode / restricted mode
//three types of comparing:
//compare all - show all rows for all languages
//compare non null - show only rows that have cognates
//compare where non null > null (for example compare 3 languages and show rows which have at least 2 cognates.

//Tehnical - I need to create stored procedures with variables for ID and text of cells 
//and views, possibly?


//how to make less strict compare:
//do a select with the joins
//get the whole json
//before creating the table:
//check every object, check if (number of cells without n/a or null) > number of languages chosen/2
//display these rows



//how to mark relationships like:
//we have industrialny as adj in polish, from industrial, but we don't have 'industry'

//init function?


//test
var ui = new object;
ui.focus = function(){
	
}

var query = "";
var focus = "top";
var editing = false;
var context = [20]; //I think I should work on creating limited arrays
var current_mode = "compare";
var clicked = false; //for detail window
var help = false;
context[0]=["word","Id","Id"];

//console.log(context[0]);
$("#mode_edit").show();
$("#mode_search").hide();
$("#btn_auto").hide();
$("#btn_m_compare").hide();
$("#controls").hide();
$("#help_content").hide();



$(document).on('click', '#btn_help', function displayHelp(){
	//toggle class?
	if (help){
	$("#help_content").hide(300);
	help = false;
	}else{
	$("#help_content").show(300);
	changeHelp("");
	help = true;
	}
}
);




/*
I want one function for switching buttons on/off... this is currently not used by anything
function toggle(controlId){
if ($("'#" + controlId + "'").attr(enabled))
console.log("enabled");
else{console.log("disabled");
}}
*/

/**
 * @event lowerPaneClicked
 */
$(document).on('click', 'table, #controls, #content', function(){
//$("#details").addClass('hidden');
//$("td.selected").removeAttr('class');
changeHelp("table");
if (focus != "table"){
focus = "table";
$("#userquery").hide(300);
$("#btn_query").hide(300);
$(".btn_language").hide(300);
$("#btn_auto").hide();
$("#btn_compare").hide();

}}); 

/**
 * @event topPaneClicked
 */
$(document).on('click', '#mode_search,#mode_edit', function(){

$("#details").addClass('hidden');
$("td.selected").removeAttr('class');

if (focus != "top"){
focus = "top";
switch(current_mode){
case("edit"):
$(".btn_language").show(300);
$("#btn_auto").show();
break;
case("sql"):
$("#btn_query").show(300);
$("#userquery").show(300);
$("#mode_search_btns").show();
break;
case("compare"):
$(".btn_language").show(300);
$("#btn_compare").show();
break;
}
}}); 

/**
 * Delays resizing
 */
$(window).bind('resize', function(e){
    window.resizeEvt;
    $(window).resize(function(){
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function(){adjustColumns()},300);
    });
});
/**
 * Fixes column width
 */
function adjustColumns(){
var table_width = 0;
$('#table thead').show(); //has to be shown to get proper size does not work though
$('#table th').each(function(e){
table_width = Math.round($(this).width());
$('#copy thead th')[e].width = table_width; //add a way of defining COL?
})

$('#table thead').height("0px");
$('#table thead').hide();

}
/**
 * This function should be simplified
 */ 
function switchModes(mode){
current_mode=mode;
switch(mode){
case("compare"):

$("#mode_search").hide(300);
$("#mode_edit").show(300);
$(".btn_language").show(0);
$("#btn_auto").hide(300);
$("#btn_m_compare").hide(300);
$("#btn_compare").show(300);
$("#btn_m_edit").show(300);
changeHelp("compare mode");
break;
case("edit"):

$("#mode_search").hide(300);
$(".btn_language").show();
$("#mode_edit").show(300);
$("#btn_auto").show(300);
$("#btn_m_edit").hide(300);
$("#btn_compare").hide(300);
$("#btn_m_compare").show(300);
changeHelp("edit mode");
break;
case("sql"):
$("#mode_compare").hide(300);
$("#mode_edit").hide(300);
$("#mode_search").show(300);
$("#mode_search_btns").show(300);
$("#userquery").show(300);
changeHelp("sql mode");
break;}
}
//selecting language
$(".btn_language").click(function(){
changeHelp("languages");
if ($(this).hasClass("selected")){
$(this).removeClass("selected")
}else{
$(this).addClass("selected")};
})

//no longer used
function saveQuery(){
var userquery = document.getElementById("userquery").value;
if (userquery != "" ){
	$.getJSON("savequery.php", {userquery:userquery}, function(e) {
	if (e.result[0] != "ERROR"){
	messageShow("Query saved","info"); 
	}else { //handle errors
	messageCreate(e.result[1]);
	}
	})
	}else{
	messageShow("there is nothing to save","error");
	}
}
//create query based on the selected languages:

//this should be handled on the server!
//this can be replaced with views!!!!!!!!
/**
 * @param mode 
 */
function autoQuery(mode){
context.length = 1; //test!!!!!!!!!
var autoQuery = "";
var beginQuery = "SELECT "
var middleQuery = " FROM word \nINNER JOIN type ON word.typeid = type.id "; //this shows the type name
var endQuery = "";
var additionalQuery = "";
if (mode == 'compare'){
additionalQuery = " \nWHERE"; //for where statements
beginQuery += context[0][0] + "." + context[0][1] + " AS '" + context[0][2] + "'"; //get only id
}else{
	//TEST BELOW, and make sure that context matches the displayed table!
	context[1]=["type","Name","Type"];//name of the type instead of the number, should be different for editing!!!!!//
    context[2]=["word","Comment","Comment"];

beginQuery += 
context[0][0] + "." + context[0][1] + " AS '" + context[0][2] + "', \n" +
context[1][0]+ "." + context[1][1] + " AS '" + context[1][2] + "', \n" + 
context[2][0]+ "." + context[2][1] + " AS '" + context[2][2] + "'\n" ;
}


//expand the context array according to the selected languages:
if ($("#btn_en").hasClass("selected")){
context.push(["english","Text","English"]);
}
if ($("#btn_de").hasClass("selected")){
context.push(["german","Text","German"]);
}
if ($("#btn_nl").hasClass("selected")){
context.push(["dutch","Text","Dutch"]);
}
if ($("#btn_se").hasClass("selected")){
context.push(["swedish","Text","Swedish"]);
}
if ($("#btn_fr").hasClass("selected")){
context.push(["french","Text","French"]);
}
if ($("#btn_es").hasClass("selected")){
context.push(["spanish","Text","Spanish"]);
}
if ($("#btn_it").hasClass("selected")){
context.push(["italian","Text","Italian"]);
}
if ($("#btn_la").hasClass("selected")){
context.push(["latin","Text","Latin"]);
}
if ($("#btn_pl").hasClass("selected")){
context.push(["polish","Text","Polish"]);
}
if ($("#btn_cz").hasClass("selected")){
context.push(["czech","Text","Czech"]);
}
if ($("#btn_hr").hasClass("selected")){
context.push(["croatian","Text","Croatian"]);
}
if ($("#btn_ru").hasClass("selected")){
context.push(["russian","Text","Russian"]);
}
if ($("#btn_kr").hasClass("selected")){
context.push(["korean","Text","Korean"]);
}

//get languages, need to handle this better!!!!!!!!
var lng = mode == "edit" ? 3 : 1;
for (i=lng;i<context.length;i++)
{
beginQuery += ", "+ context[i][0] + "." + context[i][1] + " AS '" + context[i][2] + "'";

//this should be done better//
if (mode == "edit"){
endQuery += " \nLEFT JOIN " + context[i][0] + " ON " + context[i][0] + ".Id = word.Id";
}else{
endQuery += " \nRIGHT JOIN " + context[i][0] + " ON " + context[i][0] + ".Id = word.Id";
additionalQuery += " " + context[i][0] + "." + context[i][1] + " NOT LIKE 'n/a%' AND";
}
}
if (mode == "edit"){//context is given so we can edit the table:
autoQuery = beginQuery + middleQuery + endQuery;
}else{
additionalQuery = additionalQuery.substring(0, additionalQuery.length - 4);//trims the last AND
autoQuery = beginQuery + middleQuery + endQuery + additionalQuery;}
autoQuery += " \nORDER BY 'Id' ASC";

console.log(autoQuery);
userquery = autoQuery;

//this should be handled by a separate function!
$(".btn_language").hide();
$("#btn_auto").hide();
$("#btn_compare").hide();
executeQuery(mode);
}

/**
 * Should work for every mode
 * should be broken apart into smaller functions
 */
function executeQuery(mode){ 
//var userquery = userquery; //this has to be changed!!!!!

if (userquery == ""){
messageShow("the query is empty","error");
return;
}
var tableRow = "";
messageShow("fetching data...","info");
$.getJSON('load.php', {'userquery': userquery}, function(e) {
	
	if (e.result[0] != "ERROR")//check if there was an error
	
	{
		console.log(e.result[0]);
		console.log(e.result[0]["Id"]);
		$("#content").html("<table id='table'><thead></thead><tbody></tbody></table>");//create table, hide header
		$("#tableheader").html("<table id='copy'><thead></thead><tbody></tbody></table>"); //create visible duplicate
		for (h=0;h<Object.keys(e.result[0]).length;h++) //gets length
		{
		//console.log(Object.keys(e.result[0])[h]);//gets headers for columns
		var columnHeader = "<th>" + Object.keys(e.result[0])[h] + "</th>";
		$("#table thead").append(columnHeader);//create headers
		$("#tableheader thead").append(columnHeader);//create headers
		}
		
		for (x=0; x<e.result.length; x++) //for each row
		{
		var tableRow = "<tr>";
			for(var y in e.result[x]){ //y is the name not the index I think
			if (e.result[x][y]){
			var tableRow = tableRow + "<td>" + e.result[x][y] + "</td>";
			}else{
			
			var tableRow = tableRow + "<td></td>";
			}
			}
		//closing the row:
		tableRow = tableRow + "</tr>";
		$('#table tbody').append(tableRow);
		}
		
		
		//playing with indexed db//
		var req = window.indexedDB.deleteDatabase("languages");

var request = window.indexedDB.open("languages", 1);
request.onerror = function(event) {
  // Do something with request.errorCode!
};
request.onupgradeneeded = function(event) {
  // Do something with request.result!
  
    var db = event.target.result;
    var objectStore = db.createObjectStore("word", { autoIncrement: false  });
    objectStore.createIndex("Id", "Id", { unique: true });
	for(var iDBrow in e.result){
    var newRecord = objectStore.add(e.result[iDBrow], e.result[iDBrow]["Id"]);
	}
};
		//end of indexeddb
		adjustColumns();
		
//this should be better incorporated as a separate function
//this function should handle toggling control buttons and panels!!!
		$("#btn_edit").show();
		$("#controls").show();
		$("#btn_filter").show()
		messageShow("table loaded, records found: ","info",e.result.length);
		$("#userquery").hide();
		$("#mode_search_btns").hide();
		$("#filter").prop("disabled",false);
		if (mode == 'edit'){
		editing = true;
		$("#controls").show();
		$("#btn_update").prop("disabled", false);
		$("#btn_update").show();
		$("#btn_change").prop("disabled", false);
		$("#btn_change").show();
		$("#btn_add").prop("disabled", false);
		$("#btn_add").show();
		$("#btn_filter").show();
		focus = "table";
		}else{
		editing = false;
		$("#btn_update").prop("disabled", true);
		$("#btn_update").hide();
		$("#btn_change").prop("disabled", true);
		$("#btn_change").hide();
		$("#btn_add").prop("disabled", true);
		$("#btn_add").hide();
		focus = "table";
		}
	} else { //handle errors here:
		
		//$("#filter").prop("disabled",true);
		$("#btn_update").prop("disabled", true);
		$("#btn_update").hide();
		$("#btn_change").prop("disabled", true);
		$("#btn_change").hide();
		$("#btn_add").prop("disabled", true);
		$("#btn_add").hide();
		focus = "table";
		messageCreate(e.result[1]);
	}
})


.fail(function(){
		messageShow("connection error","error");
	});
;};

//my script for filtering
var filter = "";

//filtering mechanism
$("#filter").bind('keypress', function(e) { 
	if(e.keyCode==13){ //enter
	filterInit();
	}
});

function filterInit(){
	changeHelp("filter");
$("#table tbody tr").removeAttr("style");
var filter = $("#filter").val().toLowerCase();
var column = "";
var table = document.getElementById('table');
if (filter != ""){

//code for slicing up the query
	if (filter.indexOf(":") >= 0){
	column = filter.slice(0,filter.indexOf(":")).toLowerCase(); 
	filter = filter.slice(filter.indexOf(":")+1).toLowerCase();
	filterbyColumn(column,filter);
	}else{
	filterAll(filter);
	}
}
adjustColumns();
}

/*
* Basic filter
*/
function filterAll(filter){

var table = document.getElementById('table');
var rowLength = table.rows.length;
for(var i=0; i<rowLength; i+=1){  
	var matches = 0;
	var row = table.rows[i];
	var cellLength = row.cells.length;
	
	for(var y=0; y<cellLength; y+=1){
		var cell = row.cells[y];
		if (cell.innerHTML != ""){
			if (cell.innerHTML.toLowerCase().indexOf(filter) >= 0){ //contains phrase
			matches += 1;
			}
		}
	}
	if (matches == 0){
	row.style.display = "none";
	}
}
adjustColumns();
}

/**
 * Filters using column name
 */
function filterbyColumn(column,filter){
console.log("column mode " + column + "|"+ filter);

var headers = document.getElementsByTagName('th');
for (var y=0;y<headers.length;y++){
	if (headers[y].innerHTML.toLowerCase().indexOf(column) >= 0){
	console.log(y);
	break;
	}
	}
if (y == headers.length){
messageShow("invalid column name","error");
return;
}
var rowLength = table.rows.length;
for(var i=0; i<rowLength; i+=1){  
  var row = table.rows[i];
  var cellLength = row.cells.length;
	
    var cell = row.cells[y];
	if (cell.innerHTML != ""){
	if (cell.innerHTML.toLowerCase().indexOf(filter) >= 0){ //contains phrase
	} else {row.style.display = "none"}
	} else {row.style.display = "none"} 
}
adjustColumns();
}






/**
 *
 * @event onCellClicked
 */
 
//$(document).on('dblclick', '#table td', function(){
//
//}

$(document).on('click','#table td', function() {
	console.log("I've been clicked");
var clickedCell = $(this);
if (editing == false){
	console.log("I've been clicked");
	$("td.selected").removeAttr('class');
	clickedCell.addClass('selected');
	//display details window
	$("#details").removeAttr('class');
	var word = clickedCell.html();
	var y = clickedCell.parent("tr").index();
	var languageId = clickedCell.index();
	var cellId = document.getElementById("table").rows[y].cells[0].innerHTML;
	getDetails(cellId, word, languageId);

}})

$(document).on('dblclick', '#table td', function() {
var editedCell = $(this);
if (editing == false){

}else{

	if (editedCell.attr('id') != "editing" && editedCell.index() != 0 ) //I use ID as the flag so that 
		{
			//in mobile mode, the input field should be displayed in a 
			
			var editedContent = "";
			var OriginalContent = editedCell.text();
			var parentHeight = editedCell.height();
			var parentWidth = editedCell.width();
			editedCell.attr('id','editing');
			//this adds the input and puts the cursor at the end
			var inputField = "<input type='text' class='input' value=''/>";
			editedCell.html(inputField);
			$(".input").focus(); //focus on the input
			$(".input").height(parentHeight).width(parentWidth);
			$(".input").val(OriginalContent); //set the value, the cursor moves to the end of the string
			editedCell.val("");
		}
			$('.input').bind('keypress', function(e) { //defocus if enter was pressed
				if(e.keyCode==13){
						$('.input').blur();
			}
			});
			$(".input").focusout(function(){  //this function is here so that it works for the created input element
				var editedContent = $(".input").val();
				editedCell.removeAttr("id");
				editedCell.html(editedContent);
				if (OriginalContent != editedContent){
				editedCell.attr('class','changed');
			}
			$(".input").remove();
			});

}});

$(document).on('click','.changed', function(e){
	changeHelp("changed");
	$(this).attr('class','cancelled');
	e.stopPropagation();
});
$(document).on('click','.cancelled', function(e){
	changeHelp("cancelled");
	$(this).attr('class','changed');
	e.stopPropagation();
});


//showing changes
$(document).on('click','#btn_change', function(){
if ($(this).html() == "show changes"){

var table = document.getElementById('table');
var rowLength = table.rows.length;
var changes_sum = 0;
for(var i=0; i<rowLength; i+=1){  
	var row = table.rows[i];
	if (row.className == "added"){
	break;
	}
	var changes = 0;
	var cellLength = row.cells.length;
	for(var y=0; y<cellLength; y+=1){
	var cell = row.cells[y];
	if (cell.className == "changed" | cell.className == "saved" | cell.className == "cancelled"){
	changes += 1;
	changes_sum +=1;
	}
	}
	if (changes == 0){
	row.style.display = "none";
	}
}
//test this: if there are no changes we should not hide any cells!
if (changes_sum > 0){
	$("#table thead").show();//for adjusting columns?
	adjustColumns();
	messageShow("number of changes: ","info",changes_sum);
	$(this).html("show all");
	}else{
	messageShow("there are no changes","info");
	$("#table tbody tr").removeAttr("style");
	$("#table thead").show();
	}
} else {
	$(this).html("show changes");
	$("#table tbody tr").removeAttr("style");
	$("#table thead").show();
	
}
adjustColumns();
});


//this could actually be done when saving and not before
//adding a row could only add a row in the table, without creating new Id
function addRow(){
	var table = document.getElementById("table");
	var newRow = ""; //could be done as object
	var rowId = 0;
	messageShow("Adding a row","info");
	$.getJSON('scripts\\addrow.php', {'userquery': userquery}, function(e) {
console.log(e.result[0]);
	if (e.result[0] != "ERROR")//check if there was an error
	console.log(e.result[0]['Id']);
	{
		//rowId = result from json
		newRow = "<tr><td>" + e.result[0]['Id'] + "</td>" ;
		for(var i = 1;i< table.rows[0].cells.length;i++){
		newRow += "<td>-</td>";
		}
		newRow += "</tr>";
		$("#table > tbody").append(newRow);
	}
})
}

function log(message){
	$.getJSON('savequery.php',  {'userquery': message});
}
