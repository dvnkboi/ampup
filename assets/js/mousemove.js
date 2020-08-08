function mouseFollow(elem,intensity,smooth){
    elem = $(document).find(elem);
    intensity = map(intensity,0,1,80,1);
    var offScreenSmooth = map(smooth,0,1,0.03,0.07);
    smooth = map(smooth,0,1,1,0.001);
    elem.css("transition","all 50ms var(--cubic)");
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
                        x = mousePos.x - elem.offset().left - elem.width()/2;
                        y = mousePos.y - elem.offset().top - elem.height()/2;
                        pos.x = p5Lerp(pos.x,x,smooth);
                        pos.y = p5Lerp(pos.y,y,smooth);
                        var marLeft = pos.x/intensity;
                        var marTop = pos.y/intensity;
                        prevPos = nextPos;
                        elem.css({
                            "transform" : "translate(" + marLeft + "px," + marTop + "px)"
                        });
                    }            
                }
                else{
                    pos.x = p5Lerp(pos.x,0,offScreenSmooth);
                    pos.y = p5Lerp(pos.y,0,offScreenSmooth);
                    var marLeft = pos.x/intensity;
                    var marTop = pos.y/intensity;
                    elem.css({
                            "transform" : "translate(" + marLeft + "px," + marTop + "px)"
                    });
                }
            }
            catch(e){
                console.error(e);
            }
        }
    })();
}
