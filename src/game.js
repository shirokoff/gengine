
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();

function Game(screen){

    var _this = this;

    this.tickRate = 60;
    this.activeState;
    this.lastTickTime;
    this.imageCache = {};

    /* --------------- Init canvas ----------------- */
    var canvas = document.querySelector('#' + screen);
    this.screen = canvas.getContext('2d');
    if (!this.screen) {
        alert("Can't get 2d context");
    }

    this.screenWidth = canvas.getAttribute("width");
    this.screenHeight= canvas.getAttribute("height");

    this.backBuffer = document.createElement("canvas");
    this.backBuffer.setAttribute("width", this.screenWidth);
    this.backBuffer.setAttribute("height", this.screenHeight);
    this.bscreen = this.backBuffer.getContext("2d");

    /* --------------- Init keyboard ----------------- */

    this.keys = [];

    document.addEventListener(
        "keydown",
        function(e){
            _this.keys[e.which] = true;
        },
        false
    );

    document.addEventListener(
        "keyup",
        function(e){
            _this.keys[e.which] = false;
        },
        false
    );

    canvas.addEventListener(
        "mousedown",
        function(e) {
            _this.mouse(e);
        }
    );

    canvas.addEventListener(
        "mouseup",
        function(e) {
            _this.mouse(e);
        }
    );

    /* --------------- Init stetes----------------- */

    this.states = {
        //"state1" : new GameState_1(this),
        //"state2" : new GameState_2(this)

        "state1" : new CometState(this)
    };

    this.setState("state1");

    /* --------------- Init start ----------------- */

    this.nextTickTimeout = 1000 / this.tickRate << 0;

    this.startLoop();
    this.animate();
}

Game.prototype.animate = function(){
    var _this = this;

    if (this.end) {
        return;
    }

    window.requestAnimFrame(function(){_this.animate();});
    this.render();
}

Game.prototype.setState = function(state){
    this.activeState = this.states[state];
};

Game.prototype.render = function(){

    // clear screen
    this.screen.clearRect(0, 0, this.screenWidth, this.screenHeight);

    // put image from buffer to screen
    this.screen.drawImage(this.backBuffer, 0, 0);

    // clear backbuffer
    this.bscreen.clearRect(0, 0, this.screenWidth, this.screenHeight);

    // draw scene to backbuffer
    this.activeState.render();
};

Game.prototype.keyboard = function(){
    this.activeState.keyboard();
};

Game.prototype.mouse = function(e){
    this.activeState.mouse(e);
};

Game.prototype.startLoop = function(){
    this.lastTickTime = Date.now();
    this.loop();
};

Game.prototype.endLoop = function(){
    this.end = true;
};

Game.prototype.loop = function(){
    var _this = this;

    if (this.end) {
        return;
    }

    // Do all the stuff
    this.tick();

    setTimeout(
        function(){
            _this.loop();
        },
        1000 / this.tickRate << 0
    );

    //var now = Date.now();
    //var timeout = this.nextTickTimeout - (now - this.lastTickTime);
    //timeout = timeout < 0 ? 0 : timeout;
    //this.lastTickTime = now;

    //setTimeout(
    //    function(){
    //        _this.loop();
    //    },
    //    timeout
    //);
};

Game.prototype.tick = function(){
    this.activeState.tick();
};

Game.prototype.load = function(src){

    if (this.imageCache[src]) {
        return this.imageCache[src];
    }

    var i = new Image();
    i.src = src;
    this.imageCache[src] = i;
    return i;
}

include("animatedsprite.js");
include("keyboard.js");
include("sprite.js");
include("state.js");

//include("state_1.js");
include("comet_state.js");

include("particle.js");
