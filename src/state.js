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

