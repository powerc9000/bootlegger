var Car = require("./car");
var $h = require("./head-on");
module.exports = (function(){
	//console.log(headOn)
	function Player(x,y){
		Car.call(this, x,y);
	}

	$h.inherit(Car, Player);
	
	$h.extend(Player.prototype, {
		render: function(canvas){
			canvas.drawRect(this.width, 
				this.height, 
				this.position.x, 
				this.position.y, 
				"black", {}, 
				this.angle - Math.PI/2, 
				{x:this.width/2, y:10}
				);
		},
		update: function(delta){
			var camera = $h.gamestate.camera;
			var proj = camera.unproject($h.Vector(this.position.x, this.position.y))
			this.angle = Math.atan2($h.mousePos.y - proj.y + 10, $h.mousePos.x - proj.x +this.width/2);
			if($h.keys.up){
				this.speed += 50 * delta/1000
			}else if($h.keys.down){
				this.speed -= 200 * delta/1000
			}
			this.position.x += this.speed * Math.cos(this.angle) * delta / 1000
			this.position.y += this.speed * Math.sin(this.angle) * delta / 1000
			camera.moveTo($h.Vector(this.position.x, this.position.y))
		}
	});
	return Player;
}())