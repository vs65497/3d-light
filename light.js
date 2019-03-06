import { Vector } from './vector.class.js';
import { MathExt } from './math-extend.class.js';

var content;
var canvas;
var ctx;

var viewport = {w:1024/2,h:768/2};
var origin = {x:0, y:0, z:0};

var sphere = {};
var colors = {
    teal: '0, 128, 128',
    cyan: '0, 255, 255',
    blue: '0, 0, 255',
    purple: '128, 0, 128',
    yellow: '255, 255, 0',
    orange: '255, 165, 0',
    white: '255, 255, 255',
    black: '0, 0, 0',
};

var camera = {
    direction: {i:0,j:0,k:0}, // leave here for camera movement
    fov: MathExt.prototype.to_radians(90),
    center: {x:0,y:0}
};

var light = {
    center: {x:0,y:0,z:0},
    color: colors.white,
    intensity: 1
}

var redraw; // animation interval
var sphere_density = 14;
var animation_speed = 60;
var step_increment = 2;

function main() {
    init_canvas();
    init_sphere(sphere_density);
    init_ui();
    update_camera();
    draw(sphere);
    
    show_info();
    
    //animate(sphere, animation_speed);
}

function show_info() {
    console.log('density: '+sphere_density);
    console.log('animation speed: '+animation_speed);
    console.log('step increment: '+step_increment);
    console.log();
    console.log('camera:');
    console.log(camera);
    console.log();
    console.log('light source:');
    console.log(light);
    console.log();
}

function animate(entity, frames) {
    var tickrate = 1000 / frames;
    var degree = step_increment;
    redraw = setInterval(function(){
        reset_canvas();
        draw(entity,degree);
    },tickrate);
}

function pause() {
    clearInterval(redraw);
}

function reset_canvas() {
    ctx.translate(-viewport.w/2,-viewport.h/2);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,viewport.w,viewport.h);
    ctx.translate(viewport.w/2,viewport.h/2);
}

function update_camera() {
    var f = Math.round(viewport.h / Math.tan(camera.fov/2));
    camera.center.z = -f;
    
    light.center.y = f;
    light.center.z = f - 30;
    //light.center.x = f + 20
}

function init_canvas() {
    content = document.getElementById("content");
    canvas = document.createElement("canvas");
    canvas.width = viewport.w;
    canvas.height = viewport.h;
    
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba('+colors.black+',1)';
    ctx.fillRect(0,0,viewport.w,viewport.h);
    ctx.translate(viewport.w/2,viewport.h/2);
    
    content.appendChild(canvas);
}

function init_ui() {
    var form = document.createElement("form");
    var step = document.createElement("input");
    step.setAttribute("type","button");
    step.setAttribute("name","step-forward");
    step.setAttribute("value","step forward");
    step.addEventListener('click',function(){
        draw(sphere,step_increment);
    });
    
    var play = document.createElement("input");
    play.setAttribute("type","button");
    play.setAttribute("name","play");
    play.setAttribute("value","play");
    play.addEventListener('click',function(){
        animate(sphere, animation_speed);
    });
    
    var stop = document.createElement("input");
    stop.setAttribute("type","button");
    stop.setAttribute("name","pause");
    stop.setAttribute("value","pause");
    stop.addEventListener('click',function(){
        pause();
    });
    
    //form.appendChild(step);
    form.appendChild(play);
    form.appendChild(stop);
    document.getElementById("controls").appendChild(form);
}

function init_sphere(d) {
    var center = origin;
    var radius = 75;
    var density = 4 * d; // quadrants * (points / quadrant)
    var rotation_axis = {w:0,i:.704,j:.71,k:0};
    var x;
    var z;
    
    var creation_axis = {
        w: 0,
        i: 0,
        j: 1,
        k: 0
    }
    
    // create vertecies
    var points = [];
    for(var col=0;col<density;col++) {
        z = MathExt.prototype.to_radians((360/density) * (col));
        points[col] = [];
        
        for(var row=0;row<density;row++) {
            x = MathExt.prototype.to_radians((360/density) * (row));
            
            var r = {
                w: Math.cos(z),
                x: Math.sin(z)*creation_axis.i,
                y: Math.sin(z)*creation_axis.j,
                z: Math.sin(z)*creation_axis.k
            };

            var r1 = {
                w: r.w,
                x: -r.x,
                y: -r.y,
                z: -r.z
            };
            
            var p = {
                w: 0,
                x: radius * Math.sin(x),
                y: radius * Math.cos(x),
                z: 0
            };
            
            points[col][row] = Vector.prototype.hamilton(Vector.prototype.hamilton(r,p),r1);
            points[col][row] = Vector.prototype.add(points[col][row], origin);
        }
    }
    
    // create polygons
    var polygons = [];
    for(var col=0;col<points.length;col++) {
        var nxc = (col+1==points.length)? 0:col+1;
        
        for(var row=0;row<points[col].length;row++) {
            var nxr = (row+1==points[col].length)? 0:row+1;
            
            // Leave here for texture mapping
            //var rand = MathExt.prototype.get_random(0,colors.length);
            //var color = colors[rand];
            //color = (color==null)? colors[0]:color;
            
            polygons.push({
                //color: color,
                vertex: [
                    points[col][row],
                    points[col][nxr],
                    points[nxc][nxr],
                    points[nxc][row]
                ]
            });
        }
    }
    
    sphere = {
        rotation_axis: rotation_axis,
        center: center,
        radius: radius,
        density: density,
        type: 'sphere',
        color: colors.cyan,
        polygon: polygons
    };
}

function draw(entity,angle) {
    var f = camera.center.z;
    var c = camera.center;
    angle = (angle==null)?45:angle;
    
    for(var poly=0;poly<entity.polygon.length;poly++) {
        var polygon = entity.polygon[poly];
        
        ctx.beginPath();
            for(var v=0;v<polygon.vertex.length;v++) {
                var p = {};
                var t = Vector.prototype.rotate({
                    vector: polygon.vertex[v],
                    origin: entity.center,
                    angle: MathExt.prototype.to_radians(angle),
                    axis: entity.rotation_axis
                });
                
                entity.polygon[poly].vertex[v] = t;

                p.x = (f - c.x) * ((t.x - c.x) / (t.z + f)) + c.x;
                p.y = (f - c.y) * ((t.y - c.y) / (t.z + f)) + c.y;

                ctx.lineTo(p.x, p.y);
            }
        ctx.closePath();
        
        var camera_vis = is_visible(camera.center, entity.center, polygon.vertex);
        var center_plane = Math.sqrt(Math.pow(camera_vis.a,2) + Math.pow(camera_vis.b,2));
        var backface = Math.abs(camera_vis.c) < center_plane;
        
        if(!backface) {
            var lighting = light_poly(entity.center, polygon.vertex);
            
            ctx.fillStyle = lighting.fill_style;
            ctx.strokeStyle = lighting.stroke_style;
            
            ctx.fill();
            ctx.stroke();
        }
    }
}

function is_visible(eye, center, polygon) {
    var v = {
        a: new Vector(center,polygon[0]),
        b: new Vector(center,polygon[3]),
        c: new Vector(center,polygon[1]),
        d: new Vector(center,polygon[2])
    };
    
    v.north = Vector.prototype.add(v.a, v.b);
    v.south = Vector.prototype.add(v.c, v.d);
    v.normal = Vector.prototype.add(v.north, v.south);

    v.to_poly = new Vector(eye, v.normal);
    v.to_entity = new Vector(eye, center);
    var opposite = new Vector(center, v.normal);
    
    return {
        a: Vector.prototype.dot(v.to_entity, eye),
        b: Vector.prototype.dot(opposite, v.normal),
        c: Vector.prototype.dot(v.to_poly, eye)
    };
}

function light_poly(center, polygon) {
    var light_vis = is_visible(light.center, center, polygon);
    
    var a = Math.abs(light_vis.a);
    var b = Math.abs(light_vis.b);
    var c = Math.abs(light_vis.c);
    
    var max_c = Math.sqrt(Math.pow(a,2) - Math.pow(b,2));
    
    var intensity;
    var fill = sphere.color;
    var stroke;
    if(c <= max_c) {
        var theta = Math.atan(c / b);
        var min_theta = Math.atan(max_c / b);
        
        intensity = light.intensity - (theta / (min_theta + .05)).toFixed(1) + .1;
        stroke = colors.white;
        
    } else {
        intensity = 0;
        stroke = fill;
    }

    return {
        intensity: intensity,
        fill: fill,
        stroke: stroke,
        fill_style: 'rgba('+fill+','+intensity+')',
        stroke_style: 'rgba('+stroke+', .1)'
    }
}

window.onload = function() {
    main();
}