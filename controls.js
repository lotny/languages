//another idea - SQL mode / restricted mode
//three types of comparing:
//compare all - show all rows for all languages
//compare non null - show only rows that have cognates
//compare where non null > null (for example compare 3 languages and show rows which have at least 2 cognates.


//playing with indexed db//
var request = window.indexedDB.open("MyTestDatabase2", 1);
request.onerror = function(event) {
  // Do something with request.errorCode!
};
request.onsuccess = function(event) {
  // Do something with request.result!
};





var focus = "top";
var editing = false;
var context = [20]; //I think I should work on creating limited arrays
var current_mode = "sql";
context[0]=["word","Id","Id"];
context[1]=["type","Name","Type"];//name of the type instead of the number, should be different for editing//
context[2]=["word","Comment","Comment"];
//console.log(context[0]);
$("#mode_edit").hide();
$("#mode_compare").hide();
$("#controls").hide();


/*I want one function for switching buttons on/off... this is currently not used by anything
function toggle(controlId){
if ($("'#" + controlId + "'").attr(enabled))
console.log("enabled");
else{console.log("disabled");
}}
*/


$(document).on('click', 'table', function(){
focus = "table";
$("#userquery").hide(300);
$(".btn_language").hide(300);
$("#btn_auto").hide();
$("#mode_sql_btns").hide();
$("#btn_compare").hide();
}); 

$(document).on('click', '#modes', function(){
if (focus != "top"){
focus = "top";
switch(current_mode){
case("edit"):
$(".btn_language").show(300);
$("#btn_auto").show();
break;
case("sql"):
$("#userquery").show(300);
$("#mode_sql_btns").show();
break;
case("compare"):
$(".btn_language").show(300);
$("#btn_compare").show();
break;
}
}}); 

//this function delays the resizing
$(window).bind('resize', function(e){
    window.resizeEvt;
    $(window).resize(function(){
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function(){adjustColumns()},500);
    });
});

function adjustColumns(){
var table_width = 0;
$('#table thead').show(); //has to be shown to get proper size
$('#table th').each(function(e){
table_width = Math.round($(this).width());
$('#copy thead th')[e].width = table_width; //add a way of defining COL?
})
$('#table thead').height("0px");
$('#table thead').hide();
}
//MODES 
function switchModes(mode){
current_mode=mode;
switch(mode){
case("compare"):
$("#mode_sql").hide(300);
$("#mode_edit").show(300);
$(".btn_language").show(0);
$("#btn_auto").hide(300);
$("#btn_m_compare").hide(300);
$("#btn_compare").show(300);
$("#btn_m_edit").show(300);
break;
case("edit"):
$("#mode_sql").hide(300);
$(".btn_language").show();
$("#mode_edit").show(300);
$("#btn_auto").show(300);
$("#btn_m_edit").hide(300);
$("#btn_compare").hide(300);
$("#btn_m_compare").show(300);
break;
case("sql"):
$("#mode_compare").hide(300);
$("#mode_edit").hide(300);
$("#mode_sql").show(300);
$("#mode_sql_btns").show(300);
$("#userquery").show(300);
break;}
}
//selecting language
$(".btn_language").click(function(){
if ($(this).hasClass("selected")){
$(this).removeClass("selected")
}else{
$(this).addClass("selected")};
})
//
function saveQuery(){
var userquery = document.getElementById("userquery").value;
if (userquery != "" ){
	$.getJSON("savequery.php", {userquery:userquery}, function(e) {
	if (e.result[0] != "ERROR"){
	messageShow("Query saved","info"); 
	}else { //handle errors
	messageCreate(e.result[0]);
	}
	})
	}else{
	messageShow("There is nothing to save","error");
	}
}
//create query based on the selected languages:
function autoQuery(mode){
context.length = 3;
var autoQuery = "";
var beginQuery = "SELECT "
var middleQuery = " FROM word INNER JOIN type ON word.typeid = type.id "; //this shows the type name
var endQuery = "";
var additionalQuery = "";
if (mode == 'compare'){
additionalQuery = " WHERE"; //for where statements
beginQuery += context[0][0] + "." + context[0][1] + " AS '" + context[0][2] + "'"; //get only id
}else{
beginQuery += 
context[0][0] + "." + context[0][1] + " AS '" + context[0][2] + "', " +
context[1][0]+ "." + context[1][1] + " AS '" + context[1][2] + "', " + 
context[2][0]+ "." + context[2][1] + " AS '" + context[2][2] + "'" ;
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
for (i=3;i<context.length;i++)
{
beginQuery += ", "+ context[i][0] + "." + context[i][1] + " AS '" + context[i][2] + "'";

//this should be done better//
if (mode == "edit"){
endQuery += " LEFT JOIN " + context[i][0] + " ON " + context[i][0] + ".Id = word.Id";
}else{
endQuery += " RIGHT JOIN " + context[i][0] + " ON " + context[i][0] + ".Id = word.Id";
additionalQuery += " " + context[i][0] + "." + context[i][1] + " NOT LIKE 'n/a%' AND";
}
}
if (mode == "edit"){//context is given so we can edit the table:
autoQuery = beginQuery + middleQuery + endQuery;
}else{
additionalQuery = additionalQuery.substring(0, additionalQuery.length - 4);//TRIM 
autoQuery = beginQuery + middleQuery + endQuery + additionalQuery;}
autoQuery += " ORDER BY 'Id' ASC";

console.log(autoQuery);
$("#userquery").val(autoQuery);
//this should be handled by a separate function!
$(".btn_language").hide();
$("#btn_auto").hide();
$("#btn_compare").hide();
executeQuery(mode);
}
//execute query
function executeQuery(mode){ 
var userquery = document.getElementById("userquery").value;
if (userquery == ""){
messageShow("the query is empty","error");
return;
}
var tableRow = "";

$.getJSON('load.php', {'userquery': userquery}, function(e) {
	if (e.result[0] != "ERROR")//check if there was an error
	{
		
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
			
			var tableRow = tableRow + "<td>" + e.result[x][y] + "</td>";
			}
		//closing the row:
		tablerRow = tableRow + "</tr>";
		$('#table tbody').append(tableRow);
		}
		adjustColumns();
//this should be better incorporated as a separate function
//this function should handle toggling control buttons
		$("#btn_edit").show();
		$("#controls").show();
		$("#btn_filter").show()
		messageShow("table loaded","info");
		$("#userquery").hide();
		$("#mode_sql_btns").hide();
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
		$("#filter").prop("disabled",true);
		$("#btn_update").prop("disabled", true);
		$("#btn_update").hide();
		$("#btn_change").prop("disabled", true);
		$("#btn_change").hide();
		$("#btn_add").prop("disabled", true);
		$("#btn_add").hide();
		messageCreate(e.result[1]);
	}
});
};








//my script for filtering
var filter = "";

//filtering mechanism
$("#filter").bind('keypress', function(e) { 
	if(e.keyCode==13){ //enter
	filterInit();
	}
});

function filterInit(){
$("#table tbody tr").removeAttr("style");
var filter = $("#filter").val();
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
}

//mode for searching one column
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
messageShow("Invalid column name","error");
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
}



//my script for editing cells
$(document).on('dblclick', '#table td', function() {
var editedCell = $(this);
	if (editedCell.attr('id') != "editing" && editedCell.index() != 0 && editing == true) //I use ID as the flag so that 
		{
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
	if (cell.className == "changed"){
	changes += 1;
	changes_sum +=1;
	}
	}
	if (changes == 0){
	row.style.display = "none";
	}
}
$("#table thead").show();
adjustColumns();
messageShow("Number of changes: ","info",changes_sum);
$(this).html("show all");
} else {

$(this).html("show changes");
$("#table tbody tr").removeAttr("style");
$("#table thead").show();
adjustColumns();
}
});