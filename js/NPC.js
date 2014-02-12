var Car = require("./car");
var $h = require("./head-on.js");
module.exports = (function(){
	function NPC(x,y){
		Car.call(this, x,y);
	}
	$h.inherit(Car, NPC);
	$h.extend(NPC.prototype, {
		update: function(delta){
			this.speed = this.v.length();
			if(this.angle !== this.angleToPlayer()){
				console.log("yes");
				if(this.angle - this.angleToPlayer() < 0){
					this.rotation = this.maxRotation;
				}else{
					this.rotation = -this.maxRotation;
				}
				this.angle += this.rotation * delta/1000;
				console.log(this.rotation);
			}
			if(this.speed > $h.gamestate.player.speed){
				this.brake();
			}else{
				this.a = 1000;
			}
			this.speed += this.a * delta/1000;
			this.v = $h.Vector(Math.cos(this.angle), Math.sin(this.angle)).mul(this.speed)
			this.position = this.position.add(this.v.mul(delta/1000));
			this.rotation = 0;
		},
		angleToPlayer: function(){
			return $h.gamestate.player.angle;
			//console.log(angle);
			return angle;
		}
	})
	return NPC;
}())