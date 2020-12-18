const Rect = {
};

const length = (v) => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};

const cross = (a, b) => {
    return a.x * b.y - a.y * b.x;
};

const distance2 = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
};

const reflect = (x, y) => {

};

const rectToPoint = (r, p) => {
    return p.x >= r.x && p.y >= r.y && p.x <= r.x + r.w && p.y <= r.y + r.h;
};

const segToSeg = (sx0, sy0, ex0, ey0, sx1, sy1, ex1, ey1) => {
    // const v0x = 
};

const clamp = (v, min, max) => {
    return v < min ? min : v > max ? max : v;
};

const easeOut = (x) => {
    return 1 - (1 - x) * (1 - x);
};

const easeIn = (x) => {
    return x * x;
};
