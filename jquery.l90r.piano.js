/* jquery.l90r.piano.js
 * 
 * (c) 2010 by Igor Prochazka
 * http://www.l90r.com/posts/piano-a-flexible-piano-keyboard-plugin-for-jquery
 * Licensed under GNU Public License (GPL) version 3 (http://www.gnu.org/licenses/gpl.html)
 *
 * Please, if you find this software useful publish a link back to the plugin's web page.
 */

(function($){
	$.widget('l90r.piano', {
		options: {
			layout : "piano",
			ivoryWidth : 18,
			ivoryHeight : 100,
			ebonyWidth : 0.5,
			ebonyHeight: 0.6,
			start : 9,
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
			this.element.children('.piano-key')
				.mousedown(this.press())
				.mouseup(this.release())
				.mouseout(this.release());
			this.element.bind('pianodown', this.highlight(true))
				.bind('pianoup', this.highlight(false));			
		},
		
		addkeys: function() {
			var obj = this.element;
			var layout = this.layouts[this.options.layout];
			var modulo = layout.length;
			var ebonyWidth = this.options.ivoryWidth * this.options.ebonyWidth;
			var ebonyHeight = this.options.ivoryHeight * this.options.ebonyHeight;
			var pos = obj.offset();
			
			// add key div's
			var whiteCounter = 0;
			for(var i=this.options.start; i<this.options.start+this.options.keys; i++) {
				var key = i % modulo;
				if(layout[key][0] == "w") {
					$('<div/>').addClass('piano-ivory piano-key piano-' + i).appendTo(obj).data('piano-key', i);
					whiteCounter++;
				} else {
					var xshift = layout[key][1];
					$('<div/>').width(ebonyWidth).height(ebonyHeight).css('position','absolute')
						.offset( { top:pos.top, left:pos.left + 1 + ((this.options.ivoryWidth+1)*whiteCounter) + (-1+xshift)*ebonyWidth/2 })
						.addClass('piano-ebony piano-key piano-' + i)
						.appendTo(obj)
						.data('piano-key', i);
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
		},
		
		pressed: new Array(),
		
		addKey: function(key) {
			this.pressed[key] = true;
		},
		
		removeKey: function(key) {
			delete this.pressed[key];
		},
		
		getKeys: function(key) {
			var keys = [];
			for( var key in this.pressed ) {
				keys.push(key);
			}
			return keys;
		},
		
		press: function() {
			var piano = this; 
			return function() {
				var key = $(this).data('piano-key');
				piano.addKey(key);
				piano.element.trigger('pianodown', [key, piano.getKeys()]);
				return false;
			}
		},
		
		release: function() {
			var piano = this; 
			return function() {
				var key = $(this).data('piano-key');
				piano.removeKey(key);
				piano.element.trigger('pianoup', [key, piano.getKeys()]);
				return false;
			}
		},
		
		highlight: function(hi) {
			var piano = this;
			var ivory = hi ? this.options.ivorySelected : this.options.ivory;
			var ebony = hi ? this.options.ebonySelected : this.options.ebony;
			return function(event, key) {
				var test = piano.element.children('.piano-' + key);
				piano.element.children('.piano-ivory.piano-' + key).css('background-color',ivory);
				piano.element.children('.piano-ebony.piano-' + key).css('background-color',ebony);
			}
		}

	});
		
}(jQuery));