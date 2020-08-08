/**
    Registers the handler to the event for the given object.
    @param obj the object which will raise the event
    @param evType the event type: click, keypress, mouseover, ...
    @param fn the event handler function
    @param isCapturing set the event mode (true = capturing event, false = bubbling event)
    @return true if the event handler has been attached correctly
    */
    function addEvent(obj, evType, fn, isCapturing){
      if (isCapturing==null) isCapturing=false; 
      if (obj.addEventListener){
        // Firefox
        obj.addEventListener(evType, fn, isCapturing);
        return true;
      } else if (obj.attachEvent){
        // MSIE
        var r = obj.attachEvent('on'+evType, fn);
        return r;
      } else {
        return false;
      }
    }

    // register to the potential page visibility change
    addEvent(document, "potentialvisilitychange", function(event) {
      console.log("potentially hidden " + document.potentialHidden);
        if(document.potentialHidden == true && quality == 3){//player hidden and quality set to auto
          view = 0;
        }
        else if(document.potentialHidden == false && quality == 3){//player visible and quality set to auto
          view = 1;
        }
        if(document.potentialHidden == true){//player hidden
            $("#playerBg").css("opacity","0.8");
            /*
          $(".area").css("opacity","0");
          setTimeout(function(){
              $(".circle").css("animation-play-state:","paused");
          },1000);
          */
        }
        else if(document.potentialHidden == false){//player visible
            $("#playerBg").css("opacity","1");
            
        }
        setVizQ();
    });

    // register to the W3C Page Visibility API
    var hidden=null;
    var visibilityChange=null;
    if (typeof document.mozHidden !== "undefined") {
      hidden="mozHidden";
      visibilityChange="mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden="msHidden";
      visibilityChange="msvisibilitychange";
    } else if (typeof document.webkitHidden!=="undefined") {
      hidden="webkitHidden";
      visibilityChange="webkitvisibilitychange";
    } else if (typeof document.hidden !=="hidden") {
      hidden="hidden";
      visibilityChange="visibilitychange";
    }
    if (hidden!=null && visibilityChange!=null) {
      addEvent(document, visibilityChange, function(event) {
        //document.getElementById("x").innerHTML+=visibilityChange+": "+hidden+"="+document[hidden]+"<br>";
      });
    }


    var potentialPageVisibility = {
      pageVisibilityChangeThreshold:15*3600, // in seconds
      init:function() {
        function setAsNotHidden() {
          var dispatchEventRequired=document.potentialHidden;
          document.potentialHidden=false;
          if(!correctMetaOnFocusRunning && !document.metaVisCheck && blured){
            correctMetaOnFocus(3);
            document.metaVisCheck = true;
            setTimeout(() => document.metaVisCheck = false,10000);
            if(songChanging){
              setTimeout(() => document.metaVisCheck = false,7000);
            }
          }
          document.potentiallyHiddenSince=0;
          if (dispatchEventRequired) dispatchPageVisibilityChangeEvent();
        }

        function initPotentiallyHiddenDetection() {
          if (!hasFocusLocal) {
            // the window does not has the focus => check for  user activity in the window
            lastActionDate=new Date();
            if (timeoutHandler!=null) {
              clearTimeout(timeoutHandler);
            }
            timeoutHandler = setTimeout(checkPageVisibility, potentialPageVisibility.pageVisibilityChangeThreshold*1000+100); // +100 ms to avoid rounding issues under Firefox
          }
        }

        function dispatchPageVisibilityChangeEvent() {
          unifiedVisilityChangeEventDispatchAllowed=false;
          var evt = document.createEvent("Event");
          evt.initEvent("potentialvisilitychange", true, true);
          document.dispatchEvent(evt);
        }

        function checkPageVisibility() {
          var potentialHiddenDuration=(hasFocusLocal || lastActionDate==null?0:Math.floor((new Date().getTime()-lastActionDate.getTime())/1000));
                                        document.potentiallyHiddenSince=potentialHiddenDuration;
          if (potentialHiddenDuration>=potentialPageVisibility.pageVisibilityChangeThreshold && !document.potentialHidden) {
            // page visibility change threshold raiched => raise the even
            document.potentialHidden=true;
            dispatchPageVisibilityChangeEvent();
          }
        }

        var lastActionDate=null;
        var hasFocusLocal=true;
        var hasMouseOver=true;
        document.potentialHidden=false;
        document.metaVisCheck = false;
        document.potentiallyHiddenSince=0;
        var timeoutHandler = null;

        addEvent(document, "pageshow", function(event) {
          //document.getElementById("x").innerHTML+="pageshow/doc:<br>";
        });
        addEvent(document, "pagehide", function(event) {
          //document.getElementById("x").innerHTML+="pagehide/doc:<br>";
        });
        addEvent(window, "pageshow", function(event) {
          //document.getElementById("x").innerHTML+="pageshow/win:<br>"; // raised when the page first shows
        });
        addEvent(window, "pagehide", function(event) {
          //document.getElementById("x").innerHTML+="pagehide/win:<br>"; // not raised
        });
        addEvent(document, "mousemove", function(event) {
          lastActionDate=new Date();
        });
        addEvent(document, "mouseover", function(event) {
          hasMouseOver=true;
          setAsNotHidden();
        });
        addEvent(document, "mouseout", function(event) {
          hasMouseOver=false;
          initPotentiallyHiddenDetection();
        });
        addEvent(window, "blur", function(event) {
          hasFocusLocal=false;
          initPotentiallyHiddenDetection();
        });
        addEvent(window, "focus", function(event) {
          hasFocusLocal=true;
          setAsNotHidden();
        });
        setAsNotHidden();
      }
    }

    potentialPageVisibility.pageVisibilityChangeThreshold=15; // 4 seconds for testing
    potentialPageVisibility.init();