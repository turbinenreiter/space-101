var runner = Runner.create();

var first = true;
var pause = true;
fligh_path = true;
center_path = false;

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
    console.log(key);

    if (key == 13) { //enter
        if(first) {
            burn({x: 0, y: -8.5*force}, 1000, 1000);
            burn({x: 2.5*force, y: 0}, 2000, 5000);
        }
        Runner.start(runner, engine);
        first = false;
    } else if (key == 27) { // escape
        Runner.stop(runner);
    } else if (key == 67) { // c
        center_path = !center_path;
    } else if (key == 70) { // f
        fligh_path = !fligh_path;
    }
};

setTimeout(function() {
        Runner.stop(runner);
    }, 100000);
