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
