$(document).ready(function(){
    var acceptedCaching = window.localStorage.getItem('cache');
    
    if(acceptedCaching == "true"){
        var particleState = window.localStorage.getItem('particles');
        var themeState = window.localStorage.getItem('theme');
        var visState = window.localStorage.getItem('visualizer');
        $("#keyboardHint").css("animation-delay","0s");
        if(themeState == "dark"){
            setTimeout(function(){
                darkTheme(colorArr);
            },1000);

        }
        else if(themeState == "light"){
            setTimeout(function(){
                lightTheme(colorArr);
            },1000);
        }
        if(particleState == "true"){
            enableParticles();
        }
        else{
            disableParticles();
        }
        
        $("#cookieWarnCont").css({
            "opacity":"0",
            "pointer-events":"none"
        });
        
        switch(visState) {
          case "high":
            visHigh();
            break;    
          case "low":
            visLow();
            break;
          case "off":
            visOff();
            break;
          case "auto":
            visAuto();
            break;  
          default:
            visHigh();      
        }
    }
    else{
        /*
        setTimeout(function(){
            $("#pnlctnt").addClass("slowAnim");
            $("#pnlctnt").css('transform','translateX(70%) translateZ(0)');
            setTimeout(function(){
                if(pnlClicked == 0){
                    $("#pnlctnt").css('transform','translateX(110%) translateZ(0)');
                }
            },3500);
        },8000);
        */
        $("#panelbtn").css({
            "animation":"shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
            "animation-delay":"8s"
        });
        darkTheme();
        if(window.width <= 520){
            visLow();
        }
        if(isFirefox){
            visOff();
        }
    }
});

$("#hideWarnBtn").click(function(){
    window.localStorage.setItem('cache',"true");
    $("#cookieWarnCont").css({
                                "opacity":"0",
                                "pointer-events":"none"
    });
});