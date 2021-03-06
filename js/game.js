var $h = require("./head-on"),
	Player = require("./player"),
	NPC = require("./NPC"),
	init = require("./init"),
	camera = new $h.Camera(500, 500),
	maskCamera = new $h.Camera(500,500),
	keyMap = {
		37:"left",
		38:"up",
		39:"right",
		40:"down",
		32: "space"
	},
	mask,
	canvas,
	player,
	npc;
init();
player = new Player(203, 200); 
npc = new NPC(200, 400);
$h.mousePos = {y:0, x:0};
$h.gamestate = {};
$h.gamestate.camera = camera;
$h.gamestate.player = player;
$h.canvas.create("main", 500, 500, camera);
$h.canvas.create("mask", 500, 500, maskCamera);
mask = $h.canvas("mask");
canvas = $h.canvas("main");
canvas.append("body");
mask.append("body");
$h.keys = {};
console.log(mask);
mask.drawRect( 500, 500,0,0, "rgba(0,0,0,0)");
mask.canvas.ctx.globalCompositeOperation = 'destination-out';
$h.render(function(){
	canvas.clear();

	mask.drawRect(50,50,250,250,"white");


	for(var i=0; i<200; i++){
		canvas.drawImage($h.images("road"), 200, i*128);
	}
	player.render(canvas);
	npc.render(canvas);
	canvas.drawRect(20,20, 20, 20, "green");
	canvas.canvas.ctx.drawImage(mask.canvas.canvas,0,0);
});

$h.update(function(delta){
	player.update(delta);
	npc.update(delta);

});
$h.run();
canvas.canvas.canvas.addEventListener("mousemove", function(e){
	var bounds = canvas.canvas.canvas.getBoundingClientRect();
	$h.mousePos = {x:e.pageX - bounds.left, y: e.pageY - bounds.top};
});
window.addEventListener("keydown", function(e){
	
	$h.keys[keyMap[e.which]] = true;
});
window.addEventListener("keyup", function(e){
	$h.keys[keyMap[e.which]] = false;
});
console.log(player);
console.log($h);

