
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

/* ----------------- Animated Sprite --------------- */

function AnimatedSprite(o){
    this.img = o.img;
    this.width = o.width;
    this.height = o.height;
    this.x = o.x;
    this.y = o.y;

    this.imageWidth  = this.img.width;
    this.imageHeight = this.img.height;

    // Number of vertically aligned frames
    this.frames = (this.imageHeight / this.height) << 0;
}

Sprite.prototype.draw = function(ctx){
    var frame = 0;
    ctx.drawImage(this.img, this.x, this.y);
};

/* ----------------- Keyboard ---------------------- */

function Keyboard() {};

//Keyboard.prototype.



/* ----------------- Sprite ------------------------ */

function Sprite(o){

    this.img = o.img;

    this.width = o.width;
    this.height = o.height;

    this.rotate = o.rotate || 0;
    this.scale = o.scale || 1;

    this.pivot = o.pivot;

    this.x = o.x;
    this.y = o.y;
}

Sprite.prototype.draw = function(ctx){

    var transformed = this.scale != 1 || this.rotate != 0;
    var x = this.x;
    var y = this.y;

    if (transformed) {
        x = 0;
        y = 0;
    }

    if (this.pivot === "center") {
        x -= this.width / 2;
        y -= this.height / 2;
    }

    // Transformations applied
    if (transformed) {
        ctx.save();

        ctx.translate(this.x, this.y);

        if (this.rotate != 0) {
            ctx.rotate(this.rotate);
        }

        if (this.scale != 1) {
            ctx.scale(this.scale, this.scale);
        }

        ctx.drawImage(this.img, x, y);

        ctx.restore();
    } else {
        ctx.drawImage(this.img, x, y);
    }
};

/* ----------------- GameState ----------------------- */

function GameState(game){
    this.game = game;
}

GameState.prototype.render = function(){};

GameState.prototype.keyboard = function(){};

GameState.prototype.mouse = function(){};

GameState.prototype.tick = function(){};

/* ----------------- GameState ----------------------- */


///* ----------------- GameState_1 --------------------- */

function GameState_1(game){
    this.game = game;
    //this.x = 0;
    //this.y = 0;

    this.objects = [];

    var size = 200;

    for (var i = 0; i < size; i++) {
        this.objects.push(new Sprite({img : document.getElementById("sprite1"), x : 100, y : 100, width : 16, height : 16, scale : (1 + Math.sin(Math.PI * i / (size / 2))) , pivot : "center" }));
        //this.objects.push(new Sprite({img : document.getElementById("sprite1"), x : 10, y : 10, width : 16, height : 16}));
    }
}

GameState_1.prototype = new GameState();

GameState_1.prototype.render = function(){
    var x = this.x;
    var y = this.y;
    var screen = this.game.bscreen;
    //screen.fillStyle="rgb(255,0,0)";
    //screen.fillRect(x, y, 20, 20);

    for (var i = this.objects.length - 1; i >= 0; i--) {
    //for (var i =  0; i < this.objects.length; i++) {
        this.objects[i].draw(screen);
    }
};

GameState_1.prototype.tick= function(){
    if (this.game.keys[51]) {
        this.game.setState("state2");
    }

    var x = this.objects[0].x;
    var y = this.objects[0].y;

    if (this.game.keys[39]) {
        x += 1;
    }

    if (this.game.keys[37]) {
        x -= 1;
    }

    if (this.game.keys[38]) {
        y -= 1;
    }

    if (this.game.keys[40]) {
        y += 1;
    }

    this.objects.unshift(this.objects.pop());

    this.objects[0].x = x;
    this.objects[0].y = y;
};

/* ----------------- GameState_2 --------------------- */

function GameState_2(game){
    this.game = game;
};

GameState_2.prototype = new GameState();

GameState_2.prototype.render = function(){
    var screen = this.game.bscreen;
    screen.fillStyle="rgb(0,255,0)";
    screen.fillRect(100,100,200,200);
};

GameState_2.prototype.tick= function(){
    if (this.game.keys[51]) {
        this.game.setState("state1");
    }
};


function CometState(game){
    this.game = game;

    this.cometSprite = new Sprite({img : game.load("i/circle.png"), x : 100, y : 100, width : 16, height : 16, pivot : "center" });

    this.cometSpeed = [0, 0];


    this.planets = [
        { x : 100, y : 100, size : 1, img : 2 },
        { x : 500, y : 300, size : 2, img : 1 },
        { x : 200, y : 380, size : 2, img : 1 },
        { x : 600, y : 550, size : 2, img : 2 }
    ]

    for (var i = 0; i < this.planets.length; i++) {
        this.planets[i].sprite = new Sprite({img : game.load("i/asteroid_00" + this.planets[i].img + ".png"), x : this.planets[i].x, y : this.planets[i].y, width : 128, height : 128, pivot : "center", scale : this.planets[i].size/4});
    }

    this.planetSize = 16;
    this.rocketSize = 16;
}

CometState.prototype = new GameState();

CometState.prototype.render = function(){
    var x = this.x;
    var y = this.y;
    var screen = this.game.bscreen;


    for (var i = 0; i < this.planets.length; i++) {

        this.planets[i].sprite.rotate += 0.001 / this.planets[i].size;
        this.planets[i].sprite.draw(screen);
    }

    if (this.cometOrigin) {
        this.cometSprite.draw(screen);
    }
};

CometState.prototype.tick= function(){

    if (!this.started) {
        return;
    }

    var comet = this.cometSprite;

    comet.x += this.cometSpeed[0];
    comet.y += this.cometSpeed[1];

    var comet = this.cometSprite;

    for (var i = 0; i < this.planets.length; i++) {
        var planet = this.planets[i];
        var dist = Math.sqrt( Math.pow((comet.x - planet.x) ,2) + Math.pow((comet.y - planet.y), 2));
        var influence = (Math.pow(planet.size, 2) / dist) * (window.k || 5);

        // Collision
        if (dist <= planet.size * this.planetSize + this.rocketSize / 2) {
            delete this.cometOrigin;
            this.started = false;
        }

        this.cometSpeed[0] += ((planet.x - comet.x) / dist) * influence;
        this.cometSpeed[1] += ((planet.y - comet.y) / dist) * influence;
    }

    if (comet.x + this.rocketSize/2 > this.game.screenWidth) {
        this.cometSpeed[0] *= -1;
        comet.x = this.game.screenWidth - this.rocketSize/2 - 1;

    }

    if (comet.x < this.rocketSize/2) {
        this.cometSpeed[0] *= -1;
        comet.x = this.rocketSize/2 + 1;
    }

    if (comet.y + this.rocketSize/2 > this.game.screenHeight) {
        this.cometSpeed[1] *= -1;
        comet.y = this.game.screenHeight - this.rocketSize/2 - 1;
    }

    if (comet.y < this.rocketSize/2) {
        this.cometSpeed[1] *= -1;
        comet.y = this.rocketSize/2 + 1;
    }
};

CometState.prototype.mouse = function(e) {

    if (e.type == "mousedown") {
        this.cometOrigin = [e.clientX, e.clientY];
        this.cometSprite.x = this.cometOrigin[0];
        this.cometSprite.y = this.cometOrigin[1];
        this.started = false;
    }

    if (e.type == "mouseup" && this.cometOrigin) {
        this.started = true;

        this.cometSpeed[0] = (this.cometOrigin[0] - e.clientX) / 30;
        this.cometSpeed[1] = (this.cometOrigin[1] - e.clientY) / 30;
    }
}


ParticleSystem = function(){


}



