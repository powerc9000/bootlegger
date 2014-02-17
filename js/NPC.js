var Car = require("./car");
var $h = require("./head-on.js");
module.exports = (function(){
	function NPC(x,y){
		Car.call(this, x,y);
	}
	$h.inherit(Car, NPC);
	$h.extend(NPC.prototype, {
		topSpeed:1000,
		maxRotation: 20,
		mass:50,
		update: function(delta){
			steering = this.seek($h.gamestate.player.position);
			//steering.truncate(20);
			steering = steering.mul(1/this.mass);
			this.v = this.v.add(steering);
			this.v.truncate(this.topSpeed);
			this.angle = Math.atan2(this.v.y, this.v.x);
			this.position = this.position.add(this.v.mul(delta/1000));
			this.rotation = 0;
		},

		angleToPlayer: function(){
			var vector = $h.gamestate.player.position.sub(this.position);
			var angle = Math.atan2(vector.y, vector.x);
			//angle += Math.PI
			return angle;
		},

		seek: function(position){
			var targetV = position.sub(this.position);
			var distance = targetV.length();
			targetV = targetV.normalize();
			if(distance <= 500){
				targetV = targetV.mul(this.topSpeed * distance/500);
			}else{
				targetV = targetV.mul(this.topSpeed);
			}
			return targetV.sub(this.v);
		},

		pursue: function(obj){
			return this.seek(obj.position.add(obj.v));
		}
	});
	return NPC;
}());