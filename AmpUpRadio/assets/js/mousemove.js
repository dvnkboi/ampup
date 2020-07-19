(function() {
    var mousePos;
    var pos = {
        x: 0,
        y: 0
    };
    var inBody = 1;
    
    addEvent(document, 'mouseout', function(evt) {
      if (evt.toElement == null && evt.relatedTarget == null) {
        inBody = 0;
      }
    });    

    document.onmousemove = handleMouseMove;
    setInterval(getMousePosition, 20); // setInterval repeats every X ms

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }
    function getMousePosition() {
        try{
            var nextPos = mousePos;
            var x;
            var y;

            $("body").mouseenter(function(){
                inBody = 1;
            });

            if(inBody == 1) {
                if(pos && nextPos){
                    x = mousePos.x - $('#navExpand').offset().left;
                    y = mousePos.y - $('#navExpand').offset().top;
                    pos.x = p5Lerp(pos.x,x,0.1);
                    pos.y = p5Lerp(pos.y,y,0.1);
                    var marLeft = pos.x/80;
                    var marTop = pos.y/80;
                    prevPos = nextPos;
                    $("#navExpand,#bigCenterLogo").css({
                        "transform" : "translate(" + marLeft + "px," + marTop + "px)"
                    });
                }            
            }
            else{
                pos.x = p5Lerp(pos.x,0,0.05);
                pos.y = p5Lerp(pos.y,0,0.05);
                var marLeft = pos.x/80;
                var marTop = pos.y/80;
                $("#navExpand,#bigCenterLogo").css({
                        "transform" : "translate(" + marLeft + "px," + marTop + "px)"
                });
            }
        }
        catch(e){
        }
    }
})();