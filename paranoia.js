(function() {  
    
    var SVG_HTML_TEMPLATE      = [
        '<svg width="50" height="50" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">',
        ' <g>',
        '  <circle name="eye"   fill="#ffffff" stroke="#000000" stroke-width="5" cx="60" cy="60" r="50" />',
        '  <circle name="apple" fill="#000000" stroke="#000000" stroke-width="5" stroke-linejoin="null" stroke-linecap="null" cx="80" cy="60" r="12"/>',
        ' </g>',
        '</svg>'
    ].join("");
    
    var Eye = function( imageSelector, options ) { 
        var self = this;
                        
        this.iamageSelector = imageSelector;

        this._element = document.querySelector( imageSelector );

        if ( !this._element ) {
            throw new Error("Not valid image selector");
            return;
        }        
        
        // Default options
        this.options = {
            "x"         : 0,
            "y"         : 0,
            "size"      : 50,
            "appleSize" : 12,
            "color"     : "#FFFFFF"
        };

        // Replace default optinos
        for( var key in options ) {
            this.options[key] = options[key];
        };   
        
        this._build();        
    }
    
    Eye.prototype._build = function() {
        var self = this;
        
        this.cloneEyeObject = ParanoiaJS._cloneTemplate();     
        
        this.svgElement   = this.cloneEyeObject.querySelector("svg");
        this.eyeElement   = this.cloneEyeObject.querySelector("[name=eye]");
        this.appleElement = this.cloneEyeObject.querySelector("[name=apple]");
                            
        this.svgElement.setAttribute("width" , this.options["size"]);
        this.svgElement.setAttribute("height", this.options["size"]);
        
        this.eyeElement.setAttribute("fill", this.options["color"]);
        
        this.appleElement.setAttribute("r", this.options["appleSize"]);
        
        document.body.appendChild( this.cloneEyeObject );

        this.moveToPosition();             
        
        // Set visible AFTER change position
        this.cloneEyeObject.style.display = "block";        
    }
    
    Eye.prototype.moveToPosition = function() {           
        this.move( this.options["x"], this.options["y"] );   
    }
        
    // Relactive to parent image
    Eye.prototype.move = function( x, y ) {
        var parentPostion = this._element.getBoundingClientRect();        
        
        this.cloneEyeObject.style.position = "absolute";
        this.cloneEyeObject.style.left = parentPostion["left"] + x + "px";
        this.cloneEyeObject.style.top  = parentPostion["top"]  + y + "px";
    }
        
    Eye.prototype.render = function( x2, y2 ) {               
        var cloneEyeObjectPos = this.cloneEyeObject.getBoundingClientRect();
                
        var x1 = cloneEyeObjectPos.left + cloneEyeObjectPos.width/2;
        var y1 = cloneEyeObjectPos.top  + cloneEyeObjectPos.height/2; 
                
        var angle = Math.atan2( y2 - y1, x2 - x1 ) * (180/Math.PI) ;

        this.appleElement.setAttribute( "transform", "rotate(" + angle + ", 60, 60)" );        
    }
    
    window.ParanoiaJS = new (function() {
        var self = this;
        
        this._eyes = [];
        this.isInitialized = false;
                
        this._listen = function() {
            window.addEventListener("mousemove", function( e ) {
                self._renderEyes( e.x, e.y );
            }, false);
            
            window.addEventListener("resize", function( e ) {
                self._resize();
            }, false);
        }
        
        this.add = function( imageSelector, options ) {
            if ( !self.isInitialized ) self._init();
            
            var eye = new Eye( imageSelector, options );                        
            this._eyes.push( eye );
            
            eye._element.addEventListener("load", function() {                
                self._resize();
            }, false);            
                        
            return eye;
        }
        
        this.render = function() {
            self._resize();
        }
        
        this._renderEyes = function( x, y ) {
            for( var idx in self._eyes ) {
                self._eyes[idx].render( x, y );
            }
        }
        
        this._resize = function() {
            for( var idx in self._eyes ) {
                self._eyes[idx].moveToPosition();
            }
        }
                
        this._init = function( callback ) {
            self.templateObject = document.createElement("object");
            self.templateObject.style.display  = "none";
            self.templateObject.style.position = "absolute";            
            
            self.templateObject.innerHTML = SVG_HTML_TEMPLATE;
            
            document.body.appendChild( self.templateObject );
            
            self._listen();
            
            self.isInitialized = true;
        },
            
        this._cloneTemplate = function() {
            return self.templateObject.cloneNode(true);
        }
        
    })(); 
    
})();