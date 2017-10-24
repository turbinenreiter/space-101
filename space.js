var runner = Runner.create({fps: 60});

fligh_path = true;
center_path = false;

function spacekey(key) {
    if (key == 13) { //enter
        if(slide_no == 6) {
            Runner.stop(runner);
            create_space(slide_no);
            burn({x: 0, y: -8.5*force}, 1000, 1000);
        } else if(slide_no == 7) {
            Runner.stop(runner);
            create_space(slide_no);
            burn({x: 0, y: -8.5*force}, 1000, 1000);
            burn({x: 1.25*force, y: 0}, 2000, 5000);
        } else if(slide_no == 8) {
            Runner.stop(runner);
            create_space(slide_no);
            burn({x: 0, y: -8.5*force}, 1000, 1000);
            burn({x: 2.5*force, y: 0}, 2000, 5000);
        }
        Runner.start(runner, engine);
    } else if (key == 27) { // escape
        Runner.stop(runner);
    } else if (key == 70) { // f
        fligh_path = !fligh_path;
    }
}
