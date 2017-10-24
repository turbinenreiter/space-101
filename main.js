var slide_no = 0;
var first_2 = true;

function do_js(slide_no) {
//    if(slide_no == 2 && first_2) {
//        window.open('http://mgvez.github.io/jsorrery/', '_blank');
//        first_2 = false;
//    }
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 39) { // right
        slide_no += 1;
    } else if (key == 37) { // left
        slide_no -= 1;
    } else {
        spacekey(key);
    }

    var divsToHide = document.getElementsByTagName("section");
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.display = "none";
    }

    if(slide_no <= 0) {
        slide_no = 0;
    } else if (slide_no > divsToHide.length) {
        slide_no = divsToHide.length+1;
    } else {
        document.getElementById(slide_no.toString()).style.display = "block"
        do_js(slide_no);
    }
    console.log(key, slide_no, divsToHide.length);
};
