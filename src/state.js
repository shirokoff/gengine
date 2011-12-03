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

