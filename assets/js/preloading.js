function preloadImages(array, waitForOtherResources, timeout) {
    var loaded = false,i = array.length - 1, imgs = array.slice(0), t = timeout || 15*1000, timer;
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    if (!waitForOtherResources || document.readyState === 'complete') {
        loadNow(i);
    } else {
        window.addEventListener("load", function() {
            clearTimeout(timer);
            loadNow(i);
        });
        // in case window.addEventListener doesn't get called (sometimes some resource gets stuck)
        // then preload the images anyway after some timeout time
        timer = setTimeout(function(){
            loadNow(i);
        }, t);
    }

    function loadNow(i) {
        if (i!=-1) {
            var img = new Image();
            img.src = imgs[i];
            img.onload = function(){
                i--;
                img = null;
                loadNow(i);
            }
            img.onerror = img.onabort = function() {
                console.log("uh oh ",imgs[i]," is poopy");
                img = null;
                i--;
                loadNow(i);                
            }
        }
        else{
            return;
        }
    }
}


