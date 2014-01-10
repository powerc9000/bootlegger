var $h = require("./head-on")
var player = require("./player")($h);
var camera = new $h.Camera(500, 500);
var canvas;
var player = {
	x:200,
	y:200,
	width:20,
	height:50,
	speed:0
}
var keys = {}
$h.mousePos = {y:0, x:0}
console.log()
$h.canvas.create("main", 500, 500, camera);
canvas = $h.canvas("main");
canvas.append("body"); 

$h.render(function(){
	canvas.clear();
	for(var i=0; i<200; i++){
		canvas.drawRect(50, 50, 200+i, i*49, "grey");
	}
	canvas.drawRect(player.width, player.height, player.x, player.y, "black", {}, player.angle - Math.PI/2, {x:player.width/2, y:10});
	canvas.drawRect(20,20, 20, 20, "green")
});

$h.update(function(delta){
	var proj = camera.unproject($h.Vector(player.x, player.y))
	player.angle = Math.atan2($h.mousePos.y - proj.y + 10, $h.mousePos.x - proj.x +player.width/2);
	if(keys.up){
		player.speed += 50 * delta/1000
	}else if(keys.down){
		player.speed -= 200 * delta/1000
	}
	player.x += player.speed * Math.cos(player.angle) * delta / 1000
	player.y += player.speed * Math.sin(player.angle) * delta / 1000
	camera.moveTo($h.Vector(player.x, player.y))
});
$h.run()
canvas.canvas.canvas.addEventListener("mousemove", function(e){
	var bounds = canvas.canvas.canvas.getBoundingClientRect();
	$h.mousePos = {x:e.pageX - bounds.left, y: e.pageY - bounds.top};
});
window.addEventListener("keydown", function(e){
	var keyMap = {
		37:"left",
		38:"up",
		39:"right",
		40:"down"
	}
	keys[keyMap[e.which]] = true;
});
window.addEventListener("keyup", function(e){
	var keyMap = {
		37:"left",
		38:"up",
		39:"right",
		40:"down"
	}
	keys[keyMap[e.which]] = false;
});
console.log(player);
console.log($h);

