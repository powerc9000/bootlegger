var Car = require("./car");
var $h = require("./head-on");
module.exports = (function(){
	//console.log(headOn)
	function Player(x,y){
		Car.call(this, x,y);
	}

	$h.inherit(Car, Player);
	
	$h.extend(Player.prototype, {
		
		color:"red",
		topSpeed:1000,
		reverse:1,
		update: function(delta){
			var camera = $h.gamestate.camera;
			var rotationMul;
			this.speed = this.v.length();
			if(this.speed > this.topSpeed){
				this.speed = this.topSpeed;
			}
			if(Math.abs(this.speed) < 1.5){
				this.speed = 0;
			}
			if($h.keys.up){
				if(this.speed === 0){
					this.reverse *= -1;
				}
				this.a = 200;
				
			}else if($h.keys.down){
				if(this.speed === 0){
					this.reverse *= -1;
					this.a = -200;
				}
				else if(this.reverse !== -1){
					this.brake();
				}
				
			}else{
				this.a = 0;
			}

			rotationMul = (this.speed === 0 ) ? this.speed : 500/this.speed;
			if($h.keys.right){
				this.rotation = this.maxRotation * rotationMul;
			}
			else if($h.keys.left){
				this.rotation = -this.maxRotation * rotationMul;
			}else{
				this.rotation = 0;
			}
			if($h.keys.space){
				this.brake();
			}
			if(Math.abs(this.rotation) > this.maxRotation){
				if(this.rotation > 0){
					this.rotation = this.maxRotation;
				}else{
					this.rotation = -this.maxRotation;
				}
				
			}
			this.angle += this.rotation * delta/1000;
			this.speed *= this.reverse;
			this.speed += this.a * delta/1000;
			//Friction from the road.
			if(!this.a){
				this.speed *= 0.99;
			}
			
			//this.a = this.a.mul(.9)
			this.v = $h.Vector(Math.cos(this.angle), Math.sin(this.angle)).mul(this.speed);
			this.position = this.position.add(this.v.mul(delta/1000));
			camera.moveTo(this.position);
			
			//console.log(this.speed, this.a);
		}
	});
	return Player;
}());