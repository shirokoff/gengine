/* ----------------- Sprite ------------------------ */

function Sprite(o){

    this.img = o.img;

    this.width = o.width;
    this.height = o.height;

    this.rotate = o.rotate || 0;
    this.scale = o.scale || 1;

    this.x = o.x;
    this.y = o.y;
}

Sprite.prototype.draw = function(ctx){

    var localX = this.width / 2 * this.scale << 0;
    var localY = this.height / 2 * this.scale << 0;

    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotate);
    ctx.scale(this.scale, this.scale);

    ctx.drawImage(this.img, -this.width / 2, -this.height / 2);

    ctx.restore();
};
