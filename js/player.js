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
		v: $h.Vector(0,0),
		a:0,
		maxRotation:2,
		rotation:0,
		speed:0,
		topSpeed:1000,
		reverse:1,
		update: function(delta){
			var camera = $h.gamestate.camera;
			this.speed = this.v.length();
			if(this.speed > this.topSpeed){
				this.speed = this.topSpeed;
			}
			if(Math.abs(this.speed) < 0.5){
				this.speed = 0;
			}
			if($h.keys.up){
				if(this.speed === 0){
					this.reverse *= -1;
				}
				
				this.a = 200
			}else if($h.keys.down){
				if(this.speed === 0){
					this.reverse *= -1;
				}
				this.a = -200
			}else{
				this.a = 0;
			}
			if($h.keys.right){
				this.rotation = this.maxRotation ;
			}
			else if($h.keys.left){
				this.rotation = -this.maxRotation ;
			}else{
				this.rotation = 0;
			}
			if($h.keys.space){
				this.a = 500 * -this.reverse;
			}
			
			this.angle += this.rotation * delta/1000;
			this.speed *= this.reverse;
			this.speed += this.a * delta/1000;
			//this.a = this.a.mul(.9)
			this.v = $h.Vector(Math.cos(this.angle), Math.sin(this.angle)).mul(this.speed)
			this.position = this.position.add(this.v.mul(delta/1000));
			camera.moveTo(this.position);
			
			console.log(this.reverse);
		}
	});
	return Player;
}())