
function Background(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.STARS_PANORAMA_WIDTH = this.width * 3;
    this.randomizeStars();
}

Background.prototype.randomizeStars = function () {
    const nbStars = Math.floor(Math.random() * 100);
    this.stars = [];
    for (var i = 0; i < nbStars; i++) {
        this.stars.push({
            x: Math.floor(Math.random() * this.STARS_PANORAMA_WIDTH),
            y: Math.floor(Math.random() * this.height * 0.45), // we stop close to the horizon (0.5)
            alpha: Math.random()
        });
    }
}

Background.prototype.render = function (direction) {
    this.renderBackground();
    this.renderStars(direction);
}

Background.prototype.renderBackground = function () {
    this.ctx.save();
    var gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, 'black'); // zenith
    gradient.addColorStop(0.5, BG_COLOR); // horizon
    gradient.addColorStop(1, FG_COLOR); // nadir
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
}

Background.prototype.renderStars = function (direction) {
    this.ctx.save();
    var offset = direction / CIRCLE * -this.STARS_PANORAMA_WIDTH;
    this.ctx.fillStyle = 'white';
    for (let star of this.stars) {
        this.ctx.globalAlpha = star.alpha;
        this.ctx.fillRect(offset + star.x, star.y, 1, 1);
        if (offset + star.x < this.width) {
            this.ctx.fillRect(offset + star.x + this.STARS_PANORAMA_WIDTH, star.y, 1, 1);
        }
    }
    this.ctx.restore();
}