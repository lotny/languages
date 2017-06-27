(function(window){

    window.EV = new EventEmitter2();
    $(document).ready(function(){
       EV.emit("init");
        //$(document).trigger("init")
    });

})(window);
