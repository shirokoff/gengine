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
