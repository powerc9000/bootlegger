var $h = require("./head-on");
module.exports  = (function(){
	return function(){
		console.log($h);
		$h.loadImages([{name:"road", src:"img/road.png"}]);
	};
}());