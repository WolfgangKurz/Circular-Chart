"use strict";
!function(){
	window.circular = (function(){
		return function(e){
			var adjusting = false;
			var adjust_width = function(e, c, r){
				if(typeof r=="undefined") r = true;

				if(adjusting) return;
				adjusting = true;

				e.width = parseInt(window.getComputedStyle(e.parentNode).getPropertyValue("width"));
				if(r){
					window.addEventListener("resize", function(){
						adjust_width(e, c, false);
					});
				}
				if(typeof c=="function") c();

				adjusting = false;
			};

			var ct = [
				"rgb(48,105,191)",
				"rgb(163,191,48)",
				"rgb(191,91,48)",
				"rgb(191,163,48)",
				"rgb(120,48,191)",
				"rgb(191,48,48)",
				"rgb(1,51,129)",
				"rgb(96,123,0)"
			];
			adjust_width(e, function(){
				var ctx = e.getContext("2d"), pi = Math.PI;
				var data = [];

				ctx.translate(0, -0.5);
				
				!function(){
					var a = e.getAttribute("data-chart").split(";");
					for(var i=0; i<a.length; i+=3){
						data.push({
							name: a[i],
							value: parseFloat(a[i+1]),
							color: a[i+2].length==0 ? ct[(i/3)%ct.length] : a[i+2]
						});
					}
					data = data.sort(function(a, b){
						return b.value - a.value;
					});
				}();

				var rc = {
					x: 0, y: 0,
					w: e.clientWidth,
					h: e.clientHeight
				};
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
				ctx.lineWidth = 0.6;

				var font_height = Math.min(16, (rc.h-20) / data.length - 10);
				ctx.font = font_height+"px Arial";
				ctx.textBaseline = "hanging"; 

				if(rc.w >= rc.h){ // long width
					var cw = rc.w * 2 / 3; // 2 of 3 size
					var ms = Math.min(cw, rc.h) * 9 / 10;

					var ta = -pi / 2, tv = 0;
					var y = 0, texts = [], tw = 0;
					for(var i in data) tv += data[i].value;
					for(var i in data) {
						var pt = " - " + data[i].value.toString() + "   (" + (Math.round(data[i].value*10000/tv)/100).toString() + " %)";
						var to = data[i].name + pt;
						var ww = ctx.measureText(to).width;
						texts.push({
							text: to,
							width: ww
						});
						tw = Math.max(tw, ww + (font_height*3/2));
					}

					for(var i in data){
						var bx = cw/2, by = rc.h/2;
						var v = data[i].value / tv * 2*pi;
						var p = function(){
							ctx.fillStyle = data[i].color;
							ctx.beginPath();
								ctx.arc(bx, by, ms/2, ta, ta+v);
								ctx.lineTo(bx, by);
							ctx.closePath();
						};

						p(); ctx.fill();
						p(); ctx.stroke();
						ta += v;
					}

					var tx = rc.w - tw - 10;
					ctx.fillStyle = "rgba(255, 255, 255, 0.66)";
					ctx.fillRect(tx - 10, 0, tw+20, data.length*(font_height+10) + 10);

					for(var i in data){
						ctx.fillStyle = data[i].color;
						ctx.fillRect(tx, y+10, font_height, font_height);
						ctx.strokeRect(tx, y+10, font_height, font_height);

						ctx.fillStyle = "#000";
						ctx.fillText(texts[i].text, tx + (font_height*3/2), y+10+2);
						y += font_height + 10;
					}
				}else{ // long height
					var ch = rc.h * 2 / 3; // 2 of 3 size
					var ms = Math.min(ch, rc.h) * 9 / 10;

					var ta = -pi / 2, tv = 0;
					var y = 0, texts = [], tw = 0;
					for(var i in data) tv += data[i].value;
					for(var i in data) {
						var pt = " - " + data[i].value.toString() + "   (" + (Math.round(data[i].value*10000/tv)/100).toString() + " %)";
						var to = data[i].name + pt;
						var ww = ctx.measureText(to).width;
						texts.push({
							text: to,
							width: ww
						});
						tw = Math.max(tw, ww + (font_height*3/2));
					}

					for(var i in data){
						var bx = rc.w/2, by = rc.h/3 + ms/2;
						var v = data[i].value / tv * 2*pi;
						var p = function(){
							ctx.fillStyle = data[i].color;
							ctx.beginPath();
								ctx.arc(bx, by, ms/2, ta, ta+v);
								ctx.lineTo(bx, by);
							ctx.closePath();
						};

						p(); ctx.fill();
						p(); ctx.stroke();
						ta += v;
					}

					var tx = rc.w - tw - 10;
					ctx.fillStyle = "rgba(255, 255, 255, 0.66)";
					ctx.fillRect(tx - 10, 0, tw+20, data.length*(font_height+10) + 10);

					for(var i in data){
						ctx.fillStyle = data[i].color;
						ctx.fillRect(tx, y+10, font_height, font_height);
						ctx.strokeRect(tx, y+10, font_height, font_height);

						ctx.fillStyle = "#000";
						ctx.fillText(texts[i].text, tx + (font_height*3/2), y+10+2);
						y += font_height + 10;
					}
				}
			});
		};
	}());
}()
