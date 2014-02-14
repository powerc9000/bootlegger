var $h = require("./head-on");
module.exports = (function(){
	"use strict";
	function Car(x,y){
		this.position = $h.Vector(x||0, y||0);
		return this;
	}
	Car.prototype = {
		
		position: $h.Vector(0,0),
		angle:0,
		width:5,
		height:10,
		speed:0,
		a:0,
		maxRotation:2,
		rotation:0,
		color:"blue",
		v: $h.Vector(0,0),
		update: function(time){
			//return this.message;
		},
		brake: function(mul){
			mul = mul || 0.93;
			this.a = 0;
			this.speed *= mul;
		},
		render:function(canvas){
			canvas.drawRect(this.width, 
				this.height, 
				this.position.x, 
				this.position.y, 
				this.color, {}, 
				this.angle - Math.PI/2, 
				{x:this.width/2, y:10}
				);
		}
		

	};
	return Car;
}());