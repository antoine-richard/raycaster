function Camera(canvas, focalLength) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width = window.innerWidth * 0.5;
    this.height = canvas.height = window.innerHeight * 0.5;
    this.resolution = MOBILE ? 160 : 320;
    this.spacing = this.width / this.resolution;
    this.focalLength = focalLength || 0.8;
    this.range = MOBILE ? 8 : 14;
    this.scale = (this.width + this.height) / 1200;
    this.background = new Background(this.ctx, this.width, this.height);
}

Camera.prototype.render = function (player, map) {
    this.background.render(player.direction);
    this.renderColumns(player, map);
};

Camera.prototype.renderColumns = function (player, map) {
    this.ctx.save();
    for (var column = 0; column < this.resolution; column++) {
        var x = column / this.resolution - 0.5;
        var angle = Math.atan2(x, this.focalLength);
        var ray = map.cast(player, player.direction + angle, this.range);
        var walls = this.filterVisibleWalls(ray);
        this.renderColumn(column, walls, angle, map);
    }
    this.ctx.restore();
};

Camera.prototype.filterVisibleWalls = function (ray) {
    var walls = [];
    var hit = -1, lastHeight = 0;
    while (++hit < ray.length) {
        if (ray[hit].height > lastHeight) {
            walls.push(ray[hit]);
            lastHeight = ray[hit].height;
        }
    }
    return walls;
}

Camera.prototype.renderColumn = function (column, walls, angle, map) {
    var texture = map.wallTexture;
    var left = Math.floor(column * this.spacing);
    var width = Math.ceil(this.spacing);
    
    for (var s = walls.length - 1; s >= 0; s--) {
        var step = walls[s];

        var textureX = Math.floor(texture.width * step.offset);
        var wall = this.project(step.height, angle, step.distance);
        
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

        this.ctx.fillStyle = BG_COLOR;
        this.ctx.globalAlpha = 0.75;
        this.ctx.fillRect(left, wall.top, width, wall.height);
    }
};

Camera.prototype.project = function (height, angle, distance) {
    var z = distance * Math.cos(angle);
    var wallHeight = this.height * height / z;
    var bottom = this.height / 2 * (1 + 1 / z);
    return {
        top: bottom - wallHeight,
        height: wallHeight
    };
};