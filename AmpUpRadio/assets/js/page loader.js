
function hider(unloadEl,_callback){//wait to fade strip away
    unloadEl.css('opacity','0').css("pointer-events","none");
    console.log('hide strip');
    setTimeout(function(){
        _callback(); 
    },2000);
}

function unloader(unloadEl,_callback){//wait for unloading function to finish
    hider(unloadEl,function() {
        //unloadEl.find("iframe").prop('src','about:blank');
        console.log('unload strip ');
    });
    setTimeout(function(){
        _callback(); 
    },500);
}

function loader(load,unload,loadsrc){//wait for loading function to finish
    var loadEl = $(document).find(load);
    var unloadEl = $(document).find(unload);
    unloader(unloadEl,function() {
        setTimeout(function(){
            //loadEl.find("iframe").prop('src',loadsrc);
        },500);
        setTimeout(function(){
            loadEl.css('filter','opacity(1)').css("pointer-events","auto");;
            window.scrollTo(0,1);
            console.log('load full player');
            return true;
        },1000);
    });    
}

loader('#fullPlayer','#stripPlayer','player.html');
//loader('#fullPlayer','#stripPlayer','player.html');
