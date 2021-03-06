(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			var r;
			steering = this.seek($h.Vector(200, 10000));
			//steering.truncate(20);
			steering = steering.mul(1/this.mass);
			this.v = this.v.add(steering);
			this.v.truncate(this.topSpeed);
			this.angle = Math.atan2(this.v.y, this.v.x);
			this.position = this.position.add(this.v.mul(delta/1000));
			this.rotation = 0;
			if(r = $h.collides(this, $h.gamestate.player)){
				console.log("collide");
				console.log(this.v.length(), $h.gamestate.player.v);
				$h.gamestate.player.v = this.v;
				this.v = this.v.mul(0.93);
				this.position = this.position.sub($h.Vector(r.normal.x, r.normal.y).mul(r.overlap));
			}
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
},{"./car":2,"./head-on.js":4}],2:[function(require,module,exports){
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
		width:40,
		height:20,
		speed:0,
		a:0,
		maxRotation:1.25,
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
				this.angle
				);
			canvas.drawRect(this.width,this.height, this.position.x, this.position.y, "transparent",{width:1, color:"white"}, this.angle);
		}
		

	};
	return Car;
}());
},{"./head-on":4}],3:[function(require,module,exports){
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


},{"./NPC":1,"./head-on":4,"./init":5,"./player":6}],4:[function(require,module,exports){

module.exports = (function(window, undefined){
	"use strict";
	var headOn = (function(){
		var vectorProto;
		var headOn = {

				groups: {},
				_images: {},
				fps: 50,
				imagesLoaded: true,
				gameTime: 0,
				_update:"",
				_render:"",
				_ticks: 0,

				randInt: function(min, max) {
					return Math.floor(Math.random() * (max +1 - min)) + min;
				},
				randFloat: function(min, max) {
					return Math.random() * (max - min) + min;
				},
				events: {
					events: {},
					listen: function(eventName, callback){
						if(!this.events[eventName]){
							this.events[eventName] = [];
						}
						this.events[eventName].push(callback);
					},
					
					trigger: function(eventName){
						var args = [].splice.call(arguments, 1),
							e = this.events[eventName],
							l,
							i;
						if(e){
							l = e.length;
							for(i = 0; i < l; i++){
								e[i].apply(headOn, args);
							}
						}
						
					}
				},
				Camera: function(width, height, x, y, zoom){
					this.width = width;
					this.height = height;
					x = x || 0;
					y = y || 0;
					this.position = headOn.Vector(x, y);
					this.dimensions = headOn.Vector(width, height);
					this.center = headOn.Vector(x+width/2, y+height/2);
					this.zoomAmt = zoom || 1;
					return this;
				},
				animate: function(object,keyFrames,callback){
					var that, interval, currentFrame = 0;
					if(!object.animating){
						object.animating = true;
						object.image = keyFrames[0];
						that = this;

						interval = setInterval(function(){
							if(keyFrames.length === currentFrame){
								callback();
								object.animating = false;
								object.image = "";
								clearInterval(interval);
							}
							else{
								currentFrame += 1;
								object.image = keyFrames[currentFrame];
							}
						},1000/this.fps);
					}
					
					
					
				},

				update: function(cb){this._update = cb;},

				render: function(cb){this._render = cb;},

				entity: function(values, parent){
					var i, o, base;
					if (parent && typeof parent === "object") {
						o = Object.create(parent);
					}
					else{
						o = {};
					}
					for(i in values){
						if(values.hasOwnProperty(i)){
							o[i] = values[i];
						}
					}
					return o;
				},

				inherit: function (base, sub) {
					// Avoid instantiating the base class just to setup inheritance
					// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
					// for a polyfill
					sub.prototype = Object.create(base.prototype);
					// Remember the constructor property was set wrong, let's fix it
					sub.prototype.constructor = sub;
					// In ECMAScript5+ (all modern browsers), you can make the constructor property
					// non-enumerable if you define it like this instead
					Object.defineProperty(sub.prototype, 'constructor', { 
						enumerable: false, 
						value: sub 
					});
				},

				extend: function(base, values){
					var i;
					for(i in values){
						if(values.hasOwnProperty(i)){
							base[i] = values[i];
						}
					}
				},
				distance: function(obj1, obj2){
					return Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2));
				},
				collides: function(poly1, poly2) {
					var points1 = this.getPoints(poly1),
						points2 = this.getPoints(poly2),
						i = 0,
						l = points1.length,
						j, k = points2.length,
						normal = {
							x: 0,
							y: 0
						},
						length,
						min1, min2,
						max1, max2,
						interval,
						MTV = null,
						MTV2 = null,
						MN = null,
						dot,
						nextPoint,
						currentPoint;
						
					if(poly1.type === "circle" && poly2.type ==="circle"){
						return circleCircle(poly1, poly2);
					}else if(poly1.type === "circle"){
						return circleRect(poly1, poly2);
					}else if(poly2.type === "circle"){
						return circleRect(poly2, poly1);
					}
					

					//loop through the edges of Polygon 1
					for (; i < l; i++) {
						nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
						currentPoint = points1[i];

						//generate the normal for the current edge
						normal.x = -(nextPoint[1] - currentPoint[1]);
						normal.y = (nextPoint[0] - currentPoint[0]);

						//normalize the vector
						length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
						normal.x /= length;
						normal.y /= length;

						//default min max
						min1 = min2 = -1;
						max1 = max2 = -1;

						//project all vertices from poly1 onto axis
						for (j = 0; j < l; ++j) {
							dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
							if (dot > max1 || max1 === -1) max1 = dot;
							if (dot < min1 || min1 === -1) min1 = dot;
						}

						//project all vertices from poly2 onto axis
						for (j = 0; j < k; ++j) {
							dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
							if (dot > max2 || max2 === -1) max2 = dot;
							if (dot < min2 || min2 === -1) min2 = dot;
						}

						//calculate the minimum translation vector should be negative
						if (min1 < min2) {
							interval = min2 - max1;

							normal.x = -normal.x;
							normal.y = -normal.y;
						} else {
							interval = min1 - max2;
						}

						//exit early if positive
						if (interval >= 0) {
							return false;
						}

						if (MTV === null || interval > MTV) {
							MTV = interval;
							MN = {
								x: normal.x,
								y: normal.y
							};
						}
					}

					//loop through the edges of Polygon 2
					for (i = 0; i < k; i++) {
						nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
						currentPoint = points2[i];

						//generate the normal for the current edge
						normal.x = -(nextPoint[1] - currentPoint[1]);
						normal.y = (nextPoint[0] - currentPoint[0]);

						//normalize the vector
						length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
						normal.x /= length;
						normal.y /= length;

						//default min max
						min1 = min2 = -1;
						max1 = max2 = -1;

						//project all vertices from poly1 onto axis
						for (j = 0; j < l; ++j) {
							dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
							if (dot > max1 || max1 === -1) max1 = dot;
							if (dot < min1 || min1 === -1) min1 = dot;
						}

						//project all vertices from poly2 onto axis
						for (j = 0; j < k; ++j) {
							dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
							if (dot > max2 || max2 === -1) max2 = dot;
							if (dot < min2 || min2 === -1) min2 = dot;
						}

						//calculate the minimum translation vector should be negative
						if (min1 < min2) {
							interval = min2 - max1;

							normal.x = -normal.x;
							normal.y = -normal.y;
						} else {
							interval = min1 - max2;


						}

						//exit early if positive
						if (interval >= 0) {
							return false;
						}
					
						if (MTV === null || interval > MTV) MTV = interval;
						if (interval > MTV2 || MTV2 === null) {
							MTV2 = interval;
							MN = {
								x: normal.x,
								y: normal.y
							};
						}
					}

					return {
						overlap: MTV2,
						normal: MN
					};
					function circleRect(circle, rect){
						var newX = circle.position.x * Math.cos(-rect.angle);
						var newY = circle.position.y * Math.sin(-rect.angle);
						var circleDistance = {x:newX, y:newY};
						var cornerDistance_sq;
						circleDistance.x = Math.abs(circle.position.x - rect.position.x);
						circleDistance.y = Math.abs(circle.position.y - rect.position.y);

						if (circleDistance.x > (rect.width/2 + circle.radius)) { return false; }
						if (circleDistance.y > (rect.height/2 + circle.radius)) { return false; }

						if (circleDistance.x <= (rect.width/2)) { return true; } 
						if (circleDistance.y <= (rect.height/2)) { return true; }

						cornerDistance_sq = Math.pow(circleDistance.x - rect.width/2,2) +
											Math.pow(circleDistance.y - rect.height/2, 2);

						return (cornerDistance_sq <= Math.pow(circle.radius,2));
					}
					function pointInCircle(point, circle){
						return Math.pow(point.x - circle.position.x ,2) + Math.pow(point.y - circle.position.y, 2) < Math.pow(circle.radius,2);
					}
					function circleCircle(ob1, ob2){
						return square(ob2.position.x - ob1.position.x) + square(ob2.position.y - ob1.position.y) <= square(ob1.radius + ob2.radius);
					}
				},

				getPoints: function (obj){
					if(obj.type === "circle"){
						return [];
					}
					var x = obj.position.x,
						y = obj.position.y,
						width = obj.width,
						height = obj.height,
						angle = obj.angle,
						that = this,
						points = [];

					points[0] = [x,y];
					points[1] = [];
					points[1].push(Math.sin(-angle) * height + x);
					points[1].push(Math.cos(-angle) * height + y);
					points[2] = [];
					points[2].push(Math.cos(angle) * width + points[1][0]);
					points[2].push(Math.sin(angle) * width + points[1][1]);
					points[3] = [];
					points[3].push(Math.cos(angle) * width + x);
					points[3].push(Math.sin(angle) * width + y);
						//console.log(points);
					return points;

				},

				Timer: function(){
					this.jobs = [];
				},
				pause: function(){
					this.paused = true;
					this.events.trigger("pause");
				},
				unpause: function(){
					this.events.trigger("unpause");
					this.paused = false;
				},
				isPaused: function(){
					return this.paused;
				},
				group: function(groupName, entity){
					if(this.groups[groupName]){
						if(entity){
							this.groups[groupName].push(entity);
						}
					}
					else{
						this.groups[groupName] = [];
						if(entity){
							this.groups[groupName].push(entity);
						}
					}
					return this.groups[groupName];
				},

				loadImages: function(imageArray, imgCallback, allCallback){
					var args, img, total, loaded, timeout, interval, that, cb, imgOnload;
					that = this;
					this.imagesLoaded = false;
					total = imageArray.length;
					if(!total){
						this.imagesLoaded = true;
					}
					loaded = 0;
					imgOnload = function(){
						console.log("heyo");
						loaded += 1;
						imgCallback && imgCallback(image.name);
						if(loaded === total){
							allCallback && allCallback();
							that.imagesLoaded = true;
						}
					};
					imageArray.forEach(function(image){
						img = new Image();
						img.src = image.src;
						img.onload = imgOnload;
					
						that._images[image.name] = img;
					});
				},
				images: function(image){
					if(this._images[image]){
						return this._images[image];
					}
					else{
						return new Image();
					}
				},
				onTick: function(then){
					var now = Date.now(),
					modifier = now - then;
					this.trueFps = 1/(modifier/1000);
					this._ticks+=1;
					this._update(modifier, this._ticks);
					this._render(modifier, this._ticks);
					this.gameTime += modifier;

				},

				timeout: function(cb, time, scope){
					setTimeout(function(){
						cb.call(scope);
					}, time);
				},

				interval: function(cb, time, scope){
					return setInterval(function(){
						cb.call(scope);
					}, time);
				},
				canvas: function(name){
					if(this === headOn){
						return new this.canvas(name);
					}
					this.canvas = this.canvases[name];
					this.width = this.canvas.width;
					this.height = this.canvas.height;
					return this;
				},

				Vector: function(x, y){
					var vec = this.entity({x:x,y:y}, vectorProto);
					return vec;
				},
				run: function(){
					var that = this;
					var then = Date.now();

					window.requestAnimationFrame(aniframe);
					function aniframe(){
						if(that.imagesLoaded){
							that.onTick(then);
							then = Date.now();

						}
						window.requestAnimationFrame(aniframe);
					}
					
				},
				exception: function(message){
					this.message = message;
					this.name = "Head-on Exception";
					this.toString = function(){
						return this.name + ": " + this.message;
					};
				}
		};

		headOn.canvas.create = function(name, width, height, camera){
			var canvas, ctx;
			if(!camera || !(camera instanceof headOn.Camera)){
				throw new headOn.exception("Canvas must be intialized with a camera");
			}
			canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			ctx = canvas.getContext("2d");
			this.prototype.canvases[name] = {
				canvas: canvas,
				ctx: ctx,
				width: canvas.width,
				height: canvas.height,
				camera: camera
			};
		};
		headOn.canvas.prototype = {
			canvases: {},
			stroke: function(stroke){
				var ctx = this.canvas.ctx;
				ctx.save();
				if(stroke){
					ctx.lineWith = stroke.width;
					ctx.strokeStyle = stroke.color;
					ctx.stroke();
				}
				ctx.restore();
			},
			drawRect: function(width, height, x, y, color, stroke, rotation, center_of_rotation){
				var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera;
				ctx.save();
				ctx.beginPath();

				if(rotation){
					center_of_rotation = center_of_rotation || {x:0,y:0};
					ctx.translate((x + center_of_rotation.x- camera.position.x)/camera.zoomAmt ,(y + center_of_rotation.y- camera.position.y)/camera.zoomAmt);
					ctx.rotate(rotation);
					ctx.rect(0 - center_of_rotation.x, 0 - center_of_rotation.y , width / camera.zoomAmt, height / camera.zoomAmt);
				}
				else{
					//console.log(camera.position.x)
					ctx.rect((x - camera.position.x)/camera.zoomAmt , (y - camera.position.y)/camera.zoomAmt , width / camera.zoomAmt, height / camera.zoomAmt);
				}
				if(color){
					ctx.fillStyle = color;
				}
				
				ctx.fill();
				if(typeof stroke === "object" && !isEmpty(stroke)){
					this.stroke(stroke);
				}
				ctx.closePath();
				ctx.restore();
				return this;
			},
			drawCircle: function(x, y, radius, color, stroke){
				var ctx = this.canvas.ctx, camera = this.canvas.camera;
				ctx.save();
				ctx.beginPath();
				ctx.arc((x - camera.position.x)/camera.zoomAmt, (y - camera.position.y)/camera.zoomAmt, radius / camera.zoomAmt, 0, 2*Math.PI, false);
				ctx.fillStyle = color || "black";
				ctx.fill();
				this.stroke(stroke);
				ctx.restore();
				ctx.closePath();
				return this;
			},
			drawImage: function(image,x,y){
				var ctx = this.canvas.ctx, camera = this.canvas.camera;
				try{
					ctx.drawImage(image,(x - camera.position.x)/camera.zoomAmt , (y - camera.position.y)/camera.zoomAmt , image.width / camera.zoomAmt, image.height / camera.zoomAmt);	
				}
				catch(e){
					console.log(image);
				}
				return this;
			},

			drawImageRotated: function(image, rotation, x,y){
				var ctx = this.canvas.ctx;
				var radians = rotation * Math.PI / 180;
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(radians);
				ctx.drawImage(image, 0-image.width, 0-image.height);
				ctx.restore();
				return this;
			},

			drawText: function(textString, x, y, fontStyle, color, alignment, baseline){
				var ctx = this.canvas.ctx;
				ctx.save();

				if(fontStyle){
					ctx.font = fontStyle + " sans-serif";
				}
				if(color){
					ctx.fillStyle = color;
				}
				if(alignment){
					ctx.textAlign = alignment;
				}
				if(baseline){
					ctx.textBaseline = baseline;
				}

				ctx.fillText(textString,x,y);

				ctx.restore();
				return this;
			},

			append: function(element){
				element = document.querySelector(element);
				if(element){
					element.appendChild(this.canvas.canvas);
				}
				else{
					document.body.appendChild(this.canvas.canvas);
				}
				return this;
			},
			clear: function(){
				var ctx = this.canvas.ctx;
				ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
			},
			setCamera: function(cam){
				this.canvas.camera = cam;
			}
		};
		headOn.Timer.prototype = {
			job: function(time, start){
				var jiff = {
					TTL: time,
					remaining: start || time
				};
				this.jobs.push(jiff);
				return {
					ready: function(){
						return jiff.remaining <= 0;
					},
					reset: function(){
						jiff.remaining = jiff.TTL;
					},
					timeLeft: function(){
						return jiff.remaining;
					}
				};
			},
			update: function(time){
				this.jobs.forEach(function(j){
					j.remaining -= time;
				});
			}
		};
		headOn.Camera.prototype = {
			zoomIn: function(amt){
				this.zoomAmt /= amt;
				this.position = this.center.sub(this.dimensions.mul(this.zoomAmt / 2));
				return this;
			},
			zoomOut: function(amt){
				this.zoomAmt *= amt;
				this.position = this.center.sub(this.dimensions.mul(this.zoomAmt / 2));
				
				return this;
			},
			move: function(vec){
				this.position = this.position.add(vec);
				this.center = this.position.add(headOn.Vector(this.width, this.height).mul(0.5));
				return this;
			},
			moveTo: function(vec){
				this.position = vec.sub(this.dimensions.mul(0.5).mul(this.zoomAmt));
				this.center = vec;
			},
			unproject: function(vec){
				return vec.sub(this.position).mul(1/this.zoomAmt);
			}
		};
		vectorProto = {
			normalize: function(){
				var len = this.length();
				if(len === 0) return headOn.Vector(0,0);
				return headOn.Vector(this.x/len, this.y/len);
			},

			normalizeInPlace: function(){
				var len = this.length();
				this.x /= len;
				this.y /= len;
			},
			truncate: function(max){
				var i;
				i = max / this.length();
				i = i < 1 ? i : 1;
				this.mul(i);
			},
			dot: function(vec2){
				return vec2.x * this.x + vec2.y * this.y;
			},

			length: function(){
				return Math.sqrt(this.x*this.x + this.y*this.y);
			},

			sub: function(vec2){
				return headOn.Vector(this.x - vec2.x, this.y - vec2.y);
			},

			add: function(vec2){
				return headOn.Vector(this.x + vec2.x, this.y + vec2.y);
			},

			mul: function(scalar){
				return headOn.Vector(this.x * scalar, this.y * scalar);
			}
		};
		function sign(num){
			if(num < 0){
				return -1;
			}else{
				return 1;
			}
		}
		

		return headOn;
		function square(num){
			return num * num;
		}
		function isEmpty(obj){
			return Object.keys(obj).length === 0;
		}
	}());
	//window.headOn = headOn;
	return headOn;
}(window));
},{}],5:[function(require,module,exports){
var $h = require("./head-on");
module.exports  = (function(){
	return function(){
		console.log($h);
		$h.loadImages([{name:"road", src:"img/road.png"}]);
	};
}());
},{"./head-on":4}],6:[function(require,module,exports){
var Car = require("./car");
var $h = require("./head-on");
module.exports = (function(){
	"use strict";
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
			var r;
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
			if(r = $h.collides(this, {width:1, height:128*200, angle:0, position:$h.Vector(200,0)} )){
				console.log(this.v.normalize().y);
				this.position = this.position.sub($h.Vector(r.normal.x, r.normal.y).mul(r.overlap));
				this.speed *= 0.95;
				this.angle-=2*delta/1000 *this.v.normalize().y;
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
},{"./car":2,"./head-on":4}]},{},[3])