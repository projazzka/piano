/* jquery.l90r.piano.js
 * 
 * (c) 2010 by Igor Prochazka
 * http://www.l90r.com/posts/piano-a-flexible-piano-keyboard-plugin-for-jquery
 * If you find it useful please publish a link back to the plugin's web page.
 */

(function($){
	$.widget('l90r.piano', {
		options: {
			layout : "piano",
			ivoryWidth : 13,
			ivoryHeight : 100,
			ebonyWidth : 0.5,
			ebonyHeight: 0.6,
			start : 4,
			keys : 88,
			ebony : '#666',
			ebonySelected : '#ddd',
			ivory : '#f5f5f5',
			ivorySelected : '#888',
			border : '#000',
			press : null,
			release : null
		},
		
		// layout format: [[<black ("b") or white ("w")>, black key displacement (0: middle, -1: all left, 1: all right)]]
		layouts : {
			"piano": [["w", 0], ["b", -0.5], ["w", 0], ["b", 0.5], ["w", 0], ["w", 0], ["b", -0.8], ["w", 0], ["b", 0], ["w", 0], ["b", 0.5], ["w", 0]],
			"simple": [["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0], ["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0]],
			"alternating": [["w",0], ["b",0]],
			"plain": [["w",0]]
		},

		_create: function(){			
			this.addkeys();
		},
		
		addkeys: function() {
			var obj = this.element;
			var layout = this.layouts[this.options.layout];
			var modulo = layout.length;
			var ebonyWidth = this.options.ivoryWidth * this.options.ebonyWidth;
			var ebonyHeight = this.options.ivoryHeight * this.options.ebonyHeight;
			
			// add key div's
			var whiteCounter = 0;
			for(var i=this.options.start; i<this.options.start+this.options.keys; i++) {
				var key = i % modulo;
				if(layout[key][0] == "w") {
					obj.append('<div class="piano-ivory piano-' + key + '"></div>');
					whiteCounter++;
				} else {
					var xshift = layout[key][1];
					obj.append('<div class="piano-ebony piano-' + key + '"></div>');
					var black = obj.children().last();
					var p = black.position();
					black.width(ebonyWidth).height(ebonyHeight).css('position','absolute')
						.offset( { top:p.top, left:(p.left  + (this.options.ivoryWidth+1)*whiteCounter) + (-1+xshift)*ebonyWidth/2 });
				}
			}
			
			// style white keys
			var ivory = obj.children('.piano-ivory').width(this.options.ivoryWidth).height(this.options.ivoryHeight)
				.css('background-color', this.options.ivory).css('float', 'left');
			if(this.options.border) {
				ivory.css('border', '1px solid ' + this.options.border).not(":last").css('border-right', 'none');
			}
			
			// style black keys
			if(this.options.border) {
				obj.children('.piano-ebony').css('background-color', this.options.ebony).css('border', '1px solid ' + this.options.border);
			}
		}

	});
		
}(jQuery));