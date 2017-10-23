// install plugin
Matter.use('matter-attractors');

// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Events = Matter.Events;

var center;
var canvas;
var context;
var world;
var engine;
var render;
var size;
var force;
var earth;
var sc;
var e1;
var fligh_path = true;
var center_path = false;
var burning = false;
var sc_positions;
var sc_positions_burn;

function create_space(section_id) {
    try {
        document.getElementById(section_id).innerHTML = "";
    } catch(error) {}
    // create world, engine and renderer
    center = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.clientWidth;
    canvas.height = window.clientHeight;

    world = World.create({gravity: {x: 0, y: 0, scale: 0}});
    engine = Engine.create({world: world, timing: {timeScale: 1}});
    render = Render.create({
        engine: engine,
        element: document.getElementById(section_id),
        canvas: canvas,
        options: {width: window.innerWidth,
                  height: window.innerHeight,
                  background: '#212121',
                  wireframes: false,
                  }});

    Render.run(render);

    MatterAttractors.Attractors.gravityConstant = 0.01;

    // create bodies
    size = 10;
    force = size/(18000+size*10);
    earth = Bodies.circle(center.x, center.y, 5*size,
                              {frictionAir: 0,
                               frictionStatic: 1,
                               friction: 1,
                               density: 0.01,
                               restitution: 0,
                               plugin: {attractors: [MatterAttractors.Attractors.gravity]},
                               render: {fillStyle: '#2196F3',
                                        strokeStyle: '#4CAF50',
                                        lineWidth: 10}});
    sc = Bodies.trapezoid(center.x, center.y-earth.circleRadius-size, 2*size, 3*size, 1,
                              {frictionAir: 0,
                               render: {fillStyle: '#3F51B5',
                                        lineWidth: 0}});

    e1 = Vector.sub(sc.position, earth.position);
    sc_positions = Array(128).fill([sc.position.x, sc.position.y]);
    sc_positions_burn = Array(128).fill([sc.position.x, sc.position.y]);

    Events.on(engine, 'afterUpdate', function(event) {
        // fix earth
        Body.setPosition(earth, center);

        // rotate rocket
        var l = sc_positions.length - 64;
        sc_pos_old = Vector.create(sc_positions[l], sc_positions[l+1]);
        var earth_sc_vec = Vector.sub(sc.position, earth.position);
        var quadrant = 0;
        if(earth_sc_vec.x > 0 && earth_sc_vec.y < 0) {
            quadrant = Math.PI / 2;
        } else if(earth_sc_vec.x > 0 && earth_sc_vec.y > 0) {
            quadrant = -Math.PI / 2;
        } else if(earth_sc_vec.x < 0 && earth_sc_vec.y > 0) {
            quadrant = -Math.PI / 2;
        } else if(earth_sc_vec.x < 0 && earth_sc_vec.y < 0) {
            quadrant = Math.PI / 2;
        }
        var earth_sc_angle = quadrant - Math.atan(earth_sc_vec.x / earth_sc_vec.y);
        Body.rotate(sc, earth_sc_angle - sc.angle);

        // draw paths
        sc_positions.push(sc.position.x);
        sc_positions.push(sc.position.y);
        if(fligh_path) {
            draw_flight_path();
            draw_flame();
        }
        if(burning) {
            sc_positions_burn.push(sc.position.x);
            sc_positions_burn.push(sc.position.y);
//            if(fligh_path) {
//                draw_flame();
//            }
        }
        if(l > 2048+1024) {
            sc_positions.shift();
            sc_positions.shift();
        }

    });

    // add all of the bodies to the world
    World.add(world, earth);
    World.add(world, sc);
}

function draw_flight_path() {
    context.beginPath();
    context.curve(sc_positions);
    context.lineWidth = 2;
    context.strokeStyle = '#3F51B5';
    context.stroke();
    context.closePath();
}

function draw_flame() {
    context.beginPath();
    context.curve(sc_positions_burn);
    context.lineWidth = 4;
    context.strokeStyle = '#F57F17';
    context.stroke();
    context.closePath();
}

function doSetTimeout(sc, force, start, i, STEP_t) {
    next_start = start + (i * STEP_t);
    setTimeout(function() {
        Body.applyForce(sc, sc.position, force);
    }, next_start);
}

function burn(force, start, dt) {
    var STEP_t = 1;
    i_max = dt / STEP_t;
    force.x /= i_max;
    force.y /= i_max;
    for(var i = 0; i < i_max; i++) {
        doSetTimeout(sc, force, start, i, STEP_t);
    }
    setTimeout(function() {
        burning = true;
    }, start);
    setTimeout(function() {
        burning = false;
    }, start + dt);
}
