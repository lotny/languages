

$(document).on('click', '#btn_help', function displayHelp(){
    //toggle class?
    if (help){
    $("#help_content").hide(300);
    help = false;
    }else{
    $("#help_content").show(300);
    messages.changeHelp("");
   help = true;
    }
}
);



$(document).on('click','#btn_m_search,#btn_m_edit,#btn_m_compare', function(e){
    var $btn = $(e.target);
    $(".btn_mode").show();
    $btn.hide();

    
})


/**
 * @event lowerPaneClicked
 */
$(document).on('click', 'table, #controls, #content', function(){


}); 

/**
 * @event topPaneClicked
 */
$(document).on('click', '#mode_search ,#mode_edit', function(){

}); 

/**
 * Delays resizing
 */
$(window).bind('resize', function(e){
    window.resizeEvt;
    $(window).resize(function(){
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function(){table.adjustColumns()},300);
    });
});


$("#mode_edit").show();
//$("#mode_search").hide();
//$("#btn_auto").hide();
//$("#btn_m_compare").hide();
//$("#controls").hide();
$("#help_content").hide();
$("#btn_nl, #btn_se, #btn_it, #btn_la, #btn_cz, #btn_es").remove();




//selecting language
$(".btn_language").click(function(e){
messages.changeHelp("LANGUAGES");
var $btn = $(e.target);

if ($btn.hasClass("selected")){
    $btn.removeClass("selected")
}else{
    $btn.addClass("selected")};
})
