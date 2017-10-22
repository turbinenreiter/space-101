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

// create world, engine and renderer
var center = {x: window.innerWidth / 2, y: window.innerHeight / 2}
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = window.clientWidth;
canvas.height = window.clientHeight;

var world = World.create({gravity: {x: 0, y: 0, scale: 0}});
var engine = Engine.create({world: world, timing: {timeScale: 1}});
var render = Render.create({
    engine: engine,
    element: document.body,
    canvas: canvas,
    options: {width: window.innerWidth,
              height: window.innerHeight,
//              pixelRatio: 1,
              background: '#212121',
//              hasBounds: true,
//              enabled: true,
              wireframes: false,
//              showSleeping: false,
//              showDebug: true,
//              showBroadphase: false,
//              showBounds: false,
//              showVelocity: true,
//              showCollisions: true,
//              showSeparations: false,
//              showAxes: false,
//              showPositions: false,
//              showAngleIndicator: true,
//              showIds: false,
//              showShadows: false,
//              showVertexNumbers: false,
//              showConvexHulls: false,
//              showInternalEdges: false,
//              showMousePosition: false
              }});

Render.run(render);

MatterAttractors.Attractors.gravityConstant = 0.01;

// create bodies
var size = 10;
var force = size/(18000+size*10);
var earth = Bodies.circle(center.x, center.y, 5*size,
                          {frictionAir: 0,
                           frictionStatic: 1,
                           friction: 1,
                           density: 0.01,
                           restitution: 0,
                           plugin: {attractors: [MatterAttractors.Attractors.gravity]},
                           render: {fillStyle: '#2196F3',
                                    strokeStyle: '#4CAF50',
                                    lineWidth: 10}});
var sc = Bodies.trapezoid(center.x, center.y-earth.circleRadius-size, 2*size, 3*size, 1,
                          {frictionAir: 0,
                           render: {fillStyle: '#3F51B5',
                                    lineWidth: 0}});

var e1 = Vector.sub(sc.position, earth.position);

function draw_flight_path() {
    context.beginPath();
    context.curve(sc_positions);
    context.lineWidth = 2;
    context.strokeStyle = '#3F51B5';
    context.stroke();
    context.closePath();
}

function draw_center_path() {
    // draw path to center
    context.beginPath();
    context.moveTo(earth.position.x, earth.position.y);
    context.lineTo(sc.position.x, sc.position.y);
    context.lineWidth = 2;
    context.strokeStyle = '#F44336';
    context.stroke();
    context.closePath();
    // draw tangent
    context.beginPath();
    context.moveTo(sc_pos_old.x, sc_pos_old.y);
    context.lineTo(sc.position.x, sc.position.y);
    context.lineWidth = 2;
    context.strokeStyle = '#F44336';
    context.stroke();
    context.closePath();
}

var fligh_path = true;
var center_path = false;
sc_positions = Array(128).fill([sc.position.x, sc.position.y]);
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
    Body.setAngle(sc, earth_sc_angle);

    // draw paths
    sc_positions.push(sc.position.x);
    sc_positions.push(sc.position.y);
    if(l > 2048) {
        sc_positions.shift();
        sc_positions.shift();
    }
    if(fligh_path) { draw_flight_path(); }
    if(center_path) { draw_center_path(); }
});

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
}

// add all of the bodies to the world
World.add(world, earth);
World.add(world, sc);
