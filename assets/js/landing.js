var pathAnimID,pathRndInterval;
var phi = Math.random()*4.5 + 1;
var curveMult = 0.08;
var angleP = 0;
var angleN = 0;
var landingFirstLoad = true,loopClock = false;
var lowCos = highCos = lowSin = highSin = 1;
var isLanding = window.location.href.split("/").includes("landing.html") ? true : false;


function pathCurve() {
  var curveClip = $("#rClip").find("path").attr("d").split("C")[1].split("Z")[0].trim().split(",");
  curveClip[0] = curveClip[0].split(" ");
  curveClip[1] = curveClip[1].split(" ");
  for(var i = 0; i<curveClip.length ; ++i){
      for(var j = 0; j<curveClip[i].length ; ++j){
          curveClip[i][j] = curveClip[i][j]*1;
      }
  }
    
  angleP = map(Math.cos(phi) , 0,1,0.35*lowCos,0.65*highCos);
  angleN = map(Math.sin(phi) , 0,1,0.65*lowSin,0.35*highSin);
  
  if(landingFirstLoad){
      curveClip[0][0] = angleP;
      curveClip[1][0] = angleN;
      landingFirstLoad = false;
  }
  if(loopClock){
    curveClip[0][0]=p5Lerp(curveClip[0][0],angleN,0.001);
    curveClip[1][0]=p5Lerp(curveClip[1][0],angleP,0.001); 
    curveClip[1][0]=p5Lerp(curveClip[1][0],angleN,0.001);
    curveClip[1][1]=p5Lerp(curveClip[1][1],angleP,0.001); 
  }
  else{
    curveClip[0][0]=p5Lerp(curveClip[0][0],angleP,0.001);
    curveClip[1][0]=p5Lerp(curveClip[1][0],angleN,0.001); 
    curveClip[1][0]=p5Lerp(curveClip[1][0],angleP,0.001);
    curveClip[1][1]=p5Lerp(curveClip[1][1],angleN,0.001); 
  }
  
  phi=phi + 0.0007 ;
  if(Math.abs(phi - 6.28319) < 0.01){
      phi = 0;
  }
  
  $("#rClip").find("path").attr("d","M 0.8,0 L 1,0 L 1,1 L 0.2,1 C "
                                +curveClip[0][0]+" "+curveClip[0][1]+","
                                +curveClip[1][0]+" "+curveClip[1][1]+",0.8 0  Z");
    
    
  $("#lClip").find("path").attr("d","M 0.8,0 L 0,0 L 0,1 L 0.2,1 C "
                                +curveClip[0][0]+" "+curveClip[0][1]+","
                                +curveClip[1][0]+" "+curveClip[1][1]+", 0.8 0  Z");
  //console.log(curveClip,$("#rClip").find("path").attr("d"),$("#lClip").find("path").attr("d"));
  pathAnimID = requestAnimationFrame(pathCurve);
}



if(isLanding){
    pathAnimID = requestAnimationFrame(pathCurve);
    pathRndInterval = setInterval(function(){
    lowCos  = p5Lerp(lowCos,map(Math.random(),0,1,0.9,1.1),0.05);
    lowSin  = p5Lerp(lowSin,map(Math.random(),0,1,0.9,1.1),0.05);
    highCos = p5Lerp(highCos,map(Math.random(),0,1,0.9,1.1),0.05);
    highSin = p5Lerp(highSin,map(Math.random(),0,1,0.9,1.1),0.05);
    loopClock = loopClock ? false : true;
    },20000);
}
else{
    cancelAnimationFrame(pathAnimID);
    clearInterval(pathRndInterval);
}

