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
