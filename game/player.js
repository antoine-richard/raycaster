const WALK_FACTOR = 2
const ROTATION_FACTOR = 0.5;

function Player(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.paces = 0;
}

Player.prototype.rotate = function (angle) {
    this.direction = (this.direction + angle + CIRCLE) % (CIRCLE);
};

Player.prototype.walk = function (distance, map) {
    var dx = Math.cos(this.direction) * distance;
    var dy = Math.sin(this.direction) * distance;
    if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
    if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
    this.paces += distance;
};

Player.prototype.update = function (controls, map, seconds) {
    if (controls.left) this.rotate(-Math.PI * seconds * ROTATION_FACTOR);
    if (controls.right) this.rotate(Math.PI * seconds * ROTATION_FACTOR);
    if (controls.forward) this.walk(WALK_FACTOR * seconds, map);
    if (controls.backward) this.walk(-WALK_FACTOR * seconds, map);
};