const figure = $(".figure");

const screenSize = {
    width: $(window).width(),
    height: $(window).height()
}

// setup
let initialSpeed = 10;

// dynamic
let x = 0;
let y = 0;

let velocity = {
    x: initialSpeed,
    y: 0
};

window.setInterval(() => {
    tick();

}, 50)

window.setInterval(() => {
    fixedUpdate();
}, 1);

function tick() {
    move(figure, velocity)
}

function fixedUpdate() {
    x = figure.css("left").replace("px", "") - 0;
    y = figure.css("top").replace("px", "") - 0;

    if (x >= screenSize.width) {
        onWallCollision("right");
    }
    if (x < 0) {
        onWallCollision("left");
    }
    if (y < 0) {
        onWallCollision("top");
    }
    if (y >= screenSize.height) {
        onWallCollision("bottom");
    }

    figure.css("left", clamp(0, screenSize.width, x))
    figure.css("top", clamp(0, screenSize.height, y))

    $("#debug").text(`X: ${x} Y: ${y}`);
}

function move(figure, velocity) {
    figure.animate({
        left: `+=${velocity.x}`,
        top: `+=${velocity.y}`}, 50, "linear");
}

function onWallCollision(type) {
    if (type === "right") {
        velocity.x = -initialSpeed;
    }
}

function clamp(min, max, val) {
    return Math.max(min, Math.min(max, val))
}