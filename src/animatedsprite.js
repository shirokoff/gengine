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
