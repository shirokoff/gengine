try {
    log = console ? console.log : function(p){alert(p)};
} catch(e) {
    alert(e.message);
}

function Game(screen){

    var _this = this;

    this.activeState;
    this.frameRate = 60;
    this.lastTickTime;


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
            log(e.which);
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

    /* --------------- Init stetes----------------- */

    this.states = {
        "state1" : new GameState_1(this),
        "state2" : new GameState_2(this)
    };

    this.setState("state1");

    /* --------------- Init start ----------------- */

    this.nextTickTimeout = 1000 / this.frameRate << 0;

    this.startLoop();
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

Game.prototype.mouse = function(){
    this.activeState.mouse();
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
    this.render();
    this.tick();

    var now = Date.now();
    var timeout = this.nextTickTimeout - (now - this.lastTickTime);
    timeout = timeout < 0 ? 0 : timeout;
    this.lastTickTime = now;

    setTimeout(
        function(){
            _this.loop();
        },
        timeout
    );
};

Game.prototype.tick = function(){
    this.activeState.tick();
};

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
    this.x = o.x;
    this.y = o.y;
}

Sprite.prototype.draw = function(ctx){
    ctx.drawImage(this.img, this.x, this.y);
};

/* ----------------- GameState ----------------------- */

function GameState(game){
    this.game = game;
}

GameState.prototype.render = function(){};

GameState.prototype.keyboard = function(){};

GameState.prototype.mouse = function(){};

GameState.prototype.tick = function(){};

/* ----------------- GameState_1 --------------------- */

function GameState_1(game){
    this.game = game;
    //this.x = 0;
    //this.y = 0;

    this.objects = [];

    for (var i = 0; i < 300; i++) {
        this.objects.push(new Sprite({img : document.getElementById("sprite1"), x : 10, y : 10}));
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
        x += 3;
    }

    if (this.game.keys[37]) {
        x -= 3;
    }

    if (this.game.keys[38]) {
        y -= 3;
    }

    if (this.game.keys[40]) {
        y += 3;
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


