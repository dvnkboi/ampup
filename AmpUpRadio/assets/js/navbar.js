/*
function collapseNav(){
    $("#navBar").css("width","250px");
    $(".navImg").css({"width":"40px",
                      "height":"40px",
                      "max-width":"40px",
                      "max-height":"40px"
    });
    $(".navBtnText").css("filter","opacity(1)");
    
}


function expandNav(){
    $("#navBar").css("width","250px");
    $(".navImg").css({"width":"40px",
                      "height":"40px",
                      "max-width":"40px",
                      "max-height":"40px"
    });
    $(".navBtnText").css("filter","opacity(1)");
}

setTimeout(collapseNav,2000);

var navTimeout;

$(".navBtn")
.mouseenter(function(){
    clearTimeout(navTimeout);
    expandNav();
})
.mouseleave(function(){
    navTimeout = setTimeout(collapseNav,200);
});


$(".navImg")
  .addClass('block')
  .outerWidth(); // Reflow

$(".navImg")
  .addClass('fade-in')
  .on(transitionEnd, function() {
    alert('Animated');
  });
*/