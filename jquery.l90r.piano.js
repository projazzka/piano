/* jquery.l90r.piano.js
 * 
 * (c) 2010 by Igor Prochazka
 * http://www.l90r.com/posts/piano-a-flexible-piano-keyboard-plugin-for-jquery
 * Licensed under GNU Public License (GPL) version 3 (http://www.gnu.org/licenses/gpl.html)
 *
 * Please, if you find this software useful publish a link back to the plugin's web page.
 */
function getKeybyValue(value,array){
  for (var j in array)
  {
    if (array[j]==value){
      return j;
    }  
  }
}

(function($){
	$.widget('l90r.piano', {
		options: {
			layout : "piano",
			whiteWidth : 36,
			whiteHeight : 200,
			blackWidth : 18,
			blackHeight: 120,
			start : 36,
			keys : 25,
			blackColor : '#666',
			blackColorSelected : '#4f78c4',
			whiteColor : '#f5f5f5',
			whiteColorSelected : '#91b3f2',
			borderColor : '#000',
			kbd_keys: 'two_oct',
			show_keys: true,
			charWhiteKeyColor:'#885',
			charBlackKeyColor:'#DDB',
			sustain : false
		},
		
		// public widget method
		sustain: function(down) {
			this.sustained = down;
			var piano = this;
			if(!down) {
				$.each(piano._getKeys(), function(idx, val) { piano._releaseKey(val); });
			}
		},

		_sustained: false,
		
		_pressedKeys: new Array(),
				
		// layout format: [[<black ("b") or white ("w")>, black key displacement (0: middle, -1: all left, 1: all right)]]
		_layouts : {
			"piano": [["w", 0], ["b", -0.5], ["w", 0], ["b", 0.5], ["w", 0], ["w", 0], ["b", -0.8], ["w", 0], ["b", 0], ["w", 0], ["b", 0.5], ["w", 0]],
      "simple": [["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0], ["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0]],
			"alternating": [["w",0], ["b",0]],
			"plain": [["w",0]]
		},
		
			
		_keyboard_keys: {
		  "one_oct":{
          keypress:{122:36, //z -> C
                    120:38, //x  -> D
                    99:40,  //c  -> E
                    118:41, //v  -> F
                    98:43,  //b  -> G
                    110:45, //n  -> A
                    109:47, //m  -> B
                    44:48,  //, -> C'
                    //accidentals
                    115:37,   //s -> C#
                    100:39,   //d -> D#
                    103:42,   //g  -> F#
                    104:44,   //h  -> G#
                    106:46    //j  ->  A#             
                    }, // ,
          keyup:{90:36, //z
                88:38,  //x
                67:40,  //C
                86:41,  //v
                66:43,  //b
                78:45,  //n
                77:47,  //m
                188:48, //,
                //Accidentals
                83:37,
                68:39,
                71:42,
                72:44,
                74:46 } 
      },
      "two_oct":{
          keypress:{122:36, //z -> C
                    120:38, //x  -> D
                    99:40,  //c  -> E
                    118:41, //v  -> F
                    98:43,  //b  -> G
                    110:45, //n  -> A
                    109:47, //m  -> B
                    119:48,  //w -> C'
                    101:50,  //e -> D'
                    114:52,  //r -> E'
                    116:53,  //t -> F'
                    121:55,  //y -> G'
                    117:57,  //u -> A'
                    105:59,  //i -> B'
                    111:60,  //o -> C''
                    //accidentals
                    115:37,   //s -> C#
                    100:39,   //d -> D#
                    103:42,   //g  -> F#
                    104:44,   //h  -> G#
                    106:46,    //j  ->  A#
                    51:49,    //3 -> C#'
                    52:51,    //4 -> D#'
                    54:54,    //6 -> F#'
                    55:56,    //7 -> G#'
                    56:58     //8 -> A#'
                    }, // ,
          keyup:{90:36, //z
                88:38,  //x
                67:40,  //C
                86:41,  //v
                66:43,  //b
                78:45,  //n
                77:47,  //m
                87:48, //w
                69:50, //e
                82:52, //r
                84:53, //t
                89:55, //y
                85:57, //u
                73:59, //i
                79:60, //o
                //Accidentals
                83:37,  //s -> C#
                68:39,  //d -> D#
                71:42,  //g  -> F#
                72:44,  //h  -> G#
                74:46,   //j  ->  A#
                51:49,    //3 -> C#'
                52:51,    //4 -> D#'
                54:54,    //6 -> F#'
                55:56,    //7 -> G#'
                56:58     //8 -> A#'
            } 
      
      
      }
		},
		_create: function(){			 
			this._createKeys();        
      var self=this;   
			$(document).keypress(function(e){
			         var key=self._keyboard_keys[self.options.kbd_keys]['keypress'][e.which];
			         if (key==null) return; 
                self._pressKey(key);
      }).keyup(function(e){
              var key=self._keyboard_keys[self.options.kbd_keys]['keyup'][e.which];
            	self._releaseKey(key);
      });
        
			this.element.children('.piano-key')
				.mousedown(this._mouseDownCb())
				.mouseup(this._mouseUpCb())
				.mouseout(this._mouseUpCb());
			   
			this.element.bind('pianodown', this._highlight(true))
				.bind('pianoup', this._highlight(false));			
			this.sustained = this.options.sustain;
		},
		
		_createKeys: function() {
			var obj = this.element;
			obj.height(this.options.whiteHeight);
			var layout = this._layouts[this.options.layout];
			var modulo = layout.length;
			var blackWidth = this.options.blackWidth;
			var blackHeight = this.options.blackHeight;
			var pos = obj.offset();
			
			// add key div's
			var whiteCounter = 0;
			for(var i=this.options.start; i<this.options.start+this.options.keys; i++) {
				var key = i % modulo;
        var r=String.fromCharCode(getKeybyValue(i,this._keyboard_keys[this.options.kbd_keys]['keypress'])).toUpperCase();
        
        if(layout[key][0] == "w") {
          var div=$('<div/>').addClass('piano-ivory piano-key piano-' + i)
          .data('piano-key', i);
          
          if (this.options.show_keys)
          {
              div.append('<p>'+r+'</p>');
          }
          
          div.appendTo(obj).data('piano-key', i);
          
					whiteCounter++;
				} else {
					var xshift = layout[key][1];
					var div=$('<div/>').width(blackWidth).height(blackHeight).css('position','absolute')
						.offset( { top:pos.top, left:pos.left + 1 + ((this.options.whiteWidth+1)*whiteCounter) + Math.round((-1+xshift)*blackWidth/2) })
						.addClass('piano-ebony piano-key piano-' + i)
						.data('piano-key', i);
						 
            if (this.options.show_keys)
            {
                div.append('<p>'+r+'</p>');
            }
            
            div.appendTo(obj);
				}
			}
			
			// style white keys
			var whiteKeys = obj.children('.piano-ivory').width(this.options.whiteWidth).height(this.options.whiteHeight)
				.css('background-color', this.options.whiteColor).css('float', 'left');
			if(this.options.borderColor) {
				whiteKeys.css('border', '1px solid ' + this.options.borderColor).not(":last").css('border-right', 'none');
			}
			if (this.options.show_keys)
      {
          whiteKeys.children()
            .css('margin-top',this.options.whiteHeight-this.options.whiteHeight/8)
            .css('margin-left',this.options.whiteWidth/3)
            .css('color',this.options.charWhiteKeyColor)
            .css('font-size',this.options.whiteWidth/3);
      }
			
			
			// style black keys
			if(this.options.borderColor) {
				obj.children('.piano-ebony').css('background-color', this.options.blackColor).css('border', '1px solid ' + this.options.borderColor);
			}
			
			if (this.options.show_keys)
      {
          obj.children('.piano-ebony').children()
            .css('margin-top',this.options.blackHeight-this.options.blackHeight/6)
            .css('margin-left',this.options.blackWidth/3)
            .css('color',this.options.charBlackKeyColor)
            .css('font-size',this.options.blackWidth/2);
      }
		},
		
		_addKey: function(key) {
			this._pressedKeys[key] = true;
		},
		
		_removeKey: function(key) {
			delete this._pressedKeys[key];
		},
		
		// get array of pressed keys
		_getKeys: function() {
			var keys = [];
			for( var key in this._pressedKeys ) {
				keys.push(key);
			}
			return keys;
		},
		
		_pressKey: function(key) {
				this._addKey(key);
				this.element.trigger('pianodown', [key, this._getKeys()]);			
		},
		
		_releaseKey: function(key) {
				this._removeKey(key);
				this.element.trigger('pianoup', [key, this._getKeys()]);			
		},
		_mouseDownCb: function() {
		  var piano = this; 
			return function() {  
			  
				var key = $(this).data('piano-key');
				piano._pressKey(key);
				return false;
			}
		},
		
		_mouseUpCb: function() {
			var piano = this; 
			return function() {
				if(piano.sustained) {
					return;
				}
				var key = $(this).data('piano-key');
				piano._releaseKey(key);
				return false;
			}
		},
		
		_highlight: function(hi) {
			var piano = this;
			var ivory = hi ? this.options.whiteColorSelected : this.options.whiteColor;
			var ebony = hi ? this.options.blackColorSelected : this.options.blackColor;
			return function(event, key) {
				var test = piano.element.children('.piano-' + key);
				piano.element.children('.piano-ivory.piano-' + key).css('background-color',ivory);
				piano.element.children('.piano-ebony.piano-' + key).css('background-color',ebony);
			}
		}
	});
		
}(jQuery));