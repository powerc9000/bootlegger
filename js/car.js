var $h = require("./head-on");
module.exports = (function(){
	function Car(x,y){
		this.position = $h.Vector(x||0, y||0);
		return this;
	}
	Car.prototype = {
		update: function(){
			return this.message;
		},
		position: $h.Vector(0,0),
		angle:0,
		width:50,
		height:100,
		speed:0
	}
	return Car;
}())