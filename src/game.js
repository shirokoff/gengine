function Game(screen){

    var _this = this;

    this.backBuffer;
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

    /* --------------- Init keyboard ----------------- */

    this.keys = [];

    document.addEventListener(
        "keydown",
        function(e){
            console.log(e.which);
            _this.keys[e.which] = true;
        }
    );

    document.addEventListener(
        "keyup",
        function(e){
            _this.keys[e.which] = false;
        }
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
    this.screen.fillStyle = "rgb(255,255,255)";
    this.screen.fillRect(0, 0, this.screenWidth, this.screenHeight);

    this.activeState.render(this.screen);
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
    this.x = 0;
    this.y = 0;
}

GameState_1.prototype = new GameState();

GameState_1.prototype.render = function(){
    var x = this.x;
    var y = this.y;
    var screen = this.game.screen;
    screen.fillStyle="rgb(255,0,0)";
    screen.fillRect(x, y, 20, 20);
};

GameState_1.prototype.tick= function(){
    if (this.game.keys[51]) {
        this.game.setState("state2");
    }

    if (this.game.keys[39]) {
        this.x += 3;
    }

    if (this.game.keys[37]) {
        this.x -= 3;
    }

    if (this.game.keys[38]) {
        this.y -= 3;
    }

    if (this.game.keys[40]) {
        this.y += 3;
    }
};

/* ----------------- GameState_2 --------------------- */

function GameState_2(game){
    this.game = game;
};

GameState_2.prototype = new GameState();

GameState_2.prototype.render = function(){
    var screen = this.game.screen;
    screen.fillStyle="rgb(0,255,0)";
    screen.fillRect(100,100,200,200);
}

GameState_2.prototype.tick= function(){
    if (this.game.keys[51]) {
        this.game.setState("state1");
    }
};

/* ----------------- Keyboard ---------------------- */

function Keyboard() {};

//Keyboard.prototype.

