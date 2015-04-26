(function() {  
    
    var EYES_COUNT = 0;
    
    var Eye = function( imageSelector, options ) { 
        var self = this;
        
        // Create uniq id
        this._id = EYES_COUNT;
        EYES_COUNT += 1;
        
        // Is ready for render
        this.isReady = false;
        
        this.iamageSelector = imageSelector;

        this._element = document.querySelector( imageSelector );

        if ( !this._element ) {
            throw new Error("Not valid image selector");
            return;
        }        
        
        // Default options
        this.options = {
            "x" : 0,
            "y" : 0,
            "size" : 50
        };

        // Replace default optinos
        for( var key in options ) {
            this.options[key] = options[key];
        };             
        
    }
    
    Eye.prototype.build = function() {
        var self = this;
        
        // Create Eye copy in HTML
        var template       = document.querySelector("#paranoiajs-eye-template");
        this.cloneEyeObject = template.cloneNode(true);
        this.cloneEyeObject.style.display = "block";
        this.cloneEyeObject.setAttribute( "id", "paranoiajs-eye-" + this._id );
        
        document.body.appendChild( this.cloneEyeObject );
        
        this.cloneEyeObject.addEventListener("load",function(){
            self.eye = self.cloneEyeObject.contentDocument;
            
            self.eye.querySelector("svg").setAttribute("width" , self.options["size"]);
            self.eye.querySelector("svg").setAttribute("height", self.options["size"]);
            
            self.isReady = true;
            
            self.moveToPosition();            
            
        }, false);
    }
    
    Eye.prototype.moveToPosition = function() {   
        if ( !this.isReady ) return;
        
        this.move( this.options["x"], this.options["y"] );   
    }
        
    // Relactive to parent image
    Eye.prototype.move = function( x, y ) {
        var parentPostion = this._element.getBoundingClientRect();        
        
        this.cloneEyeObject.style.position = "absolute";
        this.cloneEyeObject.style.left = parentPostion["left"] + x + "px";
        this.cloneEyeObject.style.top  = parentPostion["top"]  + y + "px";
    }
    
    Eye.prototype.moveApple = function( x, y ) {       
        var apple = this.eye.querySelector("#apple");
        
        var cloneEyeObjectPos = this.cloneEyeObject.getBoundingClientRect();
        
        apple.setAttribute( "cx", parseInt(x) - parseInt( cloneEyeObjectPos.left ) );
        apple.setAttribute( "cy", parseInt(y) - parseInt( cloneEyeObjectPos.top ) );        
    }
    
    Eye.prototype.render = function( x2, y2 ) {
        if ( !this.isReady ) return;
        
        var r = 50;        
       
        var svg    = this.eye.querySelector("svg");
        var apple  = this.eye.querySelector("#apple");
        
        var cloneEyeObjectPos = this.cloneEyeObject.getBoundingClientRect();
        var applePosition = apple.getBoundingClientRect();
        
        var appleX = applePosition.left;
        var appleY = applePosition.top;        
        
        var matrix = apple.getCTM();

        // transform a point using the transformed matrix
        var position = svg.createSVGPoint();
        position.x = apple.getAttribute("cx");
        position.y = apple.getAttribute("cy");
        position = position.matrixTransform(matrix);               
        
        var x1 = parseInt( cloneEyeObjectPos.left ) + parseInt( cloneEyeObjectPos.width )/2;
        var y1 = parseInt( cloneEyeObjectPos.top )  + parseInt( cloneEyeObjectPos.height )/2; 
        
        //document.querySelector("#marker").style.left = x1 + "px";
        //document.querySelector("#marker").style.top  = y1 + "px";
        
        var angle = Math.atan2( y2 - y1, x2 - x1 ) * (180/Math.PI) ;

        /*
        var xr1 = x1 + r*Math.cos(t);
        var yr1 = y1 + r*Math.sin(t)
        
        this.moveApple( xr1, yr1 );
        */
        
        var apple = this.eye.querySelector("#apple");
        apple.setAttribute( "transform", "rotate(" + angle + ", 60, 60)" );        
    }
    
    window.ParanoiaJS = new (function() {
        var self = this;
        
        this._eyes = [];
        
        //TODO: add template Eye to HTML
        
        this.listen = function() {
            window.addEventListener("mousemove", function( e ) {
                //console.log(e);
                self._renderEyes( e.x, e.y );
            }, false);
            
            window.addEventListener("resize", function( e ) {
                self._resize();
            }, false);
        }
        
        this.add = function( imageSelector, options ) {
            var eye = new Eye( imageSelector, options );                        
            this._eyes.push( eye );
            
            eye._element.addEventListener("load", function() {                
                self._resize();
            }, false);            
                        
            return eye;
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
        
        this.build = function() {
            for( var idx in self._eyes ) {
                self._eyes[idx].build();
            }
        }
        
        this.listen();
        
    })(); 
    
})();