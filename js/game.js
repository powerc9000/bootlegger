var $h = require("./head-on"),
	Player = require("./player"),
	NPC = require("./NPC"),
	camera = new $h.Camera(500, 500),
	keyMap = {
		37:"left",
		38:"up",
		39:"right",
		40:"down",
		32: "space"
	},
	canvas,
	player,
	npc;
player = new Player(200, 200); 
npc = new NPC(200, 400);
$h.mousePos = {y:0, x:0}
$h.gamestate = {};
$h.gamestate.camera = camera;
$h.gamestate.player = player;
$h.canvas.create("main", 500, 500, camera);
canvas = $h.canvas("main");
canvas.append("body"); 
$h.keys = {};
$h.render(function(){
	canvas.clear();
	for(var i=0; i<200; i++){
		canvas.drawRect(50, 50, 200+i, i*49, "grey");
	}
	player.render(canvas);
	npc.render(canvas);
	canvas.drawRect(20,20, 20, 20, "green")
});

$h.update(function(delta){
	player.update(delta);
	npc.update(delta);
});
$h.run()
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

