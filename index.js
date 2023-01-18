// Cross-browser, polyfilled 60fps requestAnimationFrame implementation.
(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Background canvas.
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight;

// Stars & shooting stars.
var entities = [];

// Set canvas size.
function setCanvas() {
    width = window.innerWidth;
    height = document.body.offsetHeight;
    (height < 400) ? height = 400 : height;
    background.width = width;
    background.height = height;
    bgCtx.fillRect(0, 0, width, height);
}

// Create entities.
function createStars() {
    for (var i = 0; i < height; i++) {
        entities.push(new Star({
            x: Math.random() * width,
            y: Math.random() * height
        }));
    }
}

// Create 2 cycling shooting stars.
function createShootingStars() {
    entities.push(new ShootingStar());
    entities.push(new ShootingStar());
}

// Animate entities
function animate() {
    bgCtx.fillStyle = '#110E19';
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.strokeStyle = '#ffffff';

    var entLen = entities.length;

    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}

function start() {
    // clear entities so they don't multiply on resize
    entities = [];

    var jobs = [setCanvas, createStars, createShootingStars, animate];
    while (jobs.length) {
        jobs.shift().call();
    }
}

window.onresize = start;

function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = width;
    this.y = Math.random() * height;
}

Star.prototype.update = function () {
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) + 0.1;
    // this is used so the shooting stars arent constant
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function () {
    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

start();

// Back to top button
var main = document.getElementById("main");
main.addEventListener("scroll", (event) => {
    var scrollToTopButton = document.getElementById("section-up");
    if (main.scrollTop > 200) {
        scrollToTopButton.style.opacity = 1;
        scrollToTopButton.style.cursor = "pointer";
        
    } else {
        scrollToTopButton.style.opacity = 0;
        scrollToTopButton.style.cursor = "default";
    }
});

function backToTop() {
    main.scrollTop = 0
}
