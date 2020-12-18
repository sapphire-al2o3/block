const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gl = document.getElementById('screen').getContext('webgl');

const Screen = {
    w: canvas.width,
    h: canvas.height
};

const display = new Display(gl);

Input.bind();

const player = {
    x: 0,
    y: 0,
    w: 16,
    h: 2,
    vx: 0,
    vy: 0
};

const ball = {
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    vx: 1,
    vy: 1
};

const Block = {
    X: 320 / 8,
    Y: 160 / 8
};
const blocks = [];

function createBlock(x, y, w, h) {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        life: 1
    };
}

function setup() {
    player.x = (Screen.w - player.w) / 2 ^ 0;
    player.y = 104;

    ball.x = player.x;
    ball.y = player.y - 4;
    ball.vy = -1;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            blocks.push(createBlock(j * 16 + 16, i * 8 + 16, 16, 8));
        }
    }

    // for (let i = 0; i < Block.Y; i++) {
    //     blocks[i] = [];
    //     for (let j = 0; j < Block.X; j++) {
    //         blocks[i][j] = 0;
    //     }
    // }
}

function drawBlock(block) {
    if (block.life > 0) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(block.x, block.y, block.w - 1, block.h - 1);
        ctx.fillStyle = '#444';
        ctx.fillRect(block.x, block.y + block.h - 1, block.w, 1);
        ctx.fillRect(block.x + block.w - 1, block.y, 1, block.h);
    }
}

function drawPlayer() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(player.x ^ 0, player.y ^ 0, player.w, player.h);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer();

    for (let i = 0; i < blocks.length; i++) {
        drawBlock(blocks[i]);
    }

    ctx.fillStyle = '#FFF';
    ctx.fillRect(ball.x ^ 0, ball.y ^ 0, ball.w, ball.h);

    for (let p of particles) {
        if (p.life > 0) {
            ctx.fillRect(p.x ^ 0, p.y ^ 0, 1, 1);
        }
    }
}



function update(deltaTime) {

    const vx = Input.getAxisX() * 0.5;
    const vy = Input.getAxisY() * 0.5;

    const px = player.x;
    const py = player.y;

    if (vx === 0) {
        player.vx = 0;
    }
    if (vy === 0) {
        player.vy = 0;
    }
    player.vx = clamp(player.vx + vx, -4, 4);
    player.vy = clamp(player.vy + vy, -4, 4);

    player.x += player.vx;
    player.y += player.vy;

    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.w >= Screen.w) player.x = Screen.w - player.w;
    if (player.y + player.h >= Screen.h) player.y = Screen.h - player.h;

    ball.x += ball.vx;
    ball.y += ball.vy;

    let hitWall = false;

    const Shake = 4;
    const ShakeTime = 0.2;

    if (ball.x < 0) {
        ball.x = 0;
        ball.vx *= -1;
        hitWall = true;
        display.shake(ShakeTime, Shake, 0);
    }

    if (ball.y < 0) {
        ball.y = 0;
        ball.vy *= -1;
        hitWall = true;
        display.shake(ShakeTime, 0, Shake);
    }

    if (ball.x + ball.w >= Screen.w) {
        ball.x = Screen.w - ball.w;
        ball.vx *= -1;
        hitWall = true;
        display.shake(ShakeTime, Shake, 0);
    }

    if (ball.y + ball.h >= Screen.h) {
        ball.y = Screen.h - ball.h;
        ball.vy *= -1;
        hitWall = true;
        display.shake(ShakeTime, 0, Shake);
    }

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].life > 0 && rectToPoint(blocks[i], ball)) {
            ball.vy *= -1;
            blocks[i].life = 0;
        }
    }

    

    if (rectToPoint(player, ball)) {
        ball.vy *= -1;
        ball.vx = clamp(ball.vx + player.vx * 0.25, -2, 2);
    }



    if (hitWall) {
        createParticles(ball.x, ball.y, 30);
    }

    updateParticles();
    display.update(deltaTime);
}

let time = Date.now();

function mainloop() {
    const now = Date.now();
    const deltaTime = now - time;
    time = now;
    Input.update();
    
    update(deltaTime);
    draw();

    display.draw(canvas);

    requestAnimationFrame(mainloop);
}

setup();
mainloop();

